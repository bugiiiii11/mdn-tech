# M.D.N Tech -- Handoff

<!-- HARD CAP ~150 lines. Max 2 session sections. Overflow -> handoff-archive.md (full pre-v3 history archived there 2026-07-17). -->

## Current State

- **Phase:** Landing rebuild Phase A COMPLETE + verified (branch `feat/landing-rebuild`, preview-only). Next: Phase B (ToolKit pre-release).
- **Session count:** 44
- **Products:** TechKit LIVE (all 7 crons), MarketKit A+B-core LIVE (B3 Dub code-complete, go-live pending), ChatKit live w/ mock checkout, ToolKit public page live.

## Session Summary (last 10 -- full table + sessions 1-41 detail in handoff-archive.md)

| # | Date | Title |
|---|------|-------|
| 35 | 2026-07-11 | TechKit Session B -- providers, deploy feed, stats (LIVE) |
| 36 | 2026-07-11 | MarketKit Session A -- portal module code-complete |
| 37 | 2026-07-11 | MarketKit go-live -- backend LIVE, E2E smoke, storage-RLS fix |
| 38 | 2026-07-11 | MarketKit Session B -- weekly sprint loop + screenshot metrics (LIVE) |
| 39 | 2026-07-12 | TechKit Session C -- costs (LIVE) |
| 40 | 2026-07-12 | TechKit Session D -- AI weekly digest (LIVE); TechKit complete |
| 41 | 2026-07-15 | MarketKit B3 Dub tracked links (code-complete, go-live pending) |
| 42 | 2026-07-16/17 | Landing rebuild Phase A -- A1+A2+A3 code-complete |
| 43 | 2026-07-17 | Nebula seam fix + A3.3/A3.4 -- Phase A verification complete |
| 44 | 2026-07-17 | Handoff v3 -- /handoff skill, real-usage auto-wrap hooks, handoff cap |

## What Was Done (Session 43) -- Nebula seam fix + Lighthouse + mode review: Phase A verified

- Nebula seam fix `7d4a9bb`: section `overflow-hidden` -> `overflow-x-clip`, CosmicNebula wrapper extended `-top-40 -bottom-40` with 200px mask-image fade -- glow bleeds across section boundaries, no hard edge. Playwright-verified both seams, 0px horizontal overflow.
- A3.3 Lighthouse on Vercel preview: needed a **Protection Bypass for Automation secret** (`PATCH /v9/projects/{id}/protection-bypass`, use `?x-vercel-protection-bypass=<secret>&x-vercel-set-bypass-cookie=true`) -- first run silently measured the SSO login page. Scores: `/` mobile 66 / desktop 95, `/about` mobile 52 / desktop 84, CLS 0 everywhere; SEO 69 = preview noindex artifact. Mobile drag = hero blackhole video LCP + three.js TBT -- pre-existing, post-launch follow-ups, not Phase-A blockers.
- A3.4: unset `NEXT_PUBLIC_LANDING_MODE` in all Vercel envs confirmed -> preview IS the MVP-default check (3 Coming Soon badges); FULL mode verified locally (0 badges, 5 live cards). **Phase A ready for Phase D launch merge.**
- Vercel GitHub incident (since 2026-07-16 23:09 UTC) swallowed preview builds for `7d4a9bb`/`b4f5cdf` -- confirm preview rebuilt once cleared, or click Redeploy.

## What Was Done (Session 44) -- Handoff v3: /handoff skill + real-usage auto-wrap

- Consolidated start/wrap/save/doc-update into one `/handoff` skill (`.claude/skills/handoff/SKILL.md`, subcommands start|wrap|save|docs); old 4 skill folders deleted. Canonical copy in MatrixApp (commit `b45d1a5` there). Public repo + ToolKit page NOT yet updated -- session paused mid-task (see next steps).
- Auto-wrap hooks v3: old MatrixApp hook estimated tokens from transcript BYTE SIZE (250KB ~ "15% of 200k") -- wrong on 1M models. v3 reads real usage from transcript JSONL (`input_tokens + cache_creation + cache_read` of last main-thread assistant msg). Soft 15% -> wrap nudge; hard 17% -> wrap NOW; env-tunable (`AUTOWRAP_WINDOW` default 1M). Rationale: >20% of 1M = 200k tokens = 2x long-context pricing tier.
- New `context-warn.sh` (UserPromptSubmit) warns before new work starts; `test-hooks.sh` = 17 smoke tests, green in both repos. Hooks wired in `settings.local.json` (Stop + UserPromptSubmit); **restart Claude Code to activate**.
- Created root `CLAUDE.md` (session protocol + AUTO-WRAP rule + Mind Palace path for wrap extras).
- handoff.md capped ~150 lines; full 967-line history moved verbatim to `handoff-archive.md` (never read on start).

## What To Do Next

**Next session: finish handoff v3 rollout (Phase B core), per approved plan `C:\Users\cryptomeda\.claude\plans\let-s-go-to-toolkit-delightful-goblet.md`:** (a) public repo `bugiiiii11/handoff` -- a local clone ALREADY EXISTS at `myprojects/handoff` (non-empty, uninspected -- inspect before overwriting); restructure to `skills/handoff/SKILL.md` + `hooks/`, remove old 4 skill folders, keep `build-kb`, rewrite README, push; (b) ToolKit page v3 updates (InstallBlock copy/verify/uninstall + optional hooks step, SkillCards -> /handoff subcommands + single sourceUrl, toolkit-skills.ts single handoff entry, "four skills" phrasing sweep) + `tsc`/lint/build green. Also: restart Claude Code to activate the new hooks; confirm `feat/landing-rebuild` Vercel preview rebuilt post-incident (or Redeploy manually); commit `67e66da` is unpushed.

| Priority | Task | Status / Notes |
|----------|------|----------------|
| 0-NEW | Landing rebuild v2 + MVP launch roadmap | Phase A COMPLETE + verified (S43). Spec: `command-center/mdntech-website-rebuild.md` v2.0. Roadmap: A done -> B ToolKit pre-release -> C ChatKit completion (incl. prio 2) -> D MVP LAUNCH -> E post-MVP products -> F payments LAST (N-Genius, vault `PAYMENT_NETWORK_INTERNATIONAL.md`). MVP/FULL modes via `NEXT_PUBLIC_LANDING_MODE` (unset = MVP). |
| 0b | MarketKit B3 Dub go-live + Session B remainder | B3 built (S41, `5085da4`), NOT deployed -- **[Martin]** create Dub account, paste `dub_...` key into `.env.local`; then edge secret + worker redeploy (5 parts) + migration 016 (`MARKETKIT-SETUP.md` B3 runbook). **[Martin]** approve/skip sprint proposals + upload first metrics screenshots. Then B1 GA4/GSC (**[Martin]** Google Cloud service account) + B5 dogfood onboarding (ChatKit, Melicharek, Good Hair by Zane). |
| 1 | Real payments (was Stripe; superseded by N-Genius plan F) | Mock checkout live (`/api/portal/subscription`, `/api/portal/chatbot/[id]/purchase`); schema has stripe_* columns. Gated on merchant account. |
| 2 | Wire feature gates in chatbot detail UI | `hasFeature(tier, ...)` exists in `lib/portal/plans.ts`; gate conversations (Starter+), trends/keywords (Pro+), reports/learning (Max). ~30 min; part of Phase C. |
| 3 | ChatKit Auto-Learning MVP (Max tier) | Deferred. Flag UI + Sunday cron + weekly report. ~5h. |
| 4 | Weekly auto-reports (Max tier) | Deferred. Pairs with prio 3; ship before serious Max marketing. |
| 5 | ChatKit Voice (Cartesia Sonic-3) | Deferred. ~6h. |
| 7 | Wire UI for 4 branded auth flows | Templates live in `supabase/email-templates/`; need login "Forgot password?" + `/portal/reset-password`, magic-link option, email-change form, reauth surface. |
| 9 | SignaKit portal section | Hidden for MVP; reactivate post-ChatKit-monetization. |
| 10 | Portal auth Supabase -> SignaKit | Pending, low. |
| 11 | Mind Palace <-> CC sync bridge | Pending, low. |
| 12 | SEO action plan | Follow `seo-audit/ACTION-PLAN.md`. |
| 13 | Handoff README "bonus skill" section | Low. `build-kb` framing in public repo README. |
| 14 | Delete `.next-stale-1777403470/` | Local only; safety hook blocks `rm -rf .*` -- delete via Explorer or `rmdir /s /q`. |
| 15 | SK Part B + domain 301 | Client-repo footer links (melicharek, RoyalStroje, zane) -> mdntech.org/sk at next touch of each repo; `mdntech.sk` purchase + 301; `.com -> .org` 301 at registrar. |

## Key Files

| File | Purpose |
|------|---------|
| `handoff.md` / `handoff-archive.md` | Live state (capped ~150 lines) / full history (never read on start) |
| `CLAUDE.md` | Session protocol + auto-wrap rule + conventions |
| `.claude/skills/handoff/SKILL.md` | Handoff v3 skill (start/wrap/save/docs) |
| `.claude/hooks/{auto-wrap,context-warn,test-hooks}.sh` | Real-usage session hooks + tests |
| `command-center/mdntech-website-rebuild.md` | Landing rebuild spec v2.0 (Phases A-F) |
| `lib/marketing/products.ts` | 5-product registry + MVP/FULL mode helper (`NEXT_PUBLIC_LANDING_MODE`) |
| `app/(marketing)/page.tsx` + `components/landing/*` | Product-first landing (S42) |
| `app/(marketing)/about/page.tsx` | Old landing moved here; LegacyHashRedirect on root |
| `components/main/cosmic-nebula.tsx` | R3F nebula (lazy in-view, reduced-motion fallback, seam-fix mask) |
| `app/(marketing)/sk/page.tsx` + `constants/sk.ts` | SK agency landing + all SK copy |
| `app/portal/toolkit/page.tsx` + `components/portal/handoff/*` | Public ToolKit page (InstallBlock, SkillCards, FAQ...) |
| `lib/portal/toolkit-skills.ts` | ToolKit gallery data (skills + MCPs) |
| `lib/portal/plans.ts` | ChatKit pricing source of truth + tier/feature resolvers |
| `lib/chat/usage.ts` | Cap-check + atomic usage increment |
| `middleware.ts` | Session guard + host branching (admin/app/marketing) |
| `supabase/migrations/` | 001-016 applied thru 015; 016 (Dub) pending apply |
| `supabase/functions/{techkit-poller,marketkit-worker}/` | Edge functions: poller v12, worker v2 (+dub_sync pending deploy) |
| `command-center/{TECHKIT,MARKETKIT}-SETUP.md` | Go-live runbooks (Management API patterns) |
| `command-center/{TECHKIT,MARKETKIT}-BRIEF.md` | Product briefs + session backlogs |
| `decisions.md` | Locked architectural decisions |
| `.mcp.json` | Supabase MCP (project `ijfgwzacaabzeknlpaff`) |
