# M.D.N Tech -- Command Center

## Product Requirements Document (PRD)

**Document Version:** 1.0
**Date:** March 21, 2026
**Author:** M.D.N Tech Engineering
**Status:** Draft
**Classification:** Internal Only

---

## 1. Executive Summary

The M.D.N Tech Command Center is an internal dashboard that serves as the single source of truth for all engineering operations. It consolidates project management, team workload visibility, client communications, budget tracking, and full infrastructure observability (Supabase, Railway, Vercel) into one unified interface.

Built on Next.js + Supabase to align with M.D.N Tech's core stack, the Command Center replaces ad-hoc tracking with a purpose-built system designed for a team managing 5-15 active projects simultaneously.

---

## 2. Problem Statement

M.D.N Tech operates as a lean team of full-stack AI engineers, each owning entire project lifecycles end-to-end. As the project portfolio grows, several operational gaps emerge:

- **No centralized project visibility** -- project status, timelines, and blockers live in scattered locations or in engineers' heads.
- **No infrastructure health overview** -- checking Supabase, Railway, and Vercel dashboards individually is time-consuming and reactive rather than proactive.
- **No cost tracking** -- infrastructure and project costs are not monitored in real time, making budget management difficult.
- **No team workload awareness** -- assigning new projects lacks data on current engineer capacity.
- **No client communication history** -- interactions are spread across email, Slack, and calls with no unified log.

The Command Center solves all of these by providing a single operational hub.

---

## 3. Goals & Success Metrics

### 3.1 Goals

| Goal | Description |
|------|-------------|
| **Operational Visibility** | Every active project's status, health, and timeline is visible at a glance |
| **Infrastructure Confidence** | Real-time awareness of Supabase, Railway, and Vercel health across all projects |
| **Cost Control** | Track infrastructure and project costs against budgets with early warnings |
| **Team Efficiency** | Understand workload distribution to optimize assignments |
| **Communication Continuity** | Maintain a searchable log of all client interactions |

### 3.2 Success Metrics

| Metric | Target |
|--------|--------|
| Time to assess all-project health | < 30 seconds (from dashboard load) |
| Infrastructure incidents detected before client report | > 90% |
| Average cost variance from budget | < 10% per project |
| Team adoption (daily active usage) | 100% of engineers |
| Mean time to find client communication history | < 15 seconds |

---

## 4. Users & Access

### 4.1 User Roles

| Role | Description | Access Level |
|------|-------------|--------------|
| **Admin** | Founders / team leads | Full access -- all projects, settings, team management, billing data |
| **Engineer** | Full-stack AI engineers | Full access to assigned projects, read access to all projects, infrastructure monitoring |
| **Viewer** | Limited internal stakeholders | Read-only access to project status and timelines |

### 4.2 Authentication

- Supabase Auth with email/password + magic link
- Row Level Security (RLS) enforced at the database level
- Session management via Supabase Auth helpers for Next.js
- Optional: Add SSO (Google Workspace) in a future phase

---

## 5. Feature Requirements

### 5.1 Dashboard Home -- Operations Overview

The landing page provides an at-a-glance summary of the entire operation.

**Requirements:**

- Display total active projects with status breakdown (on track / at risk / blocked / completed)
- Show a combined infrastructure health indicator (green / yellow / red) for Supabase, Railway, and Vercel across all projects
- Surface the top 3 most urgent items: overdue milestones, infrastructure alerts, or budget warnings
- Display team workload summary: engineer availability as a heat map or utilization bar
- Show month-to-date total infrastructure cost vs. budget
- Recent activity feed: latest project updates, deployments, and client messages (last 48 hours)

---

### 5.2 Project Management

#### 5.2.1 Project Registry

Each project is a first-class entity in the system.

**Project Data Model:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `name` | string | Project name |
| `client_name` | string | Client or company name |
| `status` | enum | `discovery` / `design` / `development` / `testing` / `deployed` / `maintenance` / `paused` / `completed` |
| `priority` | enum | `critical` / `high` / `medium` / `low` |
| `start_date` | date | Project kick-off date |
| `target_end_date` | date | Expected delivery date |
| `actual_end_date` | date | Actual completion (nullable) |
| `budget_total` | decimal | Total agreed project budget (USD) |
| `budget_spent` | decimal | Cumulative spend to date |
| `description` | text | Brief project summary |
| `tech_stack` | text[] | Array of technologies used |
| `repository_url` | string | GitHub repo link |
| `staging_url` | string | Staging environment URL |
| `production_url` | string | Production URL |
| `supabase_project_id` | string | Linked Supabase project ref |
| `railway_project_id` | string | Linked Railway project ID |
| `vercel_project_id` | string | Linked Vercel project ID |
| `assigned_engineers` | UUID[] | Array of team member IDs |
| `created_at` | timestamp | Record creation |
| `updated_at` | timestamp | Last modification |

#### 5.2.2 Project Detail View

Each project has a dedicated page with tabbed sections:

**Overview Tab:**
- Status badge, priority, assigned engineers
- Progress bar based on completed milestones vs. total
- Key dates: start, target end, days remaining / overdue
- Quick links to repo, staging, production
- Infrastructure health for this specific project (Supabase / Railway / Vercel)

**Timeline & Milestones Tab:**
- Gantt-style or vertical timeline view of milestones
- Each milestone has: name, description, due date, status (pending / in progress / completed / overdue), assigned engineer
- Ability to add, edit, reorder milestones
- Visual indicator when milestone is overdue

**Budget Tab:**
- Total budget vs. spent (progress bar + percentage)
- Cost breakdown by category: infrastructure, third-party services, labor hours
- Monthly burn rate chart
- Alert threshold: configurable (e.g., warn at 80% budget consumed)

**Communication Log Tab:**
- See Section 5.4 below

**Infrastructure Tab:**
- See Section 5.5 below (filtered to this project)

#### 5.2.3 Project List View

- Sortable and filterable table of all projects
- Filters: status, priority, assigned engineer, date range
- Search by project name or client name
- Bulk status update capability
- Export to CSV

---

### 5.3 Team & Workload Management

#### 5.3.1 Team Member Data Model

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `full_name` | string | Engineer's name |
| `email` | string | Email address |
| `role` | enum | `admin` / `engineer` / `viewer` |
| `avatar_url` | string | Profile image |
| `max_concurrent_projects` | integer | Capacity cap (default: 3) |
| `skills` | text[] | Skill tags (e.g., `react`, `solidity`, `unity`) |
| `is_active` | boolean | Currently active team member |
| `created_at` | timestamp | Record creation |

#### 5.3.2 Workload Dashboard

- Per-engineer view: current project assignments, total active count vs. capacity
- Utilization indicator: percentage of capacity used (projects assigned / max concurrent)
- Color coding: green (< 70%), yellow (70-90%), red (> 90%)
- Drill-down to see specific project assignments per engineer
- Skill-based filtering: find available engineers with specific expertise

#### 5.3.3 Assignment Management

- Assign / unassign engineers to projects from the project detail page or team page
- Prevent over-assignment: warning when assigning beyond `max_concurrent_projects`
- Assignment history: log of when engineers were added/removed from projects

---

### 5.4 Client Communication Log

#### 5.4.1 Communication Entry Data Model

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `project_id` | UUID | Foreign key to project |
| `author_id` | UUID | Team member who logged it |
| `channel` | enum | `email` / `call` / `slack` / `whatsapp` / `meeting` / `other` |
| `direction` | enum | `inbound` / `outbound` |
| `subject` | string | Brief subject line |
| `summary` | text | Summary of communication |
| `action_items` | text | Follow-up actions (if any) |
| `contact_name` | string | Client contact person |
| `occurred_at` | timestamp | When the communication happened |
| `created_at` | timestamp | When the log was created |
| `attachments` | jsonb | Array of file references (stored in Supabase Storage) |

#### 5.4.2 Communication Features

- Quick-add form: log a communication in under 30 seconds
- Timeline view per project: chronological feed of all interactions
- Global communication feed: recent interactions across all projects
- Search across all communications by keyword, client, or channel
- Filter by channel, direction, date range, project
- Action item extraction: flag entries that have open action items
- Attachment support: upload meeting notes, contracts, screenshots to Supabase Storage

---

### 5.5 Infrastructure Monitoring -- Full Observability

This is the core "command center" capability. The dashboard monitors three infrastructure providers across all projects.

#### 5.5.1 Provider Integration Architecture

Each provider exposes APIs that the Command Center polls on a scheduled basis and/or receives via webhooks.

**Supabase Monitoring (per project):**

| Metric Category | Specific Metrics |
|-----------------|-----------------|
| **Database Health** | Connection pool usage, active connections, database size, replication lag |
| **API Performance** | Request count, average latency, error rate (4xx / 5xx), REST vs. GraphQL breakdown |
| **Auth** | Active users, sign-up rate, failed auth attempts |
| **Storage** | Total storage used, bandwidth consumption, object count |
| **Realtime** | Active subscriptions, message throughput |
| **Resource Usage** | CPU utilization, memory usage, disk I/O |
| **Costs** | Current billing period spend, projected monthly cost, per-project cost attribution |
| **Logs** | Recent error logs, slow query logs (> 1s), failed migrations |

**Railway Monitoring (per project):**

| Metric Category | Specific Metrics |
|-----------------|-----------------|
| **Service Health** | Deployment status, uptime percentage, restart count |
| **Performance** | CPU usage, memory usage, network I/O |
| **Deployments** | Recent deployments, deploy duration, rollback history |
| **Logs** | Application logs (error-level filtering), build logs |
| **Resource Usage** | Compute hours consumed, egress bandwidth |
| **Costs** | Current month spend, per-service cost breakdown, projected total |

**Vercel Monitoring (per project):**

| Metric Category | Specific Metrics |
|-----------------|-----------------|
| **Deployment Health** | Latest deployment status, build time, build errors |
| **Performance** | Edge function invocations, serverless function duration, cold start frequency |
| **Web Vitals** | LCP, FID, CLS, TTFB (per route if available) |
| **Traffic** | Request volume, bandwidth, top routes, geographic distribution |
| **Logs** | Runtime errors, function timeouts, build warnings |
| **Costs** | Bandwidth usage vs. plan limits, function execution costs, projected overages |

#### 5.5.2 Health Status Engine

Each project's infrastructure has a computed health score:

- **Green (Healthy):** All metrics within normal thresholds, no errors in the last hour
- **Yellow (Warning):** One or more metrics approaching thresholds (e.g., > 80% resource usage, elevated error rate, cost approaching budget)
- **Red (Critical):** Service down, error rate > 5%, resource exhaustion, cost exceeding budget

Thresholds are configurable per project and per provider.

#### 5.5.3 Monitoring Dashboard Views

**Global Infrastructure View:**
- Grid of all projects with health status badges for each provider (Supabase / Railway / Vercel)
- Aggregate stats: total infrastructure cost this month, number of active alerts, overall health score
- One-click drill-down to any project's infrastructure detail

**Project Infrastructure Detail:**
- Three-panel layout: one panel per provider
- Real-time metrics with sparkline charts (last 24h, 7d, 30d toggle)
- Log viewer with severity filtering (info / warn / error / fatal)
- Cost widget showing current spend vs. budget allocation for infrastructure

**Cost Analytics:**
- Cross-project infrastructure cost comparison (bar chart)
- Monthly cost trend (line chart, last 6 months)
- Cost per provider breakdown (pie/donut chart)
- Projected monthly total with confidence interval
- Budget alerts: highlight projects exceeding allocated infrastructure budget

#### 5.5.4 Data Collection Strategy

| Method | Use Case | Frequency |
|--------|----------|-----------|
| **Scheduled Polling (Cron)** | Metrics, resource usage, costs | Every 5 minutes (health), every 1 hour (costs) |
| **Webhooks** | Deployment events, incident alerts | Real-time |
| **Log Aggregation** | Error logs, application logs | Every 1 minute (tail) |
| **Manual Refresh** | On-demand full data pull | User-triggered |

Implementation: Use Supabase Edge Functions or a lightweight Railway service as the polling/aggregation worker. Store time-series metrics in a dedicated Supabase table with appropriate indexing and data retention policies (raw data: 30 days, aggregated: 12 months).

---

### 5.6 Alerts & Notifications

#### 5.6.1 Alert Rules

| Alert Type | Trigger | Severity |
|------------|---------|----------|
| Service Down | Health check failure for > 2 consecutive checks | Critical |
| High Error Rate | > 5% error rate sustained for 10 minutes | Critical |
| Resource Exhaustion | CPU or memory > 90% for 15 minutes | Warning |
| Budget Threshold | Project infra cost exceeds 80% of allocation | Warning |
| Budget Exceeded | Project infra cost exceeds 100% of allocation | Critical |
| Milestone Overdue | Milestone passes due date without completion | Warning |
| Deployment Failure | Build or deploy fails on any provider | Warning |
| Slow Queries | Database queries exceeding 2s detected | Info |

#### 5.6.2 Notification Channels

- **In-app:** Alert badge + notification panel in the Command Center
- **Browser push notifications:** For critical alerts when the dashboard is open
- **Webhook-ready:** Expose alert payload for future integration (e.g., Slack, Telegram, email)

> **Phase 1 scope:** In-app notifications only. Webhook integrations are a Phase 2 enhancement.

---

## 6. Information Architecture

### 6.1 Navigation Structure

```
Command Center
+-- Dashboard (Home)          -- Operations overview
+-- Projects                  -- Project list + CRUD
|   +-- [Project Detail]      -- Overview / Timeline / Budget / Comms / Infra
+-- Team                      -- Team roster + workload
+-- Communications            -- Global communication log
+-- Infrastructure            -- Global infra monitoring
|   +-- Overview              -- All projects health grid
|   +-- Costs                 -- Cost analytics
|   +-- Alerts                -- Active alerts + history
+-- Knowledge                 -- Skills, docs, design system
+-- Settings                  -- Thresholds, integrations, user management
```

### 6.2 Page Inventory

| Page | Purpose |
|------|---------|
| `/dashboard` | Home -- operational summary |
| `/projects` | Filterable project list |
| `/projects/new` | Create new project |
| `/projects/[id]` | Project detail (tabbed) |
| `/team` | Team roster and workload |
| `/team/[id]` | Engineer profile + assignment history |
| `/communications` | Global communication feed |
| `/infrastructure` | Infrastructure health grid |
| `/infrastructure/costs` | Cost analytics and trends |
| `/infrastructure/alerts` | Active and historical alerts |
| `/knowledge` | Knowledge base (skills, docs, howtos) |
| `/knowledge/[slug]` | Individual document view |
| `/settings` | App configuration |
| `/settings/thresholds` | Alert threshold management |
| `/settings/integrations` | Provider API key management |
| `/settings/users` | User management |

---

## 7. Tech Stack & Architecture

### 7.1 Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Framework** | Next.js 14+ (App Router) | Matches M.D.N Tech's primary stack; server components for performance |
| **Language** | TypeScript | Type safety across the full stack |
| **Database** | Supabase (PostgreSQL) | Real-time subscriptions, RLS, Edge Functions, Storage -- all in one |
| **Auth** | Supabase Auth | Built-in, integrates with RLS |
| **Styling** | Tailwind CSS + shadcn/ui | Rapid UI development, consistent with M.D.N Tech projects |
| **Charts** | Recharts or Tremor | React-native charting for metrics visualization |
| **State Management** | Supabase Realtime + React Server Components | Minimal client state; real-time updates via subscriptions |
| **Background Jobs** | Supabase Edge Functions (Deno) | Scheduled polling, webhook handlers, data aggregation |
| **File Storage** | Supabase Storage | Communication attachments, exported reports |

### 7.2 Database Schema Overview

**Core Tables:**
- `projects` -- Project registry
- `milestones` -- Project milestones and timeline items
- `team_members` -- Engineer profiles and capacity
- `project_assignments` -- Many-to-many: engineers to projects (with timestamps)
- `communications` -- Client interaction log entries
- `communication_attachments` -- File references for comms

**Infrastructure Tables:**
- `infra_connections` -- Provider credentials/project IDs per project
- `infra_metrics` -- Time-series metrics (provider, project, metric_name, value, timestamp)
- `infra_logs` -- Aggregated error/warn logs from all providers
- `infra_alerts` -- Alert events (triggered, acknowledged, resolved)
- `infra_costs` -- Daily cost snapshots per provider per project
- `alert_rules` -- Configurable threshold rules

**System Tables:**
- `activity_log` -- Audit trail of all user actions
- `app_settings` -- Global configuration key-value store

---

## 8. API Integrations

### 8.1 Supabase Management API

| Endpoint | Purpose | Polling Frequency |
|----------|---------|-------------------|
| `/v1/projects/{ref}/health` | Database health status | Every 5 min |
| `/v1/projects/{ref}/database/query` | Run diagnostic queries (connection count, DB size) | Every 5 min |
| `/v1/projects/{ref}/analytics` | API request metrics, auth stats | Every 15 min |
| `/v1/projects/{ref}/storage` | Storage usage | Every 1 hour |
| Billing endpoints | Cost data | Every 1 hour |

**Auth:** Supabase Management API key (service role or personal access token)

### 8.2 Railway API (GraphQL)

| Query/Mutation | Purpose | Polling Frequency |
|----------------|---------|-------------------|
| `project.services` | List services, health status | Every 5 min |
| `service.deployments` | Recent deployments, status | Webhook + every 15 min |
| `service.metrics` | CPU, memory, network | Every 5 min |
| `project.usage` | Compute hours, bandwidth | Every 1 hour |
| `project.estimatedCost` | Cost estimation | Every 1 hour |

**Auth:** Railway API token (team-scoped)

### 8.3 Vercel API (REST)

| Endpoint | Purpose | Polling Frequency |
|----------|---------|-------------------|
| `/v6/deployments` | Deployment list + status | Webhook + every 15 min |
| `/v1/web-analytics` | Web vitals, traffic | Every 15 min |
| `/v1/edge-functions` | Edge/serverless metrics | Every 15 min |
| `/v9/projects/{id}` | Project config, domains | Every 1 hour |
| Usage endpoints | Bandwidth, function executions | Every 1 hour |

**Auth:** Vercel access token (team-scoped)

---

## 9. Non-Functional Requirements

### 9.1 Performance

| Requirement | Target |
|-------------|--------|
| Dashboard initial load (LCP) | < 2 seconds |
| Data refresh latency | < 5 seconds from API poll to UI update |
| Search response time | < 500ms for project/communication search |
| Concurrent users supported | 10 (internal team) |

### 9.2 Data Retention

| Data Type | Retention |
|-----------|-----------|
| Raw infrastructure metrics (5-min granularity) | 30 days |
| Aggregated metrics (hourly) | 12 months |
| Aggregated metrics (daily) | Indefinite |
| Cost data | Indefinite |
| Logs (error/warn) | 90 days |
| Communications | Indefinite |
| Activity audit log | 12 months |

### 9.3 Security

- All API keys stored as encrypted Supabase Vault secrets -- never in client code
- Row Level Security (RLS) on every table
- HTTPS enforced on all connections
- API routes protected with session validation middleware
- Sensitive fields (budgets, costs) restricted to admin role via RLS policies
- Regular key rotation schedule for third-party API tokens

### 9.4 Reliability

- Monitoring worker failures should not affect the main dashboard usability
- Graceful degradation: if a provider API is unreachable, show last-known data with a stale indicator and timestamp
- Background jobs should have retry logic with exponential backoff (max 3 retries)

---

## 10. UI/UX Guidelines

### 10.1 Design Direction

- **Dark theme primary** -- aligned with the M.D.N Tech brand (deep navy/purple backgrounds)
- Accent colors: cyan-to-purple gradient for headings, magenta/pink for CTAs (matching brand)
- Clean, data-dense layouts -- minimize whitespace waste while maintaining readability
- Card-based UI for project tiles, metric widgets, and communication entries
- Consistent iconography using Lucide icons (already in the M.D.N Tech stack)

### 10.2 Key UI Components

| Component | Usage |
|-----------|-------|
| Status Badge | Project status, infra health (color-coded) |
| Metric Card | Single KPI display with sparkline and trend arrow |
| Data Table | Project list, communication log, alert history |
| Timeline | Milestone visualization, communication chronology |
| Chart Panel | Line/bar/donut charts for costs and metrics |
| Alert Banner | Critical notifications at the top of relevant pages |
| Quick-Add Modal | Fast entry for communications, milestones |

### 10.3 Responsive Behavior

- **Primary target:** Desktop (1440px+) -- this is an operational dashboard
- **Secondary:** Tablet (768px-1439px) -- usable for quick checks
- **Mobile:** Not prioritized for Phase 1

---

## 11. Open Questions & Future Considerations

| # | Question / Consideration | Status |
|---|--------------------------|--------|
| 1 | Should we integrate GitHub activity (commits, PRs) into the project timeline? | Phase 5 |
| 2 | Is Slack/Telegram notification integration needed? | Phase 4 |
| 3 | Should clients ever get a read-only portal view? | Future phase |
| 4 | Do we want time-tracking for engineers? | To discuss |
| 5 | Should we integrate with invoicing/accounting tools? | Future consideration |

---

## 12. Appendix

### A. Glossary

| Term | Definition |
|------|------------|
| **Command Center** | The internal M.D.N Tech operational dashboard described in this PRD |
| **Health Score** | Computed status (green/yellow/red) based on infrastructure metrics and thresholds |
| **RLS** | Row Level Security -- Supabase/PostgreSQL feature that restricts data access at the database level |
| **Edge Function** | Serverless function running on Supabase's edge network (Deno runtime) |
| **Sparkline** | Miniature inline chart showing trend over time |

### B. M.D.N Tech Brand Reference

- Website: mdntech.org
- Primary background: Deep navy (#0a0a1a) to dark purple gradient
- Accent gradient: Cyan (#06b6d4) to Purple (#a855f7) to Magenta (#ec4899)
- Typography: Clean sans-serif, bold headings
- UI Pattern: Card-based with subtle border glow

---

*This document is a living specification. All sections are subject to refinement as development progresses.*
