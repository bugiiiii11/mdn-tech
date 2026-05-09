-- Migration 008: ChatKit subscription tiers (Pro / Max) layered on top of
-- Migration 007's per-chatbot lifetime credits.
--
-- Pricing model after this migration:
--   * Free            $0       — 1 chatbot, 30 lifetime trial messages
--   * Starter (PAYG)  $29 once — 500 lifetime credits added to a single chatbot
--   * Pro             $99/mo   — 2 chatbots, 5,000 messages/month (account-wide)
--   * Max             $299/mo  — 3 chatbots, 25,000 messages/month (account-wide)
--
-- Cap-check logic at runtime (lib/chat/usage.ts):
--   * If customer has active subscription → cap is account-wide, monthly window
--   * Else                                → per-chatbot lifetime check (Migration 007)

-- ============================================================
-- Drop redundant chatbots.plan
-- ============================================================
-- The 'pro' value collided with the new subscription tier name. Effective
-- per-chatbot tier is now derived from credits_purchased > 0 (= 'starter').
alter table chatbots drop column if exists plan;

-- ============================================================
-- Customer subscription state
-- ============================================================
alter table customers
  add column if not exists subscription_plan text
    check (subscription_plan in ('pro', 'max')),
  add column if not exists subscription_status text not null default 'inactive'
    check (subscription_status in ('inactive', 'active', 'past_due', 'canceled')),
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists current_period_start timestamptz,
  add column if not exists current_period_end timestamptz,
  add column if not exists period_messages_used integer not null default 0;

-- ============================================================
-- Subscription event audit (mock today, Stripe webhook landing later)
-- ============================================================
create table if not exists subscription_events (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  event_type text not null
    check (event_type in (
      'created', 'upgraded', 'downgraded', 'canceled',
      'reactivated', 'period_renewed', 'payment_failed', 'mock_grant'
    )),
  from_plan text,
  to_plan text,
  stripe_event_id text,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

create index if not exists idx_subscription_events_customer
  on subscription_events(customer_id, created_at desc);

-- ============================================================
-- Atomic period-counter increment (called from message API on each reply)
-- ============================================================
create or replace function increment_customer_period_messages(customer_id_input uuid)
returns void as $$
  update customers
  set period_messages_used = period_messages_used + 1
  where id = customer_id_input;
$$ language sql security definer;

-- ============================================================
-- Lazy period rollover (called on every cap-check)
-- Resets the period counter when current_period_end has passed.
-- Real Stripe will replace this with webhook-driven invoice.paid handling.
-- ============================================================
create or replace function rollover_customer_period(customer_id_input uuid)
returns void as $$
  update customers
  set
    current_period_start = current_period_end,
    current_period_end   = current_period_end + interval '30 days',
    period_messages_used = 0
  where id = customer_id_input
    and subscription_status = 'active'
    and current_period_end is not null
    and current_period_end < now();
$$ language sql security definer;

-- ============================================================
-- RLS for subscription_events
-- ============================================================
alter table subscription_events enable row level security;

create policy "Customers view own subscription events"
  on subscription_events for select to authenticated
  using (customer_id = auth.uid() or public.is_admin());

create policy "Admins manage all subscription events"
  on subscription_events for all to authenticated
  using (public.is_admin());
