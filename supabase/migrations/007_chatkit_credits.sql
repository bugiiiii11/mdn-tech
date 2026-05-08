-- Migration 007: ChatKit per-chatbot lifetime credits + purchase audit
--
-- Pricing model:
--   * Free trial: 50 messages per chatbot, lifetime (not monthly)
--   * Pro pack: $19 = 1,000 credits per chatbot, lifetime, no expiry
--   * Cap = 50 + sum(credits_purchased)
--   * Widget auto-pauses when messages_used >= cap
--
-- Replaces the per-customer monthly model in lib/chat/usage.ts (kept around for
-- signakit/tradekit historical use; chatkit no longer writes to product_usage).

-- ============================================================
-- chatbots: lifetime usage + paid credits + plan flag
-- ============================================================
alter table chatbots
  add column if not exists messages_used integer not null default 0,
  add column if not exists credits_purchased integer not null default 0,
  add column if not exists plan text not null default 'trial'
    check (plan in ('trial', 'pro'));

-- ============================================================
-- chatbot_purchases: audit trail (mock today, Stripe later)
-- ============================================================
create table if not exists chatbot_purchases (
  id uuid primary key default gen_random_uuid(),
  chatbot_id uuid not null references chatbots(id) on delete cascade,
  customer_id uuid not null references customers(id) on delete cascade,
  amount_cents integer not null,
  credits_added integer not null,
  status text not null default 'mock'
    check (status in ('mock', 'pending', 'paid', 'refunded', 'failed')),
  stripe_payment_intent_id text,
  created_at timestamptz default now()
);

create index if not exists idx_chatbot_purchases_chatbot
  on chatbot_purchases(chatbot_id);

create index if not exists idx_chatbot_purchases_customer
  on chatbot_purchases(customer_id);

-- ============================================================
-- Atomic increment (avoids race conditions on concurrent messages)
-- ============================================================
create or replace function increment_chatbot_messages(chatbot_id_input uuid)
returns void as $$
  update chatbots
  set messages_used = messages_used + 1
  where id = chatbot_id_input;
$$ language sql security definer;

-- ============================================================
-- RLS
-- ============================================================
alter table chatbot_purchases enable row level security;

create policy "Customers view own chatbot purchases"
  on chatbot_purchases for select to authenticated
  using (customer_id = auth.uid() or public.is_admin());

create policy "Customers create own chatbot purchases"
  on chatbot_purchases for insert to authenticated
  with check (customer_id = auth.uid());

create policy "Admins manage all purchases"
  on chatbot_purchases for all to authenticated
  using (public.is_admin());
