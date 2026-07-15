---
title: "MarketKit — Session A go-live runbook"
status: LIVE (executed Session 37, 2026-07-11)
created: 2026-07-10
sibling: MARKETKIT-BRIEF.md (execution brief), TECHKIT-SETUP.md (same pattern)
---

# MarketKit — Session A go-live runbook

> **EXECUTED Session 37 (2026-07-11).** Steps 1–5 done: migration 012 applied + audited, `ANTHROPIC_API_KEY` in edge secrets, `marketkit-worker` v1 ACTIVE, dogfood `bugiiiii@protonmail.com` enrolled, E2E smoke passed (2 projects scanned, 1 Launch Kit). **Gotcha found live:** the migration's storage policies had a correlated-subquery column-capture bug (bare `name` → `mk_projects.name`) that denied all uploads — fixed via ALTER POLICY, migration file synced (`26ad3b9`). Remaining: step 6 / A7 (asset re-upload → scan v2 → kit v2 + MarketKit-as-project). Kept below for reference / re-runs.

Session 36 shipped all of MarketKit Session A **code** (migration, worker, portal module) and it is **build-verified** (`tsc` + `next lint` + `next build` green). Nothing is live yet — this runbook turns it on. Follow top-to-bottom. Steps that need Martin's hands are flagged **[Martin]**.

**What "live" means for Session A:** one project fully onboarded end-to-end on `app.mdntech.org/marketkit` — intake → AI scan → Launch Kit — with everything persisted in `mk_` tables and invisible to non-enrolled customers.

---

## 0. Prerequisites (already true from TechKit go-live, Session 34)

- `CRON_SECRET` is set as an Edge Function secret **and** in Vercel env (all environments). The worker reuses it — no new invocation secret.
- `SUPABASE_MANAGEMENT_API_KEY` in `.env.local` (used for remote migration apply + function deploy, no CLI on this machine — see TECHKIT-SETUP §"Gotchas").
- `ANTHROPIC_API_KEY` exists in the repo/Vercel env. It is **not yet** an Edge Function secret — step 3 adds it.

---

## 1. Apply migration `012_marketkit.sql`

Numbered **012** because TechKit Session B (parallel, Session 35) took **011**. Apply **after** 011.

Apply via the Supabase Management API query endpoint (repo convention) **or** the SQL editor. It creates: 10 `mk_` tables + RLS (admin-or-owner via project join), the enum extensions (`customer_products.product` += `marketkit`, `plan` += `internal`, `customers.signup_source` += `marketkit`), the private `marketkit-assets` storage bucket + 3 storage policies.

**Post-apply verify** (trust the DB state, not the HTTP response — see TECHKIT-SETUP Gotcha #1):
- 10 `mk_*` tables exist, RLS enabled on all 10.
- `select id from storage.buckets where id = 'marketkit-assets'` returns a row.
- `select conname from pg_constraint where conname = 'customer_products_product_check'` — its check includes `marketkit`.

---

## 2. [Martin] Create the dogfood account (BRIEF §2.2, open question 5)

The portal blocks non-`customer` accounts, so Martin needs a **customer** account with an email **different from his `team_members` admin email**.

1. **[Martin]** Sign up at `https://app.mdntech.org/signup` with a fresh email → creates a `customers` row (via `handle_new_user()`), confirm the branded email.
2. Get his `customers.id`: `select id, email from customers where email = '<that email>';`
3. Enrol in MarketKit (the commented block at the bottom of `012_marketkit.sql`):
   ```sql
   insert into customer_products (customer_id, product, plan, status)
   values ('<MARTIN_CUSTOMER_UUID>', 'marketkit', 'internal', 'active')
   on conflict (customer_id, product) do nothing;
   ```
4. Log in → the **MarketKit** nav item should appear between ChatKit and Settings. A ChatKit-only customer must NOT see it, and `app.mdntech.org/marketkit` without enrolment must redirect to `/toolkit`.

---

## 3. [Martin] Add `ANTHROPIC_API_KEY` to Edge Function secrets

The worker calls the Anthropic API from Deno. Push the existing key to Supabase Edge Function secrets (Management API `/secrets`, same call TechKit used for `CRON_SECRET`, or Dashboard → Edge Functions → Secrets). `CRON_SECRET` is already there — do not touch it.

---

## 4. Deploy `marketkit-worker` (no CLI — Management API multipart deploy)

Same endpoint TechKit used (`POST /v1/projects/{ref}/functions/deploy?slug=marketkit-worker`). Metadata `{ entrypoint_path: "marketkit-worker/index.ts", verify_jwt: false }` + **3 file parts** preserving relative paths:
- `marketkit-worker/index.ts`
- `marketkit-worker/claude.ts`
- `_shared/supabase.ts`

(`config.toml` already declares `[functions.marketkit-worker] verify_jwt = false`.) Note: local `curl.exe` fails on this machine's TLS interception (exit 35) — use `Invoke-RestMethod` / `HttpClient` (Windows cert store).

**Smoke test the worker** (needs a queued job to exist — easier to test end-to-end via the UI in step 5). A bare `POST` with the right bearer but no/invalid `job_id` should return `400`; a wrong bearer should return `401`.

---

## 5. End-to-end smoke test (A2–A6)

On `app.mdntech.org/marketkit` as the dogfood customer:
1. **New project** → name, URL, category, budget tier. Lands on the project page.
2. **Profile tab** → drag in a screenshot + a doc. They appear in the asset list.
3. **Run AI scan** → button shows "Scanning…", polls `mk_jobs`. After ~1 min: Profile fills in, **Questions** tab has 4–7 questions.
4. Answer 1–2 questions inline.
5. **Launch Kit tab** → **Generate Launch Kit** (disabled until a profile exists). After ~1–2 min: positioning, ICP, ranked channel plan, checklist, 30-day calendar, and **Content** tab has 5–8 drafts. **Export Markdown** downloads the kit.
6. Confirm rows landed: `mk_project_profiles`, `mk_founder_questions`, `mk_strategies`, `mk_content_items`, and `mk_jobs` are all `done`.

If a job sticks on `error`, read `mk_jobs.error` — common causes: `ANTHROPIC_API_KEY not set` (step 3), model refusal (the Fable-5 launch-kit call has an opus-4.8 server-side fallback, but check anyway), or a malformed page crawl (non-fatal — scan continues without it).

---

## 6. A7 — Dogfood #1: MarketKit itself

Run the full flow on **MarketKit** as the project (name "MarketKit", URL = wherever it's described, budget tier per Martin). The generated Launch Kit doubles as MarketKit's own GTM plan (BRIEF §7 A7). Fix whatever breaks; note friction for Session B.

---

## Notes / decisions carried

- **Worker model choice** (BRIEF §6): scan = `claude-sonnet-5` (thinking disabled, effort medium, vision over uploaded images); launch kit = `claude-fable-5` (effort medium, server-side fallback → `claude-opus-4-8`). Bump effort to `high` later if quality needs it — watch Edge Function wall-clock.
- **Storage**: private `marketkit-assets` bucket, path `mk/{project_id}/{asset_id}-{filename}`, owner-or-admin RLS. Uploads go browser→storage directly (RLS-scoped); the worker downloads via service role.
- **Job pattern**: UI `POST /api/portal/marketkit/jobs` → insert `mk_jobs(queued)` → fire `marketkit-worker` (fire-and-forget) → worker marks `running`, does the work in the background (`EdgeRuntime.waitUntil`), writes result + `done`; UI polls the `mk_jobs` row.
- **Not in Session A** (visible as "manual for now" in the UI, per §10): metrics ingestion (GA4/GSC/Dub/screenshots), the weekly sprint loop, content voice-editing + publishing. Those are Session B/C (BRIEF §7).
- **Non-blocking open questions** (BRIEF §11): dogfood email (Q5 — resolved at step 2), public surface location (Q1, D1), content-studio IP (Q2, C1), pricing (Q3), X publishing (Q4).

---

# Session B go-live addendum — sprint loop (B4) + screenshot metrics (B2)

Session B adds three worker job kinds (`sprint_propose`, `sprint_review`, `metrics_screenshot`), two cron batch entrypoints (`{"task":"sprint_propose_all"}` / `{"task":"sprint_review_all"}`), the Sprint tab, and the Metrics tab (screenshot import + manual entry). Go-live order matters:

## B-1. Redeploy `marketkit-worker` (v2)

Same multipart endpoint as step 4, now with **4 file parts** — the worker imports the shared notify helpers for the Telegram sprint summaries:
- `marketkit-worker/index.ts`
- `marketkit-worker/claude.ts`
- `_shared/supabase.ts`
- `_shared/notify.ts`  ← **new — a v2 deploy without it fails at import time**

Smoke: wrong bearer → `401`; right bearer + empty body → `400 job_id required`; right bearer + `{"task":"sprint_propose_all"}` → `202` (and jobs/actions appear — see B-3).

## B-2. Apply migration `013_marketkit_sprint_cron.sql`

Two pg_cron schedules (reuse Vault secret `techkit_cron_secret`): `marketkit-sprint-review` Mon 06:00 UTC, `marketkit-sprint-propose` Mon 07:00 UTC (review first so proposals build on fresh outcomes). Apply **after** B-1 — the crons call entrypoints only v2 understands. Verify: `select jobname, schedule, active from cron.job where jobname like 'marketkit%';`

## B-3. Smoke test

1. `POST …/functions/v1/marketkit-worker` with `{"task":"sprint_propose_all"}` → 202; within ~1–2 min every **active** project with a profile gets 3 `mk_actions(proposed)` for the current week + a Telegram summary. Projects without a profile error cleanly in `mk_jobs.error`.
2. UI: Sprint tab shows the proposals; Approve/Skip work; "Re-roll this week" replaces proposed (never approved) actions.
3. Metrics tab: upload an analytics screenshot → rows appear in `mk_metrics_snapshots` (`source='screenshot'`); add one manual metric.
4. Review path only has data after a week ends: actions approved in week N are reviewed Monday of week N+1 (or via "Review past weeks now").

## Session B notes

- **M9 (tracked links)**: every proposed action gets an `mk_links` row with plain UTM params (`utm_source=<channel>`, `utm_medium=marketkit`, `utm_campaign=sprint-<week>`) on the project URL. Click counts stay 0 until Dub lands (backlog B3).
- **Sprint week convention**: `mk_actions.week` = Monday (UTC) of the sprint week, computed by the worker; the UI mirrors it via `mondayOfWeek()` in `lib/marketkit/types.ts`.
- **Pausing a project** (`mk_projects.status = 'paused'`) removes it from the Monday cron batches.
- **Metrics screenshots** upload to `mk/{project_id}/metrics/…` — same bucket + RLS as scan assets, but **no `mk_project_assets` row**, so the AI scan never reads them. The jobs API pins `storage_path` to the caller's project folder before the service-role worker touches it.
- **Still not in Session B**: GA4/GSC pulls (needs a Google Cloud service account — next session), Dub tracked-link stats (B3), content voice-editing/publishing (C1).

---

# Session B3 go-live runbook — Dub tracked links

**Status: CODE-COMPLETE, GO-LIVE PENDING (built Session 41, 2026-07-15).** Same "code done, build-verified, turn-on deferred" pattern as MarketKit Session A (Session 36) — nothing is deployed. The code degrades cleanly with **no `DUB_API_KEY`**: link creation is skipped, actions keep their plain UTM links, `dub_sync` runs are no-ops that report `skipped`. When Martin creates a Dub account and the key is added, one worker redeploy + one migration turn the whole loop on and it self-heals historical links on the next sync.

**What B3 adds**
- `supabase/functions/_shared/dub.ts` — tiny Dub REST client (create link via `POST /links`, pull counts via `GET /links/info`), enabled only when `DUB_API_KEY` is present. **`/links/info` is deliberate:** it's a standard endpoint (60 req/min, free tier) that returns the link's live `clicks`/`conversions`, whereas `GET /analytics` is Pro-only — so click stats work on Dub's free plan.
- `marketkit-worker`: new `dub_sync` task per project + `dub_sync_all` batch entrypoint. `sprint_propose` is **unchanged** — it still creates the plain-UTM `mk_links` row (M9). `dub_sync` does the Dub work lazily: (a) **backfill** — create a Dub short link (store `dub_id`, rewrite `url` to the short link) for a link **only if its action is `approved`/`done`**; (b) **refresh** — pull `clicks`/`conversions` for every Dub-linked row; (c) write a delete-then-insert daily project-level `mk_metrics_snapshots` rollup (`source='dub'`, metric `link_clicks`/`link_conversions`).
- `016_marketkit_dub.sql` — `idx_mk_links_project` + the daily `marketkit-dub-sync` cron (05:30 UTC, before the Monday 06:00 sprint review so it reads fresh clicks).
- UI: Sprint board shows `N clicks · N conv` on each Dub-linked action; Metrics tab gains a **Tracked links** table + a **Sync now** button (`dub_sync` job).

> **Why committed-only (approved/done) links?** The free tier allows **only 25 new links/month**. `sprint_propose` proposes 3 actions/project/week and a re-roll *deletes* the proposed ones — creating a Dub link on propose would permanently burn quota on discarded proposals and orphan the link. Gating creation on committed actions spends the budget only on work the founder actually committed to.

### B3-0. [Martin] Create the Dub account + API key

1. Sign up at **dub.co** (free tier). Optionally set a workspace default domain (free tier uses `dub.sh`; a branded domain is a paid upgrade — not required).
2. Create a workspace **API key**: Dashboard → Settings → API Keys → Create. Copy it (starts `dub_…`).
3. Paste into `.env.local` as `DUB_API_KEY=dub_…` (for reference/record — the **Next.js app never calls Dub**; only the edge worker does, so the operative copy is the edge secret in the next step).

> **Conversions:** click counts work out of the box the moment a link is created. **Conversion (lead/sale) counts require Dub's conversion tracking installed on each destination site** (Dub `@dub/analytics` script + a server-side lead/sale event) — not in MVP scope, so `conversions` will read 0 until that's set up per site. The column + UI are wired so it lights up later with no code change.

### B3-1. [Martin] Add `DUB_API_KEY` to Edge Function secrets

Push it to Supabase Edge Function secrets (Management API `POST /secrets`, same call used for `ANTHROPIC_API_KEY` / `CRON_SECRET`). Do **not** touch the existing secrets. Until this exists the worker skips all Dub work cleanly.

### B3-2. Redeploy `marketkit-worker`

Same multipart deploy endpoint (`POST /v1/projects/{ref}/functions/deploy?slug=marketkit-worker`), now with **5 file parts** — adds the new shared Dub client:
- `marketkit-worker/index.ts`
- `marketkit-worker/claude.ts`
- `_shared/supabase.ts`
- `_shared/notify.ts`
- `_shared/dub.ts`  ← **new — a redeploy without it fails at import time**

Smoke: wrong bearer → `401`; right bearer + `{"task":"dub_sync_all"}` → `202`. With the key set, within ~1 min every active project's links get Dub short links (backfill) + refreshed counts; a project-level `source='dub'` metrics snapshot appears. **Without** the key, jobs finish `done` with `{"skipped":"DUB_API_KEY not set"}` and change nothing.

### B3-3. Apply migration `016_marketkit_dub.sql`

Adds the index + the daily `marketkit-dub-sync` cron (05:30 UTC). Apply **after** B3-2 (the cron calls `dub_sync_all`, which only the redeployed worker understands). Verify: `select jobname, schedule, active from cron.job where jobname = 'marketkit-dub-sync';`

### B3-4. Smoke test (with the key live)

1. On a project with at least one **approved/done** sprint action: run **Sync now** on the Metrics tab (or `POST …/marketkit-worker {"task":"dub_sync_all"}`). That link's `mk_links` row gets a `dub_id` and its `url` becomes a `dub.sh/…` short link. (Proposed-only actions are intentionally skipped — approve one first.)
2. Open a short link in a browser → wait a few seconds (Dub is near-real-time) → **Sync now** again → the link's `clicks` increments in the Tracked links table and on the Sprint board action.
3. Confirm a `source='dub'` row landed in `mk_metrics_snapshots` (feeds the sprint review + Metrics table).
4. Re-run `dub_sync_all` twice → no duplicate links created (backfill is `dub_id is null`-guarded) and the daily snapshot is replaced, not duplicated (delete-then-insert per project per day).

### B3 notes

- **Graceful degradation is the invariant**: no key → plain UTM links keep working exactly as Session B shipped them; the only difference is short links + real click counts once the key lands. A Dub outage makes `dub_sync` a no-op (every call best-effort, returns a sentinel) and **never touches `sprint_propose`**.
- **`mk_links.url` semantics**: before Dub it's the UTM'd destination; after a Dub link is created it's the **short link** (the destination lives in Dub, reconstructable from the project URL + `utm`). Rows without a `dub_id` still hold the plain destination, which is what the backfill uses as the Dub target.
- **Idempotency**: backfill only creates a Dub link when `dub_id is null` **and** the action is committed; the per-project daily `dub` snapshot is delete-then-insert on `(project_id, source='dub', period_end=today)`. Safe to run the cron or **Sync now** as often as you like.
- **Free-tier budget (25 new links/month)**: enough for ~1–2 active projects' committed actions. Onboarding the full dogfood set to Dub short links needs **Pro (~$25/mo, 1,000 links/mo)**. Click analytics via `/links/info` work on free; the `/analytics` endpoint (unused here) is Pro-only.
- **Conversions stay 0 in MVP**: lead/sale tracking needs Dub's `@dub/analytics` script installed on each destination site **and** a Business+ plan. The `conversions` column + UI light up automatically once that's set up — no code change.
