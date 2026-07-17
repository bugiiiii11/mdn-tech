-- ChatKit Auto-Learning (feature id: learning, one-time $49 unlock)
--
-- Loop: visitors chat -> owner rates replies in the conversation viewer
-- (message_feedback, 005) -> weekly cron drafts KB suggestions from the
-- negative ratings -> owner accepts (creates chatbot_kb_entries row) or
-- dismisses on the chatbot detail page.
--
-- Ops prerequisites (one-time, like TechKit's cron secret):
--   1. Vercel env: CHATKIT_CRON_SECRET=<random>
--   2. Vault secret (same value): select vault.create_secret('<random>', 'chatkit_cron_secret');
-- Until both exist the cron fires but the API route rejects it with 401 -- harmless.

-- ============================================================
-- KB SUGGESTIONS
-- ============================================================
create table if not exists chatbot_kb_suggestions (
  id uuid primary key default gen_random_uuid(),
  chatbot_id uuid not null references chatbots(id) on delete cascade,
  title text not null,
  content text not null,
  category text not null default 'general',
  rationale text,                          -- why the AI thinks the KB needs this
  source_message_ids uuid[] not null default '{}',  -- rated messages that triggered it
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'dismissed')),
  kb_entry_id uuid references chatbot_kb_entries(id) on delete set null,  -- set on accept
  created_at timestamptz default now(),
  reviewed_at timestamptz
);

create index if not exists idx_kb_suggestions_chatbot_status
  on chatbot_kb_suggestions (chatbot_id, status, created_at desc);

alter table chatbot_kb_suggestions enable row level security;

-- Owners manage suggestions for their own chatbots (portal). The generation
-- endpoint writes via service role, which bypasses RLS.
create policy "owners manage kb suggestions"
  on chatbot_kb_suggestions for all
  using (exists (
    select 1 from chatbots c
    where c.id = chatbot_id and c.owner_id = auth.uid()
  ))
  with check (exists (
    select 1 from chatbots c
    where c.id = chatbot_id and c.owner_id = auth.uid()
  ));

-- ============================================================
-- CRON -- Sunday 06:00 UTC weekly learning pass
-- ============================================================
do $$
begin
  perform cron.unschedule('chatkit-learning');
exception when others then null;
end $$;

select cron.schedule('chatkit-learning', '0 6 * * 0', $$
  select net.http_post(
    url    := 'https://app.mdntech.org/api/portal/chatkit/learning/run',
    headers:= jsonb_build_object(
                'Content-Type','application/json',
                'Authorization','Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name='chatkit_cron_secret')),
    body   := '{"source":"cron"}'::jsonb,
    timeout_milliseconds := 120000
  );
$$);

-- Useful ops queries:
--   select jobname, schedule, active from cron.job where jobname = 'chatkit-learning';
--   select chatbot_id, title, status, created_at from chatbot_kb_suggestions order by created_at desc limit 20;
