-- Migration 022: Universal credit bank (launch plan Phase 2.1 + parts of 2.7)
--
-- Credits become the single platform currency, held at ACCOUNT level
-- (customers), not per chatbot. Stripe only ever sells credit packs; feature
-- unlocks and message metering are internal ledger spends. Decisions of
-- 2026-08-06 (see launch plan 2.4/2.4b/2.7):
--
--   * Append-only ledger: `credits_ledger`. Balance = sum(delta). No row is
--     ever updated or deleted; corrections are new rows.
--   * Writes are SERVICE-ROLE ONLY (webhook grants, security-definer spends,
--     logged admin grants). `authenticated` can only SELECT its own rows.
--   * The only path to a NEGATIVE balance is a chargeback clawback row
--     (kind 'chargeback'); spend_credits() refuses overdrafts.
--   * 12-month expiry from purchase: purchase/promo grants carry expires_at.
--     ENFORCEMENT is a later cron that writes negative 'expiry' rows for the
--     unspent remainder (FIFO); nothing expires before mid-2027, so the sweep
--     is deliberately deferred. Balance = plain sum until then.
--   * Signup promo grant: 50 credits (flag-style kind 'promo', excluded from
--     revenue metrics). NUMBER PENDING Martin's confirmation (plan 3.1) --
--     change the constant in handle_new_user() below if he picks another.
--
-- TRANSITION SAFETY: this migration is ADDITIVE. It rolls existing per-chatbot
-- balances up into the ledger (kind 'migration') but does NOT zero
-- chatbots.credits_purchased -- code deployed before this session's build still
-- meters off that column and keeps working. Once the ledger-based build is on
-- prod, a later cleanup migration zeroes/retires credits_purchased (audit
-- history lives in chatbot_purchases). Until then credits_purchased is
-- read-only legacy state; nothing new is written to it.

-- ============================================================
-- 1. credits_ledger -- the append-only account-level ledger
-- ============================================================

create table if not exists credits_ledger (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  -- Positive = grant, negative = spend/clawback. Sign is enforced per kind.
  delta integer not null,
  kind text not null check (kind in (
    -- grants (delta > 0)
    'purchase',      -- paid credit pack (webhook-written; provider_ref set)
    'promo',         -- signup / marketing grant, outside revenue metrics
    'admin',         -- manual grant by staff (note should say why)
    'migration',     -- one-time roll-up of pre-022 per-chatbot balances
    'recredit',      -- failed action refunded in credits, never money (2.7c)
    -- spends / clawbacks (delta < 0)
    'spend_message', -- chatbot reply after free trial (CREDITS_PER_MESSAGE)
    'spend_unlock',  -- one-time feature unlock (plans.ts credit prices)
    'refund',        -- 14-day/zero-used money refund claws the grant back
    'chargeback',    -- dispute reversal; may push the balance negative
    'expiry'         -- 12-month expiry sweep (future cron)
  )),
  constraint credits_ledger_delta_sign check (
    delta <> 0 and
    case when kind in ('purchase', 'promo', 'admin', 'migration', 'recredit')
      then delta > 0 else delta < 0 end
  ),
  -- What the row was about (all optional; spends reference their subject).
  chatbot_id uuid references chatbots(id) on delete set null,
  feature_id text,
  pack_id text,
  -- Money side, for purchase/refund rows only (revenue reporting).
  amount_cents integer,
  -- Payment provider idempotency: 'stripe' + checkout session id today,
  -- 'mock' + random uuid before keys exist, 'ngenius' later.
  provider text,
  provider_ref text,
  -- 12-month expiry stamp on purchase/promo grants (2.7a). Migrated pre-022
  -- balances were sold as never-expiring and stay NULL (grandfathered).
  expires_at timestamptz,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists idx_credits_ledger_customer
  on credits_ledger (customer_id, created_at desc);

-- A provider event may be delivered more than once (Stripe retries webhooks);
-- the second insert must be a silent no-op, not a double grant.
create unique index if not exists idx_credits_ledger_provider_ref
  on credits_ledger (provider, provider_ref)
  where provider_ref is not null;

comment on table credits_ledger is
  'Append-only account-level credit ledger (migration 022). Balance = sum(delta). Writes are service-role only; spend via spend_credits(). Never UPDATE/DELETE rows -- corrections are new rows.';

-- ============================================================
-- 2. RLS + grants -- SELECT own rows, zero client write paths
-- ============================================================

alter table credits_ledger enable row level security;

drop policy if exists "Customers view own credit ledger" on credits_ledger;
create policy "Customers view own credit ledger"
  on credits_ledger for select to authenticated
  using (customer_id = auth.uid() or public.is_admin());

-- Belt and braces on top of RLS (the 020 lesson: table-wide grants + one
-- permissive policy is all it takes).
revoke insert, update, delete on table credits_ledger from authenticated;
revoke all on table credits_ledger from anon;

-- ============================================================
-- 3. credit_balance() -- one definition of "the balance"
-- ============================================================

create or replace function public.credit_balance(p_customer uuid)
  returns bigint
  language sql
  security definer
  stable
  set search_path = public, pg_temp
  as $$
    select coalesce(sum(delta), 0)::bigint
      from public.credits_ledger
      where customer_id = p_customer
  $$;

-- ============================================================
-- 4. spend_credits() -- the only spend path, overdraft-proof
-- ============================================================
-- Serializes per customer (advisory lock, seed 1 -- seed 0 is the chatbot
-- limit lock in 020), checks the balance, inserts the negative row. Raises
-- 'insufficient_credits' when the balance cannot cover the spend; callers map
-- that to HTTP 402. Returns the new balance.

create or replace function public.spend_credits(
  p_customer uuid,
  p_amount integer,
  p_kind text,
  p_chatbot uuid default null,
  p_feature text default null,
  p_note text default null
)
  returns bigint
  language plpgsql
  security definer
  set search_path = public, pg_temp
  as $$
  declare
    balance bigint;
  begin
    if p_amount is null or p_amount <= 0 then
      raise exception 'spend_credits: amount must be positive, got %', p_amount;
    end if;
    if p_kind not in ('spend_message', 'spend_unlock') then
      raise exception 'spend_credits: kind % is not a spend kind', p_kind;
    end if;

    perform pg_advisory_xact_lock(hashtextextended(p_customer::text, 1));

    select coalesce(sum(delta), 0) into balance
      from public.credits_ledger
      where customer_id = p_customer;

    if balance < p_amount then
      raise exception 'insufficient_credits: balance % < %', balance, p_amount
        using errcode = 'check_violation';
    end if;

    insert into public.credits_ledger
      (customer_id, delta, kind, chatbot_id, feature_id, note)
    values
      (p_customer, -p_amount, p_kind, p_chatbot, p_feature, p_note);

    return balance - p_amount;
  end;
  $$;

-- Clients never call these directly; the service role does. (PostgREST exposes
-- functions to whoever has EXECUTE -- default PUBLIC -- so revoke explicitly,
-- then grant service_role back: revoking PUBLIC strips it too, and RLS-bypass
-- does not cover EXECUTE privileges.)
revoke execute on function public.spend_credits(uuid, integer, text, uuid, text, text)
  from public, anon, authenticated;
revoke execute on function public.credit_balance(uuid)
  from public, anon, authenticated;
grant execute on function public.spend_credits(uuid, integer, text, uuid, text, text)
  to service_role;
grant execute on function public.credit_balance(uuid) to service_role;

-- ============================================================
-- 5. One-time roll-up of pre-022 per-chatbot balances
-- ============================================================
-- Remaining per-chatbot credits = credits_purchased minus whatever was consumed
-- beyond the 30-message free trial (FREE_TRIAL_MESSAGES in lib/portal/plans.ts;
-- the trial itself stays per-chatbot and free). Guarded so a re-run cannot
-- double-grant. expires_at stays NULL -- these were sold with "never expire".

insert into credits_ledger (customer_id, delta, kind, note)
select
  c.owner_id,
  sum(greatest(c.credits_purchased - greatest(c.messages_used - 30, 0), 0))::integer,
  'migration',
  'Roll-up of per-chatbot credits_purchased minus post-trial usage (pre-022 model)'
from chatbots c
where c.owner_id is not null
  and not exists (select 1 from credits_ledger l where l.kind = 'migration')
group by c.owner_id
having sum(greatest(c.credits_purchased - greatest(c.messages_used - 30, 0), 0)) > 0;

-- ============================================================
-- 6. handle_new_user() -- add the signup promo grant (2.7f)
-- ============================================================
-- Identical to the 020 version plus one insert: new CUSTOMERS get a 50-credit
-- promo grant (kind 'promo', 12-month expiry). Staff signups get nothing.
-- 50 is the working number from the 2026-08-06 chat; Martin confirms (3.1).

create or replace function public.handle_new_user()
  returns trigger
  language plpgsql
  security definer
  set search_path = public, pg_temp
  as $$
  declare
    invite public.team_invites%rowtype;
    signup_grant constant integer := 50;
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

      if signup_grant > 0 and not exists (
        select 1 from public.credits_ledger
          where customer_id = new.id and kind = 'promo'
      ) then
        insert into public.credits_ledger
          (customer_id, delta, kind, expires_at, note)
        values
          (new.id, signup_grant, 'promo', now() + interval '12 months',
           'Signup promo grant');
      end if;
    end if;

    return new;
  end;
  $$;
