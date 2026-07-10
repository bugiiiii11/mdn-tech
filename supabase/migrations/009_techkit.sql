-- =====================================================
-- 009_techkit.sql — TechKit monitoring layer
-- Schema per TECHKIT-BRIEF.md §4. Apply manually in the
-- Supabase SQL editor (repo convention).
-- All tables admin-only via RLS; Edge Functions write
-- through the service role (bypasses RLS).
-- =====================================================

-- 1. Monitored HTTP endpoints (uptime targets)
create table monitored_endpoints (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete set null,  -- nullable: some targets (client sites) may not be CC projects
  name text not null,                          -- "mdntech.org home", "ChatKit widget API"
  url text not null,
  method text not null default 'GET',          -- GET | HEAD
  expected_status_min int not null default 200,
  expected_status_max int not null default 399,
  keyword text,                                -- optional: response body must contain this string
  degraded_latency_ms int not null default 3000,
  check_interval_secs int not null default 300,
  is_active boolean not null default true,
  -- alert state machine (written by poller only)
  current_status text not null default 'unknown',   -- up | degraded | down | unknown
  consecutive_failures int not null default 0,
  open_alert_id uuid,                          -- FK added after alert_events exists
  last_checked_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Uptime check results (time-series, high volume; 90-day retention via poller task=retention)
create table uptime_checks (
  id bigint generated always as identity primary key,
  endpoint_id uuid not null references monitored_endpoints(id) on delete cascade,
  status text not null,                        -- up | degraded | down
  http_status int,
  latency_ms int,
  error text,                                  -- timeout / dns / tls / keyword-miss / etc.
  checked_at timestamptz not null default now()
);
create index idx_uptime_checks_lookup on uptime_checks (endpoint_id, checked_at desc);

-- 3. Hourly rollups (charts read these, not raw rows)
create table uptime_rollups_hourly (
  endpoint_id uuid not null references monitored_endpoints(id) on delete cascade,
  hour_start timestamptz not null,
  checks_total int not null,
  checks_up int not null,
  checks_degraded int not null,
  checks_down int not null,
  avg_latency_ms int,
  p95_latency_ms int,
  primary key (endpoint_id, hour_start)
);

-- 4. Provider / project metrics (time-series, low volume; 365-day retention)
create table infra_metrics (
  id bigint generated always as identity primary key,
  project_id uuid references projects(id) on delete cascade,   -- nullable = account-level metric
  provider text not null,                      -- supabase | railway | vercel | anthropic | crux | chatkit
  metric_name text not null,                   -- db_size_bytes | cpu_pct | request_count | lcp_ms | tokens_out | ...
  metric_value numeric(18,4) not null,
  unit text,                                   -- bytes | percent | count | ms | usd
  recorded_at timestamptz not null default now()
);
create index idx_infra_metrics_lookup on infra_metrics (provider, metric_name, project_id, recorded_at desc);

-- 5. Cost snapshots
create table infra_costs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete set null,  -- nullable = account-level cost
  provider text not null,                      -- vercel | railway | supabase | anthropic | other
  cost_amount numeric(10,2) not null,
  currency text not null default 'USD',
  period_start date not null,
  period_end date not null,
  source text not null default 'api',          -- api | manual | static-config
  recorded_at timestamptz default now(),
  unique (provider, project_id, period_start, period_end)
);

-- 6. Deployment events (from webhooks, Session B)
create table deploy_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,                      -- vercel | railway
  project_id uuid references projects(id) on delete set null,
  provider_project_id text,                    -- raw provider-side id for joining
  deployment_id text not null,
  environment text,                            -- production | preview
  status text not null,                        -- created | building | succeeded | failed | canceled
  actor text,
  url text,
  raw jsonb default '{}',
  occurred_at timestamptz not null,
  created_at timestamptz default now(),
  unique (provider, deployment_id, status)
);
create index idx_deploy_events_time on deploy_events (occurred_at desc);

-- 7. Alert rules (metric/cost thresholds; downtime alerts are built-in, no rule row needed)
create table alert_rules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  scope text not null,                         -- metric | cost
  provider text,
  project_id uuid references projects(id) on delete cascade,
  metric_name text,
  condition text not null default 'gt',        -- gt | lt
  threshold numeric(18,4) not null,
  severity text not null default 'warning',    -- info | warning | critical
  cooldown_minutes int not null default 240,   -- min gap between repeat alerts from this rule
  last_fired_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

-- 8. Alert events (incidents)
create table alert_events (
  id uuid primary key default gen_random_uuid(),
  rule_id uuid references alert_rules(id) on delete set null,  -- null = built-in downtime/recovery alert
  endpoint_id uuid references monitored_endpoints(id) on delete set null,
  project_id uuid references projects(id) on delete set null,
  severity text not null,                      -- info | warning | critical
  title text not null,
  message text,
  status text not null default 'open',         -- open | acknowledged | resolved
  notified_channels jsonb default '[]',        -- ["email","telegram"] — what actually got sent
  opened_at timestamptz not null default now(),
  acknowledged_at timestamptz,
  acknowledged_by uuid references team_members(id),
  resolved_at timestamptz
);
create index idx_alert_events_status on alert_events (status, opened_at desc);

alter table monitored_endpoints
  add constraint fk_open_alert foreign key (open_alert_id) references alert_events(id) on delete set null;

-- 9. AI weekly digests (Session D)
create table techkit_digests (
  id uuid primary key default gen_random_uuid(),
  week_start date not null unique,
  content_md text not null,
  model text,
  input_summary jsonb default '{}',            -- the aggregates fed to the model (for audit)
  sent_email boolean default false,
  sent_telegram boolean default false,
  created_at timestamptz default now()
);

-- 10. RLS — admin-only on everything (pattern from migration 006)
alter table monitored_endpoints   enable row level security;
alter table uptime_checks         enable row level security;
alter table uptime_rollups_hourly enable row level security;
alter table infra_metrics         enable row level security;
alter table infra_costs           enable row level security;
alter table deploy_events         enable row level security;
alter table alert_rules           enable row level security;
alter table alert_events          enable row level security;
alter table techkit_digests       enable row level security;

create policy "Admins can view monitored_endpoints" on monitored_endpoints
  for select using (public.is_admin());
create policy "Admins can manage monitored_endpoints" on monitored_endpoints
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Admins can view uptime_checks" on uptime_checks
  for select using (public.is_admin());
create policy "Admins can manage uptime_checks" on uptime_checks
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Admins can view uptime_rollups_hourly" on uptime_rollups_hourly
  for select using (public.is_admin());
create policy "Admins can manage uptime_rollups_hourly" on uptime_rollups_hourly
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Admins can view infra_metrics" on infra_metrics
  for select using (public.is_admin());
create policy "Admins can manage infra_metrics" on infra_metrics
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Admins can view infra_costs" on infra_costs
  for select using (public.is_admin());
create policy "Admins can manage infra_costs" on infra_costs
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Admins can view deploy_events" on deploy_events
  for select using (public.is_admin());
create policy "Admins can manage deploy_events" on deploy_events
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Admins can view alert_rules" on alert_rules
  for select using (public.is_admin());
create policy "Admins can manage alert_rules" on alert_rules
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Admins can view alert_events" on alert_events
  for select using (public.is_admin());
create policy "Admins can manage alert_events" on alert_events
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Admins can view techkit_digests" on techkit_digests
  for select using (public.is_admin());
create policy "Admins can manage techkit_digests" on techkit_digests
  for all using (public.is_admin()) with check (public.is_admin());

-- 11. updated_at trigger reuse (function from migration 001)
create trigger trg_monitored_endpoints_updated
  before update on monitored_endpoints
  for each row execute function update_updated_at();

-- 11b. Hourly rollup aggregation (called by techkit-poller task=rollup).
-- Recomputes a full hour idempotently (on conflict update) so late checks are absorbed.
create or replace function techkit_rollup_hourly(p_hour timestamptz default null)
returns void
language sql
security definer
set search_path = public
as $$
  insert into uptime_rollups_hourly
    (endpoint_id, hour_start, checks_total, checks_up, checks_degraded, checks_down, avg_latency_ms, p95_latency_ms)
  select
    endpoint_id,
    date_trunc('hour', coalesce(p_hour, now() - interval '1 hour')),
    count(*),
    count(*) filter (where status = 'up'),
    count(*) filter (where status = 'degraded'),
    count(*) filter (where status = 'down'),
    avg(latency_ms)::int,
    (percentile_cont(0.95) within group (order by latency_ms))::int
  from uptime_checks
  where checked_at >= date_trunc('hour', coalesce(p_hour, now() - interval '1 hour'))
    and checked_at <  date_trunc('hour', coalesce(p_hour, now() - interval '1 hour')) + interval '1 hour'
  group by endpoint_id
  on conflict (endpoint_id, hour_start) do update set
    checks_total   = excluded.checks_total,
    checks_up      = excluded.checks_up,
    checks_degraded = excluded.checks_degraded,
    checks_down    = excluded.checks_down,
    avg_latency_ms = excluded.avg_latency_ms,
    p95_latency_ms = excluded.p95_latency_ms;
$$;

-- service-role only — not callable through PostgREST by anon/authenticated
revoke execute on function techkit_rollup_hourly(timestamptz) from public, anon, authenticated;
grant execute on function techkit_rollup_hourly(timestamptz) to service_role;

-- =====================================================
-- 12. Seed roster (TECHKIT-BRIEF.md §11)
-- Project links are best-effort name matches; the Session A
-- audit (A2) verifies/corrects them. Unmatched names → null.
-- ⚠️ rows from the brief are seeded is_active=false (or left
-- out where no URL exists yet) until confirmed with Martin.
-- =====================================================

insert into monitored_endpoints (name, url, project_id, is_active) values
  ('mdntech.org home',   'https://mdntech.org',                (select id from projects where name ilike '%mdn%tech%' limit 1), true),
  ('mdntech.org /sk',    'https://mdntech.org/sk',             (select id from projects where name ilike '%mdn%tech%' limit 1), true),
  ('Command Center',     'https://admin.mdntech.org/login',    (select id from projects where name ilike '%mdn%tech%' limit 1), true),
  ('Customer portal',    'https://app.mdntech.org/toolkit',    (select id from projects where name ilike '%mdn%tech%' limit 1), true),
  ('Kúrenie Turiec',     'https://kurenieturiec.sk',           (select id from projects where name ilike '%turiec%' or name ilike '%melich%' limit 1), true),
  ('Royal Stroje',       'https://royalstroje.sk',             (select id from projects where name ilike '%royal%stroje%' limit 1), true),
  ('Good Hair by Zane',  'https://goodhairbyzane.com',         (select id from projects where name ilike '%zane%' or name ilike '%good hair%' limit 1), true),
  -- ⚠️ inactive until royalworks.sk go-live (then update url + activate)
  ('Royal Works',        'https://royal-works.vercel.app',     (select id from projects where name ilike '%royal%works%' limit 1), false);

-- Swarm Resistance: production URL found in projects.production_url (www.swarmresistance.tech);
-- seeded inactive until Martin confirms it should be monitored.
insert into monitored_endpoints (name, url, project_id, is_active) values
  ('Swarm Resistance', 'https://www.swarmresistance.tech/', (select id from projects where name ilike '%swarm%' limit 1), false);

-- ⚠️ Not seeded — add via TechKit → Endpoints once confirmed:
--   ChatKit widget API: https://mdntech.org/api/chat/<stable-internal-chatbot-id>/config (GET config = cheap, no Claude tokens)
--   Rahadu SaaS Portal: hosting pending (Michal)

-- =====================================================
-- 13. A2 audit fixes — projects join keys
-- (audited 2026-07-10 against live DB + Vercel API)
-- =====================================================

-- literal 'N/A' strings → null (M.D.N Tech, Royal Stroje)
update projects set railway_project_id = null where railway_project_id = 'N/A';

-- missing vercel_project_id, resolved via Vercel API project list
update projects set vercel_project_id = 'prj_Ll7YkJDn3m6SoyRZyeSNeafM1Cvz'
  where name = 'Good Hair by Zane' and vercel_project_id is null;      -- zane-kadernictvo
update projects set vercel_project_id = 'prj_syrXTTyU8fNt8MOdgf4pXe5BMJp2'
  where name = 'TradeKit' and vercel_project_id is null;               -- trade-kit
update projects set vercel_project_id = 'prj_STQKart1Y2lI6mbAaQphByDmv7U4'
  where name = 'SignaKit (AuthVault)' and vercel_project_id is null;   -- auth-vault-demo

-- NOT auto-fixed (needs Martin):
--   SignaKit railway_project_id holds a domain ('authvaultbackend-production.up.railway.app'),
--     not a Railway project id — the current RAILWAY_API_TOKEN is rejected ("Not Authorized")
--     for account-level queries, so the real id couldn't be fetched. Regenerate an account token.
--   'Swarm Resistance dev' row mixes the dev Vercel project id (swarm-resistance-frontend-dev)
--     with the production URL; prod Vercel project is prj_rVes2ZCMkq9SwBdjOKqv5Sym26CX.
--   Melicharek + Royal Works exist on Vercel (prj_b5UAAmbiwCJNtoRajKci3m7stHnP /
--     prj_2141CyT98y7MDvDgW9smu624axIi) but have no projects row — add via CC if wanted.
