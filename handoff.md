# M.D.N Tech -- Handoff

<!-- HARD CAP ~150 lines. Max 2 session sections. Overflow -> handoff-archive.md (full pre-v3 history archived there 2026-07-17). -->

## Current State

- **Phase:** Phase C (ChatKit completion) in progress: S48 shipped prio 7 (4 branded auth flow UIs) + prio 3 (Auto-learning, migration 018 applied, $49 unlock now available). Next build: prio 4 weekly reports. Branch `feat/landing-rebuild`, preview-only, 3 unpushed commits.
- **Session count:** 48
- **Products:** TechKit LIVE (7 crons), MarketKit A+B-core LIVE (B3 Dub go-live pending), ChatKit live w/ credits-only mock checkout + per-bot unlocks (conversations/analytics/learning available; reports coming-soon), ToolKit public page live.

## Session Summary (last 10 -- full table + sessions 1-43 detail in handoff-archive.md)

| # | Date | Title |
|---|------|-------|
| 39 | 2026-07-12 | TechKit Session C -- costs (LIVE) |
| 40 | 2026-07-12 | TechKit Session D -- AI weekly digest (LIVE); TechKit complete |
| 41 | 2026-07-15 | MarketKit B3 Dub tracked links (code-complete, go-live pending) |
| 42 | 2026-07-16/17 | Landing rebuild Phase A -- A1+A2+A3 code-complete |
| 43 | 2026-07-17 | Nebula seam fix + A3.3/A3.4 -- Phase A verification complete |
| 44 | 2026-07-17 | Handoff v3 -- /handoff skill, real-usage auto-wrap hooks, handoff cap |
| 45 | 2026-07-17 | ToolKit gallery refresh -- 9 market-top skills + real MCP section |
| 46 | 2026-07-17 | Phase B verified complete + ChatKit tier gates wired (prio 2) |
| 47 | 2026-07-17 | ChatKit credits-only pivot + PlanKit removal + Blender skills (migration 017 applied) |
| 48 | 2026-07-17 | Prio 7 auth flow UIs + prio 3 Auto-learning shipped (migration 018 applied) |

## What Was Done (Session 47) -- ChatKit credits-only pivot + PlanKit removal + Blender skills

- ChatKit monetization REWRITTEN (per user decision): subscriptions removed entirely. New model = credits fuel messages (1 credit = 1 msg, `CREDITS_PER_MESSAGE`), free trial 30 msgs/bot, credit packs 500/$29 · 2.5k/$99 · 10k/$299; premium features are ONE-TIME per-chatbot USD unlocks (`FEATURES` catalog in `lib/portal/plans.ts`). Free vs paid only -- any unlock works regardless of credit balance.
- `plans.ts` fully rewritten (source of truth): CREDIT_PACKS, FEATURES (conversations $19 / analytics $29 = available; learning $49 / reports $39 = coming-soon; extra_chatbot $49 = account scope), `isFeatureUnlocked`, `chatbotLimit`. Removed PLANS/tiers/resolveTier/hasFeature/isSubscriptionActive.
- Gating switched tier -> per-bot `feature_unlocks` jsonb: detail page, conversations page, export route (still server-enforced 403/redirect). Metering in `usage.ts` simplified to per-chatbot credits (subscription branch + period counters gone). `/api/portal/subscription` route DELETED; new `/feature` (account) + `/chatbot/[id]/feature` (per-bot) routes; purchase route takes `{packId}`.
- Migration 017 APPLIED via Management API (verified 5 cols live): `chatbots.feature_unlocks` jsonb, `customers.extra_chatbot_slots` int, `chatbot_purchases` +kind/pack_id/feature_id. Old `subscription_*` cols left DORMANT (non-destructive) -- drop in a later migration.
- Pages reworked: per-bot upgrade (packs + unlock cards), account upgrade (credit model + extra-chatbot add-on), ChatKitPricing, settings (billing card), new-chatbot limit, UsageMeter, BuyCreditsButton (pack-aware) + new UnlockFeatureButton. PlanActionButton (subs) + PlanKitTeaser DELETED; PlanKit section removed from ToolKit page.
- ToolKit gallery: added Blender MCP (`ahujasid/blender-mcp`) + Blender Skills (`ra100/blender-claude-plugin`) under new `creative` category (label "3D & Creative"); both URL-verified live. Skipped optional 3rd (freshtechbro web-export skill).
- GOTCHA (env parse): `.env.local` key is `SUPABASE_MANAGEMENT_API_KEY` (sbp_ PAT, 44 chars); split on first `=` not regex (regex dropped a char). Ref `ijfgwzacaabzeknlpaff`.
- Verified: tsc clean + `npm run build` green (all routes). NOT browser-verified. ASSUMPTIONS pending user confirm: 1 credit/msg rate, pack + feature prices, feature unlocks priced in USD (not credits).

## What Was Done (Session 48) -- Prio 7 auth flow UIs + prio 3 Auto-learning shipped

- Prio 7 DONE (`4fc4dc5`): dual-mode `/reset-password` page (logged-out = request link via `resetPasswordForEmail`; recovery session via `/auth/callback` = set new password); LoginForm gained magic-link mode (`signInWithOtp`, `shouldCreateUser:false` -- no role-less junk accounts) + Forgot-password link; Settings "Security" card = email change (dual confirm) + password change with automatic reauth-OTP fallback (`reauthenticate()` -> `nonce`); `/reset-password` added to middleware public paths (both guards).
- Prio 7 REMAINING (manual, dashboard): paste the 4 templates from `supabase/email-templates/` into Supabase Auth settings + allowlist `/auth/callback` redirect URLs. Email round-trips NOT tested (needs real inbox).
- Prio 3 DONE (`b4f831e`): Auto-learning shipped + `learning` flipped to `available` ($49 unlock card now purchasable). Loop: owner rates replies (existing `message_feedback` from 005) -> Sunday 06:00 UTC cron `chatkit-learning` (or per-bot "Run now") -> `/api/portal/chatkit/learning/run` scans 7-day negative ratings (dedup via `source_message_ids`), Claude Haiku drafts <=5 KB suggestions -> detail-page Auto-learning section: accept (creates real KB entry) / dismiss.
- Migration 018 APPLIED via Management API + verified (table + RLS policy + cron job all live).
- OPS PENDING: set `CHATKIT_CRON_SECRET` on Vercel + same value as vault secret `chatkit_cron_secret` (`select vault.create_secret('<val>','chatkit_cron_secret')`); until then the Sunday cron 401s harmlessly. Manual "Run now" works without it (session auth).
- Verified: tsc/lint/build green after each feature; login + reset-password smoke-tested HTTP 200 on localhost with new UI present. Learning loop NOT E2E-tested (needs login + rated messages).

## What To Do Next

**Next session:** (1) User to confirm S47 credits-only ASSUMPTIONS (credit rate 1/msg, pack + feature prices, feature-unlock currency = USD) -- all constants in `lib/portal/plans.ts`, cheap to tweak. (2) Browser-test credits flow + auto-learning loop locally. (3) prio 4 -- weekly reports build (pairs with learning cron pattern). Ops: CHATKIT_CRON_SECRET (Vercel + vault) and Supabase email-template dashboard steps. 3 unpushed commits (push only on explicit request).

| Priority | Task | Status / Notes |
|----------|------|----------------|
| 0-NEW | Landing rebuild v2 + MVP launch roadmap | Phases A+B COMPLETE (S43/S46). Spec: `command-center/mdntech-website-rebuild.md` v2.0. Roadmap: C ChatKit completion (prio 2 done S46; next prio 7) -> D MVP LAUNCH -> E post-MVP products -> F payments LAST (N-Genius, vault `PAYMENT_NETWORK_INTERNATIONAL.md`). MVP/FULL modes via `NEXT_PUBLIC_LANDING_MODE` (unset = MVP). |
| 0b | MarketKit B3 Dub go-live + Session B remainder | B3 built (S41, `5085da4`), NOT deployed -- **[Martin]** create Dub account, paste `dub_...` key into `.env.local`; then edge secret + worker redeploy (5 parts) + migration 016 (`MARKETKIT-SETUP.md` B3 runbook). **[Martin]** approve/skip sprint proposals + upload first metrics screenshots. Then B1 GA4/GSC (**[Martin]** Google Cloud service account) + B5 dogfood onboarding (ChatKit, Melicharek, Good Hair by Zane). |
| 1 | Real payments (was Stripe; superseded by N-Genius plan F) | Mock checkout live: credit packs (`/api/portal/chatbot/[id]/purchase` {packId}), per-bot feature unlocks (`/api/portal/chatbot/[id]/feature`), account add-on (`/api/portal/feature`). Wire real payment on each. Gated on merchant account. |
| 2b-NEW | ChatKit credits-only pivot (S47) | DONE + build-green + migration 017 applied. Model: 1 credit=1 msg, packs 500/$29 · 2.5k/$99 · 10k/$299; features = one-time per-bot USD unlocks (`FEATURES` in `lib/portal/plans.ts`); subscriptions removed (S46 tier gates replaced). ASSUMPTIONS to confirm: credit rate (1/msg), pack + feature prices, feature-unlock currency = USD not credits. Old subscription_* columns left dormant (migration 017 note) -- drop later. |
| 3-DONE | ChatKit Auto-learning | SHIPPED S48 (`b4f831e`), status `available`. Remaining: ops secrets (see next-session line) + E2E test with rated messages. Follow TechKit digest pattern (015) for reports. |
| 4 | ChatKit Weekly reports (one-time $39 unlock) | NEXT BUILD. `FEATURES` id `reports`, status `coming-soon`. Build digest generation + email, flip to `available`. Reuse learning cron pattern (018) + TechKit digest aggregation (015). |
| 5 | ChatKit Voice (Cartesia Sonic-3) | Deferred. ~6h. |
| 7-DONE | Branded auth flow UIs | SHIPPED S48 (`4fc4dc5`). Remaining manual: paste 4 templates into Supabase dashboard + allowlist redirect URLs, then delete this row. |
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
| `supabase/email-templates/` | 4 branded auth email templates -- UIs wired S48; dashboard paste pending |
| `supabase/migrations/` | 001-018; 017+018 APPLIED; 016 (Dub) pending apply |
| `app/api/portal/chatkit/learning/run/` + `supabase/migrations/018_chatkit_learning.sql` | Auto-learning loop + cron pattern -- template for prio 4 reports |
| `command-center/{TECHKIT,MARKETKIT}-SETUP.md` / `-BRIEF.md` | Go-live runbooks (Management API patterns) + product briefs/backlogs |
| `decisions.md` | Locked architectural decisions |
