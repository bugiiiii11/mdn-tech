# M.D.N Tech -- Handoff

<!-- HARD CAP ~150 lines. Max 2 session sections. Overflow -> handoff-archive.md (full pre-v3 history archived there 2026-07-17). -->

## Current State

- **Phase:** LAUNCH PLAN ACTIVE -- master checklist `MindPalace/Projects/MDN-Tech/MDN-Tech-Launch-Plan-2026-08.md` (MVP launch target ~31.08). **SEO action plan CLOSED and DEPLOYED (S71):** case study final (founder story + quote), .sk deep-link redirect verified on prod, GSC live (sitemap 14 URLs, key pages requested). Campaign is TECHNICALLY ready -- remaining gates are EmailJS attribution + Filip FAQ answers. Portal still gated behind `APP_LIVE`.
- **Session count:** 71
- **Products:** TechKit LIVE (7 crons), MarketKit A+B-core LIVE (B3 Dub go-live pending), ChatKit live w/ credits-only mock checkout (Voice deferred), ToolKit public page live.

## Session Summary (last 10 -- full table + sessions 1-46 detail in handoff-archive.md)

| # | Date | Title |
|---|------|-------|
| 62 | 2026-08-16 | ChatKit privacy disclosure (0c) -- /privacy Section 3 + stale-processor cleanup |
| 63 | 2026-08-16 | /sk rework built: CRM flagship + Kto sme + FAQ + Royal Stroje case study (feat/sk-rework, unmerged) |
| 64 | 2026-08-16 | /sk rework merged + LIVE; C3 UTM attribution; C2 SK chatbot live with branded widget |
| 65 | 2026-08-17 | Chatbot 400 fix (null conversationId) + final logo rolled out sitewide (C7) + new OG cards |
| 66 | 2026-08-18 | mdntech.sk live (C5) + widget www/CORS fix + SK legal pages + CRM section rebuild |
| 67 | 2026-08-19 | /sk copy pass (keyword H1, honest scope) + widget leak onto EN pages fixed |
| 68 | 2026-08-19 | SEO re-audit 76/100 + Critical #1/#2 fixed (blog images, lang=sk, hreflang, three.js off critical path) |
| 69 | 2026-08-19 | SEO action plan: #3, #8, #10-13, #16 closed; #16 finding corrected (RSC seed tree is architectural) |
| 70 | 2026-08-19 | SEO action plan closed out: blog refresh (#15/#7), tap targets, /sk H1 wrap, internal links |
| 71 | 2026-08-20 | Royal Stroje case study final + DEPLOYED; GSC live; campaign technically ready |

## What Was Done (Session 70) -- SEO action plan closed out: #15, #17, #19, #21

- **The build queue in `ACTION-PLAN.md` is now EMPTY.** Only #20 (a tooling note, nothing to fix) and #22 (real ChatKit reviews, needs customers) remain. Committed, **NOT deployed** -- S69 and S70 are both still local.
- **#15 fixed the staleness class, not just the instance.** "Latest Features (March 2026)" -> "Beyond the Basics"; the version-pinned "Opus 4.6 with Effort Levels" subsection now describes what effort IS and links the docs, under a callout stating outright that the section does not track model versions. **Do not reintroduce a dated feature list** -- it goes stale in one release cycle. Both "coming soon" placeholders gone (the /blog pill became a ChatKit/ToolKit cross-link; the `isFullArticle` block was dead code).
- **Two blog claims were wrong, not merely uncited.** METR now states the real result (16 devs, ~19% slower) AND that METR has since labelled it historical; A2A is Linux-Foundation-governed, not "Google's". Everything else got attribution: SWE-bench, Claude Code docs, effort docs, API pricing, MCP, A2A, Hacken H1-2025 (the $3.1bn/$1.8bn/$263m figures), OpenZeppelin, Chainlink VRF, EIP-20/721/1155.
- **New contract:** citations ride on `ContentBlock.links` (+ `linksLabel`) in `data/blog-posts.ts` and render as a trailing "Source(s):" line via `BlockLinks` -- outside the block's own element, so a list stays a list. Add a citation with the claim, never after.
- **`AUTHOR` in `data/blog-posts.ts` must stay in sync by hand with `FOUNDER` in `constants/index.ts`** -- deliberately NOT imported: that module pulls react-icons into the blog client graph, which S69 had just trimmed. Article schema author is a Person (`jobTitle`, `worksFor`); no `sameAs` until `FOUNDER.linkedin` is real (Martin task 9).
- **#7 closed with #15:** visible breadcrumb + BreadcrumbList both built from `blogBreadcrumb()` -- one array, per the schema.ts rule. Remove the schema node if the trail ever goes.
- #17 tap targets: `inline-flex min-h-[24px] items-center` on footer `linkClass`, both breadcrumb trails, /toolkit "Source" links, shared code-block Copy. #19: the /sk H1's hard `<br>` became two `block` spans with `text-balance` -- **H1 copy untouched**, that guardrail stands. #21's finding was half-wrong (money->post deep links already existed); the missing direction was posts -> /toolkit, /chatkit, /about.
- Verified in `.next-verify`: Person + BreadcrumbList JSON-LD, breadcrumb nav, every citation URL, zero stale strings. tsc + lint clean; `tsconfig.json` auto-rewrite reverted (it happens on every build -- always check).

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

1. **Stripe UAE activation (CRITICAL PATH, start this week):** dashboard.stripe.com -> create account for the FZE: trade license 7813, Emirates ID + residence visa, Wio account details. Verification takes 1-2 weeks and gates Phase 2 payments.
2. **Supabase auth email templates (10 min):** project `ijfgwzacaabzeknlpaff` -> Authentication -> Emails: copy each file from `supabase/email-templates/` (5 files) into the matching template Source, Save. Then URL Configuration: Site URL `https://app.mdntech.org`; Redirect URLs `https://app.mdntech.org/auth/callback` + `http://localhost:3000/auth/callback`.
3. **ChatKit cron secret + Resend key (5 min):** random 32+ char string -> Vercel env `CHATKIT_CRON_SECRET` (Production) + redeploy; confirm `RESEND_API_KEY` listed. Supabase SQL: `select vault.create_secret('<value>', 'chatkit_cron_secret');`
4. **Dub account for MarketKit B3 (10 min):** dub.co -> API key -> `.env.local` `DUB_API_KEY=dub_...` -> tell next session "Dub key ready".
5. **Browser E2E pass (15 min, after 2+3):** login at `localhost:3000/portal/login`, buy credit pack + unlock feature, thumbs-down + Auto-learning "Run now", Weekly reports "Run now" + check inbox.
6. **Ask Filip:** compliance answers (plan SS2.0b); confirm /sk FAQ #4 (staging-UAE/produkcia-EU wording + DPA) and #5 (governing law / vzorova zmluva) -- blocks campaign send, not the deploy.
7. **GSC follow-up (~2026-08-24):** open Search Console -> Indexing -> Pages (is everything from the sitemap indexed?) + Performance (first query data). Delete the stale `www.mdntech.org/sitemap.xml` row (three-dots menu). Report findings in chat.
8. **Royal Works tags (1 min):** /sk card ships Web / Lokalne SEO / Dizajn na mieru (inferred). Confirm or correct in chat.
9. **Founder card assets (2 min):** paste your personal LinkedIn URL in chat (fills `FOUNDER.linkedin`) and optionally drop a real photo over `public/team/1.jpg`. Also: claim the LinkedIn vanity slug `/company/mdntech` (C4, last SK-C item).
10. **Inviting a teammate (since S51):** Supabase SQL: `insert into team_invites (email, role) values ('kolega@mdntech.org', 'engineer');` then they sign up on that email. Confirm the ~50-credit signup promo grant number (plan SS3.1).

## What To Do Next -- campaign gates + Phase 2 credit bank

**Three tracks: Phase 2 credit bank (product), campaign send-off (marketing), launch gates.**

| Priority | Task | Status / Notes |
|----------|------|----------------|
| 0a | **Campaign send-off gates** (~150 partner emails, early September) | Site + case study + GSC all DONE and verified (S71). Remaining: EmailJS attribution line (Martin 0), Filip FAQ #4/#5 (Martin 6), C4 LinkedIn vanity slug (Martin 9). Campaign plan: `MindPalace/Projects/MDN-Tech/Kampan-Royal-Stroje-2026-09.md`. |
| 0a6 | **GSC follow-up** (~2026-08-24, Martin task 7) | Coverage + Performance check; then optional: royalstroje.sk property (Websupport TXT -- data that could later back ranking claims in OUR voice in the case study), Bing import from GSC, GA4 (= plan B1). |
| 0d | **Open the portal (when ready)** | Set `NEXT_PUBLIC_APP_LIVE=true` in Vercel Production + redeploy. Remaining gate: Phase 2 checkout + human legal read of /privacy. Verify built HTML has app links back, no "Coming soon" survives. |
| 1 | **Phase 2 credit bank (ChatKit billing rebuild)** | 2.1 account-level `credits_ledger` (append-only) + migrate balances; 2.4b unlocks re-priced in credits (conv 500 / analytics 750 / reports 1000 / learning 1250 / extra bot 1250); 3 mock-checkout routes (`app/api/portal/{chatbot/[id]/purchase,chatbot/[id]/feature,feature}/`) collapse into ONE credit purchase + ledger spends; 2.4 hidden Enterprise $999/40k + "Best value" on Scale; 2.7 policy build (12-mo expiry, refund window, chargeback clawback, 50-credit signup grant, low-balance email). `PaymentProvider` abstraction + Stripe test mode can start before Martin's live keys. Ledger: SELECT-only to `authenticated`, writes service-role; read migration 020 first. |
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
| `data/blog-posts.ts` | ALL blog copy + the `ContentBlock.links` citation contract + `blogBreadcrumb()` (schema and visible trail share it) + `AUTHOR` (hand-synced with `FOUNDER`, never imported) |
| `PRODUCT.md` / `DESIGN.md` | Brand register + "Event Horizon" visual system. Read BOTH before any design or copy work |
| `app/base-layout.tsx` + `app/(en)|(sk)/layout.tsx` | The TWO root layouts -- exist only so /sk ships `lang="sk"`; keep them identical except `lang`; cross-locale nav = full page load |
| `lib/marketing/products.ts` | THE portal gate: `APP_LIVE` (default CLOSED), `appCta()`, `isAppHref()` -- grep APP_LIVE before adding any link to app.mdntech.org |
| `constants/sk.ts` + `sk-case-studies.ts` | ALL /sk copy + data AND the chatbot KB source -- edit here, then re-run `scripts/seed-sk-chatbot.mjs` (wipes Command Center KB edits; `--dry` to preview) |
| `public/widget.js` + `SkChatWidget.tsx` | Widget API base MUST resolve to the APEX (CORS preflight cannot follow the www 308); our pages load `/widget.js` relatively and TEAR IT DOWN on unmount -- never swap back to `next/script` |
| `components/main/lazy-stars-canvas.tsx` | The ONLY way the three.js starfield may load (idle-mounted, skipped on reading pages) -- never import `star-background` statically (S68 LCP fix) |
| `public/brand/README.md` | Logo source of truth + every surface the mark is wired into (favicons, OG cards, blog cards) and the regenerate commands |
| NEVER hard-code these | `lib/portal/plans.ts` (prices/allowances), `lib/marketing/toolkit-catalogue.ts` (skill counts), `lib/chat/rate-limit-rules.ts` (limiter numbers), `lib/marketing/links.ts` (`COMPANY_LEGAL_LINE`). Marketing copy interpolates from all four |
| `supabase/migrations/{020_security_fixpack,021_chatkit_hardening}.sql` | Security model. Read 020 before touching billing columns |
