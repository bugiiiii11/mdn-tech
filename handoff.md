# M.D.N Tech -- Handoff

<!-- HARD CAP ~150 lines. Max 2 session sections. Overflow -> handoff-archive.md (full pre-v3 history archived there 2026-07-17). -->

## Current State

- **Phase:** LAUNCH PLAN ACTIVE -- master checklist `MindPalace/Projects/MDN-Tech/MDN-Tech-Launch-Plan-2026-08.md` (MVP launch target ~31.08). **Phase 2 credit bank DEPLOYED (S72):** migration 022 (account-level `credits_ledger`) on prod; Stripe behind `PaymentProvider` (mock fallback until keys); unlocks in credits; pushed to main -> Vercel auto-deploy. Campaign gates unchanged: EmailJS attribution + Filip FAQ. Portal still gated behind `APP_LIVE` -- stays closed until fully ready (user call S72).
- **Session count:** 72
- **Products:** TechKit LIVE (7 crons), MarketKit A+B-core LIVE (B3 Dub go-live pending), ChatKit live w/ credits-only mock checkout (Voice deferred), ToolKit public page live.

## Session Summary (last 10 -- full table + sessions 1-46 detail in handoff-archive.md)

| # | Date | Title |
|---|------|-------|
| 63 | 2026-08-16 | /sk rework built: CRM flagship + Kto sme + FAQ + Royal Stroje case study (feat/sk-rework, unmerged) |
| 64 | 2026-08-16 | /sk rework merged + LIVE; C3 UTM attribution; C2 SK chatbot live with branded widget |
| 65 | 2026-08-17 | Chatbot 400 fix (null conversationId) + final logo rolled out sitewide (C7) + new OG cards |
| 66 | 2026-08-18 | mdntech.sk live (C5) + widget www/CORS fix + SK legal pages + CRM section rebuild |
| 67 | 2026-08-19 | /sk copy pass (keyword H1, honest scope) + widget leak onto EN pages fixed |
| 68 | 2026-08-19 | SEO re-audit 76/100 + Critical #1/#2 fixed (blog images, lang=sk, hreflang, three.js off critical path) |
| 69 | 2026-08-19 | SEO action plan: #3, #8, #10-13, #16 closed; #16 finding corrected (RSC seed tree is architectural) |
| 70 | 2026-08-19 | SEO action plan closed out: blog refresh (#15/#7), tap targets, /sk H1 wrap, internal links |
| 71 | 2026-08-20 | Royal Stroje case study final + DEPLOYED; GSC live; campaign technically ready |
| 72 | 2026-08-20 | Phase 2 credit bank: migration 022 on prod, Stripe adapter, checkout collapse (local) |

## What Was Done (Session 72) -- Phase 2 credit bank: ledger + Stripe + checkout collapse

- **Migration `022_credit_bank.sql` APPLIED to prod + verified** (Management API; key in `.env.local` `SUPABASE_MANAGEMENT_API_KEY`, ref `ijfgwzacaabzeknlpaff`). Account-level append-only `credits_ledger`; `spend_credits()` (advisory-lock, overdraft raises `insufficient_credits`, verified live); `credit_balance()`; both EXECUTE service-role-only (revoking PUBLIC strips service_role too -- explicit grant-back required, done). Roll-up: 2,000 credits migrated for the 1 legacy customer, expires_at NULL (grandfathered).
- **DELIBERATELY NOT DONE in 022: zeroing `chatbots.credits_purchased`.** Deployed prod code still meters off that column; new code never reads it. After THIS build deploys, write a cleanup migration (zero/retire the column) -- until then do not re-read it anywhere.
- **PaymentProvider abstraction (`lib/payments/`)**: Stripe adapter = hosted Checkout, inline `price_data`, required company-name field (B2B 2.5); VAT/tax_id collection deferred to Filip's 2.0b answers. No `STRIPE_SECRET_KEY` -> `getPaymentProvider()` returns null and routes fall back to instant mock grants (provider 'mock'), so Martin's E2E works today. **Paid grants happen ONLY in `/api/webhooks/stripe`**, idempotent via unique `(provider, provider_ref)`.
- **3 mock routes DELETED** -> `/api/portal/credits/purchase` (packId + returnTo; Stripe url or mock grant) and `/api/portal/unlock` (spend-first, auto `recredit` row if the unlock flip fails, 402 + balance on insufficient). App-side ledger access ONLY via `lib/portal/credits.ts`.
- **Pricing (confirmed 2026-08-06, do not change):** unlocks in credits -- conversations 500, analytics 750, reports 1000, learning 1250, extra_chatbot 1250 (`FeatureDef.creditCost/creditLabel`; priceCents/priceLabel are GONE from features). Enterprise $999/40k exists `hidden: true`; **always render `visibleCreditPacks()`, never `CREDIT_PACKS`**. "Best value" moved Growth -> Scale. Signup grant 50 credits in `handle_new_user()` -- number pending Martin (plan 3.1).
- **Metering (`lib/chat/usage.ts`):** trial stays per-chatbot (30 via `messages_used`), then `CREDITS_PER_MESSAGE` ledger spend per reply; spend-after-reply race logs and rides free (next check blocks). New `ChatbotUsage` shape {mode internal|trial|credits, balance}; UsageMeter/upgrade pages/settings rebuilt around the account balance.
- **Marketing copy truth pass:** "credits never expire" and "each chatbot keeps its own credits" are now FALSE -- replaced everywhere with 12-month validity + one shared account balance (pricing.tsx honesty constraint #3 flipped, documented in its header; payment language stays no-buy until keys go live).
- Deferred to later sessions: expiry-sweep cron (first expiry mid-2027), chargeback clawback + account suspend, low-balance email (2.7g), refund/ToS text, Stripe E2E 2.6. tsc/lint/build all green. **Pushed to main (user request) -> Vercel auto-deploy; portal stays gated (`APP_LIVE` untouched).**

## What Was Done (Session 71) -- Royal Stroje case study final + DEPLOYED + GSC live

- **0a4 + 0a5 CLOSED; campaign technically ready.** Founder consent + written account arrived -> case study completed (story timeline, qualitative Vysledky, "Slovami majitela" testimonial), pull-quote on the /sk Royal Stroje card, bot KB rebuilt from CS fields and re-seeded after each deploy. Pushed S69+S70+S71 to main; .sk deep-link redirect verified on prod incl. www (ACTION-PLAN #10 done); /blog S70 changes verified live.
- **Founder feedback pass (1b1e1b5) set standing copy rules -- never reintroduce:** timeline labels are EVERGREEN (no month names: "Zaciatok spoluprace / Automatizacia procesov / Dnes"); Vysledky is QUALITATIVE (no client counts or timings in our voice anywhere on the page); the quote says "mnozstvo stalych klientov" (100+ deliberately softened); no "neuvadzame" disclaimers.
- Rankings appear ONLY inside the attributed founder quote; NO Review/aggregateRating schema (self-serving per Google). Both rules documented in the `constants/sk-case-studies.ts` header comment.
- **GSC LIVE:** domain property mdntech.org verified via DNS TXT under the personal Google account (business-account creation blocked on phone verification -- add `contact@mdntech.org` as second Owner later; it is NOT a Google account, mail is on Hostinger). Sitemap submitted (14 pages, Success); key pages requested for indexing 2026-08-20; stale `www` sitemap row flagged for deletion.
- Rich Results on the case study: 3 valid items (Article, Breadcrumb, Organization); "non-critical" flags are optional-field hints, no action needed.
- DNS facts: mdntech.org DNS + mail = Hostinger (dns-parking.com NS); mdntech.sk = Websupport.

## Martin's Tasks (detailed -- do these, then report back in chat)

0b. **Dev server** -- S68 had to kill it during the root-layout split; if `npm run dev` 500s, delete `.next/` first. `.next-stale-1777403470/` can be deleted via Explorer; `.next-verify/` stays (build-verify dir).

0. **EmailJS template: add attribution (5 min, blocks C3 payoff):** emailjs.com -> the contact template -> add a line `Zdroj: {{attribution}}` (optionally also `{{form_id}}`, `{{landing_page}}`). Until then the forms SEND the UTM data but the inbox never shows it. Also: review the SK chatbot's answers at admin.mdntech.org/chatbots/46ef0a99...; KB edits that should persist belong in `constants/sk.ts` + re-run `scripts/seed-sk-chatbot.mjs`.

1. **Stripe UAE activation (CRITICAL PATH, start this week):** dashboard.stripe.com -> create account for the FZE: trade license 7813, Emirates ID + residence visa, Wio account details. Verification takes 1-2 weeks. The code side is DONE (S72) -- once verified: add `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` to Vercel (test keys first), create a dashboard webhook for `checkout.session.completed` -> `https://app.mdntech.org/api/webhooks/stripe`, then tell the next session "Stripe keys live" (runs E2E 2.6). Also confirm the 50-credit signup grant number.
2. **Supabase auth email templates (10 min):** project `ijfgwzacaabzeknlpaff` -> Authentication -> Emails: copy each file from `supabase/email-templates/` (5 files) into the matching template Source, Save. Then URL Configuration: Site URL `https://app.mdntech.org`; Redirect URLs `https://app.mdntech.org/auth/callback` + `http://localhost:3000/auth/callback`.
3. **ChatKit cron secret + Resend key (5 min):** random 32+ char string -> Vercel env `CHATKIT_CRON_SECRET` (Production) + redeploy; confirm `RESEND_API_KEY` listed. Supabase SQL: `select vault.create_secret('<value>', 'chatkit_cron_secret');`
4. **Dub account for MarketKit B3 (10 min):** dub.co -> API key -> `.env.local` `DUB_API_KEY=dub_...` -> tell next session "Dub key ready".
5. **Browser E2E pass (15 min, after 2+3):** login at `localhost:3000/portal/login`, buy credit pack + unlock feature, thumbs-down + Auto-learning "Run now", Weekly reports "Run now" + check inbox.
6. **Ask Filip:** compliance answers (plan SS2.0b); confirm /sk FAQ #4 (staging-UAE/produkcia-EU wording + DPA) and #5 (governing law / vzorova zmluva) -- blocks campaign send, not the deploy.
7. **GSC follow-up (~2026-08-24):** open Search Console -> Indexing -> Pages (is everything from the sitemap indexed?) + Performance (first query data). Delete the stale `www.mdntech.org/sitemap.xml` row (three-dots menu). Report findings in chat.
8. **Royal Works tags (1 min):** /sk card ships Web / Lokalne SEO / Dizajn na mieru (inferred). Confirm or correct in chat.
9. **Founder card assets (2 min):** paste your personal LinkedIn URL in chat (fills `FOUNDER.linkedin`) and optionally drop a real photo over `public/team/1.jpg`. Also: claim the LinkedIn vanity slug `/company/mdntech` (C4, last SK-C item).
10. **Inviting a teammate (since S51):** Supabase SQL: `insert into team_invites (email, role) values ('kolega@mdntech.org', 'engineer');` then they sign up on that email. Confirm the ~50-credit signup promo grant number (plan SS3.1).

## What To Do Next -- commit/deploy S72 + campaign gates + Phase 2 remainder

**Three tracks: Phase 2 remainder (product), campaign send-off (marketing), launch gates.**

| Priority | Task | Status / Notes |
|----------|------|----------------|
| 0a | **Campaign send-off gates** (~150 partner emails, early September) | Site + case study + GSC all DONE and verified (S71). Remaining: EmailJS attribution line (Martin 0), Filip FAQ #4/#5 (Martin 6), C4 LinkedIn vanity slug (Martin 9). Campaign plan: `MindPalace/Projects/MDN-Tech/Kampan-Royal-Stroje-2026-09.md`. |
| 0a6 | **GSC follow-up** (~2026-08-24, Martin task 7) | Coverage + Performance check; then optional: royalstroje.sk property (Websupport TXT -- data that could later back ranking claims in OUR voice in the case study), Bing import from GSC, GA4 (= plan B1). |
| 0d | **Open the portal (when ready)** | Set `NEXT_PUBLIC_APP_LIVE=true` in Vercel Production + redeploy. Remaining gate: Phase 2 checkout + human legal read of /privacy. Verify built HTML has app links back, no "Coming soon" survives. |
| 1 | **Phase 2 remainder** | S72 DEPLOYED. Next: smoke-test portal flows on prod behind the gate (buy pack mock, unlock 402 path, meter) -- Martin task 5 covers the guided version. Then: cleanup migration zeroing `chatbots.credits_purchased`. When Martin reports Stripe keys live: E2E 2.6 (success / decline / duplicate webhook must not double-grant -- idempotency is the `(provider, provider_ref)` unique index), revisit pricing.tsx "payment not live" disclosure + upgrade-page mock notes (auto-hide on `STRIPE_SECRET_KEY`). Still open from 2.7: expiry-sweep cron, chargeback clawback + suspend (`charge.dispute.created` in webhook), low-balance email, refund/ToS text. |
| 3 | Phase 3.5 E2E + CI | Port S51+S52 probe scripts into a committed suite; GitHub Actions (tsc, lint, build, E2E). Zero tests today. |
| 4 | Widen Phase 1 controls | Authenticated portal routes still unlimited; nonce-based CSP via middleware next. |
| 5 | ChatKit Voice (Cartesia Sonic-3) | Deferred. ~6h. |
| 0b | MarketKit B3 Dub go-live + Session B remainder | Gated on Martin task 4; runbook `command-center/MARKETKIT-SETUP.md` B3. Then B1 GA4/GSC + B5 dogfood onboarding. |
| 8 | Phase 8 UAE hosting migration (isHosting) | Post-launch. ~$85-125/mo verified. Plan SS8. |
| 9 | SignaKit portal section | Hidden for MVP. |
| 15 | SK Part B | Client-repo footer links -> mdntech.org/sk. mdntech.sk DONE (S66); **mdntech.com is NOT ours (third party -> mdntech.ca), the .com 301 is dead** (S68). |
| 16 | /sk copy loop | Rule that survives: all /sk copy lives in `constants/sk.ts` + `sk-case-studies.ts`; the bot is re-seeded AFTER the copy deploys, never before. Still awaiting user review on prod: the CRM two-column benefits block; the mobile section order is captured in `seo-audit/screenshots/sk_mobile_fullpage.png`. |

## Key Files

| File | Purpose |
|------|---------|
| `handoff.md` / `handoff-archive.md` | Live state (capped ~150 lines) / full history (never read on start) |
| `MindPalace/Projects/MDN-Tech/MDN-Tech-Launch-Plan-2026-08.md` | MASTER launch checklist (Phases 0-8) |
| `seo-audit/ACTION-PLAN.md` + `FULL-AUDIT-REPORT.md` | The SEO queue (22 items, all closed but #20/#22) + score/verdicts/GUARDRAILS -- read before any SEO or copy-adjacent change |
| `lib/portal/plans.ts` + `lib/portal/credits.ts` + `lib/payments/` | Billing source of truth (packs $ / unlocks in credits / hidden Enterprise) + the ONLY app-side ledger access + PaymentProvider/Stripe. Render `visibleCreditPacks()`, never `CREDIT_PACKS` |
| `PRODUCT.md` / `DESIGN.md` | Brand register + "Event Horizon" visual system. Read BOTH before any design or copy work |
| `app/base-layout.tsx` + `app/(en)|(sk)/layout.tsx` | The TWO root layouts -- exist only so /sk ships `lang="sk"`; keep them identical except `lang`; cross-locale nav = full page load |
| `lib/marketing/products.ts` | THE portal gate: `APP_LIVE` (default CLOSED), `appCta()`, `isAppHref()` -- grep APP_LIVE before adding any link to app.mdntech.org |
| `constants/sk.ts` + `sk-case-studies.ts` | ALL /sk copy + data AND the chatbot KB source -- edit here, then re-run `scripts/seed-sk-chatbot.mjs` (wipes Command Center KB edits; `--dry` to preview) |
| `public/widget.js` + `SkChatWidget.tsx` | Widget API base MUST resolve to the APEX (CORS preflight cannot follow the www 308); our pages load `/widget.js` relatively and TEAR IT DOWN on unmount -- never swap back to `next/script` |
| NEVER hard-code these | `lib/portal/plans.ts` (prices/allowances), `lib/marketing/toolkit-catalogue.ts` (skill counts), `lib/chat/rate-limit-rules.ts` (limiter numbers), `lib/marketing/links.ts` (`COMPANY_LEGAL_LINE`). Marketing copy interpolates from all four |
| `supabase/migrations/{020,022}.sql` | Security model + credit bank. Read BOTH before touching billing; ledger writes are service-role only, `credits_purchased` is retired legacy (do not read) |
