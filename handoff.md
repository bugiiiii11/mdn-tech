# M.D.N Tech -- Handoff

<!-- HARD CAP ~150 lines. Max 2 session sections. Overflow -> handoff-archive.md (full pre-v3 history archived there 2026-07-17). -->

## Current State

- **Phase:** LAUNCH PLAN ACTIVE -- master checklist `MindPalace/Projects/MDN-Tech/MDN-Tech-Launch-Plan-2026-08.md` (MVP launch target ~31.08). Phase 0 + Phase 1 LIVE ON PROD. **The website rebuild is MERGED AND LIVE on mdntech.org (S60, merge `ad2e4f1`)** -- `feat/landing-rebuild` is fully in `main`. The customer portal is gated behind `APP_LIVE` (see below), so the live site links to app.mdntech.org nowhere. Next: 0c privacy disclosure, /sk alignment + SEO re-audit, Phase 2 credit bank.
- **Session count:** 61
- **Products:** TechKit LIVE (7 crons), MarketKit A+B-core LIVE (B3 Dub go-live pending), ChatKit live w/ credits-only mock checkout (Voice deferred), ToolKit public page live.

## Session Summary (last 10 -- full table + sessions 1-46 detail in handoff-archive.md)

| # | Date | Title |
|---|------|-------|
| 52 | 2026-08-07 | Phase 0 merged to main + Phase 1 hardening 1.1-1.6 (migration 021 applied) |
| 53 | 2026-08-12 | Phase 1 deployed + verified on prod; landing SEO rework v2.1 + 4 false claims fixed |
| 54 | 2026-08-12 | /chatkit + /toolkit pages built (29 files) + 60-finding review; fix pass in flight |
| 55 | 2026-08-12/13 | S54 fix pass completed (60/60) + adversarial re-verify: 37 new findings, unapplied |
| 56 | 2026-08-13 | S55 re-verify findings applied (36/37) + branch pushed; gate green |
| 57 | 2026-08-14 | Task 0 visual QA passed (sticky + 320px, footer fix) + 0a /about + blog honesty polish |
| 58 | 2026-08-14 | Hero rebuild: one full-viewport shell across /, /sk, /chatkit, /toolkit |
| 59 | 2026-08-14 | /about + /blog on hero shell; founder-forward team; constellation blog cards |
| 60 | 2026-08-15 | APP_LIVE portal gate + merge to main; website rebuild live on prod |
| 61 | 2026-08-15 | /sk realizacie refresh (4 projects, fresh captures) + SK footer on the EN shell |

## What Was Done (Session 60) -- APP_LIVE portal gate + merge to main

- **`feat/landing-rebuild` MERGED into `main` and PUSHED** (`ad2e4f1`, 99 files, +7602/-1350; `7f8cf98` is the gate itself). The rebuild is live on mdntech.org. main and the branch have identical trees.
- **THE PORTAL GATE -- `APP_LIVE` in `lib/marketing/products.ts`.** User decision: while the portal is not ready, NO surface on the marketing site may walk a visitor to app.mdntech.org. One build-time flag drives all 15 entry points. `NEXT_PUBLIC_APP_LIVE` is unset in Production -> default CLOSED (deliberate fail-safe, same shape as `getLandingMode`). To open the portal: set `NEXT_PUBLIC_APP_LIVE=true` in Vercel Production + redeploy. No code change, every CTA returns at once.
- Three treatments, chosen per surface: **chrome drops** (navbar "Open App" desktop + mobile, footer "Open the App" -- a dead button in site chrome reads as broken), **buttons go inert** (`appCta()` -> `{href:"", label:"Coming soon", disabled:true}`, rendered by `CtaButton`/`HERO_CTA_DISABLED_CLASS` as an `aria-disabled` span OUT of the tab order), **prose adapts** (landing FAQ drops its "Try it free" clause; /toolkit closing falls back to the internal /chatkit page; /chatkit pricing has a whole second truthful disclosure paragraph).
- Machine-readable claims went with the links: `SoftwareApplication.installUrl` and `Offer.availability` are omitted while closed (InStock is a claim you can start today, and you cannot), the /toolkit FAQ signup link drops out of the FAQPage JSON-LD via `faqAnswerText()`, and the app preconnect/dns-prefetch leaves `app/layout.tsx`.
- Verified in the BUILT HTML: **zero `app.mdntech.org` across every static page**, then re-verified on PROD after deploy. Gate green; screenshots at 1280 + 375 on / and /chatkit, overflowX=0 everywhere.
- **The host itself is untouched** -- app.mdntech.org still answers if typed directly (it is already noindex). Deliberate: blocking it would also block Martin's own E2E pass (task 5).
- 0c (ChatKit privacy disclosure) did NOT block the merge: no ChatKit widget runs on the marketing site and no new visitor can sign up while the gate is closed, so this deploy starts no new data collection. It is still required before the portal opens.

## What Was Done (Session 61) -- /sk realizacie refresh + SK footer on the EN shell

- **Realizacie is now four projects**, user-ordered: Royal Stroje, Royal Works, Good Hair by Zane, Kurenie Turiec (`SK_PORTFOLIO` order IS the render order -- reorder there, nowhere else). `royalworks.sk` is new; Royal Stroje's third tag is now "CRM" (was "Command Center" -- read as our internal product, not the client's).
- **Royal Works tags are UNCONFIRMED** -- shipped as Web / Lokalne SEO / Dizajn na mieru, inferred from the live site, not from the actual engagement. Ask Martin to confirm or correct.
- All four previews re-captured from the live sites. `scripts/capture-portfolio.mjs` now declines cookie banners before shooting (clicks Odmietnut/Reject -- NEVER accept, the captures must not opt into a client's analytics) and hides late-loading chat bubbles. Two shots previously shipped with a consent overlay baked in.
- CAPTURE GOTCHA: the first page render after a fresh capture shows blank/old previews because next/image is generating the optimization on demand. Re-shoot before concluding the cache is stale -- it is not, and `rm -rf .next/cache/images` is unnecessary (it also trips the `rm -rf \.` safety hook).
- Grid went 3-col -> `md:grid-cols-2` inside `max-w-5xl`: four cards in three columns left an orphan and 4-across shrank previews past legibility. `sizes` moved 33vw -> 50vw to match.
- **SK footer rebuilt on the EN footer's shell** (#010109 panel, violet horizon hairline, uppercase column heads, social row, same bottom bar). Newsletter slot became a consultation CTA instead -- /sk closes on its own contact form and the newsletter copy is English-only. Columns render from `SK_NAV_LINKS` + `SK_NAP` so they cannot drift from the page. The old "DO NOT TOUCH /sk" comment on that component is gone.
- **`COMPANY_LEGAL_LINE` in `lib/marketing/links.ts` is the single legal footprint** both footers render. The Slovak postal address (Recka cesta 182, Senec-Boldog) is deleted sitewide -- zero hits in the build. `SK_NAP` never carried an address, so no JSON-LD change was needed.
- Gate green; overflowX=0 at 1280 + 375; screenshot-verified. Pushed straight to `main` (prod) at user request.

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
| 0a | /sk alignment | /about + /blog rebuilt (S59); /sk hero matches EN (S58); realizacie + footer done (S61). REMAINING: align the /sk services + value-ladder copy with the product-first story, THEN re-run the SEO audit -- `seo-audit/` is STALE (predates the rebuild). Target clusters: /chatkit = "AI chatbot for website"; /toolkit = "Claude Code skills" (low competition). Re-audit should confirm the S58 breadcrumb-schema removal is acceptable, or restore visible trails + schema together, and re-check the S60 `installUrl`/`availability` omissions. Also queue: `/blog/[slug]` article-page redesign to match the new index. |
| 0c | **ChatKit privacy disclosure** | No longer blocks the marketing pages (S60 gate closed the funnel) but BLOCKS opening the portal: transcripts + visitor IPs + `source_url` are stored (`message/route.ts`), `/privacy` documents none of it. Needs a ChatKit section -- Martin's call on wording. |
| 0d | **Open the portal (when ready)** | Set `NEXT_PUBLIC_APP_LIVE=true` in Vercel Production + redeploy. Do this ONLY after 0c and Phase 2 checkout. Verify afterwards that the built HTML has app links back and that no "Coming soon" span survives. |
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
| NEVER hard-code these | `lib/portal/plans.ts` (prices/allowances), `lib/marketing/toolkit-catalogue.ts` (skill counts), `lib/chat/rate-limit-rules.ts` (limiter numbers), `lib/marketing/links.ts` (`COMPANY_LEGAL_LINE` -- the one legal footprint both footers render). Marketing copy interpolates from all four |
| `app/api/portal/{chatbot/[id]/purchase,chatbot/[id]/feature,feature}/` | The 3 mock checkout routes -- collapse into one credit purchase + ledger spends (Phase 2) |
| `supabase/migrations/{020_security_fixpack,021_chatkit_hardening}.sql` | Security model. Read 020 before touching billing columns |
| `decisions.md` | Locked architectural decisions |
