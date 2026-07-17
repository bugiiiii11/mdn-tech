# M.D.N Tech -- Handoff

<!-- HARD CAP ~150 lines. Max 2 session sections. Overflow -> handoff-archive.md (full pre-v3 history archived there 2026-07-17). -->

## Current State

- **Phase:** Landing rebuild Phase B COMPLETE (S46). Phase C (ChatKit) in progress: S47 pivoted ChatKit to credits-only + one-time feature unlocks (subscriptions removed, migration 017 applied, build green). Branch `feat/landing-rebuild`, preview-only.
- **Session count:** 47
- **Products:** TechKit LIVE (all 7 crons), MarketKit A+B-core LIVE (B3 Dub code-complete, go-live pending), ChatKit live w/ credits-only mock checkout + per-bot feature unlocks, ToolKit public page live (+ Blender skill/MCP added S47).

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
| 47 | 2026-07-17 | ChatKit credits-only pivot + PlanKit removal + Blender skills (migration 017 applied) |

## What Was Done (Session 46) -- Phase B verified complete + ChatKit tier gates (prio 2)

- Public repo `bugiiiii11/handoff` restructure was ALREADY done and pushed (`63af63f`) -- the S45 "last Phase B item" note was stale. Verified: all 5 GitHub URLs the ToolKit page links to exist on origin/main; repo publicly readable (anonymous fetch of SKILL.md). Task 13 (README build-kb bonus section) also already shipped. Phase B COMPLETE.
- Prio 2 wired (first Phase C item): chatbot detail page resolves per-bot tier (`resolveChatbotTier`, customers + credits_purchased); Conversations/Export buttons gated Starter+ (locked chip -> per-bot upgrade page); trend/keyword charts gated Pro+ (locked card -> /portal/upgrade; analytics queries skipped when locked); new Max teaser card for reports/learning (gate wired now; the features themselves are prio 3/4).
- Enforcement is server-side, not just cosmetic: conversations page redirects free tier back to detail; export API now 403s for free tier (was owner-checked but tier-open -- any free user could export via direct URL).
- tsc + lint + build green. Not browser-verified (portal requires Supabase login); gates reuse the existing `hasFeature`/tier resolvers from `lib/portal/plans.ts`.

## What Was Done (Session 47) -- ChatKit credits-only pivot + PlanKit removal + Blender skills

- ChatKit monetization REWRITTEN (per user decision): subscriptions removed entirely. New model = credits fuel messages (1 credit = 1 msg, `CREDITS_PER_MESSAGE`), free trial 30 msgs/bot, credit packs 500/$29 · 2.5k/$99 · 10k/$299; premium features are ONE-TIME per-chatbot USD unlocks (`FEATURES` catalog in `lib/portal/plans.ts`). Free vs paid only -- any unlock works regardless of credit balance.
- `plans.ts` fully rewritten (source of truth): CREDIT_PACKS, FEATURES (conversations $19 / analytics $29 = available; learning $49 / reports $39 = coming-soon; extra_chatbot $49 = account scope), `isFeatureUnlocked`, `chatbotLimit`. Removed PLANS/tiers/resolveTier/hasFeature/isSubscriptionActive.
- Gating switched tier -> per-bot `feature_unlocks` jsonb: detail page, conversations page, export route (still server-enforced 403/redirect). Metering in `usage.ts` simplified to per-chatbot credits (subscription branch + period counters gone). `/api/portal/subscription` route DELETED; new `/feature` (account) + `/chatbot/[id]/feature` (per-bot) routes; purchase route takes `{packId}`.
- Migration 017 APPLIED via Management API (verified 5 cols live): `chatbots.feature_unlocks` jsonb, `customers.extra_chatbot_slots` int, `chatbot_purchases` +kind/pack_id/feature_id. Old `subscription_*` cols left DORMANT (non-destructive) -- drop in a later migration.
- Pages reworked: per-bot upgrade (packs + unlock cards), account upgrade (credit model + extra-chatbot add-on), ChatKitPricing, settings (billing card), new-chatbot limit, UsageMeter, BuyCreditsButton (pack-aware) + new UnlockFeatureButton. PlanActionButton (subs) + PlanKitTeaser DELETED; PlanKit section removed from ToolKit page.
- ToolKit gallery: added Blender MCP (`ahujasid/blender-mcp`) + Blender Skills (`ra100/blender-claude-plugin`) under new `creative` category (label "3D & Creative"); both URL-verified live. Skipped optional 3rd (freshtechbro web-export skill).
- GOTCHA (env parse): `.env.local` key is `SUPABASE_MANAGEMENT_API_KEY` (sbp_ PAT, 44 chars); split on first `=` not regex (regex dropped a char). Ref `ijfgwzacaabzeknlpaff`.
- Verified: tsc clean + `npm run build` green (all routes). NOT browser-verified. ASSUMPTIONS pending user confirm: 1 credit/msg rate, pack + feature prices, feature unlocks priced in USD (not credits).

## What To Do Next

**Next session:** (1) User to confirm S47 credits-only ASSUMPTIONS (credit rate 1/msg, pack + feature prices, feature-unlock currency = USD) -- all constants in `lib/portal/plans.ts`, cheap to tweak. (2) Browser-test the credits flow locally (`/portal/chatkit/<id>/upgrade`). (3) prio 7 -- wire the 4 branded auth flow UIs (`supabase/email-templates/`). Unpushed commits accumulating (push only on explicit request).

| Priority | Task | Status / Notes |
|----------|------|----------------|
| 0-NEW | Landing rebuild v2 + MVP launch roadmap | Phases A+B COMPLETE (S43/S46). Spec: `command-center/mdntech-website-rebuild.md` v2.0. Roadmap: C ChatKit completion (prio 2 done S46; next prio 7) -> D MVP LAUNCH -> E post-MVP products -> F payments LAST (N-Genius, vault `PAYMENT_NETWORK_INTERNATIONAL.md`). MVP/FULL modes via `NEXT_PUBLIC_LANDING_MODE` (unset = MVP). |
| 0b | MarketKit B3 Dub go-live + Session B remainder | B3 built (S41, `5085da4`), NOT deployed -- **[Martin]** create Dub account, paste `dub_...` key into `.env.local`; then edge secret + worker redeploy (5 parts) + migration 016 (`MARKETKIT-SETUP.md` B3 runbook). **[Martin]** approve/skip sprint proposals + upload first metrics screenshots. Then B1 GA4/GSC (**[Martin]** Google Cloud service account) + B5 dogfood onboarding (ChatKit, Melicharek, Good Hair by Zane). |
| 1 | Real payments (was Stripe; superseded by N-Genius plan F) | Mock checkout live: credit packs (`/api/portal/chatbot/[id]/purchase` {packId}), per-bot feature unlocks (`/api/portal/chatbot/[id]/feature`), account add-on (`/api/portal/feature`). Wire real payment on each. Gated on merchant account. |
| 2b-NEW | ChatKit credits-only pivot (S47) | DONE + build-green + migration 017 applied. Model: 1 credit=1 msg, packs 500/$29 · 2.5k/$99 · 10k/$299; features = one-time per-bot USD unlocks (`FEATURES` in `lib/portal/plans.ts`); subscriptions removed (S46 tier gates replaced). ASSUMPTIONS to confirm: credit rate (1/msg), pack + feature prices, feature-unlock currency = USD not credits. Old subscription_* columns left dormant (migration 017 note) -- drop later. |
| 3 | ChatKit Auto-Learning (one-time $49 unlock) | Feature card + gate wired S47 as `FEATURES` id `learning`, status `coming-soon`. TO SHIP: build rated-conversation loop + Sunday cron + auto-KB-suggestions, then flip status to `available`. ~5h. |
| 4 | ChatKit Weekly reports (one-time $39 unlock) | Feature card + gate wired S47 as `FEATURES` id `reports`, status `coming-soon`. TO SHIP: build digest generation + email, then flip status to `available`. Pairs with prio 3. |
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
| `lib/portal/plans.ts` | ChatKit billing source of truth (S47): CREDIT_PACKS, FEATURES catalog, `isFeatureUnlocked`, `chatbotLimit`, `CREDITS_PER_MESSAGE`. All prices/rates here. |
| `app/portal/chatkit/[id]/` + `[id]/upgrade` | Chatbot detail (per-bot unlock gates S47) + upgrade hub (credit packs + feature unlock cards) |
| `app/api/portal/{chatbot/[id]/purchase,chatbot/[id]/feature,feature}/` | Mock checkout: credit packs, per-bot unlocks, account add-on. Real payment = prio 1. |
| `supabase/email-templates/` | 4 branded auth email templates (prio 7 wires their UIs) |
| `supabase/migrations/` | 001-017; 017 (credits/addons) APPLIED S47; 016 (Dub) pending apply |
| `supabase/functions/{techkit-poller,marketkit-worker}/` | Edge functions: poller v12, worker v2 (+dub_sync pending deploy) |
| `command-center/{TECHKIT,MARKETKIT}-SETUP.md` / `-BRIEF.md` | Go-live runbooks (Management API patterns) + product briefs/backlogs |
| `decisions.md` | Locked architectural decisions |
