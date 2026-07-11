---
title: "TechKit — Technical Superadmin: Development Brief"
status: ready-for-kickoff
created: 2026-07-10
author: Mind Palace session (Claude, with Martin)
executor: Claude Code (Fable) in this repo
supersedes-scope: DEVELOPMENT-PLAN.md Phases 3-4 (frozen v1 plan) — this brief is their modern replacement
vault: MindPalace/Projects/MDN-Tech (wiki link to be added at next vault /wrap)
---

# TechKit — Technical Superadmin for All MDN Projects

> **One-liner:** A monitoring + statistics layer inside the Command Center (admin.mdntech.org) that watches every MDN-built project — uptime, provider health, deployments, costs, technical stats — persists history, and **alerts us (in-app + email + Telegram) before clients notice anything is down.**
>
> Preliminary product name: **TechKit** (fits the -Kit family: ChatKit, ToolKit, SignaKit, TradeKit, MarketKit). Internal-only for MVP; customer-facing status pages are a backlog item.

---

## 0. How to use this document

This is the complete execution brief for Claude Code sessions in this repo. Work is sliced into **Sessions A–D** (§13), each independently shippable with exit criteria. Start every session by re-reading §2 (locked decisions) and the target session's task list. Schema (§4) ships first — everything else reads/writes those tables.

**Read this before touching code:**
- Current live-fetch monitor: `app/command-center/infrastructure/page.tsx` + `components/command-center/infrastructure/InfraClient.tsx` + `app/api/infrastructure/route.ts`
- Provider adapters (REUSE, do not rewrite): `lib/infrastructure/{supabase-mgmt,railway,vercel,types}.ts`
- Join keys already exist: `projects.{supabase_project_ref, railway_project_id, vercel_project_id, production_url, staging_url}` (migration 001)
- Highest migration: `008_chatkit_subscriptions.sql` → TechKit starts at **009**

---

## 1. Context — why now, and what exists

### 1.1 Prior art
The frozen v1 plan (`command-center/DEVELOPMENT-PLAN.md`, 2026-03-21) specced exactly this in Phases 3–4: provider adapters → health dashboard → metrics storage → polling workers → cost analytics → alert engine → notification channels. **Only the first two shipped** (Session 6, 2026-03-21). Migration 004 explicitly deferred `infra_metrics`, `infra_costs`, `alert_rules`, `alert_events` ("add when needed, not speculatively"). That deferral is now **reversed by decision on 2026-07-10** — the need is here: MDN runs 8+ live surfaces across 3 providers plus client sites, with zero outage detection.

### 1.2 What exists today (ground truth, verified 2026-07-10)
- **Live-fetch infra monitor** in CC: `/api/infrastructure` fans out to 3 provider adapters, returns a transient `InfrastructureOverview`, browser polls every 60s **only while the tab is open**. Nothing persisted. No HTTP checks of real URLs. No alerting — adapter `status: 'down'` only colors a card.
- **No scheduler anywhere**: no `vercel.json` crons, no Supabase Edge Functions (`supabase/functions/` doesn't exist), no pg_cron, no GitHub Actions schedules. The only "scheduled" logic is the lazy `rollover_customer_period()` RPC.
- **Unsurfaced metrics**: `chat_messages.{input_tokens, output_tokens, latency_ms}` are populated on every chatbot message but shown nowhere.
- **Analytics are ChatKit-only**: `lib/portal/analytics.ts` computes per-chatbot stats on demand. Zero cross-project or cross-product aggregation.
- **Notification foundations**: Resend domain verified + SMTP live for Supabase Auth emails (Session 26, `noreply@mdntech.org`). No Resend API key in repo env yet. No Telegram bot yet.

### 1.3 Relationship to MarketKit (decision 2026-07-10)
MarketKit (AI GTM copilot — marketing/business data) will be **integrated into this repo's portal (app.mdntech.org)**, reversing the Session-13 vault decision for a separate repo. TechKit (technical data) lives in **CC (admin.mdntech.org)**. They share: one Supabase project (D2), the pg_cron + Edge Function ingestion pattern established here, and the notification service. Division of data: **GA4/GSC/traffic-attribution/content metrics → MarketKit. Uptime/providers/deploys/costs/web-vitals/resource usage → TechKit.** Do not blur this line.

---

## 2. Locked decisions (2026-07-10)

| # | Decision | Why |
|---|----------|-----|
| T1 | TechKit lives in **CC at admin.mdntech.org** — extends/replaces the Infrastructure section | Founder-only superadmin; CC already has auth, role gate, sidebar, design language. Portal stays customer-facing. |
| T2 | **Poller runs on Supabase (pg_cron + pg_net + Edge Functions), NOT on Vercel** | The monitor must not share infrastructure with what it monitors. mdntech.org/admin/app all run on Vercel — a Vercel-hosted cron is blind during a Vercel outage. Supabase is a separate failure domain, has minute-granularity cron on all plans, and is already the system of record (D2). |
| T3 | Alert channels: **in-app (CC) + email (Resend API) + Telegram bot** | Resend domain already verified. Telegram gives push-to-phone and pre-builds the bot plumbing for the v2 plan's agent phases (6–9). |
| T4 | Full MVP scope: core (uptime + provider health + alerts + dashboard) **plus** cost tracking, deployment feed, traffic/web-vitals stats, AI weekly digest | Explicit user choice. Sliced into sessions so core ships first. |
| T5 | Name: **TechKit** (preliminary) | -Kit family. Rename is a find/replace + nav label; don't hardcode the name into table names (use `monitored_*`, `infra_*`, `alert_*`, `deploy_*` prefixes instead). |
| T6 | Reuse `projects` table as the project registry; monitored endpoints reference `projects.id` (nullable) | Join keys + URLs already exist there. No parallel registry. |
| T7 | All TechKit tables are **admin-only via RLS** (`is_admin()`); Edge Functions use service role | Same pattern as migration 006. Customers never see TechKit data (until status pages, §15). |
| T8 | Existing live-fetch view is kept as a "Live" tab inside TechKit; adapters in `lib/infrastructure/` are reused by the Edge Function (ported, single source) | Don't throw away working code; avoid two divergent adapter implementations. |

---

## 3. Architecture

```
                     ┌────────────────────────────────────────────┐
                     │           SUPABASE (ijfgwzacaabzeknlpaff)   │
                     │                                             │
  pg_cron schedules ─┤  cron.schedule → net.http_post              │
   */5m uptime       │        │                                    │
   @hourly providers │        ▼                                    │
   @daily costs      │  Edge Function: techkit-poller              │
   @weekly digest    │   (task param: uptime|providers|costs|      │
                     │    digest|retention)                        │
                     │        │ writes                             │
                     │        ▼                                    │
                     │  uptime_checks · infra_metrics · infra_costs│
                     │  alert_events · monitored_endpoints (state) │
                     │  deploy_events · techkit_digests            │
                     │        │                                    │
                     │        ├─ alert engine (state transitions)  │
                     │        │    ├→ Resend API (email)           │
                     │        │    └→ Telegram Bot API             │
                     │                                             │
                     │  Edge Function: techkit-webhook             │
                     │   ← Vercel deployment webhooks              │
                     │   ← Railway deployment webhooks             │
                     └────────────────────────────────────────────┘
                              ▲ reads (RLS admin / anon+session)
                              │
        Next.js CC (admin.mdntech.org) — TechKit pages:
        overview grid · incidents · endpoints CRUD · costs ·
        stats · digests · "Live" tab (existing InfraClient)
```

Key properties:
- **Vercel-independent detection path**: pg_cron → Edge Function → Telegram/Resend never touches Vercel.
- **CC is read/manage only**: renders tables, manages `monitored_endpoints` + `alert_rules`, acknowledges incidents. If CC itself is down (Vercel outage), alerts still fire.
- **One poller function with a `task` switch** keeps deploys simple; webhook receiver is separate because it has different auth (provider signatures vs CRON_SECRET).

---

## 4. Database schema — `supabase/migrations/009_techkit.sql`

Full SQL below. Apply manually in Supabase SQL editor (repo convention). Everything `is_admin()`-gated; Edge Functions bypass RLS via service role.

```sql
-- =====================================================
-- 009_techkit.sql — TechKit monitoring layer
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

-- 2. Uptime check results (time-series, high volume)
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

-- 4. Provider / project metrics (time-series, low volume)
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

-- 6. Deployment events (from webhooks)
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

-- 9. AI weekly digests
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

-- 10. RLS — admin-only on everything
alter table monitored_endpoints  enable row level security;
alter table uptime_checks        enable row level security;
alter table uptime_rollups_hourly enable row level security;
alter table infra_metrics        enable row level security;
alter table infra_costs          enable row level security;
alter table deploy_events        enable row level security;
alter table alert_rules          enable row level security;
alter table alert_events         enable row level security;
alter table techkit_digests      enable row level security;

-- one SELECT policy + one ALL policy per table, both `using (public.is_admin())`
-- (write them out per table — pattern identical to migration 006)

-- 11. updated_at trigger reuse
create trigger trg_monitored_endpoints_updated
  before update on monitored_endpoints
  for each row execute function update_updated_at();
```

**Retention policy** (runs as poller `task=retention`, daily): delete `uptime_checks` older than 90 days (rollups keep the history); delete `infra_metrics` older than 365 days; `alert_events`, `deploy_events`, `infra_costs`, `techkit_digests` keep forever (low volume).

Volume sanity: ~12 endpoints × 288 checks/day ≈ 3.5k rows/day ≈ 315k rows at 90-day cap. Trivial for Postgres with the index above.

---

## 5. Edge Functions

New directory: `supabase/functions/`. Two functions. Both `verify_jwt = false` with their own auth (CRON_SECRET / webhook signatures). Deploy via `supabase functions deploy`.

### 5.1 `techkit-poller`
Single function, `task` switch from request body. Invoked by pg_cron via `net.http_post` with header `Authorization: Bearer <CRON_SECRET>`.

| task | cron | What it does |
|------|------|--------------|
| `uptime` | `*/5 * * * *` | `Promise.allSettled` fetch of every active `monitored_endpoints` row (10s timeout, measure latency, check status range + optional keyword). Write `uptime_checks`. Run **alert state machine** (§6). Update endpoint state columns. |
| `rollup` | `5 * * * *` | Aggregate the previous hour's raw checks into `uptime_rollups_hourly`. |
| `providers` | `0 * * * *` | Call the three provider adapters (ported from `lib/infrastructure/`, see note below). Persist health + key numbers into `infra_metrics` (e.g. supabase `db_size_bytes`, `status`; railway `cpu_pct`, `memory_mb`, service count; vercel deployment states). Evaluate `alert_rules` with `scope='metric'`. |
| `stats` | `30 */6 * * *` | Collect traffic/vitals stats (§8): CrUX per origin, Vercel analytics if available, Supabase usage, ChatKit rollup from `chat_messages`. Write `infra_metrics`. |
| `costs` | `15 6 * * *` (daily) | Cost collectors (§9) → `infra_costs`. Evaluate `scope='cost'` rules. |
| `digest` | `0 6 * * 1` (Mon) | Build weekly aggregates → Claude → `techkit_digests` + email + Telegram (§10). |
| `retention` | `45 3 * * *` | Delete expired raw rows (§4 retention policy). |

**Adapter port note (T8):** the fetch logic in `lib/infrastructure/{supabase-mgmt,railway,vercel}.ts` moves to a shared location consumable by both Next.js and Deno — recommended: `supabase/functions/_shared/providers/*.ts` written in fetch-only style, with `lib/infrastructure/*.ts` becoming thin re-exports/wrappers for the Next.js "Live" tab. Do NOT maintain two copies of query strings/endpoints.

### 5.2 `techkit-webhook`
- `POST /techkit-webhook?provider=vercel` — verify `x-vercel-signature` (HMAC-SHA1 with `VERCEL_WEBHOOK_SECRET`); map `deployment.created/succeeded/error/canceled` → `deploy_events`; match `provider_project_id` → `projects.vercel_project_id` to fill `project_id`.
- `POST /techkit-webhook?provider=railway` — Railway project webhooks (JSON, per-project setup); map deploy status events similarly.
- On `status='failed'` production deploys: open a `warning` alert (built-in, no rule row).
- **Incident correlation:** when a downtime alert opens, check `deploy_events` for a production deploy of the same project within the previous 30 min; if found, append "possibly caused by deploy `<id>` at `<time>`" to the alert message.

### 5.3 pg_cron wiring (part of migration 009 or a follow-up 010)

```sql
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- CRON_SECRET lives in Supabase Vault; read at schedule-definition time:
-- select vault.create_secret('...', 'techkit_cron_secret');

select cron.schedule('techkit-uptime', '*/5 * * * *', $$
  select net.http_post(
    url    := 'https://ijfgwzacaabzeknlpaff.supabase.co/functions/v1/techkit-poller',
    headers:= jsonb_build_object(
                'Content-Type','application/json',
                'Authorization','Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name='techkit_cron_secret')),
    body   := '{"task":"uptime"}'::jsonb,
    timeout_milliseconds := 60000
  );
$$);
-- ...repeat for rollup / providers / stats / costs / digest / retention with schedules from §5.1
```

---

## 6. Alert engine

### 6.1 Downtime state machine (built-in, per endpoint)
```
up ──(check fails)──▶ consecutive_failures++
        │ consecutive_failures >= 2  (i.e. ~10 min at 5-min cadence)
        ▼
   OPEN incident: alert_events(severity=critical, endpoint_id, title="DOWN: <name>")
   notify email + telegram + set monitored_endpoints.open_alert_id
        │
        │ (check succeeds while open_alert_id is set)
        ▼
   RESOLVE incident: status=resolved, resolved_at=now()
   notify recovery ("UP again: <name>, downtime <duration>")
   reset consecutive_failures, clear open_alert_id
```
- `degraded` (slow but responding, or keyword present but status 3xx-redirect-loop etc.): after 3 consecutive degraded checks → `warning` incident, same lifecycle.
- **No flapping spam:** one open incident per endpoint at a time (`open_alert_id` guard); recovery closes it; a new failure opens a new one.
- 2-failure threshold means worst-case detection ≈ 10 min after actual outage start. Acceptable for MVP; interval is per-endpoint tunable (`check_interval_secs`).

### 6.2 Rule-based alerts (metric/cost)
Evaluated by the matching poller task. `cooldown_minutes` + `last_fired_at` prevent repeats. Fire → `alert_events` row + notify per severity: `critical` = email + Telegram; `warning` = Telegram; `info` = in-app only.

### 6.3 Delivery
- **Email (Resend API):** `POST https://api.resend.com/emails`, from `alerts@mdntech.org` (add sender to the verified domain), to `ALERT_EMAIL_TO`. Dark branded template consistent with `supabase/email-templates/`.
- **Telegram:** `POST https://api.telegram.org/bot<TOKEN>/sendMessage`, `chat_id = TELEGRAM_ALERT_CHAT_ID`, Markdown body:
  ```
  🔴 DOWN: kurenieturiec.sk
  HTTP timeout after 10s · 2 consecutive failures
  Since: 2026-07-10 14:35 UTC · Project: Melicharek
  Possibly caused by deploy dpl_abc123 at 14:28
  ```
  Recovery: `🟢 UP again: kurenieturiec.sk · downtime 12 min`.
- **In-app:** CC incidents page (§7) + open-incident count badge on the TechKit nav item.
- Record what was actually delivered in `alert_events.notified_channels`; a delivery failure must never crash the poller (try/catch per channel, log to function logs).

---

## 7. Command Center UI

### 7.1 Navigation
Sidebar (`components/command-center/layout/Sidebar.tsx`): rename **Infrastructure → TechKit**, same position. Route stays under the admin host; new pages live at `app/command-center/techkit/*`. Add `app/command-center/infrastructure/page.tsx` → redirect to `/techkit` (old bookmarks). Nav item shows a red badge with open-incident count (server component, cheap `count(*) where status='open'`).

### 7.2 Pages

| Route | Content |
|-------|---------|
| `techkit/` (overview) | **Health grid**: one row per project (join `projects` ↔ endpoints/providers) — uptime status dot, 24h uptime %, p95 latency sparkline (from `uptime_rollups_hourly`), provider badges (latest `infra_metrics` status), last deploy, month-to-date cost. Top strip: open incidents (red), degraded (amber), all-green state. Section below: **Open incidents** list with ack buttons. |
| `techkit/incidents` | Full `alert_events` feed: filters (status/severity/project/time), acknowledge + resolve actions (server actions writing `acknowledged_by/At`), incident detail row expands to related checks + correlated deploy. |
| `techkit/endpoints` | CRUD for `monitored_endpoints` (form: name, URL, project link, method, expected status, keyword, interval, degraded threshold, active toggle) + per-endpoint 7d uptime bar + "Check now" button (calls poller with `{"task":"uptime","endpoint_id":...}`). |
| `techkit/costs` | Month view: stacked cost per provider, per-project table, 6-month trend line, MTD vs last month delta. Manual-entry form for providers without APIs (`source='manual'`). |
| `techkit/stats` | Per-project panels: CrUX vitals (LCP/CLS/INP), traffic (if Vercel analytics available), Supabase DB size trend, Railway CPU/mem, **ChatKit cross-project rollup** (messages/day, tokens in/out, avg latency from `chat_messages` — finally surfaces the stored-but-hidden fields). |
| `techkit/digests` | Weekly digest list + rendered markdown detail. |
| `techkit/live` | The existing `InfraClient` live-fetch view, unchanged (T8). |

### 7.3 Components
Reuse CC card/table patterns and portal chart components (`TrendChart` CSS-bar pattern) — no new chart library for MVP. New shared bits: `StatusDot`, `UptimeBar` (7d/30d segments), `SparklineLatency`, `IncidentRow`, `CostStack`. Server components + targeted `revalidate`/`force-dynamic` — the pages read Postgres, they don't call provider APIs.

### 7.4 Design direction (added 2026-07-10, Martin)
**Full license to redesign the existing CC UI** as part of TechKit work — nothing in the current admin.mdntech.org look is sacred. Style direction (explicitly *not* a copy): the refinement path proven in the Rahadu SaaS Portal demo admin — **"space elegance without stars"**: layered dark gradient + brand-tinted glow orbs + subtle vignette as ambient (no 3D/R3F dependencies on admin surfaces — the marketing site's starfield/black hole stays OFF admin), calm translucent card surfaces, coherent theme tokens, restrained on-scroll reveals. Rules of thumb:
- **Data density first.** Monitoring grids live or die on scanability — status semantics (red/amber/green) must always dominate ornamentation. Ambient stays behind the data, never competes with it.
- Fable has design authority here (Martin: "necham si poradit, mas vyborne dizajn citenie") — load the `frontend-design` / `impeccable` skills when doing the visual pass.
- Scope freedom: a TechKit-only design language is fine for Session A; a broader CC-wide refresh (sidebar, dashboard, projects pages) can ride along in Session D polish or a dedicated design session — Fable's call based on how far the TechKit pages drift from the legacy CC look.

---

## 8. Stats collectors (task=`stats`)

| Source | What | Confidence / fallback |
|--------|------|----------------------|
| **CrUX API** (free, Google) | Real-user Core Web Vitals (LCP, CLS, INP) per origin — works for ALL sites incl. client sites, no site-side install | HIGH for popular origins; low-traffic origins may return no data (handle 404 as "insufficient data", not error). Key: `CRUX_API_KEY` (free GCP key). |
| **Supabase Mgmt API** | Per-project DB size, status; usage endpoints for API request counts | HIGH for health/size; usage endpoints vary — implement best-effort, store what's available. |
| **Railway GraphQL** | CPU/mem/network per service | MEDIUM — metrics query availability differs per plan (repo code already wraps deployments query in try/catch for this reason). Degrade gracefully. |
| **Vercel API** | Deployments (have), bandwidth/requests via usage endpoints; Web Analytics API | MEDIUM — analytics API availability depends on plan/product. **Verify during Session B**; if unavailable, skip (CrUX covers vitals; deploy feed covers activity). |
| **ChatKit internal** | Aggregate `chat_messages` per day: count, input/output tokens, avg/p95 `latency_ms`, per chatbot + total | HIGH — data already in our DB, just aggregate into `infra_metrics` (provider='chatkit'). |

GA4/GSC explicitly **out** — MarketKit territory (§1.3).

---

## 9. Cost tracking (task=`costs`)

| Provider | Method | Confidence / fallback |
|----------|--------|----------------------|
| **Anthropic** | Admin API cost/usage report endpoints (requires **Admin API key** — create in Anthropic Console; standard `ANTHROPIC_API_KEY` is NOT enough) | HIGH. This directly closes repo priority 8 ("cost monitoring post first paid customer") — daily Claude spend vs ChatKit revenue = margin guard. Set an `alert_rules` row: daily anthropic cost > $5 → warning. |
| **Railway** | GraphQL usage/estimated-cost queries | MEDIUM — verify shape on our plan. |
| **Vercel** | Usage API | LOW/MEDIUM — plan-dependent. Fallback: `source='static-config'` row with the flat monthly plan price. |
| **Supabase** | Mostly flat plan pricing; billing endpoints are beta | Fallback: static-config monthly amount + DB-size trend as the overage early-warning. |

Design rule: **the cost dashboard must render usefully even if only Anthropic + static-config rows exist.** Every collector failure degrades to "no data this period", never a crash.

---

## 10. AI weekly digest (task=`digest`)

1. Aggregate last 7 days in SQL: per-project uptime % + incident list (+duration), p95 latency deltas, deploy counts + failures, cost per provider vs previous week, stats anomalies (>30% WoW swings), open unacknowledged incidents.
2. Feed the JSON aggregate to Claude — model `claude-haiku-4-5` (cheap, summarization task; upgrade only if quality disappoints). Prompt: ops digest, markdown, sections **Incidents / Availability / Costs / Trends / Recommended actions**, terse, numbers-first, flag anomalies, no filler.
3. Store in `techkit_digests` (with `input_summary` for audit), send via Resend (subject `TechKit weekly — <date range>: <n> incidents, $<cost>`), Telegram gets a 5-line summary + link to CC digest page.

---

## 11. Monitored roster (seed data)

Seed via SQL in migration 009 (or a `seed_techkit.sql`). Verify URLs with Martin before enabling checks marked ⚠️.

| Name | URL | Project link | Notes |
|------|-----|-------------|-------|
| mdntech.org home | `https://mdntech.org` | MDN-Tech | |
| mdntech.org /sk | `https://mdntech.org/sk` | MDN-Tech | SK agency landing |
| Command Center | `https://admin.mdntech.org/login` | MDN-Tech | login page = unauthenticated 200 |
| Customer portal | `https://app.mdntech.org/toolkit` | MDN-Tech | public route, no auth |
| ChatKit widget API | `https://mdntech.org/api/chat/<chatbot-id>/config` ⚠️ | MDN-Tech | pick a stable internal chatbot id; GET config = cheap, no Claude tokens |
| Kúrenie Turiec | `https://kurenieturiec.sk` | Melicharek | client |
| Royal Stroje | `https://royalstroje.sk` | RoyalStroje | client |
| Good Hair by Zane | `https://goodhairbyzane.com` | GoodHairByZane | client |
| Royal Works | `https://royal-works.vercel.app` ⚠️ | RoyalWorks | switches to royalworks.sk at go-live |
| Swarm Resistance | ⚠️ confirm production URL | SwarmResistance | |
| Rahadu SaaS Portal | ⚠️ later, once hosting lands | — | infra ownership pending Michal's answer |

Provider-level monitoring covers everything linked via `projects.{supabase_project_ref, railway_project_id, vercel_project_id}` — **Session A includes an audit pass to fill these columns for all current projects** (many were entered in Sessions 14–15; verify completeness).

---

## 12. Env vars & secrets

**Supabase Edge Function secrets** (`supabase secrets set`) — the poller's home:

| Var | Purpose | Status |
|-----|---------|--------|
| `CRON_SECRET` | pg_cron → poller auth (also mirrored in Vault for the cron SQL) | new — generate |
| `SUPABASE_MANAGEMENT_API_KEY` | provider adapter | exists in `.env.local` — copy |
| `RAILWAY_API_TOKEN` | provider adapter | exists — copy |
| `VERCEL_ACCESS_TOKEN` | provider adapter | exists — copy |
| `VERCEL_WEBHOOK_SECRET` | webhook signature verify | new — from Vercel webhook setup |
| `RESEND_API_KEY` | alert emails | new — create in Resend (domain already verified) |
| `TELEGRAM_BOT_TOKEN` | alerts bot | new — @BotFather |
| `TELEGRAM_ALERT_CHAT_ID` | target chat | new — Martin's chat id |
| `ANTHROPIC_ADMIN_API_KEY` | cost reports | ⚠️ still needed — Anthropic Console → Settings → Organization → Admin keys (Session C shipped without it; collector degrades until set) |
| `ANTHROPIC_API_KEY` | digest generation | exists — copy |
| `CRUX_API_KEY` | web vitals | new — free GCP key |
| `ALERT_EMAIL_TO` | recipient(s) | new |

Next.js (Vercel env) needs **no new secrets** — CC reads Postgres through existing Supabase clients; the "Live" tab keeps using the three provider tokens already present.

⚠️ **Security flag (do in Session A):** `.env.local` currently holds live provider/service-role/Anthropic tokens. Verify it is gitignored and has never been committed (`git log --all -- .env.local`); if it ever was, **rotate every token in it**. When copying tokens into Supabase secrets, prefer generating fresh scoped tokens over reusing the current ones.

---

## 13. Session plan

### Session A — Core: schema, poller, alerts, dashboard (the "never blind again" milestone)
- [ ] **A1** Migration `009_techkit.sql` (§4) incl. RLS + seed roster (§11, ⚠️ rows inactive until confirmed). Apply in Supabase.
- [ ] **A2** Audit + fill `projects.{supabase_project_ref, railway_project_id, vercel_project_id, production_url}` for all live projects.
- [ ] **A3** Scaffold `supabase/functions/` with `_shared/` (supabase client, notify helpers, provider adapters port per T8) + `techkit-poller` with `task=uptime` + state machine (§6.1) + Telegram/Resend delivery (§6.3).
- [ ] **A4** Telegram bot setup (@BotFather) + Resend API key + all secrets set; document in this file's §12 table (flip "new" → done).
- [ ] **A5** pg_cron: enable extensions, Vault secret, schedule `uptime` + `rollup` + `retention` (§5.3); `rollup` task implementation.
- [ ] **A6** CC UI: sidebar rename, `techkit/` overview (health grid from rollups + open incidents + ack), `techkit/incidents`, `techkit/endpoints` CRUD + "Check now", `techkit/live` (moved InfraClient), redirect from `/infrastructure`.
- [ ] **A7** Security pass (§12 flag): gitignore/history check on `.env.local`, rotate if needed.
- [ ] **A8** Kill test: take a target down (or point a temp endpoint at a 404), verify: incident opens after 2 failures → Telegram + email arrive → recovery closes it → CC shows the whole lifecycle.

**Exit criteria:** every live MDN surface + client site is checked every 5 min from infrastructure that isn't Vercel; a real outage produces a Telegram message in ≤ ~12 min; incidents are visible + acknowledgeable in CC.

### Session B — Providers, deploy feed, stats
- [ ] **B1** `task=providers` (hourly persistence of health/metrics) + metric alert-rule evaluation (§6.2).
- [ ] **B2** `techkit-webhook` + Vercel account webhook + Railway project webhooks + `deploy_events` + deploy-correlation on incidents (§5.2).
- [ ] **B3** `task=stats`: CrUX + Supabase usage + Railway metrics + ChatKit rollup; verify Vercel analytics API availability (mark result here).
- [ ] **B4** CC: `techkit/stats` page + last-deploy column on the overview grid.

**Exit criteria:** provider health has 7-day history; production deploys appear in CC within a minute; stats page shows vitals + DB size + ChatKit token/latency rollups.

### Session C — Costs ✅ SHIPPED + LIVE 2026-07-12 (Session 39) — one Martin step open
- [x] **C1** `task=costs` collector live (poller v10): Anthropic Admin-API daily cost report (31-day self-healing upsert window) + static-config rows for Supabase/Vercel ($0 free tiers, `STATIC_MONTHLY_COSTS` map in the poller). Railway cost API deferred (workspace-token/plan-dependent shape unverified — flat plan fee goes in via the manual form). ⚠️ **`ANTHROPIC_ADMIN_API_KEY` not yet created** — collector degrades gracefully until Martin makes one (see TECHKIT-SETUP.md Session C).
- [x] **C2** `techkit/costs` page + Costs tab: MTD tiles, per-provider breakdown, daily Claude-spend bars, 6-month trend, manual-entry form, cost-rule list.
- [x] **C3** Default cost rules seeded via migration 014 (Anthropic daily > $5 warning / total MTD > $100 warning; `metric_name` = `daily_cost`|`mtd_cost` selects the aggregation). Also in 014: `infra_costs` unique constraint recreated `NULLS NOT DISTINCT` (account-level upserts would otherwise duplicate) + `techkit-costs` cron (15 6 * * *).

**Exit criteria:** MTD spend per provider visible ✅; Claude spend tracked daily — pipeline live, data starts when the Admin key lands (repo priority 8 closes then).

### Session D — AI digest + polish
- [ ] **D1** `task=digest` (§10) + `techkit/digests` page + Monday cron.
- [ ] **D2** Anomaly flags in digest input (WoW swings); unacked-incident nagging (24h-old open incidents re-ping Telegram).
- [ ] **D3** Polish: empty states, mobile pass on overview, docs — update repo `handoff.md` + README mention. If the CC-wide design refresh (§7.4) hasn't happened yet, decide here whether to extend the TechKit design language to the rest of CC.

### Backlog (post-MVP, do not build now)
- Customer-facing per-project status pages (`status.mdntech.org` or portal module) — **productization path**; pairs with the monitoring-retainer offer for clients (Royal Stroje / Melichárek / Zane).
- Response-time SLO reports per client (retainer artifact).
- MarketKit cross-links (marketing events annotated on TechKit charts and vice versa).
- Agent-phase integration (v2 plan Phases 6–9): the Telegram bot from Session A becomes the agent channel.
- Browser push / PWA notifications for CC.

---

## 14. Non-goals (MVP)

- No GA4/GSC/attribution/content metrics (MarketKit).
- No customer visibility of any TechKit surface (backlog: status pages).
- No auto-remediation (restart service, rollback) — alert + human only.
- No full APM/tracing (Sentry-style error capture is a possible later add; out of scope now).
- No separate monitoring SaaS ambitions yet — internal superadmin first, productize later if the retainer angle proves out.
- Don't rebuild ChatKit analytics — TechKit only *aggregates* existing data cross-project.

## 15. Open questions (answer before/at each session)

1. Swarm Resistance production URL + Royal Works domain go-live date (roster ⚠️ rows). — *Martin, Session A*
2. Vercel plan (Hobby/Pro)? Affects nothing critical (T2 keeps cron off Vercel) but decides whether Vercel usage/analytics APIs are worth wiring in B3/C1.
3. Alert email recipient(s) — just Martin, or also CTO? Same for Telegram (private chat vs small group).
4. Cost alert thresholds (C3 defaults are placeholders).
5. Rahadu SaaS Portal monitoring — add once Michal's infra answer lands (vault: Rahadu open thread).

---

*Vault cross-links (added at next Mind Palace /wrap): MDN-Tech wiki → this brief; decisions.md Session 14 entry; MarketKit repo-decision reversal.*
