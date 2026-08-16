# M.D.N Tech -- Handoff

<!-- HARD CAP ~150 lines. Max 2 session sections. Overflow -> handoff-archive.md (full pre-v3 history archived there 2026-07-17). -->

## Current State

- **Phase:** LAUNCH PLAN ACTIVE -- master checklist `MindPalace/Projects/MDN-Tech/MDN-Tech-Launch-Plan-2026-08.md` (MVP launch target ~31.08). **Website rebuild + /sk rework LIVE on prod (S64): SK-A/SK-B merged, C2 chatbot LIVE on /sk with branded widget, C3 attribution shipped.** Portal still gated behind `APP_LIVE`. Next: SEO re-audit (0a2, now unblocked), SK-C leftovers (C4 LinkedIn slug, C5 mdntech.sk, C7 logo rollout), Phase 2 credit bank.
- **Session count:** 64
- **Products:** TechKit LIVE (7 crons), MarketKit A+B-core LIVE (B3 Dub go-live pending), ChatKit live w/ credits-only mock checkout (Voice deferred), ToolKit public page live.

## Session Summary (last 10 -- full table + sessions 1-46 detail in handoff-archive.md)

| # | Date | Title |
|---|------|-------|
| 55 | 2026-08-12/13 | S54 fix pass completed (60/60) + adversarial re-verify: 37 new findings, unapplied |
| 56 | 2026-08-13 | S55 re-verify findings applied (36/37) + branch pushed; gate green |
| 57 | 2026-08-14 | Task 0 visual QA passed (sticky + 320px, footer fix) + 0a /about + blog honesty polish |
| 58 | 2026-08-14 | Hero rebuild: one full-viewport shell across /, /sk, /chatkit, /toolkit |
| 59 | 2026-08-14 | /about + /blog on hero shell; founder-forward team; constellation blog cards |
| 60 | 2026-08-15 | APP_LIVE portal gate + merge to main; website rebuild live on prod |
| 61 | 2026-08-15 | /sk realizacie refresh (4 projects, fresh captures) + SK footer on the EN shell |
| 62 | 2026-08-16 | ChatKit privacy disclosure (0c) -- /privacy Section 3 + stale-processor cleanup |
| 63 | 2026-08-16 | /sk rework built: CRM flagship + Kto sme + FAQ + Royal Stroje case study (feat/sk-rework, unmerged) |
| 64 | 2026-08-16 | /sk rework merged + LIVE; C3 UTM attribution; C2 SK chatbot live with branded widget |

## What Was Done (Session 64) -- /sk live on prod: merge, C3 attribution, C2 branded chatbot

- **/sk rework merged to main and LIVE** (ff-merge, then `12e3942` + `19628de` pushed). Merge-to-main was the user's explicit call over a preview branch, with FAQ #4/#5 still awaiting Filip -- campaign send stays gated, the deploy does not.
- **C3 attribution is FIRST-TOUCH via sessionStorage** (`lib/marketing/attribution.ts`): the capture is mounted in the MARKETING LAYOUT, not the forms -- the campaign lands on the case-study page which has no form, and a form-level capture recorded those visitors as "direct" (caught by probe). sessionStorage deliberately: not a cookie, so /privacy stays truthful. **GAP: EmailJS template must gain a `{{attribution}}` line or the data never reaches the inbox** -- Martin task.
- **C2 chatbot LIVE on /sk + case study** (bot `46ef0a99`, owner-less BY DESIGN: owner-less = internal = metered by `INTERNAL_BOT_DAILY_RULE` instead of customer credits; `allowed_domains` is then the only theft guard -- never leave it empty). `NEXT_PUBLIC_SK_CHATBOT_ID` set via Vercel API (production+preview); widget renders nothing without it.
- **KB anti-drift contract:** `scripts/seed-sk-chatbot.mjs` REBUILDS the whole KB from `constants/sk.ts` -- Command Center KB edits are wiped by a re-run. Lasting copy changes go in constants + re-seed; `--dry` prints without writing.
- **Widget branding is per-bot config, sellable to customers:** `launcher_icon` (https img in bubble + header), `secondary_color` (gradient), `input_placeholder` (non-EN bots). Config route validates all three (hex/https) because the widget splices them into CSS/img src; `primary_color` was passed through RAW before -- now validated too. Placeholder set as DOM property, never concatenated (esc() covers element text, not attributes).
- **`WidgetConfigForm` saves `widget_config` WHOLESALE** -- any new widget field must be added to the form state or saving the form silently erases it. Rule now documented in the form.
- User dropped redrawn logo vectors in `public/brand/` (see its README) + added plan task C7: roll out sitewide. Widget keeps white `logo.png` -- the new gradient mark would vanish on the purple bubble; C7 needs a white variant for the widget.

## What Was Done (Session 63) -- /sk rework: CRM flagship + trust + Royal Stroje case study

- **Task 0a built and committed on `feat/sk-rework` (`7eab7b4`), gate green -- NOT merged, NOT pushed.** SK-A AND SK-B from `command-center/mdntech-sk-rework.md` v1.0 in one pass: SkCrm (#crm), SkAbout (#kto-sme), SkFaq (#faq, 8 entries), CRM in title/description/keywords/hero/serviceType, nav = Sluzby/CRM/Referencie/Kto sme/FAQ/Kontakt, RS portfolio card -> flagship linking to the new `/sk/referencie/royal-stroje` page (static, Article + BreadcrumbList from the visible trail, in sitemap).
- **"Smart Drobne" is BANNED from all copy (user decision 2026-08-16).** Approved framing: "projektovy manazer v CSOB banke v oblasti mobilneho bankovnictva" (SkAbout + FAQ #1). Name spelled "Martin Jerabek" with hacek (matches /about) even though the plan wrote it unaccented.
- **Case study honesty gate:** Vysledky + founder quote sections deliberately ABSENT -- they land in `constants/sk-case-studies.ts` (gate comment there) once the RS founder supplies numbers, quote and photo/logo consent. Zadanie copy is goal-framed to avoid asserting the client's prior state; still confirm with the founder before the campaign.
- FAQ #4 (hosting/GDPR) + #5 (contract) ship the plan's safe draft -- **Filip must confirm wording before the ~150 partner emails go out (early September)**. Shared `FaqEntry` gained optional `bullets` (rendered + folded into `faqAnswerText()` per the anti-drift contract) for the VAT-payer/non-payer invoicing answer.
- **All `linkedin.com/company/mdntech/` links were DEAD (slug never claimed) -- replaced sitewide** (EN+SK footers, contact, org schema, llms.txt, /sk schema) with the real `/company/111977261`. Swap back only after Martin claims the vanity slug (plan C4).
- QA: overflowX=0 at 1280+375 on both pages, one h1 each, zero console errors, FAQPage/Article/BreadcrumbList all emitted (probe script pattern: temp copy into `scripts/` so ESM finds playwright, `channel: "chrome"`).
- **SK-C remainder NOT done:** C2 ChatKit widget on /sk (gated on launch readiness), C3 UTM->lead payload in the contact form, C5 mdntech.sk purchase + 301, C6 /seo-audit after deploy.

## Martin's Tasks (detailed -- do these, then report back in chat)

0. **EmailJS template: add attribution (5 min, blocks C3 payoff):** emailjs.com -> the contact template -> add a line `Zdroj: {{attribution}}` (optionally also `{{form_id}}`, `{{landing_page}}`). Until then the forms SEND the UTM data but the inbox never shows it. Also: review the SK chatbot's answers at admin.mdntech.org/chatbots/46ef0a99... -- it is LIVE on /sk now; KB edits that should persist belong in `constants/sk.ts` + re-run `scripts/seed-sk-chatbot.mjs` (Command Center edits are wiped by a re-seed).
1. **Stripe UAE activation (CRITICAL PATH, start this week):** dashboard.stripe.com -> create account for the FZE: trade license 7813, Emirates ID + residence visa, Wio account details. Verification takes 1-2 weeks and gates Phase 2 payments.
2. **Supabase auth email templates (10 min):** project `ijfgwzacaabzeknlpaff` -> Authentication -> Emails: copy each file from `supabase/email-templates/` (5 files) into the matching template Source, Save. Then URL Configuration: Site URL `https://app.mdntech.org`; Redirect URLs `https://app.mdntech.org/auth/callback` + `http://localhost:3000/auth/callback`.
3. **ChatKit cron secret + Resend key (5 min):** random 32+ char string -> Vercel env `CHATKIT_CRON_SECRET` (Production) + redeploy; confirm `RESEND_API_KEY` listed. Supabase SQL: `select vault.create_secret('<value>', 'chatkit_cron_secret');`
4. **Dub account for MarketKit B3 (10 min):** dub.co -> API key -> `.env.local` `DUB_API_KEY=dub_...` -> tell next session "Dub key ready".
5. **Browser E2E pass (15 min, after 2+3):** login at `localhost:3000/portal/login`, buy credit pack + unlock feature, thumbs-down + Auto-learning "Run now", Weekly reports "Run now" + check inbox.
6. **Ask Filip:** compliance answers (plan SS2.0b); **NEW: confirm /sk FAQ #4 (staging-UAE/produkcia-EU wording + DPA) and #5 (governing law / vzorova zmluva)** -- blocks campaign send, not the deploy.
7. **Royal Stroje founder input (blocks case-study completion, not deploy):** 2-3 measurable numbers (dopyty/mesiac, usetrene hodiny...), a 2-3 sentence quote + consent for name/photo/logo, and confirm the Zadanie framing. Goes into `constants/sk-case-studies.ts`.
8. **Royal Works tags (1 min):** /sk card ships Web / Lokalne SEO / Dizajn na mieru (inferred). Confirm or correct in chat.
9. **Founder card assets (2 min):** paste your personal LinkedIn URL in chat (fills `FOUNDER.linkedin` -- the /sk Kto sme + /about buttons appear automatically) and optionally drop a real photo over `public/team/1.jpg`. Also: claim the LinkedIn vanity slug `/company/mdntech` when convenient (links currently use the numeric ID).
10. **Inviting a teammate (since S51):** Supabase SQL: `insert into team_invites (email, role) values ('kolega@mdntech.org', 'engineer');` then they sign up on that email. Confirm the ~50-credit signup promo grant number (plan SS3.1).

## What To Do Next -- ChatKit remaining work

**Two tracks: Phase 2 credit bank (product) and the website/SEO rebuild (marketing).**

| Priority | Task | Status / Notes |
|----------|------|----------------|
| 0a | **SK-C leftovers** | C2+C3 DONE and live (S64). Remaining: C4 LinkedIn vanity slug (Martin), C5 mdntech.sk purchase + 301, C6 /seo-audit (= 0a2), C7 redrawn-logo rollout from `public/brand/` (see its README; widget needs a white variant). Campaign gate: founder/Filip inputs resolved BEFORE the ~150 partner emails (early September). |
| 0a2 | SEO re-audit (UNBLOCKED -- /sk is live) | `seo-audit/` is STALE (predates the rebuild). Clusters: /chatkit = "AI chatbot for website"; /toolkit = "Claude Code skills". Confirm S58 breadcrumb-schema removal is acceptable (case study now HAS a visible trail + schema -- the pattern to copy), re-check S60 `installUrl`/`availability` omissions. Queue `/blog/[slug]` redesign. |
| 0d | **Open the portal (when ready)** | Set `NEXT_PUBLIC_APP_LIVE=true` in Vercel Production + redeploy. 0c DONE (S62); remaining gate is Phase 2 checkout + human legal read of /privacy. Verify built HTML has app links back, no "Coming soon" survives. |
| 1 | **Phase 2 credit bank (ChatKit billing rebuild)** | 2.1 account-level `credits_ledger` (append-only) + migrate balances; 2.4b unlocks re-priced in credits (conv 500 / analytics 750 / reports 1000 / learning 1250 / extra bot 1250); 3 mock-checkout routes (`app/api/portal/{chatbot/[id]/purchase,chatbot/[id]/feature,feature}/`) collapse into ONE credit purchase + ledger spends; 2.4 hidden Enterprise $999/40k + "Best value" on Scale; 2.7 policy build (12-mo expiry, refund window, chargeback clawback, 50-credit signup grant, low-balance email). `PaymentProvider` abstraction + Stripe test mode can start before Martin's live keys. Ledger: SELECT-only to `authenticated`, writes service-role; read migration 020 first. |
| 3 | Phase 3.5 E2E + CI | Port S51+S52 probe scripts into a committed suite; GitHub Actions (tsc, lint, build, E2E). Zero tests today. |
| 4 | Widen Phase 1 controls | Authenticated portal routes still unlimited; nonce-based CSP via middleware next. |
| 5 | ChatKit Voice (Cartesia Sonic-3) | Deferred. ~6h. |
| 0b | MarketKit B3 Dub go-live + Session B remainder | Gated on Martin task 4; runbook `command-center/MARKETKIT-SETUP.md` B3. Then B1 GA4/GSC + B5 dogfood onboarding. |
| 8 | Phase 8 UAE hosting migration (isHosting) | Post-launch. ~$85-125/mo verified. Plan SS8. |
| 9 | SignaKit portal section | Hidden for MVP. |
| 14 | Delete `.next-stale-1777403470/` | Local only; safety hook blocks `rm -rf .*` -- delete via Explorer or `rmdir /s /q`. |
| 15 | SK Part B + domain 301 | Client-repo footer links -> mdntech.org/sk; `.com -> .org` 301. (mdntech.sk purchase folded into 0a SK-C.) |

## Key Files

| File | Purpose |
|------|---------|
| `handoff.md` / `handoff-archive.md` | Live state (capped ~150 lines) / full history (never read on start) |
| `MindPalace/Projects/MDN-Tech/MDN-Tech-Launch-Plan-2026-08.md` | MASTER launch checklist (Phases 0-8) |
| `PRODUCT.md` / `DESIGN.md` | Brand register + "Event Horizon" visual system. Read BOTH before any design or copy work |
| `lib/marketing/products.ts` | THE portal gate: `APP_LIVE` (default CLOSED), `appCta()`, `isAppHref()` -- grep APP_LIVE before adding any link to app.mdntech.org |
| `constants/sk.ts` + `sk-case-studies.ts` | ALL /sk copy + data; `SK_PORTFOLIO` order = render order; case study carries the HONESTY GATE (founder numbers land there). ALSO the chatbot KB source -- edit here, then re-run the seed script |
| `scripts/seed-sk-chatbot.mjs` | Rebuilds the LIVE /sk bot (46ef0a99) KB from constants -- WIPES Command Center KB edits; `--dry` to preview |
| `lib/marketing/attribution.ts` | First-touch UTM capture (C3). sessionStorage on purpose (no cookie banner) -- do not move to localStorage/cookies without updating /privacy |
| `command-center/mdntech-sk-rework.md` | The /sk rework plan v1.0 -- done through C3 (S64); C4-C7 remain + acceptance criteria |
| NEVER hard-code these | `lib/portal/plans.ts` (prices/allowances), `lib/marketing/toolkit-catalogue.ts` (skill counts), `lib/chat/rate-limit-rules.ts` (limiter numbers), `lib/marketing/links.ts` (`COMPANY_LEGAL_LINE`). Marketing copy interpolates from all four |
| `supabase/migrations/{020_security_fixpack,021_chatkit_hardening}.sql` | Security model. Read 020 before touching billing columns |
