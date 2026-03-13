# M.D.N Tech SEO Audit Report

**Website:** mdntech.com
**Business Type:** Tech Agency / IT Services Company
**Company:** M.D.N Tech FZE (UAQ Free Trade Zone, UAE)
**Audit Date:** March 13, 2026
**Framework:** Next.js 14 (App Router)

---

## Executive Summary

### Overall SEO Health Score: 38/100

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Technical SEO | 25/100 | 25% | 6.25 |
| Content Quality | 55/100 | 25% | 13.75 |
| On-Page SEO | 35/100 | 20% | 7.00 |
| Schema / Structured Data | 0/100 | 10% | 0.00 |
| Performance (CWV) | 70/100 | 10% | 7.00 |
| Images | 40/100 | 5% | 2.00 |
| AI Search Readiness | 40/100 | 5% | 2.00 |
| **Total** | | **100%** | **38/100** |

### Top 5 Critical Issues

1. **No robots.txt file** - Search engines have no crawl directives
2. **No XML sitemap** - Pages may not be discovered/indexed properly
3. **No Schema.org structured data** - Missing Organization, LocalBusiness, Service schemas
4. **Weak meta description** - "Welcome to M.D.N Tech" provides no value
5. **H1 tag hidden with `invisible` class** - Main heading not visible to users

### Top 5 Quick Wins

1. Add `app/robots.ts` with proper crawl rules
2. Add `app/sitemap.ts` to auto-generate XML sitemap
3. Update `config/index.ts` with compelling meta title/description
4. Add JSON-LD Organization schema to layout
5. Fix H1 tag structure on homepage

---

## Technical SEO (Score: 25/100)

### Crawlability Issues

| Issue | Severity | Status |
|-------|----------|--------|
| robots.txt missing | Critical | Not Found |
| XML sitemap missing | Critical | Not Found |
| Canonical URLs not configured | High | Missing |
| hreflang tags missing | Medium | Not configured |

#### Findings:

**robots.txt**: No `robots.txt` or `app/robots.ts` file exists in the project. This means:
- Search engines have no guidance on what to crawl
- No sitemap reference for discovery
- No protection of sensitive routes like `/api/*`

**Sitemap**: No `sitemap.xml` or `app/sitemap.ts` file. The site has 7 crawlable pages:
- `/` (Homepage)
- `/team`
- `/blog`
- `/blog/[slug]` (6 posts)
- `/privacy`
- `/terms`

**Canonical URLs**: The metadata configuration in `config/index.ts` has no `metadataBase` or canonical configuration. This can cause duplicate content issues.

### Indexability Problems

| Issue | Severity | Details |
|-------|----------|---------|
| Blog pages use `"use client"` | Medium | Server components recommended for SEO |
| No `generateMetadata` on pages | High | Page-specific meta tags missing |
| Dynamic blog slugs not pre-generated | Medium | No `generateStaticParams` function |

### Security Concerns

| Header | Status | Recommendation |
|--------|--------|----------------|
| Content-Security-Policy | Unknown | Configure in `next.config.js` |
| X-Frame-Options | Unknown | Add DENY or SAMEORIGIN |
| Strict-Transport-Security | Unknown | Enable HSTS |
| X-Content-Type-Options | Unknown | Add nosniff |

**Note:** Cannot verify headers without live site access. Recommend adding security headers via `next.config.js`:

```js
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
]
```

### Core Web Vitals Status

Cannot measure actual CWV without live site access. Based on code analysis:

| Metric | Risk Level | Reason |
|--------|------------|--------|
| LCP | Medium | Large hero video (blackhole.webm), multiple animated components |
| INP | Low | Framer Motion animations are optimized |
| CLS | Medium | No explicit `width`/`height` on some images, animated elements |

**Concerns:**
- Hero video auto-plays (potential LCP issue)
- No `loading="lazy"` on below-fold images
- Animated counters may cause layout shift

---

## Content Quality (Score: 55/100)

### E-E-A-T Assessment

| Signal | Score | Details |
|--------|-------|---------|
| **Experience** | 7/10 | Team bios mention years of experience, specific projects |
| **Expertise** | 7/10 | Technical skills clearly listed, service descriptions detailed |
| **Authoritativeness** | 5/10 | No case studies with results, no client testimonials, placeholder project links |
| **Trustworthiness** | 6/10 | Company address provided, Privacy/Terms pages exist, UAE registration mentioned |

### Thin Content Detection

| Page | Word Count | Status |
|------|------------|--------|
| Homepage | ~800 | Adequate |
| Team page | ~600 | Adequate |
| Blog listing | ~150 | Thin |
| Blog posts | ~100-200 each | Very Thin (placeholder content) |
| Privacy | ~2,500 | Good |
| Terms | ~4,000 | Good |

**Critical Issue:** All blog post content says "Content coming soon..." - These are essentially placeholder pages that provide no value and may be flagged as thin content.

### Duplicate Content Issues

- Project descriptions are generic and similar across cards
- Blog post structure is repetitive with placeholder content

### Readability

| Metric | Score | Notes |
|--------|-------|-------|
| Grade Level | 10-12 | Appropriate for B2B tech audience |
| Sentence Complexity | Medium | Clear, professional language |
| Jargon Usage | High | Acceptable for target audience (tech companies) |

---

## On-Page SEO (Score: 35/100)

### Meta Tags Analysis

**Current Configuration (`config/index.ts`):**

```typescript
title: "M.D.N Tech"  // Too generic
description: "Welcome to M.D.N Tech"  // No value, no keywords
keywords: ["reactjs", "nextjs", ...]  // Tech stack, not services
```

**Issues:**
- Title doesn't include primary keywords (AI development, Web3, Full-stack)
- Description is generic welcome message
- Keywords are framework names, not service keywords
- No Open Graph metadata
- No Twitter Card metadata
- No `metadataBase` for absolute URLs

**Recommended:**
```typescript
title: "M.D.N Tech | AI & Full-Stack Development Agency | UAE"
description: "Ship production-ready AI systems, Web3 solutions, and full-stack applications faster. UAE-based tech agency with global delivery. Full lifecycle ownership."
```

### Heading Structure

**Homepage:**
| Level | Content | Issue |
|-------|---------|-------|
| H1 | "UAE-Based · AI-Powered Development · Global Delivery" | Hidden with `invisible` class |
| H1 | (none visible) | "Build Smarter. Ship Faster." is in `<span>` not `<h1>` |
| H1 | "Why Our Approach Changes Everything" | Section H1 (should be H2) |
| H4 | Feature card titles | Skipped H2, H3 |

**Critical Issues:**
1. Primary H1 is marked `invisible` - users can't see it
2. Main hero text is not in H1 tag
3. Multiple H1 tags on page (each section has its own)
4. Heading hierarchy broken (H1 → H4 skip)

**Other Pages:**
- `/team`: H1 "Meet Our Team" - Good
- `/blog`: H1 "Our Blog" - Good
- `/privacy`: H1 "Privacy Policy" - Good
- `/terms`: H1 "Terms & Conditions" - Good
- `/blog/[slug]`: H1 is article title - Good

### Internal Linking

| Issue | Details |
|-------|---------|
| Navigation | 6 anchor links to homepage sections |
| Footer links | External social links, no internal page links |
| Blog posts | Link to homepage contact, not to related posts |
| Cross-page linking | Minimal - no service pages, no case study pages |

**Missing:**
- Breadcrumbs on blog posts
- Related posts section
- Service detail pages with internal links

### URL Structure

| URL | Status | Notes |
|-----|--------|-------|
| `/` | Good | Clean root |
| `/team` | Good | Descriptive |
| `/blog` | Good | Standard |
| `/blog/[slug]` | Good | Readable slugs (e.g., `ai-engineering-2026`) |
| `/privacy` | Good | Standard |
| `/terms` | Good | Standard |

**Recommendation:** Add service pages like `/services/ai-development`, `/services/web3`, etc.

---

## Schema & Structured Data (Score: 0/100)

### Current Implementation

**No structured data found in the codebase.**

The site is missing all recommended schemas for a tech agency:

| Schema Type | Status | Priority |
|-------------|--------|----------|
| Organization | Missing | Critical |
| LocalBusiness | Missing | High |
| WebSite | Missing | High |
| Service | Missing | High |
| BreadcrumbList | Missing | Medium |
| Article (Blog) | Missing | High |
| Person (Team) | Missing | Medium |
| FAQPage | Missing | Low |

### Recommended Implementation

**Organization Schema (for `layout.tsx`):**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "M.D.N Tech FZE",
  "url": "https://mdntech.com",
  "logo": "https://mdntech.com/logo.png",
  "description": "AI & Full-Stack Development Agency",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Al Shmookh Business Center M 1003, One UAQ",
    "addressLocality": "Umm Al Quwain",
    "addressCountry": "AE"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "contact@mdntech.org",
    "contactType": "sales"
  },
  "sameAs": [
    "https://www.instagram.com/mdntechorg/",
    "https://x.com/MDNTechOrg",
    "https://www.linkedin.com/company/mdntech/"
  ]
}
```

---

## Performance (Score: 70/100)

### Code-Based Analysis

| Factor | Assessment | Notes |
|--------|------------|-------|
| Next.js Image | Used | Proper optimization in most places |
| Font Optimization | Good | Google Fonts loaded via next/font |
| Code Splitting | Auto | Next.js handles this |
| Video Loading | Concern | Auto-play video on hero |

### Potential Issues

1. **Hero Video** (`blackhole.webm`):
   - Auto-plays without user interaction
   - May delay LCP
   - No `poster` attribute for placeholder

2. **Animation Library** (Framer Motion):
   - Heavy animations on every section
   - Multiple `useInView` hooks
   - Particle animations on cards

3. **Three.js** (StarCanvas):
   - 3D canvas running in background
   - GPU-intensive on mobile

4. **Missing Optimizations in `next.config.js`:**
   - No image optimization config
   - No compression settings
   - No security headers

---

## Images (Score: 40/100)

### Alt Text Audit

| Component | Alt Text Status |
|-----------|----------------|
| Logo (navbar) | Good: `alt="M.D.N Tech"` |
| Logo (footer) | **Bad**: `alt=""` (empty) |
| Hero image | Commented out (not used) |
| Skill icons | Good: `alt={name}` |
| Project images | Good: `alt={title}` |
| Team photos | Good: `alt={member.name}` |
| World map | Good: `alt="World Map"` |
| Lock icons | Good: `alt="Lock top/main"` |

### Image Optimization Issues

| Issue | Count | Details |
|-------|-------|---------|
| Empty alt text | 1 | Footer logo |
| Missing lazy loading | Several | Below-fold images load eagerly |
| Unoptimized formats | Unknown | PNG files in `/public` (could be WebP) |

### Recommendations

1. Add meaningful alt to footer logo: `alt="M.D.N Tech logo"`
2. Convert PNG images to WebP format
3. Add `loading="lazy"` to below-fold images
4. Add `priority` prop to hero/above-fold images

---

## AI Search Readiness (Score: 40/100)

### Citability Assessment

| Factor | Score | Notes |
|--------|-------|-------|
| Clear entity definitions | 6/10 | Company name, services defined |
| Unique value propositions | 7/10 | "Weeks not months", full-stack ownership |
| Factual claims | 5/10 | Experience claims without specific numbers |
| Source attribution | 3/10 | No case studies, no client references |
| Structured content | 4/10 | No schema markup, limited structure |

### AI Crawler Accessibility

| Factor | Status | Impact |
|--------|--------|--------|
| robots.txt | Missing | AI crawlers have no guidance |
| llms.txt | Missing | No LLM-specific guidance |
| Content freshness | Medium | Blog content is placeholder |
| Semantic HTML | Partial | Some heading issues |

### Recommendations for AI Visibility

1. **Add `llms.txt`** at site root with company description
2. **Create fact-based content** with specific metrics:
   - "Over X projects delivered"
   - "Y+ years combined experience"
   - "Based in UAE since YYYY"
3. **Add client testimonials/case studies** for authority
4. **Implement FAQ schema** on service sections
5. **Create authoritative "About" page** with team credentials

---

## Page-by-Page Analysis

### Homepage (`/`)

| Element | Status | Issue |
|---------|--------|-------|
| Title | Poor | "M.D.N Tech" - too generic |
| Description | Poor | "Welcome to M.D.N Tech" |
| H1 | Critical | Hidden/missing |
| Schema | Missing | None |
| Images | Partial | Hero image commented out |
| Links | Limited | Only section anchors |

### Team Page (`/team`)

| Element | Status | Issue |
|---------|--------|-------|
| Title | Missing | Inherits global title |
| Description | Missing | No page-specific |
| H1 | Good | "Meet Our Team" |
| Schema | Missing | No Person schema |
| Images | Good | Team photos with alt text |

### Blog Pages (`/blog`, `/blog/[slug]`)

| Element | Status | Issue |
|---------|--------|-------|
| Title | Missing | No page-specific title |
| Description | Missing | No page-specific |
| H1 | Good | Present on each page |
| Schema | Missing | No Article schema |
| Content | Critical | Placeholder "coming soon" |
| SSR | Issue | "use client" directive |

### Privacy & Terms

| Element | Status | Notes |
|---------|--------|-------|
| Content | Good | Comprehensive legal pages |
| Structure | Good | Proper heading hierarchy |
| Title/Description | Missing | No page-specific meta |

---

## Competitor Comparison Opportunities

Based on the services offered, competitors likely include:
- Toptal, Andela (AI/full-stack talent)
- ConsenSys, OpenZeppelin (Web3/blockchain)
- Lemon.io, Turing (remote dev agencies)

### Content Gaps

1. **No case studies** - Competitors showcase specific results
2. **No pricing/packages page** - Many agencies show starter packages
3. **No process/methodology page** - Detailed process builds trust
4. **No resources/guides** - Thought leadership content missing
5. **No comparison pages** - "M.D.N Tech vs [competitor]"

---

## Recommendations Summary

### Immediate Actions (This Week)

1. **Create `app/robots.ts`:**
```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: 'https://mdntech.com/sitemap.xml',
  }
}
```

2. **Create `app/sitemap.ts`:**
```typescript
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://mdntech.com', lastModified: new Date(), priority: 1.0 },
    { url: 'https://mdntech.com/team', lastModified: new Date(), priority: 0.8 },
    { url: 'https://mdntech.com/blog', lastModified: new Date(), priority: 0.8 },
    { url: 'https://mdntech.com/privacy', lastModified: new Date(), priority: 0.3 },
    { url: 'https://mdntech.com/terms', lastModified: new Date(), priority: 0.3 },
  ]
}
```

3. **Update `config/index.ts` with better metadata**

4. **Fix H1 tag on homepage** - Remove `invisible` class or restructure

5. **Add Organization JSON-LD to `layout.tsx`**

### Short-Term (This Month)

1. Add page-specific `generateMetadata` to all pages
2. Add Open Graph and Twitter Card images
3. Implement Article schema on blog posts
4. Create actual blog content (remove placeholders)
5. Add `metadataBase` for canonical URLs

### Long-Term (Next Quarter)

1. Create dedicated service pages
2. Add case studies with metrics
3. Implement FAQ sections with schema
4. Create comparison/alternatives pages
5. Add client testimonials
6. Build out comprehensive blog content

---

## Files That Need Changes

| File | Priority | Changes Needed |
|------|----------|----------------|
| `app/robots.ts` | Create | New file |
| `app/sitemap.ts` | Create | New file |
| `config/index.ts` | Critical | Update metadata |
| `app/layout.tsx` | High | Add JSON-LD schema |
| `components/sub/hero-content.tsx` | Critical | Fix H1 structure |
| `next.config.js` | Medium | Add security headers |
| `app/blog/page.tsx` | High | Remove "use client", add metadata |
| `app/blog/[slug]/page.tsx` | High | Add generateMetadata, Article schema |
| `app/team/page.tsx` | Medium | Add generateMetadata, Person schema |

---

*Report generated by Claude Code SEO Audit*
