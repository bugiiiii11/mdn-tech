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

**Phase C shipped (Session 24)** alongside auth-flow polish: Settings restyled, marketing nav is auth-aware with Tools link, cross-host preconnect + video caching live, portal-host bare URL now lands on `/toolkit` (public install page), `/auth/callback` PKCE handler closes the signup-to-logged-in loop, branded confirm-signup email shipped. Production smoke test passed end-to-end. **Next focus: ChatKit empty-state marketing landing + Resend SMTP migration (parallel — dashboard/DNS work, no code).**

| Priority | Task | Status | Notes |
|----------|------|--------|-------|
| 1 | ChatKit empty-state marketing landing (when customer has no chatbots) | Pending | Render marketing-style hero on `/portal/chatkit` empty state ("knowledge base + 1 line of code = chatbot") with embed-snippet preview and coming-soon teasers (Voice / Auto-learning / Pricing tiers). Hybrid shell — `<PortalShell variant="marketing">` on empty state, default app shell when chatbots exist. This is what first-time signups see immediately after the auth/callback redirect, so it doubles as the activation surface. |
| 2 | Resend SMTP migration | Pending | Built-in Supabase email service has hard rate limits (~3-4/h free, ~30/h paid) and ships from `noreply@mail.app.supabase.io` — not viable once social drives signup volume. Switch to Resend: free 3000/mo, $20/mo for 50k. Steps: (a) sign up at resend.com, (b) add `mdntech.org` domain + DKIM/SPF DNS records, (c) create sending API key, (d) Supabase → Auth → Emails → SMTP Settings: host `smtp.resend.com`, port `465`, user `resend`, pass `<API key>`, sender `noreply@mdntech.org`, name `M.D.N Tech`, (e) test signup. Pure dashboard + DNS — no code change. Can run in parallel with priority 1. |
| 3 | ChatKit Pricing + Stripe billing | Deferred (resumes after empty-state landing) | Per Session 20 plan. Migration 007 (stripe fields, plan enum), `/pricing` on marketing, `/portal/upgrade` in portal, caps 50/2000/10000/unlimited. Stripe account creation pending on user side; UI + schema can proceed in parallel. |
| 4 | ChatKit Auto-Learning MVP | Deferred (resumes after Pricing) | Flag UI in conversation viewer + Sunday cron + Claude analysis + weekly report at `/portal/chatkit/[id]/learning`. Uses existing `message_feedback` table. ~5 hours. |
| 5 | ChatKit Voice via Cartesia Sonic-3 | Deferred (resumes after Auto-Learning) | Cartesia SDK in widget + API, voice toggle per chatbot, mic + audio playback, streaming TTS. $10/mo Pro add-on. ~6 hours. |
| 6 | SignaKit section in portal | Hidden (MVP) | Removed from portal nav per Session 21 redesign. Reactivate when SignaKit launches as a real product post-ChatKit-monetization. |
| 7 | Portal authentication: Supabase → SignaKit | Pending | Migrate portal auth from Supabase Auth to SignaKit. Unlocks Phase 4 auth provider consolidation. |
| 8 | Mind Palace ↔ CC sync bridge | Pending | Script to keep project metadata in sync (frontmatter ↔ CC metadata column). Low priority. |
| 9 | SEO action plan | Pending | Follow `seo-audit/ACTION-PLAN.md` after empty-state landing + Resend land. |
| 10 | Delete `.next-stale-1777403470/` (local only) | Pending | Renamed in Session 23 to recover dev server; safety hook blocks `rm -rf .*`. Now in `.gitignore`. Delete manually with `rmdir /s /q .next-stale-1777403470` (Windows) or via Explorer. |

## Key Files

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout (minimal -- html/body only) |
| `app/(marketing)/layout.tsx` | Marketing layout with StarsCanvas, Navbar, Footer |
| `app/command-center/layout.tsx` | CC layout: dark bg, Sidebar + main content |
| `app/portal/layout.tsx` | Portal layout (customer-facing) |
| `app/portal/dashboard/page.tsx` | Portal analytics dashboard: metrics cards, trend chart, keywords, actions |
| `app/portal/login/page.tsx` | Portal login |
| `app/portal/signup/page.tsx` | Portal signup (sets account_type: customer) |
| `app/portal/chatkit/page.tsx` | ChatKit listing with stats (customer's own chatbots) |
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
| `lib/portal/toolkit-skills.ts` | ToolKit data: M.D.N skills (filtered) + 5 visible third-party cards with verified source URLs |
| `components/portal/analytics/ConversationViewer.tsx` | Conversation cards with message feedback buttons (correct/incorrect/helpful/not_helpful) |
| `components/portal/analytics/TrendChart.tsx` | 7-day message trend chart (CSS bars) |
| `components/portal/analytics/KeywordsBar.tsx` | Top keywords horizontal bar chart |
| `lib/portal/analytics.ts` | Analytics functions: getChatbotAnalytics, getMessagesTrend, getTopKeywords, exportConversationsMarkdown |
| `app/api/portal/chatbot/[chatbotId]/export/route.ts` | Export conversations as markdown file download |
| `app/api/portal/feedback/[messageId]/route.ts` | Save/update message feedback (rating) |
| `supabase/migrations/005_message_feedback.sql` | Message feedback table: message_id, chatbot_id, customer_id, rating, RLS |
| `lib/chat/usage.ts` | Usage tracking: checkUsageLimit, incrementUsage, free-tier limits |
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
| `.claude/skills/` | Session management skills (start, wrap, doc-update, save, test) |
| [PLAN.md](PLAN.md) | Plan pointer -- Mind Palace is authoritative; this is the repo stub |
| [command-center/MIND-PALACE-BRIEFING.md](command-center/MIND-PALACE-BRIEFING.md) | Architectural decisions briefing (D1-D6 locked 2026-04-16), migration 004 spec, phase sequencing |
| [command-center/mdntech-website-rebuild.md](command-center/mdntech-website-rebuild.md) | Website rebuild spec (input to Phase 3) |
| [command-center/HANDOFF_PAGE_SPEC.md](command-center/HANDOFF_PAGE_SPEC.md) | Handoff page build brief (Session 21): IA, install block UX, skill cards, PlanKit teaser, FAQ. Stack-agnostic; adapt section components to Next.js 15. |
| [.mcp.json](.mcp.json) | Supabase MCP server config (hosted OAuth, scoped to project `ijfgwzacaabzeknlpaff`) |
| [decisions.md](decisions.md) | Decision log -- locked architectural decisions with reasoning |
