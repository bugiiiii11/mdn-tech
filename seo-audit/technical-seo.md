# Technical SEO Audit Report - mdntech.com

**Audit Date:** March 17, 2026
**Audited Domain:** https://mdntech.com
**Framework:** Next.js 14.2.15 (App Router)
**Hosting:** Vercel
**Overall Technical SEO Score: 72/100**

---

## Executive Summary

The site has a solid foundation with proper Next.js App Router conventions, good structured data implementation, and strong security headers. However, there are several issues that need attention: missing canonical tags on subpages, excessive client-side rendering, a Three.js background canvas that harms Core Web Vitals, missing `not-found.tsx` custom 404, missing AI crawler management in robots.txt, and no image optimization on the LCP-critical hero section.

---

## 1. Crawlability

**Status: PASS (with issues)**

### 1.1 robots.txt

**File:** `app/robots.ts` (Next.js dynamic generation)

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Sitemap: https://mdntech.com/sitemap.xml
```

**Assessment:**

| Check | Status | Notes |
|-------|--------|-------|
| robots.txt exists | PASS | Generated via Next.js MetadataRoute |
| Allow root | PASS | `Allow: /` present |
| Disallow private routes | PASS | `/api/` and `/_next/` blocked |
| Sitemap reference | PASS | Points to correct sitemap URL |
| AI crawler management | FAIL | No rules for GPTBot, ClaudeBot, Bytespider, CCBot, Google-Extended, Applebot-Extended, Meta-ExternalAgent, PerplexityBot, AmazonBot |

**Critical Issue - Missing AI Crawler Directives:**
The site has no rules for AI training crawlers. If the business does not want its content used for AI training, explicit Disallow rules should be added. If it does want AI visibility, this is fine but should be a deliberate decision.

### 1.2 Sitemap

**File:** `app/sitemap.ts` (Next.js dynamic generation)

**Pages included:**
- `/` (priority 1.0, weekly)
- `/team` (priority 0.8, monthly)
- `/blog` (priority 0.8, weekly)
- `/blog/[slug]` (dynamic, priority 0.6-0.8, monthly)
- `/privacy` (priority 0.3, yearly)
- `/terms` (priority 0.3, yearly)

| Check | Status | Notes |
|-------|--------|-------|
| Sitemap exists | PASS | Dynamic generation via Next.js |
| All pages included | PASS | Main pages + dynamic blog posts |
| Priority values | PASS | Logical hierarchy |
| changeFrequency set | PASS | Appropriate values |
| lastModified | MEDIUM | Uses `new Date()` - always returns current date, not actual modification date |

**Medium Issue:** `lastModified` is set to `new Date()` for all entries. This means every time the sitemap is generated, all pages report as freshly modified. Search engines may learn to ignore this signal. Use actual file/content modification dates instead.

### 1.3 Crawlability Issues

| Check | Status | Notes |
|-------|--------|-------|
| Custom 404 page | FAIL | No `app/not-found.tsx` found |
| Internal link integrity | PASS | Navigation uses Next.js `Link` component |
| Hash-based navigation | MEDIUM | Homepage uses `/#home`, `/#contact-us` - fragment links are not crawlable as separate pages |
| Deep linking | PASS | Blog posts have clean `/blog/[slug]` URLs |

---

## 2. Indexability

**Status: PASS (with issues)**

### 2.1 Meta Tags & Titles

| Page | Title | Description | Status |
|------|-------|-------------|--------|
| `/` | "M.D.N Tech \| AI & Full-Stack Development Agency \| UAE" | Present, 156 chars | PASS |
| `/team` | "Our Team \| M.D.N Tech" | Present, descriptive | PASS |
| `/blog` | "Blog \| M.D.N Tech" | Present, descriptive | PASS |
| `/blog/[slug]` | "[Post Title] \| M.D.N Tech Blog" | Dynamic with metaDescription | PASS |
| `/privacy` | "Privacy Policy \| M.D.N Tech" | Present | PASS |
| `/terms` | "Terms & Conditions \| M.D.N Tech" | Present | PASS |

**Title template system:** Uses Next.js `title.template: "%s | M.D.N Tech"` - well implemented.

### 2.2 Canonical Tags

| Page | Canonical Set | Status |
|------|---------------|--------|
| `/` (root layout) | `https://mdntech.com` via `alternates.canonical` | PASS |
| `/blog/[slug]` | `https://mdntech.com/blog/[slug]` via layout.tsx | PASS |
| `/team` | MISSING | FAIL |
| `/blog` | MISSING | FAIL |
| `/privacy` | MISSING | FAIL |
| `/terms` | MISSING | FAIL |

**High Issue:** Four subpages lack explicit canonical tags. While Next.js may generate a self-referencing canonical from `metadataBase`, this is implicit and should be made explicit in each page's layout metadata to prevent potential duplicate content issues (especially with query parameter variants like `?ref=` or UTM tracking).

### 2.3 Meta Robots

| Page | index/follow | Status |
|------|--------------|--------|
| `/` (global) | `index: true, follow: true` | PASS |
| `/privacy` | `index: true, follow: true` | PASS |
| `/terms` | `index: true, follow: true` | PASS |
| GoogleBot directives | `max-video-preview: -1, max-image-preview: large, max-snippet: -1` | PASS |

### 2.4 Duplicate Metadata Conflict

**Medium Issue:** `app/blog/[slug]/page.tsx` and `app/blog/[slug]/layout.tsx` both export `generateMetadata`. Next.js will merge these, but having two competing metadata generators creates maintenance risk and potential conflicts. The layout sets canonical via `alternates.canonical`, while the page sets OpenGraph and Twitter cards. Consolidate into one location.

---

## 3. Security

**Status: PASS**

### 3.1 Security Headers (from next.config.js)

| Header | Value | Status |
|--------|-------|--------|
| Strict-Transport-Security | `max-age=63072000; includeSubDomains; preload` | PASS (2-year HSTS) |
| X-Frame-Options | `DENY` | PASS |
| X-Content-Type-Options | `nosniff` | PASS |
| Referrer-Policy | `strict-origin-when-cross-origin` | PASS |
| Permissions-Policy | `camera=(), microphone=(), geolocation=()` | PASS |
| X-DNS-Prefetch-Control | `on` | PASS |
| Content-Security-Policy | MISSING | MEDIUM |
| X-XSS-Protection | MISSING | LOW (deprecated but still useful for older browsers) |

**Medium Issue:** No Content-Security-Policy (CSP) header is configured. While not directly an SEO factor, CSP protects against XSS attacks which could lead to site defacement or malicious redirect injection -- both of which destroy SEO.

### 3.2 HTTPS

| Check | Status | Notes |
|-------|--------|-------|
| HTTPS configured | PASS | All URLs use `https://mdntech.com` |
| Vercel auto-HTTPS | PASS | Vercel provides automatic SSL/TLS |
| Mixed content risk | LOW | External font loaded via `https://fonts.googleapis.com` |

---

## 4. URL Structure

**Status: PASS**

| Check | Status | Notes |
|-------|--------|-------|
| Clean URLs | PASS | `/team`, `/blog`, `/privacy`, `/terms` |
| Lowercase URLs | PASS | All routes use lowercase |
| No trailing slashes | PASS | Next.js default behavior |
| Blog slug structure | PASS | `/blog/claude-code-complete-guide` - descriptive, hyphenated |
| No file extensions | PASS | Clean paths without `.html` |
| URL depth | PASS | Maximum 2 levels (`/blog/[slug]`) |

### 4.1 Redirect Chain Analysis

| Test | Expected Behavior | Notes |
|------|-------------------|-------|
| http -> https | Vercel handles automatically | PASS |
| www -> non-www | Vercel handles automatically | PASS (assuming Vercel domain config is correct) |
| Trailing slash removal | Next.js default | PASS |

**Note:** Could not perform live redirect chain testing due to network restrictions. Vercel typically handles these redirects with a single 301 hop, which is optimal.

---

## 5. Mobile Optimization

**Status: PASS (with minor issues)**

### 5.1 Viewport Meta

```typescript
export const viewport: Viewport = {
  themeColor: "#030014",
};
```

| Check | Status | Notes |
|-------|--------|-------|
| Viewport meta tag | PASS | Next.js auto-generates `<meta name="viewport" content="width=device-width, initial-scale=1">` |
| Theme color | PASS | Set to `#030014` |
| User-scalable restriction | PASS | Not restricted (good for accessibility) |

### 5.2 Responsive Design

| Check | Status | Notes |
|-------|--------|-------|
| Responsive breakpoints | PASS | Uses Tailwind `md:`, `lg:` breakpoints throughout |
| Mobile menu | PASS | Hamburger menu with `md:hidden` toggle |
| Touch targets | PASS | Mobile menu items have `py-3` padding (48px+ targets) |
| `overflow-x: hidden` | MEDIUM | Applied to `html`, `body`, and `#__next` - can mask horizontal overflow issues |
| Font sizing | PASS | Responsive text sizes (`text-sm md:text-base`, `text-3xl md:text-4xl`) |

### 5.3 Hamburger Menu Accessibility

**Low Issue:** The hamburger button uses a Unicode character (`&#9776;`) instead of an SVG with proper `aria-label`. This should have `aria-label="Open menu"` and `aria-expanded` attributes for screen readers.

---

## 6. Core Web Vitals

**Status: NEEDS IMPROVEMENT**

### 6.1 LCP (Largest Contentful Paint)

**Risk Level: HIGH**

| Factor | Impact | Details |
|--------|--------|---------|
| Hero video element | HIGH | `<video autoPlay muted loop>` loading `/videos/blackhole.webm` is likely the LCP element. No `poster` attribute means the browser must download and decode video before displaying anything |
| No hero image priority | HIGH | No `priority` prop on any above-the-fold image. The hero section relies on a video background with no fallback |
| Three.js Canvas | HIGH | `StarsCanvas` renders a WebGL canvas on every page load before any content is visible. This blocks the main thread during initialization |
| Google Fonts external CSS | MEDIUM | `@import url("https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap")` in globals.css creates a render-blocking request chain. Should use `next/font` (already used for Inter, but Cedarville Cursive is loaded via CSS @import) |
| Logo image | LOW | Navbar logo (32x32) is small, not an LCP concern |

**Recommendations:**
1. Add a `poster` attribute to the hero video element
2. Add `priority` to the hero section's main visual element
3. Convert the Cedarville Cursive font import to use `next/font/google`
4. Consider lazy-loading the Three.js star background (defer initialization)

### 6.2 INP (Interaction to Next Paint)

**Risk Level: MEDIUM**

| Factor | Impact | Details |
|--------|--------|---------|
| Framer Motion animations | MEDIUM | Heavy use of `framer-motion` across all pages. Each `motion.div` adds event listeners and animation frame callbacks |
| Three.js `useFrame` loop | MEDIUM | Continuous animation loop (`useFrame`) runs on every frame, competing with user interactions for main thread time |
| Mouse-tracking animations | MEDIUM | Team page cards track mouse position with spring physics (`useMotionValue`, `useSpring`, `useTransform`) - this runs calculations on every mousemove event |
| Client-side rendering | LOW | Most interactive components are marked `"use client"` which is appropriate |

**Recommendations:**
1. Throttle/debounce mouse-tracking handlers on team page cards
2. Consider reducing Three.js particle count on mobile (currently 1000 particles)
3. Use `will-change: transform` sparingly (21 occurrences found -- overuse can cause memory issues)

### 6.3 CLS (Cumulative Layout Shift)

**Risk Level: MEDIUM**

| Factor | Impact | Details |
|--------|--------|---------|
| Next.js Image component | PASS | Used correctly with explicit `width`/`height` props |
| Fixed navbar | PASS | `fixed top-0` with explicit `h-[65px]` prevents layout shift |
| Font loading | MEDIUM | Cedarville Cursive loaded via CSS @import with `display=swap` - will cause FOIT/FOUT on pages using this font |
| Framer Motion initial states | MEDIUM | Many elements start with `opacity: 0, y: 50` and animate in. While `whileInView` prevents them from being counted as CLS (they start below fold), any above-the-fold usage would cause shift |
| `backdrop-blur` on navbar | LOW | 14 instances of `backdrop-blur` found in components - these are GPU-composited but can cause visual repaints |
| Video element | MEDIUM | The hero video has no explicit dimensions set via CSS, relying on `object-contain`. If it loads slowly, it could cause content reflow |

---

## 7. Structured Data

**Status: PASS**

### 7.1 Organization Schema (Root Layout)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "M.D.N Tech FZE",
  "url": "https://mdntech.com",
  "logo": "https://mdntech.com/logo.png",
  "foundingDate": "2024",
  "address": { "@type": "PostalAddress", ... },
  "contactPoint": { "@type": "ContactPoint", ... },
  "sameAs": ["instagram", "twitter/x", "linkedin"]
}
```

| Check | Status | Notes |
|-------|--------|-------|
| Valid @context | PASS | |
| Organization type | PASS | |
| Logo URL | PASS | Absolute URL |
| Contact info | PASS | Email + contact type |
| Social profiles | PASS | 3 sameAs links |
| Address | PASS | Full postal address |

### 7.2 WebSite Schema (Root Layout)

| Check | Status | Notes |
|-------|--------|-------|
| WebSite type | PASS | |
| Publisher reference | PASS | Links to Organization |
| SearchAction | MISSING | LOW - No site search, so not needed |

### 7.3 Article Schema (Blog Posts)

| Check | Status | Notes |
|-------|--------|-------|
| Article type | PASS | |
| headline | PASS | From post title |
| datePublished/Modified | PASS | ISO format |
| author | PASS | Organization type |
| publisher + logo | PASS | |
| mainEntityOfPage | PASS | |
| keywords | PASS | From tags |

### 7.4 BreadcrumbList Schema (Blog Posts)

| Check | Status | Notes |
|-------|--------|-------|
| BreadcrumbList type | PASS | Home > Blog > [Post Title] |
| 3-level hierarchy | PASS | |
| Absolute URLs | PASS | |

### 7.5 Missing Structured Data

| Schema Type | Applicable Page | Priority |
|-------------|----------------|----------|
| `FAQPage` | Homepage (if FAQ exists) | LOW |
| `Service` | Homepage services section | MEDIUM |
| `Person` | Team page members | LOW |

---

## 8. JavaScript Rendering & Client-Side Concerns

**Status: NEEDS IMPROVEMENT**

### 8.1 Server vs Client Components

| Component | Rendering | SEO Impact |
|-----------|-----------|------------|
| Root Layout (`layout.tsx`) | Server | PASS - Structured data rendered server-side |
| Homepage (`page.tsx`) | Server | PASS - Imports server components |
| Blog index (`blog/page.tsx`) | Client (`"use client"`) | HIGH - Blog listing rendered entirely client-side |
| Blog post (`blog/[slug]/page.tsx`) | Server | PASS - `generateStaticParams` enables SSG |
| Team page (`team/page.tsx`) | Client (`"use client"`) | HIGH - Team content rendered client-side |
| Privacy page | Client (`"use client"`) | MEDIUM - Legal content rendered client-side |
| Terms page | Client (`"use client"`) | MEDIUM - Legal content rendered client-side |
| All main components | Client (`"use client"`) | HIGH - 13 components are client-only |

**Critical Issue:** The blog listing page, team page, privacy page, and terms page are all marked `"use client"`. While Next.js can still SSR these components, the `"use client"` directive means:
1. The full component code is shipped to the browser (larger JS bundle)
2. Hydration must complete before the page is interactive
3. If JavaScript fails or is delayed, the content may not be visible to crawlers using limited JS execution

**Key Concern:** The blog page calls `getAllPosts()` on the client side. This function imports from `@/data/blog-posts` which is a static data file, so it will work, but it means the entire blog post dataset is included in the client bundle.

### 8.2 Heavy Dependencies

| Package | Size Impact | Purpose |
|---------|-------------|---------|
| `@react-three/fiber` + `three` | ~500KB+ | Star background animation on EVERY page |
| `framer-motion` | ~120KB | Animations throughout |
| `swiper` | ~40KB | Project carousel |
| `@react-three/drei` | ~200KB | Three.js helpers |

**Critical Issue:** Three.js and related packages add 700KB+ to the JavaScript bundle and are loaded on every page for a decorative star background. This is the single largest performance bottleneck.

### 8.3 Static Generation

| Page | Generation Strategy | Status |
|------|---------------------|--------|
| `/` | Static (SSG) | PASS |
| `/team` | Static (SSG) | PASS |
| `/blog` | Static (SSG) | PASS |
| `/blog/[slug]` | Static (SSG via `generateStaticParams`) | PASS |
| `/privacy` | Static (SSG) | PASS |
| `/terms` | Static (SSG) | PASS |

All pages can be statically generated at build time, which is excellent for SEO.

---

## 9. Open Graph & Social

**Status: PASS**

| Check | Status | Notes |
|-------|--------|-------|
| og:type | PASS | `website` (homepage), `article` (blog posts) |
| og:title | PASS | All pages |
| og:description | PASS | All pages |
| og:image | PASS | `/og-image.png` (1200x630) |
| og:locale | PASS | `en_US` |
| og:site_name | PASS | "M.D.N Tech" |
| twitter:card | PASS | `summary_large_image` |
| twitter:creator | PASS | `@MDNTechOrg` |
| Blog article OG | PASS | `publishedTime`, `authors`, `tags` set |

---

## 10. Additional Issues

### 10.1 Domain Inconsistency

**High Issue:** The privacy policy page references `www.mdntech.org` multiple times as the company website, while the actual site is hosted at `mdntech.com`. The structured data and sitemap correctly use `mdntech.com`, but the privacy/terms content references `.org`. This is confusing for users and potentially for search engines if they encounter both domains.

Occurrences found:
- Privacy page: "visit our website www.mdntech.org"
- Privacy page: contact@mdntech.org (email - this may be intentional)
- Terms page: similar references

### 10.2 Missing favicon.ico

**Low Issue:** The site uses `/favicon.png` and `/favicon1.png` but there is no standard `favicon.ico` file. Some older crawlers and browsers specifically look for `favicon.ico` at the root.

### 10.3 External Font Loading

**Medium Issue:** Cedarville Cursive font is loaded via CSS `@import` in `globals.css`:
```css
@import url("https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap");
```
This creates a render-blocking chain: HTML -> CSS -> Google Fonts CSS -> Font file. The Inter font correctly uses `next/font/google` which inlines the CSS. Cedarville Cursive should also use `next/font/google`.

---

## Prioritized Action Items

### Critical (Fix Immediately)

1. **Add poster attribute to hero video** - The hero video is likely the LCP element and has no poster/fallback image. Add `poster="/hero-poster.webp"` to prevent blank LCP.

2. **Lazy-load Three.js star background** - Loading Three.js, @react-three/fiber, and @react-three/drei on every page adds 700KB+ to the bundle. Use `next/dynamic` with `ssr: false` and defer loading until after the page is interactive, or replace with a CSS-only star animation.

3. **Fix blog page client rendering** - The blog listing page (`app/blog/page.tsx`) should not be a client component. Extract the `getAllPosts()` call to a server component wrapper and pass data to a client `BlogCard` component. The same pattern should be applied to `team/page.tsx`.

### High Priority

4. **Add canonical tags to all subpages** - Add `alternates: { canonical: "https://mdntech.com/[path]" }` to the metadata in `/team/layout.tsx`, `/blog/layout.tsx`, `/privacy/layout.tsx`, and `/terms/layout.tsx`.

5. **Fix domain inconsistency** - Update privacy policy and terms page content to reference `mdntech.com` instead of `mdntech.org`, or ensure `mdntech.org` properly redirects to `mdntech.com`.

6. **Create custom 404 page** - Add `app/not-found.tsx` with proper SEO metadata and helpful navigation. This helps retain users who land on broken links and provides a better crawl signal.

7. **Consolidate duplicate generateMetadata** - `app/blog/[slug]/page.tsx` and `app/blog/[slug]/layout.tsx` both export `generateMetadata`. Remove the metadata from one of them (preferably keep it in `page.tsx` since it handles the Article schema).

### Medium Priority

8. **Convert Cedarville Cursive to next/font** - Replace the CSS `@import` with `next/font/google` to eliminate the render-blocking font chain.

9. **Add AI crawler rules to robots.txt** - Make a deliberate decision about AI crawlers (GPTBot, ClaudeBot, CCBot, Google-Extended, Applebot-Extended, Meta-ExternalAgent, PerplexityBot, AmazonBot, Bytespider) and add explicit Allow or Disallow rules.

10. **Fix sitemap lastModified dates** - Replace `new Date()` with actual content modification dates. For static content, use a fixed date string. For blog posts, use the post's date field.

11. **Add Content-Security-Policy header** - Configure CSP in `next.config.js` to protect against XSS injection.

12. **Reduce will-change usage** - 21 occurrences of `will-change`/`transform-gpu` found. Each creates a new compositor layer and consumes GPU memory. Limit to elements that actually animate.

### Low Priority

13. **Add aria-label to hamburger menu** - The mobile menu button uses a Unicode character. Add `aria-label="Open navigation menu"` and `aria-expanded={isMobileMenuOpen}`.

14. **Add Service structured data** - Add `Service` schema markup to the homepage services section for rich results.

15. **Add favicon.ico** - Generate a standard `favicon.ico` from the existing PNG.

16. **Convert privacy/terms to server components** - These pages are static legal text and do not need `"use client"`. The only client dependency is `framer-motion` for entrance animations, which could be wrapped in a small client component while keeping the text content server-rendered.

---

## Score Breakdown

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Crawlability | 80/100 | 15% | 12.0 |
| Indexability | 70/100 | 15% | 10.5 |
| Security | 85/100 | 10% | 8.5 |
| URL Structure | 95/100 | 10% | 9.5 |
| Mobile | 85/100 | 10% | 8.5 |
| Core Web Vitals | 50/100 | 20% | 10.0 |
| Structured Data | 85/100 | 10% | 8.5 |
| JS Rendering | 55/100 | 10% | 5.5 |
| **Total** | | **100%** | **72/100** |

---

## Files Analyzed

- `app/robots.ts` - robots.txt generation
- `app/sitemap.ts` - sitemap generation
- `app/layout.tsx` - root layout with structured data
- `app/page.tsx` - homepage
- `app/team/page.tsx` and `app/team/layout.tsx` - team page
- `app/blog/page.tsx` and `app/blog/layout.tsx` - blog listing
- `app/blog/[slug]/page.tsx` and `app/blog/[slug]/layout.tsx` - blog post pages
- `app/privacy/page.tsx` and `app/privacy/layout.tsx` - privacy policy
- `app/terms/page.tsx` and `app/terms/layout.tsx` - terms and conditions
- `app/globals.css` - global styles
- `config/index.ts` - site metadata configuration
- `next.config.js` - Next.js configuration with security headers
- `package.json` - dependencies analysis
- `components/main/hero.tsx` - hero section
- `components/main/navbar.tsx` - navigation
- `components/main/star-background.tsx` - Three.js star background
- `data/blog-posts.ts` - blog post data structure
