# M.D.N Tech -- Handoff

<!-- HARD CAP ~150 lines. Max 2 session sections. Overflow -> handoff-archive.md (full pre-v3 history archived there 2026-07-17). -->

## Current State

- **Phase:** Landing rebuild Phase B COMPLETE (ToolKit page v3 + public repo live and verified, S46). Phase C (ChatKit completion) started: tier feature gates wired S46. Branch `feat/landing-rebuild`, preview-only.
- **Session count:** 46
- **Products:** TechKit LIVE (all 7 crons), MarketKit A+B-core LIVE (B3 Dub code-complete, go-live pending), ChatKit live w/ mock checkout + tier gates, ToolKit public page live.

## Session Summary (last 10 -- full table + sessions 1-43 detail in handoff-archive.md)

| # | Date | Title |
|---|------|-------|
| 37 | 2026-07-11 | MarketKit go-live -- backend LIVE, E2E smoke, storage-RLS fix |
| 38 | 2026-07-11 | MarketKit Session B -- weekly sprint loop + screenshot metrics (LIVE) |
| 39 | 2026-07-12 | TechKit Session C -- costs (LIVE) |
| 40 | 2026-07-12 | TechKit Session D -- AI weekly digest (LIVE); TechKit complete |
| 41 | 2026-07-15 | MarketKit B3 Dub tracked links (code-complete, go-live pending) |
| 42 | 2026-07-16/17 | Landing rebuild Phase A -- A1+A2+A3 code-complete |
| 43 | 2026-07-17 | Nebula seam fix + A3.3/A3.4 -- Phase A verification complete |
| 44 | 2026-07-17 | Handoff v3 -- /handoff skill, real-usage auto-wrap hooks, handoff cap |
| 45 | 2026-07-17 | ToolKit gallery refresh -- 9 market-top skills + real MCP section |
| 46 | 2026-07-17 | Phase B verified complete + ChatKit tier gates wired (prio 2) |

## What Was Done (Session 45) -- ToolKit gallery refresh: 9 market-top skills + real MCP section

- Market research (multi-source, mid-2026): gallery refreshed with 9 adds -- Superpowers, Code Simplifier, Vercel Web Interface Guidelines, Webapp Testing, Firecrawl, Caveman, Trail of Bits, MCP Builder, Office Document Skills. Every URL fetch-verified before shipping.
- Gotcha: Karpathy repo MOVED -- `forrestchang/...` -> `multica-ai/andrej-karpathy-skills` (193k stars); old gallery link fixed.
- Gotcha: `code-simplifier` is NOT in `anthropics/skills` -- it lives at `anthropics/claude-plugins-official/plugins/code-simplifier`. Vercel's skill folder is `web-design-guidelines` (not "web-interface-guidelines") under `vercel-labs/agent-skills`.
- Dead `toolkitMCPs` data surfaced: new `ThirdPartyMCPs` component (purple accent, collapsible `claude mcp add` setup commands); TradingView/Unity placeholders replaced with GitHub / Context7 / Playwright / Sentry (+ kept Supabase).
- New `SkillCategory` values: development, security, documents, productivity (+ labels in ThirdPartySkills).
- Competitive note: Matt Pocock ships a popular "Handoff" skill (~156K installs, same session-transfer concept). Deliberately NOT added to the gallery; positioning call open.
- Verified: tsc/lint/build green; rendered page checked on localhost (all skills, MCPs, labels present; 0 errors).

## What Was Done (Session 46) -- Phase B verified complete + ChatKit tier gates (prio 2)

- Public repo `bugiiiii11/handoff` restructure was ALREADY done and pushed (`63af63f`) -- the S45 "last Phase B item" note was stale. Verified: all 5 GitHub URLs the ToolKit page links to exist on origin/main; repo publicly readable (anonymous fetch of SKILL.md). Task 13 (README build-kb bonus section) also already shipped. Phase B COMPLETE.
- Prio 2 wired (first Phase C item): chatbot detail page resolves per-bot tier (`resolveChatbotTier`, customers + credits_purchased); Conversations/Export buttons gated Starter+ (locked chip -> per-bot upgrade page); trend/keyword charts gated Pro+ (locked card -> /portal/upgrade; analytics queries skipped when locked); new Max teaser card for reports/learning (gate wired now; the features themselves are prio 3/4).
- Enforcement is server-side, not just cosmetic: conversations page redirects free tier back to detail; export API now 403s for free tier (was owner-checked but tier-open -- any free user could export via direct URL).
- tsc + lint + build green. Not browser-verified (portal requires Supabase login); gates reuse the existing `hasFeature`/tier resolvers from `lib/portal/plans.ts`.

## What To Do Next

**Next session (Phase C continuation): prio 7 -- wire the 4 branded auth flow UIs** (email templates already live in `supabase/email-templates/`): login "Forgot password?" + `/portal/reset-password`, magic-link option, email-change form, reauth surface. Also: restart Claude Code to activate the v3 hooks (if not yet done); confirm `feat/landing-rebuild` Vercel preview rebuilt post-incident (or Redeploy manually); 6 commits unpushed (push only on explicit request).

| Priority | Task | Status / Notes |
|----------|------|----------------|
| 0-NEW | Landing rebuild v2 + MVP launch roadmap | Phases A+B COMPLETE (S43/S46). Spec: `command-center/mdntech-website-rebuild.md` v2.0. Roadmap: C ChatKit completion (prio 2 done S46; next prio 7) -> D MVP LAUNCH -> E post-MVP products -> F payments LAST (N-Genius, vault `PAYMENT_NETWORK_INTERNATIONAL.md`). MVP/FULL modes via `NEXT_PUBLIC_LANDING_MODE` (unset = MVP). |
| 0b | MarketKit B3 Dub go-live + Session B remainder | B3 built (S41, `5085da4`), NOT deployed -- **[Martin]** create Dub account, paste `dub_...` key into `.env.local`; then edge secret + worker redeploy (5 parts) + migration 016 (`MARKETKIT-SETUP.md` B3 runbook). **[Martin]** approve/skip sprint proposals + upload first metrics screenshots. Then B1 GA4/GSC (**[Martin]** Google Cloud service account) + B5 dogfood onboarding (ChatKit, Melicharek, Good Hair by Zane). |
| 1 | Real payments (was Stripe; superseded by N-Genius plan F) | Mock checkout live (`/api/portal/subscription`, `/api/portal/chatbot/[id]/purchase`); schema has stripe_* columns. Gated on merchant account. |
| 3 | ChatKit Auto-Learning MVP (Max tier) | Deferred. Flag UI + Sunday cron + weekly report. ~5h. Gate already wired (S46). |
| 4 | Weekly auto-reports (Max tier) | Deferred. Pairs with prio 3; ship before serious Max marketing. Gate already wired (S46). |
| 5 | ChatKit Voice (Cartesia Sonic-3) | Deferred. ~6h. |
| 7 | Wire UI for 4 branded auth flows | Templates live in `supabase/email-templates/`; need login "Forgot password?" + `/portal/reset-password`, magic-link option, email-change form, reauth surface. NEXT UP. |
| 9 | SignaKit portal section | Hidden for MVP; reactivate post-ChatKit-monetization. |
| 10 | Portal auth Supabase -> SignaKit | Pending, low. |
| 11 | Mind Palace <-> CC sync bridge | Pending, low. |
| 12 | SEO action plan | Follow `seo-audit/ACTION-PLAN.md`. |
| 14 | Delete `.next-stale-1777403470/` | Local only; safety hook blocks `rm -rf .*` -- delete via Explorer or `rmdir /s /q`. |
| 15 | SK Part B + domain 301 | Client-repo footer links (melicharek, RoyalStroje, zane) -> mdntech.org/sk at next touch of each repo; `mdntech.sk` purchase + 301; `.com -> .org` 301 at registrar. |

## Key Files

| File | Purpose |
|------|---------|
| `handoff.md` / `handoff-archive.md` | Live state (capped ~150 lines) / full history (never read on start) |
| `CLAUDE.md` + `.claude/skills/handoff/` + `.claude/hooks/` | Session protocol, /handoff v3 skill, real-usage auto-wrap hooks (restart to activate) |
| `command-center/mdntech-website-rebuild.md` | Landing rebuild spec v2.0 (Phases A-F) |
| `lib/portal/plans.ts` | ChatKit pricing source of truth + `hasFeature`/tier resolvers |
| `app/portal/chatkit/[id]/` | Chatbot detail + conversations + upgrade (tier gates wired S46) |
| `supabase/email-templates/` | 4 branded auth email templates (prio 7 wires their UIs) |
| `supabase/migrations/` | 001-016 applied thru 015; 016 (Dub) pending apply |
| `supabase/functions/{techkit-poller,marketkit-worker}/` | Edge functions: poller v12, worker v2 (+dub_sync pending deploy) |
| `command-center/{TECHKIT,MARKETKIT}-SETUP.md` / `-BRIEF.md` | Go-live runbooks (Management API patterns) + product briefs/backlogs |
| `decisions.md` | Locked architectural decisions |
