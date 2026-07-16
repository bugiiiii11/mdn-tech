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

## 2026-04-28 -- Session 21 -- Strategic pivot: ToolKit becomes flagship, ChatKit pricing deferred

**Decision:** ToolKit moves ahead of ChatKit as the primary acquisition product. ChatKit pricing/Stripe/voice/auto-learning work (Session 20 build sequence) is deferred behind a portal redesign + ToolKit/Handoff page rebuild. New build order: (1) Portal shell redesign + Login/Signup + ToolKit page rebuilt around Handoff, (2) ChatKit pages restyled + analytics moved inline, (3) Settings restyle + marketing-site top-bar swap, then ChatKit pricing/voice/auto-learning resume per Session 20 plan.

**Why:** Handoff (4 free MIT-licensed Claude Code skills: `/start`, `/wrap`, `/save`, `/doc-update`) is a low-cost, high-distribution acquisition surface — it ships free, lives on social (dev.to/Reddit/X), and onboards Claude Code developers (the exact audience that buys ChatKit/SignaKit later). ChatKit monetization without a funnel feeds an empty pipe. ToolKit-first builds the funnel; ChatKit pricing harvests it. PlanKit (paid product family member) teases the upgrade path on the same page.

**Alternatives:** Continue with Session 20 sequence (revenue first, but no acquisition funnel = slow growth); ship Handoff as a separate marketing page only (loses portal nav cohesion + the "free product → paid product" hub story); collapse ToolKit and Handoff into one (forces premature naming lock — keeping ToolKit as the section lets PlanKit + future tools live there without rename).

**Revisit:** If ToolKit/Handoff drives <50 portal signups in 30 days post-launch, recheck whether the funnel hypothesis holds before continuing to defer ChatKit monetization.

---

## 2026-04-28 -- Session 21 -- Top bar replaces sidebar; portal IA flattened

**Decision:** Portal sidebar removed in favor of a top bar with 4 items: ToolKit · ChatKit · Settings · Home (Home = link back to mdntech.org). Logged-out top-right button = "Login"; logged-in = "Portal" (on marketing) / "Home" (on portal).

**Why:** With only 3 functional sections, a sidebar wastes ~240px of horizontal space and signals more depth than exists. Top bar matches the marketing site's pattern (consistency across the two surfaces) and is the SaaS norm for flat IA (Vercel, Linear, Stripe). Mobile uses a hamburger like the marketing site.

**Alternatives:** Keep sidebar + add top bar (over-chromed, fights for attention); replace with command palette only (too sparse, hides nav from new users).

---

## 2026-04-28 -- Session 21 -- Dashboard removed; default landing = ToolKit

**Decision:** The standalone `/portal/dashboard` page is removed. Chatbot analytics (metrics cards, 7-day trend, top keywords, conversation export) move inline into `/portal/chatkit/[id]`. After login, customers land on `/portal/toolkit`.

**Why:** Dashboard was a weak abstraction — its content (chatbot analytics) belongs to the chatbot, not the portal. Logged-in users landing on ToolKit aligns with the new acquisition strategy: their first impression after signup is the free tools they came for, with the ChatKit/Settings sections one click away. Removes the "what does Dashboard show now that we have one customer with one bot?" empty-state problem.

**Alternatives:** Keep Dashboard as a "Welcome / What's New" hub (added surface area without clear value at current scale); land on ChatKit (premature monetization framing for first-time visitors).

---

## 2026-04-28 -- Session 21 -- Public route exception for ToolKit

**Decision:** `/portal/toolkit/*` becomes publicly accessible (no auth required). `/portal/chatkit/*` and `/portal/settings/*` remain auth-gated. Middleware updated to allow the toolkit path through without a session redirect.

**Why:** ToolKit is the install destination linked from social posts (dev.to/Reddit/X) per HANDOFF_PAGE_SPEC. Forcing signup before installing free MIT skills kills the funnel — the goal is friction-free distribution. Logged-out visitors who like the install flow then convert to signup for ChatKit/PlanKit later. Auth wall stays where it matters (customer data and billing).

**Alternatives:** Keep the page behind login (kills distribution); host the install page on the marketing site at `mdntech.org/handoff` (splits the Handoff narrative across two domains, breaks the spec's "page is the canonical install destination" goal).

**Constraints:** Middleware must distinguish `/portal/toolkit` (public) from `/portal/chatkit` (gated) before the existing portal-host check redirects to login. Public toolkit visitors see the same shell but with "Login" in the top-right; logged-in users see "Home."

---

## 2026-04-28 -- Session 21 -- Visual treatment split: marketing-style vs app-style surfaces

**Decision:** Portal pages use two visual shell variants. Marketing-style (stars background + blackhole hero + cinematic) on `/portal/toolkit`, `/portal/login`, `/portal/signup`, and any "coming soon" placeholders. App-style (plain deep dark, no video, no stars) on `/portal/chatkit/*` and `/portal/settings`. Both share the same top bar, fonts (Inter / Space Grotesk / JetBrains Mono), color palette (cyan/purple gradient), button styles, and accent treatments.

**Why:** Audience is Claude Code users — developers who spend hours in tools like Vercel, Linear, Stripe, Supabase, GitHub, none of which decorate working surfaces. Animated 3D backgrounds behind data add visual fatigue, performance cost, and "Web3 hype" connotations devs distrust. But the marketing site's cinematic style *is* correct for marketing surfaces (ToolKit is one). Split treatment gives the "wow" entry plus crisp work tools, with brand layer (top bar / type / color) tying them together — the pattern best dual-surface SaaS uses (e.g., Vercel marketing → dashboard).

**Alternatives:** Uniform marketing style everywhere (consistent but worse work-surface UX, slower data pages); uniform SaaS-clean everywhere (loses brand distinctiveness on first impression / login); keep current minimal portal (fails the "feels weak" feedback that prompted this redesign).

---

## 2026-04-28 -- Session 21 -- ToolKit MVP content scope

**Decision:** ToolKit MVP shows: (1) Handoff card (the 4 free skills bundled as one product, replaces individual `/start` and `/wrap` cards), (2) PlanKit teaser card ("coming soon — paid"), (3) all third-party Anthropic Skills cards (UI/UX Pro Max, SEO Audit, Frontend Design, Simplify, Claude API). Hidden for MVP: M.D.N Tech-only auxiliary cards (CMO, Test, Security Review) — they remain in the codebase but filtered out of the visible gallery.

**Why:** Handoff is the marketing hook (open source, MIT, installable in one line) and warrants its own bundled card with the install flow per HANDOFF_PAGE_SPEC. The auxiliary M.D.N Tech skills (CMO, Test, Security Review) are internal-flavored and don't help the developer-acquisition story. The Anthropic third-party cards stay because they're recognizable, signal taste, and position M.D.N Tech as a curator. PlanKit teaser positions the paid upgrade path on the same page. ToolKit name is preserved (not renamed to "Handoff") so PlanKit + future tools have a stable home.

**Alternatives:** Show all 10 skills (dilutes Handoff focus and confuses the install CTA); rename ToolKit to Handoff in MVP (forces another rename when PlanKit ships); drop the third-party Anthropic cards (loses curation signal).

---

## 2026-04-28 -- Session 22 -- Blackhole video stays on marketing landing only; portal uses stars-only ambient

**Decision:** Refines Session 21's "marketing-style vs app-style surfaces" split. The blackhole `.webm` hero stays exclusively on the marketing landing page (`mdntech.org`). Portal marketing-variant surfaces (`/portal/toolkit`, `/portal/login`, `/portal/signup`) get a stars-only ambient — `StarsCanvas` with no blackhole layer. App-variant surfaces (`/portal/chatkit/*`, `/portal/settings`, etc.) remain plain dark with no ambient.

**Why:** The developer audience visiting the install destination still wants brand continuity, but the blackhole's visual weight competes with the install block — which is the most important element on the page per HANDOFF_PAGE_SPEC. Stars alone preserve the cinematic identity (same canvas, same particle system as marketing) while keeping the working surface focused. Removing the blackhole also cuts ~1MB of video weight from the portal critical path and avoids the cross-origin video flash between `mdntech.org` and `app.mdntech.org`.

**Alternatives:** Keep blackhole on `/portal/toolkit` only (rejected — inconsistent treatment between toolkit and login/signup, both of which are marketing-style entries); drop stars too (rejected — leaves the marketing variant indistinguishable from the app variant, defeating the split); keep both on all portal pages including app-variant (rejected by Session 21 decision — fights with data density on chatkit/settings).

---

## 2026-04-28 -- Session 23 -- Post-auth landing reversed: ChatKit, not ToolKit (overrides Session 21)

**Decision:** After successful login, customers land on `/portal/chatkit` (not `/portal/toolkit`). Same destination for the portal-host root rewrite (`app.mdntech.org/` → `/portal/chatkit`), the signup email confirmation link (`emailRedirectTo: '/chatkit'`), and any "already logged in hitting /login" redirects. ToolKit remains the public, no-auth marketing surface linked from social posts. Reverses the Session 21 decision "Default landing = ToolKit".

**Why:** Session 21's reasoning was "first impression = the free tools they came for", framing ToolKit as the acquisition hook for logged-in visitors. In practice that's backwards: ToolKit's job is to convert *anonymous* visitors (it's publicly accessible — no signup needed to install Handoff). By the time a customer has logged in, they've already crossed the conversion line and want the working surface they pay for (or will pay for) — ChatKit. Landing them on ToolKit makes them re-traverse to ChatKit on every session and breaks the muscle-memory pattern of "log in → see my work" used by every SaaS they trust (Linear, Vercel, Stripe). User flagged this directly: "after successful login the page should stay on the chatkit page".

**Alternatives:** Keep ToolKit landing per Session 21 (rejected — the "first impression" argument applies to anonymous visits, which already see ToolKit publicly); land on a unified Dashboard (rejected by Session 21 decision — Dashboard was deleted because its content belongs to chatbots not the portal); per-customer remembered-last-page (over-engineered for current scale).

**Implementation:** 6 references to `/toolkit`/`/portal/toolkit` swapped to `/chatkit`/`/portal/chatkit` in `lib/supabase/middleware.ts` (3), `components/portal/auth/{LoginForm,SignupForm}.tsx` (2), and `app/portal/page.tsx` (1). The public-route exception for `/portal/toolkit/*` from Session 21 still stands — anonymous visitors continue to see ToolKit at `app.mdntech.org/toolkit` without auth, so the funnel hypothesis (Session 21) is unaffected.

---

## 2026-04-29 -- Session 24 -- Portal-host bare URL lands on ToolKit (separates auth-flow landing from cold-entry landing)

**Decision:** Refines Session 23, doesn't reverse it. The portal-host root rewrite (`app.mdntech.org/` with no path) now resolves to `/portal/toolkit` instead of `/portal/chatkit`. Post-auth landing — login form push, signup `emailRedirectTo`, `/login`-redirect-for-logged-in-user — still goes to `/chatkit`. Two distinct entry surfaces, two distinct landings:

- **Cold entry** (someone types `app.mdntech.org` or clicks a link to the bare host) → ToolKit, public, no login wall.
- **Authenticated flow** (login form, post-signup confirmation, `/login` while already logged in) → ChatKit, the working surface.

**Why:** Session 23 collapsed both surfaces onto ChatKit because "logged-in users want the working surface". That's still true for the auth flow, but it punishes anonymous traffic — anyone hitting the bare URL gets bounced through `/login` because `/portal/chatkit` requires auth. For social-driven traffic (the entire ToolKit acquisition funnel), the bare URL is the canonical entry, and it should land on the public install page, not a login wall. User reasoned: "this way we can bring the users directly to the toolkit page without login." Splitting "cold entry" from "auth flow" preserves Session 23's muscle-memory argument (logged-in customers still land on their work) without taxing the marketing funnel.

**Alternatives:** Keep both on ChatKit (rejected — bare-URL visitors get a login wall, defeating ToolKit-as-acquisition); send both to ToolKit (rejected — re-introduces the Session 23 "log in and re-traverse to ChatKit" problem); auth-aware bare-URL rewrite (logged-in → ChatKit, logged-out → ToolKit, rejected as over-engineered for a marginal benefit — logged-in users hitting the bare URL by typing it is rare, and they can click ChatKit in nav).

**Implementation:** 2 references in `lib/supabase/middleware.ts` line 154-156 (portal-host root rewrite `/portal/chatkit` → `/portal/toolkit`) and `app/portal/page.tsx` (simplified to always redirect to `/portal/toolkit`, dropping the auth check). The public-path allowlist already covered `/toolkit/*` so no auth-guard changes needed.

---

## 2026-04-29 -- Session 24 -- Resend chosen as transactional email provider (will replace built-in Supabase SMTP)

**Decision:** Migrate transactional email (currently confirmation, eventually password reset + magic links) from Supabase's built-in email service to **Resend**. Sender will be `noreply@mdntech.org` with display name "M.D.N Tech". Custom Supabase SMTP, configured via dashboard, no code change required. Implementation deferred to a follow-up session (DNS access + Resend signup are user-side); the branded HTML template shipped Session 24 works the same regardless of which SMTP delivers it.

**Why:** Built-in Supabase email has hard rate limits (~3-4/hour free, ~30/hour paid), ships from `noreply@mail.app.supabase.io` (spammy-looking), has no DKIM/SPF on our domain, and no analytics. Once ToolKit drives social signups in batches (a Twitter post going viral, a YouTube mention), built-in service silently drops verification emails and the funnel breaks invisibly. Need to migrate before that surface exists. Among providers evaluated:

- **Resend** — chosen. $0 free tier covers 3000 emails/month (enough for early growth), $20/mo for 50k. Modern API, dev-friendly DX, well-known founder (Zeno Rocha). 5-minute DKIM/SPF setup. Plays cleanly with Supabase SMTP.
- **Postmark** — premium deliverability, $15/mo for 10k emails. Battle-tested for transactional but no free tier and overkill at current volume.
- **AWS SES** — cheapest at scale ($0.10/1k) but more setup (sandbox approval, IAM, DKIM via Route53). Better fit when sending >100k/month.
- **SendGrid** — popular but bigger company, more friction, less developer-focused than Resend.

**Why now:** Session 24 shipped the branded HTML template + auth/callback PKCE handler, so the email body and post-click flow are production-quality. The remaining gap is delivery infrastructure. Without Resend, scaling signups will hit the rate limit cliff before they hit any other limit.

**Alternatives:** Stay on built-in Supabase email (rejected — rate limits are a delivery cliff, not a soft warning); self-host Postfix/Sendmail (rejected — no time, no expertise advantage, deliverability nightmare); skip transactional email entirely and require admin-approved signups (rejected — kills the self-serve funnel).

---

## 2026-04-29 -- Session 25 -- ChatKit empty-state plan expanded into a full portal-wide design pass

**Decision:** Session 24's locked priority 1 was scoped narrowly as "ChatKit empty-state marketing landing (when customer has no chatbots) -- hybrid shell, marketing variant on empty state, default app shell when chatbots exist." Session 25 explicitly expanded this scope by user direction to: (a) marketing shell on every state of `/portal/chatkit`, not just empty, (b) the same marketing shell + eyebrow/H1 header + translucent backdrop-blur cards on all five other ChatKit subpages (`new`, `[id]`, `[id]/edit`, KB-entry-new, KB-entry-edit, conversations), and (c) `/portal/settings` as the closing surface so every authenticated portal page now shares one visual language.

**Why:** The narrow empty-state plan from Session 24 was an MVP-first instinct -- ship the activation surface, leave the rest. Once the empty-state hero shipped (commit `5eebe93`), the user looked at it next to the still-flat populated state, the form pages, and Settings, and the inconsistency was loud. The cost of expanding scope inside the same design language was small (6 page edits + 3 component touch-ups, mostly copy-paste of the same shell/eyebrow/card pattern); the cost of leaving five surfaces in the old style would have been ongoing visual debt every time the user opened the app. User explicitly green-lit the broader scope ("please use this design style for all other chatkit pages") rather than each page being a separate decision.

**Implementation:** Four commits, all on main:
- `5eebe93` -- `/portal/chatkit` redesign + `ChatKitHero` + `BuildKBGuide`
- `dbe81a4` -- BuildKBGuide step 1 corrected to install Claude Code itself (was pointing at the M.D.N skills installer); CodeBlock copy button moved into label header strip when label is set
- `2ff0b41` -- Marketing shell + translucent cards on the other 5 ChatKit pages; last gradient pink/purple submit button (`PortalKBEntryForm`) replaced with `button-primary`; UsageMeter / EmbedSnippet / WidgetConfigForm cards converted to translucent so the chatbot detail page no longer alternates opaque/translucent surfaces
- `3d51ca9` -- `/portal/settings` adopts the same shell + header pattern + translucent card

**Alternatives considered:**
- **Stay narrow per Session 24 plan** -- rejected because it would have left visual inconsistency between `/chatkit` (new) and the chatbot detail / form pages (old), making the populated state look like a different product.
- **Defer to a Phase D refactor session** -- rejected because the changes were mechanical pattern-replication, not architectural; bundling them avoided the cost of re-loading the design context next session.
- **Build a `<PortalShellMarketing>` layout wrapper that all chatkit pages opt into automatically** -- rejected as premature; six call-sites is below the threshold where a layout wrapper saves enough boilerplate to justify the indirection. Revisit if a 7th surface needs the same treatment.

**Side effects:**
- Refactor of `CodeBlock`'s copy-button placement now applies to `/toolkit`'s `InstallBlock` too -- automatic improvement on the toolkit page.
- `EmbedSnippet` and `WidgetConfigForm` are also rendered on the command-center side. Translucent backgrounds there sit on the dark sidebar surface (no stars to bleed through) so the visual change is barely perceptible; no regression but worth noting if command-center gets a future restyle.

**Followup:** Queue a `/build-kb` Claude Code skill that surfaces the BuildKBGuide step-2 prompt as a proper installable skill (option C from the Session 25 scoping discussion). This keeps the in-app prompt as the fastest path while letting power users install the skill once and run it across many projects.

---

## 2026-05-06 -- Session 26 -- Hide marketing Login CTA until portal is publicly ready (pauses Session 24)

**Decision:** Remove the auth-aware Login/Portal CTA from the marketing site's top-right nav slot. `Tools` link also removed from `NAV_LINKS`. The nav pill is recentered via `absolute left-1/2 -translate-x-1/2` so it stays visually centered with the right slot empty. To re-enable later: restore the desktop + mobile CTA JSX, the `isLoggedIn` prop wiring on `<Navbar>`, and the `getUser()` fetch in `(marketing)/layout.tsx`. Pauses, but does not reverse, the Session 24 decision that introduced the auth-aware Login/Portal CTA.

**Why:** The portal isn't publicly ready yet -- there's no public ChatKit pricing surface, no public-facing onboarding for cold visitors hitting `mdntech.org`, and the only post-signup state customers reach is the BuildKBGuide / chatbot creation flow that's still bedding in. Surfacing a Login CTA on every marketing visit invites cold-traffic confusion ("log in to what?") and creates a support load we don't have capacity for. Better to ship the marketing site looking like a portfolio + service page until ChatKit billing + a real onboarding sequence are live, then re-enable the CTA in one move when the portal narrative is ready.

**Alternatives:** Keep the auth-aware CTA per Session 24 (rejected -- premature for cold marketing traffic before portal-public readiness); replace `Login` text with a subtler "Sign in" link inside the nav pill itself (rejected -- still adds the same support-load problem with less visual weight); add a "Coming soon" gating overlay on `/portal` (rejected -- over-engineered for a problem solvable by hiding the entry point).

**Revisit:** When ChatKit pricing ships and the portal has a self-serve onboarding sequence customers can be sent to from cold traffic. Tracked as priority 5 in `handoff.md` "What To Do Next".

---

## 2026-05-10 -- Session 28 -- ChatKit pricing: 4-tier mixed PAYG + subscription model

**Decision:** Free $0 (1 chatbot, 30 lifetime trial messages) / Starter $29 PAYG (500 credits per chatbot, lifetime, no expiry) / Pro $99/mo (2 chatbots, 5,000 messages/month account-wide) / Max $299/mo (3 chatbots, 25,000 messages/month account-wide). Free trial + Starter pack are per-chatbot; Pro + Max are per-account subscriptions with chatbot-count caps as the upgrade lever. Chatbot creation server-side gated by plan limit. Effective per-chatbot tier = `customer.subscription_status active ? customer.subscription_plan : (chatbot.credits_purchased > 0 ? 'starter' : 'free')`.

**Why:** Iterated through three models in one session. Started with the inherited Session 13 monthly per-customer 50-msg/mo cap, pivoted to per-chatbot lifetime ($19 / 1000 credits prepaid) to eliminate "what if card fails" Stripe risk, then pivoted again because $19 / 1000 earns too little against the value delivered (KB skill + embed + DB management included free). Pure subscription was rejected as too steep for low-traffic single-chatbot users ($99 entry); pure PAYG leaves money on the table for steady-traffic customers. Mixed model serves both: PAYG for casual users, subs for serious ones with a clear graduation path. Per-chatbot vs per-account framing: subs are account-scoped because B2B SaaS norm is per-workspace billing (per-chatbot would multiply costs and feel weird); chatbot-count cap per plan (1/1/2/3) is the multi-brand upgrade lever without forcing renegotiation.

**Alternatives:** Single $19 credit pack (too cheap given service value); pure subscription with no PAYG (loses occasional-use customers who'd churn out of $99/mo); $179 mid-tier between Pro and Max (rejected for simplicity at MVP); per-chatbot subs (rejected -- $99 × 2 chatbots = $198 vs $99 account-wide on Pro = better retention); 5-tier ladder (over-engineered).

**Revisit:** After 1-2 paid customers run for a full cycle. Watch margin compression -- if real Haiku 4.5 cost-per-message exceeds the assumed ~$0.005 (e.g., bigger system prompts than expected), tighten KB top-N cap, raise prices, or lower Max ceiling. All adjustable in `lib/portal/plans.ts`. Also re-evaluate whether $179 mid-tier should appear -- depends on observed graduation patterns from Starter.

---

## 2026-05-10 -- Session 28 -- "Unlimited" rejected for Max tier; 25K hard cap chosen

**Decision:** Max tier is "25,000 messages/month" with a hard cap, not "unlimited". Customers who need more are routed to a sales conversation, not given automatic ceiling lifts.

**Why:** Margin math is unforgiving. At ~$0.005 cost per Haiku 4.5 reply, 50K msgs/mo = $250 cost vs $299 revenue = 16% margin if a customer maxes out. 25K = $125 cost = 58% margin, much healthier and survives cost-per-message creep up to ~$0.012 before going negative. "Unlimited" SaaS only works at enterprise pricing where the deal includes a usage SLA -- below that it's a one-customer-kills-the-quarter risk. Setting a clear cap also gives a concrete reason for sales conversations on the upper end (which is where customer success usually starts anyway).

**Alternatives:** 50K cap (margin too thin at full utilization -- one runaway chatbot scraper or popular site eats the year); true "unlimited" (negative margin risk -- 100K messages monthly = $500 cost vs $299 revenue); enterprise-only above 25K with no Max tier (rejected -- loses mid-market who don't want sales calls); usage-based overage ($X per message above cap, like AWS) (rejected for MVP simplicity -- adds invoicing complexity, harder to communicate).

**Revisit:** When the first Max customer is approaching 25K. Either upsize the cap based on actual cost data, or productize a 50K+ tier as Enterprise.

---

## 2026-05-10 -- Session 28 -- Cost guards: 300-token output cap + KB top-5 × 2000 chars

**Decision:** Hard cap on Claude API output at `max_tokens: 300` (~225 words). KB context limited to top 5 entries by sort_order, each truncated to 2000 chars max (~10K chars / ~2.5K tokens worst case). Both enforced in `app/api/chat/[chatbotId]/message/route.ts`.

**Why:** Without these the per-message cost is unbounded and pricing math falls apart. Customer with a 50K-char KB and a chatty chatbot could push a single message to 50K input + 1K output = ~$0.06 vs the ~$0.005 the pricing assumes -- 12× margin compression instantly. Caps make cost deterministic regardless of how big the customer's KB grows. 300 tokens is enough for "2-3 short sentences" answers (the prompt rule already), so the cap doesn't degrade quality. Top-5 KB by sort_order means customers control what's prioritized via the existing `sort_order` field.

**Alternatives:** No caps and trust customers to keep KBs small (rejected -- customer behavior unpredictable); soft caps with overage upsell (more complex; encourages bloated KBs); semantic search over KB to pick most-relevant top-N instead of sort_order (proper RAG, deferred -- not worth the embedding-DB complexity for SMB scale yet); larger output cap like 500 tokens (rejected -- chatbot answers should be terse anyway, longer answers correlate with hallucination risk).

**Revisit:** If/when semantic search over KB becomes worth it (probably when a customer hits the 5-entry limit and complains). Output cap is unlikely to need raising -- shorter chatbot answers are usually better.

---

## 2026-05-10 -- Session 28 -- Mock Stripe; real integration deferred until merchant account active

**Decision:** Subscription create/cancel/upgrade flows operate directly on Supabase columns. `POST /api/portal/subscription` flips `customer.subscription_plan` + sets period dates + inserts a `subscription_events` row. `POST /api/portal/chatbot/[id]/purchase` adds 500 to `chatbot.credits_purchased`. No Stripe Checkout, no webhooks, no real card charge. Schema (migration 008) already has `stripe_customer_id` + `stripe_subscription_id` columns ready as nullable for future wiring.

**Why:** Stripe merchant account isn't yet activated and waiting on it would block all pricing UX work indefinitely. Mock unblocks end-to-end UX testing and iteration -- the upgrade flow, cancel flow, plan-gated chatbot creation, UsageMeter tier display all need real DB state to validate, and writing real DB state via mock buttons gets us 90% of the way to production-ready code. Replacing the mock POST/DELETE handlers with Stripe Checkout Session creation + webhook event handlers is a bounded ~4-hour follow-up session once the account is live -- the calling code (BuyCreditsButton, SubscribeButton, etc.) doesn't change.

**Alternatives:** Block all pricing work until Stripe account exists (delays product several weeks); use Stripe test mode end-to-end now (still requires account setup + adds dev-tunnel webhook complexity for what's effectively the same UX); use a third-party billing layer like Lemon Squeezy / Paddle (premature for one customer; locks us into their fee structure); manual Stripe payment links instead of API integration (works but gives up self-serve subscription management which is the whole point).

**Revisit:** Immediately when Stripe merchant account activates. Also worth re-evaluating if mock state ever leaks to a real customer -- right now there's no protection against a savvy customer hitting the mock endpoint directly to grant themselves free credits, but the portal isn't publicly indexed and only intentional-customers are getting access.

---

## 2026-06-08 -- Session 29 -- SK landing as light i18n + canonical domain aligned to mdntech.org

Context: Three live SK client sites footer-link to `mdntech.org` (EN home), wasting SK lead-gen/SEO. Built a Slovak agency landing at `/sk` (Part A of the Mind Palace SK brief). Two decisions locked.

### D-S29.1 -- Canonical domain mdntech.com -> mdntech.org (repo-wide)

**Decision:** Standardize the entire site on `https://mdntech.org`. Updated `config/index.ts` (metadataBase/canonical/OG), `app/layout.tsx` (Organization + WebSite JSON-LD), `app/sitemap.ts`, `app/robots.ts` (sitemap host), blog/terms/privacy canonicals + body refs, and `public/llms.txt`. `/sk` canonical + hreflang cluster (sk/en/x-default) built on `.org`. `package.json` GitHub repo URLs left on `.com` (they are the literal repo name, not SEO-relevant).

**Why:** The repo declared canonical on `mdntech.com` everywhere, but Vercel deploys to `mdntech.org` and the brand (email, socials, deploy target) is `.org` -- `.com` was stale. A split canonical/hreflang cluster (EN claiming `.com`, SK pointing EN->`.org`) would not validate and would split ranking signals. User confirmed `.org` is the live domain and delegated the SEO-best decision.

**Alternatives:** Build `/sk` on `.org` but leave EN on `.com` (rejected -- inconsistent hreflang cluster); keep everything on `.com` and override the brief (rejected -- contradicts the live deploy domain and brand).

**Revisit / follow-up:** If `mdntech.com` is still live/indexed separately, set up a domain-level `301 .com -> .org` at the registrar/Vercel (out of repo). Confirm in Search Console after deploy.

### D-S29.2 -- Light i18n for /sk (no framework, element-level lang, shared chrome)

**Decision:** One static route `app/(marketing)/sk/page.tsx` with dedicated SK section components under `components/sk/` (reusing the design system, not refactoring the hardcoded EN sections). No next-intl / `[locale]` routing. `lang="sk"` set element-level on the page wrapper (root `<html lang="en">` is shared and untouched). Navbar + footer made locale-aware via `usePathname()` (SK chrome on `/sk*`, EN path guarded/unchanged). Product/SaaS (ChatKit, Toolkit, /pricing) stays English -- only the agency funnel is localized.

**Why:** The brief mandated light i18n. A real i18n framework or splitting root layouts (to get `<html lang="sk">`) would touch marketing/command-center/portal and is disproportionate for one page. Google relies on hreflang + visible content for language targeting; `<html lang>` is a minor signal, so element-level `lang="sk"` + reciprocal hreflang + Slovak content is sufficient. Building SK-specific components keeps the live EN page at zero regression risk.

**Alternatives:** next-intl with `[locale]` segments (premature -- only one page localized); refactor EN section components to be prop-driven and reuse them (regression risk on the live EN page, and SK structure/messaging differs anyway -- value ladder, Pre koho, Realizacie); multiple root layouts for a true `<html lang="sk">` (invasive across all route groups for a minor SEO signal).

**Revisit:** When localizing the whole site (Czech/Polish etc.) -- then adopt next-intl and a true per-locale `<html lang>`.

---

## 2026-07-10 -- Session 33 -- TechKit Session A implementation decisions

Context: First execution session of `command-center/TECHKIT-BRIEF.md`. The brief's locked decisions T1-T8 governed; three implementation-level decisions were made where the brief left room.

### D-S33.1 -- "Check now" requires CRON_SECRET in Vercel env (small deviation from brief §12)

**Decision:** The endpoints page's "Check now" button calls the `techkit-poller` Edge Function from a Next.js server action authenticated with `CRON_SECRET`, so that secret must also live in the Vercel env (the brief said Next.js needs *no new secrets*). Until it's set, the action returns a friendly error and everything else works.

**Why:** The poller only accepts `Bearer <CRON_SECRET>`; duplicating the HTTP-check + state-machine logic inside Next.js to avoid the secret would create the exact two-implementations drift T8 forbids.

**Alternatives:** Accepting the Supabase service-role JWT as an alternative bearer on the poller (more auth surface for no gain); client-side direct fetch to the target URL (CORS + no state machine).

### D-S33.2 -- Degraded/down share one failure counter; manual resolve unblocks the state machine

**Decision:** `consecutive_failures` counts any non-up check; the threshold is 2 for down (critical) and 3 for degraded (warning), evaluated against the *current* check's status. Manually resolving an incident in CC also clears `monitored_endpoints.open_alert_id` so the poller can open a fresh incident on the next failure instead of being wedged.

**Why:** Two separate counters add columns + complexity for a distinction that rarely matters at 5-min cadence; brief §6.1 semantics are preserved. The manual-resolve rule prevents a stuck state machine when an admin closes an incident that the poller still considers open.

**Alternatives:** Separate degraded/down counters (over-engineering for MVP); forbidding manual resolve of downtime incidents (worse ops UX).

### D-S33.3 -- Seed only confirmed URLs; Swarm Resistance seeded inactive from DB evidence

**Decision:** The ⚠️ roster rows without a confirmed URL (ChatKit widget API, Rahadu) are NOT seeded -- add via the endpoints CRUD once confirmed. Swarm Resistance IS seeded (inactive) because `projects.production_url` already holds `https://www.swarmresistance.tech/`, answering brief open question 1; Martin flips it active.

**Why:** Placeholder URLs in `monitored_endpoints` would be junk data the poller might accidentally check; the CRUD UI exists precisely for late additions.

---

## 2026-07-12 -- Session 40 -- TechKit design language stays TechKit-scoped (no CC-wide refresh)

**Decision:** TechKit Session D's §7.4 open question — whether to extend the TechKit design language (layered dark gradient + brand-tinted glow orbs + data-density-first cards) to the rest of Command Center (sidebar, dashboard, projects, communications pages) — is resolved as **no, not now.** The TechKit pages keep their distinct look; the legacy CC pages stay on the older style. Revisit only in a dedicated design session if wanted.

**Why:** TechKit is a self-contained module reached via its own tabbed shell, so the visual seam between it and legacy CC is minimal in practice. A CC-wide refresh is a design-first effort (every page reworked + re-verified) with no functional payoff, and folding it into a feature-shipping session risks a half-migrated look. Better as an intentional, scoped design pass than a rushed rider on Session D.

**Alternatives:** Extend the language CC-wide now (large surface area, would have stretched Session D well past the digest work); adopt a shared design-token layer both old and new pages consume (correct long-term, but premature before the module count justifies it).

---

## 2026-07-15 -- Session 41 -- MarketKit B3: committed-only Dub links + /links/info for stats

**Decision:** Dub short links are created **lazily in `dub_sync`, and only for `mk_links` whose action is `approved` or `done`** (not at `sprint_propose` time, and not for `proposed` actions). Click/conversion stats are pulled via `GET /links/info?linkId=` rather than the `GET /analytics` endpoint. Backfill recovers a created-but-unpersisted link by `externalId`; the daily `source='dub'` rollup sums persisted last-known-good counts.

**Why:** Dub's free tier allows only **25 new links/month**. `sprint_propose` proposes 3 actions/project/week and a re-roll *deletes* proposed actions — creating a Dub link on propose would permanently burn quota on discarded proposals and orphan the link. Gating on committed actions spends the budget only on work the founder actually committed to. `/links/info` is a standard endpoint (60 req/min, works on the **free tier**), whereas `/analytics` is Pro-only — so click stats work on Dub free. M9 (every action ships with a trackable link) stays satisfied by the plain-UTM `mk_links` row created at propose; Dub upgrades it to a short link once committed.

**Alternatives:** Create a Dub link inline at propose for every action (simplest, but blows the 25/mo cap in ~1.5 weeks across the dogfood set and orphans re-rolled links); use `/analytics` for stats (richer, but Pro-only so nothing works on free); store the destination in a new column instead of overwriting `mk_links.url` with the short link (avoids the reconstruct-from-Dub coupling, but adds a migration for no MVP benefit).

---

## 2026-07-16 -- Session 42 -- Landing product icons: inline stroke SVGs mapped from config ids (no image assets)

**Decision:** `MarketingProduct.icon` stays a plain string in `lib/marketing/products.ts`, but it's an **icon id** (`chat`/`wrench`/`shield`/`rocket`/`pulse`), not an asset path. `ProductCard` maps the id to an inline heroicons-style stroke SVG — the same pattern the blog page already uses for `CategoryIcon`.

**Why:** The existing `/icons/*.svg` set (AI, FullStack, Game, Mobile, UI, Web3) was drawn for the agency services grid and has no sensible matches for SignaKit/MarketKit/TechKit — reusing them would misrepresent the products, and hand-authoring five new filled SVGs to match that style is design work the rebuild spec didn't budget. Inline stroke icons inherit `currentColor` (hover cyan transition for free), add zero image requests, and the config keeps its "all card copy in one file" property.

**Alternatives:** Reuse the closest existing SVGs (misleading pairings like Mobile.svg for TechKit); commission/hand-draw five matching filled icons (deferred — can slot in later by swapping the `ProductIcon` map without touching the config shape).

---

## 2026-07-16 -- Session 42 -- Footer "Documentation" + GitHub links point to github.com/bugiiiii11/handoff

**Decision:** The new EN multi-column footer's Resources → "Documentation" link and the Connect-area GitHub icon both point to `https://github.com/bugiiiii11/handoff` (the public ToolKit skills mirror).

**Why:** The rebuild spec lists "Documentation" and "GitHub" in the footer but no docs site exists yet. The handoff repo is the only public, branded, documentation-shaped surface we own — README + per-skill SKILL.md files. Pointing anywhere else would 404 or leak internal repos.

**Alternatives:** Point Documentation at `app.mdntech.org/toolkit` (duplicates the adjacent "Claude Code Skills" link); omit both until a docs site ships (loses the footer column symmetry the spec asked for); link the private product repo (not public). Revisit when a real docs surface exists.
