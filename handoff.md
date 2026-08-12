# M.D.N Tech -- Handoff

<!-- HARD CAP ~150 lines. Max 2 session sections. Overflow -> handoff-archive.md (full pre-v3 history archived there 2026-07-17). -->

## Current State

- **Phase:** LAUNCH PLAN ACTIVE -- master checklist `MindPalace/Projects/MDN-Tech/MDN-Tech-Launch-Plan-2026-08.md` (MVP launch target ~31.08). Phase 0 + Phase 1 LIVE ON PROD. Website track: landing v2.1 + `/chatkit` + `/toolkit` built; S55's re-verify findings APPLIED and PUSHED (`0c5bb96`, branch-only, NOT merged to main). Remaining before the pages go live: visual QA on the B1 overflow change + ChatKit privacy disclosure (0c). Then Phase 2 credit bank.
- **Session count:** 56
- **Products:** TechKit LIVE (7 crons), MarketKit A+B-core LIVE (B3 Dub go-live pending), ChatKit live w/ credits-only mock checkout (Voice deferred), ToolKit public page live.

## Session Summary (last 10 -- full table + sessions 1-46 detail in handoff-archive.md)

| # | Date | Title |
|---|------|-------|
| 47 | 2026-07-17 | ChatKit credits-only pivot + PlanKit removal + Blender skills (migration 017 applied) |
| 48 | 2026-07-17 | Prio 7 auth flow UIs + prio 3 Auto-learning shipped (migration 018 applied) |
| 49 | 2026-07-17 | Prio 4 Weekly reports shipped (migration 019 applied) -- Phase C build-complete |
| 50 | 2026-08-06/07 | Credit system + payments design locked; launch plan re-baselined; merged to main (Phase 0.1) |
| 51 | 2026-08-07 | Security fix-pack 0.2-0.5 -- 6 confirmed prod exploits closed (migration 020 applied) |
| 52 | 2026-08-07 | Phase 0 merged to main + Phase 1 hardening 1.1-1.6 (migration 021 applied) |
| 53 | 2026-08-12 | Phase 1 deployed + verified on prod; landing SEO rework v2.1 + 4 false claims fixed |
| 54 | 2026-08-12 | /chatkit + /toolkit pages built (29 files) + 60-finding review; fix pass in flight |
| 55 | 2026-08-12/13 | S54 fix pass completed (60/60) + adversarial re-verify: 37 new findings, unapplied |
| 56 | 2026-08-13 | S55 re-verify findings applied (36/37) + branch pushed; gate green |

## What Was Done (Session 55) -- S54 fix pass completed + adversarial re-verify

- **Task 0 executed.** Audited all 60 findings against code: the interrupted workflow had landed only shared infra (product-pages module split, faq/schema/CtaButton helpers, `lib/marketing/toolkit-catalogue.ts`) + the F6 route fix; ~45 findings and ALL call-site migrations were unapplied. The S54 workflow output file was empty -- current code was the only source of truth.
- **Fix pass re-run and COMPLETED via 3 ownership-scoped agents** (shared files first, then chatkit + toolkit trees in parallel): all 60 findings + the 15 shared-file requests landed. Gate green: tsc, lint, build; both pages still prerender static; `/toolkit` bundle 10.2 -> 5.02 kB, `/chatkit` 18.5 -> 16.5 kB.
- Highlights: pages de-orphaned (sitemap + nav + footer + landing links now point at `/chatkit` + `/toolkit`); `FEATURES` spread removed from the $0 Offer schema; free-tier claim fixed; "exactly what we store" downgraded; skill counts single-sourced at 18/2 (`components/toolkit/catalogue.tsx` is now a re-export of `lib/marketing/toolkit-catalogue.ts`); both trees consume shared `FaqSection`/`CtaButton`/`PageHero trail`; `chatkit-breadcrumb.tsx` deleted; `components/chatkit/closing.tsx` created (CtaBand).
- **All 3 adversarial re-verify agents reported.** Honesty: ALL 7 standing constraints HOLD on the new pages. Design: contrast math, client boundaries, heading outline, SR names pass. Build+SEO (from built HTML): all 16 JSON-LD blocks parse, $0 Offer clean, FAQ parity 6/6, counts 18/2 everywhere, sitemap + internal links + og/twitter on both pages all PASS.
- BUT 37 new findings (13 honesty, 19 design, 5 build/SEO) written to the session scratchpad `reverify-findings.md` -- consumed and applied in S56.
- Hard auto-wrap at 17% forced the S55 wrap before the fix batch.

## What Was Done (Session 56) -- S55 re-verify findings applied; branch pushed

- **Applied 36/37 findings in one inline pass** (skipped A12 unverifiable-from-repo, B17 deferred pre-existing chrome, C5 info-only). C2 intent call answered by user: /toolkit hero + closing CTAs retargeted to on-page `#directory`, relabelled "Browse the skill directory".
- **B1 landed at the right level this time:** `html`/`body` `overflow-x: clip` + `width: 100%` (was `hidden !important` + `100vw`), marketing wrapper `overflow-x-clip` only (dropped `overflow-y-auto`) -- sticky works again. NEEDS visual QA before merge (see next steps row 0).
- Beyond the list: root metadata `config/index.ts` "trained on" -> "grounded in" (same A8 falsehood in the sitewide description/og/twitter strings).
- Shared-system rules tightened: `PROSE_LINK_CLASS` now OWNS `font-medium` -- never append weight/colour to it (13 chatkit suffixes stripped); `fadeUp(0)` -> `FADE_UP` in 13 chatkit spots; skip link + `<div id="content">` wrapper added in the marketing layout.
- og/twitter gotcha documented in the four fixed files: a page-level `openGraph`/`twitter` object REPLACES the root block wholesale (shallow merge) -- restate every field. Fixed on /blog, /privacy, /terms, /about.
- Gate green (tsc/lint/build; both pages still static; `/toolkit` 5.29 kB). HIGH fixes verified in BUILT HTML: payment disclosure now in homepage FAQ JSON-LD; "Free forever", "every Monday", the false tag-manager mechanism and the idempotent-install claim are gone; /about og:url matches its canonical.
- Commit `0c5bb96` PUSHED to `origin/feat/landing-rebuild` (pre-approved). Merge to main stays a separate decision; 0c privacy disclosure still blocks the pages going truly live.

## Martin's Tasks (detailed -- do these, then report back in chat)

1. **Stripe UAE activation (CRITICAL PATH, start this week):** dashboard.stripe.com -> create account for the FZE: trade license 7813, Emirates ID + residence visa, Wio account details (Wio confirmed working). Verification takes 1-2 weeks and gates Phase 2 payments -- start before anything else.
2. **Supabase auth email templates (10 min):** supabase.com/dashboard -> project `ijfgwzacaabzeknlpaff` -> Authentication -> Emails (Templates tab). For each template slot, open the matching file in `supabase/email-templates/` (5 files), copy the HTML into the template Source, Save. Then Authentication -> URL Configuration: Site URL = `https://app.mdntech.org`; add Redirect URLs `https://app.mdntech.org/auth/callback` and `http://localhost:3000/auth/callback`.
3. **ChatKit cron secret + Resend key (5 min):** generate a random 32+ char string. (a) vercel.com -> Settings -> Environment Variables -> add `CHATKIT_CRON_SECRET` (Production) -> redeploy; CONFIRM `RESEND_API_KEY` is listed (add from `.env.local` line 30 if missing). (b) Supabase SQL Editor: `select vault.create_secret('<that value>', 'chatkit_cron_secret');` -- powers Sunday learning + Monday reports crons; until then they 401 harmlessly.
4. **Dub account for MarketKit B3 (10 min):** dub.co -> Settings -> API Keys -> Create key -> paste into `.env.local` as `DUB_API_KEY=dub_...` -> tell the next session "Dub key ready".
5. **Browser E2E pass (15 min, after 2+3):** `npm run dev` -> log in at `localhost:3000/portal/login` -> buy a credit pack + unlock a feature (mock checkout); rate a reply thumbs-down then hit Auto-learning "Run now"; hit Weekly reports "Run now" and check your inbox. Report anything broken.
6. **Ask Filip:** compliance answers (plan SS2.0b) incl. the B2B evidence approach; isHosting docs whenever available (not blocking).
7. **Inviting a teammate (since S51):** Supabase SQL Editor: `insert into team_invites (email, role) values ('kolega@mdntech.org', 'engineer');` THEN have them sign up on that exact email. Confirm the ~50-credit signup promo grant number too (plan SS3.1 leftover).

## What To Do Next -- ChatKit remaining work

**Two tracks: Phase 2 credit bank (product) and the website/SEO rebuild (marketing).**

| Priority | Task | Status / Notes |
|----------|------|----------------|
| 0 | **Visual QA + merge decision** | B1 changed `html`/`body` overflow sitewide (`overflow-x: clip`, width 100%). Check 320px horizontal overflow on / + /chatkit + /toolkit + /about, confirm the /chatkit widget-anatomy sticky column now sticks. Then decide merge `feat/landing-rebuild` -> main with Martin (0c still open). |
| 0a | Rest of the website track | /about + blog rework (3 template-era articles are generic), then /sk alignment. THEN re-run the SEO audit -- `seo-audit/` is STALE (predates the rebuild). Target clusters: /chatkit = "AI chatbot for website"; /toolkit = "Claude Code skills" (low competition). |
| 0c | **ChatKit privacy disclosure** | Blocking the pages going live: transcripts + visitor IPs + `source_url` are stored (`message/route.ts`), `/privacy` documents none of it. Needs a ChatKit section -- Martin's call on wording. |
| 1 | **Phase 2 credit bank (ChatKit billing rebuild)** | 2.1 account-level `credits_ledger` (append-only) + migrate balances; 2.4b unlocks re-priced in credits (conv 500 / analytics 750 / reports 1000 / learning 1250 / extra bot 1250), 3 mock-checkout routes collapse into ONE credit purchase + ledger spends; 2.4 hidden Enterprise $999/40k + "Best value" badge on Scale; 2.7 policy build (12-mo expiry + warning email, refund window, auto re-credit, chargeback clawback + auto-suspend, 50-credit signup grant, low-balance email). `PaymentProvider` abstraction + Stripe test mode can start before Martin's live keys. Grant SELECT-only to `authenticated` on the ledger; all writes service-role. |
| 3 | Phase 3.5 E2E + CI | Port the S51 + S52 probe scripts into a committed suite. Add GitHub Actions (tsc, lint, build, E2E). Zero tests today. |
| 4 | Widen the Phase 1 controls | Authenticated portal routes still unlimited; nonce-based CSP via middleware is the follow-up. |
| 5 | ChatKit Voice (Cartesia Sonic-3) | Deferred. ~6h. |
| 0b | MarketKit B3 Dub go-live + Session B remainder | Gated on Martin task 4; runbook `command-center/MARKETKIT-SETUP.md` B3. Then B1 GA4/GSC + B5 dogfood onboarding. |
| 8 | Phase 8 UAE hosting migration (isHosting) | Post-launch. ~$85-125/mo verified. Plan SS8. |
| 9 | SignaKit portal section | Hidden for MVP. |
| 12 | SEO action plan | Follow `seo-audit/ACTION-PLAN.md` (stale -- re-audit first, see 0a). |
| 14 | Delete `.next-stale-1777403470/` | Local only; safety hook blocks `rm -rf .*` -- delete via Explorer or `rmdir /s /q`. |
| 15 | SK Part B + domain 301 | Client-repo footer links -> mdntech.org/sk; `mdntech.sk` purchase + 301; `.com -> .org` 301. |

## Key Files

| File | Purpose |
|------|---------|
| `handoff.md` / `handoff-archive.md` | Live state (capped ~150 lines) / full history (never read on start) |
| `MindPalace/Projects/MDN-Tech/MDN-Tech-Launch-Plan-2026-08.md` | MASTER launch checklist (Phases 0-8) |
| `PRODUCT.md` / `DESIGN.md` | Brand register + "Event Horizon" visual system. Read BOTH before any design or copy work |
| `components/product-pages/` | Shared shells, now the real system: `primitives.tsx` barrel over `motion-primitives` (PageHero+trail, Section, CtaBand, CtaButton, FADE_UP), `static-primitives` (GlassCard, StatChip, CheckItem, PROSE_LINK_CLASS -- owns font-medium, never append to it), `faq.tsx` (FaqSection + faqPageSchema -- ALL FAQ surfaces use it), `schema.ts` (@id refs), `code-block.tsx` |
| `lib/marketing/toolkit-catalogue.ts` | THE single source for skill counts/groups (18 listed / 2 ours); `components/toolkit/catalogue.tsx` is a thin re-export |
| `lib/portal/plans.ts` | Billing source of truth + `chatbotAllowanceLabel()`/`creditsPerReplyLabel()`. Never hard-code a price/count |
| `lib/chat/rate-limit-rules.ts` | Client-safe limiter constants (20/min IP, 120/min bot) -- marketing copy interpolates from here |
| `app/api/portal/{chatbot/[id]/purchase,chatbot/[id]/feature,feature}/` | The 3 mock checkout routes -- collapse into one credit purchase + ledger spends (Phase 2) |
| `supabase/migrations/{020_security_fixpack,021_chatkit_hardening}.sql` | Security model. Read 020 before touching billing columns |
| `decisions.md` | Locked architectural decisions |
