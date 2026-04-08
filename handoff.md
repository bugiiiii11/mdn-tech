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

| Priority | Task | Notes |
|----------|------|-------|
| 1 | Enter remaining 9 projects in Command Center | Royal Stroje done; 4 more active + 5 in analysis |
| 2 | Test chatbot prompt improvements | Verify Royal Stroje bot no longer repeats earlier topics in conversation |
| 3 | Remove /api/chat/test diagnostic endpoint | Temporary -- remove after confirming chatbot stability |
| 4 | Fix knowledge page date display | Dates render as full UTC strings; format to YYYY-MM-DD |
| 5 | Add remaining knowledge base docs | Skills docs, howto guides for Railway/Supabase/Vercel |
| 6 | Phase 5: Notifications and alerts | Slack/email integrations, deployment alerts, budget warnings |
| 7 | SEO action plan implementation | Follow seo-audit/ACTION-PLAN.md recommendations |

## Key Files

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout (minimal -- html/body only) |
| `app/(marketing)/layout.tsx` | Marketing layout with StarsCanvas, Navbar, Footer |
| `app/command-center/layout.tsx` | CC layout: dark bg, Sidebar + main content |
| `middleware.ts` | Session guard: redirects unauthenticated users to login |
| `lib/supabase/client.ts` | Supabase browser client |
| `lib/supabase/server.ts` | Supabase server client |
| `supabase/migrations/001_core_tables.sql` | Core schema: projects, team, milestones, communications + RLS |
| `supabase/migrations/002_chatbots.sql` | Chatbots + KB entries schema + RLS |
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
| `app/api/chat/[chatbotId]/message/route.ts` | Streaming chat API (Claude Haiku 4.5 + SSE) |
| `app/api/chat/[chatbotId]/config/route.ts` | Public chatbot config endpoint |
| `lib/chat/prompt.ts` | System prompt builder from KB entries |
| `lib/chat/cors.ts` | CORS headers utility |
| `lib/supabase/service.ts` | Service-role Supabase client (bypasses RLS) |
| `supabase/migrations/003_chat_conversations.sql` | Chat conversations + messages schema |
| `components/command-center/chatbots/WidgetConfigForm.tsx` | Widget settings editor |
| `components/command-center/chatbots/EmbedSnippet.tsx` | Deploy snippet with copy button |
| `components/command-center/chatbots/ConversationList.tsx` | Conversations list with filters |
| `.claude/skills/` | Session management skills (start, wrap, doc-update, save, test) |
