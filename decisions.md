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

## 2026-04-17 -- Session 15 -- Phase 1.2 -- Role simplification cleanup

**Decision:** The `team_members.role` column will only ever issue `'admin'` going forward. The schema values `'engineer'` and `'viewer'` remain in the enum for backwards compatibility but will not be assigned to new team members.

**Why:** Decision D3 locked a 2-row, founders-only `team_members` table. The only operationally necessary role is `'admin'`. The schema was never updated to reflect this, leaving vestigial enum values. Rather than run a migration to tighten the constraint, document the intent: no code assigns engineer/viewer, and no new team member will receive those roles. If a future migration is needed, this decision log makes the rationale clear.

**Alternatives:** Add a CHECK constraint to enum only 'admin' (schema change, but more explicit); continue with unused enum values (status quo, but creates confusion).

---

## 2026-04-17 -- Session 19 -- Middleware role checks via metadata, not DB queries

**Decision:** Middleware role-type checks (`lib/supabase/middleware.ts`) use `user.user_metadata.account_type` JWT claim instead of querying `team_members` or `customers` tables for every request.

**Why:** Middleware runs on every request. A DB query for every request adds latency and load. JWT metadata (`account_type` is set at signup via `handle_new_user()` trigger) is already in the session and requires no extra round-trip. Portal signups set `account_type: 'customer'` in metadata; non-customer paths (admins) leave it unset or empty, making the distinction fast to check.

**Alternatives:** DB queries in middleware (reliable but high latency/cost; would need caching); separate middleware service with cached role state (over-engineered at current scale).

**Constraints:** If a customer role ever changes post-signup (e.g., promoting a user from customer to admin), the JWT metadata won't auto-update until the next session refresh. For the current Supabase Auth + portal model, this is fine: customers don't get promoted to admins. If this changes, revisit with a refresh trigger.

---

## 2026-04-18 -- Session 20 -- ToolKit replaces TradeKit as customer portal product

**Decision:** TradeKit (BTC perpetual futures trading bot) moves to admin-only dashboard. Customer portal gets ToolKit instead: a free developer tools hub with Claude Code skills + MCP integrations + future custom apps.

**Why:** ToolKit niche aligns with existing portal products (ChatKit for no-code AI, SignaKit for auth). Developers are the primary customer segment. TradeKit required significant additional testing + compliance work; ToolKit delivers immediate value (10 curated, verified skills) and builds community through an open, discoverable library. Freemium model (browse free, premium skills later) lowers customer friction vs. requiring product subscriptions.

**Alternatives:** Launch TradeKit publicly (ties portal to crypto, needs regulatory audit, longer iteration cycle); defer both and focus only on ChatKit (misses developer positioning opportunity); build entire custom skill gallery from scratch (reinventing existing ecosystem).

**Product positioning:** "From idea to production-ready systems — faster, smarter, secure." Three-product portal: ChatKit (no-code AI), SignaKit (auth + identity), ToolKit (dev tools). Vertical for small teams building production software.

**Freemium model:** Free tier: all Claude Code skills + basic integration guides. Premium tier (future): advanced skills, custom apps, expert setup guides. Pricing TBD; benchmark against Nate Herk's AI Automation Society ($99/month for templates + community).

**Phase schedule:** ToolKit Tier 1 (Prompt templates + integration recipes) ships next session. Phase 4 (auth provider consolidation: Supabase → SignaKit) proceeds independently; by then, portal has established demand velocity for SignaKit positioning.

---

## 2026-04-18 -- Session 20 -- ChatKit pricing tiers locked

**Decision:** ChatKit launches with 4 tiers — Free ($0/50msg/mo), Pro ($29/2000msg/mo), Max ($79/10000msg/mo), Enterprise (custom). Free tier serves as the trial (no separate trial period). Voice add-on is $10/mo for Pro, included in Max.

**Why:** Industry benchmark from Intercom Fin ($29-132/seat + $0.99/resolution), Drift ($2,500/mo enterprise-only), and FastBots ($29-299/mo) confirmed sweet spots at $29 and $79. Token cost per message at ~$0.005 (Claude Haiku 4.5) leaves margins of 72% (Pro) and 49% (Max), accounting for voice overhead. 50 free messages = sufficient for prospect evaluation per Session 11 economics review. Free-tier-as-trial avoids Stripe trial complexity and standard 14-day card-required friction.

**Alternatives:** Per-resolution pricing like Intercom (more complex billing, harder to forecast); 14-day card-required trial (industry standard but adds friction); single $49 tier (simpler but limits Enterprise upsell).

**Revisit:** After 100 paying customers, evaluate whether Pro→Max conversion needs adjustment. May need a 5,000-message intermediate tier if Max cap feels too high.

---

## 2026-04-18 -- Session 20 -- Voice provider: Cartesia Sonic-3

**Decision:** Use Cartesia Sonic-3 for ChatKit voice synthesis (TTS). Bundled in Max tier, $10/mo add-on for Pro tier. Free tier remains text-only.

**Why:** Cartesia's 90ms time-to-first-audio is ~4x faster than ElevenLabs (~300ms) — critical for real-time chatbot UX. State-space model architecture provides quality competitive with ElevenLabs at $4/mo Pro pricing (5x cheaper). Inworld AI was a close second (#1 TTS leaderboard) but Cartesia's lower latency wins for chatbot use case. Multilingual support is "growing" — sufficient for MVP English-only launch with expansion path.

**Alternatives:** ElevenLabs (premium quality, but expensive at scale and higher latency); Inworld AI (top quality, model-agnostic router, but slightly higher latency); Azure Neural TTS (140+ languages, best for Enterprise multilingual, but no real-time UX advantage); Fish Audio (#1 TTS-Arena, 80% cheaper than ElevenLabs, but less real-time tooling); Chatterbox open-source (free self-host, MIT license, but operational burden).

**Revisit:** When adding multilingual support beyond English (likely Q3 2026). May need Azure Neural TTS as fallback for Enterprise tier with 140+ language requirements.

---

## 2026-04-18 -- Session 20 -- Auto-learning MVP: Flag + Weekly Report

**Decision:** ChatKit auto-learning launches as Flag + Weekly Report pattern. Owners flag bad messages from conversation viewer; Sunday cron job aggregates flagged messages per chatbot; Claude analyzes them with KB context; generates weekly report with KB suggestions. No automatic application — owner reviews and approves manually.

**Why:** Existing `message_feedback` table (migration 005) already has correct/incorrect/helpful/not_helpful ratings + RLS for customer-scoped writes. Building flag UI and weekly aggregation on top is ~5 hours vs. ~12 hours for full one-click-apply or auto-fine-tuning. Manual review preserves quality control and avoids prompt drift from low-signal flags. Pattern matches RLHF fundamentals (HITL feedback loop) without ML pipeline complexity.

**Alternatives:** Full RLHF with auto-prompt-tuning (premature; needs more conversation volume to be statistically meaningful); One-click apply (better UX but doubles build time and adds approval flow complexity); No auto-learning, manual analytics only (loses key differentiator vs. Intercom/Drift).

**Revisit:** Phase 2 of auto-learning (one-click apply) once 10+ paying customers have submitted >100 flagged messages. Auto-fine-tuning gated on Pro+ usage data quality.

---

## 2026-04-18 -- Session 20 -- Build sequence: Pricing first, features second

**Decision:** Build ChatKit improvements in this order: (1) Pricing page + Stripe billing + plan tiers, (2) Auto-learning MVP, (3) Voice via Cartesia. Build pricing UI + schema in parallel with user creating Stripe account.

**Why:** Monetization unlocks revenue runway and validates demand before features burn build budget. UI + schema work doesn't block on Stripe account, so parallel execution is feasible. Auto-learning second (vs. voice) because it leverages existing `message_feedback` infrastructure with ~5 hour build vs. voice's ~6 hours + new dependency on Cartesia integration. Voice last because it's the most complex (real-time audio + WebSockets) and benefits from established billing infrastructure to gate access.

**Alternatives:** Features first (faster to demo but no revenue capture); Pricing + voice first (skips auto-learning differentiation); All three parallel tracks (fragments focus, slows each track).

**Revisit:** If Stripe account setup blocks more than 1 session, switch to features-first and add Stripe at end.

---
