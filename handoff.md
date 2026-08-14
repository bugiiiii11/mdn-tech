# M.D.N Tech -- Handoff

<!-- HARD CAP ~150 lines. Max 2 session sections. Overflow -> handoff-archive.md (full pre-v3 history archived there 2026-07-17). -->

## Current State

- **Phase:** LAUNCH PLAN ACTIVE -- master checklist `MindPalace/Projects/MDN-Tech/MDN-Tech-Launch-Plan-2026-08.md` (MVP launch target ~31.08). Phase 0 + Phase 1 LIVE ON PROD. Website track: all six marketing heroes now on one full-viewport shell (S58 + S59); `/about` team section founder-forward + `/blog` index redesigned (S59). Remaining before pages go live: ChatKit privacy disclosure (0c) + merge decision. Then /sk alignment + SEO re-audit, and Phase 2 credit bank.
- **Session count:** 59
- **Products:** TechKit LIVE (7 crons), MarketKit A+B-core LIVE (B3 Dub go-live pending), ChatKit live w/ credits-only mock checkout (Voice deferred), ToolKit public page live.

## Session Summary (last 10 -- full table + sessions 1-46 detail in handoff-archive.md)

| # | Date | Title |
|---|------|-------|
| 50 | 2026-08-06/07 | Credit system + payments design locked; launch plan re-baselined; merged to main (Phase 0.1) |
| 51 | 2026-08-07 | Security fix-pack 0.2-0.5 -- 6 confirmed prod exploits closed (migration 020 applied) |
| 52 | 2026-08-07 | Phase 0 merged to main + Phase 1 hardening 1.1-1.6 (migration 021 applied) |
| 53 | 2026-08-12 | Phase 1 deployed + verified on prod; landing SEO rework v2.1 + 4 false claims fixed |
| 54 | 2026-08-12 | /chatkit + /toolkit pages built (29 files) + 60-finding review; fix pass in flight |
| 55 | 2026-08-12/13 | S54 fix pass completed (60/60) + adversarial re-verify: 37 new findings, unapplied |
| 56 | 2026-08-13 | S55 re-verify findings applied (36/37) + branch pushed; gate green |
| 57 | 2026-08-14 | Task 0 visual QA passed (sticky + 320px, footer fix) + 0a /about + blog honesty polish |
| 58 | 2026-08-14 | Hero rebuild: one full-viewport shell across /, /sk, /chatkit, /toolkit |
| 59 | 2026-08-14 | /about + /blog on hero shell; founder-forward team; constellation blog cards |

## What Was Done (Session 58) -- Hero rebuild on one full-viewport shell

- **`components/main/hero-shell.ts` is now THE hero contract** (section shell, blackhole framing, content wrapper, CTA sizing) and all four heroes compose it: `/`, `/sk`, and `/chatkit` + `/toolkit` via `PageHero`. Every hero is `min-h-[100svh]`, so no next section peeks above the fold at any size.
- **Root cause of the mobile blackhole bug:** the video was sized `h-full` off the hero container, so any height change rescaled and re-anchored the ring. It is now sized by explicit height + the asset's true 16:9 aspect, independent of hero height. Desktop geometry is byte-identical to before (810px box at -340px = the approved 1440px ring); md/base tiers are new.
- **TAILWIND GOTCHA (cost a full debug cycle):** `tailwind.config.ts` scans `./app`, `./components`, `./pages` ONLY. A class string placed in `lib/` generates no CSS and fails SILENTLY -- markup ships with classes matching nothing, hero renders unstyled at content height. That is why hero-shell.ts lives under `components/`, same reason as `PROSE_LINK_CLASS`. Do not move it.
- Hero content is top-padded past the ring's glow on phones then centred in the space that remains (`items-center` + `pt-[195px]`); md+ centres against the viewport. Verified no headline-in-glow at 320/360/375/390.
- Product-page heroes stripped to heading + lede + 2 buttons per user direction: eyebrow pills, visible breadcrumbs, reassurance notes and the 4 proof chips all removed. **The BreadcrumbList JSON-LD went with the visible trail** on both pages (`breadcrumbListSchema()` deleted from `schema.ts`, `Crumb` type gone) -- this site only emits breadcrumb schema for a trail a visitor can see. Trade-off flagged to user: no breadcrumb rich result in SERPs for /chatkit + /toolkit.
- Two navbar defects fixed (both pre-existing): the centred 500px pill reached under the "M.D.N Tech" logo at 768-1023px -- it now sizes to content at md (text-sm, gap-4) and keeps the exact 500px/justify-between layout at lg; nav links got `whitespace-nowrap` because /sk's "Prečo my" wrapped and deformed the pill.
- `CtaButton` gained `size="md"|"lg"`; hero CTAs run one step larger, held back until `sm:` so a long Slovak label still fits at 320px. /sk hero also swapped its raw `<video>` for `BlackholeVideo` (gains reduced-motion pause + poster + `preload="none"`).
- Gate green (tsc/lint/build; all four routes still static). Verified in BUILT HTML: zero `BreadcrumbList`, zero `Welcome-box`, zero breadcrumb `<nav>`, exactly one h1 per product page, other schema nodes intact. Screenshot-verified on 4 pages x 9 viewports (320 -> 2560).

## What Was Done (Session 59) -- /about + /blog on the hero shell; founder-forward team

- `/about` + `/blog` now open on the shared full-viewport hero shell -- all six marketing heroes compose `components/main/hero-shell.ts`. Old `components/main/hero.tsx` + `components/sub/hero-content.tsx` DELETED (the pre-rebuild landing hero /about had inherited).
- **User decisions (do not re-litigate):** team section is founder-forward -- ONLY Martin Jerabek's card, Hromek + Lukas removed; top nav stays FLAT (Products dropdown rejected until a 3rd product page ships); Blog STAYS in the main nav.
- **`FOUNDER.linkedin` in `constants/index.ts` is EMPTY** -- the card's LinkedIn button renders only when set (never a placeholder). Waiting on Martin's personal URL; a real photo to replace the AI-avatar `public/team/1.jpg` also invited.
- Team section: growing-team story (five engineers, distributed, Claude Code -> ToolKit receipt, hiring as contracts land) + world map in a fixed 21:10 frame so the 4 cyan activity pulses stay on land at any width.
- Blog banners are deterministic constellation SVGs seeded from post id (`components/blog/constellation.tsx`) -- `public/blog/` raster covers do not exist; the seeded PRNG keeps server/client HTML identical (no hydration mismatch).
- Gotcha: a taller hero content block centers UP into the ring glow -- the blog hero (featured post in the fold) needed `md:pt-24`. Check headline clearance whenever hero content grows.
- Blog index is now a server component (metadata already lived in `blog/layout.tsx`); 4.24 kB, still static. Card fixes: titles solid white->cyan (Gradient Crown Rule), excerpts gray-300 (Legibility Floor).
- Gate green; settled-overflow QA clean at 1280/375/320 on both pages (emulate reduced motion or framer slide-ins give phantom hits). `/blog/[slug]` article pages untouched -- still the old design, future polish candidate.

## Martin's Tasks (detailed -- do these, then report back in chat)

1. **Stripe UAE activation (CRITICAL PATH, start this week):** dashboard.stripe.com -> create account for the FZE: trade license 7813, Emirates ID + residence visa, Wio account details (Wio confirmed working). Verification takes 1-2 weeks and gates Phase 2 payments -- start before anything else.
2. **Supabase auth email templates (10 min):** supabase.com/dashboard -> project `ijfgwzacaabzeknlpaff` -> Authentication -> Emails (Templates tab). For each template slot, open the matching file in `supabase/email-templates/` (5 files), copy the HTML into the template Source, Save. Then Authentication -> URL Configuration: Site URL = `https://app.mdntech.org`; add Redirect URLs `https://app.mdntech.org/auth/callback` and `http://localhost:3000/auth/callback`.
3. **ChatKit cron secret + Resend key (5 min):** generate a random 32+ char string. (a) vercel.com -> Settings -> Environment Variables -> add `CHATKIT_CRON_SECRET` (Production) -> redeploy; CONFIRM `RESEND_API_KEY` is listed (add from `.env.local` line 30 if missing). (b) Supabase SQL Editor: `select vault.create_secret('<that value>', 'chatkit_cron_secret');` -- powers Sunday learning + Monday reports crons; until then they 401 harmlessly.
4. **Dub account for MarketKit B3 (10 min):** dub.co -> Settings -> API Keys -> Create key -> paste into `.env.local` as `DUB_API_KEY=dub_...` -> tell the next session "Dub key ready".
5. **Browser E2E pass (15 min, after 2+3):** `npm run dev` -> log in at `localhost:3000/portal/login` -> buy a credit pack + unlock a feature (mock checkout); rate a reply thumbs-down then hit Auto-learning "Run now"; hit Weekly reports "Run now" and check your inbox. Report anything broken.
6. **Ask Filip:** compliance answers (plan SS2.0b) incl. the B2B evidence approach; isHosting docs whenever available (not blocking).
7. **Founder card assets (2 min):** paste your personal LinkedIn URL in chat (goes into `FOUNDER.linkedin`, one line) and optionally drop a real photo over `public/team/1.jpg` -- the /about founder card ships without the button until then.
8. **Inviting a teammate (since S51):** Supabase SQL Editor: `insert into team_invites (email, role) values ('kolega@mdntech.org', 'engineer');` THEN have them sign up on that exact email. Confirm the ~50-credit signup promo grant number too (plan SS3.1 leftover).

## What To Do Next -- ChatKit remaining work

**Two tracks: Phase 2 credit bank (product) and the website/SEO rebuild (marketing).**

| Priority | Task | Status / Notes |
|----------|------|----------------|
| 0 | **Merge decision** | Visual QA DONE (S57-S59, all marketing pages). Decide merge `feat/landing-rebuild` -> main with Martin -- 0c privacy disclosure is the only remaining blocker for the pages going truly live. 7 unpushed commits on the branch. |
| 0a | /sk alignment | /about + /blog rebuilt (S59); /sk hero matches EN (S58). Align the REST of /sk with the product-first story, THEN re-run the SEO audit -- `seo-audit/` is STALE (predates the rebuild). Target clusters: /chatkit = "AI chatbot for website"; /toolkit = "Claude Code skills" (low competition). Re-audit should confirm the S58 breadcrumb-schema removal is acceptable, or restore visible trails + schema together. Also queue: `/blog/[slug]` article-page redesign to match the new index. |
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
| `components/main/hero-shell.ts` | THE hero contract for /, /sk, /chatkit, /toolkit (full-viewport shell, blackhole framing, CTA sizes). MUST stay under `components/` -- Tailwind does not scan `lib/`, and the failure is silent |
| `components/product-pages/` | Shared shells, now the real system: `primitives.tsx` barrel over `motion-primitives` (PageHero, Section, CtaBand, CtaButton+size, FADE_UP), `static-primitives` (GlassCard, StatChip, CheckItem, PROSE_LINK_CLASS -- owns font-medium, never append to it), `faq.tsx` (FaqSection + faqPageSchema -- ALL FAQ surfaces use it), `schema.ts` (@id refs), `code-block.tsx` |
| `lib/marketing/toolkit-catalogue.ts` | THE single source for skill counts/groups (18 listed / 2 ours); `components/toolkit/catalogue.tsx` is a thin re-export |
| `lib/portal/plans.ts` | Billing source of truth + `chatbotAllowanceLabel()`/`creditsPerReplyLabel()`. Never hard-code a price/count |
| `lib/chat/rate-limit-rules.ts` | Client-safe limiter constants (20/min IP, 120/min bot) -- marketing copy interpolates from here |
| `app/api/portal/{chatbot/[id]/purchase,chatbot/[id]/feature,feature}/` | The 3 mock checkout routes -- collapse into one credit purchase + ledger spends (Phase 2) |
| `supabase/migrations/{020_security_fixpack,021_chatkit_hardening}.sql` | Security model. Read 020 before touching billing columns |
| `decisions.md` | Locked architectural decisions |
