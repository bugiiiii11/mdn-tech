# Testing Infrastructure -- M.D.N Tech Website

> Reference doc for testing the M.D.N Tech Next.js website.
> Last updated: 2026-03-17

## Current State

### Next.js App

| Component | Status | Details |
|-----------|--------|---------|
| Test files | Missing | Zero `.test.ts`/`.spec.ts` files |
| Test framework | Missing | No vitest or jest installed |
| ESLint | Exists | Next.js built-in, `npm run lint` works |
| TypeScript | Exists | Strict mode, `npx tsc --noEmit` works |
| Build check | Works | `npm run build` compiles to `.next/` |
| CI/CD | Partial | Vercel deploys without tests |

### npm scripts available

```
dev      -- next dev server
build    -- next build (production)
start    -- next start (production server)
lint     -- next lint (ESLint)
```

## What `/test` Can Run TODAY (Zero Setup)

| Check | Command | What it catches |
|-------|---------|----------------|
| ESLint | `npm run lint` | Code quality, React hooks rules, Next.js best practices |
| Build | `npm run build` | Import errors, syntax errors, missing deps, SSR issues |
| TypeScript | `npx tsc --noEmit` | Type errors, interface mismatches |

## App Structure

```
app/
├── layout.tsx           # Root layout
├── page.tsx             # Home page
├── blog/
│   ├── page.tsx         # Blog listing (client component)
│   └── [slug]/
│       ├── page.tsx     # Blog post (server component with generateMetadata)
│       └── BlogPostContent.tsx  # Blog post content (client component)
├── privacy/page.tsx     # Privacy policy
├── terms/page.tsx       # Terms & conditions
components/
├── main/                # Site sections (about-us, contact-us, footer, etc.)
├── navigation/          # Navbar
data/
├── blog-posts.ts        # Blog post content data
lib/
├── motion.ts            # Framer Motion variants
```

## Phase Plan

### Phase 1 -- `/test` skill (done)
Run what exists, report pass/fail.
- Lint check
- Build check
- TypeScript check

### Phase 2 -- Add vitest (future)
- Add: `vitest`, `@testing-library/react`, `jsdom`
- Test data helpers (blog-posts.ts functions)
- Test component rendering
- Add `"test": "vitest run"` to npm scripts

### Phase 3 -- CI/CD (future)
- GitHub Actions: lint + build + test on PR
- Block Vercel deploy on test failure
