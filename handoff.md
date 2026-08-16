# M.D.N Tech -- Handoff

<!-- HARD CAP ~150 lines. Max 2 session sections. Overflow -> handoff-archive.md (full pre-v3 history archived there 2026-07-17). -->

## Current State

- **Phase:** LAUNCH PLAN ACTIVE -- master checklist `MindPalace/Projects/MDN-Tech/MDN-Tech-Launch-Plan-2026-08.md` (MVP launch target ~31.08). **Website rebuild + /sk rework LIVE on prod; SK chatbot now actually answers (S65 fix); final logo + new OG cards live sitewide (C7 done).** Portal still gated behind `APP_LIVE`. Next: SEO re-audit (0a2), SK-C leftovers (C4 LinkedIn slug, C5 mdntech.sk), Phase 2 credit bank.
- **Session count:** 65
- **Products:** TechKit LIVE (7 crons), MarketKit A+B-core LIVE (B3 Dub go-live pending), ChatKit live w/ credits-only mock checkout (Voice deferred), ToolKit public page live.

## Session Summary (last 10 -- full table + sessions 1-46 detail in handoff-archive.md)

| # | Date | Title |
|---|------|-------|
| 56 | 2026-08-13 | S55 re-verify findings applied (36/37) + branch pushed; gate green |
| 57 | 2026-08-14 | Task 0 visual QA passed (sticky + 320px, footer fix) + 0a /about + blog honesty polish |
| 58 | 2026-08-14 | Hero rebuild: one full-viewport shell across /, /sk, /chatkit, /toolkit |
| 59 | 2026-08-14 | /about + /blog on hero shell; founder-forward team; constellation blog cards |
| 60 | 2026-08-15 | APP_LIVE portal gate + merge to main; website rebuild live on prod |
| 61 | 2026-08-15 | /sk realizacie refresh (4 projects, fresh captures) + SK footer on the EN shell |
| 62 | 2026-08-16 | ChatKit privacy disclosure (0c) -- /privacy Section 3 + stale-processor cleanup |
| 63 | 2026-08-16 | /sk rework built: CRM flagship + Kto sme + FAQ + Royal Stroje case study (feat/sk-rework, unmerged) |
| 64 | 2026-08-16 | /sk rework merged + LIVE; C3 UTM attribution; C2 SK chatbot live with branded widget |
| 65 | 2026-08-17 | Chatbot 400 fix (null conversationId) + final logo rolled out sitewide (C7) + new OG cards |

## What Was Done (Session 64) -- /sk live on prod: merge, C3 attribution, C2 branded chatbot

- **/sk rework merged to main and LIVE** (ff-merge, then `12e3942` + `19628de` pushed). Merge-to-main was the user's explicit call over a preview branch, with FAQ #4/#5 still awaiting Filip -- campaign send stays gated, the deploy does not.
- **C3 attribution is FIRST-TOUCH via sessionStorage** (`lib/marketing/attribution.ts`): the capture is mounted in the MARKETING LAYOUT, not the forms -- the campaign lands on the case-study page which has no form, and a form-level capture recorded those visitors as "direct" (caught by probe). sessionStorage deliberately: not a cookie, so /privacy stays truthful. **GAP: EmailJS template must gain a `{{attribution}}` line or the data never reaches the inbox** -- Martin task.
- **C2 chatbot LIVE on /sk + case study** (bot `46ef0a99`, owner-less BY DESIGN: owner-less = internal = metered by `INTERNAL_BOT_DAILY_RULE` instead of customer credits; `allowed_domains` is then the only theft guard -- never leave it empty). `NEXT_PUBLIC_SK_CHATBOT_ID` set via Vercel API (production+preview); widget renders nothing without it.
- **KB anti-drift contract:** `scripts/seed-sk-chatbot.mjs` REBUILDS the whole KB from `constants/sk.ts` -- Command Center KB edits are wiped by a re-run. Lasting copy changes go in constants + re-seed; `--dry` prints without writing.
- **Widget branding is per-bot config, sellable to customers:** `launcher_icon` (https img in bubble + header), `secondary_color` (gradient), `input_placeholder` (non-EN bots). Config route validates all three (hex/https) because the widget splices them into CSS/img src; `primary_color` was passed through RAW before -- now validated too. Placeholder set as DOM property, never concatenated (esc() covers element text, not attributes).
- **`WidgetConfigForm` saves `widget_config` WHOLESALE** -- any new widget field must be added to the form state or saving the form silently erases it. Rule now documented in the form.
- User dropped redrawn logo vectors in `public/brand/` (see its README) + added plan task C7: roll out sitewide. Widget keeps white `logo.png` -- the new gradient mark would vanish on the purple bubble; C7 needs a white variant for the widget.

## What Was Done (Session 65) -- chatbot 400 fix + final logo rolled out sitewide (C7)

- **The SK chatbot never answered a single message, and it was not Claude.** `widget.js` sends `conversationId: null` on the first message; the schema had `UUID.optional()`, and zod `.optional()` rejects `null` -> 400 before the bot lookup. No conversation was ever created, so the id stayed null forever. Fixed server-side with `.nullish()` (cached widget.js copies in visitors' browsers keep sending null) plus the widget. Confirmed against prod. **Lesson: C2 shipped in S64 without one end-to-end conversation being clicked through.**
- **Favicon rebuilt twice before it was right.** First attempt used the S64 mark's simple variant (two disconnected arcs at 16px) on a TRANSPARENT background -- a dark mark sinks into a dark tab strip. A transparent favicon inherits whatever the browser paints behind it, so no single mark colour survives both light and dark chrome: the tile must be baked in. Second bug: `screenshot()` paints the page background unless `omitBackground: true`, which shipped white notches in the rounded corners.
- **User replaced the whole mark mid-session** (`public/brand/logo-final*.svg` + 27 PNG exports): the ORIGINAL logo vectorized, inner circle removed, mirrored L-R. The 2026-08-16 black-hole redesign is REJECTED (`mdn-mark*.svg` kept only for the record). Rolled out everywhere -- favicons (gradient on `#0B0A14` tile), OG cards (white), navbar/both footers/portal top bar, schema.org org logo (white-on-black plate, because search composites it onto backgrounds we do not control), widget `launcher_icon`.
- **New mark is ~1.7:1, not square.** Every old call site pinned 32x32 and would have squashed it -- all are now sized by height with `width: auto`. `next/image` needs `unoptimized` for SVG (the optimizer refuses it without `dangerouslyAllowSVG`).
- **New OG link-preview cards, EN + SK** (`scripts/generate-og-images.mjs`, seeded star field so the PNG is byte-stable across runs). Ring geometry is derived from `hero-shell.ts`, but the vertical offset deliberately does NOT follow the hero: the disk line sits flush with the top edge so only the lower bowl shows (user's call, cleaner at thumbnail size).
- **`public/logo.png` is now a copy of the new white export.** Nothing in the app reads it; it stays current because the LIVE chatbot's stored `widget_config` and external links still point there.
- Gotchas for next session: two Next processes cannot share `.next/` (a `npm run build` killed the user's dev server on :3000); the production CSP's `upgrade-insecure-requests` breaks `next start` over http://localhost, so local visual QA needs the CSP header stripped in Playwright.

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
| 0a | **SK-C leftovers** | C2+C3 done (S64), C7 logo rollout done (S65). Remaining: C4 LinkedIn vanity slug (Martin), C5 mdntech.sk purchase + 301, C6 /seo-audit (= 0a2). Campaign gate: founder/Filip inputs resolved BEFORE the ~150 partner emails (early September). |
| 0a3 | **Re-seed the SK chatbot** | `node scripts/seed-sk-chatbot.mjs` -- the live bot's `launcher_icon` still points at the old mark (stored in the DB, not the repo). WARNING: the script rebuilds the whole KB from `constants/sk.ts`, so move any Command Center KB edits into constants first. |
| 0a2 | SEO re-audit (UNBLOCKED -- /sk is live) | `seo-audit/` is STALE (predates the rebuild). Clusters: /chatkit = "AI chatbot for website"; /toolkit = "Claude Code skills". Confirm S58 breadcrumb-schema removal is acceptable (case study now HAS a visible trail + schema -- the pattern to copy), re-check S60 `installUrl`/`availability` omissions. Queue `/blog/[slug]` redesign. |
| 0d | **Open the portal (when ready)** | Set `NEXT_PUBLIC_APP_LIVE=true` in Vercel Production + redeploy. 0c DONE (S62); remaining gate is Phase 2 checkout + human legal read of /privacy. Verify built HTML has app links back, no "Coming soon" survives. |
| 1 | **Phase 2 credit bank (ChatKit billing rebuild)** | 2.1 account-level `credits_ledger` (append-only) + migrate balances; 2.4b unlocks re-priced in credits (conv 500 / analytics 750 / reports 1000 / learning 1250 / extra bot 1250); 3 mock-checkout routes (`app/api/portal/{chatbot/[id]/purchase,chatbot/[id]/feature,feature}/`) collapse into ONE credit purchase + ledger spends; 2.4 hidden Enterprise $999/40k + "Best value" on Scale; 2.7 policy build (12-mo expiry, refund window, chargeback clawback, 50-credit signup grant, low-balance email). `PaymentProvider` abstraction + Stripe test mode can start before Martin's live keys. Ledger: SELECT-only to `authenticated`, writes service-role; read migration 020 first. |
| 3 | Phase 3.5 E2E + CI | Port S51+S52 probe scripts into a committed suite; GitHub Actions (tsc, lint, build, E2E). Zero tests today. |
| 4 | Widen Phase 1 controls | Authenticated portal routes still unlimited; nonce-based CSP via middleware next. |
| 5 | ChatKit Voice (Cartesia Sonic-3) | Deferred. ~6h. |
| 0b | MarketKit B3 Dub go-live + Session B remainder | Gated on Martin task 4; runbook `command-center/MARKETKIT-SETUP.md` B3. Then B1 GA4/GSC + B5 dogfood onboarding. |
| 8 | Phase 8 UAE hosting migration (isHosting) | Post-launch. ~$85-125/mo verified. Plan SS8. |
| 9 | SignaKit portal section | Hidden for MVP. |
| 14 | Delete `.next-stale-1777403470/` + `.next-verify/` | Local only; safety hook blocks `rm -rf .*` -- delete via Explorer or `rmdir /s /q`. `.next-verify/` is a S65 leftover: two Next processes cannot share `.next/`, so local visual QA has to build into its own dir (both are gitignored). Worth a hook pattern fix to allow build dirs at the repo root. |
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
| `public/brand/README.md` | Logo source of truth + a table of every surface the mark is wired into and how to regenerate it. Read before touching any logo |
| `scripts/generate-{favicons,og-images}.mjs` | Rebuild favicons / link-preview cards from `public/brand/*.svg`. Never hand-edit the PNGs they emit |
| `lib/marketing/attribution.ts` | First-touch UTM capture (C3). sessionStorage on purpose (no cookie banner) -- do not move to localStorage/cookies without updating /privacy |
| `command-center/mdntech-sk-rework.md` | The /sk rework plan v1.0 -- done through C3 (S64); C4-C7 remain + acceptance criteria |
| NEVER hard-code these | `lib/portal/plans.ts` (prices/allowances), `lib/marketing/toolkit-catalogue.ts` (skill counts), `lib/chat/rate-limit-rules.ts` (limiter numbers), `lib/marketing/links.ts` (`COMPANY_LEGAL_LINE`). Marketing copy interpolates from all four |
| `supabase/migrations/{020_security_fixpack,021_chatkit_hardening}.sql` | Security model. Read 020 before touching billing columns |
