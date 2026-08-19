# M.D.N Tech -- Handoff

<!-- HARD CAP ~150 lines. Max 2 session sections. Overflow -> handoff-archive.md (full pre-v3 history archived there 2026-07-17). -->

## Current State

- **Phase:** LAUNCH PLAN ACTIVE -- master checklist `MindPalace/Projects/MDN-Tech/MDN-Tech-Launch-Plan-2026-08.md` (MVP launch target ~31.08). **Website rebuild + /sk rework LIVE; mdntech.sk redirects live (C5 done).** Portal still gated behind `APP_LIVE`. **Everything through S67 is PUSHED, LIVE and verified on prod** (`d2e1bd5`): the /sk copy pass, the section resequence and the chat-widget teardown fix; bot re-seeded from the new copy and answered a live question correctly. **Next session = the SEO re-audit (0a2), user's explicit call.**
- **Session count:** 67
- **Products:** TechKit LIVE (7 crons), MarketKit A+B-core LIVE (B3 Dub go-live pending), ChatKit live w/ credits-only mock checkout (Voice deferred), ToolKit public page live.

## Session Summary (last 10 -- full table + sessions 1-46 detail in handoff-archive.md)

| # | Date | Title |
|---|------|-------|
| 58 | 2026-08-14 | Hero rebuild: one full-viewport shell across /, /sk, /chatkit, /toolkit |
| 59 | 2026-08-14 | /about + /blog on hero shell; founder-forward team; constellation blog cards |
| 60 | 2026-08-15 | APP_LIVE portal gate + merge to main; website rebuild live on prod |
| 61 | 2026-08-15 | /sk realizacie refresh (4 projects, fresh captures) + SK footer on the EN shell |
| 62 | 2026-08-16 | ChatKit privacy disclosure (0c) -- /privacy Section 3 + stale-processor cleanup |
| 63 | 2026-08-16 | /sk rework built: CRM flagship + Kto sme + FAQ + Royal Stroje case study (feat/sk-rework, unmerged) |
| 64 | 2026-08-16 | /sk rework merged + LIVE; C3 UTM attribution; C2 SK chatbot live with branded widget |
| 65 | 2026-08-17 | Chatbot 400 fix (null conversationId) + final logo rolled out sitewide (C7) + new OG cards |
| 66 | 2026-08-18 | mdntech.sk live (C5) + widget www/CORS fix + SK legal pages + CRM section rebuild |
| 67 | 2026-08-19 | /sk copy pass (keyword H1, honest scope) + widget leak onto EN pages fixed |

## What Was Done (Session 66) -- mdntech.sk live, widget origin bug, SK legal pages + CRM rebuild

- **mdntech.sk + www LIVE, 308 -> mdntech.org/sk** (C5 done). Vercel's native domain redirect could NOT be used: it only maps a host to the SAME path, so the bare .sk would have landed on the English homepage. Rule lives in `next.config.js` `redirects()` with `has: [{type:"host"}]` -- redirects run BEFORE middleware, so .sk traffic never pays for a Supabase session refresh, and query strings forward so campaign UTMs survive. Websupport DNS: apex A `216.198.79.1`, www CNAME to the vercel-dns host; **the apex AAAA is the record people forget** -- leave it and IPv6 visitors keep hitting the parking page while IPv4 works.
- **The chatbot was invisible on /sk, and the same root cause silently broke CUSTOMER widgets.** The site canonicalised onto the apex and `www.mdntech.org` became a 308, but all three widget entry points still hard-coded www. (a) Our CSP is `script-src 'self'` and www is a separate ORIGIN to CSP, so the script was blocked outright. (b) Worse: the message POST sends `Content-Type: application/json` -> CORS preflight -> **browsers refuse to follow redirects on a preflight**, so OPTIONS on www returned 308 with no CORS headers. Verified on prod (www -> 308 no ACAO, apex -> 204 with it). Fix: `widget.js` now normalises www -> apex (repairs snippets ALREADY pasted into customer sites without them editing anything -- the script tag follows the redirect, gets the new file, and it points itself back), `SkChatWidget` loads `/widget.js` relatively, both embed snippets emit the apex. Verified end-to-end with a real streamed reply.
- **Task 0a3 done** -- SK bot re-seeded twice (new logo, then apex `launcher_icon`).
- **SK legal pages** at `/sk/ochrana-osobnych-udajov` + `/sk/obchodne-podmienky`, section numbering 1:1 with the English so the two can be diffed; English prevails on discrepancy (that clause was already in the EN pages). Built as STATIC server components on purpose -- the EN pages are `"use client"`, which is why they ship with no `metadata`/title/canonical. Shared shell in `components/legal/legal-primitives.tsx`. SK footer was pointing Slovak labels at the English documents.
- Two EN legal corrections made to keep the versions honestly in sync: sessionStorage campaign attribution (C3) was never disclosed in the cookie section, and the terms still named **Railway** as host instead of Supabase.
- **CRM section rebuilt** -- it was proving itself with a screenshot of the client's WEBSITE, which answers the wrong question. Now leads with six named modules matching a delivered system's menu; `SK_CRM_SCREENSHOT` is NULL-GATED so the section reads complete until the sanitised Command Center export lands.
- **All of the above is LIVE** (`dea616a`): user supplied the 1920x1080 Command Center capture, gate flipped, deployed and verified on prod (screenshot + caption render, both legal pages 200, local SEO section present). Bot re-seeded LAST, after the deploy, and confirmed with a live question -- it now names all six CRM modules.
- **Royal Stroje: new Lokálne SEO section** built only on what is verifiable in the live page source (LocalBusiness + geo + opening hours, FAQPage, locality-first title, NAP). Rankings deliberately NOT claimed -- user chose "describe the work only" over generic "popredné pozície".

## What Was Done (Session 67) -- /sk copy pass + the chat widget leaking onto the English site

- **The widget bug is the one worth remembering.** `widget.js` appends `#mdn-chat-widget` straight to `document.body`, which no React tree owns -- so the footer's "English" link (a client-side `<Link href="/">`) carried the Slovak bot onto the English pages, which have no bot. A direct load of mdntech.org was always clean, which is why it looked like an English-page bug and is not. `next/script` cannot fix either half: it does not remove injected DOM, and it will not re-execute a cached script when the visitor navigates back. `SkChatWidget` is now a client component that injects and removes its own `<script>`; `widget.js` bails out of `init()` when `script.isConnected` is false, so an in-flight `/config` fetch cannot re-mount the bubble after teardown. Customer embeds never take that branch -- their tag stays connected. Verified on prod: mounts on /sk, gone on /, back again on return.
- **Copy pass over all of /sk, driven by the user reading it as a business owner.** H1 is now keyword-led ("Web, CRM a AI chatboty / pre rast vášho biznisu"); the 7xl step is held back to `xl` because the longer line wraps to three lines at 1024-1279px. "prescanujeme" is gone (not standard Slovak, and older owners will not parse it).
- **Two honesty edits the user insisted on, both worth keeping as rules.** "Web na mieru" now says plainly that supplying texts and graphics is cheaper and faster, but that we cover design, identity and copy when the client has none -- the old "nemusíte nič dodávať" begged the question of where the texts come from. And "Reálne výsledky" carries NO project count and no claim that anything but the websites is clickable: the reference list keeps growing, the CRM is behind a client login, and the four Slovak sites are not the whole company (foreign projects are named in one clause instead).
- Also toned down: no comparison to "konkurenčné IT firmy", blockchain out of the team card (reads as crypto to an SME owner). Process step 02 names its deliverable instead of repeating the value-ladder wording.
- **Realizácie moved BELOW Prečo my** -- the claims now come first and the live sites back them, instead of proof arriving before the argument.
- **CRM section lost its royalstroje.sk reference card** (data, render and chatbot KB): it described the whole delivery (web + SEO + chatbot) in the middle of a CRM argument. The case study stays linked from Realizácie, which the prod check confirms.
- **`NEXT_DIST_DIR` in `next.config.js`** finally kills the recurring "build killed my dev server" trap: `NEXT_DIST_DIR=.next-verify npm run build` verifies without touching `.next/`. Unset on Vercel, so the default holds. Note the build rewrites `tsconfig.json` (adds the distDir types path + reformats) -- revert that file before committing.
- Bot re-seeded AFTER the deploy and asked a live question covering both new answers; it described the texts/design offer and the calendar correctly.

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
| 0a4 | **Royal Stroje consent for the CRM screenshot** | `public/portfolio/royal-crm-katalog.png` is LIVE on /sk. Content was reviewed before publishing (equipment names, categories, day rates, stock -- all already public on royalstroje.sk; overview panel redacted; no client names or revenue). Still worth telling Royal Stroje their internal system is on our site -- folds into Martin task 7. Pull it by setting `SK_CRM_SCREENSHOT` back to `null` if they object; the section reads complete without it. |
| 0a | **SK-C leftovers** | C2+C3 (S64), C7 (S65), C5 mdntech.sk (S66) all done. Remaining: C4 LinkedIn vanity slug (Martin), C6 /seo-audit (= 0a2). Campaign gate: founder/Filip inputs resolved BEFORE the ~150 partner emails (early September). |
| 0a2 | **SEO re-audit -- START HERE next session** (user's call at the end of S67; the SK copy edits that were blocking it are done) | `seo-audit/` is STALE (predates the rebuild). Clusters: /chatkit = "AI chatbot for website"; /toolkit = "Claude Code skills". Confirm S58 breadcrumb-schema removal is acceptable (case study now HAS a visible trail + schema -- the pattern to copy), re-check S60 `installUrl`/`availability` omissions. Queue `/blog/[slug]` redesign. **From S66:** the EN/SK legal pages have NO hreflang pair -- hreflang must be declared on BOTH sides to count, and `/privacy` + `/terms` are `"use client"` so they cannot export metadata at all. Fixing means splitting them into a server wrapper + client body; that also gives them the title/canonical they currently lack. **From S67:** /sk H1 and the "Čo robíme" H2 now carry the head keywords, so re-measure against the CURRENT page -- audit any recommendation that asks to change them again. |
| 0d | **Open the portal (when ready)** | Set `NEXT_PUBLIC_APP_LIVE=true` in Vercel Production + redeploy. 0c DONE (S62); remaining gate is Phase 2 checkout + human legal read of /privacy. Verify built HTML has app links back, no "Coming soon" survives. |
| 1 | **Phase 2 credit bank (ChatKit billing rebuild)** | 2.1 account-level `credits_ledger` (append-only) + migrate balances; 2.4b unlocks re-priced in credits (conv 500 / analytics 750 / reports 1000 / learning 1250 / extra bot 1250); 3 mock-checkout routes (`app/api/portal/{chatbot/[id]/purchase,chatbot/[id]/feature,feature}/`) collapse into ONE credit purchase + ledger spends; 2.4 hidden Enterprise $999/40k + "Best value" on Scale; 2.7 policy build (12-mo expiry, refund window, chargeback clawback, 50-credit signup grant, low-balance email). `PaymentProvider` abstraction + Stripe test mode can start before Martin's live keys. Ledger: SELECT-only to `authenticated`, writes service-role; read migration 020 first. |
| 3 | Phase 3.5 E2E + CI | Port S51+S52 probe scripts into a committed suite; GitHub Actions (tsc, lint, build, E2E). Zero tests today. |
| 4 | Widen Phase 1 controls | Authenticated portal routes still unlimited; nonce-based CSP via middleware next. |
| 5 | ChatKit Voice (Cartesia Sonic-3) | Deferred. ~6h. |
| 0b | MarketKit B3 Dub go-live + Session B remainder | Gated on Martin task 4; runbook `command-center/MARKETKIT-SETUP.md` B3. Then B1 GA4/GSC + B5 dogfood onboarding. |
| 8 | Phase 8 UAE hosting migration (isHosting) | Post-launch. ~$85-125/mo verified. Plan SS8. |
| 9 | SignaKit portal section | Hidden for MVP. |
| 14 | Delete `.next-stale-1777403470/` | Local only, gitignored; safety hook blocks `rm -rf .*` -- delete via Explorer or `rmdir /s /q`. **`.next-verify/` is now legitimate, keep it**: S67 added `NEXT_DIST_DIR` to next.config.js, so `NEXT_DIST_DIR=.next-verify npm run build` is the supported way to verify a build while the dev server holds `.next/`. |
| 15 | SK Part B + domain 301 | Client-repo footer links -> mdntech.org/sk; `.com -> .org` 301 (mdntech.com is NOT on the Vercel project -- check where it is registered before assuming). mdntech.sk DONE in S66. |
| 16 | /sk copy: DONE in S67, but the loop stays open | Rule that survives: all /sk copy lives in `constants/sk.ts` + `sk-case-studies.ts`, and the bot is **re-seeded AFTER the copy deploys**, never before -- the KB is built from those same constants, so seeding first leaves the bot describing a page the site does not show yet: `node --env-file=.env.local --experimental-strip-types scripts/seed-sk-chatbot.mjs` (`--dry` to preview). Not yet reviewed by the user on prod: the two-column benefits block in the CRM section and the new section order on mobile. |

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
| `public/widget.js` + `SkChatWidget.tsx` | Widget API base MUST resolve to the APEX -- www is a 308 and a CORS preflight cannot follow a redirect. Our own pages load `/widget.js` relatively (`script-src 'self'`) and TEAR THE SCRIPT DOWN on unmount; `init()` aborts if its tag is gone. Never swap that back to `next/script` -- the bubble leaks onto the English pages |
| SK legal pages + `components/legal/legal-primitives.tsx` | `/sk/ochrana-osobnych-udajov` + `/sk/obchodne-podmienky` are translations of `/privacy` + `/terms`, numbered 1:1 -- EDIT BOTH LANGUAGES or you create the discrepancy the "English prevails" clause exists to resolve |
| `command-center/mdntech-sk-rework.md` | The /sk rework plan v1.0 -- done through C3 (S64); C4-C7 remain + acceptance criteria |
| NEVER hard-code these | `lib/portal/plans.ts` (prices/allowances), `lib/marketing/toolkit-catalogue.ts` (skill counts), `lib/chat/rate-limit-rules.ts` (limiter numbers), `lib/marketing/links.ts` (`COMPANY_LEGAL_LINE`). Marketing copy interpolates from all four |
| `supabase/migrations/{020_security_fixpack,021_chatkit_hardening}.sql` | Security model. Read 020 before touching billing columns |
