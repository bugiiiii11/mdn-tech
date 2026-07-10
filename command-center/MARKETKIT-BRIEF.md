---
title: "MarketKit — AI GTM Copilot: Development Brief (portal integration)"
status: ready-for-kickoff
created: 2026-07-10
author: Mind Palace session (Claude, with Martin)
executor: Claude Code (Fable) in this repo
supersedes: MindPalace/Projects/MarketKit/"MarketKit - MVP Task List & Tech Brief.md" §§0–4 (architecture + tasks — that file assumed a standalone repo)
concept-doc: MindPalace/Areas/Business/"MarketKit - AI Marketer koncept & research 2026.md" (SK — business concept + market research, still fully valid)
sibling: TECHKIT-BRIEF.md (same-day decisions; shared foundations §5)
---

# MarketKit — AI Go-To-Market Copilot (portal module)

> **One-liner:** AI GTM copilot for builders with a **portfolio** of small projects (€0–2000/mo budgets): upload a project → AI scan → **Launch Kit** (positioning, ICP, ranked channel plan, launch checklist, 30-day content calendar + first content batch) → weekly marketing sprint loop → measured results. Closed loop: **strategy → content → measurement → learning.**
>
> MVP = internal tool over MDN's own portfolio (dogfooding + client reporting). Public product later.
>
> **⚠️ REPO DECISION REVERSED 2026-07-10:** MarketKit is built **inside this repo as a portal module (app.mdntech.org)** — NOT a new standalone repo as the vault Session-13 brief said. Rationale: the portal already has everything the standalone plan would have rebuilt — auth + role isolation, product enrolment model, shells/design language, one shared Supabase (D2), Vercel project, and (via TechKit, same-day decision) a pg_cron + Edge Function ingestion pattern and a notification service.

---

## 0. How to use this document

Execution brief for Claude Code sessions in this repo. Self-contained: locked decisions (§1), architecture (§2–3), schema (§4), shared TechKit foundations (§5), AI pipeline (§6), session plan (§7), channel defaults (§8), API constraints (§9). The vault concept doc covers the *why* (market research, competitive white space); this file covers the *what/how*.

**Read before touching code:**
- Portal architecture: `components/portal/{PortalShell,PortalTopBar}.tsx`, `app/portal/chatkit/*` (the reference product module), `lib/supabase/middleware.ts` (host routing + role gates)
- Product model: migration `004_portal_schema.sql` (`customers`, `customer_products`, `product_usage`), `lib/portal/plans.ts` (ChatKit billing — future template for MarketKit billing)
- Shared TechKit foundations: `TECHKIT-BRIEF.md` §5 (Edge Functions, pg_cron, `_shared/` notify helpers)
- Migrations end at `008` + TechKit is allocating `009+` **in parallel** — see §5.1 coordination rule

---

## 1. Locked decisions

| # | Decision | Value | Status |
|---|----------|-------|--------|
| M1 | Repo/placement | **This repo, portal module at `app/portal/marketkit/*`** (app.mdntech.org) | ⚠️ CHANGED 2026-07-10 — reverses vault "new standalone repo" |
| M2 | Language | EN-first UI; generated content multi-language (SK for SK clients) | unchanged |
| M3 | Stack | Existing portal stack — Next.js App Router + TS + Tailwind + shared Supabase + Claude API + Vercel. **No new Supabase project, no new Vercel project.** | adapted from vault (was: new projects) |
| M4 | MVP shape | Internal: **one builder account (Martin) as customer #1**, no public signup, no billing | unchanged |
| M5 | Dogfood set | MarketKit itself, ChatKit, Royal Stroje, Melichárek, GoodHairByZane, Swarm Resistance | unchanged |
| M6 | Ads | Recommend + generate assets only. Never manage spend / touch client ad accounts | unchanged |
| M7 | Learning layer | NOT in MVP. Log outcomes in a structure that enables it later | unchanged |
| M8 | Content publishing | Human-approve always. No auto-post (LinkedIn suppresses AI-looking content → `voice_edited` gate) | unchanged |
| M9 | Attribution | Every recommended action ships with a UTM/tracked link + logged expected outcome, from day 1 | unchanged |
| M10 | Data split vs TechKit | **GA4/GSC/attribution/content/social metrics → MarketKit. Uptime/providers/deploys/infra-costs/web-vitals → TechKit.** Do not blur. | new 2026-07-10 |
| M11 | Table namespace | All MarketKit tables prefixed **`mk_`** (shared DB — CC already owns `projects`, name collision otherwise) | new (forced by M1) |
| M12 | Content studio | Pattern **rebuild**, NOT code port from Rahadu SaaS Portal repo, until the Agreement IP question is cleared | unchanged |

---

## 2. Integration architecture

### 2.1 Surface & routing
- Routes: `app/portal/marketkit/page.tsx` (portfolio dashboard) + subroutes (§7). Served on `app.mdntech.org` via existing middleware — **no middleware changes needed**: MarketKit pages are auth-gated portal pages (NOT in the public-paths list), exactly like ChatKit.
- Shell: `PortalShell variant="app"` (data-dense working screens); the portfolio dashboard may use `variant="marketing"` ambient if it reads better — Fable's call, consistent with the portal design language (translucent cards, `button-primary`, gradient headings).

### 2.2 Identity & access (the dogfood account)
The portal blocks non-`customer` accounts (middleware) and pages guard on a `customers` row. MarketKit MVP works **with** this, not against it:
- **Martin signs up as a regular customer account** (separate email from his `team_members` admin) → gets a `customers` row. This is philosophically correct: *account = builder with a portfolio*, and Martin is builder #1.
- Enrolment: SQL-insert a `customer_products` row (`product='marketkit'`, `plan='internal'`, `status='active'`). No self-serve enrolment in MVP.
- **Nav gating:** `PortalTopBar` shows a MarketKit item **only when the logged-in customer has an active `marketkit` enrolment** (checked server-side in `PortalShell`, passed as prop). ChatKit customers never see it. Direct URL without enrolment → redirect to `/portal/toolkit`.
- Admin/CC read access: RLS grants `is_admin()` SELECT on all `mk_` tables from day 1 (§4), so CC client-reporting views can come later without a migration.

### 2.3 Product model
Migration extends the enums:
- `customer_products.product` CHECK: add `'marketkit'` (currently `signakit|chatkit|tradekit`)
- `customers.signup_source` CHECK: add `'marketkit'`
- New allowed `plan` value: `'internal'` (dogfood; free, no caps)
Billing later (backlog D2) reuses the ChatKit pattern (`lib/portal/plans.ts` as template + credits for content generation, Rahadu credit-model style).

### 2.4 Storage
Supabase Storage bucket `marketkit-assets` (private) in the shared project. Path convention `mk/{project_id}/{asset_id}-{filename}`. RLS storage policy mirrors the table pattern (owner or admin).

---

## 3. What MarketKit does (product flow, MVP)

1. **Intake:** create project (name, URL, category, budget tier, language) → upload docs/screenshots/logos (multi-file, drag & drop, preview).
2. **AI scan:** pipeline reads assets (Claude vision for images, text for docs) + crawls the live URL → structured `mk_project_profiles` record (what it is, audience, category, traction, existing channels) + generates `mk_founder_questions` (answerable inline in UI; answers feed back into the profile). Prompt skeleton = port of the vault's Client Business Analysis Framework intake logic.
3. **Launch Kit:** from profile + budget tier (€0 / ≤€500 / ≤€2000) → `mk_strategies` record: positioning, ICP, ranked channel plan (defaults §8), launch checklist, 30-day content calendar, first content batch (5–10 `mk_content_items` drafts). Rendered as a clean readable page + Markdown export.
4. **Weekly sprint loop** (backlog B4 — the core loop): cron proposes 3 actions/project/week (effort, cost, expected impact, tracking link) → approve/skip → next week auto-review actual vs expected from metrics.
5. **Dashboard:** portfolio list (status, focus channel, last activity) + per-project page (profile, strategy, questions, content, metrics).

---

## 4. Data model — migration `0XX_marketkit.sql`

**Number at build time per §5.1** (expected 010 or 011). Full schema — vault sketch adapted: `mk_` prefix (M11), `owner_id → customers`, jobs table added for async AI work.

```sql
-- MarketKit portal module. All tables mk_-prefixed (shared DB with CC/ChatKit).

create table mk_projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references customers(id) on delete cascade,
  name text not null,
  url text,
  category text not null check (category in ('saas','consumer_app','game','local_business')),
  status text not null default 'active',        -- active | paused | archived
  budget_tier int not null default 0 check (budget_tier in (0, 500, 2000)),
  language text not null default 'en',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table mk_project_assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references mk_projects(id) on delete cascade,
  kind text not null check (kind in ('doc','screenshot','logo','data')),
  storage_path text not null,
  notes text,
  created_at timestamptz default now()
);

create table mk_project_profiles (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references mk_projects(id) on delete cascade,
  version int not null default 1,
  profile jsonb not null,                        -- structured scan output
  created_at timestamptz default now(),
  unique (project_id, version)
);

create table mk_founder_questions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references mk_projects(id) on delete cascade,
  question text not null,
  why_needed text,
  answer text,
  answered_at timestamptz,
  status text not null default 'open'            -- open | answered | dismissed
);

create table mk_strategies (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references mk_projects(id) on delete cascade,
  version int not null default 1,
  budget_tier int not null,
  positioning text,
  icp jsonb,
  channel_plan jsonb,                            -- ranked, with cost/effort/expected
  launch_checklist jsonb,
  calendar jsonb,                                -- 30-day content calendar
  created_at timestamptz default now(),
  unique (project_id, version)
);

create table mk_links (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references mk_projects(id) on delete cascade,
  dub_id text,
  url text not null,
  utm jsonb default '{}',
  clicks int default 0,
  conversions int default 0,
  updated_at timestamptz default now()
);

create table mk_actions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references mk_projects(id) on delete cascade,
  strategy_id uuid references mk_strategies(id) on delete set null,
  week date,                                     -- Monday of the sprint week
  title text not null,
  channel text,
  effort text,                                   -- S | M | L
  cost_eur numeric(8,2) default 0,
  expected_outcome text,
  tracking_link_id uuid references mk_links(id) on delete set null,
  status text not null default 'proposed',       -- proposed | approved | done | skipped
  actual_outcome text,
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

create table mk_content_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references mk_projects(id) on delete cascade,
  action_id uuid references mk_actions(id) on delete set null,
  platform text,                                 -- x | linkedin | reddit | blog | ...
  format text,                                   -- post | thread | article | image | ...
  draft text,
  final text,
  voice_edited boolean not null default false,   -- M8 gate: cannot be 'approved' without it
  status text not null default 'draft',          -- draft | approved | published
  published_at timestamptz,
  tracking_link_id uuid references mk_links(id) on delete set null,
  created_at timestamptz default now()
);

create table mk_metrics_snapshots (
  id bigint generated always as identity primary key,
  project_id uuid not null references mk_projects(id) on delete cascade,
  source text not null check (source in ('ga4','gsc','dub','screenshot','manual')),
  platform text,
  metric text not null,
  value numeric(18,4) not null,
  period_start date,
  period_end date,
  ingested_at timestamptz default now(),
  raw jsonb default '{}'
);
create index idx_mk_metrics_lookup on mk_metrics_snapshots (project_id, source, metric, period_end desc);

-- Async AI jobs (scan / launch-kit generation / sprint proposals run out-of-band)
create table mk_jobs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references mk_projects(id) on delete cascade,
  kind text not null,                            -- scan | launch_kit | sprint_propose | sprint_review
  status text not null default 'queued',         -- queued | running | done | error
  input jsonb default '{}',
  result jsonb,
  error text,
  created_at timestamptz default now(),
  started_at timestamptz,
  finished_at timestamptz
);

-- Enum extensions (M2.3)
alter table customer_products drop constraint if exists customer_products_product_check;
alter table customer_products add constraint customer_products_product_check
  check (product in ('signakit','chatkit','tradekit','marketkit'));
-- (mirror the same pattern for customers.signup_source)

-- RLS: every mk_ table
--   SELECT/ALL policy: owner via project join OR public.is_admin()
--   mk_projects:  using (owner_id = auth.uid() or public.is_admin())
--   child tables: using (exists (select 1 from mk_projects p
--                        where p.id = project_id
--                          and (p.owner_id = auth.uid() or public.is_admin())))
-- Edge Functions / job workers use service role.
```

---

## 5. Shared foundations with TechKit (coordination)

TechKit development (Sessions A–D per `TECHKIT-BRIEF.md`) is running **in this same repo in parallel**. Shared surface:

### 5.1 Migration numbering — hard rule
Both briefs allocate migrations in one sequence. **At the start of any session that creates a migration, list `supabase/migrations/` and take the next free number.** Expected: TechKit 009 (+cron wiring possibly 010) → MarketKit 010 or 011. Never hardcode a number from a brief without checking.

### 5.2 Edge Function infrastructure (TechKit builds it first)
TechKit Session A establishes: `supabase/functions/_shared/` (supabase service client, **notify helpers** — Resend + Telegram), the CRON_SECRET/Vault pattern, and pg_cron wiring. MarketKit **reuses all of it**:
- New function `marketkit-worker` (same auth pattern): tasks `scan`, `launch_kit` (job-queue driven, §6), later `metrics_ga4`, `metrics_gsc`, `dub_sync`, `sprint_propose`, `sprint_review` (cron-driven, backlog B).
- Notifications (sprint proposals ready, weekly review) go through the shared notify helpers — Telegram/Resend, same channels as TechKit alerts.
- **Sequencing:** if MarketKit Session A somehow starts before TechKit Session A ships `_shared/`, bootstrap the minimal `_shared/` yourself following TECHKIT-BRIEF §5 — do not create a divergent second pattern.

### 5.3 Data split (M10)
GA4, GSC, Dub, social/screenshot metrics, content performance → `mk_metrics_snapshots` (MarketKit). Uptime, provider health, deploys, infra costs, CrUX vitals → TechKit tables. Cross-links (marketing events annotated on TechKit charts and vice versa) are a shared backlog item — not MVP.

---

## 6. AI pipeline

| Stage | Model | Where it runs |
|-------|-------|---------------|
| Project scan (vision + docs + URL crawl) | `claude-sonnet-5` | `marketkit-worker` Edge Function, job-queue pattern |
| Founder questions generation | `claude-sonnet-5` | same job as scan |
| Launch Kit / strategy generation | `claude-fable-5` (quality over volume) | `marketkit-worker`, `launch_kit` job |
| Content drafts (batch) | `claude-sonnet-5` | same job as launch kit |
| Sprint proposals / reviews (backlog B4) | `claude-sonnet-5` | cron task |

Check current model ids/pricing via the `claude-api` skill at build time.

**Job-queue pattern (why not plain API routes):** a scan reads N assets with vision + crawls a URL + synthesizes — easily past Vercel function limits. Flow: UI `POST /api/portal/marketkit/jobs` → insert `mk_jobs(queued)` → invoke `marketkit-worker` (fire-and-forget fetch with the job id) → worker sets `running`, does the work (Supabase Edge Functions allow long wall-clock), writes result tables + `done` → UI polls the job row (simple `setInterval`, ChatKit-style) and re-renders. Errors land in `mk_jobs.error`, never as a hung spinner.

`ANTHROPIC_API_KEY` already exists in this repo's env — add it to Supabase Edge Function secrets for the worker (TechKit's digest task needs the same copy; coordinate via §5.2).

---

## 7. Session plan

### Session A — module kickoff (portal skeleton → first Launch Kit)
- [ ] **A1. Module scaffold** *(replaces vault "new repo scaffold")*: migration `0XX_marketkit.sql` (§4, incl. enum extensions + RLS + storage bucket), apply in Supabase. Dogfood account: Martin signs up as customer, SQL-enroll `marketkit/internal` (§2.2). `PortalTopBar` conditional MarketKit item + route guard.
- [ ] **A2. Intake flow**: project CRUD + multi-file asset upload to `marketkit-assets` (drag & drop, image preview) + asset list UI.
- [ ] **A3. Job infrastructure**: `mk_jobs` flow end-to-end — API route → `marketkit-worker` Edge Function skeleton → status polling UI (§6).
- [ ] **A4. AI project scan v1**: `scan` job per §3.2 → `mk_project_profiles` + `mk_founder_questions`; questions answerable inline; answers versioned into the profile.
- [ ] **A5. Launch Kit generator v1**: `launch_kit` job per §3.3 → `mk_strategies` + `mk_content_items` drafts; rendered page + Markdown export.
- [ ] **A6. Dashboard skeleton**: portfolio list + per-project page (profile / strategy / questions / content / metrics tabs; metrics = manual/CSV entry only in Session A).
- [ ] **A7. Dogfood #1 — MarketKit itself**: run intake → scan → Launch Kit end-to-end on MarketKit. Fix what breaks. Output doubles as MarketKit's own GTM plan.

**Definition of done (Session A):** one project fully onboarded end-to-end on app.mdntech.org, Launch Kit generated and readable, founder questions answerable, all data persisted in `mk_` tables, invisible to non-enrolled customers.

### Sessions B–D backlog (ordered; adjust after A)
- [ ] **B1. Metrics ingestion — Google**: GA4 Data API + GSC OAuth pull per project (quotas §9), daily snapshot cron via `marketkit-worker` + pg_cron (§5.2).
- [ ] **B2. Screenshot ingestion**: upload social/analytics screenshot → Claude vision → normalized `mk_metrics_snapshots`. The MVP answer for X/LinkedIn/TikTok/Instagram — no APIs.
- [ ] **B3. Dub integration**: auto-create tracked short links for every action/content item; pull click/conversion stats (free tier → ~$25/mo).
- [ ] **B4. Weekly sprint loop**: `sprint_propose` cron (3 actions/project/week: effort, cost, expected impact, tracking link) → approve/skip UI → `sprint_review` cron (actual vs expected). **The product's core loop and future learning substrate.** Notifications via shared notify helpers.
- [ ] **B5. Onboard remaining dogfood set** (ChatKit, 3 SK clients, Swarm Resistance) — one per playbook category; refine §8 defaults from friction found.
- [ ] **C1. Content studio**: in-portal creation/edit with mandatory founder-voice edit before `approved` (M8, M12 — rebuild, no Rahadu code port).
- [ ] **C2. GEO module v1**: llms.txt + schema/FAQ audit per project (reuse seo-* agent logic), freshness checks, lightweight "cited by AI?" spot-check; build-vs-integrate (Otterly $29/mo) decision after.
- [ ] **D1. Featured projects landing** (opt-in) + public marketing surface — MarketKit launching itself through its own Launch Kit. Location TBD (mdntech.org section vs own domain — open question 1).
- [ ] **D2. Multi-user + billing**: public signup path, subscription per portfolio + credits for content generation (ChatKit `plans.ts` as template, Rahadu credit-model), Stripe (shares the ChatKit Stripe work, repo priority 1).

---

## 8. Channel defaults to encode (from research, 2026)

Per category × budget tier — the strategy engine's starting table (orientation values; re-verify before public launch):

- **€0 (all categories):** problem-specific communities + Reddit (3–8 % conv, best per-visitor) → SEO/GEO content (FAQ format, freshness, schema) → directories (Uneed, Microlaunch; BetaList free queue 4–6 wks) → operator DMs (highest conv/hour) → build-in-public on X as *learning* channel (honest yield: 500–5k followers/12 mo, 20–200 customers/24 mo). PH/HN only week 6+ with an audience; PH featured ~10 % of launches, conv 1–3 %; Show HN front page 5–30k uniques, thread ranks for years.
- **≤€500/mo:** the above + exactly ONE paid channel: Google Search for high-intent/B2B/local (avg CPC $5.42, EU ecommerce €0.38–0.44; legal-type niches up to ~$9.87) OR Meta for consumer/visual (CPM ~$14.19, CPA ~$38 and climbing +38 % YoY). TikTok paid excluded (needs ~€500/mo alone to exit learning phase). Tool stack ~$50/mo (Plausible/Umami + PostHog free tier + Dub + GA4/GSC).
- **≤€2000/mo:** 1–2 paid channels + retargeting + GEO tracking (Otterly $29 / Rankscale €20 tier) + content promotion. PLG math still rules: sustainable CAC ceiling ~$200–700 (SMB SaaS); consumer apps $24–87.
- **Category notes:** B2B SaaS → self-serve/PLG motion only at these budgets (self-serve CAC ~$702 vs sales-led $11.4k); local business → GBP + reviews + local SEO dominate (see Royal Stroje playbook); games/consumer → community + short-video organic (TikTok/Shorts organic OK, paid not).

## 9. Integration constraints (verified realities, 2026)

- **GA4 Data API**: free; 200k tokens/day/property, but multi-tenant cap **14k tokens/property/hour per Cloud project** and 10 concurrent requests → serialize/batch pulls, cache daily. GSC API free, 25k rows/call. ✅ MVP.
- **X API**: no free tier since 2/2026; pay-per-use $0.005/read, $0.015/write ($0.20 with URL), 2M reads/mo cap, 7-day search only. Reading own small-scale stats affordable; publishing-with-links expensive. Third-party providers cheap but ToS-grey — avoid in a product.
- **LinkedIn API**: partner-gated, months of approval → CSV/manual/screenshot only. Plus algorithmic suppression of AI-looking content → `voice_edited` gate is a product requirement, not nice-to-have.
- **Meta Graph API**: free per-call but App Review + business verification (weeks); IG hard cap 50 API posts/24 h. Phase 2 (B-backlog), not MVP.
- **TikTok API**: sandbox + audit gate, no free commercial data. Screenshot ingestion only.

## 10. MVP non-goals (explicit)

No ML/learning layer · no ad-account management · no auto-posting · no public signup/billing · no LinkedIn/TikTok API integrations · no universal connector dashboard · no TechKit-territory metrics (M10). Anything cut must be visible in the UI as "manual for now", not silently absent.

## 11. Open questions (non-blocking for Session A)

1. **Public surface location** (needed by D1, not before) — mdntech.org/marketkit section vs own domain (marketkit.io/.app). Living in the portal makes an own-domain launch a marketing-site question, not an architecture one.
2. **Content studio IP** — confirm with lawyer whether porting code authored inside the Rahadu SaaS Portal repo is clean under the Agreement; until then C1 = rebuild (M12).
3. **Pricing posture** — validate €29–49/portfolio + credits against Okara $99 single-site after dogfooding gives us a value story.
4. **X publishing** — pay-per-use API vs manual posting with pre-generated content. Recommendation: manual in MVP, revisit at D2.
5. **Dogfood account email** — which email Martin uses for the builder account (must differ from the admin `team_members` email).

---

*Vault cross-links (to update at next Mind Palace /wrap): MarketKit wiki + MVP Task List & Tech Brief (superseded banner) + decisions.md (repo reversal). Sibling brief: `TECHKIT-BRIEF.md`.*
