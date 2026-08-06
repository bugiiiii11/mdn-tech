-- ChatKit Weekly Reports (feature id: reports, one-time $39 unlock)
--
-- Loop: Monday cron (or per-bot "Run now") -> /api/portal/chatkit/reports/run
-- aggregates the last 7 days vs the 7 days before (volume, fallback rate,
-- ratings, top keywords), Claude Haiku writes a short narrative, the report is
-- stored here and emailed to the owner via Resend.
--
-- Ops prerequisites: same CHATKIT_CRON_SECRET / vault chatkit_cron_secret pair
-- as migration 018 (shared across ChatKit crons) + RESEND_API_KEY on Vercel.
-- Until the secret exists the cron fires but the route rejects 401 -- harmless.

-- ============================================================
-- REPORTS
-- ============================================================
create table if not exists chatbot_reports (
  id uuid primary key default gen_random_uuid(),
  chatbot_id uuid not null references chatbots(id) on delete cascade,
  period_start date not null,              -- 7-day window [period_start, period_end)
  period_end date not null,
  stats jsonb not null default '{}',       -- volume / fallbacks / ratings / keywords + WoW deltas
  summary text,                            -- AI narrative (nullable: email still sends stats-only)
  email_sent boolean not null default false,
  created_at timestamptz default now(),
  unique (chatbot_id, period_start)        -- cron re-runs and manual runs upsert, never duplicate
);

create index if not exists idx_chatbot_reports_chatbot
  on chatbot_reports (chatbot_id, period_start desc);

alter table chatbot_reports enable row level security;

-- Owners read reports for their own chatbots; generation writes via service role.
create policy "owners read chatbot reports"
  on chatbot_reports for select
  using (exists (
    select 1 from chatbots c
    where c.id = chatbot_id and c.owner_id = auth.uid()
  ));

-- ============================================================
-- CRON -- Monday 06:10 UTC weekly report pass (after Sunday learning)
-- ============================================================
do $$
begin
  perform cron.unschedule('chatkit-reports');
exception when others then null;
end $$;

select cron.schedule('chatkit-reports', '10 6 * * 1', $$
  select net.http_post(
    url    := 'https://app.mdntech.org/api/portal/chatkit/reports/run',
    headers:= jsonb_build_object(
                'Content-Type','application/json',
                'Authorization','Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name='chatkit_cron_secret')),
    body   := '{"source":"cron"}'::jsonb,
    timeout_milliseconds := 120000
  );
$$);

-- Useful ops queries:
--   select jobname, schedule, active from cron.job where jobname = 'chatkit-reports';
--   select chatbot_id, period_start, email_sent, created_at from chatbot_reports order by created_at desc limit 20;
