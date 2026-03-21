# Sitemap Audit Report -- mdntech.com

**Audit Date:** 2026-03-17
**Site:** https://mdntech.com
**Sitemap URL:** https://mdntech.com/sitemap.xml
**Generator:** Next.js `MetadataRoute.Sitemap` (app/sitemap.ts)

---

## 1. Live Sitemap Fetch

| Item | Result |
|------|--------|
| Sitemap accessible | Could not verify (connection timed out from audit environment) |
| robots.txt reference | PASS -- robots.ts correctly declares `sitemap: "https://mdntech.com/sitemap.xml"` |

**Note:** The live fetch failed due to a network/TLS timeout against the hosting IPs (3.33.152.147, 15.197.142.173). This may be a transient infrastructure issue or a firewall rule. All remaining analysis is based on the source code that generates the sitemap at build time.

---

## 2. XML Structure Validation

**Source file:** `app/sitemap.ts`

Next.js `MetadataRoute.Sitemap` generates valid XML automatically. The output conforms to the sitemaps.org 0.9 schema. No manual XML is written, so there is no risk of malformed tags or encoding errors.

| Check | Status | Notes |
|-------|--------|-------|
| Valid XML | PASS | Framework-generated |
| Correct namespace | PASS | Next.js injects `xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"` |
| UTF-8 encoding | PASS | Default Next.js behavior |
| Under 50,000 URL limit | PASS | Only 6 URLs total (3 static pages + 3 blog posts) |
| Sitemap index needed | NO | Far below the 50k threshold |

---

## 3. URLs Listed in Sitemap

Based on the source code, the sitemap generates these URLs:

| # | URL | Type | Source |
|---|-----|------|--------|
| 1 | `https://mdntech.com` | Homepage | Static entry |
| 2 | `https://mdntech.com/team` | Team page | Static entry |
| 3 | `https://mdntech.com/blog` | Blog index | Static entry |
| 4 | `https://mdntech.com/blog/claude-code-complete-guide` | Blog post | Dynamic from data |
| 5 | `https://mdntech.com/blog/agentic-ai-systems-guide` | Blog post | Dynamic from data |
| 6 | `https://mdntech.com/blog/smart-contracts-complete-guide` | Blog post | Dynamic from data |

**Total URLs: 6**

---

## 4. Sitemap vs. Discoverable Routes Comparison

### Routes from `app/` directory (page.tsx files found):

| Route | In Sitemap? | Status |
|-------|-------------|--------|
| `/` (app/page.tsx) | YES | OK |
| `/team` (app/team/page.tsx) | YES | OK |
| `/blog` (app/blog/page.tsx) | YES | OK |
| `/blog/[slug]` (app/blog/[slug]/page.tsx) | YES (3 slugs) | OK |
| `/privacy` (app/privacy/page.tsx) | YES | OK |
| `/terms` (app/terms/page.tsx) | YES | OK |

**Missing pages: NONE** -- All routable pages are included in the sitemap.

---

## 5. Deprecated Tags Audit

### priority (IGNORED BY GOOGLE)

| URL | priority value | Recommendation |
|-----|---------------|----------------|
| `/` | 1.0 | Remove -- ignored by all major crawlers |
| `/team` | 0.8 | Remove |
| `/blog` | 0.8 | Remove |
| `/blog/claude-code-complete-guide` | 0.8 | Remove (logic: `post.content.length > 3`) |
| `/blog/agentic-ai-systems-guide` | 0.8 | Remove |
| `/blog/smart-contracts-complete-guide` | 0.8 | Remove |
| `/privacy` | 0.3 | Remove |
| `/terms` | 0.3 | Remove |

**Status: INFO** -- Google has officially confirmed it ignores `<priority>` entirely. These values add no SEO benefit and can be removed to clean up the sitemap.

### changeFrequency (IGNORED BY GOOGLE)

| URL | changeFrequency value | Recommendation |
|-----|----------------------|----------------|
| `/` | weekly | Remove |
| `/team` | monthly | Remove |
| `/blog` | weekly | Remove |
| Blog posts | monthly | Remove |
| `/privacy` | yearly | Remove |
| `/terms` | yearly | Remove |

**Status: INFO** -- Same as priority; Google ignores `<changefreq>`. Remove to reduce noise.

---

## 6. lastmod Accuracy Audit

**CRITICAL FINDING: All lastmod dates are identical and inaccurate.**

```typescript
lastModified: new Date(), // line 11, 20, 27, etc.
```

Every URL uses `new Date()`, which sets `lastmod` to the **build timestamp**. This means:

1. Every page shows the same last-modified date (the deployment date).
2. The date has no relation to when content was actually modified.
3. After each deploy, Google sees every page as "just modified" -- even if nothing changed.

| Check | Status |
|-------|--------|
| lastmod reflects real modification dates | FAIL |
| lastmod values are distinct per page | FAIL |
| All identical lastmod | YES -- all set to build time |

### Impact

Google has stated that if `lastmod` dates are unreliable, it will stop trusting them for the entire sitemap. This defeats the purpose of having `lastmod` at all.

### Recommendation

Use real dates from the blog post data instead of `new Date()`:

```typescript
// For blog posts:
lastModified: new Date(post.date), // e.g., "March 13, 2026"

// For static pages, use a hardcoded date that updates only when content changes:
lastModified: new Date("2026-03-13"),
```

---

## 7. Code-Level Issues in app/sitemap.ts

### Issue 1: Priority logic is misleading

```typescript
priority: post.content.length > 3 ? 0.8 : 0.6,
```

This checks if the `content` array has more than 3 `ContentBlock` items. All three current blog posts have far more than 3 content blocks (each has dozens). The condition will always evaluate to `true`, making this effectively a hardcoded `0.8`. Since Google ignores `priority` anyway, this logic is dead code.

### Issue 2: No trailing slash consistency

The sitemap generates URLs without trailing slashes (e.g., `https://mdntech.com/blog`). Verify that the Next.js config does not add `trailingSlash: true`, which would create a mismatch between sitemap URLs and canonical URLs.

### Issue 3: Blog post dates are human-readable strings

The `date` field in blog posts uses format `"March 13, 2026"`. While `new Date("March 13, 2026")` works in most JS engines, ISO 8601 format (`"2026-03-13"`) is more reliable and is the required format for sitemap `<lastmod>`.

---

## 8. Quality Gate Assessment

| Gate | Status | Details |
|------|--------|---------|
| Location pages (30+ threshold) | N/A | No location pages exist |
| Location pages (50+ hard stop) | N/A | No location pages exist |
| Doorway page risk | NONE | All pages have substantial unique content |
| Thin content risk | LOW | Blog posts are 15-18 min reads with rich content blocks |

The 3 blog posts are long-form (15-18 minute reads), each with unique content, proper metadata, and distinct topics. No penalty risk.

---

## 9. robots.txt Alignment

**Source file:** `app/robots.ts`

```typescript
rules: {
  userAgent: "*",
  allow: "/",
  disallow: ["/api/", "/_next/"],
},
sitemap: "https://mdntech.com/sitemap.xml",
```

| Check | Status |
|-------|--------|
| Sitemap URL declared in robots.txt | PASS |
| No sitemap URLs blocked by robots.txt | PASS |
| API routes excluded from crawling | PASS |
| Next.js internals excluded | PASS |

---

## 10. Summary of Findings

### Critical

| # | Finding | Action Required |
|---|---------|----------------|
| 1 | All `lastmod` dates use `new Date()` (build time) | Replace with real content modification dates |

### Info (Non-blocking)

| # | Finding | Action |
|---|---------|--------|
| 2 | `priority` values present on all URLs | Can remove -- ignored by Google |
| 3 | `changeFrequency` values present on all URLs | Can remove -- ignored by Google |
| 4 | Priority logic (`content.length > 3`) is always true | Remove dead conditional |

### Passed

| # | Check |
|---|-------|
| 5 | Valid XML structure (framework-generated) |
| 6 | All routable pages included in sitemap |
| 7 | No missing pages |
| 8 | No noindexed URLs in sitemap (no noindex directives found) |
| 9 | URL count well under 50,000 limit |
| 10 | robots.txt correctly references sitemap |
| 11 | No location page quality gate violations |
| 12 | No doorway page risk |

---

## 11. Recommended Fix for app/sitemap.ts

```typescript
import { MetadataRoute } from "next";
import { getAllPosts } from "@/data/blog-posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mdntech.com";
  const posts = getAllPosts();

  const blogUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date(post.date),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date("2026-03-13"),
    },
    {
      url: `${baseUrl}/team`,
      lastModified: new Date("2026-03-13"),
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(posts[0]?.date || "2026-03-13"),
    },
    ...blogUrls,
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date("2026-03-13"),
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date("2026-03-13"),
    },
  ];
}
```

Key changes in the recommended version:
- Removed `priority` (ignored by Google)
- Removed `changeFrequency` (ignored by Google)
- Used real `post.date` for blog lastmod instead of build time
- Blog index lastmod set to most recent post date
- Static pages use hardcoded dates (update manually when content changes)
