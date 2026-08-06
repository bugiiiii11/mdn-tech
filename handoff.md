# M.D.N Tech -- Handoff

<!-- HARD CAP ~150 lines. Max 2 session sections. Overflow -> handoff-archive.md (full pre-v3 history archived there 2026-07-17). -->

## Current State

- **Phase:** LAUNCH PLAN ACTIVE -- master checklist `MindPalace/Projects/MDN-Tech/MDN-Tech-Launch-Plan-2026-08.md` (re-baselined 2026-08-07; MVP launch target ~31.08). S50 locked the universal credit system + payments design and executed Phase 0.1 (feat/landing-rebuild merged + pushed to main = prod deploy; fixes prod pg_cron 018/019 404s). Next: Phase 0.2-0.5 security fix-pack.
- **Session count:** 50
- **Products:** TechKit LIVE (7 crons), MarketKit A+B-core LIVE (B3 Dub go-live pending), ChatKit live w/ credits-only mock checkout (all 4 features available; Voice deferred), ToolKit public page live.

## Session Summary (last 10 -- full table + sessions 1-43 detail in handoff-archive.md)

| # | Date | Title |
|---|------|-------|
| 41 | 2026-07-15 | MarketKit B3 Dub tracked links (code-complete, go-live pending) |
| 42 | 2026-07-16/17 | Landing rebuild Phase A -- A1+A2+A3 code-complete |
| 43 | 2026-07-17 | Nebula seam fix + A3.3/A3.4 -- Phase A verification complete |
| 44 | 2026-07-17 | Handoff v3 -- /handoff skill, real-usage auto-wrap hooks, handoff cap |
| 45 | 2026-07-17 | ToolKit gallery refresh -- 9 market-top skills + real MCP section |
| 46 | 2026-07-17 | Phase B verified complete + ChatKit tier gates wired (prio 2) |
| 47 | 2026-07-17 | ChatKit credits-only pivot + PlanKit removal + Blender skills (migration 017 applied) |
| 48 | 2026-07-17 | Prio 7 auth flow UIs + prio 3 Auto-learning shipped (migration 018 applied) |
| 49 | 2026-07-17 | Prio 4 Weekly reports shipped (migration 019 applied) -- Phase C build-complete |
| 50 | 2026-08-06/07 | Credit system + payments design locked; launch plan re-baselined; merged to main (Phase 0.1) |

## What Was Done (Session 49) -- Prio 4 Weekly reports shipped; Phase C build-complete

- Weekly reports SHIPPED; `reports` flipped to `available` in `lib/portal/plans.ts` -- $39 per-bot unlock purchasable everywhere with zero UI edits (all surfaces read `FEATURES` status). Last coming-soon feature gone.
- Loop: Monday 06:10 UTC cron `chatkit-reports` (migration 019) or detail-page "Run now" -> `/api/portal/chatkit/reports/run` aggregates last 7d vs prev 7d (conversations, replies, fallback rate via widget_config fallback string, owner ratings +/-, top keywords via new shared `extractKeywords` in `lib/portal/analytics.ts`) -> Haiku 2-4 sentence narrative -> upsert `chatbot_reports` (unique chatbot_id+period_start, re-runs never duplicate) -> Resend email to `customers.email` from reports@mdntech.org.
- Route mirrors learning/run (cron = all reports-unlocked active bots; manual = ownership + unlock checks). REUSES the same `chatkit_cron_secret` vault pair -- one secret powers both ChatKit crons, no new ops. Zero-activity bots skipped (no noise emails); narrative or email failure never fails the run (`email_sent` flag records delivery).
- UI: new `components/portal/reports/ReportList.tsx` + Weekly reports section on chatbot detail page (last 8 reports, expandable stat tiles w/ WoW deltas, keyword chips, narrative, emailed badge, Run now); stale "reports coming soon" teaser copy fixed.
- Migration 019 APPLIED via Management API + verified (table + RLS select policy + active cron). NOTE: email templates are 5 files (incl. confirm-signup), not 4 as S48 noted.
- Verified: tsc/lint/build green; route smoke-tested on localhost dev (unauthenticated POST -> clean 401 JSON). NOT E2E-tested (needs login + chat traffic + real inbox).
- NEW OPS: `RESEND_API_KEY` must exist in Vercel env for the portal app (present in `.env.local`; edge functions have their own copy) -- verify in Martin task 3.

## What Was Done (Session 50) -- Credit system + payments locked; launch plan re-baselined; merged to main

- Universal credit system DECIDED (2026-08-06): account-level append-only ledger; Stripe sells ONLY credit packs; everything else (unlocks, future image/video gen) = internal ledger spend. Packs unchanged ($29/500 · $99/2.5k · $299/10k; Scale gets "Best value" badge) + hidden Enterprise $999/40k prepared later; unlocks re-priced to credits @ Growth reference ~4c: conversations 500 / analytics 750 / reports 1000 / learning 1250 / extra bot 1250.
- Policy locked: 12-mo credit expiry (30-day warning email); refund 14 days ONLY if 0 credits of that purchase used (ElevenLabs pattern); failed action = auto re-credit, never money; chargeback clawback = negative ledger entry + account auto-suspend (only path to negative balance -- spends are pre-checked); signup grant 50 promo credits.
- B2B-only checkout CONFIRMED long-term: company name required, VAT ID OR business reg number (ICO), "purchasing as a business" checkbox, reverse-charge EU B2B, no OSS. EU-side evidence approach to be confirmed by Filip (added to plan SS2.0b).
- Provider path: Stripe UAE v1 (fees verified: 2.9% + AED1 domestic, +1% intl card, +1% FX, zero fixed costs); N-Genius later DATA-driven -- check Stripe card-country report at ~$2k/mo (setup ~AED 3,500). MoR ruled out; Lemon Squeezy plan ABANDONED (auto-memory updated).
- Launch plan doc updated (MindPalace): new SS2.4b/2.7/2.8, SS2.5 locked, SS3.1 DONE (Martin confirmed prices in chat), timeline re-baselined (T4 = MVP launch ~31.08), new "Otvorene otazky" section, Phase 8 notes (GoTrue templates via config/SMTP, edge functions -> Next API routes, drop unused Realtime/Storage); isHosting UAE costs verified: Elite $50.99 + Premium $33.99, total infra ~$85-125/mo.
- Sequencing (Martin): UAE substance finishes FIRST, then isHosting servers -- Phase 8 stays post-launch; until then product polish. Wio fully working. Stripe activation = Martin's critical-path task NOW (1-2 week verification).
- Phase 0.1 EXECUTED: feat/landing-rebuild (19 commits) merged into main + pushed on explicit user request -- prod deploy via Vercel.

## Martin's Tasks (detailed -- do these, then report back in chat)

1. **Stripe UAE activation (CRITICAL PATH, start this week):** dashboard.stripe.com -> create account for the FZE: trade license 7813, Emirates ID + residence visa, Wio account details (Wio confirmed working). Verification takes 1-2 weeks and gates Phase 2 payments -- start before anything else.
2. **Supabase auth email templates (10 min):** supabase.com/dashboard -> project `ijfgwzacaabzeknlpaff` -> Authentication -> Emails (Templates tab). For each template slot, open the matching file in `supabase/email-templates/` (5 files: confirm-signup, magic-link, reset-password, email-change, reauthentication), copy the whole HTML into the template Source, Save. Then Authentication -> URL Configuration: Site URL = `https://app.mdntech.org`; add Redirect URLs `https://app.mdntech.org/auth/callback` and `http://localhost:3000/auth/callback`.
3. **ChatKit cron secret + Resend key (5 min):** generate a random 32+ char string. (a) vercel.com -> M.D.N Tech site project -> Settings -> Environment Variables -> add `CHATKIT_CRON_SECRET` = that value (Production) -> redeploy; while there CONFIRM `RESEND_API_KEY` is listed too (add from `.env.local` line 30 if missing). (b) Supabase dashboard -> SQL Editor -> run: `select vault.create_secret('<that value>', 'chatkit_cron_secret');` -- powers both Sunday learning + Monday reports crons; until then they 401 harmlessly.
4. **Dub account for MarketKit B3 (10 min):** sign up at dub.co -> Settings -> API Keys -> Create key (starts `dub_...`) -> paste into `.env.local` as `DUB_API_KEY=dub_...` -> tell the next session "Dub key ready" (it then runs the 5-part go-live runbook in `command-center/MARKETKIT-SETUP.md` B3).
5. **Browser E2E pass (15 min, after 2+3):** `npm run dev` -> log in at `localhost:3000/portal/login` -> open your chatbot: buy a credit pack + unlock a feature (mock checkout, no real charge); rate a reply thumbs-down in Conversations then hit Auto-learning "Run now"; hit Weekly reports "Run now" and check your inbox for the report email. Report anything broken.
6. **Ask Filip:** compliance answers (plan SS2.0b) incl. the B2B evidence approach (VAT ID or ICO + business self-declaration); isHosting docs whenever available (not blocking -- prices already verified).

## What To Do Next

**Next session:** Phase 0.2-0.5 security fix-pack (admin escalation via `handle_new_user()` default role; column-level REVOKE on credits/unlocks/slots; admin check on `GET /api/infrastructure`; manual exploit verification). Then Phase 1 hardening -> Phase 2 credit bank + Stripe adapter (test mode can start before Stripe live keys arrive).

| Priority | Task | Status / Notes |
|----------|------|----------------|
| 0 | Launch plan Phases 0-6 -- MVP launch ~31.08 | Master checklist: MindPalace launch plan doc. 0.1 DONE (S50). Next: 0.2-0.5 security -> 1 hardening -> 2 credit bank (account-level ledger, `PaymentProvider` abstraction, migrate `chatbots.credits_purchased` -> ledger, credit-priced unlocks per S50 decisions) -> 3-6. |
| 0b | MarketKit B3 Dub go-live + Session B remainder | Gated on Martin task 4; then edge secret + worker redeploy (5 parts) + migration 016 (`MARKETKIT-SETUP.md` B3 runbook). Then B1 GA4/GSC (Google Cloud service account) + B5 dogfood onboarding. |
| 5 | ChatKit Voice (Cartesia Sonic-3) | Deferred. ~6h. |
| 8 | Phase 8 UAE hosting migration (isHosting) | AFTER substance done + post-launch (Martin 2026-08-07). Costs verified ~$85-125/mo. Plan SS8 has full checklist. |
| 9 | SignaKit portal section | Hidden for MVP; reactivate post-ChatKit-monetization. |
| 12 | SEO action plan | Follow `seo-audit/ACTION-PLAN.md`. |
| 14 | Delete `.next-stale-1777403470/` | Local only; safety hook blocks `rm -rf .*` -- delete via Explorer or `rmdir /s /q`. |
| 15 | SK Part B + domain 301 | Client-repo footer links -> mdntech.org/sk at next touch of each repo; `mdntech.sk` purchase + 301; `.com -> .org` 301 at registrar. |

## Key Files

| File | Purpose |
|------|---------|
| `handoff.md` / `handoff-archive.md` | Live state (capped ~150 lines) / full history (never read on start) |
| `MindPalace/Projects/MDN-Tech/MDN-Tech-Launch-Plan-2026-08.md` | MASTER launch checklist (Phases 0-8 + open questions) -- updated S50 |
| `lib/portal/plans.ts` | Billing source of truth -- Phase 2 repricing (credit-priced unlocks, hidden Enterprise pack) lands here |
| `app/api/portal/{chatbot/[id]/purchase,chatbot/[id]/feature,feature}/` | Mock checkout routes -- collapse into single credit purchase + ledger spends (Phase 2) |
| `app/api/portal/chatkit/{learning,reports}/run/` | The two ChatKit cron routes (shared `chatkit_cron_secret`; Sun 06:00 / Mon 06:10 UTC) |
| `supabase/email-templates/` | 5 branded auth email templates -- dashboard paste = Martin task 2 |
| `supabase/migrations/` | 001-019; 017+018+019 APPLIED; 016 (Dub) pending apply after Martin task 4 |
| `command-center/mdntech-website-rebuild.md` | Landing rebuild spec v2.0 (Phases A-F) |
| `MindPalace/.../PAYMENT_NETWORK_INTERNATIONAL.md` | N-Genius reference for the later adapter (SS11 webhook pattern reusable for Stripe) |
| `decisions.md` | Locked architectural decisions |
