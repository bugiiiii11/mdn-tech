# M.D.N Tech -- Handoff

<!-- HARD CAP ~150 lines. Max 2 session sections. Overflow -> handoff-archive.md (full pre-v3 history archived there 2026-07-17). -->

## Current State

- **Phase:** LAUNCH PLAN ACTIVE -- master checklist `MindPalace/Projects/MDN-Tech/MDN-Tech-Launch-Plan-2026-08.md` (re-baselined 2026-08-07; MVP launch target ~31.08). **Phase 0 + Phase 1 CLOSED and LIVE ON PROD** (verified S53). Parallel track started: website/SEO rebuild v2.1. Next: Phase 2 credit bank, and /chatkit + /toolkit marketing pages.
- **Session count:** 53
- **Products:** TechKit LIVE (7 crons), MarketKit A+B-core LIVE (B3 Dub go-live pending), ChatKit live w/ credits-only mock checkout (all 4 features available; Voice deferred), ToolKit public page live.

## Session Summary (last 10 -- full table + sessions 1-43 detail in handoff-archive.md)

| # | Date | Title |
|---|------|-------|
| 43 | 2026-07-17 | Nebula seam fix + A3.3/A3.4 -- Phase A verification complete |
| 44 | 2026-07-17 | Handoff v3 -- /handoff skill, real-usage auto-wrap hooks, handoff cap |
| 45 | 2026-07-17 | ToolKit gallery refresh -- 9 market-top skills + real MCP section |
| 46 | 2026-07-17 | Phase B verified complete + ChatKit tier gates wired (prio 2) |
| 47 | 2026-07-17 | ChatKit credits-only pivot + PlanKit removal + Blender skills (migration 017 applied) |
| 48 | 2026-07-17 | Prio 7 auth flow UIs + prio 3 Auto-learning shipped (migration 018 applied) |
| 49 | 2026-07-17 | Prio 4 Weekly reports shipped (migration 019 applied) -- Phase C build-complete |
| 50 | 2026-08-06/07 | Credit system + payments design locked; launch plan re-baselined; merged to main (Phase 0.1) |
| 51 | 2026-08-07 | Security fix-pack 0.2-0.5 -- 6 confirmed prod exploits closed (migration 020 applied) |
| 52 | 2026-08-07 | Phase 0 merged to main + Phase 1 hardening 1.1-1.6 (migration 021 applied) |
| 53 | 2026-08-12 | Phase 1 deployed + verified on prod; landing SEO rework v2.1 + 4 false claims fixed |

## What Was Done (Session 52) -- Phase 0 merged to main; Phase 1 hardening 1.1-1.6

- Phase 0.2-0.5 code merged to `main` + pushed (`7328d97`) -- the S51 shipping gap is closed; the `/api/infrastructure` guard and CC staff gate are live in prod alongside migration 020.
- **Phase 1 CLOSED in one commit `b9aab5b` (branch-only -- NOT deployed).** Migration `021_chatkit_hardening.sql` APPLIED to prod and verified. 021 alone changes nothing in prod: no deployed code reads the new column/table, so there is no repeat of the S51 gap -- but the protections only go live on the next merge to main.
- 1.1 domain binding: `chatbots.allowed_domains` (hostnames, `*.` wildcard) enforced server-side in both `/api/chat` routes + field in `WidgetConfigForm`. Empty = allow-any so no customer widget broke. The blanket CORS `*` block was REMOVED from `next.config.js` -- it would have emitted a second, conflicting ACAO alongside the per-request one and browsers reject that.
- 1.2: the only owner-less bot is a REAL live client widget (Royal Stroje). Rather than break it, its allow-list was seeded in the migration from observed `chat_conversations.source_url` traffic (`royalstroje.sk`). Internal bots: empty allow-list is now a hard DENY (not allow-all), 500 msg/day cap, and `messages_used` ticks for them too.
- 1.3 rate limiting is **Postgres-backed, not Upstash** as the plan said -- Upstash needs an account + env vars from Martin and the whole point of the Phase 1 block was that it is unblocked. `rate_limits` table + `rate_limit_hit()` RPC, atomic, cross-lambda, per-IP + per-bot in ONE round trip, daily purge cron. It **fails open** on DB error by design (every request still has to clear the credit check before it can cost anything). Swap to Upstash later is a one-file change in `lib/chat/rate-limit.ts`.
- Two flaws found while building, both fixed: the limiter originally sat AFTER the chatbot+KB queries (so unlimited 404s could still hammer Postgres -- moved before), and a supplied `conversationId` was never scoped to its chatbot (one bot could append to another's conversation).
- 1.4: zod on the chat routes; `/api/subscribe` was an open unvalidated pipe into the Brevo list -- now validated + 5/hour. NOTE: zod v4 `.uuid()` is strict about version/variant bits; hand-written test uuids must be well-formed v4 or they 404 before reaching any logic.
- 1.5: CSP on every page (no `unsafe-eval` in prod, `upgrade-insecure-requests` prod-only -- it breaks http://localhost navigation in dev); timing-safe cron secret compare in `lib/auth/cron.ts`, shared by both cron routes.
- 1.6: visitor text is neutralized + framed as untrusted data in the KB-drafting prompt; suspicious drafts get `flagged`/`flag_reason`, a portal warning, and a two-click confirm enforced in the API (not just the UI). Ratings are owner-only, which was already a real gate.
- Verified: domain binding 7/7, input validation 8/8, limiter blocks at exactly limit+1 with correct Retry-After, sanitizer 22/22, cron compare 8/8, 0 CSP violations across 7 pages in a PRODUCTION build (Playwright). tsc + lint + build green. Probe scripts are in the session scratchpad only -- Phase 3.5 should port them.

## What Was Done (Session 53) -- Phase 1 live on prod; landing SEO rework v2.1

- **Phase 1 is now DEPLOYED** (`03c84d1` merged to main + pushed). The S52 branch-only gap is closed. Verified against live prod 12/12: Royal Stroje loads from both `royalstroje.sk` and `www.`, foreign origins 403 on config + message, single ACAO, CSP live without `unsafe-eval`, `/api/subscribe` + chat reject malformed input, cron 401s. Plus 4/4 regression: every owned bot with an empty allow-list still accepts any origin. Nothing broke.
- **Test gotcha (cost me a false alarm):** zod runs at `message/route.ts:70`, BEFORE the domain check at :101. A domain-binding probe with a schema-invalid body 400s and proves nothing -- it must send a valid `visitorId`. Carry this into the Phase 3.5 E2E port.
- **Landing rework `6572531`** (branch-only, NOT deployed): ~300 -> ~1200 words, business-first positioning (ChatKit's real buyer is a business owner, not a developer). New sections: chatkit-section, toolkit-section, coming-soon (no CTAs), why-us, faq. Removed blog-preview + trust-bar (both /blog and /about are already in the navbar). FAQ renders 10 Q&As and builds FAQPage JSON-LD from the SAME array -- verified 10/10 text parity so schema can never drift.
- **A 63-agent adversarial review caught 4 FALSE claims in my own new copy.** All verified against code before fixing. These are now HONESTY CONSTRAINTS documented in the component headers -- do not regress them:
  1. "Every feature included" in the trial was false: `feature_unlocks` defaults to `'{}'` (migration 017), so learning/reports/conversations/analytics are PAID unlocks. ChatKit now splits "Included with every chatbot" from "Optional add-ons" with prices read from `plans.ts`.
  2. ToolKit is a CURATED DIRECTORY: only 5 of 21 skills are ours; the rest are Anthropic/Vercel Labs/Trail of Bits/obra under their own terms, and there is no licence field in the data at all. Never call the catalogue "our MIT skills" again.
  3. "One credit balance across all products" is NOT true today -- credits live on `chatbots.credits_purchased` (per chatbot, ChatKit only). That claim only becomes true when the Phase 2 ledger ships.
  4. The domain allow-list starts EMPTY (= allow any), so it is opt-in, not automatic.
- A11y fixes: `MotionConfig reducedMotion="user"` over the marketing tree; new `BlackholeVideo` pauses under reduced motion (WCAG 2.2.2) with a generated 48KB poster replacing a 740KB autoplay; footer gray-500 -> gray-400 (4.30:1 was under the 4.5 floor); `noscript` fallback because framer SSRs `opacity:0` and the page was BLANK without JS (h1 0 -> 1 verified).
- Added `PRODUCT.md` + `DESIGN.md` (impeccable context): brand register, users, anti-references, and the "Event Horizon" visual system with named rules (Bent Light, Gradient Crown, Legibility Floor, Glow-Not-Shadow). Future design work should read these first.
- **Safety hook false positives x2** -- did not work around, flagging for a pattern fix: `git push.*-f.*main` matched `--ff-only` across three chained commands; `curl.*\|.*sh` matched the word "ship" in an echo string. Proposed: anchor the force flag to the push itself (`git push[^;&|]*\s(-f|--force)\b[^;&|]*\bmain\b`) and require a real shell binary after the pipe.
- 38 lower-severity review findings left UNFIXED (mostly pre-existing): gradient taglines on `<p>` in product-card, 2px corner brackets, placeholder linkedin.com/github.com links in `TEAM_MEMBERS`, no SoftwareApplication schema, products grid empty cell.

## Martin's Tasks (detailed -- do these, then report back in chat)

1. **Stripe UAE activation (CRITICAL PATH, start this week):** dashboard.stripe.com -> create account for the FZE: trade license 7813, Emirates ID + residence visa, Wio account details (Wio confirmed working). Verification takes 1-2 weeks and gates Phase 2 payments -- start before anything else.
2. **Supabase auth email templates (10 min):** supabase.com/dashboard -> project `ijfgwzacaabzeknlpaff` -> Authentication -> Emails (Templates tab). For each template slot, open the matching file in `supabase/email-templates/` (5 files: confirm-signup, magic-link, reset-password, email-change, reauthentication), copy the whole HTML into the template Source, Save. Then Authentication -> URL Configuration: Site URL = `https://app.mdntech.org`; add Redirect URLs `https://app.mdntech.org/auth/callback` and `http://localhost:3000/auth/callback`.
3. **ChatKit cron secret + Resend key (5 min):** generate a random 32+ char string. (a) vercel.com -> M.D.N Tech site project -> Settings -> Environment Variables -> add `CHATKIT_CRON_SECRET` = that value (Production) -> redeploy; while there CONFIRM `RESEND_API_KEY` is listed too (add from `.env.local` line 30 if missing). (b) Supabase dashboard -> SQL Editor -> run: `select vault.create_secret('<that value>', 'chatkit_cron_secret');` -- powers both Sunday learning + Monday reports crons; until then they 401 harmlessly.
4. **Dub account for MarketKit B3 (10 min):** sign up at dub.co -> Settings -> API Keys -> Create key (starts `dub_...`) -> paste into `.env.local` as `DUB_API_KEY=dub_...` -> tell the next session "Dub key ready" (it then runs the 5-part go-live runbook in `command-center/MARKETKIT-SETUP.md` B3).
5. **Browser E2E pass (15 min, after 2+3):** `npm run dev` -> log in at `localhost:3000/portal/login` -> open your chatbot: buy a credit pack + unlock a feature (mock checkout, no real charge); rate a reply thumbs-down in Conversations then hit Auto-learning "Run now"; hit Weekly reports "Run now" and check your inbox for the report email. Report anything broken.
6. **Ask Filip:** compliance answers (plan SS2.0b) incl. the B2B evidence approach (VAT ID or ICO + business self-declaration); isHosting docs whenever available (not blocking -- prices already verified).
7. **NEW -- inviting a teammate (since S51):** a signup alone can no longer create staff. Supabase SQL Editor: `insert into team_invites (email, role) values ('kolega@mdntech.org', 'engineer');` (role: `admin` | `engineer` | `viewer`), THEN have them create an account on that exact email. Without the invite row they become an ordinary customer. Confirm the ~50-credit signup promo grant number too (plan SS3.1 leftover).

## What To Do Next -- ChatKit remaining work

**Two tracks now: Phase 2 credit bank (product) and the website/SEO rebuild (marketing).** Phase 2 is easier now -- 020 made every billing column service-role-only and 021 established the migration patterns for it. The landing rework is branch-only; it does NOT need to ship before the product pages are written.

| Priority | Task | Status / Notes |
|----------|------|----------------|
| 0 | **Website track: `/chatkit` + `/toolkit` marketing pages** | AGREED PLAN: landing first (done S53), then dedicated per-product pages -- this is where organic traffic actually lands (today ChatKit's only URL is a portal page on app.mdntech.org, which no searcher will find). Reuse the approved landing sections. Then /about + blog rework (the 3 template-era articles are generic; needs real engineering content), then /sk alignment. THEN re-run the SEO audit -- `seo-audit/` is STALE (predates the whole rebuild, still references mdntech.com and `components/main/` files). Target clusters: /chatkit = "AI chatbot for website / chatbot without coding"; /toolkit = "Claude Code skills" (low competition, winnable #1). |
| 1 | **Phase 2 credit bank (ChatKit billing rebuild)** | 2.1 account-level `credits_ledger` (append-only) + migrate `chatbots.credits_purchased` balances; 2.4b unlocks re-priced in credits (conv 500 / analytics 750 / reports 1000 / learning 1250 / extra bot 1250) and the 3 mock-checkout routes collapse into ONE credit purchase + ledger spends; 2.4 hidden Enterprise $999/40k + "Best value" badge on Scale; 2.7 policy build (12-mo expiry + 30-day warning email, refund window, auto re-credit, chargeback clawback + auto-suspend, 50-credit signup grant, low-balance email). `PaymentProvider` abstraction + Stripe test mode can start before Martin's live keys land. NOTE: grant SELECT-only to `authenticated` on the new ledger; all writes service-role. |
| 3 | Phase 3.5 E2E + CI | Port the S51 + S52 probe scripts into a committed suite (S52 added: domain binding, input validation, rate limiter, sanitizer, cron compare, Playwright CSP check -- all scratchpad-only). Add GitHub Actions (tsc, lint, build, E2E). Zero tests today. |
| 4 | Widen the Phase 1 controls | Rate limiting covers `/api/chat/*` + `/api/subscribe`; the authenticated portal routes are still unlimited. CSP still needs `unsafe-inline` for scripts -- nonce-based CSP via middleware is the follow-up. |
| 5 | ChatKit Voice (Cartesia Sonic-3) | Deferred. ~6h. |
| 0b | MarketKit B3 Dub go-live + Session B remainder | Gated on Martin task 4; then edge secret + worker redeploy (5 parts) + migration 016 (`MARKETKIT-SETUP.md` B3 runbook). Then B1 GA4/GSC + B5 dogfood onboarding. |
| 8 | Phase 8 UAE hosting migration (isHosting) | AFTER substance + post-launch. Costs verified ~$85-125/mo. Plan SS8 has the checklist. |
| 9 | SignaKit portal section | Hidden for MVP; reactivate post-ChatKit-monetization. |
| 12 | SEO action plan | Follow `seo-audit/ACTION-PLAN.md`. |
| 14 | Delete `.next-stale-1777403470/` | Local only; safety hook blocks `rm -rf .*` -- delete via Explorer or `rmdir /s /q`. |
| 15 | SK Part B + domain 301 | Client-repo footer links -> mdntech.org/sk at next touch of each repo; `mdntech.sk` purchase + 301; `.com -> .org` 301 at registrar. |

## Key Files

| File | Purpose |
|------|---------|
| `handoff.md` / `handoff-archive.md` | Live state (capped ~150 lines) / full history (never read on start) |
| `MindPalace/Projects/MDN-Tech/MDN-Tech-Launch-Plan-2026-08.md` | MASTER launch checklist (Phases 0-8) -- Phases 0 and 1 checked off AND live on prod (S53) |
| `PRODUCT.md` / `DESIGN.md` | Brand register, users, anti-references / the "Event Horizon" visual system + named rules. Read BOTH before any design or copy work |
| `components/landing/` | The v2.1 landing: hero, products, chatkit-section, toolkit-section, coming-soon, why-us, faq, credits-strip. The two product sections are the template for the /chatkit + /toolkit pages |
| `lib/portal/plans.ts` | Billing source of truth. ALL landing prices/counts import from here -- never hard-code a price or a trial number in a component |
| `lib/portal/toolkit-skills.ts` | ToolKit catalogue. Only `author: 'M.D.N Tech'` entries (5 of 21) are ours -- the rest are third-party under their own terms |
| `app/api/portal/{chatbot/[id]/purchase,chatbot/[id]/feature,feature}/` | The 3 mock checkout routes -- collapse into one credit purchase + ledger spends (Phase 2) |
| `supabase/migrations/{020_security_fixpack,021_chatkit_hardening}.sql` | The security model (column grants, invite-only staff) + Phase 1 DB half. Read 020 before touching billing columns or adding tables |
| `lib/chat/{cors,rate-limit,schemas,sanitize}.ts` | Phase 1 public-surface controls, now LIVE: origin matching, durable limiter, zod contracts, injection heuristics |
| `seo-audit/ACTION-PLAN.md` | STALE -- predates the rebuild (references mdntech.com + old `components/main/` structure). Re-run the audit after the website track, do not follow as-is |
| `decisions.md` | Locked architectural decisions |
