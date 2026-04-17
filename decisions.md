# M.D.N Tech -- Decision Log

Key architectural and strategic decisions, with reasoning and alternatives considered. Append new entries at the bottom.

---

## 2026-04-16 -- Session 11 -- Six architectural decisions locked (D1-D6)

Context: Two planning drafts (repo 2026-03-21 and Mind Palace 2026-04-16) had drifted from each other and from the actual codebase. Session reconciled them and locked six forks. Full briefing at [command-center/MIND-PALACE-BRIEFING.md](command-center/MIND-PALACE-BRIEFING.md).

### D1 -- Command Center URL

**Decision:** CC moves from `mdntech.org/command-center` to `admin.mdntech.org`. Customer portal takes `app.mdntech.org`.

**Why:** The website rebuild (Session 11 input) repositioned `app.mdntech.org` as the customer-facing portal. "app" is a more valuable subdomain for customers than for internal ops. `admin.` is self-documenting for founder-only access (conventional SaaS pattern) and allows independent deploy cycles from marketing.

**Alternatives:** `cc.mdntech.org` (less self-documenting), `app.mdntech.org/admin` role-gated (couples customer and internal deploy cycles), keep at `mdntech.org/command-center` (bloats marketing bundle).

### D2 -- Single Supabase project

**Decision:** One Supabase project (`ijfgwzacaabzeknlpaff`) holds both CC internal ops and portal customer data. Segmentation happens at the RLS layer.

**Why:** CC needs to see customer metrics (chatbot usage, revenue, per-product health) without cross-DB queries. A split would force an ETL pipeline.

**Alternatives:** Two Supabase projects (cleaner blast radius, but requires ETL for cross-querying).

### D3 -- Two-table user model

**Decision:** `auth.users` is the single identity source; `team_members` (founders only, 2 rows, role 'admin') and `customers` (portal users) are separate. `handle_new_user()` branches on `raw_user_meta_data->>'account_type'` set at signup.

**Why:** Customers and founders have fundamentally different permissions and data ownership. One table with a polymorphic role column would force every RLS policy to distinguish them anyway. Two tables make the distinction explicit.

**Alternatives:** Single `profiles` table with role column (more implicit, harder to reason about); separate Supabase project for customers (see D2).

### D4 -- Clients vs Customers as separate tables

**Decision:** `clients` (internal CRM -- businesses we work with on custom dev or managed services) and `customers` (portal users who self-serve) are separate tables. Optional FK `clients.customer_id -> customers.id` when the same business is both.

**Why:** These are different entities with different lifecycles. A client may never sign up to the portal; a customer may never be a CRM entry. Conflating them would force schema compromises on both sides.

**Alternatives:** Single unified "accounts" table (premature; complects two workflows).

### D5 -- Product ownership via owner_id (hybrid path)

**Decision:** Every customer-facing resource gets an `owner_id uuid REFERENCES customers(id)` column. Nullable in migration 004 (`NULL` = internal-managed chatbot for existing Royal Stroje pattern). After portal launches in Phase 2, backfill internal-managed rows with customer accounts we create on clients' behalf. Later migration tightens `owner_id` to NOT NULL.

**Why:** Hybrid path lets migration 004 ship without requiring the portal to exist first. RLS expression (`owner_id = auth.uid() OR public.is_admin()`) is correct either way -- NULL never matches `auth.uid()`. Converges on unified model incrementally.

**Alternatives:** Unified from day 1 (blocks migration 004 on portal existing -- chicken-and-egg); keep dual path indefinitely (defers complexity without resolving it).

### D6 -- Mind Palace holds authoritative plan

**Decision:** `MindPalace/Projects/MDN-Tech/development-plan.md` (v2, locked 2026-04-16) is the single authoritative plan. Repo holds a short [PLAN.md](PLAN.md) pointer with a last-synced date and active-phase summary. Old `command-center/DEVELOPMENT-PLAN.md` gets a SUPERSEDED banner and stays for historical reference only.

**Why:** Three parallel planning documents will drift. Mind Palace is where strategic context lives (decisions, background, stakeholder notes); repo is where code lives. Each should own what it's best at.

**Alternatives:** Dual-maintain in both places (guaranteed drift); repo as authoritative (planning context harder to edit in code review flow); delete the old plan (loses historical context).

---

## 2026-04-16 -- Session 11 -- ChatKit free-tier set at 50 messages

**Decision:** 50 free messages per customer, then paid plan required.

**Why:** Mind Palace v2 flagged the initial 20-message proposal as too low for meaningful prospect eval. Actual observed cost was ~$0.025/msg (higher than Haiku 4.5 pricing alone implies, likely due to system-prompt bloat with KB entries), meaning 50 msgs costs ~$1.25 per free signup. Acceptable for acquisition; abuse risk managed via per-account caps rather than aggressive message limits.

**Alternatives:** 20 messages (too low for prospect eval), 100/month renewable (higher ongoing cost), no free tier (kills conversion funnel).

**Revisit:** Phase 2 launch. Also evaluate OpenAI gpt-4o-mini / gpt-5-nano vs Haiku for cost/quality trade-off. Trim KB injection to reduce per-message token cost.

---

## 2026-04-16 -- Session 11 -- MCP Supabase via hosted OAuth

**Decision:** Configure Supabase MCP at repo root as `.mcp.json` using the hosted OAuth variant (`https://mcp.supabase.com/mcp?project_ref=ijfgwzacaabzeknlpaff`). No token in repo.

**Why:** Source-controlled config travels with the repo; OAuth handles auth without token management; matches the TradingBot project's pattern. Token-in-env-var alternative (like AuthVault uses) also works but adds a setup step for other machines.

**Alternatives:** stdio variant with token in `~/.claude.json` (works, but config doesn't travel); stdio with env-var token reference (middle ground but requires env-var expansion support).

---

## 2026-04-17 -- Session 12 -- Portal uses same Next.js app with host-branching

**Decision:** The customer portal (`app.mdntech.org`) runs in the same Next.js project as the marketing site and Command Center, using middleware host-branching to route requests to `app/portal/*` internally.

**Why:** Shares design tokens, Supabase clients, chatbot API infrastructure, and build pipeline. One deploy covers all three surfaces. The middleware pattern proved clean for admin.mdntech.org in the same session and scales naturally to a third host.

**Alternatives:** Separate Next.js project for portal (independent release cadence, but duplicates shared code and requires separate Vercel project); monorepo with Turborepo (overkill for 2-person team at current scale).

**Revisit:** If the portal grows to need its own release cadence or the shared build becomes a bottleneck.

---
