-- Migration 020: Launch security fix-pack (launch plan Phase 0.2 + 0.3)
--
-- Closes two classes of hole that Phase 0.5 confirmed exploitable against the
-- live project on 2026-08-07 (6 of 7 probes succeeded):
--
--   0.2 ADMIN ESCALATION -- handle_new_user() minted a team_members row with
--       role 'admin' for any signup whose client-supplied
--       raw_user_meta_data.account_type was not exactly 'customer'. Since that
--       metadata comes straight from supabase.auth.signUp() on the browser,
--       anyone could POST /auth/v1/signup with {"data":{"account_type":"team"}}
--       and land an admin row -- before email confirmation, no less. Every
--       is_admin() RLS policy in the project trusted that row.
--
--   0.3 SELF-GRANT -- `authenticated` held table-wide UPDATE/INSERT on chatbots
--       and customers, and the RLS policies only constrain WHICH ROW you touch,
--       never WHICH COLUMN. A customer could PATCH their own chatbot to
--       credits_purchased = 999999, flip every paid feature_unlocks flag on,
--       zero out messages_used, or set customers.extra_chatbot_slots = 99 --
--       directly against PostgREST, no app route involved. The same trick works
--       at INSERT time (create a chatbot pre-loaded with credits). The chatbot
--       limit was enforced only in the /portal/chatkit/new page component, so a
--       raw INSERT sailed past it.
--
-- After this migration, mutating any money-bearing column requires the service
-- role, i.e. it has to go through an app route we control.

-- ============================================================
-- 1. TEAM INVITES -- the only path into team_members
-- ============================================================
-- Rows here are written by the service role or an existing admin. A signup is
-- promoted to staff only if its email was invited first, and the role comes
-- from THIS table, never from user metadata.

create table if not exists team_invites (
  email text primary key,
  role text not null default 'engineer'
    check (role in ('admin', 'engineer', 'viewer')),
  invited_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  accepted_by uuid references auth.users(id) on delete set null
);

comment on table team_invites is
  'Invite allow-list for staff signups. handle_new_user() consults this; without a matching unaccepted row a signup becomes a customer. Insert only as service role / admin.';

alter table team_invites enable row level security;

drop policy if exists "Admins manage team invites" on team_invites;
create policy "Admins manage team invites"
  on team_invites for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- anon has no business here at all.
revoke all on table team_invites from anon;

-- ============================================================
-- 2. handle_new_user() -- invite-gated, metadata no longer trusted
-- ============================================================
-- Changes vs 006:
--   * account_type / role from raw_user_meta_data are IGNORED for the staff
--     decision. Only a matching team_invites row can create a team_members row.
--   * Default is now `customers`, not `team_members` -- fail closed.
--   * search_path is pinned (a security definer function without it is itself
--     an escalation vector: a caller-controlled search_path can shadow the
--     unqualified names this body resolves).

create or replace function public.handle_new_user()
  returns trigger
  language plpgsql
  security definer
  set search_path = public, pg_temp
  as $$
  declare
    invite public.team_invites%rowtype;
  begin
    select * into invite
      from public.team_invites
      where lower(email) = lower(new.email)
        and accepted_at is null;

    if found then
      insert into public.team_members (id, full_name, role)
      values (
        new.id,
        coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        invite.role
      )
      on conflict (id) do nothing;

      update public.team_invites
        set accepted_at = now(), accepted_by = new.id
        where email = invite.email;
    else
      insert into public.customers (id, email, full_name, signup_source)
      values (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'signup_source'
      )
      on conflict (id) do nothing;
    end if;

    return new;
  end;
  $$;

-- Pin search_path on the other two security definer functions for the same
-- reason (bodies unchanged).
create or replace function public.is_admin()
  returns boolean
  language sql
  security definer
  stable
  set search_path = public, pg_temp
  as $$
    select exists (select 1 from public.team_members where id = auth.uid() and role = 'admin')
  $$;

create or replace function public.is_customer()
  returns boolean
  language sql
  security definer
  stable
  set search_path = public, pg_temp
  as $$
    select exists (select 1 from public.customers where id = auth.uid())
  $$;

-- ============================================================
-- 3. COLUMN-LEVEL WRITE GRANTS -- chatbots
-- ============================================================
-- Postgres has no "revoke this one column" when the grant is table-wide: the
-- table-level privilege wins. So drop the table-level grant and re-grant the
-- explicit safe column list. Anything omitted below is service-role-only.
--
-- Withheld on purpose:
--   credits_purchased, messages_used, feature_unlocks -- the billing state
--   owner_id (UPDATE only)                            -- no re-homing a bot
--   id, created_at, updated_at                        -- system columns
--
-- owner_id IS grantable on INSERT because the portal form sets it, and the
-- "Customers manage own chatbots" policy forces it to equal auth.uid().

revoke update, insert on table chatbots from authenticated;

grant update (
  name, client_name, description, type, status, project_id, widget_config
) on table chatbots to authenticated;

grant insert (
  name, client_name, description, type, status, project_id, widget_config, owner_id
) on table chatbots to authenticated;

-- ============================================================
-- 4. COLUMN-LEVEL WRITE GRANTS -- customers
-- ============================================================
-- Only the two profile fields a customer may edit. extra_chatbot_slots and the
-- retired subscription_* / stripe_* columns become service-role-only, which is
-- also what the Phase 2 credit ledger will want.
--
-- INSERT is revoked outright and NOT re-granted: customer rows are created by
-- handle_new_user() (security definer, runs as owner), never by a client.

revoke update, insert on table customers from authenticated;

grant update (full_name, company) on table customers to authenticated;

-- ============================================================
-- 5. COLUMN-LEVEL WRITE GRANTS -- team_members
-- ============================================================
-- The "Users can update their own profile" policy (qual: auth.uid() = id) has
-- no WITH CHECK, so a viewer/engineer could promote themself to admin. Take
-- role, is_active and max_concurrent_projects away from `authenticated`; admins
-- manage those through the service role.

revoke update, insert on table team_members from authenticated;

grant update (full_name, avatar_url, skills) on table team_members to authenticated;

-- SELECT on team_members is admin-only (migration 006), which left a member
-- unable to read even their own row. lib/auth/team.ts needs exactly that read to
-- gate the Command Center on the database instead of on forgeable JWT metadata.
drop policy if exists "Members can view own team row" on team_members;
create policy "Members can view own team row"
  on team_members for select to authenticated
  using (id = auth.uid());

-- ============================================================
-- 6. anon HAS NO WRITE PATH
-- ============================================================
-- RLS already blocked this (no anon policies exist on these tables), but the
-- blanket Supabase grants meant one accidentally permissive policy would be
-- enough. Defense in depth. SELECT is left alone -- it is still RLS-gated.

revoke insert, update, delete on table chatbots from anon;
revoke insert, update, delete on table customers from anon;
revoke insert, update, delete on table team_members from anon;

-- ============================================================
-- 7. CHATBOT LIMIT ENFORCED IN THE DATABASE
-- ============================================================
-- Mirrors lib/portal/plans.ts: chatbotLimit() = BASE_CHATBOT_LIMIT (1) +
-- customers.extra_chatbot_slots. Keep the constant below in sync with that file.
-- Internal bots (owner_id is null) are unaffected.

create or replace function public.enforce_chatbot_limit()
  returns trigger
  language plpgsql
  security definer
  set search_path = public, pg_temp
  as $$
  declare
    base_limit constant integer := 1;  -- lib/portal/plans.ts BASE_CHATBOT_LIMIT
    owned integer;
    allowed integer;
  begin
    if new.owner_id is null then
      return new;
    end if;

    -- Serialize concurrent creates for one owner, otherwise two parallel
    -- requests both read count = 0 and both slip through.
    perform pg_advisory_xact_lock(hashtextextended(new.owner_id::text, 0));

    select count(*) into owned
      from public.chatbots
      where owner_id = new.owner_id;

    select base_limit + greatest(coalesce(extra_chatbot_slots, 0), 0)
      into allowed
      from public.customers
      where id = new.owner_id;

    allowed := coalesce(allowed, base_limit);

    if owned >= allowed then
      raise exception
        'Chatbot limit reached (% of %). Add a chatbot slot to create another.',
        owned, allowed
        using errcode = 'check_violation';
    end if;

    return new;
  end;
  $$;

drop trigger if exists chatbots_enforce_limit on chatbots;
create trigger chatbots_enforce_limit
  before insert on chatbots
  for each row execute function public.enforce_chatbot_limit();
