-- M.D.N Tech Command Center -- Chatbot Knowledge Base
-- Run this in Supabase SQL Editor after 001_core_tables.sql

-- ============================================================
-- CHATBOTS
-- ============================================================
create table if not exists chatbots (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  project_id uuid references projects(id) on delete set null,
  client_name text,
  description text,
  type text not null default 'client'
    check (type in ('internal', 'client')),
  status text not null default 'active'
    check (status in ('active', 'draft', 'archived')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger chatbots_updated_at
  before update on chatbots
  for each row execute function update_updated_at();

-- ============================================================
-- CHATBOT KB ENTRIES
-- ============================================================
create table if not exists chatbot_kb_entries (
  id uuid primary key default gen_random_uuid(),
  chatbot_id uuid not null references chatbots(id) on delete cascade,
  title text not null,
  content text not null default '',
  category text not null default 'general',
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger chatbot_kb_entries_updated_at
  before update on chatbot_kb_entries
  for each row execute function update_updated_at();

create index idx_chatbot_kb_entries_chatbot
  on chatbot_kb_entries (chatbot_id, sort_order);

-- ============================================================
-- RLS
-- ============================================================
alter table chatbots enable row level security;
alter table chatbot_kb_entries enable row level security;

create policy "Authenticated users can view chatbots"
  on chatbots for select to authenticated using (true);

create policy "Authenticated users can manage chatbots"
  on chatbots for all to authenticated using (true);

create policy "Authenticated users can view kb entries"
  on chatbot_kb_entries for select to authenticated using (true);

create policy "Authenticated users can manage kb entries"
  on chatbot_kb_entries for all to authenticated using (true);
