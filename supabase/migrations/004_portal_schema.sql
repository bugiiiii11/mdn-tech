-- Migration 004: Portal schema -- customers, clients, products, usage + owner_id pattern
-- Run in Supabase SQL Editor after 001-003
-- Implements decisions D3, D4, D5 from MIND-PALACE-BRIEFING.md

-- ============================================================
-- CUSTOMERS (portal users -- separate from team_members)
-- ============================================================
create table if not exists customers (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  company text,
  signup_source text
    check (signup_source in ('signakit', 'chatkit', 'tradekit', 'direct')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger customers_updated_at
  before update on customers
  for each row execute function update_updated_at();

-- ============================================================
-- CLIENTS (internal CRM -- businesses we work with)
-- ============================================================
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  status text not null default 'active'
    check (status in ('active', 'inactive', 'archived')),
  subscription_tier text
    check (subscription_tier in ('free', 'starter', 'pro', 'enterprise', 'custom')),
  website text,
  contact_name text,
  contact_email text,
  contact_phone text,
  socials jsonb default '{}',
  notes text,
  customer_id uuid references customers(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger clients_updated_at
  before update on clients
  for each row execute function update_updated_at();

-- ============================================================
-- CUSTOMER PRODUCTS (which products a customer has enabled)
-- ============================================================
create table if not exists customer_products (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  product text not null
    check (product in ('signakit', 'chatkit', 'tradekit')),
  plan text not null default 'free'
    check (plan in ('free', 'starter', 'pro', 'enterprise')),
  status text not null default 'active'
    check (status in ('active', 'paused', 'cancelled')),
  started_at timestamptz default now(),
  cancelled_at timestamptz,
  unique(customer_id, product)
);

-- ============================================================
-- PRODUCT USAGE (free-tier caps + billing inputs)
-- ============================================================
create table if not exists product_usage (
  id bigint generated always as identity primary key,
  customer_id uuid not null references customers(id) on delete cascade,
  product text not null,
  metric text not null,        -- messages|signins|api_calls|signals
  value numeric not null default 0,
  period_start date not null,
  period_end date not null,
  recorded_at timestamptz default now()
);

create index idx_product_usage_customer_period
  on product_usage (customer_id, product, period_start);

-- ============================================================
-- CHATBOTS: add owner_id for customer-owned bots (D5)
-- ============================================================
-- owner_id NULL = internal-managed (existing bots stay unchanged)
-- owner_id NOT NULL = customer-owned ChatKit bot
alter table chatbots
  add column if not exists owner_id uuid references customers(id) on delete cascade;

-- ============================================================
-- HELPER: is_customer() mirrors is_admin()
-- ============================================================
create or replace function public.is_customer() returns boolean
  language sql security definer stable as $$
    select exists (select 1 from customers where id = auth.uid())
  $$;

-- ============================================================
-- REWRITE handle_new_user() -- route to team_members or customers (D3)
-- ============================================================
create or replace function handle_new_user()
returns trigger as $$
begin
  if coalesce(new.raw_user_meta_data->>'account_type', 'team') = 'customer' then
    insert into public.customers (id, email, full_name, signup_source)
    values (
      new.id,
      new.email,
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'signup_source'
    )
    on conflict (id) do nothing;
  else
    insert into public.team_members (id, full_name, role)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
      'admin'
    )
    on conflict (id) do nothing;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- ============================================================
-- RLS for new tables
-- ============================================================
alter table customers enable row level security;
alter table clients enable row level security;
alter table customer_products enable row level security;
alter table product_usage enable row level security;

-- customers: customer sees own row, admins see all
create policy "Customers can view own profile"
  on customers for select to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "Customers can update own profile"
  on customers for update to authenticated
  using (id = auth.uid());

create policy "Admins manage all customers"
  on customers for all to authenticated
  using (public.is_admin());

-- clients: admin-only (internal CRM)
create policy "Admins manage clients"
  on clients for all to authenticated
  using (public.is_admin());

-- customer_products: customer sees own, admins see all
create policy "Customers view own products"
  on customer_products for select to authenticated
  using (customer_id = auth.uid() or public.is_admin());

create policy "Admins manage all customer products"
  on customer_products for all to authenticated
  using (public.is_admin());

-- product_usage: customer sees own, admins see all
create policy "Customers view own usage"
  on product_usage for select to authenticated
  using (customer_id = auth.uid() or public.is_admin());

create policy "Admins manage all usage"
  on product_usage for all to authenticated
  using (public.is_admin());

-- ============================================================
-- REWRITE chatbot RLS -- customers own their bots, admins see all (D5)
-- ============================================================
-- Drop old permissive policies from migration 002
drop policy if exists "Authenticated users can view chatbots" on chatbots;
drop policy if exists "Authenticated users can manage chatbots" on chatbots;

-- Admins see all chatbots; customers see only their own
create policy "Admins manage all chatbots"
  on chatbots for all to authenticated
  using (public.is_admin());

create policy "Customers manage own chatbots"
  on chatbots for all to authenticated
  using (owner_id = auth.uid());

-- KB entries: access follows chatbot ownership
drop policy if exists "Authenticated users can view kb entries" on chatbot_kb_entries;
drop policy if exists "Authenticated users can manage kb entries" on chatbot_kb_entries;

create policy "Admins manage all kb entries"
  on chatbot_kb_entries for all to authenticated
  using (public.is_admin());

create policy "Customers manage own chatbot kb entries"
  on chatbot_kb_entries for all to authenticated
  using (
    exists (
      select 1 from chatbots
      where chatbots.id = chatbot_kb_entries.chatbot_id
        and chatbots.owner_id = auth.uid()
    )
  );

-- Conversations: access follows chatbot ownership
drop policy if exists "Authenticated users can view conversations" on chat_conversations;

create policy "Admins view all conversations"
  on chat_conversations for select to authenticated
  using (public.is_admin());

create policy "Customers view own chatbot conversations"
  on chat_conversations for select to authenticated
  using (
    exists (
      select 1 from chatbots
      where chatbots.id = chat_conversations.chatbot_id
        and chatbots.owner_id = auth.uid()
    )
  );

-- Messages: access follows chatbot ownership
drop policy if exists "Authenticated users can view messages" on chat_messages;

create policy "Admins view all messages"
  on chat_messages for select to authenticated
  using (public.is_admin());

create policy "Customers view own chatbot messages"
  on chat_messages for select to authenticated
  using (
    exists (
      select 1 from chatbots
      where chatbots.id = chat_messages.chatbot_id
        and chatbots.owner_id = auth.uid()
    )
  );
