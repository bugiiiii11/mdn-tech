# M.D.N Tech -- Handoff

<!-- HARD CAP ~150 lines. Max 2 session sections. Overflow -> handoff-archive.md (full pre-v3 history archived there 2026-07-17). -->

## Current State

- **Phase:** LAUNCH PLAN ACTIVE -- master checklist `MindPalace/Projects/MDN-Tech/MDN-Tech-Launch-Plan-2026-08.md` (re-baselined 2026-08-07; MVP launch target ~31.08). **Phase 0 CLOSED** (S50-S51, code now live on main). **Phase 1 CLOSED** (1.1-1.6, S52, branch-only). Next: Phase 2 credit bank.
- **Session count:** 52
- **Products:** TechKit LIVE (7 crons), MarketKit A+B-core LIVE (B3 Dub go-live pending), ChatKit live w/ credits-only mock checkout (all 4 features available; Voice deferred), ToolKit public page live.

## Session Summary (last 10 -- full table + sessions 1-43 detail in handoff-archive.md)

| # | Date | Title |
|---|------|-------|
| 43 | 2026-07-17 | Nebula seam fix + A3.3/A3.4 -- Phase A verification complete |
| 44 | 2026-07-17 | Handoff v3 -- /handoff skill, real-usage auto-wrap hooks, handoff cap |
| 45 | 2026-07-17 | ToolKit gallery refresh -- 9 market-top skills + real MCP section |
| 46 | 2026-07-17 | Phase B verified complete + ChatKit tier gates wired (prio 2) |
| 47 | 2026-07-17 | ChatKit credits-only pivot + PlanKit removal + Blender skills (migration 017 applied) |
| 48 | 2026-07-17 | Prio 7 auth flow UIs + prio 3 Auto-learning shipped (migration 018 applied) |
| 49 | 2026-07-17 | Prio 4 Weekly reports shipped (migration 019 applied) -- Phase C build-complete |
| 50 | 2026-08-06/07 | Credit system + payments design locked; launch plan re-baselined; merged to main (Phase 0.1) |
| 51 | 2026-08-07 | Security fix-pack 0.2-0.5 -- 6 confirmed prod exploits closed (migration 020 applied) |
| 52 | 2026-08-07 | Phase 0 merged to main + Phase 1 hardening 1.1-1.6 (migration 021 applied) |

## What Was Done (Session 51) -- Security fix-pack: 6 confirmed prod exploits closed (Phase 0.2-0.5)

- **Exploits PROVEN against live prod first, then re-run after the fix: 6/7 -> 0/7.** Before: a signup that simply omitted `account_type: 'customer'` got a `team_members` row with `role='admin'` (pre-email-confirmation, and every `is_admin()` RLS policy trusted it); a customer could PATCH their own bot to `credits_purchased=999999`, flip all four paid `feature_unlocks` on, zero `messages_used`, set `extra_chatbot_slots=99`, and INSERT a bot pre-loaded with credits -- all straight against PostgREST, no app route involved.
- Root cause of the self-grant class: RLS policies constrain WHICH ROW you touch, never WHICH COLUMN, and `authenticated` held table-wide UPDATE/INSERT. Fix (migration `020_security_fixpack.sql`, APPLIED + verified): table grants revoked and replaced with explicit column grants. Off-limits to clients now: `chatbots.credits_purchased / messages_used / feature_unlocks / owner_id(update)`, `customers.extra_chatbot_slots` + `subscription_*`/`stripe_*`, `team_members.role / is_active`. `anon` lost INSERT/UPDATE/DELETE on all three tables.
- Admin escalation fix: `handle_new_user()` no longer reads `account_type`/`role` from user metadata at all -- default is `customers` (fail closed). Staff exist ONLY via the new `team_invites` allow-list (service-role/admin insert, single-use, role taken from the invite row). `search_path` pinned on all four security-definer functions.
- Chatbot limit moved out of the page component into the DB: `chatbots_enforce_limit` BEFORE INSERT trigger + `pg_advisory_xact_lock` per owner (also closes the parallel-request race). Mirrors `BASE_CHATBOT_LIMIT` in `plans.ts` -- keep the two in sync.
- 0.4: new `lib/auth/team.ts` (`getTeamIdentity` / `requireAdmin`) resolves staff from the DB, NOT from `user_metadata` -- which a user can rewrite themself via `auth.updateUser`. Guards `/api/infrastructure` and `app/command-center/layout.tsx` (non-staff sees an Access-denied screen; login page still loads for signed-out users). Needed a new self-select RLS policy so a non-admin member can read their own row.
- Two extras found in the same auth path and fixed: an infinite redirect loop in `lib/supabase/middleware.ts` (customer on admin host -> admin login -> `/` -> repeat; now goes to the portal host), and `team_members` self-promotion (the update policy had no `WITH CHECK`, so an engineer could set their own role to admin).
- Verification: exploit suite 0/7; legitimate-path regression 22/22 (create+edit bot, widget config, service-role billing writes, paid slot unlocks the 2nd bot, profile edit, invite flow, RLS visibility); `/api/infrastructure` 401 anon / 403 customer / 403 forged `account_type=team` / 200 invited admin; CC gate 4/4. All throwaway accounts deleted, DB confirmed clean. tsc + lint + build green.
- Test scripts live in the session scratchpad only (not committed) -- Phase 3.5 should port them into the CI E2E suite.
- SHIPPING GAP: migration 020 is live on PROD (DB-side exploits are closed everywhere), but the code half (`d3acf72`) is pushed only to `feat/landing-rebuild`. Until it merges to `main`, prod `/api/infrastructure` still admits any signed-in account and the Command Center staff gate is not deployed. Merge early next session.

## What Was Done (Session 52) -- Phase 0 merged to main; Phase 1 hardening 1.1-1.6

- Phase 0.2-0.5 code merged to `main` + pushed (`7328d97`) -- the S51 shipping gap is closed; the `/api/infrastructure` guard and CC staff gate are live in prod alongside migration 020.
- **Phase 1 CLOSED in one commit `b9aab5b` (branch-only -- NOT deployed).** Migration `021_chatkit_hardening.sql` APPLIED to prod and verified. 021 alone changes nothing in prod: no deployed code reads the new column/table, so there is no repeat of the S51 gap -- but the protections only go live on the next merge to main.
- 1.1 domain binding: `chatbots.allowed_domains` (hostnames, `*.` wildcard) enforced server-side in both `/api/chat` routes + field in `WidgetConfigForm`. Empty = allow-any so no customer widget broke. The blanket CORS `*` block was REMOVED from `next.config.js` -- it would have emitted a second, conflicting ACAO alongside the per-request one and browsers reject that.
- 1.2: the only owner-less bot is a REAL live client widget (Royal Stroje). Rather than break it, its allow-list was seeded in the migration from observed `chat_conversations.source_url` traffic (`royalstroje.sk`). Internal bots: empty allow-list is now a hard DENY (not allow-all), 500 msg/day cap, and `messages_used` ticks for them too.
- 1.3 rate limiting is **Postgres-backed, not Upstash** as the plan said -- Upstash needs an account + env vars from Martin and the whole point of the Phase 1 block was that it is unblocked. `rate_limits` table + `rate_limit_hit()` RPC, atomic, cross-lambda, per-IP + per-bot in ONE round trip, daily purge cron. It **fails open** on DB error by design (every request still has to clear the credit check before it can cost anything). Swap to Upstash later is a one-file change in `lib/chat/rate-limit.ts`.
- Two flaws found while building, both fixed: the limiter originally sat AFTER the chatbot+KB queries (so unlimited 404s could still hammer Postgres -- moved before), and a supplied `conversationId` was never scoped to its chatbot (one bot could append to another's conversation).
- 1.4: zod on the chat routes; `/api/subscribe` was an open unvalidated pipe into the Brevo list -- now validated + 5/hour. NOTE: zod v4 `.uuid()` is strict about version/variant bits; hand-written test uuids must be well-formed v4 or they 404 before reaching any logic.
- 1.5: CSP on every page (no `unsafe-eval` in prod, `upgrade-insecure-requests` prod-only -- it breaks http://localhost navigation in dev); timing-safe cron secret compare in `lib/auth/cron.ts`, shared by both cron routes.
- 1.6: visitor text is neutralized + framed as untrusted data in the KB-drafting prompt; suspicious drafts get `flagged`/`flag_reason`, a portal warning, and a two-click confirm enforced in the API (not just the UI). Ratings are owner-only, which was already a real gate.
- Verified: domain binding 7/7, input validation 8/8, limiter blocks at exactly limit+1 with correct Retry-After, sanitizer 22/22, cron compare 8/8, 0 CSP violations across 7 pages in a PRODUCTION build (Playwright). tsc + lint + build green. Probe scripts are in the session scratchpad only -- Phase 3.5 should port them.

## Martin's Tasks (detailed -- do these, then report back in chat)

1. **Stripe UAE activation (CRITICAL PATH, start this week):** dashboard.stripe.com -> create account for the FZE: trade license 7813, Emirates ID + residence visa, Wio account details (Wio confirmed working). Verification takes 1-2 weeks and gates Phase 2 payments -- start before anything else.
2. **Supabase auth email templates (10 min):** supabase.com/dashboard -> project `ijfgwzacaabzeknlpaff` -> Authentication -> Emails (Templates tab). For each template slot, open the matching file in `supabase/email-templates/` (5 files: confirm-signup, magic-link, reset-password, email-change, reauthentication), copy the whole HTML into the template Source, Save. Then Authentication -> URL Configuration: Site URL = `https://app.mdntech.org`; add Redirect URLs `https://app.mdntech.org/auth/callback` and `http://localhost:3000/auth/callback`.
3. **ChatKit cron secret + Resend key (5 min):** generate a random 32+ char string. (a) vercel.com -> M.D.N Tech site project -> Settings -> Environment Variables -> add `CHATKIT_CRON_SECRET` = that value (Production) -> redeploy; while there CONFIRM `RESEND_API_KEY` is listed too (add from `.env.local` line 30 if missing). (b) Supabase dashboard -> SQL Editor -> run: `select vault.create_secret('<that value>', 'chatkit_cron_secret');` -- powers both Sunday learning + Monday reports crons; until then they 401 harmlessly.
4. **Dub account for MarketKit B3 (10 min):** sign up at dub.co -> Settings -> API Keys -> Create key (starts `dub_...`) -> paste into `.env.local` as `DUB_API_KEY=dub_...` -> tell the next session "Dub key ready" (it then runs the 5-part go-live runbook in `command-center/MARKETKIT-SETUP.md` B3).
5. **Browser E2E pass (15 min, after 2+3):** `npm run dev` -> log in at `localhost:3000/portal/login` -> open your chatbot: buy a credit pack + unlock a feature (mock checkout, no real charge); rate a reply thumbs-down in Conversations then hit Auto-learning "Run now"; hit Weekly reports "Run now" and check your inbox for the report email. Report anything broken.
6. **Ask Filip:** compliance answers (plan SS2.0b) incl. the B2B evidence approach (VAT ID or ICO + business self-declaration); isHosting docs whenever available (not blocking -- prices already verified).
7. **NEW -- inviting a teammate (since S51):** a signup alone can no longer create staff. Supabase SQL Editor: `insert into team_invites (email, role) values ('kolega@mdntech.org', 'engineer');` (role: `admin` | `engineer` | `viewer`), THEN have them create an account on that exact email. Without the invite row they become an ordinary customer. Confirm the ~50-credit signup promo grant number too (plan SS3.1 leftover).

## What To Do Next -- ChatKit remaining work

**Next session: merge Phase 1 to main, then start Phase 2 (credit bank).** Phase 2 is easier now -- 020 made every billing column service-role-only and 021 established the migration patterns for it.

| Priority | Task | Status / Notes |
|----------|------|----------------|
| 0 | **Merge `feat/landing-rebuild` -> `main`** | `b9aab5b` (Phase 1) is branch-only. Migration 021 is already live on prod but inert until this code deploys. Nothing is broken meanwhile -- just unprotected. Verify after deploy: the Royal Stroje widget still answers on royalstroje.sk (its allow-list is now ENFORCED). |
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
| `MindPalace/Projects/MDN-Tech/MDN-Tech-Launch-Plan-2026-08.md` | MASTER launch checklist (Phases 0-8) -- Phases 0 and 1 fully checked off (S51/S52) |
| `supabase/migrations/020_security_fixpack.sql` | The security model: column grants, invite-only staff, chatbot-limit trigger. Read before touching billing columns or adding tables |
| `lib/auth/team.ts` | Staff identity from the DB (`requireAdmin` guard). `user_metadata` is NOT authoritative -- users can rewrite it |
| `lib/portal/plans.ts` | Billing source of truth -- Phase 2 repricing (credit-priced unlocks, hidden Enterprise pack) lands here |
| `app/api/portal/{chatbot/[id]/purchase,chatbot/[id]/feature,feature}/` | The 3 mock checkout routes -- collapse into one credit purchase + ledger spends (Phase 2) |
| `supabase/migrations/021_chatkit_hardening.sql` | Phase 1 DB half: `allowed_domains`, `rate_limits` + `rate_limit_hit()`, suggestion flags. APPLIED to prod |
| `lib/chat/{cors,rate-limit,schemas,sanitize}.ts` | The Phase 1 public-surface controls: origin matching, durable limiter, zod contracts, injection heuristics |
| `app/api/portal/chatkit/{learning,reports}/run/` | The two ChatKit cron routes (shared `chatkit_cron_secret`; Sun 06:00 / Mon 06:10 UTC) |
| `supabase/email-templates/` | 5 branded auth email templates -- dashboard paste = Martin task 2 |
| `supabase/migrations/` | 001-021; 017-021 APPLIED; 016 (Dub) pending apply after Martin task 4 |
| `decisions.md` | Locked architectural decisions |
