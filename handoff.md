# M.D.N Tech -- Handoff

<!-- HARD CAP ~150 lines. Max 2 session sections. Overflow -> handoff-archive.md (full pre-v3 history archived there 2026-07-17). -->

## Current State

- **Phase:** LAUNCH PLAN ACTIVE -- master checklist `MindPalace/Projects/MDN-Tech/MDN-Tech-Launch-Plan-2026-08.md` (MVP launch target ~31.08). **SEO action plan nearly cleared: S68 fixed Critical #1+#2 + quick wins, S69 closed #3, #8, #10-13, #16 (committed, NOT deployed)** -- remaining: #15 blog refresh bundle + low backlog (`seo-audit/ACTION-PLAN.md`). Portal still gated behind `APP_LIVE`.
- **Session count:** 69
- **Products:** TechKit LIVE (7 crons), MarketKit A+B-core LIVE (B3 Dub go-live pending), ChatKit live w/ credits-only mock checkout (Voice deferred), ToolKit public page live.

## Session Summary (last 10 -- full table + sessions 1-46 detail in handoff-archive.md)

| # | Date | Title |
|---|------|-------|
| 60 | 2026-08-15 | APP_LIVE portal gate + merge to main; website rebuild live on prod |
| 61 | 2026-08-15 | /sk realizacie refresh (4 projects, fresh captures) + SK footer on the EN shell |
| 62 | 2026-08-16 | ChatKit privacy disclosure (0c) -- /privacy Section 3 + stale-processor cleanup |
| 63 | 2026-08-16 | /sk rework built: CRM flagship + Kto sme + FAQ + Royal Stroje case study (feat/sk-rework, unmerged) |
| 64 | 2026-08-16 | /sk rework merged + LIVE; C3 UTM attribution; C2 SK chatbot live with branded widget |
| 65 | 2026-08-17 | Chatbot 400 fix (null conversationId) + final logo rolled out sitewide (C7) + new OG cards |
| 66 | 2026-08-18 | mdntech.sk live (C5) + widget www/CORS fix + SK legal pages + CRM section rebuild |
| 67 | 2026-08-19 | /sk copy pass (keyword H1, honest scope) + widget leak onto EN pages fixed |
| 68 | 2026-08-19 | SEO re-audit 76/100 + Critical #1/#2 fixed (blog images, lang=sk, hreflang, three.js off critical path) |
| 69 | 2026-08-19 | SEO action plan: #3, #8, #10-13, #16 closed; #16 finding corrected (RSC seed tree is architectural) |

## What Was Done (Session 68) -- SEO re-audit (76/100) + Critical #1/#2 and the quick wins fixed

- **Re-audit (0a2/C6) via 6 parallel subagents; all of `seo-audit/` regenerated**: FULL-AUDIT-REPORT.md (score 76/100, category table, handoff-verdicts table, do-not-do guardrails), ACTION-PLAN.md (22 items, the standing work queue), 6 specialist reports, 13 screenshots. `screenshots/sk_mobile_fullpage.png` captures the S67 mobile section order for Martin's pending review.
- **Blog images never existed** -- `/blog/*.jpg` were soft-404s breaking Article rich results. New `scripts/generate-blog-images.mjs` (same seeded OG-card composition; titles duplicated by design, sync on change) -> `public/blog/*.jpg`, wired as og:image/twitter:image. Blog dates now ISO (`published`/`updated` fields in `data/blog-posts.ts`) -- the old parser silently stamped TODAY on failure. Blog BreadcrumbList REMOVED (schema without a visible trail; re-add with the trail during the /blog/[slug] redesign, pattern = Royal Stroje).
- **Root layout split into `app/(en)/layout.tsx` + `app/(sk)/layout.tsx`** (shared shell `app/base-layout.tsx`) -- the only way Next can vary `<html lang>`; all four Slovak pages served `lang="en"` before. KEEP THE TWO IDENTICAL except `lang`. Cross-locale nav is now a full document load. Killed the user's RUNNING DEV SERVER to unlock the `app/` rename -- Martin: restart `npm run dev`.
- **hreflang for the legal pairs declared on BOTH sides** (EN server layouts + SK page metadata + sitemap). The S66 "use client blocks metadata" note was OUTDATED -- `app/(en)/(marketing)/privacy/layout.tsx` had already solved it; no page split was needed. Sitemap lastmods corrected from git (11/14 were stale); changefreq/priority dropped everywhere.
- **Critical #2: three.js (652 KB chunk) is out of EVERY page's blocking graph.** `LazyStarsCanvas` mounts the starfield at browser idle and SKIPS blog articles + legal pages entirely; `CosmicNebula` is dynamic(ssr:false). Verified: no built page references the three.js chunks. Never re-import `star-background` statically.
- **Hero entrances converted framer-motion -> CSS** (`.hero-enter-left/-up` in globals.css, all 6 hero variants) -- framer server-rendered the LCP h1 at inline opacity:0 until hydration (LCP 3.9-4.5s on 60ms TTFB). fill-mode is `backwards` ON PURPOSE: a forwards fill pins `transform` and eats framer hover gestures (/blog featured card).
- /about honesty: years-for-corporates 30+ -> 20+ (user call; 50+ contracts / 100+ partnerships confirmed correct by user). Dead Cedarville Cursive font removed. **mdntech.com is a THIRD PARTY (forwards to mdntech.ca)** -- the ".com 301" idea is dead.
- All verified in the `.next-verify` build output (lang, hreflang links, chunk graph, hero opacity, icons); `tsconfig.json` auto-rewrite reverted.

## What Was Done (Session 69) -- SEO action plan: #3, #8, #10-13, #16 closed

- Everything in the 0a5 "next by impact" queue except #15: blackhole double-fetch, /sk address schema, .sk deep-path redirects, mobile hero CTA order, widget/footer overlap, SK legal OG, over-serialization. Each carries a DONE note in `ACTION-PLAN.md`; all verified in the `.next-verify` build output, lint clean. **Committed, NOT deployed.**
- **The #16 finding was half-wrong; the correction is documented in ACTION-PLAN.** /toolkit's ~303 KB is Next's inlined RSC seed tree of the RENDERED page -- App Router ships it regardless of client boundaries, so it cannot shrink by restructuring; do NOT re-attempt. The real waste was /blog: client cards received full `BlogPost` objects, inlining every article's `content` in the index (~90 -> 62 KB) and two whole spare articles per article page.
- **New contract: client blog components take `BlogPostPreview`, never `BlogPost`** (`toPostPreview()` in `data/blog-posts.ts`). TS structural typing will NOT catch a full post passed where a preview is expected -- map explicitly at every call site.
- `Section` moved to the server half of the product-page primitives; only `SectionHeading` (animated h2/intro) is a client leaf. Keep that boundary.
- `BlackholeVideo` gained `lazy` (footer bookend only): poster `<img>` until IntersectionObserver proximity, so the hero's fetch is the only one at load. The img must stay the SAME URL as the poster attr (one cached file) -- the eslint-disable there is deliberate.
- mdntech.sk redirects now ADD the /sk prefix (pass-through rule above the catch-all prevents doubling). **Deploy + verify one .sk deep link on prod BEFORE the partner campaign.**
- `SK_NAP.address` (new) must stay in sync with `COMPANY_LEGAL_LINE`; the seed script does not read it, so no bot re-seed was needed.
- #13 was fixed with SK-footer clearance (`pr-20 sm:pr-0` on the bottom block) -- `widget.js` deliberately untouched (customer embeds share it).

## Martin's Tasks (detailed -- do these, then report back in chat)

0b. **Restart your dev server** -- S68 had to kill it (it held a lock on `app/(marketing)` during the root-layout split). If it 500s, delete `.next/` first. `.next-stale-1777403470/` can still be deleted via Explorer; `.next-verify/` stays (legitimate build-verify dir).

0. **EmailJS template: add attribution (5 min, blocks C3 payoff):** emailjs.com -> the contact template -> add a line `Zdroj: {{attribution}}` (optionally also `{{form_id}}`, `{{landing_page}}`). Until then the forms SEND the UTM data but the inbox never shows it. Also: review the SK chatbot's answers at admin.mdntech.org/chatbots/46ef0a99...; KB edits that should persist belong in `constants/sk.ts` + re-run `scripts/seed-sk-chatbot.mjs`.

1. **Stripe UAE activation (CRITICAL PATH, start this week):** dashboard.stripe.com -> create account for the FZE: trade license 7813, Emirates ID + residence visa, Wio account details. Verification takes 1-2 weeks and gates Phase 2 payments.
2. **Supabase auth email templates (10 min):** project `ijfgwzacaabzeknlpaff` -> Authentication -> Emails: copy each file from `supabase/email-templates/` (5 files) into the matching template Source, Save. Then URL Configuration: Site URL `https://app.mdntech.org`; Redirect URLs `https://app.mdntech.org/auth/callback` + `http://localhost:3000/auth/callback`.
3. **ChatKit cron secret + Resend key (5 min):** random 32+ char string -> Vercel env `CHATKIT_CRON_SECRET` (Production) + redeploy; confirm `RESEND_API_KEY` listed. Supabase SQL: `select vault.create_secret('<value>', 'chatkit_cron_secret');`
4. **Dub account for MarketKit B3 (10 min):** dub.co -> API key -> `.env.local` `DUB_API_KEY=dub_...` -> tell next session "Dub key ready".
5. **Browser E2E pass (15 min, after 2+3):** login at `localhost:3000/portal/login`, buy credit pack + unlock feature, thumbs-down + Auto-learning "Run now", Weekly reports "Run now" + check inbox.
6. **Ask Filip:** compliance answers (plan SS2.0b); confirm /sk FAQ #4 (staging-UAE/produkcia-EU wording + DPA) and #5 (governing law / vzorova zmluva) -- blocks campaign send, not the deploy.
7. **Royal Stroje founder input (blocks case-study completion, not deploy):** 2-3 measurable numbers, a 2-3 sentence quote + consent for name/photo/logo, confirm the Zadanie framing, and tell them their (sanitised) CRM screenshot is on our site (task 0a4). Goes into `constants/sk-case-studies.ts`.
8. **Royal Works tags (1 min):** /sk card ships Web / Lokalne SEO / Dizajn na mieru (inferred). Confirm or correct in chat.
9. **Founder card assets (2 min):** paste your personal LinkedIn URL in chat (fills `FOUNDER.linkedin`) and optionally drop a real photo over `public/team/1.jpg`. Also: claim the LinkedIn vanity slug `/company/mdntech` (C4, last SK-C item).
10. **Inviting a teammate (since S51):** Supabase SQL: `insert into team_invites (email, role) values ('kolega@mdntech.org', 'engineer');` then they sign up on that email. Confirm the ~50-credit signup promo grant number (plan SS3.1).

## What To Do Next -- ChatKit remaining work + SEO action plan

**Three tracks: Phase 2 credit bank (product), SEO action plan (marketing), launch gates.**

| Priority | Task | Status / Notes |
|----------|------|----------------|
| 0a5 | **SEO action plan remainder** | `seo-audit/ACTION-PLAN.md` -- S68 did 1-2, 4-7, 9, 14, 18; S69 did 3, 8, 10-13, 16. **First: deploy prod, then verify one mdntech.sk deep link (#10) -- gates the partner campaign.** Remaining: **#15 blog refresh bundle** (= the queued /blog/[slug] redesign: stale March claims, Person authorship + schema, outbound citations per the /toolkit pattern, visible breadcrumb + BreadcrumbList) + low backlog #17 tap targets, #19 /sk H1 `<br>` at 390px, #21 internal links, #22 real reviews post-launch. Guardrails in FULL-AUDIT-REPORT.md still apply. |
| 0a4 | **Royal Stroje consent for the CRM screenshot** | `public/portfolio/royal-crm-katalog.png` is LIVE on /sk (content pre-reviewed, overview redacted). Folds into Martin task 7. Pull by setting `SK_CRM_SCREENSHOT` back to `null` if they object. |
| 0a | **SK-C leftovers** | Only C4 LinkedIn vanity slug (Martin task 9) remains. Campaign gate: founder/Filip inputs resolved BEFORE the ~150 partner emails (early September) + fix ACTION-PLAN #10 first. |
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
| `seo-audit/ACTION-PLAN.md` + `FULL-AUDIT-REPORT.md` | The SEO work queue (22 items, S68) + score/verdicts/GUARDRAILS -- read before any SEO or copy-adjacent change |
| `PRODUCT.md` / `DESIGN.md` | Brand register + "Event Horizon" visual system. Read BOTH before any design or copy work |
| `app/base-layout.tsx` + `app/(en)|(sk)/layout.tsx` | The TWO root layouts -- exist only so /sk ships `lang="sk"`; keep them identical except `lang`; cross-locale nav = full page load |
| `lib/marketing/products.ts` | THE portal gate: `APP_LIVE` (default CLOSED), `appCta()`, `isAppHref()` -- grep APP_LIVE before adding any link to app.mdntech.org |
| `constants/sk.ts` + `sk-case-studies.ts` | ALL /sk copy + data AND the chatbot KB source -- edit here, then re-run `scripts/seed-sk-chatbot.mjs` (wipes Command Center KB edits; `--dry` to preview) |
| `public/widget.js` + `SkChatWidget.tsx` | Widget API base MUST resolve to the APEX (CORS preflight cannot follow the www 308); our pages load `/widget.js` relatively and TEAR IT DOWN on unmount -- never swap back to `next/script` |
| `components/main/lazy-stars-canvas.tsx` | The ONLY way the three.js starfield may load (idle-mounted, skipped on reading pages) -- never import `star-background` statically (S68 LCP fix) |
| `public/brand/README.md` | Logo source of truth + every surface the mark is wired into (favicons, OG cards, blog cards) and the regenerate commands |
| NEVER hard-code these | `lib/portal/plans.ts` (prices/allowances), `lib/marketing/toolkit-catalogue.ts` (skill counts), `lib/chat/rate-limit-rules.ts` (limiter numbers), `lib/marketing/links.ts` (`COMPANY_LEGAL_LINE`). Marketing copy interpolates from all four |
| `supabase/migrations/{020_security_fixpack,021_chatkit_hardening}.sql` | Security model. Read 020 before touching billing columns |
