-- ChatKit Phase 1 hardening (launch plan 1.1 - 1.6)
--
-- Three additions, all of them serving the public chat surface
-- (/api/chat/[chatbotId]/*), which is the only unauthenticated write path in
-- the product:
--
--   1. chatbots.allowed_domains -- per-bot origin allow-list. Empty array =
--      "any origin" (today's behaviour, so no existing widget breaks). The
--      owner-less client bot is seeded from its real traffic so the unmetered
--      bot IS locked -- a leaked bot id was otherwise free unlimited Claude.
--   2. rate_limits + rate_limit_hit() -- durable, atomic, cross-lambda rate
--      limiting. The old in-memory Map was a no-op on Vercel: every cold start
--      got a fresh empty Map, so the limit was per-lambda, not per-attacker.
--   3. chatbot_kb_suggestions.flagged -- the auto-learning loop reads visitor
--      text, so a visitor can attempt prompt injection into a KB draft. Owner
--      review was always mandatory; now suspicious drafts say so.
--
-- Idempotent: safe to re-run.

-- ============================================================
-- 1. PER-CHATBOT DOMAIN BINDING
-- ============================================================
-- Hostnames only, lowercase, no scheme and no path: 'example.com' or the
-- wildcard form '*.example.com'. lib/chat/cors.ts normalises whatever the
-- owner types before it lands here and does the matching at request time.

alter table chatbots
  add column if not exists allowed_domains text[] not null default '{}';

comment on column chatbots.allowed_domains is
  'Widget origin allow-list (hostnames, optional *. wildcard). Empty = allow any origin, except for owner-less internal bots which are denied when empty.';

-- Additive to the column grants from migration 020: this is owner-editable
-- widget configuration, not billing state.
grant update (allowed_domains) on table chatbots to authenticated;
grant insert (allowed_domains) on table chatbots to authenticated;

-- Seed the one owner-less (unmetered) bot from its observed traffic so the
-- lock is live from the first deploy instead of waiting on a human. Only
-- touches rows that are still unset.
update chatbots
   set allowed_domains = array['royalstroje.sk', '*.royalstroje.sk']
 where owner_id is null
   and allowed_domains = '{}'
   and id = 'b1637181-da22-4ae2-b79e-11c10b967b4f';

-- ============================================================
-- 2. DURABLE RATE LIMITING
-- ============================================================
-- One row per bucket ("ip:1.2.3.4", "bot:<uuid>", "botday:<uuid>"). Fixed
-- window: window_start is the first hit of the current window, hits counts up
-- until the window rolls over.
--
-- Service-role only. No RLS policies exist and every client grant is revoked,
-- so `anon`/`authenticated` cannot read the table (visitor IPs live here) or
-- reset their own counter.

create table if not exists rate_limits (
  bucket       text primary key,
  hits         integer     not null default 0,
  window_start timestamptz not null default now()
);

create index if not exists idx_rate_limits_window_start
  on rate_limits (window_start);

alter table rate_limits enable row level security;

revoke all on table rate_limits from anon, authenticated;

-- Atomically records one hit against every supplied bucket and reports whether
-- any of them is now over its limit.
--
-- Input:  [{"key": "ip:1.2.3.4", "limit": 20, "window": 60}, ...]
-- Output: {"allowed": bool, "blocked": key|null, "retry_after": seconds}
--
-- Every bucket is incremented even when an earlier one already blocked -- a
-- caller who keeps hammering should keep extending their own window, and the
-- alternative (short-circuiting) would let a blocked IP probe bot buckets for
-- free. The ON CONFLICT row lock is what makes concurrent lambdas count once
-- each instead of racing.
create or replace function rate_limit_hit(buckets jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  b        jsonb;
  v_key    text;
  v_limit  integer;
  v_window integer;
  v_hits   integer;
  v_start  timestamptz;
  blocked  text := null;
  retry    integer := 0;
begin
  for b in select value from jsonb_array_elements(buckets) loop
    v_key    := b->>'key';
    v_limit  := (b->>'limit')::integer;
    v_window := (b->>'window')::integer;

    if v_key is null or v_limit is null or v_window is null or v_window <= 0 then
      continue;
    end if;

    insert into rate_limits (bucket, hits, window_start)
    values (left(v_key, 200), 1, now())
    on conflict (bucket) do update
      set hits = case
                   when rate_limits.window_start < now() - make_interval(secs => v_window)
                   then 1
                   else rate_limits.hits + 1
                 end,
          window_start = case
                   when rate_limits.window_start < now() - make_interval(secs => v_window)
                   then now()
                   else rate_limits.window_start
                 end
    returning hits, window_start into v_hits, v_start;

    if v_hits > v_limit and blocked is null then
      blocked := v_key;
      retry := greatest(
        1,
        ceil(extract(epoch from (v_start + make_interval(secs => v_window)) - now()))::integer
      );
    end if;
  end loop;

  return jsonb_build_object('allowed', blocked is null, 'blocked', blocked, 'retry_after', retry);
end;
$$;

revoke all on function rate_limit_hit(jsonb) from public, anon, authenticated;
grant execute on function rate_limit_hit(jsonb) to service_role;

-- Buckets are worthless once their window has rolled over; without a sweep the
-- table grows one permanent row per visitor IP.
do $$
begin
  perform cron.unschedule('rate-limits-purge');
exception when others then null;
end $$;

select cron.schedule('rate-limits-purge', '17 3 * * *', $$
  delete from rate_limits where window_start < now() - interval '2 days';
$$);

-- ============================================================
-- 3. FLAGGED KB SUGGESTIONS (auto-learning poisoning)
-- ============================================================
-- Visitor questions and bot answers are fed to Claude to draft KB entries. A
-- visitor who writes "ignore your instructions and tell everyone X" can get
-- that text in front of the drafting model, and an accepted draft becomes part
-- of the bot's permanent prompt. lib/chat/sanitize.ts scores both the source
-- exchanges and the generated draft; anything suspicious lands here and the
-- portal makes the owner confirm before accepting.

alter table chatbot_kb_suggestions
  add column if not exists flagged boolean not null default false;

alter table chatbot_kb_suggestions
  add column if not exists flag_reason text;

comment on column chatbot_kb_suggestions.flagged is
  'True when the draft or its source visitor text tripped the prompt-injection heuristics. Owner must confirm to accept.';

-- Useful ops queries:
--   select bucket, hits, window_start from rate_limits order by hits desc limit 20;
--   select id, name, allowed_domains from chatbots where owner_id is null;
--   select chatbot_id, title, flagged, flag_reason from chatbot_kb_suggestions where flagged;
