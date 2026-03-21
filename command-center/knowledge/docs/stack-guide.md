---
title: "Standard Stack Setup Guide"
category: doc
tags: [stack, setup, nextjs, supabase, railway, vercel]
updated: 2026-03-21
---

# Standard Stack Setup Guide

How to spin up a new M.D.N Tech project from scratch. All projects use the same stack.

---

## 1. Create Next.js App

```bash
npx create-next-app@latest project-name --typescript --tailwind --app --eslint
cd project-name
```

## 2. Supabase Setup

1. Create project at `supabase.com` (org: MDN Tech)
2. Copy Project URL, anon key, service_role key
3. Install client:

```bash
npm install @supabase/supabase-js @supabase/ssr
```

4. Create `lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/middleware.ts`
   (copy from Command Center repo -- same pattern)
5. Add middleware.ts for auth session refresh
6. Add to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## 3. Railway Setup

1. Create project at `railway.app`
2. Add any backend services (APIs, bots, workers)
3. Set environment variables in Railway dashboard
4. Enable auto-deploy from GitHub main branch

## 4. Vercel Setup

1. Import GitHub repo at `vercel.com`
2. Add all env vars from `.env.local` in Vercel > Settings > Environment Variables
3. Set custom domain if needed
4. Enable auto-deploy from main branch

## 5. Register in Command Center

Go to `/command-center/projects/new` and enter:
- Supabase project ref (from Supabase dashboard URL)
- Railway project ID (from Railway URL)
- Vercel project ID (from Vercel URL)

---

## Common Packages

```bash
# UI
npm install lucide-react clsx tailwind-merge

# Forms & validation
npm install react-hook-form zod

# Dates
npm install date-fns

# Email (transactional)
npm install @emailjs/browser

# Animations
npm install framer-motion
```

## Standard File Structure

```
app/
  (public)/        -- Public routes (no auth)
  (app)/           -- Authenticated routes
  api/             -- API routes
components/
  ui/              -- Shared UI components
  [feature]/       -- Feature-specific components
lib/
  supabase/        -- Supabase clients
  utils.ts         -- cn() and helpers
supabase/
  migrations/      -- SQL migrations
```
