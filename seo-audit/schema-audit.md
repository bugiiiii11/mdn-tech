# Schema.org Structured Data Audit - mdntech.com

**Audit Date:** 2026-03-17
**Site:** https://mdntech.com
**Framework:** Next.js (App Router)
**Format Used:** JSON-LD (exclusively)

---

## 1. Existing Schema Detection

### All Pages (via `app/layout.tsx` - Global)

Two JSON-LD blocks are injected into the `<head>` on every page:

#### Block 1: Organization

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "M.D.N Tech FZE",
  "alternateName": "M.D.N Tech",
  "url": "https://mdntech.com",
  "logo": "https://mdntech.com/logo.png",
  "description": "UAE-based tech agency specializing in AI systems, Web3 solutions, and full-stack development with global delivery.",
  "foundingDate": "2024",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Al Shmookh Business Center M 1003, One UAQ, UAQ Free Trade Zone",
    "addressLocality": "Umm Al Quwain",
    "addressCountry": "AE"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "contact@mdntech.org",
    "contactType": "sales",
    "availableLanguage": "English"
  },
  "sameAs": [
    "https://www.instagram.com/mdntechorg/",
    "https://x.com/MDNTechOrg",
    "https://www.linkedin.com/company/mdntech/"
  ],
  "knowsAbout": [
    "Artificial Intelligence",
    "Machine Learning",
    "Blockchain",
    "Web3",
    "Full-Stack Development",
    "Mobile App Development"
  ]
}
```

**Validation:**

| Check | Status | Notes |
|-------|--------|-------|
| @context is `https://schema.org` | PASS | |
| @type is valid | PASS | `Organization` is a supported type |
| Required: `name` | PASS | |
| Recommended: `url` | PASS | Absolute URL |
| Recommended: `logo` | PASS | Absolute URL |
| Recommended: `sameAs` | PASS | 3 social profiles |
| `foundingDate` format | WARN | Value is `"2024"` -- should be ISO 8601 (`"2024-01-01"`) |
| `contactPoint.email` | WARN | Uses `contact@mdntech.org` but site domain is `mdntech.com` -- verify this is correct |
| `contactPoint.telephone` | MISSING | Google recommends including a phone number |
| `address.postalCode` | MISSING | Recommended for PostalAddress |
| `address.addressRegion` | MISSING | Recommended for UAE addresses |

**Issues Found:**
1. `foundingDate` should use ISO 8601 format: `"2024-01-01"` (or at minimum `"2024"` is tolerated but not ideal)
2. No `telephone` on ContactPoint
3. Email domain mismatch: `contact@mdntech.org` vs site `mdntech.com` (not a schema error, but worth verifying)

---

#### Block 2: WebSite

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "M.D.N Tech",
  "url": "https://mdntech.com",
  "description": "Ship production-ready AI systems, Web3 solutions, and full-stack applications faster.",
  "publisher": {
    "@type": "Organization",
    "name": "M.D.N Tech FZE"
  }
}
```

**Validation:**

| Check | Status | Notes |
|-------|--------|-------|
| @context is `https://schema.org` | PASS | |
| @type is valid | PASS | |
| Required: `name` | PASS | |
| Required: `url` | PASS | Absolute URL |
| Recommended: `publisher` | PASS | |
| `potentialAction` (SearchAction) | MISSING | Enables sitelinks search box in Google |
| `inLanguage` | MISSING | Recommended |

**Issues Found:**
1. Missing `potentialAction` with `SearchAction` -- if the site has search functionality, this enables the sitelinks search box rich result
2. Missing `inLanguage` property

---

### Blog Post Pages (via `app/blog/[slug]/page.tsx`)

Each individual blog post page injects two additional JSON-LD blocks:

#### Block 3: Article

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "<post.title>",
  "description": "<post.metaDescription>",
  "image": "https://mdntech.com<post.image>",
  "datePublished": "<ISO date>",
  "dateModified": "<ISO date>",
  "author": {
    "@type": "Organization",
    "name": "<post.author>",
    "url": "https://mdntech.com"
  },
  "publisher": {
    "@type": "Organization",
    "name": "M.D.N Tech FZE",
    "logo": {
      "@type": "ImageObject",
      "url": "https://mdntech.com/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://mdntech.com/blog/<slug>"
  },
  "keywords": "<post.tags joined>",
  "articleSection": "<post.category>"
}
```

**Validation:**

| Check | Status | Notes |
|-------|--------|-------|
| @context is `https://schema.org` | PASS | |
| @type is valid | PASS | `Article` is supported for rich results |
| Required: `headline` | PASS | |
| Required: `image` | PASS | Absolute URL constructed correctly |
| Required: `datePublished` | PASS | ISO 8601 via runtime parsing |
| Required: `author` | PASS | |
| Recommended: `dateModified` | WARN | Same as `datePublished` -- should reflect actual last-modified date |
| Recommended: `publisher.logo` | PASS | |
| `mainEntityOfPage` | PASS | |
| `@type` choice | WARN | Consider using `BlogPosting` (subtype of `Article`) for blog content -- more semantically precise |
| `datePublished` parsing | WARN | Dates like `"March 13, 2026"` are parsed via `new Date()` -- locale-dependent; consider storing ISO dates in data |
| `image` validity | WARN | Image path `/blog/claude-code-guide.jpg` -- verify this file actually exists in `/public/blog/` |
| `author.@type` | INFO | Using `Organization` as author -- acceptable, but if posts have individual authors, `Person` is more appropriate |

**Issues Found:**
1. `dateModified` always equals `datePublished` -- should track actual modification dates
2. Blog post dates are stored as human-readable strings (`"March 13, 2026"`) and parsed at render time -- fragile approach
3. `@type` should be `BlogPosting` for blog articles (subtype of `Article`, more specific)
4. Verify that blog post images actually exist at the specified paths

---

#### Block 4: BreadcrumbList

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mdntech.com" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://mdntech.com/blog" },
    { "@type": "ListItem", "position": 3, "name": "<post.title>", "item": "https://mdntech.com/blog/<slug>" }
  ]
}
```

**Validation:**

| Check | Status | Notes |
|-------|--------|-------|
| @context is `https://schema.org` | PASS | |
| @type is valid | PASS | `BreadcrumbList` is supported for rich results |
| `itemListElement` present | PASS | |
| All items have `position` | PASS | Sequential: 1, 2, 3 |
| All items have `name` | PASS | |
| All items have `item` (URL) | PASS | All absolute URLs |
| Correct hierarchy | PASS | Home > Blog > Post |

**No issues found.** This block is well-implemented.

---

### Blog Listing Page (`/blog`)

**No additional JSON-LD.** Only inherits the global Organization and WebSite schemas.

### Team Page (`/team`)

**No additional JSON-LD.** Only inherits the global Organization and WebSite schemas.

### Microdata / RDFa

**None detected.** The site uses JSON-LD exclusively, which is the recommended format.

---

## 2. Missing Schema Opportunities

### HIGH PRIORITY

#### A. Blog Listing Page -- CollectionPage or ItemList

The `/blog` page lists all blog posts but has no schema describing this collection. Adding an `ItemList` or `CollectionPage` schema would help search engines understand the page structure.

**Recommended JSON-LD for `app/blog/page.tsx`:**

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "M.D.N Tech Blog",
  "description": "Insights on AI engineering, Web3 development, and building production-ready systems from the M.D.N Tech team.",
  "url": "https://mdntech.com/blog",
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "url": "https://mdntech.com/blog/claude-code-complete-guide"
      }
    ]
  }
}
```

Note: Since this is a `"use client"` component, the schema injection must happen in the server-side layout (`app/blog/layout.tsx`) or the page must be refactored to a server component.

#### B. Service Schema for Homepage

The homepage describes services (AI Systems, Web3, Full-Stack Development) but has no `Service` schema. This is a missed opportunity for search visibility.

**Recommended JSON-LD (add to `app/layout.tsx` or `app/page.tsx`):**

```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "M.D.N Tech FZE",
  "url": "https://mdntech.com",
  "description": "UAE-based tech agency specializing in AI systems, Web3 solutions, and full-stack development.",
  "areaServed": "Worldwide",
  "serviceType": ["AI Development", "Web3 Development", "Full-Stack Development", "Mobile App Development"],
  "provider": {
    "@type": "Organization",
    "name": "M.D.N Tech FZE"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Development Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "AI Systems Development",
          "description": "Production-ready AI systems, LLM integrations, and machine learning solutions."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Web3 & Blockchain Development",
          "description": "Smart contract development, DeFi solutions, and blockchain integrations."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Full-Stack Application Development",
          "description": "End-to-end web and mobile application development with modern frameworks."
        }
      }
    ]
  }
}
```

### MEDIUM PRIORITY

#### C. BreadcrumbList on Non-Blog Pages

Breadcrumb schema only exists on individual blog post pages. Consider adding it to:
- `/blog` (Home > Blog)
- `/team` (Home > Team)
- `/privacy` (Home > Privacy Policy)
- `/terms` (Home > Terms of Service)

#### D. WebPage Schema for Key Pages

Individual pages lack `WebPage` schema. Consider adding `AboutPage` for the team page and `WebPage` for other subpages.

#### E. Team Page -- Person Schema

The team page displays team members with names, roles, bios, and social links. This data maps directly to `Person` schema.

**Recommended JSON-LD (add to `app/team/layout.tsx`):**

```json
{
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "Our Team",
  "url": "https://mdntech.com/team",
  "mainEntity": {
    "@type": "Organization",
    "name": "M.D.N Tech FZE",
    "member": [
      {
        "@type": "Person",
        "name": "Team Member Name",
        "jobTitle": "Role",
        "description": "Bio text",
        "worksFor": {
          "@type": "Organization",
          "name": "M.D.N Tech FZE"
        },
        "sameAs": ["https://linkedin.com/in/...", "https://github.com/..."]
      }
    ]
  }
}
```

### LOW PRIORITY

#### F. SearchAction on WebSite

If the site implements search functionality in the future, add:

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "M.D.N Tech",
  "url": "https://mdntech.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://mdntech.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

Only add this when a search feature actually exists. Do not add it speculatively.

---

## 3. Issues Summary

### Critical (0)

No critical errors found. All existing schemas are structurally valid.

### Warnings (7)

| # | Location | Issue | Recommendation |
|---|----------|-------|----------------|
| 1 | `layout.tsx` Organization | `foundingDate: "2024"` is not strict ISO 8601 | Change to `"2024-01-01"` or the actual founding date |
| 2 | `layout.tsx` Organization | No `telephone` on ContactPoint | Add phone number if available |
| 3 | `layout.tsx` Organization | No `postalCode` or `addressRegion` in address | Add to PostalAddress |
| 4 | `[slug]/page.tsx` Article | `dateModified` always equals `datePublished` | Track actual modification dates in blog post data |
| 5 | `[slug]/page.tsx` Article | Dates parsed from human-readable strings at runtime | Store dates in ISO 8601 format in `blog-posts.ts` |
| 6 | `[slug]/page.tsx` Article | Uses `Article` instead of `BlogPosting` | Change `@type` to `BlogPosting` for blog content |
| 7 | `[slug]/page.tsx` Article | Blog post images may not exist at specified paths | Verify `/public/blog/` contains referenced images |

### Missing Opportunities (5)

| # | Priority | Page | Schema Type | Impact |
|---|----------|------|-------------|--------|
| 1 | HIGH | `/blog` | `CollectionPage` + `ItemList` | Helps Google understand blog listing structure |
| 2 | HIGH | `/` (homepage) | `ProfessionalService` + `OfferCatalog` | Improves visibility for service-related queries |
| 3 | MEDIUM | All subpages | `BreadcrumbList` | Enables breadcrumb rich results on all pages |
| 4 | MEDIUM | `/team` | `AboutPage` + `Person` | Structured data for team members |
| 5 | LOW | Global `WebSite` | `SearchAction` | Only if search is implemented |

---

## 4. Architecture Note

The blog listing page (`app/blog/page.tsx`) is a client component (`"use client"`). JSON-LD schema should be injected from server components to ensure it is present in the initial HTML response for search engine crawlers. Options:

1. Move schema injection to `app/blog/layout.tsx` (server component)
2. Refactor the blog listing page to be a server component and wrap only interactive parts in client components

---

## 5. Quick-Fix Checklist

- [ ] Change Article `@type` to `BlogPosting` in `app/blog/[slug]/page.tsx` (line 99)
- [ ] Change `foundingDate` from `"2024"` to `"2024-01-01"` in `app/layout.tsx` (line 30)
- [ ] Add `dateIso` field to `BlogPost` interface and store ISO dates directly
- [ ] Track `dateModified` separately from `datePublished` in blog post data
- [ ] Add `ProfessionalService` schema to homepage
- [ ] Add `CollectionPage` schema to blog listing via `app/blog/layout.tsx`
- [ ] Add `BreadcrumbList` to `/blog`, `/team`, `/privacy`, `/terms` pages
- [ ] Add `Person` schema to team page
- [ ] Add `postalCode` and `addressRegion` to Organization address
- [ ] Verify `/public/blog/` contains all referenced blog post images

---

## 6. Files Analyzed

| File | Schema Blocks Found |
|------|-------------------|
| `app/layout.tsx` | Organization, WebSite (global, all pages) |
| `app/blog/[slug]/page.tsx` | Article, BreadcrumbList (per blog post) |
| `app/blog/page.tsx` | None (client component, no schema) |
| `app/blog/layout.tsx` | None |
| `app/blog/[slug]/layout.tsx` | None |
| `app/page.tsx` | None (homepage, no page-specific schema) |
| `app/team/page.tsx` | None |
| `config/index.ts` | N/A (Next.js metadata, not JSON-LD) |
| `data/blog-posts.ts` | N/A (data source for Article schema) |
