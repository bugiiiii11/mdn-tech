# SEO Action Plan: mdntech.com

**Generated:** March 17, 2026
**Current Score:** 58/100
**Target Score:** 85+/100

---

## Critical — Fix Immediately (Score Impact: +15-20 points)

### 1. Remove template/placeholder content
**Impact:** Trust, E-E-A-T | **Effort:** 1 hour
**File:** `constants/index.ts`

- Replace all `example.com` links in PROJECTS array with real project URLs or remove the projects section
- Remove "Become Sponsor" (→ youtube.com), "Learning about me" (→ example.com), "Contact Me" (→ contact@example.com) from FOOTER_DATA
- Replace generic social links (youtube.com, github.com, discord.com) with M.D.N Tech's actual accounts
- Remove `LINKS.sourceCode` reference to original template repository

### 2. Fix homepage heading hierarchy
**Impact:** On-Page SEO, Accessibility | **Effort:** 30 minutes
**Files:** All `components/main/` section components

Change all section `<h1>` tags to `<h2>`:
- `about-us.tsx`: "Why Our Approach Changes Everything" → h2
- `skills.tsx`: "What We Build" → h2
- `process.tsx`: "How We Build" → h2
- `encryption.tsx`: "Our Engineering Stack" → h2
- `projects.tsx`: "Our Results" → h2
- `team.tsx`: "Meet Our Team" → h2
- `contact-us.tsx`: "Start Your Project" → h2

Keep only hero "Build Smarter. Ship Faster." as h1. Fix About Us sub-headings from h4 → h3.

### 3. Add hero video poster image
**Impact:** LCP (Core Web Vitals) | **Effort:** 15 minutes
**File:** `components/main/hero.tsx`

- Create a poster image (first frame of `blackhole.webm` as WebP/JPEG)
- Add `poster="/videos/hero-poster.webp"` to the `<video>` element
- This provides instant visual content before video loads

### 4. Add /blog and /team to main navigation
**Impact:** Crawlability, Internal Linking | **Effort:** 15 minutes
**File:** `constants/index.ts` (NAV_LINKS array)

Add:
```typescript
{ name: "Blog", link: "/blog" },
{ name: "Team", link: "/team" },
```

### 5. Fix team page CTA link
**Impact:** UX, Internal Linking | **Effort:** 5 minutes
**File:** `app/team/page.tsx`

Change `href="#contact-us"` to `href="/#contact-us"` so it navigates to the homepage contact form.

---

## High Priority — Fix Within 1 Week (Score Impact: +10-15 points)

### 6. Remove or lazy-load Three.js starfield
**Impact:** LCP -2-4s, JS bundle -700KB | **Effort:** 2-4 hours
**File:** `app/layout.tsx`, `components/main/star-background.tsx`

Options (in order of preference):
- Replace with CSS-only starfield animation (best performance)
- Use `next/dynamic` with `ssr: false` and defer until after LCP
- Reduce to homepage only instead of every page

### 7. Convert key pages to Server Components
**Impact:** LCP -2-4s, SEO crawlability | **Effort:** 4-8 hours
**Files:** `app/blog/page.tsx`, `app/team/page.tsx`, all section components

- Remove `"use client"` from pages with static content
- Extract interactive parts (animations, hover effects) into small client component wrappers
- Keep text content server-rendered for instant HTML delivery

### 8. Defer below-fold videos
**Impact:** LCP -1-3s, bandwidth | **Effort:** 1 hour
**Files:** `components/main/encryption.tsx`, `components/main/skills.tsx`, `components/main/footer.tsx`

- Change `preload="false"` → `preload="none"` (valid value)
- Use Intersection Observer to trigger playback when scrolled into view
- Remove duplicate `blackhole.webm` load in footer

### 9. Add canonical tags to all subpages
**Impact:** Indexability | **Effort:** 30 minutes
**Files:** Metadata in `/team`, `/blog`, `/privacy`, `/terms` layouts

Add `alternates: { canonical: "https://mdntech.com/[path]" }` to each page's metadata.

### 10. Fix domain inconsistency
**Impact:** Trust, E-E-A-T | **Effort:** 30 minutes
**Files:** `app/privacy/page.tsx`, `app/terms/page.tsx`

Replace all references to `mdntech.org` with `mdntech.com` (or ensure `mdntech.org` redirects to `mdntech.com`).

### 11. Add real team member LinkedIn profiles
**Impact:** E-E-A-T (Experience, Expertise) | **Effort:** 15 minutes
**File:** `constants/index.ts`

Replace generic `https://linkedin.com` with real profile URLs for all team members. Uncomment social links rendering.

### 12. Stagger blog post publish dates
**Impact:** Content Freshness signals | **Effort:** 15 minutes
**File:** `data/blog-posts.ts`

Backdate posts to different weeks/months to show editorial consistency rather than batch publishing.

---

## Medium Priority — Fix Within 1 Month (Score Impact: +8-12 points)

### 13. Fix font loading
**Impact:** LCP -200-500ms | **Effort:** 30 minutes
**Files:** `app/layout.tsx`, `app/globals.css`

- Add Cedarville Cursive via `next/font/google` (like Inter is already done)
- Remove `@import url(...)` from globals.css

### 14. Fix schema issues
**Impact:** Rich Results eligibility | **Effort:** 1 hour
**Files:** `app/layout.tsx`, `app/blog/[slug]/page.tsx`, `data/blog-posts.ts`

- Change `Article` → `BlogPosting` in blog post schema
- Fix `foundingDate: "2024"` → `"2024-01-01"`
- Store blog dates in ISO 8601 format
- Track `dateModified` separately from `datePublished`
- Add `telephone` to Organization ContactPoint

### 15. Add missing schema types
**Impact:** Rich Results, AI visibility | **Effort:** 2-3 hours
**Files:** `app/layout.tsx`, `app/blog/layout.tsx`, `app/team/layout.tsx`

- Add `ProfessionalService` + `OfferCatalog` on homepage
- Add `CollectionPage` + `ItemList` on `/blog`
- Add `AboutPage` + `Person` on `/team`
- Add `BreadcrumbList` to all subpages

### 16. Create custom 404 page
**Impact:** UX, Crawl signals | **Effort:** 30 minutes
**File:** Create `app/not-found.tsx`

### 17. Add "Latest from our blog" section to homepage
**Impact:** Internal linking | **Effort:** 1-2 hours

Display 2-3 recent posts between Team and Contact sections to drive link equity to blog.

### 18. Add individual author attribution to blog posts
**Impact:** E-E-A-T | **Effort:** 1-2 hours
**File:** `data/blog-posts.ts`, `app/blog/[slug]/page.tsx`

Create author objects with name, bio, image, LinkedIn URL. Use `Person` schema instead of `Organization` for author.

### 19. Consolidate duplicate generateMetadata
**Impact:** Maintenance, potential conflicts | **Effort:** 15 minutes
**Files:** `app/blog/[slug]/page.tsx`, `app/blog/[slug]/layout.tsx`

Keep metadata in `page.tsx` only. Remove from layout.

### 20. Reduce Framer Motion animations
**Impact:** INP -100-300ms | **Effort:** 2-4 hours
**Files:** All `components/main/` files

- Replace `whileInView` with CSS `@keyframes` + `IntersectionObserver`
- Remove or reduce particle effects (max 2-3 per card, not 10+)
- Remove mouse-tracking 3D effects or limit to desktop
- Remove `backdrop-blur` from fixed navbar

### 21. Fix sitemap lastModified dates
**Impact:** Crawl efficiency | **Effort:** 30 minutes
**File:** `app/sitemap.ts`

Use actual content dates instead of `new Date()`.

### 22. Add AI crawler rules to robots.txt
**Impact:** AI Search visibility | **Effort:** 15 minutes
**File:** `app/robots.ts`

Make deliberate Allow/Disallow decisions for GPTBot, ClaudeBot, CCBot, Google-Extended, PerplexityBot, etc.

### 23. Add next.config.js optimizations
**Impact:** Bundle size, image quality | **Effort:** 15 minutes
**File:** `next.config.js`

```js
images: { formats: ['image/avif', 'image/webp'] },
compiler: { removeConsole: process.env.NODE_ENV === 'production' },
```

---

## Low Priority — Backlog (Score Impact: +5-8 points)

### 24. Add FAQ sections with FAQ schema to blog posts and homepage
### 25. Add HowTo schema to the "How We Build" process section
### 26. Add visible breadcrumb navigation UI to all subpages
### 27. Add contextual cross-links within blog post body text
### 28. Create table of contents component for blog posts
### 29. Remove dead Swiper imports from `projects.tsx`
### 30. Dynamic import EmailJS (only load on form submit)
### 31. Add `aria-label` and `aria-expanded` to hamburger menu button
### 32. Convert logo from PNG to SVG
### 33. Add source citations to blog statistics
### 34. Create `llms.txt` for AI crawler guidance
### 35. Add Content-Security-Policy header

---

## Future Growth Recommendations (60+ days)

1. **Publish 2-4 blog posts per month** on a consistent schedule
2. **Add client testimonials and case studies** (even 2-3 anonymized ones)
3. **Create dedicated service pages** (`/services/ai-development`, `/services/web3`, etc.)
4. **Build comparison content** for AI citation opportunities
5. **Create an About page** separate from homepage section
6. **List on third-party review platforms** (Clutch, G2, GoodFirms)
7. **Add AggregateRating schema** once reviews are collected
8. **Create individual team member profile pages**

---

## Implementation Timeline

| Week | Tasks | Expected Score |
|------|-------|---------------|
| Week 1 | Critical fixes (#1-5) | 58 → 68 |
| Week 2 | High priority (#6-12) | 68 → 78 |
| Week 3-4 | Medium priority (#13-23) | 78 → 85 |
| Ongoing | Low priority + growth | 85 → 90+ |

---

*Generated March 17, 2026 | Based on source code analysis + Google September 2025 Quality Rater Guidelines*
