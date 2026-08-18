# M.D.N Tech -- Handoff

<!-- HARD CAP ~150 lines. Max 2 session sections. Overflow -> handoff-archive.md (full pre-v3 history archived there 2026-07-17). -->

## Current State

- **Phase:** LAUNCH PLAN ACTIVE -- master checklist `MindPalace/Projects/MDN-Tech/MDN-Tech-Launch-Plan-2026-08.md` (MVP launch target ~31.08). **Website rebuild + /sk rework LIVE; mdntech.sk redirects live (C5 done); widget origin bug fixed (S66).** Portal still gated behind `APP_LIVE`. **`30d9766` is committed but UNPUSHED** -- user was deciding whether to wait for the CRM screenshot so the section deploys complete. Next: push decision, then SEO re-audit (0a2).
- **Session count:** 66
- **Products:** TechKit LIVE (7 crons), MarketKit A+B-core LIVE (B3 Dub go-live pending), ChatKit live w/ credits-only mock checkout (Voice deferred), ToolKit public page live.

## Session Summary (last 10 -- full table + sessions 1-46 detail in handoff-archive.md)

| # | Date | Title |
|---|------|-------|
| 57 | 2026-08-14 | Task 0 visual QA passed (sticky + 320px, footer fix) + 0a /about + blog honesty polish |
| 58 | 2026-08-14 | Hero rebuild: one full-viewport shell across /, /sk, /chatkit, /toolkit |
| 59 | 2026-08-14 | /about + /blog on hero shell; founder-forward team; constellation blog cards |
| 60 | 2026-08-15 | APP_LIVE portal gate + merge to main; website rebuild live on prod |
| 61 | 2026-08-15 | /sk realizacie refresh (4 projects, fresh captures) + SK footer on the EN shell |
| 62 | 2026-08-16 | ChatKit privacy disclosure (0c) -- /privacy Section 3 + stale-processor cleanup |
| 63 | 2026-08-16 | /sk rework built: CRM flagship + Kto sme + FAQ + Royal Stroje case study (feat/sk-rework, unmerged) |
| 64 | 2026-08-16 | /sk rework merged + LIVE; C3 UTM attribution; C2 SK chatbot live with branded widget |
| 65 | 2026-08-17 | Chatbot 400 fix (null conversationId) + final logo rolled out sitewide (C7) + new OG cards |
| 66 | 2026-08-18 | mdntech.sk live (C5) + widget www/CORS fix + SK legal pages + CRM section rebuild |

## What Was Done (Session 65) -- chatbot 400 fix + final logo rolled out sitewide (C7)

- **The SK chatbot never answered a single message, and it was not Claude.** `widget.js` sends `conversationId: null` on the first message; the schema had `UUID.optional()`, and zod `.optional()` rejects `null` -> 400 before the bot lookup. No conversation was ever created, so the id stayed null forever. Fixed server-side with `.nullish()` (cached widget.js copies in visitors' browsers keep sending null) plus the widget. Confirmed against prod. **Lesson: C2 shipped in S64 without one end-to-end conversation being clicked through.**
- **Favicon rebuilt twice before it was right.** First attempt used the S64 mark's simple variant (two disconnected arcs at 16px) on a TRANSPARENT background -- a dark mark sinks into a dark tab strip. A transparent favicon inherits whatever the browser paints behind it, so no single mark colour survives both light and dark chrome: the tile must be baked in. Second bug: `screenshot()` paints the page background unless `omitBackground: true`, which shipped white notches in the rounded corners.
- **User replaced the whole mark mid-session** (`public/brand/logo-final*.svg` + 27 PNG exports): the ORIGINAL logo vectorized, inner circle removed, mirrored L-R. The 2026-08-16 black-hole redesign is REJECTED (`mdn-mark*.svg` kept only for the record). Rolled out everywhere -- favicons (gradient on `#0B0A14` tile), OG cards (white), navbar/both footers/portal top bar, schema.org org logo (white-on-black plate, because search composites it onto backgrounds we do not control), widget `launcher_icon`.
- **New mark is ~1.7:1, not square.** Every old call site pinned 32x32 and would have squashed it -- all are now sized by height with `width: auto`. `next/image` needs `unoptimized` for SVG (the optimizer refuses it without `dangerouslyAllowSVG`).
- **New OG link-preview cards, EN + SK** (`scripts/generate-og-images.mjs`, seeded star field so the PNG is byte-stable across runs). Ring geometry is derived from `hero-shell.ts`, but the vertical offset deliberately does NOT follow the hero: the disk line sits flush with the top edge so only the lower bowl shows (user's call, cleaner at thumbnail size).
- **`public/logo.png` is now a copy of the new white export.** Nothing in the app reads it; it stays current because the LIVE chatbot's stored `widget_config` and external links still point there.
- Gotchas for next session: two Next processes cannot share `.next/` (a `npm run build` killed the user's dev server on :3000); the production CSP's `upgrade-insecure-requests` breaks `next start` over http://localhost, so local visual QA needs the CSP header stripped in Playwright.

## What Was Done (Session 66) -- mdntech.sk live, widget origin bug, SK legal pages + CRM rebuild

- **mdntech.sk + www LIVE, 308 -> mdntech.org/sk** (C5 done). Vercel's native domain redirect could NOT be used: it only maps a host to the SAME path, so the bare .sk would have landed on the English homepage. Rule lives in `next.config.js` `redirects()` with `has: [{type:"host"}]` -- redirects run BEFORE middleware, so .sk traffic never pays for a Supabase session refresh, and query strings forward so campaign UTMs survive. Websupport DNS: apex A `216.198.79.1`, www CNAME to the vercel-dns host; **the apex AAAA is the record people forget** -- leave it and IPv6 visitors keep hitting the parking page while IPv4 works.
- **The chatbot was invisible on /sk, and the same root cause silently broke CUSTOMER widgets.** The site canonicalised onto the apex and `www.mdntech.org` became a 308, but all three widget entry points still hard-coded www. (a) Our CSP is `script-src 'self'` and www is a separate ORIGIN to CSP, so the script was blocked outright. (b) Worse: the message POST sends `Content-Type: application/json` -> CORS preflight -> **browsers refuse to follow redirects on a preflight**, so OPTIONS on www returned 308 with no CORS headers. Verified on prod (www -> 308 no ACAO, apex -> 204 with it). Fix: `widget.js` now normalises www -> apex (repairs snippets ALREADY pasted into customer sites without them editing anything -- the script tag follows the redirect, gets the new file, and it points itself back), `SkChatWidget` loads `/widget.js` relatively, both embed snippets emit the apex. Verified end-to-end with a real streamed reply.
- **Task 0a3 done** -- SK bot re-seeded twice (new logo, then apex `launcher_icon`).
- **SK legal pages** at `/sk/ochrana-osobnych-udajov` + `/sk/obchodne-podmienky`, section numbering 1:1 with the English so the two can be diffed; English prevails on discrepancy (that clause was already in the EN pages). Built as STATIC server components on purpose -- the EN pages are `"use client"`, which is why they ship with no `metadata`/title/canonical. Shared shell in `components/legal/legal-primitives.tsx`. SK footer was pointing Slovak labels at the English documents.
- Two EN legal corrections made to keep the versions honestly in sync: sessionStorage campaign attribution (C3) was never disclosed in the cookie section, and the terms still named **Railway** as host instead of Supabase.
- **CRM section rebuilt** -- it was proving itself with a screenshot of the client's WEBSITE, which answers the wrong question. Now leads with six named modules matching a delivered system's menu; `SK_CRM_SCREENSHOT` is NULL-GATED so the section reads complete until the sanitised Command Center export lands.
- **Royal Stroje: new Lokálne SEO section** built only on what is verifiable in the live page source (LocalBusiness + geo + opening hours, FAQPage, locality-first title, NAP). Rankings deliberately NOT claimed -- user chose "describe the work only" over generic "popredné pozície".

## Martin's Tasks (detailed -- do these, then report back in chat)

0b. **Restart your dev server** -- a S65 `npm run build` overwrote `.next/` under it and it is serving 500s (`Cannot find module './9161.js'`). Not a code fault. Also delete `.next-verify/` (see task 14).

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
| 0 | **PUSH `30d9766` (decide first)** | Committed locally, NOT pushed -- CLAUDE.md forbids pushing unasked and the user had not answered. Open question put to them: push now, or wait so the CRM section ships WITH the screenshot in one deploy (I recommended waiting). Nothing else is in flight; tree is clean. |
| 0a4 | **CRM screenshot -> flip the gate** | Waiting on the user to export the Royal Command Center "Katalóg zariadení" view to `public/portfolio/royal-crm-katalog.png` (wide, >=1600px, rendered 16:9 cropped from top; no client/revenue data on screen -- machine names are already public on royalstroje.sk). Then set `SK_CRM_SCREENSHOT` in `constants/sk.ts` from `null` to `{src, alt, caption}` -- ONE line, the section already renders it. Worth Royal Stroje's OK first (folds into Martin task 7). |
| 0a5 | **Re-seed the SK chatbot AFTER the push** | `node --env-file=.env.local --experimental-strip-types scripts/seed-sk-chatbot.mjs`. Deliberately NOT run in S66: the KB now pulls `SK_CRM.modules` + `CS.localSeo`, which are not live until `30d9766` deploys -- re-seeding first would have the bot describing copy the site does not show. |
| 0a | **SK-C leftovers** | C2+C3 (S64), C7 (S65), C5 mdntech.sk (S66) all done. Remaining: C4 LinkedIn vanity slug (Martin), C6 /seo-audit (= 0a2). Campaign gate: founder/Filip inputs resolved BEFORE the ~150 partner emails (early September). |
| 0a2 | SEO re-audit (user wants SK copy edits FIRST) | `seo-audit/` is STALE (predates the rebuild). Clusters: /chatkit = "AI chatbot for website"; /toolkit = "Claude Code skills". Confirm S58 breadcrumb-schema removal is acceptable (case study now HAS a visible trail + schema -- the pattern to copy), re-check S60 `installUrl`/`availability` omissions. Queue `/blog/[slug]` redesign. **NEW in S66:** the EN/SK legal pages have NO hreflang pair -- hreflang must be declared on BOTH sides to count, and `/privacy` + `/terms` are `"use client"` so they cannot export metadata at all. Fixing means splitting them into a server wrapper + client body; that also gives them the title/canonical they currently lack. |
| 0d | **Open the portal (when ready)** | Set `NEXT_PUBLIC_APP_LIVE=true` in Vercel Production + redeploy. 0c DONE (S62); remaining gate is Phase 2 checkout + human legal read of /privacy. Verify built HTML has app links back, no "Coming soon" survives. |
| 1 | **Phase 2 credit bank (ChatKit billing rebuild)** | 2.1 account-level `credits_ledger` (append-only) + migrate balances; 2.4b unlocks re-priced in credits (conv 500 / analytics 750 / reports 1000 / learning 1250 / extra bot 1250); 3 mock-checkout routes (`app/api/portal/{chatbot/[id]/purchase,chatbot/[id]/feature,feature}/`) collapse into ONE credit purchase + ledger spends; 2.4 hidden Enterprise $999/40k + "Best value" on Scale; 2.7 policy build (12-mo expiry, refund window, chargeback clawback, 50-credit signup grant, low-balance email). `PaymentProvider` abstraction + Stripe test mode can start before Martin's live keys. Ledger: SELECT-only to `authenticated`, writes service-role; read migration 020 first. |
| 3 | Phase 3.5 E2E + CI | Port S51+S52 probe scripts into a committed suite; GitHub Actions (tsc, lint, build, E2E). Zero tests today. |
| 4 | Widen Phase 1 controls | Authenticated portal routes still unlimited; nonce-based CSP via middleware next. |
| 5 | ChatKit Voice (Cartesia Sonic-3) | Deferred. ~6h. |
| 0b | MarketKit B3 Dub go-live + Session B remainder | Gated on Martin task 4; runbook `command-center/MARKETKIT-SETUP.md` B3. Then B1 GA4/GSC + B5 dogfood onboarding. |
| 8 | Phase 8 UAE hosting migration (isHosting) | Post-launch. ~$85-125/mo verified. Plan SS8. |
| 9 | SignaKit portal section | Hidden for MVP. |
| 14 | Delete `.next-stale-1777403470/` + `.next-verify/` | Local only; safety hook blocks `rm -rf .*` -- delete via Explorer or `rmdir /s /q`. `.next-verify/` is a S65 leftover: two Next processes cannot share `.next/`, so local visual QA has to build into its own dir (both are gitignored). Worth a hook pattern fix to allow build dirs at the repo root. |
| 15 | SK Part B + domain 301 | Client-repo footer links -> mdntech.org/sk; `.com -> .org` 301 (mdntech.com is NOT on the Vercel project -- check where it is registered before assuming). mdntech.sk DONE in S66. |
| 16 | User wants further /sk copy edits | Stated at the end of S66, BEFORE the SEO audit runs. Nothing specified yet -- ask what they want changed. All /sk copy lives in `constants/sk.ts` + `sk-case-studies.ts`; re-seed the bot after (0a5). |

## Key Files

| File | Purpose |
|------|---------|
| `handoff.md` / `handoff-archive.md` | Live state (capped ~150 lines) / full history (never read on start) |
| `MindPalace/Projects/MDN-Tech/MDN-Tech-Launch-Plan-2026-08.md` | MASTER launch checklist (Phases 0-8) |
| `PRODUCT.md` / `DESIGN.md` | Brand register + "Event Horizon" visual system. Read BOTH before any design or copy work |
| `lib/marketing/products.ts` | THE portal gate: `APP_LIVE` (default CLOSED), `appCta()`, `isAppHref()` -- grep APP_LIVE before adding any link to app.mdntech.org |
| `constants/sk.ts` + `sk-case-studies.ts` | ALL /sk copy + data; `SK_PORTFOLIO` order = render order; case study carries the HONESTY GATE (founder numbers land there). ALSO the chatbot KB source -- edit here, then re-run the seed script |
| `scripts/seed-sk-chatbot.mjs` | Rebuilds the LIVE /sk bot (46ef0a99) KB from constants -- WIPES Command Center KB edits; `--dry` to preview |
| `public/brand/README.md` | Logo source of truth + a table of every surface the mark is wired into and how to regenerate it. Read before touching any logo |
| `scripts/generate-{favicons,og-images}.mjs` | Rebuild favicons / link-preview cards from `public/brand/*.svg`. Never hand-edit the PNGs they emit |
| `lib/marketing/attribution.ts` | First-touch UTM capture (C3). sessionStorage on purpose (no cookie banner) -- now disclosed in BOTH privacy pages; do not move to localStorage/cookies without updating them |
| `public/widget.js` + `SkChatWidget.tsx` | Widget API base MUST resolve to the APEX -- www is a 308 and a CORS preflight cannot follow a redirect. Our own pages load `/widget.js` relatively (`script-src 'self'`) |
| SK legal pages + `components/legal/legal-primitives.tsx` | `/sk/ochrana-osobnych-udajov` + `/sk/obchodne-podmienky` are translations of `/privacy` + `/terms`, numbered 1:1 -- EDIT BOTH LANGUAGES or you create the discrepancy the "English prevails" clause exists to resolve |
| `command-center/mdntech-sk-rework.md` | The /sk rework plan v1.0 -- done through C3 (S64); C4-C7 remain + acceptance criteria |
| NEVER hard-code these | `lib/portal/plans.ts` (prices/allowances), `lib/marketing/toolkit-catalogue.ts` (skill counts), `lib/chat/rate-limit-rules.ts` (limiter numbers), `lib/marketing/links.ts` (`COMPANY_LEGAL_LINE`). Marketing copy interpolates from all four |
| `supabase/migrations/{020_security_fixpack,021_chatkit_hardening}.sql` | Security model. Read 020 before touching billing columns |
