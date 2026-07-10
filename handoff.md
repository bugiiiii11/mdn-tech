# M.D.N Tech -- Handoff

## Session Summary Table

| # | Date | Title | Key changes |
|---|------|-------|-------------|
| 1 | 2026-03-21 | Performance fixes, skills setup | Fixed subpage performance, blog title gradient, added session management skills |
| 2 | 2026-03-21 | Command Center planning, skill restructure | Restructured skills to correct format, created CC PRD, business analysis, and 6-phase development plan |
| 3 | 2026-03-21 | Phase 1: Auth, projects, team, dashboard | Supabase setup, middleware auth, full project CRUD, layout restructure for route groups, Vercel fixes |
| 4 | 2026-03-21 | Phase 2: Communications, budget, knowledge base | Comms log, budget health meters, KB markdown rendering, project tabs with all views |
| 5 | 2026-03-21 | Chatbots KB management | Chatbot CRUD, per-chatbot knowledge base entries, export as unified .md |
| 6 | 2026-03-21 | Phase 3: Infrastructure monitoring | Provider clients for Supabase/Railway/Vercel, API route, dashboard with auto-refresh, Anthropic API key added |
| 7 | 2026-03-23 | RLS fix, params migration, knowledge fix | Fixed RLS infinite recursion, async params for Next.js 15, gray-matter Date coercion, added Royal Stroje project |
| 8 | 2026-03-24 | Phase 4: AI Commander chatbot widget | Embeddable chatbot widget, Claude API streaming, conversation storage, widget config UI, marketing animation fixes |
| 9 | 2026-03-24 | Chatbots dashboard + prompt tuning | Chatbots page stats table with usage metrics, fixed chatbot repeating earlier conversation topics |
| 10 | 2026-04-08 | Mobile UI polish | Blackhole positioning, process steps inline badges, blog button fix, contact section tightening, removed hero badge |
| 11 | 2026-04-16 | Plan lock v2 + Phase 1.1a domain | Reconciled repo plan with Mind Palace draft, locked architectural decisions D1-D6, added PLAN.md pointer, froze old DEVELOPMENT-PLAN.md, configured Supabase MCP, added admin.mdntech.org domain + DNS |
| 12 | 2026-04-17 | Phase 1 complete + Phase 2 portal scaffold | admin.mdntech.org middleware + clean URLs, Phase 1 cleanup done, migration 004 deployed, customer portal at app.mdntech.org with login/signup/dashboard/ChatKit/settings |
| 13 | 2026-04-17 | ChatKit customer portal (Priorities 1-3) | Customer CRUD for chatbots + KB, auto-enroll in product, free-tier 50-msg/mo limit with graceful disable, usage meters on dashboard + detail page |
| 14 | 2026-04-17 | Project data entry + CC schema extension | Portal auth verified, 4 new projects added to CC (MDN-Tech, SignaKit, TradeKit, Good Hair by Zane), Swarm Resistance infra enriched with dev/prod Supabase + Railway, projects table extended with description + metadata JSONB columns |
| 15 | 2026-04-17 | Phase 1 complete -- role cleanup + final projects | Phase 1.2: Documented role simplification (admin-only going forward, schema stays flexible); Phase 1.3: Swarm Resistance infra update SQL + MedaShooterNeo project entry; all internal projects now in CC |
| 16 | 2026-04-17 | Portal analytics + Swarm Resistance display | Chatbot analytics dashboard (metrics, trends, keywords), conversation viewer with message tagging, export to markdown, fixed project duplicates, dev/prod infra display in CC |
| 17 | 2026-04-17 | Build stabilization + runtime fixes | Resolved lint errors (escaping, deps), TypeScript type fixes, moved feedback loading to client-side (RLS compliance), fixed CORS path routing |
| 18 | 2026-04-17 | Portal diagnostics + conversations feature removal | Fixed KB entry link paths (removed /chatbots/ segment), graceful Supabase null handling (.maybeSingle()), removed mixed lock files, disabled interactive conversations viewer in favor of export-only |
| 19 | 2026-04-17 | Phase 2 finalization -- auth hardening | Middleware restructured for role-type checks before routing; login pages reject wrong-portal users; portal pages guard on customer existence; migration 006 sources is_admin() function, fixes handle_new_user() role default, restricts team_members RLS |
| 20 | 2026-04-18 | ToolKit replaces TradeKit in customer portal | Migration 006 applied to Supabase, Phase 2 auth isolation tested; built ToolKit section (10 Claude Code skills + 3 MCP integrations); skipped website rebuild pending product clarity |
| 21 | 2026-04-28 | Strategic pivot to ToolKit-first + portal redesign brief locked | ToolKit promoted to flagship ahead of ChatKit; portal redesign scoped (split shell -- marketing-style vs app-style); top bar replaces sidebar; Dashboard removed; ToolKit goes public; HANDOFF_PAGE_SPEC adopted; 6 decisions logged |
| 22 | 2026-04-28 | Phase A shipped -- portal shell + ToolKit/Handoff page | New top bar replaces sidebar, marketing/app shell variants, public-route middleware for /portal/toolkit, default landing → /toolkit, full Handoff page (Hero + WhatIsIt + OS-aware InstallBlock + SkillCards + PlanKitTeaser + ThirdPartySkills + FAQ), Reveal animation wrapper, source URLs corrected, Marketing Skills card added |
| 23 | 2026-04-28 | Phase B + design consistency pass + post-auth lands on ChatKit | Phase B shipped (analytics inline on chatbot detail, /portal/dashboard deleted, conversations restyled), design consistency pass (auth heading flat white, all primary buttons unified to button-primary, chatbot detail dashboard reworked with Activity card + smart chart empty states), post-auth landing reversed from /toolkit → /chatkit (overrides Session 21 default-landing decision), Karpathy Guidelines added to ToolKit, /save → /doc-update on WhatIsIt card, "+ New chatbot" + form Create + Save widget settings + back-link chips all switched to button-primary / bordered secondary |
| 24 | 2026-04-29 | Phase C + portal root → /toolkit + auth/callback + branded confirm-signup email | Phase C shipped (settings restyle to Activity card pattern, marketing Navbar CTA swapped from "Start Project" to auth-aware Login/Portal, Tools link added to NAV_LINKS, cross-host preconnect tags, /videos/* long-cache + immutable headers), portal-host root → /toolkit (so unauthenticated visitors at app.mdntech.org see the public install page; post-auth landing stays on /chatkit), /auth/callback PKCE handler exchanges code for session and lands user on /chatkit logged-in, branded dark-theme confirm-signup HTML email template (button-primary glass styling, "What's inside" perks), Supabase URL config aligned (Site URL = app.mdntech.org, redirect allow-list updated) |
| 25 | 2026-04-29 | ChatKit + Settings full design pass -- marketing shell + translucent cards everywhere | Session 24's "ChatKit empty-state landing" (priority 1) expanded into a full ChatKit redesign and unified portal design language. /portal/chatkit now uses PortalShell variant="marketing" with starfield ambient, gradient ChatKitHero, BuildKBGuide 3-step onboarding (install Claude Code via VS Code or npm, paste a unified KB-generation prompt into Claude Code, upload as KB entries) using a refactored CodeBlock that renders the copy button in the label header strip when a label is set. Same shell + eyebrow + bold H1 + translucent backdrop-blur cards applied to the other 5 ChatKit pages (new chatbot, detail, edit, KB-entry-new, KB-entry-edit, conversations) and to /portal/settings. Last gradient pink/purple submit button (PortalKBEntryForm "Add to knowledge base") replaced with button-primary so every primary CTA in the portal now uses one style. UsageMeter / EmbedSnippet / WidgetConfigForm cards converted to translucent so the chatbot detail page no longer alternates opaque/translucent surfaces. KBEntryList stays opaque (nested inside translucent KB section parent) |
| 26 | 2026-05-06 | Marketing nav cleanup + Resend SMTP live + 4 branded auth email templates | Tools removed from NAV_LINKS, Login CTA hidden until portal is publicly ready (nav pill recentered with absolute positioning, `MarketingLayout` reverted to sync); Resend domain verified at Hostinger DNS (DKIM + SPF + MX, pre-existing DMARC kept), sending API key wired into Supabase Auth SMTP, live signup test confirms branded confirm-signup arrives from `noreply@mdntech.org`; reset-password / magic-link / email-change / reauthentication HTML templates written, version-controlled in `supabase/email-templates/`, and pasted into Supabase dashboard (flows not yet wired in portal UI -- branding is pre-emptive) |
| 27 | 2026-05-08 | /build-kb skill ships -- portal card + ChatKit shortcut + handoff repo mirror | New `.claude/skills/build-kb/SKILL.md` formalises the BuildKBGuide step-2 prompt as an installable Claude Code slash command; generates 8-section `knowledge-base.md` with **exhaustive Products section** (every parameter the website shows per product); surfaces as a card in `/portal/toolkit` "Skills we use in production" gallery via new `toolkit-skills.ts` entry; `BuildKBGuide` step 2 gets a one-line shortcut hint linking to /portal/toolkit; generic public version mirrored to `bugiiiii11/handoff` so the toolkit Source link resolves |
| 28 | 2026-05-10 | ChatKit pricing pivot -- 4-tier model (Free / Starter / Pro / Max) shipped end-to-end | Three-step pricing iteration in one session: started with $19 / 1000-credit Pro pack (Migration 007), then mid-session refined to $29 / 500 + inline /pricing on /chatkit + counter-increment race fix + headline retitled "Buy credits. No subscriptions.", then full pivot to 4-tier mixed PAYG + subscription (Migration 008): Free $0 (1 chatbot, 30 trial msgs) / Starter $29 PAYG (500 credits/chatbot, lifetime) / Pro $99/mo (2 chatbots, 5K msgs/mo) / Max $299/mo (3 chatbots, 25K msgs/mo). lib/portal/plans.ts becomes single source of truth; lib/chat/usage.ts cap-check branches per-chatbot-lifetime vs account-wide-monthly based on subscription state; cost guards (300 output tokens + KB top-5 × 2000 chars) cap per-message cost ~$0.005. Mock subscription flow (subscribe / upgrade / downgrade / cancel / reactivate) end-to-end tested. Chatbot creation gated by plan's chatbot limit. UI polish pass: 4-card pricing block on /chatkit reduced to single "Manage plan" CTA + table → card-row chatbot list. Real Stripe deferred until merchant account activates |
| 29 | 2026-06-08 | SK agency landing `mdntech.org/sk` + canonical domain aligned to .org | Built Slovak agency landing at `/sk` (7 outcome-led sections, unified value ladder, 3 live client screenshots via Playwright), reciprocal hreflang sk/en/x-default + ProfessionalService JSON-LD + Slovak meta/OG, locale-aware navbar/footer, aligned canonical domain `mdntech.com -> mdntech.org` repo-wide. Part A of the Mind Palace SK brief; Part B (client-repo footer links) deferred |
| 30 | 2026-06-09 | SK hero motto "Expandujte" + full vykanie + leaner hero/footer polish | New hero motto "Expandujte svoj biznis online." (cosmic/expansion theme); removed eyebrow badge + trust badges + description for a leaner luxe hero; fixed mobile blackhole to match EN home; full vykanie across all of /sk; removed for-whom note + value-ladder pricing note; "Zdarma k webu"; Royal Stroje tag Katalog->Command Center + reworded desc; footer socials hidden on /sk |
| 31 | 2026-06-09 | SK mobile blackhole aligned to EN (real fix) + "Prečo my" copy professionalised | Session 30 *believed* it had matched the mobile blackhole but hadn't — the leaner SK hero bottomed out at the `min-h-[650px]` floor while the EN home runs 658-712px, so the blackhole rode high. Fixed by raising SK mobile min-h to 685px (`md:min-h-[650px]` keeps desktop), verified within ±27px of EN (1px match at 390px) via Playwright; added `scripts/measure-hero.mjs`. Rewrote "Prečo my" copy: dropped "boutique" subtitle, "Senior tím + lokálny SK partner" -> "Skúsený tím", dropped freelancer jab + "tri weby" count, "textácie"->"texty", "extrémne rýchlo"->"výrazne rýchlejšie ako klasická IT firma"; dropped "rebrík" in services intro; user copy edits on hero subtitle + portfolio descriptions |
| 32 | 2026-06-17 | Footer contact info on EN + SK | Newsletter/subscribe block removed from both locales; SK footer gets Kontakt column (tel/email/address); EN footer gets Contact column (tel/email) + updated description; dead state + handleSubscribe removed |
| 33 | 2026-07-10 | TechKit Session A -- code complete (schema, poller, alerts, CC pages) | Migration 009 (9 tables + RLS + rollup RPC + seed + A2 key fixes) + 010 pg_cron wiring, `techkit-poller` Edge Function (uptime state machine + Telegram/Resend alerts + rollup/retention), 5 CC TechKit pages replace Infrastructure (redirect kept), sidebar badge, TECHKIT-SETUP.md go-live runbook. Nothing deployed yet -- manual steps pending |
| 34 | 2026-07-10 | TechKit go-live + Railway fix + 3 UI bug fixes | Migrations 009+010 applied via Management API, `techkit-poller` deployed (no CLI -- multipart deploy endpoint), CRON_SECRET everywhere (function secret + Vault + Vercel env + .env.local), 3 pg_cron schedules active and verified, Telegram bot + Resend alert channels wired (ALERT_EMAIL_TO=contact@mdntech.org), A8 kill test passed end-to-end. Railway token demystified (workspace token -- `projects` query not `me`; railway.ts fixed + token added to Vercel env + SignaKit id fixed). Then 3 live-UI bugs fixed from screenshots: incidents ambiguous embed (FK hints), Live-tab 404 (admin-host `/api/` passthrough), Check-now HTML guard. TechKit Session A closed |

## What Was Done (Session 34) -- TechKit go-live: monitoring LIVE, Session A closed

Date: 2026-07-10

Executed the full `command-center/TECHKIT-SETUP.md` runbook in one sitting -- but almost entirely *remotely* via the Supabase Management API (`SUPABASE_MANAGEMENT_API_KEY` in `.env.local`) instead of the SQL editor + CLI the runbook assumed. Martin's only manual inputs: creating the Telegram bot (@BotFather -> `mdn_tech` bot), a sending-only Resend API key, and pasting both into `.env.local`. **Monitoring is LIVE: 7 endpoints checked every 5 minutes, alerts delivering to Telegram + email, A8 exit criterion met.**

1. **Migration 009 applied + verified** -- All objects confirmed post-apply: 9 tables, 18 RLS policies (RLS enabled on all 9), `techkit_rollup_hourly()` + `trg_monitored_endpoints_updated` + `fk_open_alert`, seed roster 9 endpoints (7 active; Royal Works + Swarm Resistance inactive), A2 join-key fixes landed (`'N/A'` railway ids -> null; Vercel ids filled for Good Hair by Zane / TradeKit / SignaKit). **Gotcha #1 (Management API double-execution):** the SQL query endpoint (`POST /v1/projects/{ref}/database/query`) double-executed one request at the HTTP layer (WinHTTP resend), leaving a half-committed state (some tables without policies). Recovery: dropped ALL TechKit objects, verified clean slate, re-applied in one single-shot `HttpClient` request (Expect100Continue off) -> HTTP 201. **Trust the DB state audit, not the HTTP response, when using this endpoint.** **Gotcha #2 (PS 5.1):** `Get-Content -Raw` strings carry ETS note properties that make `ConvertTo-Json` serialize them as objects -- use `[System.IO.File]::ReadAllText()`; also send UTF-8 *bytes* (em-dashes/Slovak chars in SQL get mangled by default encoding).

2. **Seed fix beyond the runbook** -- the seed's `ilike '%mdn%tech%'` project-match can't match the dotted name `M.D.N Tech`, so the 4 mdntech.org endpoints (home, /sk, CC login, portal) seeded unlinked. Linked all 4 to the M.D.N Tech project row post-apply. Kúrenie Turiec stays unlinked (Melicharek has no CC projects row -- known issue #4).

3. **CRON_SECRET provisioned everywhere** -- generated 64-hex via .NET RNG, appended to `.env.local` (gitignored), set as Edge Function secret (Management API `/secrets`), stored in Vault as `techkit_cron_secret`, added to Vercel project env (all environments, `prj_KFLTkdiHxZOsvBVT1AX2cpNAW97I`) + production redeploy triggered and READY -- so the CC "Check now" button works.

4. **`techkit-poller` deployed WITHOUT the CLI** -- Management API multipart deploy endpoint (`POST /v1/projects/{ref}/functions/deploy?slug=techkit-poller`): metadata `{entrypoint_path:"techkit-poller/index.ts", verify_jwt:false}` + 3 file parts preserving relative paths (`techkit-poller/index.ts`, `_shared/supabase.ts`, `_shared/notify.ts`). v1 ACTIVE. Note: local `curl.exe` fails on this machine's TLS interception (exit 35) -- `Invoke-RestMethod`/`HttpClient` work (Windows cert store). Smoke tests: `uptime` -> 7/7 up (160ms-2.1s), `rollup` + `retention` -> ok, wrong bearer -> 401.

5. **Migration 010 applied, cron verified live** -- Vault secret created first, then 010: `pg_cron` + `pg_net` extensions, 3 schedules active (`techkit-uptime` */5m, `techkit-rollup` hourly :05, `techkit-retention` daily 03:45). Verified after two ticks: both `cron.job_run_details` runs `succeeded`, `net._http_response` 2x HTTP 200, 14 rows in `uptime_checks` flowing on schedule.

6. **Alert channels wired (secrets via `.env.local`, never chat)** -- Martin created the Telegram bot + Resend sending-only key and pasted values into `.env.local`; Claude pushed them to Edge Function secrets. `ALERT_EMAIL_TO=contact@mdntech.org`. **Gotcha #3 (Telegram chat id):** the id initially grabbed was the *bot's own* id -> `403 Forbidden: the bot can't send messages to the bot`. Correct chat id comes from `getUpdates` *after messaging the bot* (`chat.id` on Martin's private chat). Both channels then confirmed with direct sends before the kill test.

7. **A8 kill test PASSED (exit criterion)** -- created `kill-test` endpoint pointing at `https://mdntech.org/definitely-404`; check 1 -> `down`, no incident (threshold 2); check 2 -> **critical incident opened, `notified_channels: ["telegram","email"]`** (🔴 Telegram + branded email from `alerts@mdntech.org` both received); URL flipped healthy -> recovery check -> **incident auto-resolved** (🟢 "UP again" Telegram, downtime 1 min), `consecutive_failures` reset, `open_alert_id` cleared; endpoint deleted, incident history retained with `endpoint_id` nulled (FK `on delete set null` working as designed).

8. **Railway token mystery SOLVED -- no new token needed** -- Session A's "regenerate the token" diagnosis was wrong. The existing `RAILWAY_API_TOKEN` is a **workspace token**: it can't answer the account-level `me` query (hence `Not Authorized`) but the top-level `projects` query works fine and returns all 7 Railway projects. Root cause of the broken Live tab was twofold: (a) `lib/infrastructure/railway.ts` used `me { projects }` -- switched to `projects` (works for both token types); (b) `RAILWAY_API_TOKEN` was **never set in Vercel env at all** -- production always showed "not configured"; now upserted (all environments). Deployments query confirmed working with the workspace token. Side finding: Railway projects still carry their random auto-generated names (`athletic-optimism` = AuthVault backend, `airy-embrace` = swarm-resistance-backend-dev, `perceptive-emotion` = swarm-resistance-backend prod, `abundant-learning` = MedaDev, `satisfied-creativity` = Fynder + fallenfrontiers, `honest-enchantment` = @rein/console) -- rename them in the Railway UI for sanity (cosmetic, safe). **SignaKit's `railway_project_id` fixed** in CC (was the domain string, now `e8add7fc-…` = athletic-optimism, matched via service domain). Left for Session B data cleanup: the 'Swarm Resistance dev' row still mixes dev Vercel id with prod URL (prod Railway = `eca1fe73-…`, prod Vercel = `prj_rVes2ZCMkq9SwBdjOKqv5Sym26CX`), and MedaShooterNeo has no infra ids (probable Railway match: `abundant-learning`/MedaDev -- confirm with Martin).

9. **Three live-UI bugs fixed (from Martin's screenshots, commit `f35e0ec`)** -- all diagnosed against the live system before touching code, `tsc`/`lint`/`build` green:
   - **Incidents page "TechKit tables not found"** (false alarm -- tables exist, Overview/Endpoints worked). Real cause: the `alert_events` query embeds `monitored_endpoints(name)`, but `alert_events` reaches `monitored_endpoints` via **two** relationships (`endpoint_id` forward + `open_alert_id` reverse), so PostgREST returns **300 Multiple Choices** and the page's catch-all mislabels it. Fix: explicit FK hints `monitored_endpoints!alert_events_endpoint_id_fkey(name)` + `projects!alert_events_project_id_fkey(name)`. (`app/command-center/techkit/incidents/page.tsx`)
   - **Live tab "Failed to load infrastructure data: HTTP 404"**. Cause: admin-host middleware rewrites every clean path to `/command-center/*` but only passed `/api/chat/` through, so `InfraClient`'s `/api/infrastructure` fetch became `/command-center/api/infrastructure` → 404. Fix: broadened the admin-host passthrough to `/api/` (matches the portal-host block; each API route does its own auth). (`lib/supabase/middleware.ts`)
   - **"Check now" showed "Unexpected token '<', "<html>…"** on some rows. The poller returns clean JSON (verified: all 7 return 200; Swarm Resistance is genuinely `down` -- its backend URL), so this was `checkEndpointNow` calling `res.json()` on a Supabase **gateway** HTML error page (504/546 worker-limit under rapid clicks / cold start). Fix: read `res.text()`, guard `JSON.parse`, return `poller returned HTTP <status> (non-JSON response)` instead of the raw parse error. **Note: the specific screenshot was likely also a stale-server-action-after-redeploy artifact** (page held open across the two redeploys) -- a hard refresh clears that; the guard fixes the genuine gateway-HTML case. (`app/command-center/techkit/actions.ts`)

10. **Repo diff this session**: Session 34 docs + `railway.ts` query fix + the 3 UI fixes. `.env.local` gained `CRON_SECRET`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ALERT_CHAT_ID`, `RESEND_API_KEY`, `ALERT_EMAIL_TO` (all gitignored). Commits: `93757f3` (go-live docs), `90349c5` (Railway), `f35e0ec` (UI fixes).

**Verify on next deploy (Martin):** hard-refresh `admin.mdntech.org/techkit` → Incidents tab should render the resolved kill-test incident (no "tables not found"); Live tab should load provider cards incl. Railway (7 projects); "Check now" should show `up · Xms`. All three pushed to main → Vercel auto-deploys.

**Known data cleanup (Session B):** 'Swarm Resistance dev' CC row mixes dev Vercel id + prod URL (prod Railway `eca1fe73-…`, prod Vercel `prj_rVes2ZCMkq9SwBdjOKqv5Sym26CX`); MedaShooterNeo has no infra ids (likely Railway `abundant-learning`/MedaDev -- confirm); Railway projects still carry random auto-names (rename in UI for sanity); Melicharek + Royal Works have Vercel projects but no CC `projects` rows (Kúrenie Turiec endpoint stays unlinked until Melicharek row exists).

**Next session: TechKit Session B (`command-center/TECHKIT-BRIEF.md` §13) -- providers persistence, deploy webhooks (`techkit-webhook`), stats collectors. The Railway token works (workspace token + `projects` query) -- no regeneration needed.**

## What Was Done (Session 33) -- TechKit Session A: code complete, go-live manual steps pending

Date: 2026-07-10

First execution session of `command-center/TECHKIT-BRIEF.md` (Session A of §13). All *codeable* scope shipped and build-verified; the go-live steps that need Martin's hands (accounts, secrets, deploy, cron scheduling, kill test) are written up as a step-by-step runbook in **`command-center/TECHKIT-SETUP.md`** -- follow it top-to-bottom to turn monitoring on. **Monitoring is NOT live yet.**

1. **A1 -- Migration `supabase/migrations/009_techkit.sql` (NOT yet applied)** -- Full §4 schema: `monitored_endpoints` (uptime targets + per-endpoint alert state machine columns), `uptime_checks` (raw time-series), `uptime_rollups_hourly`, `infra_metrics`, `infra_costs`, `deploy_events`, `alert_rules`, `alert_events`, `techkit_digests`. RLS admin-only (`public.is_admin()`, one SELECT + one ALL policy per table -- migration 006 pattern); `updated_at` trigger reused; `techkit_rollup_hourly(p_hour)` SQL function (security definer, service-role-only execute) does the hourly aggregation incl. p95 via `percentile_cont`, idempotent via upsert. Seed roster: 9 endpoints from brief §11 -- 7 active (mdntech.org home + /sk, CC login, portal /toolkit, kurenieturiec.sk, royalstroje.sk, goodhairbyzane.com), Royal Works + Swarm Resistance seeded **inactive** (URL switch pending / confirm with Martin). ChatKit-widget-API + Rahadu endpoints intentionally not seeded (need stable chatbot id / hosting answer).

2. **A2 -- Projects join-key audit (fixes appended to 009)** -- Audited live DB (read-only via service role) + Vercel API + Railway API. Found & fixed in SQL: literal `'N/A'` strings in `railway_project_id` (M.D.N Tech, Royal Stroje) → null; missing `vercel_project_id` filled for Good Hair by Zane (`zane-kadernictvo`), TradeKit (`trade-kit`), SignaKit (`auth-vault-demo`). **Found, not auto-fixed** (see TECHKIT-SETUP.md "Known issues"): `RAILWAY_API_TOKEN` is rejected (`Not Authorized`) for account-level GraphQL -- the Live tab's Railway panel has likely been silently broken; SignaKit's `railway_project_id` holds a domain instead of an id; 'Swarm Resistance dev' row mixes dev Vercel id with prod URL (prod = `prj_rVes2ZCMkq9SwBdjOKqv5Sym26CX`); Melicharek + Royal Works have Vercel projects but no CC `projects` rows. **Bonus: brief open question 1 answered** -- Swarm Resistance production URL is `https://www.swarmresistance.tech/` (from projects.production_url).

3. **A3 -- Edge Function scaffold `supabase/functions/`** -- `_shared/supabase.ts` (service-role client), `_shared/notify.ts` (Telegram sendMessage without parse_mode for reliability + Resend email with dark branded template matching `supabase/email-templates/`; severity routing critical=email+telegram, warning=telegram, info=in-app only; per-channel try/catch so delivery failure never crashes the poller; returns delivered channels for `alert_events.notified_channels`), `techkit-poller/index.ts` (CRON_SECRET bearer auth; task switch: **uptime** implemented with 10s-timeout fetch, status-range + optional keyword + degraded-latency checks, §6.1 state machine -- down opens critical after 2 consecutive failures, degraded opens warning after 3, one open incident per endpoint via `open_alert_id` guard, recovery notifies with downtime duration; deploy-correlation query included (reads `deploy_events`, empty until Session B); **rollup** calls the RPC; **retention** deletes checks >90d + metrics >365d; providers/stats/costs/digest return 501 stubs for Sessions B-D). `supabase/config.toml` sets `verify_jwt=false`. `tsconfig.json` excludes `supabase/functions` (Deno) from the Next.js typecheck.

4. **A5 -- `supabase/migrations/010_techkit_cron.sql` (apply AFTER function deploy + Vault secret)** -- pg_cron + pg_net extensions, three schedules calling the poller via `net.http_post` with Vault-stored `techkit_cron_secret`: uptime `*/5m`, rollup hourly at :05, retention daily 03:45. Session B-D schedules listed as comments; ops queries included.

5. **A6 -- CC UI: Infrastructure → TechKit** -- Five pages under `app/command-center/techkit/`: **overview** (summary tiles down/degraded/open-incidents, all-green banner, open incidents with ack/resolve, endpoint health grid grouped by project with 24h uptime %, hourly uptime bar, p95 sparkline), **incidents** (filterable full feed, ack/resolve, notified-channels shown), **endpoints** (CRUD table with 7d dense uptime bars + per-row Check now / Pause / Edit / Delete), **endpoints/new + endpoints/[id]** (full form: method, status range, keyword, degraded threshold, interval, project link, active), **live** (existing `InfraClient` unchanged -- T8). Shared `components/command-center/techkit/ui.tsx` (TechKitShell with §7.4 ambient -- glow orbs + vignette, data-density-first; StatusDot/SeverityBadge/UptimeBar/SparklineLatency). **First server actions in the repo** (`app/command-center/techkit/actions.ts`): ack/resolve incident (manual resolve also clears `open_alert_id` so the state machine unblocks), endpoint CRUD/toggle, `checkEndpointNow` (calls poller; needs `CRON_SECRET` in Vercel env -- graceful error until set). Old `/command-center/infrastructure` → redirect; sidebar renamed TechKit + red open-incident count badge (client-side count, 60s refresh, silently 0 until migration applied). Pages degrade gracefully pre-migration ("apply migration 009" notice) and pre-cron ("collecting…").

6. **A7 -- Security pass** -- `.env.local` never committed (`git log --all` empty) and covered by `.gitignore` `.env*.local`; no token rotation needed. Flag stays on the Railway token (broken anyway, see #2).

7. **Verified** -- `tsc --noEmit` clean, `next lint` clean, `next build` green: 5 new `/command-center/techkit*` routes + infrastructure redirect all compile. Runtime behaviour (poller, alerts, cron) is untestable until the manual go-live steps run -- that's A4/A8 in `TECHKIT-SETUP.md`.

**Next session: run the TECHKIT-SETUP.md go-live (Martin's manual steps + A8 kill test together), then TechKit Session B (providers persistence, deploy webhooks, stats).**

## What Was Done (Session 32) -- Footer contact info on EN + SK

Date: 2026-06-17

1. **SK footer: newsletter replaced with contact info** -- Removed the "Zostaň v obraze" heading, newsletter description, email input, and "Odoberať" button from the `/sk` footer. Replaced with a "Kontakt" column: tel `0904 904 091` (clickable `tel:` link), `contact@mdntech.org` (clickable `mailto:`), and office address `Recká cesta 182, 925 26 Senec-Boldog`. Files: `components/main/footer.tsx`. Committed: `3e1e04c`.

2. **EN footer: description updated + newsletter replaced with contact info** -- Description changed from "Full-stack AI engineers building production-ready systems..." to "Web, Apps, SEO, business analysis and process automation for global companies — modern digital solutions from one partner." Newsletter block (heading, description, email input, subscribe button, status messages) removed and replaced with a "Contact" column: tel `+971 58 228 3256` (clickable `tel:` link) and `contact@mdntech.org` (clickable `mailto:`). Social icons (LinkedIn, X, Instagram) kept below the contact info. Files: `components/main/footer.tsx`. Committed: `3e1e04c`.

3. **Dead code removed** -- The now-unused `useState` import, `email`/`isSubmitting`/`status`/`message` state variables, `handleSubscribe` async handler, and newsletter-specific `t` keys (`stayUpdated`, `newsletterDesc`, `emailPlaceholder`, `subscribe`) were all removed. Lint clean post-cleanup.

## What Was Done (Session 31) -- SK mobile blackhole aligned to EN (real fix) + "Prečo my" copy professionalised

Date: 2026-06-09

Polish + copy pass on the SK landing (`mdntech.org/sk`), driven by user review of the live mobile hero and the "Prečo my" section. Committed `6e8ed53`, `f57864c`, `a99d0aa`, `1f2b284`; all pushed to main -> Vercel auto-deploys.

1. **Mobile blackhole aligned to EN home (the real fix)** -- The blackhole video CSS is byte-identical on both heroes (`rotate-180 absolute top-[-355px] left-1/2 ... h-full object-contain`), so its size + vertical position are driven entirely by the hero **container height**, which is content-driven. Session 30's leaner SK hero bottomed out at the `min-h-[650px]` floor at every mobile width, while the EN home's richer copy (extra paragraph) runs **658-712px** on mobile (~684px at 390px) -- so the SK container was shorter and the blackhole rode higher + smaller. **Session 30's note claiming content-reduction matched EN was itself the cause of this regression.** Fix: raised the SK hero's *mobile* min-height to **685px** (midpoint of EN's range; exact match at 390px) via `min-h-[685px] md:min-h-[650px]` -- desktop unchanged. Verified with a Playwright measurement (system Chrome, `channel: 'chrome'`) at 360/390/414px: SK blackhole bottom now within ±27px of EN across the range and a **1px match at 390px** (the user's device width), confirmed visually with mobile screenshots. Files: `components/sk/SkHero.tsx` (+ explanatory comment so this isn't misdiagnosed again). New dev-only diagnostic `scripts/measure-hero.mjs`. Committed `6e8ed53`.

2. **"Prečo my" + assorted SK copy professionalised** -- Why-us subtitle de-jargoned: dropped **"boutique"** -> "Digitálny partner poháňaný AI, ktorý rozumie biznisu a dodáva v rekordnom čase." Six why-us cards reworked: card 6 "Senior tím + lokálny SK partner" -> **"Skúsený tím"** (programmers' experience across webs/apps/portals/AI systems/blockchain + PM methodology, design, latest tech); card 5 "Reálne výsledky" dropped the "tri weby" count (more references coming); card 2 dropped the "žiadny freelancer vám to nedá" jab; cards 1/3/4 tightened ("textácie"->"texty", "extrémne rýchlo"->"výrazne rýchlejšie ako klasická IT firma"). Value-ladder "Čo robíme" intro reworded to drop **"rebrík"**. User layered further edits in commit `a99d0aa "texty"` (hero subtitle -> "...pre slovenských podnikateľov", card 1 "administrátorský portál ... je naším štandardom", card 2 "elimináciu slabých stránok a rast", card 4 "klasická IT firma", card 6 dropped "webov", Royal Stroje + Good Hair portfolio descriptions). Files: `constants/sk.ts`, `components/sk/SkWhyUs.tsx`, `components/sk/SkValueLadder.tsx`. Committed `f57864c`, `a99d0aa`, `1f2b284` (typo "arast"->"a rast" caught in user's edit before deploy).

3. **Verified** -- `tsc --noEmit` clean, `next lint` clean on edited files; blackhole match confirmed via measured geometry + 390px mobile screenshots. Working tree clean, all four commits on `origin/main`.

**Note:** the "Prečo my" copy now implies multiple live references, but `SK_PORTFOLIO` (Realizácie section) still has exactly 3 cards -- add the extra live sites there when ready.

## What Was Done (Session 30) -- SK hero motto + full vykanie + leaner hero/footer polish

Date: 2026-06-09

Polish pass on the SK landing (`mdntech.org/sk`) driven by user review of the live hero. All visitor-facing copy moved to formal **vykanie** for a more professional tone, the hero was slimmed for brevity/luxury, the mobile blackhole was aligned to the EN home, and several content elements were trimmed. Committed `2ae50ad`, pushed to main -> Vercel auto-deploys.

1. **New hero motto + leaner hero** -- `SK_HERO` retitled from "Postavíme a posunieme / tvoj biznis online." to **"Expandujte / svoj biznis online."** The punchy first word "Expandujte" was chosen to tie into the cosmic black-hole / expanding-universe visual (user rejected "Rozšírime" as weak; "Naštartujeme" was the runner-up). Removed the eyebrow badge ("Digitálny partner pre slovenské firmy"), the three trust badges (Web do týždňa / Klientsky portál do mesiaca / 3 živé weby), and the description paragraph -- hero is now just **H1 + one SEO-dense subtitle + 2 CTAs**. Secondary CTA "Pozri realizácie" -> "Pozrite realizácie". Files: `components/sk/SkHero.tsx` (rewritten leaner, dropped `FiCheck` import + eyebrow/description/trustBadges rendering), `constants/sk.ts` (`SK_HERO` shape trimmed).

2. **Mobile blackhole fix (matches EN home)** -- Root cause: the SK hero content **exceeded `min-h-[650px]`** on mobile (eyebrow + 3-4-line headline + description + stacked trust badges), which grew the hero container and pushed the `h-full object-contain` blackhole video lower than on mdntech.org. The video CSS was already byte-identical to the EN hero (`components/main/hero.tsx`); the fix was **purely content reduction** -- the leaner hero now fits the 650px floor, so the container height (and the blackhole) match the EN home (~50% visible under the top bar). No video CSS changed.

3. **Full vykanie across /sk** -- Converted every tykanie instance to formal vy: `constants/sk.ts` (for-whom titles "Začínate?" / "Už podnikáte?" + descriptions, value-ladder steps, why-us, process steps), `SkContact.tsx` (h2 "Povedzte nám o svojom projekte", contact label "Zavolajte", intro, the brand h3 -> "Expandujte svoj biznis online", placeholders "Vaše meno" / "vas.email@priklad.sk" / "Napíšte nám, čo potrebujete…", success/error/limit status messages), `SkValueLadder.tsx` intro ("Začnite tam, kde ste"), `SkPortfolio.tsx` intro ("ktoré si viete pozrieť"). SK meta description also updated to the new motto + vy.

4. **Content removals** -- Deleted the `SK_FOR_WHOM_NOTE` sentence ("Jeden rebrík služieb — líši sa len to, kde nastúpite. Vždy ideme smerom nahor.") and its rendering block (+ now-unused `FiArrowDown` import in `SkForWhom.tsx`). Deleted the value-ladder **pricing-note element** ("Cena na mieru po dohode — sumy vyššie sú len orientačné minimá." + `SK_PRICING.note`) and the now-unused `SK_PRICING` import in `SkValueLadder.tsx` (the `SK_PRICING` export is left in `constants/sk.ts` as dormant data). Price label "Zdarma ku webu" -> **"Zdarma k webu"** (+ matching lowercase in `SK_PRICING.items`).

5. **Royal Stroje portfolio card** -- Tag "Katalóg" -> **"Command Center"**; description reworded from "moderný vzhľad a jasná cesta k dopytu" -> "s admin portálom, automatizáciou procesov a prístupom k databáze" (reflects the actual admin/command-center build delivered).

6. **Footer social icons hidden on /sk** -- The footer is shared and locale-aware (`isSk` via `usePathname`). Wrapped the LinkedIn/X/Instagram block in `{!isSk && …}` so the icons are **removed on `/sk` but kept on the EN/worldwide footer** (conservative -- avoids changing the main brand site without explicit ask). Files: `components/main/footer.tsx`. **Open decision:** if socials should be gone globally, drop the `!isSk` guard + the `socials` array + the three `Rx*Logo` imports.

7. **Verified** -- `tsc --noEmit` clean, `next lint` clean, `next build` green (39 routes, `/sk` static 8.19 kB, down from 8.8 kB). The local `next build` first failed *only* on `next/font` fetching Google Fonts (local TLS/SSL inspection -> `UNABLE_TO_VERIFY_LEAF_SIGNATURE`, same interception that blocked the Playwright Chromium download in Session 29); re-ran with `NODE_TLS_REJECT_UNAUTHORIZED=0` to confirm a green build -- **Vercel is unaffected** (it fetched the same fonts fine in Session 29). Committed `2ae50ad`, pushed to `origin/main`.

## What Was Done (Session 29) -- SK agency landing mdntech.org/sk + canonical domain aligned to .org

Date: 2026-06-08

Built Part A of the Mind Palace SK brief (`MindPalace/Projects/MDN-Tech/SK-LANDING-BRIEF.md`): a Slovak agency landing at `mdntech.org/sk` so the footer backlinks from our 3 live SK client sites land on a localized, indexable page instead of the EN worldwide home. Committed `089780d`, pushed to main -> Vercel auto-deploys.

1. **SK landing route + 7 sections** -- New static route `app/(marketing)/sk/page.tsx` composing 7 outcome-led Slovak sections under `components/sk/`: SkHero ("Postavime a posunieme tvoj biznis online." + CTA "Nezavazna konzultacia zdarma" / "Pozri realizacie"), SkForWhom (Zacinas? / Uz podnikas? -> one value ladder), SkValueLadder (4 pillars in order: Biznis analyza *zdarma* -> Web *od 1 000 EUR* -> SEO *od 500 EUR* -> Automatizacia/systemy *od 3 000 EUR, cena na mieru*), SkWhyUs (6 advantages), SkPortfolio (3 client cards w/ screenshots), SkProcess (4 steps), SkContact (SK NAP + EmailJS form). All copy centralized in `constants/sk.ts`. Tone is outcome-led (owner's language) vs the EN site's feature-led; no ChatKit/Toolkit/pricing self-serve and no social-media service mention (per brief). Reuses the existing design system (button-primary, gradient headings, card surfaces, lib/motion + whileInView) rather than refactoring the hardcoded EN sections.

2. **SEO wiring** -- Reciprocal hreflang sk/en/x-default on both `/sk` and EN home (`app/(marketing)/page.tsx`), self canonical `mdntech.org/sk`, element-level `lang="sk"`, ProfessionalService JSON-LD (areaServed Slovensko, telephone, email, serviceType), Slovak title/description/keywords + OG `sk_SK`, `/sk` added to `app/sitemap.ts` with `alternates.languages`. All verified present in the prerendered `sk.html`. Light-i18n approach (single route, no next-intl, element-level lang) logged as decision D-S29.2.

3. **Canonical domain aligned mdntech.com -> mdntech.org (repo-wide)** -- The repo declared canonical on `.com` everywhere but the live domain is `.org` (`.com` was stale). Swapped in `config/index.ts`, `app/layout.tsx` (both JSON-LD schemas + availableLanguage Slovak), `app/sitemap.ts`, `app/robots.ts` (sitemap host), blog/terms/privacy canonicals + body refs, and `public/llms.txt`. `package.json` GitHub repo URLs left as-is (literal repo name, not SEO). Logged as decision D-S29.1. Follow-up: domain-level `301 .com -> .org` at the registrar if `.com` is still live/indexed.

4. **Locale-aware shared chrome** -- `components/main/navbar.tsx` + `footer.tsx` branch on `usePathname()`: SK nav labels + `/sk#` anchors + logo->/sk and SK footer copy (no UAE address) on `/sk*`; EN path guarded and unchanged (zero regression).

5. **Realizacie screenshots** -- Captured above-the-fold screenshots of kurenieturiec.sk, royalstroje.sk, goodhairbyzane.com via Playwright driving the locally-installed Chrome (`channel: 'chrome'` -- the Chromium download was blocked by local TLS interception/SSL inspection). Saved to `public/portfolio/*.jpg` (next/image serves webp/avif). Reusable script `scripts/capture-portfolio.mjs`; `playwright` added as a devDep (in `yarn.lock` -- removed the stray npm `package-lock.json` to keep a single lockfile). SK contact NAP: call +421904904091, WhatsApp +971582283256, contact@mdntech.org, areaServed Slovensko.

6. **Verified** -- `next build` green (39 routes, `/sk` static 8.8 kB), `tsc` + lint clean, smoke-tested desktop + mobile (all 7 sections render, screenshots load, responsive). A localhost connection-refused the user hit was a dead/premature dev process (nothing listening on 3000), not a code bug -- a fresh `npm run dev` started cleanly on first try.

**Part B is NOT in this repo** -- footer attribution links live in separate repos `melicharek`, `RoyalStroje`, `zane_kadernictvo`; repoint each to `https://mdntech.org/sk` with varied anchor text (per brief) at next touch of that repo.

## What Was Done (Session 28) -- ChatKit pricing pivot: 4-tier model shipped end-to-end

Date: 2026-05-10

This session worked through three iterations of the ChatKit pricing model in a single sitting -- starting from "monthly per-customer" inherited from Session 13, pivoting to "per-chatbot lifetime prepaid", and finally landing on the 4-tier mixed PAYG + subscription model that ships today. The full plan from Session 27's priority 1 closed out, with real Stripe integration deferred until the merchant account is live.

1. **Migration 007 -- per-chatbot lifetime credits + mock checkout (`4010615`)** -- First iteration. Replaced the Session 13 monthly-renewing 50-msg/customer cap with a per-chatbot lifetime model: 50 trial messages then a Pro pack ($19 / 1,000 credits, lifetime, no expiry). Schema added `messages_used` / `credits_purchased` / `plan` to chatbots, a `chatbot_purchases` audit table, and an atomic `increment_chatbot_messages` RPC. Cost guards introduced: `max_tokens: 300` on Claude API calls (~225 words) and KB context capped at top-5 entries × 2000 chars each so input + output stay bounded regardless of how big the customer's KB grows. New `/portal/chatkit/[id]/upgrade` page with mock checkout button granting credits instantly via `/api/portal/chatbot/[id]/purchase`. Public `/pricing` route on marketing host. Files: `supabase/migrations/007_chatkit_credits.sql`, `lib/chat/usage.ts`, `app/api/chat/[chatbotId]/{message,config}/route.ts`, `components/portal/UsageMeter.tsx`, `app/portal/chatkit/[id]/upgrade/page.tsx`, `app/api/portal/chatbot/[chatbotId]/purchase/route.ts`, `app/(marketing)/pricing/page.tsx`.

2. **Inline pricing + reliable counter increment (`ca71711`)** -- Mid-session feedback. Public `/pricing` had no entry point in the marketing nav after Session 26 hid Tools/Login, so moved the content inline as `<ChatKitPricing />` rendered at the bottom of `/portal/chatkit` (signed-in users see it next to their usage state). `/pricing` route deleted. **Counter undercount discovered** during smoke test: 8 messages on Activity, 2 / 50 on Free trial. Root cause: Vercel was terminating the lambda after the SSE stream closed but before the fire-and-forget `incrementChatbotUsage` RPC completed. Fix: pulled the increment into the awaited `Promise.all` alongside the assistant-message insert. Files: `app/api/chat/[chatbotId]/message/route.ts`, `app/portal/chatkit/page.tsx`, `components/portal/chatkit/ChatKitPricing.tsx`. Public `/pricing` deleted.

3. **Counter unification + retitle (`cb377f1`)** -- Activity tile showed 8 (user + assistant), credit counter showed 4 (assistant). Mismatch confused users comparing the numbers. Filtered `getChatbotAnalytics`, `getMessagesTrend`, and the `/portal/chatkit` listing's Messages column to count assistant replies only -- the same unit a credit represents. Pricing headline retitled "Pay once. Use forever." → **"Buy credits. No subscriptions."** (the original was misleading -- credits are finite per pack, only the no-recurring-bill aspect is forever). Files: `lib/portal/analytics.ts`, `app/portal/chatkit/page.tsx`, `components/portal/chatkit/ChatKitPricing.tsx`.

4. **Migration 008 + 4-tier rework (`17741b4`)** -- Major pivot. User flagged that $19 / 1000 credits earns too thin given that the KB skill, embed, and DB management are all included free. New model: **Free $0 / Starter $29 PAYG / Pro $99/mo / Max $299/mo** with per-tier chatbot limits (1 / 1 / 2 / 3) and account-wide monthly message caps for subs (none / none / 5K / 25K). Migration 008 dropped the now-redundant `chatbots.plan` column (the value 'pro' collided with the new sub tier name -- effective per-chatbot tier now derives from `credits_purchased > 0`) and added subscription state on customers (`subscription_plan`, `subscription_status`, `stripe_customer_id`, `stripe_subscription_id`, `current_period_start`, `current_period_end`, `period_messages_used`), a `subscription_events` audit table, atomic `increment_customer_period_messages` RPC, and a lazy `rollover_customer_period` RPC that resets the period counter when the cycle ends. **lib/portal/plans.ts** introduced as single source of truth: PLAN definitions, `tierAtLeast`, `resolveChatbotTier`, `resolveAccountTier`, `isSubscriptionActive` (Stripe-style: canceled subs still grant tier benefits until `current_period_end`), and `hasFeature` gates (conversations / analytics / learning / reports). **lib/chat/usage.ts** rewritten: cap-check branches per-chatbot-lifetime when on Free/Starter, account-wide-monthly when subscribed; increment writes to BOTH counters when subscribed. New account-level `/portal/upgrade` page shows all 4 tiers with context-aware CTAs (Subscribe / Upgrade / Downgrade / Cancel / Reactivate) -- mock subscription API at `/api/portal/subscription` (`POST` to subscribe, `DELETE` to cancel, both insert audit events). Chatbot-level `/portal/chatkit/[id]/upgrade` restricted to Starter pack only. `/portal/chatkit/new` server-side gate blocks creation past the plan's chatbot limit. `/portal/settings` rebuilt with current sub card + cycle info + cancel button. UsageMeter has 3 display modes (trial / starter credits / monthly cap). Pro pack credit count + price changed (1000 / $19 → 500 / $29) so the credit pack stays distinctly priced from the Pro sub. Files: `supabase/migrations/008_chatkit_subscriptions.sql`, `lib/portal/plans.ts`, `lib/chat/usage.ts`, `components/portal/UsageMeter.tsx`, `components/portal/chatkit/{ChatKitPricing,BuyCreditsButton}.tsx`, `components/portal/upgrade/PlanActionButton.tsx`, `app/portal/upgrade/page.tsx`, `app/api/portal/subscription/route.ts`, `app/portal/chatkit/{new,[id]/upgrade}/page.tsx`, `app/portal/settings/page.tsx`, `app/api/portal/chatbot/[chatbotId]/purchase/route.ts`.

5. **CTA cleanup + chatbot list redesign (`a6a690a`)** -- Final polish after smoke testing. ChatKitPricing on `/portal/chatkit` had four redundant per-tier buttons that all routed to `/portal/upgrade` where the same four buttons appeared again -- stripped per-card CTAs and replaced with a single centered **Manage plan** button below the grid (pricing block on /chatkit becomes purely informational). Starter button on `/portal/upgrade` renamed "Buy from a chatbot" → **Buy credits** (clearer, consistent with chatbot-level upgrade CTA). Chatbot listing rebuilt as card-rows: each chatbot gets a pill-shaped tile with bot icon + name + status pill + created date on the left, Convs + Messages as labeled count tiles on the right, purple-glow border on hover -- replaces the old table whose `border-white/[0.06]` row separators were barely visible against the near-black backdrop. Removed the duplicate "+ New" affordance on the table header (ChatKitHero's "+ New chatbot" stays as the single creation entry point). Files: `app/portal/chatkit/page.tsx`, `components/portal/chatkit/ChatKitPricing.tsx`, `app/portal/upgrade/page.tsx`.

6. **Verified end-to-end via mock** -- User upgraded to Pro (1 chatbot → 2 allowed), created chatbot 2, third creation correctly blocked with "Upgrade to Max" prompt. Subscribe / upgrade / downgrade / cancel flows all tested and working. Migrations 007 and 008 both applied to Supabase before each push. Build clean (54 routes), tsc clean, lint clean.

**Pricing model summary (locked):**

| Tier | Price | Chatbots | Messages | Mode | Features |
|------|-------|----------|----------|------|----------|
| Free | $0 | 1 | 30 lifetime / chatbot | trial | KB, embed, basic dashboard |
| Starter | $29 | 1 | +500 lifetime / chatbot | PAYG, no expiry | + conversation viewer + export |
| Pro | $99/mo | 2 | 5,000 / month account-wide | subscription | + trends + keyword analytics |
| Max | $299/mo | 3 | 25,000 / month account-wide | subscription | + weekly reports + chatbot learning |

**Feature gates exist in `plans.ts` (`hasFeature`) but UI surfaces are not yet gated** -- e.g., the chatbot detail page shows the conversation viewer + analytics regardless of tier. Wiring the gates is a follow-up; ungated UI is harmless until the gated features ship (analytics is built; reports + learning aren't).

**Cost economics (Haiku 4.5):** ~$0.005 per assistant reply at 300-token cap. Pro at full utilization = $25 cost vs $99 revenue (~75% margin); Max at full utilization = $125 vs $299 (~58% margin). 25K Max cap is intentional safety -- "unlimited" or 50K Max would push margin negative if a single customer maxes out.

**Real Stripe integration deferred** -- mock checkout flips DB columns directly; sub state is never validated against Stripe. Replacing with real Stripe Checkout + webhook handlers is a focused follow-up session once the merchant account is activated.

**Committed: `4010615`, `ca71711`, `cb377f1`, `17741b4`, `a6a690a`. All pushed to `origin/main` after their respective migrations applied. Vercel auto-deploys to `app.mdntech.org`.**

## What Was Done (Session 27) -- /build-kb skill ships: portal card + ChatKit shortcut + handoff repo mirror

Date: 2026-05-08

1. **`/build-kb` Claude Code skill (project-specific copy)** -- New `.claude/skills/build-kb/SKILL.md` formalises the BuildKBGuide step-2 prompt as an installable slash command. Step 1 asks for exclusions (drafts, internal docs); Step 2 discovers user-facing content via Glob/Grep across `app/(marketing)/**`, `components/main/**`, `command-center/knowledge/docs/`, root markdown, and policy/brand files; Step 3 synthesises into eight sections (General, About, Products, FAQ, Policies, Tone, Pricing, Support) with **Products explicitly exhaustive per product** -- captures everything the website says about each offering (name, tagline, features, parameters, integrations, limits, requirements, pricing-if-shown, install steps, examples, callouts) so a chatbot can answer any visitor question. Skips empty categories; never fabricates content. Step 4 writes `knowledge-base.md` to repo root and reports populated/skipped categories with source files referenced. Files: `.claude/skills/build-kb/SKILL.md`. Committed: `0a75fd6`.

2. **Build KB card on /portal/toolkit** -- New entry in `lib/portal/toolkit-skills.ts` (id `build-kb`, author M.D.N Tech, category `marketing`). Not in `HIDDEN_SKILL_IDS`, so it surfaces as the first card in the "Skills we use in production" gallery on `/portal/toolkit` (public, no auth). Source link points to `github.com/bugiiiii11/handoff/blob/main/skills/build-kb/SKILL.md`. Used `marketing` category to avoid extending `SkillCategory` type + `categoryLabels` map; can split out a `content` category later if more content-generation skills appear. Files: `lib/portal/toolkit-skills.ts`. Committed: `0a75fd6`.

3. **ChatKit BuildKBGuide gets /build-kb shortcut** -- Step 2 of the empty-state onboarding now shows a small gray hint under the prompt CodeBlock: *"Already installed the /build-kb skill? Just type `/build-kb` in Claude Code -- it runs this prompt for you."* The first `/build-kb` reference links to `/portal/toolkit` so users discover the skill if they don't have it; the second is just a `<code>` chip. Primary path (paste the prompt) is unchanged; shortcut is purely additive for users who already installed the skill. Files: `components/portal/chatkit/BuildKBGuide.tsx`. Committed: `0a75fd6`.

4. **Generic SKILL.md mirrored to `bugiiiii11/handoff`** -- The local `.claude/skills/build-kb/SKILL.md` has M.D.N-Tech-specific path examples (`app/(marketing)/**`, `command-center/knowledge/docs/`). The handoff repo serves a generic version with framework-agnostic discovery rules (`app/`, `pages/`, `src/pages/`, `src/routes/`, `routes/`, `public/*.html`) and the same 8-section synthesis. Pushed to `skills/build-kb/SKILL.md` so the **Source** link on the toolkit card resolves instead of 404'ing. README's "four skills" framing intentionally untouched -- `build-kb` is positioned as a companion, not a 5th core skill. Files: `skills/build-kb/SKILL.md` (handoff repo). Committed: `e82599f` (handoff repo).

5. **Local dev verified before push** -- M.D.N-Tech `next dev` on port 3001 (port 3000 was held by a separate Swarm Resistance Vite dev server). `/portal/toolkit` returned 200 with new card present in served HTML (grep'd "Build KB" + "Skills we use in production" + "build-kb"); `tsc --noEmit` clean; no compile warnings beyond stale `caniuse-lite`. `/portal/chatkit` requires a session so the BuildKBGuide shortcut text was visually verified by the user post-deploy.

**Committed: `0a75fd6` (M.D.N-Tech) + `e82599f` (handoff). Both pushed to their respective `origin/main` -- M.D.N-Tech auto-deploys to `app.mdntech.org`; handoff is GitHub-only.**

## What Was Done (Session 26) -- Marketing nav cleanup + Resend SMTP live + 4 branded auth email templates

Date: 2026-05-06

1. **Tools link removed, Login CTA hidden, marketing nav recentered** -- `Tools` entry deleted from `NAV_LINKS` so the public marketing nav reduces from 6 items back to 5 (About Us · Services · Process · Team · Contact Us). Desktop + mobile Login/Portal CTAs removed from `components/main/navbar.tsx` per user direction ("we will enable login/portal button when the portal is ready"). With the right slot empty, the centered nav pill had drifted right under the existing `flex justify-between` layout; switched to absolute-centering (`absolute left-1/2 -translate-x-1/2`) so the pill stays visually centered relative to the viewport regardless of whether the right slot is filled. `MarketingLayout` simplified back to a sync server component (dropped the now-unused Supabase `getUser()` fetch + `isLoggedIn` prop wiring on `<Navbar>`). Files: `constants/index.ts`, `components/main/navbar.tsx`, `app/(marketing)/layout.tsx`. Committed: `643118a`.

2. **Resend SMTP migration complete (closes priority 1 from Session 25)** -- Pure dashboard + DNS work, no code change. Resend account created; `mdntech.org` added as a sending domain at us-east-1; DKIM (`resend._domainkey` TXT) + SPF (`send` MX `feedback-smtp.us-east-1.amazonses.com` priority 10 + `send` TXT `v=spf1 include:amazonses.com ~all`) added to Hostinger DNS at the registrar's standard 14400 TTL; pre-existing `_dmarc` TXT (`v=DMARC1; p=none;`) discovered and left in place. Resend domain verified end-to-end (DKIM + SPF + MX all green). Sending API key (`re_...`) generated with sending-only permission scoped to `mdntech.org`; pasted into Supabase Auth → Emails → SMTP Settings (host `smtp.resend.com`, port `465`, user `resend`, sender `noreply@mdntech.org`, name `M.D.N Tech`). Live signup test confirmed the branded confirm-signup HTML email arrives from the correct sender and the `Confirm and sign in →` button still lands the user on `/auth/callback` → logged-in `/chatkit`. MXToolbox flagged one advisory warning ("SOA Expire Value out of recommended range" at `ns1.dns-parking.com`) which is set by Hostinger's DNS infrastructure and not customer-changeable -- safely ignored.

3. **Four remaining Supabase auth email templates branded** -- Reset Password, Magic Link, Change Email Address, and Reauthentication templates written as version-controlled HTML in `supabase/email-templates/` (matching the existing `confirm-signup.html` pattern: dark-theme card, M brand mark, cyan eyebrow, white H1, `button-primary`-styled CTA glass button, footer with company address). Pasted into Supabase Auth → Email Templates dashboard with subject lines `Reset your M.D.N Tech password` / `Your M.D.N Tech sign-in link` / `Confirm your new M.D.N Tech email` / `Verify your M.D.N Tech identity`. Variations between templates: Reset Password adds a "Security tip" callout; Magic Link adds an OTP fallback box showing `{{ .Token }}` for users who'd rather type a code than click a link; Email Change shows a "From → To" change summary box with old + new addresses; Reauthentication has no CTA button by design (Supabase only sends a 6-digit OTP that the user types back into the app -- large monospace `{{ .Token }}` display in a centered card replaces the button). None of the underlying flows are wired in the portal UI yet (no "Forgot password?" link on login, no email-change form in Settings, no reauth challenge surface) -- branding is pre-emptive so the emails already match when those flows ship. Files: `supabase/email-templates/{reset-password,magic-link,email-change,reauthentication}.html`. Committed: `02760ff`.

**Committed: `643118a` (nav cleanup) + `02760ff` (email templates). Both pushed to `origin/main` → Vercel auto-deploys to mdntech.org + app.mdntech.org.** Local dev tested at `localhost:3001` for the nav change before push; templates are pure assets outside the Next.js build path, so no rebuild needed for #2/#3.

## What Was Done (Session 25) -- ChatKit + Settings full design pass

Date: 2026-04-29

1. **/portal/chatkit redesign** -- Switched to `<PortalShell variant="marketing">` so the starfield ambient appears under the page (matches `/toolkit`). Added centered marketing-style hero (`ChatKitHero`): cyan eyebrow, two-line gradient headline (`AI chatbots / for your website.`), subhead, single primary `+ New chatbot` CTA in `button-primary`. Empty state expands a full-width `BuildKBGuide` below the hero; populated state shows a restyled chatbot table (translucent `bg-[#0d0d20]/80` + `backdrop-blur-sm`) with a small bordered "+ New" affordance, and the same `BuildKBGuide` collapsed inside a `<details>` accordion. Files: `app/portal/chatkit/page.tsx`, `components/portal/chatkit/ChatKitHero.tsx`, `components/portal/chatkit/BuildKBGuide.tsx`. Committed: `5eebe93`.

2. **BuildKBGuide three-step onboarding** -- Server component, three numbered steps with cyan/purple/pink dot accents. Step 1: install Claude Code (primary path is VS Code Extensions search for "Claude Code" + sign in; alt path is `npm install -g @anthropic-ai/claude-code` shown in a labeled `CodeBlock`; link to `docs.claude.com/en/docs/claude-code`). Step 2: copyable prompt that asks Claude Code to scan the project and generate a `knowledge-base.md` organised into General / About / Products / FAQ / Policies / Tone / Pricing / Support, skipping categories without enough info (no invented content). Step 3: paste each section into a new chatbot's KB entries. Initial step 1 pointed to `/portal/toolkit#install` -- corrected because that page only installs the M.D.N skills, not Claude Code itself. Files: `components/portal/chatkit/BuildKBGuide.tsx`. Committed: `dbe81a4`.

3. **CodeBlock copy-button placement fix** -- When a `label` prop is set, the copy button now renders inline with the label inside the header strip (right side, with "Copy" text + Copy/Check icon). Previously the button was an absolute overlay at top-right of the code area, which clipped long lines. Unlabeled `CodeBlock` (used for the manual-fallback `git clone` line in `InstallBlock`) keeps the original absolute-overlay behaviour so behaviour elsewhere is unchanged. Side benefit: `/toolkit` `InstallBlock` also gets the cleaner header layout for free. Files: `components/portal/handoff/CodeBlock.tsx`. Committed: `dbe81a4`.

4. **All other ChatKit pages adopt the same design language** -- Six pages (`/portal/chatkit/new`, `/portal/chatkit/[id]`, `/portal/chatkit/[id]/edit`, `/portal/chatkit/[id]/entries/new`, `/portal/chatkit/[id]/entries/[entryId]/edit`, `/portal/chatkit/[id]/conversations`) all switched to `PortalShell variant="marketing"`. Standardised on `max-w-4xl` (forms) or `max-w-6xl` (data) container with `px-4 md:px-8 py-12 / py-10` padding. Header pattern: existing back-link chip + cyan/80 mono eyebrow + bold `text-2xl md:text-3xl` H1 + gray subhead. Outer cards switched to `bg-[#0d0d20]/80 + border-white/[0.06] + backdrop-blur-sm`. Inner stat tiles + KB entry rows stay opaque on purpose (nested inside translucent parents). Files: 6 page files plus `PortalChatbotForm`, `PortalKBEntryForm`, `UsageMeter`, `EmbedSnippet`, `WidgetConfigForm`. Committed: `2ff0b41`.

5. **Last gradient submit button removed** -- `PortalKBEntryForm` "Add to knowledge base" button was the last `bg-gradient-to-r from-purple-500 to-pink-500` CTA in the portal. Replaced with `button-primary` so every primary action in the portal -- new chatbot, save changes, save widget settings, create KB entry, hero CTA -- now uses one style. The user flagged this in Session 25 along with the broader design pass. Files: `components/portal/chatbots/PortalKBEntryForm.tsx`. Committed: `2ff0b41`.

6. **/portal/settings adopts the same design** -- Old layout was a small icon-chip + heading + Account card with the four tone-tinted stat tiles, written in Session 24. New layout uses the eyebrow + bold H1 + subhead pattern, max-w-4xl container with `py-12`, translucent Account card with `backdrop-blur-sm`. Inner stat tiles unchanged (opaque, tone-tinted icons -- they're nested inside translucent parent). Closes the design pass started in Session 25 commits 1-5. Files: `app/portal/settings/page.tsx`. Committed: `3d51ca9`.

7. **Production smoke test** -- User browser-tested `/chatkit` empty + populated states, install step screenshot reviewed, copy button position confirmed. All four commits (`5eebe93`, `dbe81a4`, `2ff0b41`, `3d51ca9`) pushed to main → Vercel auto-deployed to `app.mdntech.org`. Build passes (50 routes), tsc clean, lint clean.

## What Was Done (Session 24) -- Phase C + portal root pivots to ToolKit + auth/callback + branded confirm-signup email

Date: 2026-04-29

1. **Phase C -- Settings restyle** -- `app/portal/settings/page.tsx` rebuilt to match the chatbot detail Activity card pattern: max-w-6xl container, gradient icon header, 4-tile grid (Email / Name / Company / Member since) with tone-tinted icon dots, support contact link to `contact@mdntech.org`. Replaced the plain heading + 4 fields layout from Sessions 12-19.

2. **Phase C -- Marketing navbar auth-aware** -- `components/main/navbar.tsx` now accepts `isLoggedIn` prop; "Start Project" CTA replaced by **Login** (logged-out → `/portal/login`) or **Portal** (logged-in → `/portal/chatkit`). Same swap applied in mobile menu. `app/(marketing)/layout.tsx` converted to async server component that fetches Supabase user once and passes `isLoggedIn` to Navbar. Cross-host redirect to `app.mdntech.org` is still handled by middleware -- the `/portal/login` and `/portal/chatkit` hrefs work in both dev and prod.

3. **Phase C -- Tools link in marketing nav** -- Added `{ title: "Tools", link: "/portal/toolkit" }` to NAV_LINKS in `constants/index.ts` (between Process and Team). Desktop nav pill widened from `w-[500px]` to `w-[560px]` to fit 6 items. Click on marketing host → middleware 301 → `app.mdntech.org/toolkit` (public, no auth).

4. **Phase C -- Cross-host preconnect** -- `app/layout.tsx` now ships `<link rel="preconnect">` and `<link rel="dns-prefetch">` for both `app.mdntech.org` and `mdntech.org`, so cross-host nav between marketing and portal warms the TLS handshake before users click.

5. **Phase C -- /videos/* immutable cache** -- `next.config.js` adds `Cache-Control: public, max-age=31536000, immutable` for `/videos/:path*`. Blackhole and section background videos hash-named or stable, so a 1-year cache is safe and stops the video re-downloading every page load.

6. **Portal-host root rewrite reversed -- bare URL → /toolkit** -- `lib/supabase/middleware.ts` portal-host root rewrite changed from `'/portal/chatkit'` → `'/portal/toolkit'`. Hitting `app.mdntech.org` with no path now lands the visitor on the public install page (no login wall) so social-driven traffic gets the install page directly. **Post-auth landing stays on /chatkit** -- LoginForm push, signup `emailRedirectTo`, and `/login`-redirect-for-logged-in-user all still go to ChatKit (working surface). Only the bare-URL entry changed. `app/portal/page.tsx` simplified to always redirect to `/portal/toolkit` (drops the auth check that picked between paths). Decision logged as a refinement of Session 23, not a reversal.

7. **/auth/callback PKCE handler** -- New route at `app/portal/auth/callback/route.ts` handles the post-email-confirm `?code=...` redirect. GET handler calls `supabase.auth.exchangeCodeForSession(code)`, sets cookies, then redirects to `?next=/chatkit` (with a `/`-prefix guard to block open-redirect abuse). On failure, redirects to `/login?error=auth_callback_failed`. Middleware `isPublicPortalPath()` extended with `pathname.startsWith('/auth/')` so the callback is reachable before the session exists; marketing-host fallback also exempts `/portal/auth/*`. SignupForm `emailRedirectTo` updated from `/chatkit` → `/auth/callback?next=/chatkit`. Net effect: signup → email click → instant logged-in landing on ChatKit (no second login form).

8. **Branded confirm-signup HTML email template** -- New file `supabase/email-templates/confirm-signup.html`. Email-safe HTML (tables, inline styles, no external CSS/JS) using the M.D.N dark theme: `#030014` body, `#0a0a14` card with `rgba(255,255,255,0.06)` border, cyan eyebrow, white headline, "Confirm and sign in →" CTA, "What's inside" perks card listing free ToolKit + 50 free ChatKit messages + KB-to-chatbot tagline, fallback link, footer with company address + site URL. CTA button initially used a rainbow gradient -- restyled in commit `e76b14b` to match the website's `button-primary`: solid `#1f1135` bgcolor fallback + `linear-gradient(180deg, #2a1547 0%, #160828 100%)` background + 1px `rgba(191,151,255,0.22)` border + inset `rgba(191,151,255,0.18)` glow. Subject line: "Confirm your M.D.N Tech account". User pasted into Supabase dashboard and confirmed render is much better.

9. **Supabase URL configuration aligned (dashboard, no code)** -- User updated:
   - **Site URL** → `https://app.mdntech.org` (was `http://localhost:3000`)
   - **Redirect URLs** → added `https://app.mdntech.org/**` and `http://localhost:3000/**`
   This is what was making confirmation emails redirect to localhost even when the SDK sent the right `emailRedirectTo`. Supabase falls back to Site URL when the redirect URL isn't in the allow-list. Now that both the Site URL and the allow-list are correct, the email link lands on `app.mdntech.org/auth/callback?...` and the new callback handler picks up the code.

10. **Browser smoke test on app.mdntech.org** -- User verified end-to-end on production: marketing CTA flips correctly between Login/Account based on auth state, Tools nav link redirects to `/toolkit`, Settings page shows live customer data, ToolKit public for logged-out visitors, login → ChatKit redirect, signup confirmation email arrives at the right address. Only outstanding gap: signup-to-auto-login (now fixed by Session 24's callback) and SMTP rate limits (queued as Resend migration).

**Committed: `c609298` (Phase C), `9b75266` (root → /toolkit), `7c3cbca` (auth callback + email template), `e76b14b` (email button restyle). All four pushed to main → Vercel auto-deploys to `app.mdntech.org` + `mdntech.org`.** Build passes (50 routes including the new `/portal/auth/callback`), lint clean, tsc clean.

## What Was Done (Session 23) -- Phase B + design consistency pass + post-auth lands on ChatKit

Date: 2026-04-28

1. **Phase B -- chatbot analytics moved inline** -- Removed `app/portal/dashboard/`. Per-bot analytics (4 metric tiles, 7-day trend, top keywords, View conversations + Export Markdown actions) now live inside `app/portal/chatkit/[id]/page.tsx` as an "Activity" card. Stat tiles compacted (`p-3`, `text-xl`) with tone-tinted icon dots (cyan/purple/amber/pink). Smart chart empty states: when historical conversations exist but the last 7 days are empty, render compact "No new messages this week" line instead of empty bar chart; same for keywords when there's not enough text. Charts collapse to single column when only one has data.

2. **Conversations page restyled** -- `app/portal/chatkit/[id]/conversations/page.tsx` wrapped in `<PortalShell>` (was raw gradient div). Filter tabs converted from broken server-component `onClick` to proper `<Link>` query-param tabs (`?filter=fallback`, `?filter=untagged`). Back link points to chatbot detail page (was `/portal/dashboard`). Bad-ownership redirect rerouted to `/portal/chatkit`.

3. **Design consistency pass** -- All primary action buttons unified to `button-primary` class (the subtle purple glass button used in the top bar Login/Account and HandoffHero CTAs): LoginForm Sign in, SignupForm Create account, ChatKit "+ New chatbot", PortalChatbotForm Create/Save, WidgetConfigForm Save widget settings, KB section "+ Add entry". Login heading "Sign in to your **portal**" flat white (gradient span removed). Cancel button on PortalChatbotForm switched to bordered secondary style matching the Edit button on the detail page. Files: `components/portal/auth/{LoginForm,SignupForm}.tsx`, `app/portal/login/page.tsx`, `app/portal/chatkit/page.tsx`, `components/portal/chatbots/PortalChatbotForm.tsx`, `components/command-center/chatbots/WidgetConfigForm.tsx`.

4. **Back links promoted to chip style** -- All 5 chatbot subpages (detail, new, edit, entries/new, entries/[id]/edit) had their tiny `text-xs text-gray-500` "← ChatKit" links promoted to bordered chips with `<ChevronLeft>` icon: `inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-300 border border-white/10 hover:border-white/20 rounded-lg w-fit`. Same secondary-button language as Edit/Cancel so back navigation reads as a real control. Plain `<a>` tags upgraded to Next `<Link>`.

5. **Chatbot detail dashboard rework** -- Header / Activity card / Usage meter / Deploy / Widget config / KB are now distinct visual blocks. Activity card wraps stats + charts + actions in one `bg-[#0d0d20] border border-white/5 rounded-xl p-5` container with action chips (Conversations / Export) in the header instead of orphaned below the charts. KB section also wrapped in card with KB count + categories subtitle. Tighter spacing (`space-y-5` → `space-y-4`), max-width `6xl` to keep things from stretching on wide screens. File: `app/portal/chatkit/[id]/page.tsx`.

6. **Post-auth landing reversed: /toolkit → /chatkit** -- Customers landing on ToolKit after login was a Session 21 decision built around "free tools they came for", but in practice ChatKit is the working surface customers log in to *use* — ToolKit stays the public, no-auth marketing destination linked from social. Changed in 5 places: middleware portal-host redirect (logged-in user hitting `/login`), middleware portal-host root rewrite (`/` → `/portal/chatkit`), middleware marketing-host fallback redirect, LoginForm `router.push`, SignupForm `emailRedirectTo`, and the portal root server redirect (`app/portal/page.tsx`). Files: `lib/supabase/middleware.ts`, `components/portal/auth/{LoginForm,SignupForm}.tsx`, `app/portal/page.tsx`. Decision logged in `decisions.md` (overrides Session 21 entry).

7. **Karpathy Guidelines skill added to ToolKit** -- New entry in `lib/portal/toolkit-skills.ts`: `karpathy-claude-md`, author `forrestchang`, category `safety`, source `github.com/forrestchang/andrej-karpathy-skills`. CLAUDE.md guidelines derived from Andrej Karpathy's observations on LLM coding pitfalls (Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven Execution).

8. **WhatIsIt third card swapped from /save to /doc-update** -- Replaced `/save` framing ("Context window dies mid-task" + AlertTriangle icon) with `/doc-update` framing ("Docs go stale the moment I move on" + RefreshCw icon). The 4 free skills are still all present in `SkillCards`; the 3-pain "What it solves" overview now leads with start → wrap → doc-update as the everyday loop. File: `components/portal/handoff/WhatIsIt.tsx`.

9. **Stale .next cache cleanup** -- Local dev server was returning 500s on JS chunks (MIME-type errors) after deleting `/portal/dashboard` mid-session. Renamed stale `.next` to `.next-stale-1777403470` and added `/.next-stale-*/` to `.gitignore` so it won't show up in `git status`. User confirmed dev server recovered after restart.

**Committed: `92b6fa2` (Phase B + design pass + auth pivot), `4742d6f` (form buttons + back link chips). Both pushed to main → Vercel auto-deploys to `app.mdntech.org`.** Build passes (38 routes, `/portal/dashboard` gone), lint clean. User browser-tested at app.mdntech.org and confirmed chatbot detail looks clean and login lands on ChatKit.

## What Was Done (Session 22) -- Phase A shipped: portal shell + ToolKit/Handoff page

Date: 2026-04-28

1. **New portal top bar** -- Replaces sidebar with sticky/fixed top bar containing 4 nav items (ToolKit · ChatKit · Settings · Home → mdntech.org) plus auth-aware right action (Login button when logged out; Account dropdown with Sign out + Marketing site link when logged in). Mobile hamburger pattern matches marketing site. Files: `components/portal/PortalTopBar.tsx`. Top bar uses `position: fixed` + main `pt-[65px]` so it stays pinned during scroll.

2. **PortalShell variant system** -- Rewrote `components/portal/PortalShell.tsx` as async server component accepting `variant?: 'marketing' | 'app'` (default `'app'`). Marketing variant renders ambient `StarsCanvas` background; app variant is plain dark `#0a0a1a`. Existing pages (dashboard, chatkit, settings, signakit, tradekit) keep their `<PortalShell>` calls and pick up the default app variant -- no per-page changes needed for Phase A.

3. **Blackhole removed from portal** -- Decision refined from Session 21: blackhole video stays on marketing landing page only; portal marketing variant gets stars-only ambience. `components/portal/PortalBackground.tsx` now renders only `StarsCanvas` (dynamic-imported with `ssr:false` to avoid Three.js SSR issues).

4. **Public-route middleware change** -- `/portal/toolkit/*` is now publicly accessible (no auth wall) so the install page works as the canonical destination linked from social posts. Added `isPublicPortalPath()` helper covering `/`, `/login`, `/signup`, `/toolkit/*`. Localhost detection added (`isLocalDev()`) to skip the production host redirect during dev so `localhost:3001/portal/*` doesn't bounce to `app.mdntech.org`. Files: `lib/supabase/middleware.ts`.

5. **Default landing changed to ToolKit** -- Post-login redirect on portal host: `/login → /toolkit` (was `/dashboard`). Signup `emailRedirectTo: '/toolkit'`. Login form push: `/portal/toolkit`. Marketing-host fallback redirect also updated. Dashboard route still exists pending Phase B deletion.

6. **Login + Signup full marketing shell** -- Both pages converted from client components to server pages wrapping `<PortalShell variant="marketing">` with extracted `LoginForm` / `SignupForm` client components in `components/portal/auth/`. Stars background + cinematic hero treatment matches marketing-style entry. Login form reads `?error=unauthorized` query and surfaces it inline.

7. **ToolKit page rebuilt around HANDOFF_PAGE_SPEC** -- `app/portal/toolkit/page.tsx` is now a server component with no auth guards (public). Composes 7 sections in `components/portal/handoff/`:
   - `HandoffHero` -- gradient headline, eyebrow, dual CTAs (Install scroll + GitHub external)
   - `WhatIsIt` -- 3-column problem→solution grid (Clock / FileText / AlertTriangle icons)
   - `InstallBlock` -- OS-aware default tab via `navigator.platform` detection, `<CodeBlock>` with copy-to-clipboard + 2s `Copied ✓` callout, manual fallback `<details>`, verify step, uninstall one-liner. PowerShell + bash command sets included.
   - `SkillCards` -- 2×2 grid of `/start`, `/wrap`, `/save`, `/doc-update` with example snippets and `View source →` links to `github.com/bugiiiii11/handoff/blob/main/skills/<name>/SKILL.md`
   - `PlanKitTeaser` -- coming-soon paid tier card with GitHub watch + waitlist mailto
   - `ThirdPartySkills` -- curated 5-card grid (UI/UX Pro Max, SEO Audit, Marketing Skills, Frontend Design, Claude API)
   - `FAQ` -- 5 `<details>` accordions with chevron indicator

8. **Reveal animation wrapper** -- `components/portal/handoff/Reveal.tsx` is a client wrapper using framer-motion `whileInView` + `viewport={{ once: true, margin: '-80px' }}` + fade-up `{ y: 30, opacity: 0 } → { y: 0, opacity: 1 }` over 0.6s `easeOut`. Same vibe as marketing's `slideInFromTop` / process-card variants. Sections wrap their content with `<Reveal>` and `<Reveal delay={0.05 + i * 0.08}>` for staggered card grids.

9. **Section dividers removed** -- All `border-t border-white/5` between sections removed for cleaner flow. Internal card hairlines (between problem/solution, meta/source) stay -- they're decorative, not section dividers.

10. **Third-party skill source URLs corrected** -- Original `installationUrl` values pointed at non-existent `github.com/anthropics/claude-code/skills/<name>` paths. Fixed to canonical sources: `frontend-design` and `claude-api` → `github.com/anthropics/skills/tree/main/skills/<name>`; `ui-ux-pro-max` → `github.com/nextlevelbuilder/ui-ux-pro-max-skill`; `seo-audit` → `github.com/AgriciDaniel/claude-seo`. Author labels updated for honesty (Anthropic vs nextlevelbuilder vs AgriciDaniel vs Corey Haines). Section heading changed from "Anthropic skills we use" → "Skills we use".

11. **Marketing Skills card added** -- New entry in `lib/portal/toolkit-skills.ts` for Corey Haines' marketing skill collection at `github.com/coreyhaines31/marketingskills`. Category: marketing.

12. **Simplify card removed** -- No verifiable canonical source after web search; entry deleted from `toolkit-skills.ts` rather than render with a guessed URL.

13. **Old ToolKitContent.tsx deleted** -- The previous client gallery component was fully replaced by the new section components. Layout simplified to remove duplicate background color.

**Committed: `3661cca`. Pushed to main → Vercel auto-deploys to `app.mdntech.org`.** Build passes (38 routes), lint clean. Browser-tested in incognito at localhost:3001/portal/toolkit, /portal/login, /portal/signup -- all sections render, OS detection works (Windows pre-selected), copy-to-clipboard shows `Copied ✓`, mobile hamburger works, Account dropdown signs out correctly, source links resolve.

## What Was Done (Session 21) -- Strategic pivot to ToolKit-first + portal redesign brief locked
Date: 2026-04-28

Discussion / planning session. No code changes. All outputs are decisions and a build brief for the next implementation session.

1. **Strategic pivot -- ToolKit becomes flagship** -- Promoted ToolKit ahead of ChatKit as the primary acquisition product. ChatKit pricing/voice/auto-learning sequence (Session 20 plan) deferred behind a portal redesign and ToolKit/Handoff page rebuild. Rationale: Handoff (4 free MIT-licensed Claude Code skills) is a low-cost, high-distribution acquisition surface targeting Claude Code developers -- the exact audience that buys ChatKit/SignaKit later. ChatKit monetization without a funnel feeds an empty pipe.

2. **Portal redesign brief locked** -- Two visual shell variants. Marketing-style (stars + blackhole + cinematic) on `/portal/toolkit`, `/portal/login`, `/portal/signup`. App-style (plain deep dark, no video, no stars) on `/portal/chatkit/*`, `/portal/settings`. Same top bar / fonts / palette / button styles tie them together. Rationale: audience is developers; tools they trust (Vercel, Linear, Stripe, Supabase, GitHub) don't decorate working surfaces -- but marketing-style is correct for marketing surfaces. Split treatment gives "wow" entry + crisp work tools.

3. **IA flattened: top bar replaces sidebar** -- Portal sidebar removed. Top bar with 4 items: ToolKit · ChatKit · Settings · Home (Home links back to mdntech.org). Logged-out top-right = "Login"; logged-in on marketing = "Portal"; logged-in on portal = "Home". Mobile uses hamburger pattern matching marketing site.

4. **Dashboard removed; default landing = ToolKit** -- Standalone `/portal/dashboard` page goes away. Chatbot analytics (metrics, 7-day trend, keywords, export) move inline into `/portal/chatkit/[id]`. After login, customers land on `/portal/toolkit` -- their first impression is the free tools they came for.

5. **Public-route exception for ToolKit** -- `/portal/toolkit/*` becomes publicly accessible (no auth wall). `/portal/chatkit/*` and `/portal/settings/*` stay gated. Middleware change required to distinguish these paths before the existing portal-host login redirect. Rationale: ToolKit is the install destination linked from social posts; signup-before-install kills the funnel.

6. **ToolKit MVP content scoped** -- Visible cards: (a) Handoff -- one bundled card replacing individual `/start` and `/wrap` cards, links to install flow per spec; (b) PlanKit teaser -- "coming soon · paid"; (c) third-party Anthropic Skills -- UI/UX Pro Max, SEO Audit, Frontend Design, Simplify, Claude API. Hidden for MVP: M.D.N Tech-only auxiliaries (CMO, Test, Security Review) -- they stay in `lib/portal/toolkit-skills.ts` data but are filtered out of the visible gallery. ToolKit name preserved so PlanKit + future tools have a stable home.

7. **Build phasing locked** -- Phase A: portal shell (top bar + marketing/app shell variants) + Login/Signup full-shell + public-route middleware change + ToolKit page rebuilt around Handoff (hero, OS-aware install block, skill cards, PlanKit teaser, FAQ). Phase B: ChatKit pages restyled (app shell) + analytics moved inline + empty states + delete `/portal/dashboard` route. Phase C: Settings restyle + marketing site top-bar swap (Login/Portal) + homepage Tools link/card pointing to ToolKit.

8. **HANDOFF_PAGE_SPEC adopted** -- Build brief at [command-center/HANDOFF_PAGE_SPEC.md](command-center/HANDOFF_PAGE_SPEC.md). Spec was written for a Vite/React/react-router-dom stack; portal implementation will adapt sections (`<HandoffHero />`, `<WhatIsIt />`, `<InstallBlock />`, `<SkillCards />`, `<PlanKitTeaser />`, `<FAQ />`) to Next.js 15 App Router. Install block UX (OS-aware default tab via `navigator.platform`, copy-to-clipboard, manual fallback `<details>`, verify step, uninstall one-liner) is the most important section per spec -- treated as primary feature.

9. **Decisions logged** -- 6 entries appended to [decisions.md](decisions.md): (a) strategic pivot to ToolKit-first; (b) top bar replaces sidebar; (c) Dashboard removed; (d) public-route exception for ToolKit; (e) visual treatment split (marketing vs app shells); (f) ToolKit MVP content scope.

10. **No code changes** -- Working tree was clean at session start; `HANDOFF_PAGE_SPEC.md` moved from repo root to `command-center/` to match existing brief locations.

## What Was Done (Session 20) -- ToolKit replaces TradeKit in customer portal
Date: 2026-04-18

1. **Applied migration 006 to Supabase** -- Deployed auth hardening schema: sourced `is_admin()` function, fixed `handle_new_user()` trigger role default, restricted `team_members` SELECT RLS to admins only. Optional part 4 (inline admin check refactoring) deferred to Phase 3. Verified via test screenshots: customer → admin host rejects with "unauthorized", admin → portal host rejects with "This login is for customers only".

2. **Strategic product pivot: ToolKit replaces TradeKit** -- Decided to move TradeKit to admin-only (internal testing), launch ToolKit as customer product instead. Rationale: ToolKit niche aligns with ChatKit (no-code AI) + SignaKit (auth) for developers. Messaging: "From idea to production-ready systems — faster, smarter, secure." Freemium model: free tier for skill discovery + premium for advanced skills/custom apps.

3. **ToolKit section built** -- New customer portal product at `/portal/toolkit` with 10 featured Claude Code skills + 3 MCP integrations. Skills: wrap, start, CMO, test, security-review (M.D.N Tech owned) + ui-ux-pro-max, seo-audit, frontend-design, simplify, claude-api (verified third-party). MCPs: Supabase, TradingView, Unity with setup guides. Gallery cards show category, description, use cases, copy-to-clipboard buttons. Files: `lib/portal/toolkit-skills.ts` (data), `app/portal/toolkit/page.tsx` (server page), `components/portal/toolkit/ToolKitContent.tsx` (client gallery), `components/portal/PortalShell.tsx` (nav update). Committed: `f867328`.

4. **Updated portal navigation** -- Replaced TradeKit → ToolKit in sidebar. Portal products now: Dashboard → ChatKit → SignaKit (Coming Soon) → ToolKit → Settings. Visually consistent with existing portal dark theme + glassmorphism cards.

5. **Next session priorities locked** -- ToolKit needs: prompt templates + integration recipes (Tier 1 content, ships fast). Then SignaKit section (auth product portal UI). Website rebuild deferred until product wording is finalized.

6. **ChatKit improvement plan scoped** -- Strategic shift: complete ChatKit before continuing ToolKit. Three improvement areas planned with build sequence: (a) **Pricing tiers** -- Free $0/50msg, Pro $29/2000msg, Max $79/10000msg, Enterprise custom. Margins 49-72%. Free tier is the trial (no separate trial period). (b) **Voice** -- Cartesia Sonic-3 selected (90ms latency, $4/mo Pro, growing multilingual). Bundled in Max tier, $10/mo add-on for Pro. Free tier stays text-only. (c) **Auto-learning MVP** -- Flag + Weekly Report pattern: owners flag wrong messages, Sunday cron sends to Claude for analysis, generates weekly report with KB suggestions. Uses existing `message_feedback` table. ~5 hours build. **Build order:** Pricing + Stripe first (~10 hours), then Auto-learning (~5 hours), then Voice (~6 hours). Pricing page lives on both marketing site (`/pricing`) and portal (`/portal/upgrade`). Stripe account creation pending on user side; UI + schema work can proceed in parallel.

## What Was Done (Session 19) -- Phase 2 finalization -- auth hardening
Date: 2026-04-17

1. **Middleware restructure** -- `lib/supabase/middleware.ts` now performs session refresh BEFORE URL routing (was unreachable for subdomains before). Added role-type checks using `user.user_metadata.account_type`: customers trying to access admin host redirect to admin login with error=unauthorized; admins trying to access portal redirect to portal login with error=unauthorized. Files: `lib/supabase/middleware.ts`. Committed: `d0be6bb`.

2. **Login page account-type verification** -- Portal login (`app/portal/login/page.tsx`) rejects non-customer accounts post-auth, signs out + shows error "This login is for customers only". CC login (`app/command-center/login/page.tsx`) rejects customer accounts post-auth, signs out + shows error "Customers use app.mdntech.org". Both use `user.user_metadata.account_type` check after successful `signInWithPassword()`. Committed: `d0be6bb`.

3. **Portal page customer guards** -- Added `if (!customer) redirect(...)` guards to `app/portal/dashboard/page.tsx`, `app/portal/settings/page.tsx`, `app/portal/chatkit/page.tsx` to reject admins accessing portal pages. Changed settings `.single()` to `.maybeSingle()` for graceful null handling. Made `app/portal/layout.tsx` async with defensive session check. Files: dashboard, settings, chatkit, layout. Committed: `d0be6bb`.

4. **Migration 006 -- auth hardening schema** -- Created `supabase/migrations/006_auth_hardening.sql` to source-control three critical fixes: (a) `create or replace function public.is_admin()` — function was referenced by 10+ RLS policies but never defined in migrations; (b) Fixed `handle_new_user()` trigger to use `coalesce(new.raw_user_meta_data->>'role', 'admin')` instead of hardcoded 'admin' for team signups; (c) Fixed `team_members` SELECT RLS from permissive `using (true)` to `using (is_admin())` so customers cannot enumerate staff. Migration is safe to run (CREATE OR REPLACE is idempotent). Committed: `d0be6bb`.

5. **Email callback URL fixes** -- Fixed double-prefix bug on subdomain email redirects: Portal signup emailRedirectTo changed from `/portal/dashboard` to `/dashboard` (middleware rewrites clean paths to `/portal/*`); CC login magic link emailRedirectTo changed from `/command-center/dashboard` to `/` (admin host root redirects to dashboard). Files: `app/portal/signup/page.tsx`, `app/command-center/login/page.tsx`. Committed: `d0be6bb`.

**Critical auth isolation gap fixed:** Customers could previously reach `/command-center` and admins could reach `/portal` by navigating after login. Middleware now rejects cross-portal access before URL routing. Page-level guards provide second layer of defense.

## What Was Done (Session 18) -- Portal diagnostics + conversations feature removal
Date: 2026-04-17

1. **KB entry link path fix** -- Removed extra `/chatbots/` segment in KBEntryList path construction. Component was adding `/chatbots/` even when basePath already pointed to chatbot collection. Portal passes `basePath="/portal/chatkit"`, creating incorrect `/portal/chatkit/chatbots/{id}` paths. Now uses `${basePath}/${chatbotId}/entries/{entryId}/edit`. Files: `components/command-center/chatbots/KBEntryList.tsx`. Committed: `48d5d53`.

2. **Graceful null handling for product usage** -- Changed UsageMeter product_usage query from `.single()` to `.maybeSingle()` to handle new customers with no usage records (was throwing 406 Supabase error). Similarly changed dashboard customer query to `.maybeSingle()`. Files: `components/portal/UsageMeter.tsx`, `app/portal/dashboard/page.tsx`. Committed: `7a954c3`.

3. **Build configuration cleanup** -- Removed `package-lock.json` to eliminate "mixed package managers" warning. Project uses yarn.lock, not npm. Removed unused `MessageSquare` icon import causing build failure. Committed: `092e7cc`.

4. **Removed interactive conversations viewer** -- Disabled "View Conversations" button from portal dashboard; kept "Export as Markdown" which works reliably. The interactive viewer had cascading issues (KB link bugs, RLS complexity on feedback queries, Supabase null handling). Export-only approach provides same data in more portable format. Files: `app/portal/dashboard/page.tsx`. Committed: `140da8b`.

## What Was Done (Session 17) -- Build stabilization + runtime fixes
Date: 2026-04-17

1. **Build linting errors resolved** -- Fixed unescaped apostrophe in dashboard text (react/no-unescaped-entities) and missing `limits` useEffect dependency. Files: `app/portal/dashboard/page.tsx`, `components/portal/UsageMeter.tsx`. Committed: `a541f02`.

2. **TypeScript type fixes** -- Added explicit type annotations for word processing in analytics (word parameter type, words array type). Fixed "Parameter implicitly has 'any' type" errors. Files: `lib/portal/analytics.ts`. Committed: `70b6460`.

3. **Conversations page 500 error fixed** -- Moved message feedback loading from server-side (RLS complexity) to client-side via new POST `/api/portal/feedback/load` endpoint. Server now only fetches conversations/messages (simplified). Feedback loads asynchronously on client with proper `customer_id` filtering for RLS. Files: `lib/portal/analytics.ts`, `components/portal/analytics/ConversationViewer.tsx`, `app/api/portal/feedback/load/route.ts`. Committed: `f7a9175`, `7f79292`.

4. **CORS redirect errors fixed** -- Made `KBEntryList` component context-aware with `basePath` parameter. Portal now passes `basePath="/portal/chatkit"` instead of reusing hardcoded admin paths. Prevents cross-origin preflight failures. Files: `components/command-center/chatbots/KBEntryList.tsx`, `app/portal/chatkit/[id]/page.tsx`. Committed: `7143cd4`.

## What Was Done (Session 16) -- Portal analytics + Swarm Resistance display

1. **Fixed duplicate projects** — Removed duplicate entries in projects table (caused by double SQL execution). Result: 7 unique projects, 0 duplicates. Used ROW_NUMBER() window function cleanup query in `cleanup-duplicates.sql`.

2. **Portal dashboard redesign** — Replaced product cards grid (ChatKit/SignaKit/TradeKit) with analytics section:
   - 4 metric cards: Total Messages, Conversations, Fallback Rate (%), Avg Messages/Conversation
   - 7-day message trend chart (CSS bars, no external dependencies)
   - Top 10 keywords asked about (horizontal bar chart)
   - Action buttons: View Conversations, Export as Markdown, Upgrade to Pro
   - Files: `app/portal/dashboard/page.tsx`. Committed: `b0555a6`.

3. **Conversation viewer page** — New `/portal/chatkit/[id]/conversations` page:
   - Expandable conversation cards (visitor ID, date, message count)
   - Per-message feedback buttons: Correct / Incorrect / Helpful / Not helpful
   - Fallback message highlighting (amber border for "I don't know" responses)
   - Filters: All / Fallback Only / Untagged messages
   - Files: `app/portal/chatkit/[id]/conversations/page.tsx`, `components/portal/analytics/ConversationViewer.tsx`. Committed: `b0555a6`.

4. **Analytics library** — Created `lib/portal/analytics.ts` with core functions:
   - `getChatbotAnalytics()` — calculate metrics (total messages, conversations, fallback rate, avg)
   - `getMessagesTrend()` — 7-day daily message counts
   - `getTopKeywords()` — tokenize user messages, filter 100+ stopwords, count frequency
   - `getConversationsWithMessages()` — paginated load with filter support
   - `exportConversationsMarkdown()` — full export with date/time per message
   - Fallback detection via string-match against chatbot's configured `fallback_message`

5. **Chart components** — Pure CSS/SVG, no external dependencies:
   - `TrendChart.tsx` — 7-bar vertical chart with hover labels
   - `KeywordsBar.tsx` — horizontal bar chart with gradient fills
   - Files: `components/portal/analytics/{TrendChart,KeywordsBar}.tsx`. Committed: `b0555a6`.

6. **Database migration & API routes**:
   - Migration 005: `message_feedback` table (id, message_id FK, chatbot_id FK, customer_id FK, rating ENUM, created_at, UNIQUE constraint). RLS: customers rate messages for their own bots.
   - Export API: `GET /api/portal/chatbot/[chatbotId]/export` → markdown file download with full conversation history
   - Feedback API: `POST /api/portal/feedback/[messageId]` → save/update message rating (correct/incorrect/helpful/not_helpful)
   - Files: `supabase/migrations/005_message_feedback.sql`, `app/api/portal/chatbot/[chatbotId]/export/route.ts`, `app/api/portal/feedback/[messageId]/route.ts`. Committed: `b0555a6`.

7. **Swarm Resistance dev/prod display** — Updated `ProjectTabs.tsx` to render `metadata.infrastructure` from database:
   - Shows Dev Environment block (Supabase ref + Railway backend)
   - Shows Prod Environment block (Supabase ref + Railway backend)
   - Shows Auth Service block (SignaKit details for Swarm Resistance)
   - Seamlessly integrates with existing flat infrastructure columns
   - Files: `components/command-center/projects/ProjectTabs.tsx`. Committed: `b0555a6`.

## What Was Done (Session 14) -- Project data entry + CC schema extension

1. **Portal auth hardening verified** — Created test customer account ("Zane AI") via app.mdntech.org signup flow; created chatbot through customer portal; confirmed signup → login → dashboard → create chatbot flow is fully functional end-to-end. ✅

2. **4 new projects inserted into CC database:**
   - **MDN-Tech** — Internal company portal + Command Center (status: development, start: 2026-03-21, Supabase: ijfgwzacaabzeknlpaff)
   - **SignaKit (AuthVault)** — Web3Auth replacement, SaaS product for app.mdntech.org (status: development, start: 2026-03-25, Supabase: hldkdiibvsdtgxnqaaxq, Railway: authvaultbackend-production.up.railway.app)
   - **TradeKit** — BTC perpetual futures trading bot, SaaS product for app.mdntech.org (status: development, start: 2026-03-01, Supabase: gseztkzguxasfwqnztuo, bankroll: $500.26 USDC)
   - **Good Hair by Zane** — Hair salon website, deployed client project (status: deployed, start: 2026-03-28, Vercel hosted, SEO score 62/100)

3. **Swarm Resistance infrastructure enriched with dev/prod details** — Updated existing "Swarm Resistance dev" project metadata to include:
   - Dev Supabase: upeefkqhaxlhqcvoizve, Railway: swarm-resistance-backend-dev-production.up.railway.app
   - Prod Supabase: yjwminnwcijgfqrwjkfn, Railway: swarm-resistance-backend-production.up.railway.app
   - Auth service reference: SignaKit (Supabase hldkdiibvsdtgxnqaaxq, Railway authvaultbackend-production.up.railway.app)
   - Enables CC to monitor health of both dev and prod infrastructure simultaneously.

4. **Projects table schema extended** — Added two new columns:
   - `description text` — project overview (for all projects)
   - `metadata jsonb` — flexible storage for phase, current_focus, infrastructure details, product info, etc. (structured for future Mind Palace ↔ CC sync)

5. **SQL reference document created** — [PROJECTS_INSERT.md](PROJECTS_INSERT.md) contains reusable SQL templates for adding new projects, updating infrastructure details, etc. Committed: `4578ad9`.

## What Was Done (Session 13) -- ChatKit customer portal (Priorities 1-3)

1. **ChatKit customer CRUD (Priority 1)** -- Full create/edit/delete for customer-owned chatbots at `/portal/chatkit/`. Pages: new, [id], [id]/edit, [id]/entries/new, [id]/entries/[entryId]/edit. Reused CC components (KBEntryList, WidgetConfigForm, EmbedSnippet, KBExportButton). Delete button with confirmation. RLS ensures customers only access their own via `owner_id`. Files: `components/portal/chatbots/{PortalChatbotForm,PortalKBEntryForm,DeleteChatbotButton}.tsx`. Committed: `912c2c4`.

2. **Auto-enroll on first chatbot (Priority 2)** -- PortalChatbotForm auto-inserts `customer_products` row (product='chatkit', plan='free', status='active') when customer creates first chatbot. Idempotent via unique constraint. Committed: `912c2c4`.

3. **Free-tier message caps (Priority 3)** -- 50 messages/month limit for ChatKit free tier. Created `lib/chat/usage.ts` with monthly period logic and limit checking. Config endpoint returns `disabled: true` if limit exceeded. Message endpoint rejects 429 if over limit and increments usage on success. Widget skips rendering if disabled (graceful UX: no UI on customer website). Portal shows `UsageMeter` component with progress bar + warnings at 75%/90%. Visible on dashboard + chatbot detail page. Files: `lib/chat/usage.ts`, `components/portal/UsageMeter.tsx`, updated `app/api/chat/[chatbotId]/{config,message}/route.ts`, `public/widget.js`. Committed: `0249f4c`.

## What Was Done (Session 12) -- Phase 1 complete + Phase 2 portal scaffold

1. **MCP Supabase verified** -- Server connected via OAuth. Fixed `.mcp.json` schema error (removed invalid `"type": "url"` field). MCP tools not yet injected into Claude Code session but server shows connected. Committed: `3b4afa8`.

2. **Phase 1.1b -- admin.mdntech.org middleware** -- Added host-branching to `lib/supabase/middleware.ts`. Requests to `admin.mdntech.org` rewrite internally to `/command-center/*`. Requests to `mdntech.org/command-center/*` 301-redirect to `admin.mdntech.org/*`. Auth redirects adapt to use clean admin URLs. Committed: `3b4afa8`.

3. **Clean URLs on admin subdomain** -- Added redirect to strip `/command-center` prefix when sidebar links navigate to `admin.mdntech.org/command-center/projects` etc. Now all URLs show clean paths (`/projects`, `/team`). Deleted `/api/chat/test` diagnostic endpoint. Committed: `4663286`.

4. **Knowledge page date fix** -- Fixed `gray-matter` Date objects rendering as raw timestamps. Now displays as "Apr 16, 2026" using `toLocaleDateString`. Committed: `cbac838`.

5. **Migration 004 deployed** -- Portal schema applied to Supabase. New tables: `customers` (portal users), `clients` (internal CRM with optional FK to customers), `customer_products` (product enrollment per customer), `product_usage` (metering for free-tier caps). Added `owner_id` to `chatbots` for customer-owned ChatKit bots. Added `is_customer()` helper function. Rewrote `handle_new_user()` to branch on `account_type` metadata. Rewrote chatbot/KB/conversation RLS for owner_id pattern. Committed: `8ae94da`.

6. **Customer portal scaffold (app.mdntech.org)** -- Full portal route group at `app/portal/`. Middleware host-branching for `app.mdntech.org` (same pattern as admin). Pages: login, signup (sets `account_type: customer` + `signup_source` in Supabase metadata), dashboard with product cards and active products table, ChatKit listing with per-bot stats, SignaKit and TradeKit coming-soon placeholders, settings page. `PortalShell` sidebar component with nav. Vercel domain + Hostinger CNAME configured. Committed: `e79426e`.

## What Was Done (Session 11) -- Plan lock v2 + Phase 1.1a domain

1. **Reconciled two planning drafts** -- repo plan (2026-03-21) and Mind Palace draft (2026-04-16) had drifted from each other and from actual code. Produced [command-center/MIND-PALACE-BRIEFING.md](command-center/MIND-PALACE-BRIEFING.md) as the ground-truth handoff capturing current schema (migrations 001-003), what's already built through Session 10, and 6 decisions that needed locking.

2. **Locked 6 architectural decisions (D1-D6):**
   - D1: CC moves from `mdntech.org/command-center` to `admin.mdntech.org`; customer portal takes `app.mdntech.org`
   - D2: Single Supabase project (`ijfgwzacaabzeknlpaff`) for CC + portal, segmented by RLS, not by DB
   - D3: Two-table user model -- `team_members` (founders only, 2 rows, role 'admin') + `customers` (portal users); `handle_new_user()` branches on `raw_user_meta_data->>'account_type'`
   - D4: `clients` (internal CRM) and `customers` (portal users) stay as separate tables with optional FK link
   - D5: `owner_id` pattern on customer-facing resources (nullable in migration 004, tighten later -- hybrid path)
   - D6: Mind Palace holds the authoritative plan; repo gets a pointer stub

3. **Mind Palace adopted the briefing as v2 plan** -- new authoritative plan lives at `MindPalace/Projects/MDN-Tech/development-plan.md`. v1 archived. Agent-phase gate tightened: agents wait until migration 004 is deployed and stable in production. ChatKit free-tier locked at 50 messages (was 20 in briefing, revisited against Haiku cost reality).

4. **Repo-side plan handoff** -- created [PLAN.md](PLAN.md) at repo root as a 3-section pointer to the Mind Palace plan. Added SUPERSEDED banner to [command-center/DEVELOPMENT-PLAN.md](command-center/DEVELOPMENT-PLAN.md). Added [command-center/mdntech-website-rebuild.md](command-center/mdntech-website-rebuild.md) to the repo (was previously loose). Committed: `127f888`.

5. **MCP Supabase configured** -- added [.mcp.json](.mcp.json) at repo root using the hosted OAuth variant (`https://mcp.supabase.com/mcp?project_ref=ijfgwzacaabzeknlpaff`), no token in repo. Follows the pattern already used in the TradingBot project. Activation pending Claude Code restart in next session. Committed: `127f888`.

6. **Skill refinements committed** -- the `/doc-update`, `/save`, `/start`, `/wrap` skills accumulated quality improvements over several sessions (decisions.md handling, Mind Palace check in /start, emergency snapshot consumption, tighter templates). Also committed yarn.lock catching up to `@anthropic-ai/sdk` that was added to package.json in Session 8. Committed: `656ddc1`.

7. **Phase 1.1a complete -- admin.mdntech.org domain** -- added `admin.mdntech.org` in Vercel dashboard, created CNAME record at Hostinger (registrar). Initially used `cname.vercel-dns.com` target; updated to the newer project-specific target (`acc5f640d7a16557.vercel-dns-017.com`) per Vercel's recommendation. Domain resolving as of session end; Vercel shows Valid Configuration.

## What Was Done (Session 3) -- Phase 1: Auth, projects, team, dashboard

1. **Supabase project configured** -- Connected Supabase project (ref: ijfgwzacaabzeknlpaff), added env vars to `.env.local` and Vercel dashboard. Created `lib/supabase/client.ts`, `server.ts`, `middleware.ts` using `@supabase/ssr`. Ran `001_core_tables.sql` migration (projects, team_members, milestones, communications, activity_log + RLS + `handle_new_user()` trigger).

2. **Route group restructure** -- Moved all marketing pages into `app/(marketing)/` route group to fix nested `<html><body>` issue that was causing Vercel build failures. Root `app/layout.tsx` stripped to minimal; `app/(marketing)/layout.tsx` holds StarsCanvas, Navbar, Footer. Committed: `60d434d`.

3. **Phase 1 build** -- Auth (login page, middleware session guard), project CRUD (list/new/detail/edit), team workload page with utilization bars, dashboard with KPI cards and project table. Files: `app/command-center/login/page.tsx`, `app/command-center/dashboard/page.tsx`, `app/command-center/projects/`, `app/command-center/team/page.tsx`, `components/command-center/`. Committed: `1ea7010`.

4. **Vercel build fixes** -- Added `export const dynamic = 'force-dynamic'` to all CC server pages to prevent static prerender errors. Fixed lucide-react missing dependency. Committed: `9cd088c`.

## What Was Done (Session 4) -- Phase 2: Communications, budget, knowledge base

1. **Communications log** -- Global feed with QuickAddComm form (project, channel, direction, contact, subject, summary, action items) and CommFeed with channel/action-item filters. Files: `app/command-center/communications/page.tsx`, `components/command-center/communications/QuickAddComm.tsx`, `components/command-center/communications/CommFeed.tsx`.

2. **Budget tracking** -- Budget health meter (green <80%, yellow 80-100%, red >100%), remaining budget display, over-budget warning banner embedded in project detail tabs. Files: `components/command-center/projects/ProjectTabs.tsx`.

3. **Knowledge base (markdown)** -- Reads `.md` files from `command-center/knowledge/` using gray-matter, groups by category, renders with react-markdown + remark-gfm + @tailwindcss/typography. Added design system doc and stack guide. Files: `app/command-center/knowledge/`, `components/command-center/knowledge/KnowledgeContent.tsx`, `command-center/knowledge/docs/design-system.md`, `command-center/knowledge/docs/stack-guide.md`.

4. **Project tabs** -- Tabbed project detail view: Overview / Milestones / Budget / Communications, all rendered from a single page. Fixed TypeScript error with Supabase joined relations returning arrays. Committed: `da82b56`.

## What Was Done (Session 5) -- Chatbots KB management

1. **Chatbots section** -- Full CRUD for chatbots (name, type, client, linked project, status, description). Sidebar nav entry added. Files: `app/command-center/chatbots/page.tsx`, `new/page.tsx`, `[id]/page.tsx`, `[id]/edit/page.tsx`, `components/command-center/chatbots/ChatbotForm.tsx`.

2. **KB entry management** -- Per-chatbot knowledge base entries stored in Supabase (`chatbot_kb_entries` table). Entries grouped by category (about, tone, products, pricing, faq, policies, support, general, other) with word counts. Create/edit/delete with markdown textarea. Files: `app/command-center/chatbots/[id]/entries/`, `components/command-center/chatbots/KBEntryForm.tsx`, `components/command-center/chatbots/KBEntryList.tsx`.

3. **Export** -- Client-side export button concatenates all entries into one structured `.md` file sorted by category, triggers browser download. File: `components/command-center/chatbots/KBExportButton.tsx`.

4. **Supabase migration** -- Created `supabase/migrations/002_chatbots.sql` with `chatbots` and `chatbot_kb_entries` tables + RLS. Committed: `4cdb302`.

## What Was Done (Session 6) -- Phase 3: Infrastructure monitoring

1. **Infrastructure types** -- Shared TypeScript types for Supabase Management API, Railway GraphQL, and Vercel REST responses including provider health, projects, services, and deployments. File: `lib/infrastructure/types.ts`.

2. **Provider clients** -- Three typed API wrappers that gracefully handle missing/invalid keys with `not_configured` status. Supabase Management API fetches project list and health. Railway GraphQL queries projects, services, and recent deployments. Vercel REST fetches projects and deployments. Files: `lib/infrastructure/supabase-mgmt.ts`, `lib/infrastructure/railway.ts`, `lib/infrastructure/vercel.ts`.

3. **API route** -- Auth-protected `GET /api/infrastructure` endpoint that fetches all three providers in parallel and returns a unified `InfrastructureOverview` response. File: `app/api/infrastructure/route.ts`.

4. **Infrastructure dashboard** -- Replaced placeholder page with full monitoring dashboard. Features: service health cards (color-coded status badges), Supabase and Vercel project detail tables, combined Railway+Vercel deployment list with relative timestamps, auto-refresh every 60s, manual refresh button, loading skeletons, setup guide when API keys aren't configured. Files: `app/command-center/infrastructure/page.tsx`, `components/command-center/infrastructure/ServiceCard.tsx`, `components/command-center/infrastructure/DeploymentList.tsx`, `components/command-center/infrastructure/InfraClient.tsx`. Committed: `9622fb5`.

5. **Anthropic API key** -- Added real API key to `.env.local` (user also added to Vercel env vars for production). Ready for Phase 4 AI features.

## What Was Done (Session 7) -- RLS fix, params migration, knowledge fix

1. **RLS infinite recursion fix** -- `team_members` had a self-referencing "Admins can manage team members" policy causing 500 errors on all writes. Created `public.is_admin()` SECURITY DEFINER function, replaced all recursive admin policies across 5 tables (team_members, projects, milestones, communications, activity_log). Also set user role to `admin`. Applied via Supabase SQL Editor.

2. **Async params migration** -- Updated all 7 dynamic pages to use `Promise<>` params type (Next.js 15 requirement): project detail, project edit, chatbot detail, chatbot edit, KB entry new, KB entry edit, knowledge slug. Committed: `a29ed75`.

3. **Knowledge page crash fix** -- `gray-matter` auto-parses YAML dates into JavaScript Date objects, which are not valid React children (React error #31). Fixed by coercing `updated` and `tags` fields to strings via `String()`. Committed: `0950e01`.

4. **Vercel file tracing** -- Added `experimental.outputFileTracingIncludes` to `next.config.js` so knowledge `.md` files are bundled into Vercel serverless functions. Committed: `a29ed75`.

5. **Royal Stroje project added** -- First project entered in Command Center (Vercel FE + Supabase, no Railway).

## What Was Done (Session 8) -- Phase 4: AI Commander chatbot widget

1. **Embeddable chat widget** -- Vanilla JS widget (`public/widget.js`) with Shadow DOM for style isolation. Features: streaming responses, session persistence, markdown rendering, typing indicator, smooth open/close animations, brand color theming, responsive mobile layout. Embed via single script tag. Committed: `9ce3460`.

2. **Chat API routes** -- Public `/api/chat/[chatbotId]/config` (GET) and `/api/chat/[chatbotId]/message` (POST with SSE streaming). Uses Anthropic Claude Haiku 4.5 for cost efficiency (~$0.004/msg). Service-role Supabase client bypasses RLS. CORS headers at Next.js config level. Rate limiting (20 req/min/IP). Committed: `9ce3460`.

3. **Conversation storage** -- New `chat_conversations` and `chat_messages` tables (migration `003_chat_conversations.sql`). Widget config stored as JSONB on chatbots table. Conversations viewable in Command Center with filters and message thread viewer. Committed: `9ce3460`.

4. **Command Center chatbot UI** -- Widget config form (greeting, system prompt, colors, fallback message), embed code snippet with copy button, conversation/message stats on chatbot detail page, conversations list page, conversation detail page. Committed: `9ce3460`.

5. **CORS and deployment fixes** -- Added CORS headers at `next.config.js` level for `/api/chat/*`. Fixed `www.mdntech.org` redirect issue (widget always uses www). Created diagnostic endpoint `/api/chat/test`. Separate `CLAUDE_CHATBOT_API_KEY` env var for chatbot service. Committed: `04645c6`, `be6dbc6`, `f93271b`.

6. **Cost optimization** -- Switched from Claude Sonnet ($0.04/msg) to Haiku 4.5 ($0.004/msg). Prompt tuned for 2-3 sentence responses. Max tokens reduced to 512. Committed: `89c7fe3`, `481d01f`.

7. **Marketing site fixes** -- Fixed broken star background (canvas transparency with `gl={{ alpha: true }}`), blackhole video z-index and `playsInline` for iOS, proper z-layering (stars z-0 behind content). Removed Projects and Blog from navbar. Fixed mobile hero button cutoff. Committed: `1eda0c2` through `45de12d`.

## What Was Done (Session 9) -- Chatbots dashboard + prompt tuning

1. **Chatbots page redesigned** -- Replaced single-line chatbot list with summary cards (total messages, unique visitors, conversations, API cost) and a full stats table matching the projects page layout. Stats aggregated from `chat_conversations` and `chat_messages` tables. Haiku 4.5 token pricing used for cost calculation. Committed: `658a71b`.

2. **Chatbot prompt fix** -- Added conversation history instructions to system prompt to stop Claude from repeating information from earlier messages. Added rules: only answer latest message, never recap, respond to casual greetings without product dumps. Committed: `21db874`.

## What Was Done (Session 10) -- Mobile UI polish

1. **Blackhole video mobile fix** -- Scaled video to 350% width on mobile and centered horizontally so the blackhole ring matches desktop proportions. Mobile offset tuned to `top-[-355px]`. Desktop unchanged. File: `components/main/hero.tsx`. Committed: `8bfb437`.

2. **Process steps mobile redesign** -- Replaced separate circle + timeline layout on mobile with inline numbered badges inside card titles. Desktop keeps the left-side circle + timeline connector. Reduced card padding and title size on mobile. Tighter step gap on mobile (`gap-6` vs `gap-12`). File: `components/main/process.tsx`. Committed: `8bfb437`.

3. **Blog button fix** -- Skills section background video overlay was blocking click/hover on "Read our engineering blog" button. Added `-z-10` and `pointer-events-none` to the video wrapper. File: `components/main/skills.tsx`. Committed: `8bfb437`.

4. **Hero badge removed** -- Removed "UAE-Based · AI-Powered Development · Global Delivery" badge from hero for cleaner layout. Cleaned up unused `slideInFromTop` import. File: `components/sub/hero-content.tsx`. Committed: `8bfb437`.

5. **Contact section mobile tightening** -- Smaller heading (`text-xl`), tighter margins, smaller body text on mobile. File: `components/main/contact-us.tsx`. Committed: `8bfb437`.

## What To Do Next

**Session 34 closed TechKit Session A: monitoring is LIVE and the UI is clean.** Migrations 009+010 applied, `techkit-poller` deployed, 3 cron schedules verified, Telegram + Resend alerts delivering, A8 kill test passed, 7 endpoints checked every 5 min. Also: solved the Railway token (it's a workspace token -- `projects` query, not `me`; fixed `railway.ts` + added token to Vercel env) and fixed 3 live-UI bugs from Martin's screenshots (incidents ambiguous embed, Live-tab 404, Check-now HTML guard -- all pushed `f35e0ec`). **Next: TechKit Session B** (brief §13 -- providers persistence, deploy webhooks, stats collectors). Railway token needs no regeneration. After a Vercel deploy, hard-refresh the TechKit tabs to confirm Incidents/Live render (see Session 34 note 9).

**Session 31 finished the SK polish** -- correctly aligned the mobile blackhole to the EN home (Session 30 *thought* it had matched it but the leaner hero hit the `min-h-[650px]` floor and rode high; fixed with mobile `min-h-[685px]`, verified ±27px / 1px-at-390px via Playwright + `scripts/measure-hero.mjs`) and professionalised the "Prečo my" copy (dropped "boutique" + the freelancer jab + the "tri weby" count, "Senior tím"->"Skúsený tím", dropped "rebrík" in the services intro). No numbered priority closed -- this was UI/copy polish. Follow-up: `SK_PORTFOLIO` still shows 3 cards while the copy now implies more references -- add live sites when ready.

**Session 30 polished the SK landing** -- new hero motto "Expandujte svoj biznis online." (cosmic/expansion theme), full vykanie across /sk, leaner hero, and content/footer cleanups (removed for-whom note + value-ladder pricing note; Royal Stroje tag -> Command Center; footer socials hidden on /sk). The leaner-hero change *intended* to match the mobile blackhole to EN but overshot (fixed in Session 31). One open micro-decision: whether to hide footer socials globally (currently /sk-only) -- see Session 30 note 6.

**Session 29 shipped the SK agency landing at `mdntech.org/sk`** (Part A of the Mind Palace SK brief) -- live, indexable, full hreflang/JSON-LD SEO, canonical domain aligned to `.org` repo-wide. Remaining SK work is Part B (footer-link repoints in 3 separate client repos) + the domain-level `301 .com -> .org` -- see priority 15.

**Session 28 closed priority 1 (ChatKit Pricing) end-to-end** with a 4-tier mixed PAYG + subscription model: Free / Starter $29 / Pro $99/mo / Max $299/mo. Mock checkout for both Starter pack and subs verified working (subscribe / upgrade / downgrade / cancel / reactivate). Real Stripe integration is the only remaining piece; everything else (schema, UI, cap-checking, plan gates) is live. **Next focus: priority 1 -- real Stripe Checkout + webhooks (when merchant account activates).**

| Priority | Task | Status | Notes |
|----------|------|--------|-------|
| **0 ⭐** | **TechKit — technical superadmin (monitoring + stats for all MDN projects)** | **Session A COMPLETE + LIVE (Session 34, 2026-07-10) — A8 kill test passed** | **Next: Session B** of `command-center/TECHKIT-BRIEF.md` §13: providers persistence, deploy webhooks (`techkit-webhook`), stats collectors (CrUX/Supabase/Railway/ChatKit rollup). Fix the broken account-level `RAILWAY_API_TOKEN` before/with Session B (see runbook Known issues). Sessions C (costs — absorbs priority 8) + D (AI digest) follow. MarketKit (0b) reuses TechKit's `_shared/` + notify foundations, which are now deployed and proven. |
| **0b ⭐NEW** | **MarketKit — AI GTM copilot as portal module (app.mdntech.org)** | **Ready for kickoff (brief complete, 2026-07-10)** | Full execution brief at `command-center/MARKETKIT-BRIEF.md`. Integrates into THIS repo's portal (reverses vault Session-13 "new standalone repo" decision). Session A: migration `0XX_marketkit.sql` (`mk_`-prefixed tables — check next free number vs TechKit's 009+!), dogfood customer account, intake flow + asset upload, `marketkit-worker` Edge Function job queue, AI scan + Launch Kit generator, portfolio dashboard, dogfood #1 = MarketKit itself. Reuses TechKit's `_shared/` Edge Function + notify foundations (sequence TechKit Session A first, or bootstrap per brief §5.2). Data split: GA4/GSC/content/attribution → MarketKit; uptime/providers/costs → TechKit. |
| 1 | Real Stripe integration (replace mock checkout) | Pending (gated on Stripe account) | Mock today: `/api/portal/subscription` POST/DELETE flips DB columns directly; `/api/portal/chatbot/[id]/purchase` mock-grants credits. Real path: Stripe Checkout Sessions for sub creation + Starter pack one-time payments, Stripe Customer Portal for self-serve management, webhook handlers for `invoice.paid` (period_messages_used reset) / `customer.subscription.updated` / `customer.subscription.deleted` / `payment_intent.succeeded`. Schema already has `stripe_customer_id` + `stripe_subscription_id` columns ready. Estimated ~4 hours once Stripe account is live. |
| 2 | Wire feature gates in chatbot detail UI | Pending | `lib/portal/plans.ts` exposes `hasFeature(tier, 'conversations' \| 'analytics' \| 'learning' \| 'reports')` but the chatbot detail page renders all surfaces unconditionally. Gate the conversation viewer link to Starter+, the trends + keywords charts to Pro+, and the (unbuilt) reports + learning sections to Max only. Harmless to skip until paid customers exist. ~30 min. |
| 3 | ChatKit Auto-Learning MVP (Max-tier exclusive) | Deferred | Flag UI in conversation viewer + Sunday cron + Claude analysis + weekly report at `/portal/chatkit/[id]/learning`. Uses existing `message_feedback` table. Now positioned as a Max-tier upsell. ~5 hours. |
| 4 | Weekly auto-reports (Max-tier exclusive) | Deferred | Sunday cron emails Max customers a usage + insights digest. Pairs with Auto-Learning. Promises in pricing card already; ship before serious Max marketing. |
| 5 | ChatKit Voice via Cartesia Sonic-3 | Deferred | Cartesia SDK in widget + API, voice toggle per chatbot, mic + audio playback, streaming TTS. Could be a Max-tier add-on or separate upsell. ~6 hours. |
| 6 | Re-enable marketing Login/Portal CTA | Pending (closer now) | ChatKit pricing has shipped, so the portal is publicly defensible. Restore the auth-aware CTA in `components/main/navbar.tsx` (revert pieces of `643118a`): `isLoggedIn` prop + `ctaLabel`/`ctaHref` vars + desktop button JSX + mobile menu CTA JSX, and the `getUser()` fetch in `(marketing)/layout.tsx`. Keep the nav-pill absolute-center pattern from `643118a` (works either way). |
| 7 | Wire UI for the 4 branded auth flows | Pending | Templates ready (reset-password, magic-link, email-change, reauthentication). Each needs UI: "Forgot password?" link on login + a `/portal/reset-password` set-new-password page; magic-link option on login; email-change form in `/portal/settings`; reauth challenge surface for sensitive actions. |
| 8 | Cost monitoring + alerts | Pending (post first paid customer) | After 1-2 customers are running on Pro/Max, monitor real per-message cost via Anthropic console vs the assumed $0.005. If margins compress (e.g., KB injection bigger than expected), tighten KB top-N, raise prices, or lower Max cap. Adjustable in `lib/portal/plans.ts`. |
| 9 | SignaKit section in portal | Hidden (MVP) | Removed from portal nav per Session 21 redesign. Reactivate when SignaKit launches as a real product post-ChatKit-monetization. |
| 10 | Portal authentication: Supabase → SignaKit | Pending | Migrate portal auth from Supabase Auth to SignaKit. Unlocks Phase 4 auth provider consolidation. |
| 11 | Mind Palace ↔ CC sync bridge | Pending | Script to keep project metadata in sync (frontmatter ↔ CC metadata column). Low priority. |
| 12 | SEO action plan | Pending | Follow `seo-audit/ACTION-PLAN.md`. |
| 13 | Add "Bonus skill" section to handoff README | Pending (low) | Handoff README is "four core skills" framed; positioning `build-kb` requires either an "Extras" / "Companion skills" section or a careful re-framing. No urgency -- toolkit card already discovers it. |
| 14 | Delete `.next-stale-1777403470/` (local only) | Pending | Renamed in Session 23 to recover dev server; safety hook blocks `rm -rf .*`. Now in `.gitignore`. Delete manually with `rmdir /s /q .next-stale-1777403470` (Windows) or via Explorer. |
| 15 | SK landing Part B + domain 301 | Pending (separate repos / registrar) | (a) Repoint footer attribution in `melicharek` -> "Web vytvoril MDN Tech", `RoyalStroje` -> "Tvorba webu: MDN Tech", `zane_kadernictvo` -> "Realizacia MDN Tech", all linking `https://mdntech.org/sk`, followed, varied anchors -- do at next touch of each repo. (b) `mdntech.sk` purchase + `301 -> /sk` (Martin/SK-NIC). (c) If `mdntech.com` is still live/indexed, set domain-level `301 .com -> .org` at registrar/Vercel and verify the canonical/hreflang cluster in Search Console post-deploy. |

## Key Files

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout (minimal -- html/body only) |
| `app/(marketing)/layout.tsx` | Marketing layout with StarsCanvas, Navbar, Footer |
| `app/(marketing)/sk/page.tsx` | **SK agency landing** (Part A, Session 29): static route, Slovak metadata + reciprocal hreflang sk/en/x-default + ProfessionalService JSON-LD + element-level `lang="sk"`; composes the 7 `components/sk/*` sections |
| `components/sk/*` | SK landing sections: SkHero, SkForWhom, SkValueLadder, SkWhyUs, SkPortfolio (3 client screenshots), SkProcess, SkContact (EmailJS + SK NAP). Reuse the design system; all copy from `constants/sk.ts` |
| `constants/sk.ts` | Single source of truth for `/sk` copy + data (SK_SITE/SEO, SK_NAP, SK_NAV_LINKS, SK_HERO, value ladder, why-us, portfolio, process, pricing) |
| `components/main/{navbar,footer}.tsx` | Marketing nav + footer, now **locale-aware** via `usePathname()` -- SK chrome on `/sk*`, EN path unchanged |
| `scripts/capture-portfolio.mjs` | Dev-only Playwright (system Chrome `channel`) screenshot capture of the 3 client sites -> `public/portfolio/*.jpg`. Run `node scripts/capture-portfolio.mjs` |
| `scripts/measure-hero.mjs` | Dev-only Playwright (system Chrome) diagnostic: measures EN (`/`) vs SK (`/sk`) hero container + blackhole video geometry at mobile widths (360/390/414px) so the SK blackhole can be matched to the EN home. Needs dev server on :3000. Run `node scripts/measure-hero.mjs` |
| `app/command-center/layout.tsx` | CC layout: dark bg, Sidebar + main content |
| `app/portal/layout.tsx` | Portal layout (customer-facing) |
| `app/portal/dashboard/page.tsx` | Portal analytics dashboard: metrics cards, trend chart, keywords, actions |
| `app/portal/login/page.tsx` | Portal login |
| `app/portal/signup/page.tsx` | Portal signup (sets account_type: customer) |
| `app/portal/chatkit/page.tsx` | ChatKit listing with stats (customer's own chatbots); marketing shell + ChatKitHero + BuildKBGuide |
| `components/portal/chatkit/ChatKitHero.tsx` | ChatKit page hero: cyan eyebrow + 2-line gradient headline + button-primary "+ New chatbot" CTA |
| `components/portal/chatkit/BuildKBGuide.tsx` | KB onboarding 3-step: install Claude Code (VS Code or npm) → paste KB-generation prompt → upload as KB entries. Reuses CodeBlock. Supports `collapsed` prop for empty vs populated state |
| `app/portal/chatkit/new/page.tsx` | New chatbot form (auto-enrolls in customer_products) |
| `app/portal/chatkit/[id]/page.tsx` | Chatbot detail: KB + widget config + embed snippet + usage meter |
| `app/portal/chatkit/[id]/edit/page.tsx` | Edit chatbot |
| `app/portal/chatkit/[id]/entries/{new,[entryId]/edit}/page.tsx` | KB entry create/edit |
| `app/portal/chatkit/[id]/conversations/page.tsx` | Conversation viewer: expandable cards, message feedback, filters |
| `components/portal/chatbots/PortalChatbotForm.tsx` | Portal-specific form (no projects field, auto-enroll) |
| `components/portal/chatbots/PortalKBEntryForm.tsx` | Portal KB entry form (redirects to /portal paths) |
| `components/portal/chatbots/DeleteChatbotButton.tsx` | Delete with confirmation |
| `components/portal/UsageMeter.tsx` | Free-tier usage progress bar + warnings |
| `components/portal/PortalShell.tsx` | Async server shell with `variant?: 'marketing' \| 'app'`; renders top bar + ambient background on marketing variant |
| `components/portal/PortalTopBar.tsx` | Fixed top bar: 4 nav items (ToolKit, ChatKit, Settings, Home) + auth-aware Login/Account dropdown + mobile hamburger |
| `components/portal/PortalBackground.tsx` | Marketing-variant ambient: dynamic-imported StarsCanvas (no blackhole on portal) |
| `components/portal/auth/{LoginForm,SignupForm}.tsx` | Extracted client auth forms (used by server pages wrapped in marketing shell) |
| `app/portal/toolkit/page.tsx` | ToolKit/Handoff page (public, no auth): composes Hero + WhatIsIt + InstallBlock + SkillCards + PlanKitTeaser + ThirdPartySkills + FAQ |
| `components/portal/handoff/HandoffHero.tsx` | Gradient headline, dual CTAs, trust strip |
| `components/portal/handoff/WhatIsIt.tsx` | 3-column problem→solution grid |
| `components/portal/handoff/InstallBlock.tsx` | OS-aware (`navigator.platform`) tab default, copy-to-clipboard, manual fallback `<details>`, verify, uninstall |
| `components/portal/handoff/CodeBlock.tsx` | Reusable code block with copy button + `Copied ✓` callout |
| `components/portal/handoff/SkillCards.tsx` | 2×2 grid of /start, /wrap, /save, /doc-update with example snippets and View source links |
| `components/portal/handoff/PlanKitTeaser.tsx` | Coming-soon paid tier card + waitlist mailto |
| `components/portal/handoff/ThirdPartySkills.tsx` | Curated 5-card grid of community + Anthropic skills |
| `components/portal/handoff/FAQ.tsx` | 5 `<details>` accordions with chevron indicator |
| `components/portal/handoff/Reveal.tsx` | framer-motion `whileInView` fade-up wrapper, staggered via delay prop |
| `lib/portal/toolkit-skills.ts` | ToolKit data: M.D.N skills (CMO/test/security-review/wrap/start filtered out) + visible cards: `build-kb` (M.D.N) + 5 curated third-party (UI/UX Pro Max, SEO Audit, Marketing Skills, Frontend Design, Claude API, Karpathy Guidelines) |
| `components/portal/analytics/ConversationViewer.tsx` | Conversation cards with message feedback buttons (correct/incorrect/helpful/not_helpful) |
| `components/portal/analytics/TrendChart.tsx` | 7-day message trend chart (CSS bars) |
| `components/portal/analytics/KeywordsBar.tsx` | Top keywords horizontal bar chart |
| `lib/portal/analytics.ts` | Analytics functions: getChatbotAnalytics, getMessagesTrend, getTopKeywords, exportConversationsMarkdown |
| `app/api/portal/chatbot/[chatbotId]/export/route.ts` | Export conversations as markdown file download |
| `app/api/portal/feedback/[messageId]/route.ts` | Save/update message feedback (rating) |
| `supabase/migrations/005_message_feedback.sql` | Message feedback table: message_id, chatbot_id, customer_id, rating, RLS |
| `lib/portal/plans.ts` | **ChatKit pricing source of truth** -- PLAN definitions (Free/Starter/Pro/Max with prices, chatbot limits, monthly message caps, features, descriptions) + `resolveAccountTier` / `resolveChatbotTier` / `isSubscriptionActive` (Stripe-style: canceled subs grant tier until period_end) / `hasFeature` gates (conversations / analytics / learning / reports) |
| `lib/chat/usage.ts` | Cap-check + atomic increment. `checkChatbotUsage(chatbotId)` branches per-chatbot-lifetime (Free/Starter) vs account-wide-monthly (Pro/Max sub). `incrementChatbotUsage` writes to both `chatbots.messages_used` (analytics) and `customers.period_messages_used` (cap) when subscribed. Output token cap (300) + KB top-5 × 2000 chars enforced upstream in message API |
| `app/portal/upgrade/page.tsx` | **Account-level subscription manager**: 4-card tier grid with context-aware CTAs (Subscribe / Upgrade / Downgrade / Cancel / Reactivate). Shows current cycle + period_end + messages used this cycle when on Pro/Max |
| `app/portal/chatkit/[id]/upgrade/page.tsx` | **Chatbot-level Starter pack purchase** ($29 / 500 credits). Shows usage + remaining + "see subscription plans" link to /portal/upgrade when relevant |
| `app/api/portal/subscription/route.ts` | Mock subscription API. POST `{plan:'pro'\|'max'}` flips customer.subscription_plan + status='active' + sets period dates + logs subscription_events row (created/upgraded/downgraded/reactivated). DELETE marks status='canceled' but keeps period_end (Stripe convention -- access continues to end of cycle) |
| `app/api/portal/chatbot/[chatbotId]/purchase/route.ts` | Mock Starter pack purchase. POST adds 500 credits to chatbot.credits_purchased + logs chatbot_purchases row at $29 |
| `components/portal/UsageMeter.tsx` | 3-mode meter: trial (X / 30 free) / starter credits (X / Y lifetime) / monthly subscription (X / 5K \| 25K this cycle). Server-rendered, takes `usage: ChatbotUsage` prop |
| `components/portal/chatkit/ChatKitPricing.tsx` | Read-only 4-tier pricing block on /portal/chatkit. Single "Manage plan" CTA below the cards routes to /portal/upgrade |
| `components/portal/upgrade/PlanActionButton.tsx` | Client buttons: SubscribeButton (POSTs to /api/portal/subscription) and CancelSubscriptionButton (with confirm-then-cancel state) |
| `supabase/migrations/007_chatkit_credits.sql` | Per-chatbot lifetime credit columns on chatbots + chatbot_purchases audit + atomic increment_chatbot_messages RPC |
| `supabase/migrations/008_chatkit_subscriptions.sql` | Customer subscription state (`subscription_plan`/`subscription_status`/`stripe_*`/`current_period_*`/`period_messages_used`) + `subscription_events` audit + atomic `increment_customer_period_messages` + lazy `rollover_customer_period` RPC + drops redundant `chatbots.plan` column |
| `middleware.ts` | Session guard + host-branching for admin/app/marketing |
| `lib/supabase/client.ts` | Supabase browser client |
| `lib/supabase/server.ts` | Supabase server client |
| `supabase/migrations/001_core_tables.sql` | Core schema: projects, team, milestones, communications + RLS |
| `supabase/migrations/002_chatbots.sql` | Chatbots + KB entries schema + RLS |
| `supabase/migrations/004_portal_schema.sql` | Portal schema: customers, clients, customer_products, product_usage, owner_id, rewritten RLS + handle_new_user() |
| `components/command-center/projects/ProjectTabs.tsx` | Project detail: Overview/Milestones/Budget/Communications tabs |
| `components/command-center/chatbots/KBExportButton.tsx` | Export all KB entries as unified .md download |
| `components/command-center/knowledge/KnowledgeContent.tsx` | Renders .md files with react-markdown + typography |
| `command-center/knowledge/docs/design-system.md` | Unified brand reference: colors, typography, components |
| `command-center/knowledge/docs/stack-guide.md` | New project setup guide (Next.js, Supabase, Railway, Vercel) |
| `command-center/PRD.md` | Command Center product requirements |
| `command-center/DEVELOPMENT-PLAN.md` | 6-phase development plan with architecture and schema |
| `lib/infrastructure/` | Provider clients: supabase-mgmt.ts, railway.ts, vercel.ts, types.ts |
| `app/api/infrastructure/route.ts` | Auth-protected infrastructure status API (all providers in parallel) |
| `components/command-center/infrastructure/` | ServiceCard, DeploymentList, InfraClient (auto-refresh dashboard) |
| `public/widget.js` | Embeddable chatbot widget (vanilla JS, Shadow DOM) |
| `app/api/chat/[chatbotId]/message/route.ts` | Streaming chat API (Claude Haiku 4.5 + SSE); checks usage limit + increments on success |
| `app/api/chat/[chatbotId]/config/route.ts` | Public chatbot config endpoint; returns disabled=true if limit exceeded |
| `lib/chat/prompt.ts` | System prompt builder from KB entries |
| `lib/chat/cors.ts` | CORS headers utility |
| `lib/supabase/service.ts` | Service-role Supabase client (bypasses RLS) |
| `supabase/migrations/003_chat_conversations.sql` | Chat conversations + messages schema |
| `components/command-center/chatbots/WidgetConfigForm.tsx` | Widget settings editor |
| `components/command-center/chatbots/EmbedSnippet.tsx` | Deploy snippet with copy button |
| `components/command-center/chatbots/ConversationList.tsx` | Conversations list with filters |
| `.claude/skills/` | Claude Code skills -- session management (start, wrap, doc-update, save, test) + content (build-kb -- generates chatbot-ready knowledge-base.md from repo content; project-specific copy with M.D.N paths, generic copy in `bugiiiii11/handoff` repo) |
| [PLAN.md](PLAN.md) | Plan pointer -- Mind Palace is authoritative; this is the repo stub |
| [command-center/MIND-PALACE-BRIEFING.md](command-center/MIND-PALACE-BRIEFING.md) | Architectural decisions briefing (D1-D6 locked 2026-04-16), migration 004 spec, phase sequencing |
| [command-center/mdntech-website-rebuild.md](command-center/mdntech-website-rebuild.md) | Website rebuild spec (input to Phase 3) |
| [command-center/HANDOFF_PAGE_SPEC.md](command-center/HANDOFF_PAGE_SPEC.md) | Handoff page build brief (Session 21): IA, install block UX, skill cards, PlanKit teaser, FAQ. Stack-agnostic; adapt section components to Next.js 15. |
| [.mcp.json](.mcp.json) | Supabase MCP server config (hosted OAuth, scoped to project `ijfgwzacaabzeknlpaff`) |
| [decisions.md](decisions.md) | Decision log -- locked architectural decisions with reasoning |
