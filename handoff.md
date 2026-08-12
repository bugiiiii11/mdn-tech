# M.D.N Tech -- Handoff

<!-- HARD CAP ~150 lines. Max 2 session sections. Overflow -> handoff-archive.md (full pre-v3 history archived there 2026-07-17). -->

## Current State

- **Phase:** LAUNCH PLAN ACTIVE -- master checklist `MindPalace/Projects/MDN-Tech/MDN-Tech-Launch-Plan-2026-08.md` (re-baselined 2026-08-07; MVP launch target ~31.08). **Phase 0 + Phase 1 CLOSED and LIVE ON PROD** (verified S53). Website track in progress: landing v2.1 + `/chatkit` + `/toolkit` all built, branch-only, NOT deployed. Next: finish the S54 fix pass, then Phase 2 credit bank.
- **Session count:** 54
- **Products:** TechKit LIVE (7 crons), MarketKit A+B-core LIVE (B3 Dub go-live pending), ChatKit live w/ credits-only mock checkout (all 4 features available; Voice deferred), ToolKit public page live.

## Session Summary (last 10 -- full table + sessions 1-43 detail in handoff-archive.md)

| # | Date | Title |
|---|------|-------|
| 45 | 2026-07-17 | ToolKit gallery refresh -- 9 market-top skills + real MCP section |
| 46 | 2026-07-17 | Phase B verified complete + ChatKit tier gates wired (prio 2) |
| 47 | 2026-07-17 | ChatKit credits-only pivot + PlanKit removal + Blender skills (migration 017 applied) |
| 48 | 2026-07-17 | Prio 7 auth flow UIs + prio 3 Auto-learning shipped (migration 018 applied) |
| 49 | 2026-07-17 | Prio 4 Weekly reports shipped (migration 019 applied) -- Phase C build-complete |
| 50 | 2026-08-06/07 | Credit system + payments design locked; launch plan re-baselined; merged to main (Phase 0.1) |
| 51 | 2026-08-07 | Security fix-pack 0.2-0.5 -- 6 confirmed prod exploits closed (migration 020 applied) |
| 52 | 2026-08-07 | Phase 0 merged to main + Phase 1 hardening 1.1-1.6 (migration 021 applied) |
| 53 | 2026-08-12 | Phase 1 deployed + verified on prod; landing SEO rework v2.1 + 4 false claims fixed |
| 54 | 2026-08-12 | /chatkit + /toolkit pages built (29 files) + 60-finding review; fix pass in flight |

## What Was Done (Session 53) -- Phase 1 live on prod; landing SEO rework v2.1

- **Phase 1 is now DEPLOYED** (`03c84d1` merged to main + pushed). The S52 branch-only gap is closed. Verified against live prod 12/12: Royal Stroje loads from both `royalstroje.sk` and `www.`, foreign origins 403 on config + message, single ACAO, CSP live without `unsafe-eval`, `/api/subscribe` + chat reject malformed input, cron 401s. Plus 4/4 regression: every owned bot with an empty allow-list still accepts any origin. Nothing broke.
- **Test gotcha (cost me a false alarm):** zod runs at `message/route.ts:70`, BEFORE the domain check at :101. A domain-binding probe with a schema-invalid body 400s and proves nothing -- it must send a valid `visitorId`. Carry this into the Phase 3.5 E2E port.
- **Landing rework `6572531`** (branch-only, NOT deployed): ~300 -> ~1200 words, business-first positioning (ChatKit's real buyer is a business owner, not a developer). New sections: chatkit-section, toolkit-section, coming-soon (no CTAs), why-us, faq. Removed blog-preview + trust-bar (both /blog and /about are already in the navbar). FAQ renders 10 Q&As and builds FAQPage JSON-LD from the SAME array -- verified 10/10 text parity so schema can never drift.
- **A 63-agent adversarial review caught 4 FALSE claims in my own new copy.** All verified against code before fixing. These are now HONESTY CONSTRAINTS documented in the component headers -- do not regress them:
  1. "Every feature included" in the trial was false: `feature_unlocks` defaults to `'{}'` (migration 017), so learning/reports/conversations/analytics are PAID unlocks. ChatKit now splits "Included with every chatbot" from "Optional add-ons" with prices read from `plans.ts`.
  2. ToolKit is a CURATED DIRECTORY: only 5 of 21 skills are ours; the rest are Anthropic/Vercel Labs/Trail of Bits/obra under their own terms, and there is no licence field in the data at all. Never call the catalogue "our MIT skills" again.
  3. "One credit balance across all products" is NOT true today -- credits live on `chatbots.credits_purchased` (per chatbot, ChatKit only). That claim only becomes true when the Phase 2 ledger ships.
  4. The domain allow-list starts EMPTY (= allow any), so it is opt-in, not automatic.
- A11y fixes: `MotionConfig reducedMotion="user"` over the marketing tree; new `BlackholeVideo` pauses under reduced motion (WCAG 2.2.2) with a generated 48KB poster replacing a 740KB autoplay; footer gray-500 -> gray-400 (4.30:1 was under the 4.5 floor); `noscript` fallback because framer SSRs `opacity:0` and the page was BLANK without JS (h1 0 -> 1 verified).
- Added `PRODUCT.md` + `DESIGN.md` (impeccable context): brand register, users, anti-references, and the "Event Horizon" visual system with named rules (Bent Light, Gradient Crown, Legibility Floor, Glow-Not-Shadow). Future design work should read these first.
- **Safety hook false positives x2** -- did not work around, flagging for a pattern fix: `git push.*-f.*main` matched `--ff-only` across three chained commands; `curl.*\|.*sh` matched the word "ship" in an echo string. Proposed: anchor the force flag to the push itself (`git push[^;&|]*\s(-f|--force)\b[^;&|]*\bmain\b`) and require a real shell binary after the pipe.
- 38 lower-severity review findings left UNFIXED (mostly pre-existing): gradient taglines on `<p>` in product-card, 2px corner brackets, placeholder linkedin.com/github.com links in `TEAM_MEMBERS`, no SoftwareApplication schema, products grid empty cell.

## What Was Done (Session 54) -- /chatkit + /toolkit deep-dive pages built and reviewed

- **29 new files, branch-only, UNCOMMITTED AT WRAP TIME** (auto-wrap fired at 39% while the fix workflow was still running -- see "What To Do Next" row 0). `/chatkit` = 12 sections (setup, knowledge base, widget anatomy, answer behaviour, use cases, included-vs-paid, pricing, control, honest limits, 12-Q FAQ); `/toolkit` = 12 sections (what-is-a-skill, install, enumerated directory, our skills, MCP servers, cost, objections, 11-Q FAQ). Shared shells in `components/product-pages/primitives.tsx`.
- Method that worked and is worth repeating: **code truth-audit BEFORE writing copy.** An agent read plans.ts / migrations / the portal UI / the API routes and produced a fact contract plus a forbidden-claims list; the copywriter agent was forbidden to exceed it. Then 4 adversarial verifiers re-derived every claim from code independently.
- First pass was green on `tsc` + `lint` + `build` with 66 claims verified -- and still had **5 critical + 6 high** defects. Do not treat a green build as evidence the copy is true.
- **The 5 criticals:** (1) `/toolkit` claimed twice that Claude Code runs on the free Claude tier -- FALSE (Pro/Max/Team/Enterprise/Console required), and one instance was inside FAQPage JSON-LD; (2) `/chatkit`'s SoftwareApplication `featureList` spread the four PAID unlocks under a single `price:"0"` Offer -- the visible copy drew the line correctly and the schema erased it (honesty constraint 1, broken in the one place nobody reads); (3) the page cited `/privacy` for "exactly what we store" about transcripts/visitor IPs/source URLs -- the retention is real but the policy is the pre-ChatKit agency one and covers none of it; (4)+(5) **both pages were orphaned** -- absent from `sitemap.ts`, nav still on `/#chatkit`, footer pointing at the noindex portal; a repo-wide grep for `/toolkit` as an href returned only the page's own canonical.
- **Product bug found en route and FIXED (committed):** `app/api/chat/[chatbotId]/message/route.ts` fetched conversation history with `.order('created_at', { ascending: true }).limit(20)` -- that is the OLDEST 20 rows, while the comment said "last 20". Past message 20 the model never saw the recent turns or the question it was answering. Now descending + reverse. Affects the live Royal Stroje widget.
- Other real defects: the homepage and `/toolkit` published **contradictory skill counts** (21/5 vs 18/2) both inside structured data -- root cause is two private derivations, being fixed by lifting one definition into `lib/marketing/toolkit-catalogue.ts`; per-page `openGraph` silently wiped the root's og:image/site_name/locale (Next replaces the object, it does not deep-merge); pricing published real prices with no disclosure that checkout is still `status:'mock'`.
- **Open decision for Martin:** ChatKit stores full transcripts + visitor IPs + source URLs and `/privacy` documents none of it. The page copy was de-scoped to stop citing the policy, but the disclosure gap itself is real and legally sensitive -- it needs a ChatKit section in the privacy policy before the pages go live.

## Martin's Tasks (detailed -- do these, then report back in chat)

1. **Stripe UAE activation (CRITICAL PATH, start this week):** dashboard.stripe.com -> create account for the FZE: trade license 7813, Emirates ID + residence visa, Wio account details (Wio confirmed working). Verification takes 1-2 weeks and gates Phase 2 payments -- start before anything else.
2. **Supabase auth email templates (10 min):** supabase.com/dashboard -> project `ijfgwzacaabzeknlpaff` -> Authentication -> Emails (Templates tab). For each template slot, open the matching file in `supabase/email-templates/` (5 files: confirm-signup, magic-link, reset-password, email-change, reauthentication), copy the whole HTML into the template Source, Save. Then Authentication -> URL Configuration: Site URL = `https://app.mdntech.org`; add Redirect URLs `https://app.mdntech.org/auth/callback` and `http://localhost:3000/auth/callback`.
3. **ChatKit cron secret + Resend key (5 min):** generate a random 32+ char string. (a) vercel.com -> M.D.N Tech site project -> Settings -> Environment Variables -> add `CHATKIT_CRON_SECRET` = that value (Production) -> redeploy; while there CONFIRM `RESEND_API_KEY` is listed too (add from `.env.local` line 30 if missing). (b) Supabase dashboard -> SQL Editor -> run: `select vault.create_secret('<that value>', 'chatkit_cron_secret');` -- powers both Sunday learning + Monday reports crons; until then they 401 harmlessly.
4. **Dub account for MarketKit B3 (10 min):** sign up at dub.co -> Settings -> API Keys -> Create key (starts `dub_...`) -> paste into `.env.local` as `DUB_API_KEY=dub_...` -> tell the next session "Dub key ready" (it then runs the 5-part go-live runbook in `command-center/MARKETKIT-SETUP.md` B3).
5. **Browser E2E pass (15 min, after 2+3):** `npm run dev` -> log in at `localhost:3000/portal/login` -> open your chatbot: buy a credit pack + unlock a feature (mock checkout, no real charge); rate a reply thumbs-down in Conversations then hit Auto-learning "Run now"; hit Weekly reports "Run now" and check your inbox for the report email. Report anything broken.
6. **Ask Filip:** compliance answers (plan SS2.0b) incl. the B2B evidence approach (VAT ID or ICO + business self-declaration); isHosting docs whenever available (not blocking -- prices already verified).
7. **NEW -- inviting a teammate (since S51):** a signup alone can no longer create staff. Supabase SQL Editor: `insert into team_invites (email, role) values ('kolega@mdntech.org', 'engineer');` (role: `admin` | `engineer` | `viewer`), THEN have them create an account on that exact email. Without the invite row they become an ordinary customer. Confirm the ~50-credit signup promo grant number too (plan SS3.1 leftover).

## What To Do Next -- ChatKit remaining work

**Two tracks now: Phase 2 credit bank (product) and the website/SEO rebuild (marketing).** Phase 2 is easier now -- 020 made every billing column service-role-only and 021 established the migration patterns for it. The landing rework is branch-only; it does NOT need to ship before the product pages are written.

| Priority | Task | Status / Notes |
|----------|------|----------------|
| 0 | **FINISH THE S54 FIX PASS -- start here** | A 7-agent fix workflow (`wz1vrff31`) was STILL RUNNING when auto-wrap fired, so the 29 new files were committed mid-flight and may contain partially-applied fixes. FIRST: run `npx tsc --noEmit && npm run lint && npm run build` -- all three were green before the fix pass. Then check the workflow result / its `journal.jsonl` for which of the 60 findings landed. Full finding list + prescribed fixes: `scratchpad/review-findings.md` (regenerate from the task output if the scratchpad is gone). The 3 re-verify agents (honesty, design/a11y, build+SEO) may not have run at all -- re-run them before trusting the pages. Nothing is deployed and nothing was pushed, so there is no prod risk. |
| 0a | Then: rest of the website track | /about + blog rework (the 3 template-era articles are generic; needs real engineering content), then /sk alignment. THEN re-run the SEO audit -- `seo-audit/` is STALE (predates the whole rebuild, still references mdntech.com and `components/main/` files). Target clusters: /chatkit = "AI chatbot for website / chatbot without coding"; /toolkit = "Claude Code skills" (low competition, winnable #1). User asked for a PUSH once the pages are done -- do it only after the fix pass verifies clean. |
| 0c | **ChatKit privacy disclosure** | Blocking the pages going live: transcripts + visitor IPs + `source_url` are stored (`message/route.ts`), `/privacy` documents none of it. Needs a ChatKit section -- Martin's call on wording. |
| 1 | **Phase 2 credit bank (ChatKit billing rebuild)** | 2.1 account-level `credits_ledger` (append-only) + migrate `chatbots.credits_purchased` balances; 2.4b unlocks re-priced in credits (conv 500 / analytics 750 / reports 1000 / learning 1250 / extra bot 1250) and the 3 mock-checkout routes collapse into ONE credit purchase + ledger spends; 2.4 hidden Enterprise $999/40k + "Best value" badge on Scale; 2.7 policy build (12-mo expiry + 30-day warning email, refund window, auto re-credit, chargeback clawback + auto-suspend, 50-credit signup grant, low-balance email). `PaymentProvider` abstraction + Stripe test mode can start before Martin's live keys land. NOTE: grant SELECT-only to `authenticated` on the new ledger; all writes service-role. |
| 3 | Phase 3.5 E2E + CI | Port the S51 + S52 probe scripts into a committed suite (S52 added: domain binding, input validation, rate limiter, sanitizer, cron compare, Playwright CSP check -- all scratchpad-only). Add GitHub Actions (tsc, lint, build, E2E). Zero tests today. |
| 4 | Widen the Phase 1 controls | Rate limiting covers `/api/chat/*` + `/api/subscribe`; the authenticated portal routes are still unlimited. CSP still needs `unsafe-inline` for scripts -- nonce-based CSP via middleware is the follow-up. |
| 5 | ChatKit Voice (Cartesia Sonic-3) | Deferred. ~6h. |
| 0b | MarketKit B3 Dub go-live + Session B remainder | Gated on Martin task 4; then edge secret + worker redeploy (5 parts) + migration 016 (`MARKETKIT-SETUP.md` B3 runbook). Then B1 GA4/GSC + B5 dogfood onboarding. |
| 8 | Phase 8 UAE hosting migration (isHosting) | AFTER substance + post-launch. Costs verified ~$85-125/mo. Plan SS8 has the checklist. |
| 9 | SignaKit portal section | Hidden for MVP; reactivate post-ChatKit-monetization. |
| 12 | SEO action plan | Follow `seo-audit/ACTION-PLAN.md`. |
| 14 | Delete `.next-stale-1777403470/` | Local only; safety hook blocks `rm -rf .*` -- delete via Explorer or `rmdir /s /q`. |
| 15 | SK Part B + domain 301 | Client-repo footer links -> mdntech.org/sk at next touch of each repo; `mdntech.sk` purchase + 301; `.com -> .org` 301 at registrar. |

## Key Files

| File | Purpose |
|------|---------|
| `handoff.md` / `handoff-archive.md` | Live state (capped ~150 lines) / full history (never read on start) |
| `MindPalace/Projects/MDN-Tech/MDN-Tech-Launch-Plan-2026-08.md` | MASTER launch checklist (Phases 0-8) -- Phases 0 and 1 checked off AND live on prod (S53) |
| `PRODUCT.md` / `DESIGN.md` | Brand register, users, anti-references / the "Event Horizon" visual system + named rules. Read BOTH before any design or copy work |
| `components/landing/` | The v2.1 landing: hero, products, chatkit-section, toolkit-section, coming-soon, why-us, faq, credits-strip |
| `components/product-pages/primitives.tsx` | Shared shells for both product pages (PageHero = the only h1, Section, GlassCard, StatChip, CtaBand, CheckItem, fadeUp). Read this BEFORE editing `components/chatkit/**` or `components/toolkit/**` |
| `lib/marketing/toolkit-catalogue.ts` | Single source of truth for "a skill in the directory" = an entry with an `installationUrl`. Both the homepage and /toolkit must import counts from here -- they published contradictory numbers when each derived its own |
| `lib/portal/plans.ts` | Billing source of truth. ALL landing prices/counts import from here -- never hard-code a price or a trial number in a component |
| `lib/portal/toolkit-skills.ts` | ToolKit catalogue. Only `author: 'M.D.N Tech'` entries (5 of 21) are ours -- the rest are third-party under their own terms |
| `app/api/portal/{chatbot/[id]/purchase,chatbot/[id]/feature,feature}/` | The 3 mock checkout routes -- collapse into one credit purchase + ledger spends (Phase 2) |
| `supabase/migrations/{020_security_fixpack,021_chatkit_hardening}.sql` | The security model (column grants, invite-only staff) + Phase 1 DB half. Read 020 before touching billing columns or adding tables |
| `lib/chat/{cors,rate-limit,schemas,sanitize}.ts` | Phase 1 public-surface controls, now LIVE: origin matching, durable limiter, zod contracts, injection heuristics |
| `seo-audit/ACTION-PLAN.md` | STALE -- predates the rebuild (references mdntech.com + old `components/main/` structure). Re-run the audit after the website track, do not follow as-is |
| `decisions.md` | Locked architectural decisions |
