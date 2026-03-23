-- Migration 003: Chat conversations, messages, and widget config
-- Run in Supabase SQL Editor

-- 1. Add widget config to chatbots table
alter table chatbots add column if not exists widget_config jsonb default '{}'::jsonb;

-- widget_config shape:
-- {
--   "greeting": "Hi! How can I help you today?",
--   "system_prompt": "You are a helpful assistant...",
--   "primary_color": "#7c3aed",
--   "position": "bottom-right",
--   "fallback_message": "I'm not sure about that. Please contact us directly."
-- }

-- 2. Chat conversations (one per visitor session)
create table if not exists chat_conversations (
  id uuid primary key default gen_random_uuid(),
  chatbot_id uuid not null references chatbots(id) on delete cascade,
  visitor_id text not null,
  visitor_ip inet,
  source_url text,
  status text not null default 'active'
    check (status in ('active', 'ended', 'archived')),
  message_count int default 0,
  started_at timestamptz default now(),
  last_message_at timestamptz default now()
);

create index idx_chat_conversations_chatbot on chat_conversations(chatbot_id, started_at desc);
create index idx_chat_conversations_visitor on chat_conversations(visitor_id);

-- 3. Chat messages (individual turns)
create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references chat_conversations(id) on delete cascade,
  chatbot_id uuid not null references chatbots(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  input_tokens int,
  output_tokens int,
  latency_ms int,
  created_at timestamptz default now()
);

create index idx_chat_messages_conversation on chat_messages(conversation_id, created_at);
create index idx_chat_messages_chatbot on chat_messages(chatbot_id, created_at desc);

-- 4. RLS policies
-- API routes use SERVICE_ROLE_KEY (bypasses RLS automatically)
-- Command Center uses authenticated user
alter table chat_conversations enable row level security;
alter table chat_messages enable row level security;

create policy "Authenticated users can view conversations"
  on chat_conversations for select to authenticated using (true);

create policy "Admin manages conversations"
  on chat_conversations for all to authenticated
  using (public.is_admin());

create policy "Authenticated users can view messages"
  on chat_messages for select to authenticated using (true);

create policy "Admin manages messages"
  on chat_messages for all to authenticated
  using (public.is_admin());
