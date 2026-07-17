# M.D.N Tech -- Handoff

<!-- HARD CAP ~150 lines. Max 2 session sections. Overflow -> handoff-archive.md (full pre-v3 history archived there 2026-07-17). -->

## Current State

- **Phase:** Phase C (ChatKit completion) BUILD-COMPLETE: S49 shipped prio 4 Weekly reports (migration 019 applied) -- all 4 ChatKit features now `available`; only Voice (prio 5) stays deferred. Blockers are Martin's manual tasks (below) + browser E2E, then Phase D MVP launch prep. Branch `feat/landing-rebuild`, preview-only, 5 unpushed commits after wrap.
- **Session count:** 49
- **Products:** TechKit LIVE (7 crons), MarketKit A+B-core LIVE (B3 Dub go-live pending), ChatKit live w/ credits-only mock checkout + per-bot unlocks (conversations/analytics/learning/reports ALL available), ToolKit public page live.

## Session Summary (last 10 -- full table + sessions 1-43 detail in handoff-archive.md)

| # | Date | Title |
|---|------|-------|
| 40 | 2026-07-12 | TechKit Session D -- AI weekly digest (LIVE); TechKit complete |
| 41 | 2026-07-15 | MarketKit B3 Dub tracked links (code-complete, go-live pending) |
| 42 | 2026-07-16/17 | Landing rebuild Phase A -- A1+A2+A3 code-complete |
| 43 | 2026-07-17 | Nebula seam fix + A3.3/A3.4 -- Phase A verification complete |
| 44 | 2026-07-17 | Handoff v3 -- /handoff skill, real-usage auto-wrap hooks, handoff cap |
| 45 | 2026-07-17 | ToolKit gallery refresh -- 9 market-top skills + real MCP section |
| 46 | 2026-07-17 | Phase B verified complete + ChatKit tier gates wired (prio 2) |
| 47 | 2026-07-17 | ChatKit credits-only pivot + PlanKit removal + Blender skills (migration 017 applied) |
| 48 | 2026-07-17 | Prio 7 auth flow UIs + prio 3 Auto-learning shipped (migration 018 applied) |
| 49 | 2026-07-17 | Prio 4 Weekly reports shipped (migration 019 applied) -- Phase C build-complete |

## What Was Done (Session 48) -- Prio 7 auth flow UIs + prio 3 Auto-learning shipped

- Prio 7 DONE (`4fc4dc5`): dual-mode `/reset-password` page (logged-out = request link via `resetPasswordForEmail`; recovery session via `/auth/callback` = set new password); LoginForm gained magic-link mode (`signInWithOtp`, `shouldCreateUser:false` -- no role-less junk accounts) + Forgot-password link; Settings "Security" card = email change (dual confirm) + password change with automatic reauth-OTP fallback (`reauthenticate()` -> `nonce`); `/reset-password` added to middleware public paths (both guards).
- Prio 7 REMAINING (manual, dashboard): Martin task 2 below. Email round-trips NOT tested (needs real inbox).
- Prio 3 DONE (`b4f831e`): Auto-learning shipped + `learning` flipped to `available` ($49 unlock card now purchasable). Loop: owner rates replies (existing `message_feedback` from 005) -> Sunday 06:00 UTC cron `chatkit-learning` (or per-bot "Run now") -> `/api/portal/chatkit/learning/run` scans 7-day negative ratings (dedup via `source_message_ids`), Claude Haiku drafts <=5 KB suggestions -> detail-page Auto-learning section: accept (creates real KB entry) / dismiss.
- Migration 018 APPLIED via Management API + verified (table + RLS policy + cron job all live).
- Verified: tsc/lint/build green after each feature; login + reset-password smoke-tested HTTP 200 on localhost with new UI present. Learning loop NOT E2E-tested (needs login + rated messages).

## What Was Done (Session 49) -- Prio 4 Weekly reports shipped; Phase C build-complete

- Weekly reports SHIPPED; `reports` flipped to `available` in `lib/portal/plans.ts` -- $39 per-bot unlock purchasable everywhere with zero UI edits (all surfaces read `FEATURES` status). Last coming-soon feature gone.
- Loop: Monday 06:10 UTC cron `chatkit-reports` (migration 019) or detail-page "Run now" -> `/api/portal/chatkit/reports/run` aggregates last 7d vs prev 7d (conversations, replies, fallback rate via widget_config fallback string, owner ratings +/-, top keywords via new shared `extractKeywords` in `lib/portal/analytics.ts`) -> Haiku 2-4 sentence narrative -> upsert `chatbot_reports` (unique chatbot_id+period_start, re-runs never duplicate) -> Resend email to `customers.email` from reports@mdntech.org.
- Route mirrors learning/run (cron = all reports-unlocked active bots; manual = ownership + unlock checks). REUSES the same `chatkit_cron_secret` vault pair -- one secret powers both ChatKit crons, no new ops. Zero-activity bots skipped (no noise emails); narrative or email failure never fails the run (`email_sent` flag records delivery).
- UI: new `components/portal/reports/ReportList.tsx` + Weekly reports section on chatbot detail page (last 8 reports, expandable stat tiles w/ WoW deltas, keyword chips, narrative, emailed badge, Run now); stale "reports coming soon" teaser copy fixed.
- Migration 019 APPLIED via Management API + verified (table + RLS select policy + active cron). NOTE: email templates are 5 files (incl. confirm-signup), not 4 as S48 noted.
- Verified: tsc/lint/build green; route smoke-tested on localhost dev (unauthenticated POST -> clean 401 JSON). NOT E2E-tested (needs login + chat traffic + real inbox).
- NEW OPS: `RESEND_API_KEY` must exist in Vercel env for the portal app (present in `.env.local`; edge functions have their own copy) -- verify in Martin task 3.

## Martin's Tasks (detailed -- do these, then report back in chat)

1. **Confirm pricing (2 min, just reply in chat):** 1 credit = 1 message; packs 500/$29 · 2,500/$99 · 10,000/$299; one-time unlocks: conversations $19, analytics $29, learning $49, reports $39, extra chatbot $49 (all USD). Reply "prices OK" or list changes -- every number lives in `lib/portal/plans.ts`, cheap to tweak.
2. **Supabase auth email templates (10 min):** supabase.com/dashboard -> project `ijfgwzacaabzeknlpaff` -> Authentication -> Emails (Templates tab). For each template slot, open the matching file in `supabase/email-templates/` (5 files: confirm-signup, magic-link, reset-password, email-change, reauthentication), copy the whole HTML into the template Source, Save. Then Authentication -> URL Configuration: Site URL = `https://app.mdntech.org`; add Redirect URLs `https://app.mdntech.org/auth/callback` and `http://localhost:3000/auth/callback`.
3. **ChatKit cron secret + Resend key (5 min):** generate a random 32+ char string. (a) vercel.com -> M.D.N Tech site project -> Settings -> Environment Variables -> add `CHATKIT_CRON_SECRET` = that value (Production) -> redeploy; while there CONFIRM `RESEND_API_KEY` is listed too (add from `.env.local` line 30 if missing). (b) Supabase dashboard -> SQL Editor -> run: `select vault.create_secret('<that value>', 'chatkit_cron_secret');` -- powers both Sunday learning + Monday reports crons; until then they 401 harmlessly.
4. **Dub account for MarketKit B3 (10 min):** sign up at dub.co -> Settings -> API Keys -> Create key (starts `dub_...`) -> paste into `.env.local` as `DUB_API_KEY=dub_...` -> tell the next session "Dub key ready" (it then runs the 5-part go-live runbook in `command-center/MARKETKIT-SETUP.md` B3).
5. **Browser E2E pass (15 min, after 2+3):** `npm run dev` -> log in at `localhost:3000/portal/login` -> open your chatbot: buy a credit pack + unlock a feature (mock checkout, no real charge); rate a reply thumbs-down in Conversations then hit Auto-learning "Run now"; hit Weekly reports "Run now" and check your inbox for the report email. Report anything broken.

## What To Do Next

**Next session:** work through whatever Martin reports from the tasks above (price tweaks, E2E findings, Dub go-live, email round-trip fixes). Then Phase D MVP launch prep per the spec. 5 unpushed commits -- push only on explicit request.

| Priority | Task | Status / Notes |
|----------|------|----------------|
| 0 | Landing rebuild v2 + MVP launch roadmap | Phases A+B COMPLETE (S43/S46); C build-complete (S49, Voice deferred). Spec: `command-center/mdntech-website-rebuild.md` v2.0. Next: D MVP LAUNCH -> E post-MVP products -> F payments LAST (N-Genius, vault `PAYMENT_NETWORK_INTERNATIONAL.md`). MVP/FULL modes via `NEXT_PUBLIC_LANDING_MODE` (unset = MVP). |
| 0b | MarketKit B3 Dub go-live + Session B remainder | B3 built (S41, `5085da4`), NOT deployed -- gated on Martin task 4; then edge secret + worker redeploy (5 parts) + migration 016 (`MARKETKIT-SETUP.md` B3 runbook). Also [Martin] approve/skip sprint proposals + upload first metrics screenshots. Then B1 GA4/GSC (Google Cloud service account) + B5 dogfood onboarding (ChatKit, Melicharek, Good Hair by Zane). |
| 1 | Real payments (N-Genius, plan F) | Mock checkout live on 3 routes: credit packs (`/api/portal/chatbot/[id]/purchase` {packId}), per-bot unlocks (`.../feature` {featureId}), account add-on (`/api/portal/feature`). Wire real payment on each. Gated on merchant account. |
| 5 | ChatKit Voice (Cartesia Sonic-3) | Deferred. ~6h. |
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
| `CLAUDE.md` + `.claude/skills/handoff/` + `.claude/hooks/` | Session protocol, /handoff v3 skill, auto-wrap hooks |
| `command-center/mdntech-website-rebuild.md` | Landing rebuild spec v2.0 (Phases A-F) -- Phase D is next |
| `lib/portal/plans.ts` | ChatKit billing source of truth: CREDIT_PACKS, FEATURES, `isFeatureUnlocked`, `chatbotLimit`, `CREDITS_PER_MESSAGE`. All prices here (Martin task 1). |
| `app/api/portal/{chatbot/[id]/purchase,chatbot/[id]/feature,feature}/` | Mock checkout routes -- wire real payments here (prio 1) |
| `app/api/portal/chatkit/{learning,reports}/run/` | The two ChatKit cron routes (shared `chatkit_cron_secret`; Sun 06:00 / Mon 06:10 UTC) |
| `supabase/email-templates/` | 5 branded auth email templates -- dashboard paste = Martin task 2 |
| `supabase/migrations/` | 001-019; 017+018+019 APPLIED; 016 (Dub) pending apply after Martin task 4 |
| `command-center/{TECHKIT,MARKETKIT}-SETUP.md` / `-BRIEF.md` | Go-live runbooks (Management API patterns) + product briefs/backlogs |
| `decisions.md` | Locked architectural decisions |
