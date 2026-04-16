---
title: "M.D.N Tech -- Planning Briefing for Mind Palace"
date: 2026-04-16
status: decisions-locked
audience: Claude Code (Mind Palace vault)
purpose: Align the Mind Palace development plan with the current state of the M.D.N Tech codebase, capture the architectural decisions the founders locked on 2026-04-16, and hand off a coherent foundation for the updated plan.
companion_docs:
  - command-center/DEVELOPMENT-PLAN.md          # existing plan (v1, 2026-03-21) -- to be superseded
  - command-center/mdntech-website-rebuild.md   # new landing-page direction (v1, 2026-04-12)
  - MindPalace/Projects/MDN-Tech/development-plan.md  # Mind Palace plan (v1, 2026-04-16) -- to be rewritten using this briefing
---

# M.D.N Tech -- Planning Briefing for Mind Palace

This document is the hand-off from the repo side to the Mind Palace side. Two planning drafts existed and had drifted from both each other and from the actual codebase. On 2026-04-16 the founders reviewed the conflicts and locked the architectural decisions below.

**Goal of this briefing:** give you everything needed to produce a single coherent plan in Mind Palace that supersedes the two existing drafts.

Read alongside:
- [command-center/DEVELOPMENT-PLAN.md](./DEVELOPMENT-PLAN.md) -- original 6-phase plan (schema + API architecture; now partially superseded)
- [command-center/mdntech-website-rebuild.md](./mdntech-website-rebuild.md) -- strategic positioning shift (consultancy -> product platform)
- Your own Mind Palace draft (2026-04-16) -- solid agent-layer design, but Phases 1-2 rest on a greenfield assumption that is no longer accurate

---

## 1. The Strategic Shift

M.D.N Tech is repositioning from a **development consultancy** to a **self-service product platform**. The new public narrative is three products (SignaKit, ChatKit, TradeKit) plus free tools, not "we build apps for you." Custom development stays in the lineup but moves to a secondary page.

This splits what used to be one audience (visitors) into three distinct audiences, each with its own surface:

| Surface | URL | Audience | Auth | Purpose |
|------|------|------|------|------|
| Marketing | `mdntech.org` | Prospects, SEO | None | Convert to portal signup |
| Customer portal | `app.mdntech.org` | Paying/free customers | Supabase Auth (v1) -> SignaKit (later) | Self-serve SignaKit, ChatKit, TradeKit |
| Command Center | `admin.mdntech.org` | Founders only (2 users) | Supabase Auth (admin role) | Internal ops: projects, clients, infra, chatbots |
| Mind Palace | Local Obsidian | Founders (single-user) | Obsidian | Knowledge, context, decisions, agent injection |

Shared: design tokens (space theme, glassmorphism, gradients), the same Supabase project (see D2), and the chatbot widget infrastructure already in production (reused by ChatKit).

---

## 2. Ground Truth: What's Already Built

The Mind Palace plan's Phase 1 ("Set up the backend so the web dashboard is no longer a shell") is **already substantially done**. A correct plan must treat this as the starting point, not the target. Current state on `main` as of Session 10 (2026-04-08):

### 2.1 Database -- Supabase

- **Project ref:** `ijfgwzacaabzeknlpaff` (dedicated Supabase project for M.D.N Tech; separate from Swarm Resistance and all client projects)
- **Three migrations applied** in [supabase/migrations/](../supabase/migrations/):
  - `001_core_tables.sql` -- core ops schema + RLS + auth trigger
  - `002_chatbots.sql` -- chatbot + KB schema
  - `003_chat_conversations.sql` -- chatbot widget runtime tables + `widget_config` column

### 2.2 Current Schema (canonical)

**Core ops (migration 001):**

```sql
projects (
  id uuid PK,
  name text NOT NULL,
  client_name text,
  status text        -- discovery|design|development|testing|deployed|maintenance|paused|completed
  priority text      -- critical|high|medium|low
  start_date date, target_end_date date, actual_end_date date,
  budget_total numeric(12,2), budget_spent numeric(12,2),
  description text, tech_stack text[],
  repository_url text, staging_url text, production_url text,
  supabase_project_ref text, railway_project_id text, vercel_project_id text,
  created_at, updated_at
)

team_members (
  id uuid PK REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  role text           -- admin|engineer|viewer  (only 'admin' will be used going forward; see D3)
  avatar_url text, max_concurrent_projects int, skills text[],
  is_active boolean, created_at
)

project_assignments (id, project_id FK, member_id FK, assigned_at, unassigned_at, UNIQUE(project_id, member_id))

milestones (
  id, project_id FK, name, description, due_date,
  status text,       -- pending|in_progress|completed|overdue
  assigned_to FK, sort_order, completed_at, created_at
)

communications (
  id, project_id FK, author_id FK,
  channel text,      -- email|call|slack|whatsapp|meeting|other
  direction text,    -- inbound|outbound
  subject, summary, action_items, contact_name,
  occurred_at, attachments jsonb, created_at
)

activity_log (
  id bigint identity PK,
  user_id FK, action text, entity_type text, entity_id uuid,
  metadata jsonb, created_at
)
```

**Chatbots (migration 002 + 003):**

```sql
chatbots (
  id uuid PK,
  name text NOT NULL,
  project_id uuid FK ON DELETE SET NULL,
  client_name text,        -- text field, will coexist with future owner_id (see D5)
  description text,
  type text,               -- internal|client
  status text,             -- active|draft|archived
  widget_config jsonb,     -- greeting, system_prompt, primary_color, position, fallback_message
  created_at, updated_at
)

chatbot_kb_entries (
  id, chatbot_id FK ON DELETE CASCADE,
  title, content text, category text, sort_order int,
  created_at, updated_at
)
```

**Chat runtime (migration 003):**

```sql
chat_conversations (
  id uuid PK,
  chatbot_id FK,
  visitor_id text NOT NULL,
  visitor_ip inet,
  source_url text,
  status text,                 -- active|ended|archived
  message_count int,
  started_at, last_message_at
)

chat_messages (
  id uuid PK,
  conversation_id FK, chatbot_id FK,
  role text,                   -- user|assistant
  content text,
  input_tokens int, output_tokens int, latency_ms int,
  created_at
)
```

### 2.3 RLS Posture

- All tables have RLS enabled.
- Session 7 fixed a recursive admin-policy bug by introducing `public.is_admin()` as a `SECURITY DEFINER` function. All admin checks call this function.
- Current signed-in user has `role = 'admin'`.
- **All current RLS assumes the authenticated user is internal staff.** Portal customers will break this assumption -- see D3.

### 2.4 Auth Trigger

`handle_new_user()` runs on every `auth.users` insert and inserts into `team_members`. This is correct today (only founders sign in) but wrong once portal signup exists (a paying customer must not become a team member). Rewrite spec in Section 4.

### 2.5 Application Surface Already Built

The CC is not a shell. Live in [app/command-center/](../app/command-center/) through Session 10:

| Feature | Status | Files |
|------|------|------|
| Auth (login, session guard) | Live | [login/](../app/command-center/login/), [middleware.ts](../middleware.ts) |
| Projects CRUD + detail tabs (Overview/Milestones/Budget/Communications) | Live | [projects/](../app/command-center/projects/), [ProjectTabs.tsx](../components/command-center/projects/ProjectTabs.tsx) |
| Team + workload | Live | [team/](../app/command-center/team/) |
| Dashboard (KPIs + project table) | Live | [dashboard/](../app/command-center/dashboard/) |
| Communications feed (global + per-project) | Live | [communications/](../app/command-center/communications/) |
| Knowledge base (markdown, gray-matter, react-markdown) | Live | [knowledge/](../app/command-center/knowledge/), [command-center/knowledge/docs/](./knowledge/docs/) |
| Chatbot CRUD + KB entries + .md export | Live | [chatbots/](../app/command-center/chatbots/) |
| Chatbot widget (embeddable JS, Shadow DOM, Claude Haiku 4.5 streaming) | Live | [widget.js](../public/widget.js), [api/chat/[chatbotId]/](../app/api/chat/) |
| Chatbot analytics (messages, visitors, cost, stats table) | Live | Session 9 redesign |
| Infrastructure monitoring (Supabase Mgmt + Railway GraphQL + Vercel REST, auto-refresh) | Live | [lib/infrastructure/](../lib/infrastructure/), [components/command-center/infrastructure/](../components/command-center/infrastructure/) |

**Implication for planning:** what Mind Palace calls "Phase 1" and most of "Phase 2" is not greenfield work. It's a **schema evolution + domain move + scope expansion**.

---

## 3. Locked Decisions (2026-04-16)

These were the six forks in the road. All are now resolved.

### D1. Command Center URL -- **LOCKED: `admin.mdntech.org`**

CC moves from the current hidden path (`mdntech.org/command-center`) to its own subdomain. Rationale: keeps `app.mdntech.org` reserved for the customer portal (short and brandable for customers), uses `admin.` to signal founder-only access (conventional SaaS pattern), allows independent deploy cycles from marketing.

Implementation path:
- Add `admin.mdntech.org` domain in Vercel pointing to the same project
- Add host-branching to [middleware.ts](../middleware.ts): requests to `admin.*` rewrite to `/command-center/*`; requests to `app.*` rewrite to the (future) portal route group; requests to `mdntech.org` serve marketing as today
- DNS: CNAME `admin` -> `cname.vercel-dns.com`

### D2. Supabase projects -- **LOCKED: one project**

Single Supabase project (`ijfgwzacaabzeknlpaff`) holds:
- CC internal ops tables (projects, team_members, milestones, communications, clients)
- Portal customer tables (customers, customer_products, product_usage)
- Shared product tables (chatbots -- both internal- and customer-owned)

Segmentation is at the RLS layer, not the database layer. Reason: CC must be able to see customer metrics (chatbot usage, revenue, per-product health) without cross-DB queries. A split would force an ETL pipeline we don't want to maintain.

### D3. User model -- **LOCKED: two tables, two roles**

```
auth.users (Supabase built-in, single source of identity)
  -> team_members  (founders only: just 2 rows, role 'admin')
  -> customers     (portal users: one row per signup)
```

A user is **either** a team member **or** a customer, not both. The `handle_new_user()` trigger routes to the correct table based on `raw_user_meta_data->>'account_type'` set at signup time by the portal vs CC login flows.

**Role simplification:** since CC will only ever have 2 users (the founders), the `role` column can stay as-is but only `'admin'` will be issued. The `engineer` / `viewer` distinctions from migration 001 remain in the schema but are unused. Do **not** add more complexity to the team_members table; it's effectively a 2-row lookup.

### D4. Clients vs Customers -- **LOCKED: separate tables with optional link**

- **Clients** = businesses we work with on custom development engagements or managed chatbots. Internal CRM data, owned by us, lives in a new `clients` table.
- **Customers** = portal users who self-serve our products. Own their own resources, billed per product, live in a new `customers` table.
- A client can optionally link to a customer row when the same business is both (e.g. Royal Stroje is a client today; if they later sign up to the portal, we link). Nullable FK `clients.customer_id -> customers.id`.

### D5. Product ownership -- **LOCKED: `owner_id` pattern on customer-facing resources**

Every row that can be "owned" by a portal customer gains an `owner_id uuid REFERENCES customers(id)` column. RLS policies read as:

> *A customer can see/manage rows where `owner_id = auth.uid()`. Admins (founders) see all rows regardless.*

Applied to:
- `chatbots` -- `owner_id NULL` = internal-managed (current Royal Stroje pattern), `owner_id NOT NULL` = customer-owned ChatKit bot
- Future SignaKit auth-app rows
- Future TradeKit subscription rows

The existing `client_name` text column on `chatbots` stays; when `owner_id IS NULL` it identifies the internal client, when `owner_id IS NOT NULL` it's derived from the customer's company name.

### D6. Plan location -- **LOCKED: Mind Palace is authoritative**

Single source of truth lives in `MindPalace/Projects/MDN-Tech/development-plan.md`. The repo holds a one-page [PLAN.md](../PLAN.md) (to be created) containing:
- A pointer to the Mind Palace plan
- The last-synced date
- A one-paragraph summary of the current active phase

The existing [command-center/DEVELOPMENT-PLAN.md](./DEVELOPMENT-PLAN.md) is frozen as historical reference. Do not maintain it.

---

## 4. Proposed Schema Evolution (Migration 004)

Based on the locked decisions. Treat this as a spec, not final SQL -- Mind Palace can refine.

### 4.1 New tables

```sql
-- Customers (portal users)
create table customers (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  company text,
  signup_source text,         -- signakit|chatkit|tradekit|direct
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Clients (internal CRM; optional link to a customer account)
create table clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  status text default 'active',            -- active|inactive|archived
  subscription_tier text,                  -- free|starter|pro|enterprise|custom
  website text,
  contact_name text, contact_email text, contact_phone text,
  socials jsonb default '{}',
  notes text,
  customer_id uuid references customers(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Product enrolment (which products has a customer enabled)
create table customer_products (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  product text not null check (product in ('signakit','chatkit','tradekit')),
  plan text not null default 'free',        -- free|starter|pro|enterprise
  status text not null default 'active',    -- active|paused|cancelled
  started_at timestamptz default now(),
  cancelled_at timestamptz,
  unique(customer_id, product)
);

-- Usage metering (free-tier caps + billing inputs)
create table product_usage (
  id bigint generated always as identity primary key,
  customer_id uuid not null references customers(id) on delete cascade,
  product text not null,
  metric text not null,                     -- messages|signins|api_calls|signals
  value numeric not null default 0,
  period_start date not null,
  period_end date not null,
  recorded_at timestamptz default now()
);

-- Helper mirroring is_admin()
create or replace function public.is_customer() returns boolean
  language sql security definer stable as $$
    select exists (select 1 from customers where id = auth.uid())
  $$;
```

### 4.2 Schema changes to existing tables

```sql
-- chatbots: add owner, rewrite RLS
alter table chatbots
  add column owner_id uuid references customers(id) on delete cascade;
-- owner_id IS NULL  => internal-managed (current behaviour)
-- owner_id NOT NULL => customer-owned ChatKit chatbot

drop policy "Authenticated users can manage chatbots" on chatbots;
create policy "Customers manage their own chatbots, admins manage all"
  on chatbots for all to authenticated
  using (owner_id = auth.uid() or public.is_admin());

-- Same owner_id + RLS pattern cascades to chatbot_kb_entries, chat_conversations, chat_messages
-- (each reads owner_id via join through chatbot_id)
```

### 4.3 Rewrite `handle_new_user()`

```sql
create or replace function handle_new_user()
returns trigger as $$
begin
  if coalesce(new.raw_user_meta_data->>'account_type', 'team') = 'customer' then
    insert into public.customers (id, email, full_name, signup_source)
    values (new.id, new.email,
            new.raw_user_meta_data->>'full_name',
            new.raw_user_meta_data->>'signup_source')
    on conflict (id) do nothing;
  else
    insert into public.team_members (id, full_name, role)
    values (new.id,
            coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
            'admin')  -- founders are always admin; no other roles used
    on conflict (id) do nothing;
  end if;
  return new;
end;
$$ language plpgsql security definer;
```

**Portal signup flow must set `account_type: 'customer'` in the sign-up options.** Supabase Auth accepts `data: { account_type: 'customer', signup_source: 'chatkit' }` on `signUp()`.

### 4.4 Deferred tables (not in 004)

- `infra_metrics` / `infra_costs` -- CC currently queries providers live without persisting. Add only when we need historical charts.
- `alert_rules` / `alert_events` -- original Phase 4 of the repo plan. Defer.
- `chatbot_metrics` (daily snapshots) -- Mind Palace plan proposed this. Current code aggregates on demand from `chat_messages`; add only if query performance becomes a problem.
- Billing tables (Stripe customer id, invoices, etc.) -- defer until portal goes paid. Free tier only for v1.

---

## 5. Sequencing (locked with founders)

The founders agreed on this order, with one adjustment: the **website rebuild runs in parallel with the portal build** but must be ready to launch at or shortly after portal go-live. The current landing page stays live until the portal is ready, then gets swapped.

```
[Small] Phase A: CC stabilization
  - Domain move to admin.mdntech.org (DNS + middleware host-branching)
  - Role simplification cleanup (team_members: founders only, 'admin' role)
  - Finish entering remaining 9 projects into CC
  - Delete /api/chat/test diagnostic endpoint
  - Fix knowledge page date display

[Small] Phase B: Mind Palace operationalization  (can run parallel with A)
  - Complete weekly review template
  - Complete project frontmatter across all vault projects
  - Verify Dataview dashboards on Home.md
  - Confirm /start, /wrap, /save, /doc-update skills wired to all projects

[Big]   Phase C: Portal build (app.mdntech.org)        ║  [Medium] Phase D: Website rebuild (parallel track)
  - Migration 004 deployed                             ║    - Implement new hero / products / free-tools /
  - New route group / middleware branch                ║      trust-bar / blog-preview sections per
  - Portal landing + Supabase Auth signup flow         ║      command-center/mdntech-website-rebuild.md
  - Customer dashboard home                            ║    - /about and /development subpages
  - ChatKit customer UI (reuses existing chatbot       ║    - Footer rebuild
    + widget + streaming API infrastructure)           ║    - Stays in draft; current site stays live until
  - SignaKit + TradeKit scaffolding (auth, account,    ║      portal ready; swap at portal launch
    empty "coming soon" dashboards)                    ║
  - Free-tier caps via product_usage                   ║

[Medium] Phase E: SignaKit migration for portal auth
  - Build SignaKit as a real product (prior phase work)
  - Migrate portal authentication from Supabase Auth to SignaKit
  - Dogfood before opening to external customers

[Medium] Phase F: Supabase -> Obsidian sync script (Mind Palace Phase 3)
  - frontmatter-only, never body
  - Keeps vault wikis in sync with CC data

[Medium] Phase G: Agent layer -- single Team Leader, 2-week trial (Mind Palace Phase 4)
  - Telegram bot + Claude Agent SDK
  - Kill-or-scale gate after 2 weeks of real use

[Conditional] Phase H: Multi-agent + agent panels in CC (Mind Palace Phases 5-6)
  - Gated on Phase G success

[Later] Phase I: Proactive + hardening (Mind Palace Phase 7)
```

**Key constraint for the plan:** the website rebuild (Phase D) must **not** ship until the portal (Phase C) is ready to receive traffic. Otherwise we'd be advertising a portal that doesn't exist. Keep the current landing page live; swap at portal go-live.

---

## 6. What the Updated Mind Palace Plan Should Look Like

Given the above, the Mind Palace plan should be restructured roughly like this. Specific numbering is up to you; just avoid collision with the session-history "Phase 1-4" labels used in [handoff.md](../handoff.md).

1. **Phase 0 -- Mind Palace ops** (your current draft is fine; keep as-is)
2. **Phase 1 -- CC stabilization** (small; Phase A above)
3. **Phase 2 -- Portal build** (big; Phase C above). This replaces your current "Phase 1: CC database" and "Phase 2: CC frontend" entirely.
4. **Phase 3 -- Website rebuild** (parallel track to Phase 2; Phase D above)
5. **Phase 4 -- SignaKit migration for portal auth** (Phase E above; new)
6. **Phase 5 -- Supabase -> Obsidian sync script** (your current Phase 3)
7. **Phase 6 -- Agent foundation, single Leader bot** (your current Phase 4; 2-week trial gate intact)
8. **Phase 7 -- Multi-agent** (your current Phase 5; conditional on Phase 6 success)
9. **Phase 8 -- Agent panels inside CC** (your current Phase 6; CC is now `admin.mdntech.org`)
10. **Phase 9 -- Proactive + hardening** (your current Phase 7)

Cross-reference table to avoid future confusion:

| Phase in updated plan | Equivalent in repo plan (2026-03-21) | Equivalent in MP draft (2026-04-16) |
|------|------|------|
| 1 -- CC stabilization | Phase 1-3 (mostly done) + cleanup | Phase 0.x + Phase 1 (rewritten) |
| 2 -- Portal build | (new) | Phase 1 + Phase 2 (rewritten) |
| 3 -- Website rebuild | (new) | (new) |
| 4 -- SignaKit auth | (new) | (new) |
| 5 -- Obsidian sync | (new) | Phase 3 |
| 6 -- Agent foundation | (new) | Phase 4 |
| 7 -- Multi-agent | (new) | Phase 5 |
| 8 -- Agent panels in CC | (new) | Phase 6 |
| 9 -- Proactive + hardening | (new) | Phase 7 |

---

## 7. Reference: Key Files

| File | Purpose |
|------|------|
| [supabase/migrations/001_core_tables.sql](../supabase/migrations/001_core_tables.sql) | Canonical CC schema |
| [supabase/migrations/002_chatbots.sql](../supabase/migrations/002_chatbots.sql) | Chatbot + KB schema |
| [supabase/migrations/003_chat_conversations.sql](../supabase/migrations/003_chat_conversations.sql) | Widget runtime + widget_config |
| [lib/supabase/client.ts](../lib/supabase/client.ts), [server.ts](../lib/supabase/server.ts), [service.ts](../lib/supabase/service.ts) | Supabase clients (browser, server, service-role) |
| [middleware.ts](../middleware.ts) | Session guard; needs host-branching for admin/app split |
| [app/command-center/](../app/command-center/) | Current CC app (moves to `admin.mdntech.org`) |
| [app/api/chat/[chatbotId]/](../app/api/chat/) | Chatbot streaming API (reused by customer-owned ChatKit bots) |
| [public/widget.js](../public/widget.js) | Embeddable chat widget (reused by customer-owned ChatKit bots) |
| [command-center/PRD.md](./PRD.md) | Original CC product requirements |
| [command-center/DEVELOPMENT-PLAN.md](./DEVELOPMENT-PLAN.md) | Original plan v1 2026-03-21 (frozen as historical reference) |
| [command-center/mdntech-website-rebuild.md](./mdntech-website-rebuild.md) | Website rebuild spec v1 2026-04-12 (Phase 3 input) |
| [handoff.md](../handoff.md) | Session history (10 sessions through 2026-04-08) |

---

## 8. Open Questions Remaining

Most architectural forks are locked. The ones below are deferred to planning-session detail, not strategic:

1. **Portal codebase organization:** same Next.js app with host-based routing (like admin.* will be), or a separate Next.js project deployed to `app.mdntech.org`? Recommendation: same app with host-branching -- shares design tokens, shared Supabase clients, one build. Revisit if the customer app grows to need its own release cadence.
2. **Free-tools scope and location:** `/tools/claude-code-skills`, `/tools/chatkit-playground`, `/tools/crypto-dashboard` -- part of the portal app as auth-less public routes, or under the marketing site? Recommendation: marketing site (they are SEO assets and conversion hooks, not authenticated experiences).
3. **Free-tier caps:** which metrics get capped for v1? Proposed: ChatKit 20 free messages total to test, then require plan upgrade. SignaKit free up to 1,000 MAU. TradeKit analytics dashboard free; premium signals "coming soon."
4. **Agent layer host:** the Mind Palace draft says `launchd` on a dev Mac for Phase 4. For the 2-week trial that's fine. If the trial succeeds, Phase 7 should budget a small VPS ($5-10/mo) because laptop uptime will not be acceptable when the agent is doing real work.
5. **Existing chatbot rows at migration time:** when `owner_id` is added to `chatbots`, existing rows (Royal Stroje, etc.) all get `owner_id = NULL` which correctly marks them as internal-managed. No data backfill needed. Confirm in migration 004.
6. **CC project entries deferred work:** 9 project rows still need to be created in CC (1 done: Royal Stroje). This is operational work, not planning work -- do it during Phase 1 / A above.

---

*End of briefing. If anything here contradicts what you have in Mind Palace, the code is the source of truth, not the plan docs.*
