# M.D.N Tech -- Handoff

<!-- HARD CAP ~150 lines. Max 2 session sections. Overflow -> handoff-archive.md (full pre-v3 history archived there 2026-07-17). -->

## Current State

- **Phase:** LAUNCH PLAN ACTIVE -- master checklist `MindPalace/Projects/MDN-Tech/MDN-Tech-Launch-Plan-2026-08.md` (MVP launch target ~31.08). Phase 0 + Phase 1 LIVE ON PROD. **The website rebuild is MERGED AND LIVE on mdntech.org (S60, merge `ad2e4f1`)** -- `feat/landing-rebuild` is fully in `main`. The customer portal is gated behind `APP_LIVE` (see below), so the live site links to app.mdntech.org nowhere. 0c privacy disclosure DONE (S62). Next: **/sk rework (S63, plan committed)**, then SEO re-audit + Phase 2 credit bank.
- **Session count:** 62
- **Products:** TechKit LIVE (7 crons), MarketKit A+B-core LIVE (B3 Dub go-live pending), ChatKit live w/ credits-only mock checkout (Voice deferred), ToolKit public page live.

## Session Summary (last 10 -- full table + sessions 1-46 detail in handoff-archive.md)

| # | Date | Title |
|---|------|-------|
| 53 | 2026-08-12 | Phase 1 deployed + verified on prod; landing SEO rework v2.1 + 4 false claims fixed |
| 54 | 2026-08-12 | /chatkit + /toolkit pages built (29 files) + 60-finding review; fix pass in flight |
| 55 | 2026-08-12/13 | S54 fix pass completed (60/60) + adversarial re-verify: 37 new findings, unapplied |
| 56 | 2026-08-13 | S55 re-verify findings applied (36/37) + branch pushed; gate green |
| 57 | 2026-08-14 | Task 0 visual QA passed (sticky + 320px, footer fix) + 0a /about + blog honesty polish |
| 58 | 2026-08-14 | Hero rebuild: one full-viewport shell across /, /sk, /chatkit, /toolkit |
| 59 | 2026-08-14 | /about + /blog on hero shell; founder-forward team; constellation blog cards |
| 60 | 2026-08-15 | APP_LIVE portal gate + merge to main; website rebuild live on prod |
| 61 | 2026-08-15 | /sk realizacie refresh (4 projects, fresh captures) + SK footer on the EN shell |
| 62 | 2026-08-16 | ChatKit privacy disclosure (0c) -- /privacy Section 3 + stale-processor cleanup |

## What Was Done (Session 61) -- /sk realizacie refresh + SK footer on the EN shell

- **Realizacie is now four projects**, user-ordered: Royal Stroje, Royal Works, Good Hair by Zane, Kurenie Turiec (`SK_PORTFOLIO` order IS the render order -- reorder there, nowhere else). `royalworks.sk` is new; Royal Stroje's third tag is now "CRM" (was "Command Center" -- read as our internal product, not the client's).
- **Royal Works tags are UNCONFIRMED** -- shipped as Web / Lokalne SEO / Dizajn na mieru, inferred from the live site, not from the actual engagement. Ask Martin to confirm or correct.
- All four previews re-captured from the live sites. `scripts/capture-portfolio.mjs` now declines cookie banners before shooting (clicks Odmietnut/Reject -- NEVER accept, the captures must not opt into a client's analytics) and hides late-loading chat bubbles. Two shots previously shipped with a consent overlay baked in.
- CAPTURE GOTCHA: the first page render after a fresh capture shows blank/old previews because next/image is generating the optimization on demand. Re-shoot before concluding the cache is stale -- it is not, and `rm -rf .next/cache/images` is unnecessary (it also trips the `rm -rf \.` safety hook).
- Grid went 3-col -> `md:grid-cols-2` inside `max-w-5xl`: four cards in three columns left an orphan and 4-across shrank previews past legibility. `sizes` moved 33vw -> 50vw to match.
- **SK footer rebuilt on the EN footer's shell** (#010109 panel, violet horizon hairline, uppercase column heads, social row, same bottom bar). Newsletter slot became a consultation CTA instead -- /sk closes on its own contact form and the newsletter copy is English-only. Columns render from `SK_NAV_LINKS` + `SK_NAP` so they cannot drift from the page. The old "DO NOT TOUCH /sk" comment on that component is gone.
- **`COMPANY_LEGAL_LINE` in `lib/marketing/links.ts` is the single legal footprint** both footers render. The Slovak postal address (Recka cesta 182, Senec-Boldog) is deleted sitewide -- zero hits in the build. `SK_NAP` never carried an address, so no JSON-LD change was needed.
- Gate green; overflowX=0 at 1280 + 375; screenshot-verified. Pushed straight to `main` (prod) at user request.

## What Was Done (Session 62) -- ChatKit privacy disclosure (task 0c)

- **`/privacy` gained Section 3 "ChatKit Chat Widget"** (`app/(marketing)/privacy/page.tsx`), the last blocker on 0d besides Phase 2. Discloses what `message/route.ts` actually writes: full transcripts, the localStorage visitor ID, `visitor_ip`, `source_url`, and optional feedback ratings -- none of which the policy had mentioned.
- **The controller/processor split is the substantive call (3.4):** on a CUSTOMER's site the customer is data controller and we are processor, so visitor rights requests go to the site they chatted on and we assist. On our own site we are controller. This is what makes the widget sellable to EU SMEs -- do not water it down without thinking it through.
- **Retention = "life of the service" (user decision, deliberate).** Deleted when the conversation, the chatbot, or the account goes. A fixed rolling window (12/24mo) was offered and REJECTED: it would have committed us to a cleanup cron that does not exist. Nothing auto-deletes today and the policy now matches that truthfully.
- Also states Anthropic does not train on the data, that site owners can read/export their own bot's conversations, that auto-learning reviews transcripts + ratings, and that IP rate-limit counters expire within 24h. Plus a "do not share sensitive data in chat" advisory.
- **Stale-processor cleanup in the same pass: Railway is GONE from the policy** (sections 2.3, 5.1, 6.1) -- it hosts nothing anymore; replaced with Supabase. Anthropic + Resend added as sub-processors, ChatKit row added to the retention list, and the widget's localStorage got its own entry in the cookies section.
- Sections renumbered 1-15 (ChatKit inserted at 3), "Last Updated" -> 2026-08-16. ESLint clean; `/terms` has no cross-references to the old numbers. Gate still green -- no app.mdntech.org link added.
- **NOT legal-reviewed.** Drafted by Claude from the code, not by counsel. Worth a pass from Martin or Filip (already holds compliance question SS2.0b) before the portal opens. Note the policy still says "Google Analytics (when implemented)" -- true today, revisit in MarketKit B1.

## Martin's Tasks (detailed -- do these, then report back in chat)

1. **Stripe UAE activation (CRITICAL PATH, start this week):** dashboard.stripe.com -> create account for the FZE: trade license 7813, Emirates ID + residence visa, Wio account details (Wio confirmed working). Verification takes 1-2 weeks and gates Phase 2 payments -- start before anything else.
2. **Supabase auth email templates (10 min):** supabase.com/dashboard -> project `ijfgwzacaabzeknlpaff` -> Authentication -> Emails (Templates tab). For each template slot, open the matching file in `supabase/email-templates/` (5 files), copy the HTML into the template Source, Save. Then Authentication -> URL Configuration: Site URL = `https://app.mdntech.org`; add Redirect URLs `https://app.mdntech.org/auth/callback` and `http://localhost:3000/auth/callback`.
3. **ChatKit cron secret + Resend key (5 min):** generate a random 32+ char string. (a) vercel.com -> Settings -> Environment Variables -> add `CHATKIT_CRON_SECRET` (Production) -> redeploy; CONFIRM `RESEND_API_KEY` is listed (add from `.env.local` line 30 if missing). (b) Supabase SQL Editor: `select vault.create_secret('<that value>', 'chatkit_cron_secret');` -- powers Sunday learning + Monday reports crons; until then they 401 harmlessly.
4. **Dub account for MarketKit B3 (10 min):** dub.co -> Settings -> API Keys -> Create key -> paste into `.env.local` as `DUB_API_KEY=dub_...` -> tell the next session "Dub key ready".
5. **Browser E2E pass (15 min, after 2+3):** `npm run dev` -> log in at `localhost:3000/portal/login` -> buy a credit pack + unlock a feature (mock checkout); rate a reply thumbs-down then hit Auto-learning "Run now"; hit Weekly reports "Run now" and check your inbox. Report anything broken.
6. **Ask Filip:** compliance answers (plan SS2.0b) incl. the B2B evidence approach; isHosting docs whenever available (not blocking).
7. **Royal Works tags (1 min):** the /sk card ships Web / Lokalne SEO / Dizajn na mieru, inferred from the live site. Confirm or correct in chat.
8. **Founder card assets (2 min):** paste your personal LinkedIn URL in chat (goes into `FOUNDER.linkedin`, one line) and optionally drop a real photo over `public/team/1.jpg` -- the /about founder card ships without the button until then.
9. **Inviting a teammate (since S51):** Supabase SQL Editor: `insert into team_invites (email, role) values ('kolega@mdntech.org', 'engineer');` THEN have them sign up on that exact email. Confirm the ~50-credit signup promo grant number too (plan SS3.1 leftover).

## What To Do Next -- ChatKit remaining work

**Two tracks: Phase 2 credit bank (product) and the website/SEO rebuild (marketing).**

| Priority | Task | Status / Notes |
|----------|------|----------------|
| 0a | **/sk REWORK -- NEXT SESSION (S63)** | Plan committed: `command-center/mdntech-sk-rework.md` (v1.0, 171 lines) -- READ IT FIRST, it has the audited current state, target section order and the Slovak copy already drafted. Scope: trust (new `SkAbout` "Kto sme" founder section + FAQ w/ FAQPage schema), CRM elevated to flagship service, new `/sk/referencie/royal-stroje` case study. Driver: Royal Stroje partner email campaign (~150 warm contacts, early September) lands on this page. Positioning: "slovensky founder, medzinarodna firma" -- UAE entity transparent but NOT the headline; invoicing FAQ is a trust weapon. Copy lives in `constants/sk.ts`. Open item in the plan: LinkedIn `sameAs` slug `/company/mdntech/` is NOT claimed yet (real page is `/company/111977261`) -- claim it or fix the constant. |
| 0a2 | SEO re-audit (after /sk) | `seo-audit/` is STALE (predates the rebuild). Target clusters: /chatkit = "AI chatbot for website"; /toolkit = "Claude Code skills" (low competition). Re-audit should confirm the S58 breadcrumb-schema removal is acceptable, or restore visible trails + schema together, and re-check the S60 `installUrl`/`availability` omissions. Also queue: `/blog/[slug]` article-page redesign to match the new index. |
| 0d | **Open the portal (when ready)** | Set `NEXT_PUBLIC_APP_LIVE=true` in Vercel Production + redeploy. 0c is DONE (S62), so the remaining gate is Phase 2 checkout. Verify afterwards that the built HTML has app links back and that no "Coming soon" span survives. Get `/privacy` a human legal read before flipping it. |
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
| `lib/marketing/products.ts` | THE portal gate: `APP_LIVE` (default CLOSED), `appCta()`, `isAppHref()` -- grep APP_LIVE before adding any link to app.mdntech.org. Also the landing product lineup + `getLandingMode()` |
| `components/main/hero-shell.ts` | THE hero contract for /, /sk, /chatkit, /toolkit (full-viewport shell, blackhole framing, CTA sizes). MUST stay under `components/` -- Tailwind does not scan `lib/`, and the failure is silent |
| `components/product-pages/` | Shared shells, now the real system: `primitives.tsx` barrel over `motion-primitives` (PageHero, Section, CtaBand, CtaButton+size, FADE_UP), `static-primitives` (GlassCard, StatChip, CheckItem, PROSE_LINK_CLASS -- owns font-medium, never append to it), `faq.tsx` (FaqSection + faqPageSchema -- ALL FAQ surfaces use it), `schema.ts` (@id refs), `code-block.tsx` |
| `constants/sk.ts` | ALL /sk copy + data. `SK_PORTFOLIO` order = render order; `SK_NAP` + `SK_NAV_LINKS` feed the SK footer. Re-shoot previews with `node scripts/capture-portfolio.mjs [name]` |
| `command-center/mdntech-sk-rework.md` | THE /sk rework plan (v1.0) -- next session's brief. Slovak copy drafted, section order decided |
| `app/(marketing)/privacy/page.tsx` | Privacy policy. Section 3 = ChatKit (what the widget stores, controller/processor split, life-of-service retention). Update it whenever chat data handling changes |
| NEVER hard-code these | `lib/portal/plans.ts` (prices/allowances), `lib/marketing/toolkit-catalogue.ts` (skill counts), `lib/chat/rate-limit-rules.ts` (limiter numbers), `lib/marketing/links.ts` (`COMPANY_LEGAL_LINE` -- the one legal footprint both footers render). Marketing copy interpolates from all four |
| `app/api/portal/{chatbot/[id]/purchase,chatbot/[id]/feature,feature}/` | The 3 mock checkout routes -- collapse into one credit purchase + ledger spends (Phase 2) |
| `supabase/migrations/{020_security_fixpack,021_chatkit_hardening}.sql` | Security model. Read 020 before touching billing columns |
| `decisions.md` | Locked architectural decisions |
