# Full SEO Audit Report: mdntech.com

**Audit Date:** March 17, 2026
**Domain:** https://mdntech.com
**Business Type:** B2B Technology Agency (AI, Web3, Full-Stack Development)
**Framework:** Next.js 14.2.15 (App Router) on Vercel
**Location:** Umm Al Quwain, UAE

---

## SEO Health Score: 53/100

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Technical SEO | 72/100 | 25% | 18.0 |
| Content Quality & E-E-A-T | 62/100 | 25% | 15.5 |
| On-Page SEO | 48/100 | 20% | 9.6 |
| Schema / Structured Data | 68/100 | 10% | 6.8 |
| Performance (CWV) | 30/100 | 10% | 3.0 |
| Images | 55/100 | 5% | 2.75 |
| AI Search Readiness | 48/100 | 5% | 2.4 |
| **Total** | | **100%** | **58/100** |

---

## Executive Summary

M.D.N Tech has a solid technical foundation — proper Next.js conventions, strong security headers, good structured data, and clean URL structure. However, three systemic problems drag the score down significantly:

1. **Catastrophic performance** — Three.js (650KB+) loaded on every page, 4 autoplay videos, all components client-rendered. Estimated Lighthouse score: 25-40/100. All Core Web Vitals predicted to fail.

2. **Template remnants destroy trust** — Placeholder `example.com` links, generic social media URLs, "Become Sponsor" footer items from the original `space-portfolio` template. This is the single biggest E-E-A-T risk.

3. **Broken information architecture** — Blog and team pages unreachable from main navigation. 8 `<h1>` tags on homepage. Zero internal cross-linking between pages. Extreme hub-and-spoke link equity problem.

### Top 5 Critical Issues

1. Template/placeholder content with `example.com` links (trust killer)
2. Three.js WebGL canvas loading 700KB+ on every single page
3. 8 `<h1>` tags on homepage (should be 1)
4. Blog and team pages not linked from main navigation
5. Hero video without `poster` attribute — blank LCP element

### Top 5 Quick Wins

1. Fix heading hierarchy (h1 → h2 for section headings)
2. Add `/blog` and `/team` to main navigation
3. Add `poster` attribute to hero video
4. Change `Article` to `BlogPosting` in schema + fix `foundingDate` format
5. Fix `preload="false"` → `preload="none"` on video elements

---

## 1. Technical SEO (72/100)

### Strengths
- Robots.txt properly configured (blocks `/api/` and `/_next/`)
- Dynamic sitemap with all pages included and logical priority hierarchy
- Strong security headers (HSTS, X-Frame-Options, X-Content-Type-Options)
- Clean URL structure with descriptive slugs
- Proper HTTPS via Vercel
- Static generation for all pages via Next.js SSG

### Issues Found

| Priority | Issue | Location |
|----------|-------|----------|
| CRITICAL | Hero video has no `poster` attribute — blank LCP | `components/main/hero.tsx` |
| CRITICAL | Three.js loaded on every page (700KB+) | `app/layout.tsx` line 95 |
| CRITICAL | Blog and team pages fully client-rendered | `app/blog/page.tsx`, `app/team/page.tsx` |
| HIGH | Missing canonical tags on `/team`, `/blog`, `/privacy`, `/terms` | Page metadata |
| HIGH | Domain inconsistency: privacy/terms reference `mdntech.org`, site is `mdntech.com` | Privacy/terms pages |
| HIGH | No custom 404 page (`app/not-found.tsx` missing) | App directory |
| HIGH | Duplicate `generateMetadata` in blog slug page + layout | `app/blog/[slug]/` |
| MEDIUM | No AI crawler rules in robots.txt (GPTBot, ClaudeBot, etc.) | `app/robots.ts` |
| MEDIUM | Sitemap `lastModified` uses `new Date()` — always current date | `app/sitemap.ts` |
| MEDIUM | Cedarville Cursive font via CSS `@import` (render-blocking) | `app/globals.css` |
| MEDIUM | No Content-Security-Policy header | `next.config.js` |
| LOW | No `favicon.ico` (uses PNG instead) | Public directory |
| LOW | Hamburger menu lacks `aria-label` and `aria-expanded` | `components/main/navbar.tsx` |

### Score Breakdown

| Sub-category | Score |
|-------------|-------|
| Crawlability | 80/100 |
| Indexability | 70/100 |
| Security | 85/100 |
| URL Structure | 95/100 |
| Mobile Optimization | 85/100 |
| Core Web Vitals (technical) | 50/100 |
| JS Rendering | 55/100 |

---

## 2. Content Quality & E-E-A-T (62/100)

### E-E-A-T Composite Score: 44/100

| Dimension | Score | Key Issue |
|-----------|-------|-----------|
| Experience | 40/100 | No case studies, portfolio has placeholder links |
| Expertise | 55/100 | Strong blog content but generic "Team" attribution |
| Authoritativeness | 30/100 | No external validation, testimonials, or third-party reviews |
| Trustworthiness | 50/100 | Business registration present, but template remnants undermine trust |

### Content Analysis

**Homepage (~850 words including accordion content)**
- Meets minimum word count but barely
- Process section content hidden in collapsed accordions
- 8 `<h1>` tags — severe heading hierarchy violation
- Good value proposition messaging but lacks specifics

**Blog (3 posts, all published March 13, 2026)**
- Strong content depth (3,500-4,200 words each)
- Accurate technical content with real tools and metrics
- Same-day batch publish signals content dump, not editorial consistency
- Generic "M.D.N Tech Team" author attribution
- No images in blog posts (gradient placeholders instead)
- Identical structural pattern across all three posts
- Statistics lack source citations

**Team Page (~180 words)**
- Real names with photos and specific experience claims
- LinkedIn links are generic placeholders for 2 of 3 members
- Social links commented out in rendered UI
- No individual profile pages or verifiable credentials
- CTA button links to `#contact-us` which doesn't exist on team page

### Critical Content Issues

1. **Template remnants in `constants/index.ts`:**
   - PROJECTS array: all links go to `https://example.com`
   - FOOTER_DATA: "Become Sponsor" → youtube.com, "Learning about me" → example.com, "Contact Me" → contact@example.com
   - Social links: generic youtube.com, github.com, discord.com

2. **Internal linking is nearly nonexistent:**
   - Navbar only links to homepage anchor sections
   - `/blog` only linked from footer
   - `/team` has no link at all (navbar goes to `/#team`)
   - No cross-references between blog posts in body text
   - No "Latest from our blog" on homepage
   - No visible breadcrumb navigation rendered

3. **No social proof:**
   - Zero client testimonials
   - No case studies
   - No named client projects
   - No third-party review platform listings (Clutch, G2)
   - Claims like "100+ Web3 partnerships" with no evidence

---

## 3. On-Page SEO (48/100)

### Title Tags & Meta Descriptions

| Page | Title | Description | Status |
|------|-------|-------------|--------|
| `/` | "M.D.N Tech \| AI & Full-Stack Development Agency \| UAE" | 156 chars | PASS |
| `/team` | "Our Team \| M.D.N Tech" | Present | PASS |
| `/blog` | "Blog \| M.D.N Tech" | Present | PASS |
| `/blog/[slug]` | Dynamic with template | Present | PASS |
| `/privacy` | "Privacy Policy \| M.D.N Tech" | Present | PASS |
| `/terms` | "Terms & Conditions \| M.D.N Tech" | Present | PASS |

Title template system (`%s | M.D.N Tech`) is well-implemented.

### Heading Structure — FAILING

```
Homepage h1 count: 8 (should be 1)
- "Build Smarter. Ship Faster." (hero) ← keep as h1
- "Why Our Approach Changes Everything" ← should be h2
- "What We Build" ← should be h2
- "How We Build" ← should be h2
- "Our Engineering Stack" ← should be h2
- "Our Results" ← should be h2
- "Meet Our Team" ← should be h2
- "Start Your Project" ← should be h2

Sub-heading levels skip from h1 to h4 in About Us section
```

### Internal Linking — FAILING (25/100)

```
Navigation links:
  About Us → /#about-us (anchor)     Blog → (footer only)
  Services → /#services (anchor)     Team → /#team (anchor, not /team)
  Process → /#process (anchor)       Privacy → /privacy (footer)
  Projects → /#projects (anchor)     Terms → /terms (footer)
  Contact → /#contact-us (anchor)
```

- Blog accessible only from footer
- Team page has zero inbound links from navigation
- No contextual body links between pages
- No breadcrumb UI rendered (only schema on blog posts)
- Team page CTA (`#contact-us`) is broken — contact form is on homepage

### Open Graph & Social — PASSING

Complete OG implementation with proper images (1200x630), article metadata for blog posts, and Twitter cards.

---

## 4. Schema / Structured Data (68/100)

### Existing Schema (4 blocks, all JSON-LD)

| Schema | Location | Quality | Issues |
|--------|----------|---------|--------|
| Organization | Global (layout.tsx) | Good | `foundingDate: "2024"` not ISO 8601, missing `telephone`, missing `postalCode` |
| WebSite | Global (layout.tsx) | Good | Missing `SearchAction` and `inLanguage` |
| Article | Blog posts | Good | Should be `BlogPosting`, `dateModified` = `datePublished` always |
| BreadcrumbList | Blog posts | Excellent | No issues |

### Missing Schema Opportunities

| Priority | Schema Type | Page | Impact |
|----------|-------------|------|--------|
| HIGH | `ProfessionalService` + `OfferCatalog` | Homepage | Service visibility in search |
| HIGH | `CollectionPage` + `ItemList` | `/blog` | Blog listing structure |
| MEDIUM | `BreadcrumbList` | All subpages | Breadcrumb rich results |
| MEDIUM | `Person` (via `AboutPage`) | `/team` | Team member visibility |
| LOW | `SearchAction` | Global | Only when search exists |
| LOW | `FAQPage` | Homepage + blog | AI extraction opportunities |
| LOW | `HowTo` | Homepage process section | Process step rich results |

### Quick Schema Fixes

1. Change `Article` → `BlogPosting` in `app/blog/[slug]/page.tsx` line 99
2. Fix `foundingDate` from `"2024"` to `"2024-01-01"` in `app/layout.tsx` line 30
3. Store blog dates in ISO 8601 format
4. Track `dateModified` separately from `datePublished`

---

## 5. Performance (30/100)

### Core Web Vitals Prediction

| Metric | Estimated | Good Threshold | Status |
|--------|-----------|---------------|--------|
| LCP | 5-8 seconds | ≤ 2.5s | POOR |
| INP | 300-600ms | ≤ 200ms | POOR |
| CLS | 0.15-0.35 | ≤ 0.1 | POOR |

**Estimated Lighthouse Score: 25-40/100**

### Root Causes

**1. Three.js in Root Layout (CRITICAL)**
- `StarsCanvas` in `app/layout.tsx` line 95 renders 1000 animated WebGL particles on every page
- Three.js (~650KB) + @react-three/fiber (~180KB) + @react-three/drei (~300KB) = 1.1MB+
- `useFrame()` runs every animation frame, blocking main thread
- Impact: +2-4s LCP, +100-300ms INP

**2. Four Autoplay Videos (CRITICAL)**
- Hero (`blackhole.webm`), encryption (`encryption-bg.webm`), skills (`skills-bg.webm`), footer (`blackhole.webm` again)
- Hero video has no `poster` — blank LCP element
- `preload="false"` is invalid (browsers ignore it, preload anyway)
- `blackhole.webm` loaded twice (hero + footer)
- No lazy loading on below-fold videos
- No MP4 fallback for Safari

**3. All Components Client-Rendered (HIGH)**
- 11 out of 11 components use `"use client"`
- Next.js sends empty HTML shell — all content waits for JS
- Blog listing imports entire blog dataset into client bundle
- Impact: +2-4s LCP on slow connections

**4. Excessive Animations (HIGH)**
- Every card has 10+ animated elements (borders, corners, particles, glows, scanning lines)
- Mouse-tracking with `getBoundingClientRect()` on every mousemove
- Continuous infinite loop animations on every visible card
- Impact: INP 300-600ms on mid-range devices

**5. Font Loading (MEDIUM)**
- Cedarville Cursive via CSS `@import` creates 4-request waterfall chain
- Inter correctly uses `next/font/google`
- Impact: +200-500ms LCP

**Total estimated JS payload: ~1.2-1.5 MB (minified, before gzip)**
Recommended budget: < 300KB compressed

### Estimated Impact of Fixes

| Metric | Current | After P0 Fixes | After All Fixes |
|--------|---------|---------------|-----------------|
| LCP | 5-8s | 2.5-4s | 1.5-2.5s |
| INP | 300-600ms | 250-500ms | 80-150ms |
| CLS | 0.15-0.35 | 0.05-0.15 | < 0.05 |
| JS Bundle | ~1.2-1.5 MB | ~500-700 KB | ~200-350 KB |
| Lighthouse | 25-40 | 50-65 | 85-95 |

---

## 6. Images (55/100)

| Issue | Location | Priority |
|-------|----------|----------|
| Hero video without poster image | `hero.tsx` | CRITICAL |
| Blog post images may not exist (gradient placeholders shown) | `/public/blog/` | HIGH |
| Logo uses PNG instead of SVG | `navbar.tsx` | MEDIUM |
| No `sizes` prop on responsive images | Various | MEDIUM |
| No image optimization config in next.config.js | `next.config.js` | MEDIUM |
| World map SVG (1200x800) loaded for decoration | `contact-us.tsx` | LOW |

---

## 7. AI Search Readiness (48/100)

### What Works
- JSON-LD schema well-implemented (Organization, WebSite, Article, BreadcrumbList)
- Blog posts have structured headings creating extractable sections
- Specific quotable statistics in blog content
- Complete Open Graph and meta description coverage

### What's Missing
- No FAQ schema (high-value for AI Overviews)
- No HowTo schema (process section is perfect candidate)
- No Service schema (6 services described but no structured data)
- No table of contents in blog posts
- No clear "X is Y" definition patterns for AI extraction
- Client-side rendering dependency — AI crawlers may not execute JS fully
- Content hidden in accordion elements
- No `llms.txt` file
- Statistics lack source citations (reduces citation reliability)
- No comparison content (vs pages, decision frameworks)

---

## Pages Discovered

| URL | Status | Priority |
|-----|--------|----------|
| `/` | Indexed | 1.0 |
| `/blog` | Indexed | 0.8 |
| `/team` | Indexed | 0.8 |
| `/blog/claude-code-complete-guide` | Indexed | 0.8 |
| `/blog/agentic-ai-systems-guide` | Indexed | 0.7 |
| `/blog/smart-contracts-complete-guide` | Indexed | 0.7 |
| `/privacy` | Indexed | 0.3 |
| `/terms` | Indexed | 0.3 |

**Total pages: 8** (small site, but well-focused)

---

## Detailed Reports

- [Technical SEO](technical-seo.md) — Crawlability, indexability, security, CWV
- [Content Quality](content-quality.md) — E-E-A-T, readability, AI citation readiness
- [Schema Audit](schema-audit.md) — JSON-LD validation, missing opportunities
- [Performance Audit](performance-audit.md) — Bundle analysis, CWV predictions

---

*Audit conducted March 17, 2026 | Methodology: Source code analysis + Google September 2025 Quality Rater Guidelines*
