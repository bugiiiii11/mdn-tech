# M.D.N Tech Command Center -- Development Plan

**Version:** 1.0
**Date:** 2026-03-21
**Status:** Draft

---

## Architecture Decision

### Subdomain Routing (app.mdntech.org)

The Command Center lives in this same repo but runs on a separate subdomain. This is achieved with Next.js middleware-based hostname routing:

```
mdntech.com / mdntech.org     -->  Marketing site (existing)
app.mdntech.org                -->  Command Center (new)
```

**How it works:**
- `middleware.ts` inspects `request.headers.get('host')`
- Requests to `app.mdntech.org` are rewritten to `/command-center/*` routes
- Requests to `mdntech.com` serve existing routes as-is
- Both share the same deployment, same codebase, same `next build`

**Directory structure:**

```
app/
  (marketing)/              <-- Existing site (route group, no URL segment)
    page.tsx                <-- mdntech.com homepage
    blog/
    privacy/
    terms/
  (command-center)/         <-- New: Command Center
    layout.tsx              <-- Separate layout (no stars, no marketing nav)
    dashboard/
      page.tsx              <-- app.mdntech.org/dashboard
    projects/
      page.tsx              <-- app.mdntech.org/projects
      [id]/page.tsx
      new/page.tsx
    team/
      page.tsx
    infrastructure/
      page.tsx
      costs/page.tsx
      alerts/page.tsx
    communications/
      page.tsx
    knowledge/              <-- Skills, docs, design system reference
      page.tsx
      [slug]/page.tsx
    settings/
      page.tsx
      integrations/page.tsx
      thresholds/page.tsx
```

### DNS Setup (Vercel)

On Vercel dashboard:
1. Add `app.mdntech.org` as a domain to the same project
2. DNS: CNAME `app` -> `cname.vercel-dns.com`
3. No separate deployment needed

---

## API Connection Architecture

### One Token Per Provider (Team-Level Access)

```
                    Command Center
                         |
          +--------------+--------------+
          |              |              |
   Supabase Mgmt    Railway API    Vercel API
   (1 API key)      (1 team token) (1 team token)
          |              |              |
    +-----+-----+   +---+---+    +----+----+
    |     |     |   |   |   |    |    |    |
   Proj  Proj  Proj Proj Proj   Proj Proj Proj
    A     B     C    A    B      A    B    C
```

**Provider tokens stored in:** Supabase Vault (encrypted) or environment variables for Phase 1.

**Adding a new project = 1 form submission:**
- Project name, client name
- Supabase project ref (from Supabase dashboard URL)
- Railway project ID (from Railway dashboard URL)
- Vercel project ID (from Vercel dashboard URL)
- Done. Monitoring starts automatically.

### API Details

**Supabase Management API:**
- Base: `https://api.supabase.com`
- Auth: `Bearer <access_token>` (generate at supabase.com/dashboard/account/tokens)
- Key endpoints:
  - `GET /v1/projects` -- list all projects
  - `GET /v1/projects/{ref}` -- project details
  - `GET /v1/projects/{ref}/health` -- health check
  - `GET /v1/projects/{ref}/analytics` -- API metrics
- Rate limit: 60 req/min

**Railway API (GraphQL):**
- Endpoint: `https://backboard.railway.com/graphql/v2`
- Auth: `Bearer <team_token>` (generate at railway.com/account/tokens)
- No need for "GraphQL knowledge" -- we write the queries once as string templates
- Key queries:
  - `projects` -- list all projects
  - `project(id: "...")` -- project details with services
  - `deployments(projectId: "...")` -- deployment history
  - `metrics(...)` -- CPU, memory, network
- Rate limit: 1000 req/day

**Vercel API (REST):**
- Base: `https://api.vercel.com`
- Auth: `Bearer <token>` (generate at vercel.com/account/tokens, scope to team)
- Key endpoints:
  - `GET /v9/projects` -- list all projects
  - `GET /v13/deployments` -- deployment list
  - `GET /v1/web/analytics` -- web vitals
  - `GET /v1/usage` -- bandwidth, functions
- Rate limit: 500 req/min

---

## Tech Stack Additions

What we need to add to the existing Next.js project:

| Package | Purpose | Phase |
|---------|---------|-------|
| `@supabase/supabase-js` | Database client + Auth + Realtime | 1 |
| `@supabase/ssr` | Next.js SSR auth helpers | 1 |
| `shadcn/ui` (already CLI-based) | UI components (tables, cards, dialogs, forms) | 1 |
| `recharts` | Charts for metrics, costs, timelines | 2 |
| `date-fns` | Date formatting and manipulation | 1 |
| `zod` | Form validation and API response parsing | 1 |
| `react-hook-form` | Form management | 1 |
| `gray-matter` | Parse .md frontmatter for knowledge base | 2 |
| `react-markdown` + `remark-gfm` | Render .md content in knowledge base | 2 |

**Not needed:**
- No ORM (Supabase client is sufficient)
- No state management library (React Server Components + Supabase Realtime)
- No separate backend (Next.js API routes + Supabase Edge Functions)

---

## Database Schema (Supabase)

### Core Tables

```sql
-- Projects registry
create table projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  client_name text,
  status text not null default 'discovery',
    -- discovery | design | development | testing | deployed | maintenance | paused | completed
  priority text not null default 'medium',
    -- critical | high | medium | low
  start_date date,
  target_end_date date,
  actual_end_date date,
  budget_total decimal(12,2),
  budget_spent decimal(12,2) default 0,
  description text,
  tech_stack text[] default '{}',
  repository_url text,
  staging_url text,
  production_url text,
  -- Provider links (one ID per provider)
  supabase_project_ref text,
  railway_project_id text,
  vercel_project_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Team members (extends Supabase Auth users)
create table team_members (
  id uuid primary key references auth.users(id),
  full_name text not null,
  role text not null default 'engineer',
    -- admin | engineer | viewer
  avatar_url text,
  max_concurrent_projects int default 3,
  skills text[] default '{}',
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Project assignments (many-to-many)
create table project_assignments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  member_id uuid references team_members(id) on delete cascade,
  assigned_at timestamptz default now(),
  unassigned_at timestamptz,
  unique(project_id, member_id)
);

-- Milestones
create table milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  name text not null,
  description text,
  due_date date,
  status text default 'pending',
    -- pending | in_progress | completed | overdue
  assigned_to uuid references team_members(id),
  sort_order int default 0,
  completed_at timestamptz,
  created_at timestamptz default now()
);

-- Client communications
create table communications (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  author_id uuid references team_members(id),
  channel text not null,
    -- email | call | slack | whatsapp | meeting | other
  direction text not null,
    -- inbound | outbound
  subject text,
  summary text,
  action_items text,
  contact_name text,
  occurred_at timestamptz not null,
  attachments jsonb default '[]',
  created_at timestamptz default now()
);
```

### Infrastructure Tables

```sql
-- Infrastructure metrics (time-series)
create table infra_metrics (
  id bigint generated always as identity primary key,
  project_id uuid references projects(id) on delete cascade,
  provider text not null,          -- supabase | railway | vercel
  metric_name text not null,       -- cpu_usage | memory_usage | request_count | error_rate | etc.
  metric_value decimal(15,4),
  unit text,                       -- percent | bytes | count | ms
  recorded_at timestamptz not null default now()
);

-- Index for fast time-range queries
create index idx_infra_metrics_lookup
  on infra_metrics (project_id, provider, metric_name, recorded_at desc);

-- Partition by month for performance (optional, add when data grows)

-- Infrastructure costs (daily snapshots)
create table infra_costs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  provider text not null,
  cost_amount decimal(10,2) not null,
  currency text default 'USD',
  period_start date not null,
  period_end date not null,
  recorded_at timestamptz default now(),
  unique(project_id, provider, period_start)
);

-- Alert rules
create table alert_rules (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  metric_name text not null,
  provider text not null,
  condition text not null,         -- gt | lt | eq
  threshold decimal(15,4) not null,
  severity text default 'warning', -- info | warning | critical
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Alert events (triggered alerts)
create table alert_events (
  id uuid primary key default gen_random_uuid(),
  rule_id uuid references alert_rules(id),
  project_id uuid references projects(id) on delete cascade,
  severity text not null,
  title text not null,
  message text,
  status text default 'triggered', -- triggered | acknowledged | resolved
  triggered_at timestamptz default now(),
  acknowledged_at timestamptz,
  resolved_at timestamptz,
  acknowledged_by uuid references team_members(id)
);

-- Activity log (audit trail)
create table activity_log (
  id bigint generated always as identity primary key,
  user_id uuid references team_members(id),
  action text not null,            -- project.created | milestone.completed | alert.acknowledged
  entity_type text,                -- project | milestone | communication | alert
  entity_id uuid,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);
```

### Row Level Security (RLS)

```sql
-- Enable RLS on all tables
alter table projects enable row level security;
alter table team_members enable row level security;
-- ... (all tables)

-- Policy: authenticated users can read all projects
create policy "Authenticated users can view projects"
  on projects for select
  to authenticated
  using (true);

-- Policy: only admins can insert/update/delete projects
create policy "Admins can manage projects"
  on projects for all
  to authenticated
  using (
    exists (
      select 1 from team_members
      where id = auth.uid() and role = 'admin'
    )
  );

-- Policy: engineers can update projects they're assigned to
create policy "Engineers can update assigned projects"
  on projects for update
  to authenticated
  using (
    exists (
      select 1 from project_assignments
      where project_id = projects.id
        and member_id = auth.uid()
        and unassigned_at is null
    )
  );
```

---

## Knowledge Base Architecture

Skills and documentation stored as `.md` files, rendered in the Command Center.

### File Structure

```
command-center/
  knowledge/
    skills/
      start.md           <-- Copies/symlinks from .claude/skills
      wrap.md
      test.md
      doc-update.md
      save.md
      seo-audit.md        <-- Top external skills we use
      seo-technical.md
    docs/
      design-system.md    <-- Unified design doc (fonts, colors, effects)
      stack-guide.md      <-- Our standard stack setup guide
      project-template.md <-- How to spin up a new project
      api-patterns.md     <-- Common API patterns we reuse
    howto/
      railway-deploy.md
      supabase-setup.md
      vercel-config.md
```

### Frontmatter Format

```markdown
---
title: "Start Skill"
category: skill | doc | howto
tags: [session, initialization]
updated: 2026-03-21
author: Martin
---

Content here...
```

### Rendering

- `gray-matter` parses frontmatter
- `react-markdown` + `remark-gfm` renders content
- Filterable by category and tags in the UI
- Search across all knowledge base content

---

## Phased Development Plan

### Phase 1 -- Foundation & Daily Driver (Weeks 1-3)

**Goal:** Team opens the Command Center daily. Project registry is the source of truth.

#### Week 1: Infrastructure Setup

| Task | Details |
|------|---------|
| Supabase project setup | Create project, configure auth (email + magic link) |
| Database schema | Run all core table migrations (projects, team_members, assignments, milestones) |
| RLS policies | Implement role-based access on all tables |
| Middleware routing | `middleware.ts` for `app.mdntech.org` -> `(command-center)` routing |
| Command Center layout | Sidebar nav, dark theme matching MDN brand, no stars/marketing elements |
| Auth flow | Login page, session management, protected routes |
| Vercel DNS | Add `app.mdntech.org` domain, configure CNAME |

**Key files to create:**
```
middleware.ts
app/(command-center)/layout.tsx
app/(command-center)/login/page.tsx
lib/supabase/client.ts
lib/supabase/server.ts
lib/supabase/middleware.ts
supabase/migrations/001_core_tables.sql
```

#### Week 2: Project Management

| Task | Details |
|------|---------|
| Project list page | Table view with status badges, priority, filters, search |
| Project create/edit | Form with all fields from data model, provider ID inputs |
| Project detail -- Overview tab | Status, dates, progress bar, assigned engineers, quick links |
| Project detail -- Timeline tab | Milestone list with add/edit/reorder, due date tracking |
| Team page | Member list, skills, current assignments, capacity indicator |
| Assignment management | Assign/unassign engineers from project detail |

**Key files to create:**
```
app/(command-center)/projects/page.tsx
app/(command-center)/projects/[id]/page.tsx
app/(command-center)/projects/new/page.tsx
app/(command-center)/team/page.tsx
components/command-center/project-card.tsx
components/command-center/project-form.tsx
components/command-center/milestone-list.tsx
components/command-center/team-member-card.tsx
```

#### Week 3: Dashboard Home & Polish

| Task | Details |
|------|---------|
| Dashboard home | Active project count, status breakdown, overdue milestones |
| "Today" view | Per-engineer: your projects, upcoming deadlines, recent activity |
| Activity feed | Last 48h of project updates (auto-logged from CRUD operations) |
| Team workload summary | Utilization bars per engineer |
| Seed data | Enter all 10 projects (5 active + 5 analysis) |
| Progressive disclosure | Feature toggle system for hiding advanced panels |

**Key files to create:**
```
app/(command-center)/dashboard/page.tsx
components/command-center/today-view.tsx
components/command-center/activity-feed.tsx
components/command-center/workload-chart.tsx
```

**Phase 1 exit criteria:**
- All 3 team members have accounts and can log in
- All 10 projects registered with status, milestones, and assignments
- Each engineer sees their "Today" view on login

---

### Phase 2 -- Budget, Communications & Knowledge (Weeks 4-6)

**Goal:** Financial visibility and communication continuity. Knowledge base live.

#### Week 4: Budget Tracking

| Task | Details |
|------|---------|
| Budget tab on project detail | Total vs. spent progress bar, burn rate |
| Auto health meters | Yellow at 80% budget, red at 100%+ |
| Budget widgets on dashboard | Month-to-date spend, at-risk projects |
| Baseline vs. actual timeline | Original plan overlay on milestone timeline |
| Profitability tracking | Cost vs. revenue per project (if revenue data available) |
| Utilization rates | Billable vs. non-billable capacity per engineer |

#### Week 5: Communication Log

| Task | Details |
|------|---------|
| Communication CRUD | Quick-add form (< 30 seconds to log) |
| Timeline view per project | Chronological feed with channel icons |
| Global communication feed | Cross-project recent interactions |
| Search and filters | By keyword, channel, direction, date range |
| Attachment support | Upload to Supabase Storage, link to entries |
| Action item tracking | Flag entries with open action items |

#### Week 6: Knowledge Base

| Task | Details |
|------|---------|
| Knowledge base page | List all .md files with category filters |
| Detail view | Render markdown with syntax highlighting |
| Search | Full-text search across all knowledge content |
| Seed content | Skills docs, design system doc, stack guide |
| CRUD for docs | Create/edit .md files from the UI (writes to repo or Supabase) |

**Phase 2 exit criteria:**
- Budget health visible at a glance for all projects
- Every client interaction logged and searchable
- Knowledge base has 10+ useful documents
- Team uses it as the "where did we put that?" answer

---

### Phase 3 -- Infrastructure Monitoring (Weeks 7-10)

**Goal:** Full observability across Supabase, Railway, and Vercel for every project.

#### Week 7: Provider Integration Layer

| Task | Details |
|------|---------|
| Provider adapter pattern | Abstract interface for all 3 providers |
| Supabase Management API client | Health, analytics, storage, costs |
| Railway GraphQL client | Services, deployments, metrics, costs |
| Vercel REST client | Deployments, analytics, web vitals, costs |
| Settings page -- Integrations | UI to enter/test API tokens |
| Secure token storage | Environment variables (Phase 1), Supabase Vault (later) |

**Architecture:**
```
lib/providers/
  types.ts              <-- Shared interfaces (HealthStatus, Metric, Cost)
  supabase-provider.ts  <-- Supabase Management API adapter
  railway-provider.ts   <-- Railway GraphQL adapter
  vercel-provider.ts    <-- Vercel REST adapter
  index.ts              <-- Factory: getProvider(name)

app/api/command-center/
  infra/
    [projectId]/
      health/route.ts   <-- GET: fetch health for one project
      metrics/route.ts  <-- GET: fetch metrics for one project
      costs/route.ts    <-- GET: fetch costs for one project
    sync/route.ts       <-- POST: trigger full sync (cron target)
```

#### Week 8: Health Dashboard

| Task | Details |
|------|---------|
| Health status engine | Green/yellow/red computation per provider per project |
| Global infrastructure grid | All projects with 3 provider health badges each |
| Project infrastructure tab | Three-panel layout (one per provider) |
| Sparkline charts | Last 24h mini-charts for key metrics |
| Time range selector | 24h / 7d / 30d / 90d toggle |
| Stale data indicator | "Last updated X min ago" with warning if stale |

#### Week 9: Cost Analytics

| Task | Details |
|------|---------|
| Cost analytics page | Cross-project cost comparison (bar chart) |
| Monthly cost trends | Line chart, last 6 months |
| Provider breakdown | Donut chart per project |
| Budget vs. infra cost | Overlay infra costs on project budget tracking |
| Cost projections | Simple linear projection for month-end estimate |

#### Week 10: Data Collection Workers

| Task | Details |
|------|---------|
| Polling worker | Supabase Edge Function or Next.js cron route |
| Health polling | Every 5 minutes for all active projects |
| Cost polling | Every 1 hour |
| Metrics storage | Write to infra_metrics table with proper indexing |
| Data retention | Auto-cleanup: raw > 30 days, keep hourly aggregates |
| Webhook receivers | Vercel deployment webhooks, Railway deploy webhooks |
| Maintenance windows | Schedule suppression of alerts during planned work |

**Phase 3 exit criteria:**
- Infrastructure health visible for all connected projects
- Cost tracking accurate to within 24h
- Alerts fire before clients notice issues

---

### Phase 4 -- Alerts, Intelligence & Notifications (Weeks 11-14)

**Goal:** Proactive alerting and AI-powered insights.

#### Week 11-12: Alert System

| Task | Details |
|------|---------|
| Alert rules engine | Configurable thresholds per metric per project |
| In-app notification panel | Bell icon with unread count, notification list |
| Alert event lifecycle | Triggered -> Acknowledged -> Resolved |
| Incident timeline | Chronological view of events per incident |
| Browser push notifications | For critical alerts when dashboard is open |
| Alert silencing rules | Suppress during deploys or maintenance windows |
| Default alert rules | Pre-configured sensible defaults for new projects |

#### Week 13: AI-Powered Features

| Task | Details |
|------|---------|
| AI weekly digest | Auto-summarize project activity using Claude API |
| Role-based dashboards | Admin sees cost/revenue focus; engineer sees tasks/infra |
| Communication summarizer | AI-generated summary of recent client interactions |
| Anomaly flagging | Highlight unusual metric patterns |

#### Week 14: Notification Channels

| Task | Details |
|------|---------|
| Webhook output | Generic webhook for any alert event |
| Slack integration | Post critical alerts to a Slack channel |
| Telegram bot | Optional: forward alerts to Telegram |
| Email digest | Weekly email summary of all project health |
| Keyboard shortcuts | Navigate the entire dashboard without mouse |

**Phase 4 exit criteria:**
- Zero client-reported issues that the Command Center didn't catch first
- Weekly digest eliminates need for status meetings
- Engineers receive alerts in their preferred channel

---

### Phase 5 -- Integrations & Automation (Weeks 15-18)

**Goal:** Connect to the broader engineering workflow.

| Task | Details |
|------|---------|
| GitHub sync | Link commits/PRs to milestones automatically |
| Smart assignment suggestions | AI suggests best engineer based on skills + capacity |
| AI client update drafts | Auto-generate client status emails from project data |
| Revenue forecasting | Predict monthly revenue from pipeline |
| Change request tracking | Log scope changes with budget/timeline impact |
| Project knowledge base | Per-project wiki (markdown) |
| Activity audit log | Complete audit trail of all actions |
| API for external tools | REST API for other tools to query Command Center data |

---

### Phase 6 -- Scale & Polish (Weeks 19-22)

| Task | Details |
|------|---------|
| Customizable panel layouts | Drag-and-drop dashboard widgets |
| Multiple data views | Kanban, Table, Timeline, Calendar for projects |
| Mobile-responsive / PWA | Check project status on mobile |
| Embeddable status widget | Mini status badge for client-facing use |
| Performance optimization | Load testing, query optimization |
| Data export | CSV, PDF report generation |
| Onboarding documentation | Team guide for using the Command Center |

---

## New Project Onboarding Flow

Since all projects share the same stack, adding a project should take < 2 minutes:

```
1. Click "New Project" in Command Center
2. Fill in:
   - Project name
   - Client name
   - Status (discovery/design/development/etc.)
   - Priority
   - Start date, target end date
   - Budget
3. Connect infrastructure (paste IDs from provider dashboards):
   - Supabase project ref  (from URL: supabase.com/dashboard/project/[THIS_PART])
   - Railway project ID     (from URL: railway.app/project/[THIS_PART])
   - Vercel project ID      (from URL: vercel.com/team/[THIS_PART])
4. Assign engineer(s)
5. Add initial milestones
6. Done -- monitoring starts automatically
```

---

## File Organization Summary

```
M.D.N-Tech-main/
  app/
    (marketing)/                 <-- Existing site (moved into route group)
      page.tsx
      blog/
      privacy/
      terms/
      not-found.tsx
    (command-center)/            <-- New: Command Center
      layout.tsx                 <-- CC-specific layout (sidebar, no stars)
      login/page.tsx
      dashboard/page.tsx
      projects/
      team/
      communications/
      infrastructure/
      knowledge/
      settings/
    api/
      subscribe/route.ts         <-- Existing
      command-center/             <-- New: CC API routes
        auth/callback/route.ts
        infra/
        projects/
        sync/route.ts
  components/
    main/                        <-- Existing marketing components
    sub/                         <-- Existing marketing sub-components
    command-center/              <-- New: CC components
      layout/
        sidebar.tsx
        header.tsx
      projects/
      team/
      infrastructure/
      shared/                    <-- Reusable CC components
  lib/
    motion.ts                    <-- Existing
    utils.ts                     <-- Existing
    supabase/                    <-- New
      client.ts
      server.ts
      middleware.ts
    providers/                   <-- New: infrastructure adapters
      types.ts
      supabase-provider.ts
      railway-provider.ts
      vercel-provider.ts
  command-center/
    knowledge/                   <-- .md files for knowledge base
      skills/
      docs/
      howto/
    DEVELOPMENT-PLAN.md          <-- This file
  middleware.ts                  <-- New: subdomain routing
  supabase/
    migrations/                  <-- Database migrations
```

---

## Getting Started (Pre-Phase 1)

Before Phase 1 begins, these one-time setup tasks are needed:

| # | Task | Who | Time |
|---|------|-----|------|
| 1 | Create Supabase project for Command Center | Admin | 5 min |
| 2 | Generate Supabase Management API token | Admin | 2 min |
| 3 | Generate Railway team API token | Admin | 2 min |
| 4 | Generate Vercel team access token | Admin | 2 min |
| 5 | Add `app.mdntech.org` domain in Vercel | Admin | 5 min |
| 6 | Configure DNS (CNAME for `app` subdomain) | Admin | 5 min |
| 7 | Add env vars to `.env.local` and Vercel | Admin | 5 min |

**Environment variables needed:**
```env
# Supabase (Command Center database)
NEXT_PUBLIC_SUPABASE_URL=https://[ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Provider API tokens (for infrastructure monitoring)
SUPABASE_MANAGEMENT_API_KEY=sbp_...
RAILWAY_API_TOKEN=...
VERCEL_ACCESS_TOKEN=...

# AI (for Phase 4)
ANTHROPIC_API_KEY=sk-ant-...
```

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Marketing site breaks during restructuring | Move to route groups first, test thoroughly before adding CC routes |
| Supabase Management API rate limits (60/min) | Cache aggressively, poll at 5-min intervals, batch where possible |
| Railway API daily limit (1000/day) | Poll at 15-min intervals max, cache results, prioritize active projects |
| Scope creep | Strict phase gates -- each phase has exit criteria that must be met |
| Auth complexity | Start with email/magic link only, add SSO later if needed |
| Provider API changes | Adapter pattern isolates changes to one file per provider |

---

*This plan is a living document. Update as development progresses.*
