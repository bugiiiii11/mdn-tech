# Sitemap Audit Report -- mdntech.org

**Audit Date:** 2026-08-19
**Site:** https://mdntech.org
**Sitemap URL:** https://mdntech.org/sitemap.xml (live copy fetched and validated)
**Generator:** Next.js `MetadataRoute.Sitemap` (`app/sitemap.ts`)
**Evidence:** live sitemap.xml + robots.txt + full 14-page crawl (all HTTP 200) + git history of page files

---

## 1. Current Inventory

14 URLs in the live sitemap. A full crawl confirmed these are exactly the site's crawlable pages: **no missing pages, no orphan/extra pages, all return HTTP 200, none are noindexed.**

| # | URL | lastmod (sitemap) | Last real change (git) | lastmod verdict | changefreq | priority | hreflang |
|---|-----|-------------------|------------------------|-----------------|------------|----------|----------|
| 1 | `/` | 2026-07-16 | 2026-08-15 (`7f8cf98`; rebuild `6572531` 08-12) | **STALE (-30 d)** | -- | -- | en/sk/x-default |
| 2 | `/about` | 2026-07-16 | 2026-08-14 (`ad791b3`) | **STALE (-29 d)** | -- | -- | none |
| 3 | `/chatkit` | 2026-08-12 | 2026-08-15 (`7f8cf98`) | STALE (-3 d) | monthly | 0.9 | none |
| 4 | `/toolkit` | 2026-08-12 | 2026-08-14 (`feab9f2`) | STALE (-2 d) | monthly | 0.9 | none |
| 5 | `/sk` | 2026-08-16 | 2026-08-19 (`b90dde1`, `d2e1bd5`) | STALE (-3 d) | -- | -- | en/sk/x-default |
| 6 | `/sk/referencie/royal-stroje` | 2026-08-16 | 2026-08-18 (`30d9766`) | STALE (-2 d) | monthly | 0.8 | none |
| 7 | `/blog` | 2026-03-13 | 2026-08-14 (`ad791b3`) | **STALE (-5 mo)** | -- | -- | none |
| 8 | `/blog/claude-code-complete-guide` | 2026-03-13 | 2026-08-14 (`0524041` content edits) | **STALE (-5 mo)** | -- | -- | none |
| 9 | `/blog/agentic-ai-systems-guide` | 2026-03-10 | 2026-08-14 (`0524041` content edits) | **STALE (-5 mo)** | -- | -- | none |
| 10 | `/blog/smart-contracts-complete-guide` | 2026-03-01 | 2026-08-14 (`0524041` content edits) | **STALE (-5.5 mo)** | -- | -- | none |
| 11 | `/privacy` | 2026-08-18 | 2026-08-18 (`30d9766`) | OK | -- | -- | none (should pair with #13) |
| 12 | `/terms` | 2026-01-20 | 2026-08-18 (`30d9766`, Railway -> Supabase in two liability clauses) | **STALE (-7 mo)** | -- | -- | none (should pair with #14) |
| 13 | `/sk/ochrana-osobnych-udajov` | 2026-08-18 | 2026-08-18 (`30d9766`, page created) | OK | -- | -- | none (should pair with #11) |
| 14 | `/sk/obchodne-podmienky` | 2026-08-18 | 2026-08-18 (`30d9766`, page created) | OK | -- | -- | none (should pair with #12) |

**lastmod accuracy: 3 of 14 correct (21%).** Evidence notes:

- `/` and `/about` still carry 2026-07-16, which predates the full landing rebuild (`6572531`, 2026-08-12, "SEO-depth rework") and the hero-shell rework (`feab9f2`/`ad791b3`, 08-14) -- Google is being told the rebuilt pages have not changed since July.
- All three blog posts had substantive content edits on 2026-08-14 (`0524041`, "blog honesty polish": 51 insertions / 56 deletions in `data/blog-posts.ts`, with hunks spanning all three post bodies), but the sitemap derives lastmod from the *publication* date (March 2026).
- `/terms` says 2026-01-20 but the page text changed on 2026-08-18 (`30d9766`): "Vercel and Railway" -> "Vercel and Supabase" in the Data Processing and Limitation of Liability sections -- a substantive legal-content change.

---

## 2. Validation Result

| Check | Severity | Status | Notes |
|-------|----------|--------|-------|
| Valid, well-formed XML | Critical | **PASS** | Parsed cleanly; root `urlset`, correct sitemaps.org 0.9 namespace plus `xmlns:xhtml` for hreflang links |
| UTF-8 encoding declared | Critical | PASS | `<?xml version="1.0" encoding="UTF-8"?>` |
| Under 50,000 URLs / 50 MB | Critical | PASS | 14 URLs, single file; no sitemap index needed |
| Registration-ready (single file, reachable) | Critical | PASS | Ready to submit in GSC as-is |
| Non-200 URLs in sitemap | High | PASS | All 14 crawled URLs return `HTTP/1.1 200 OK` |
| Noindexed URLs in sitemap | High | PASS | No `noindex` found in any of the 14 crawled pages |
| Redirected URLs in sitemap | Medium | PASS | All locs are final URLs; no `trailingSlash` in `next.config.js`, sitemap URLs match canonical form |
| lastmod accuracy | High | **FAIL** | 11 of 14 values stale (see Section 1) |
| lastmod format | Low | PASS | Valid W3C datetime (`YYYY-MM-DDTHH:MM:SS.000Z`) |
| All-identical lastmod anti-pattern | Low | PASS | Dates are differentiated per page (the old `new Date()` build-time bug is fixed) |
| hreflang bidirectional and consistent | High | **PARTIAL FAIL** | `/` <-> `/sk` pair is correct (bidirectional, self-referencing, valid codes, x-default). Both legal-page pairs have **no** hreflang at all (sitemap or on-page) |
| changefreq/priority (ignored by Google) | Info | INCONSISTENT | Present on only 3 of 14 URLs (`/chatkit`, `/toolkit`, `/sk/referencie/royal-stroje`) |
| robots.txt references sitemap | High | PASS | `Sitemap: https://mdntech.org/sitemap.xml` (absolute URL, correct host, last line of live robots.txt) |
| robots.txt does not block sitemap URLs | High | PASS | Only `/api/` and `/_next/` disallowed; no sitemap URL affected |
| Sitemap vs crawl coverage | High | PASS | 14/14 match -- no missing, no extra |
| Location-page quality gates (30/50 thresholds) | -- | N/A | No location pages. One case-study page (`/sk/referencie/royal-stroje`) with unique client content -- no doorway risk |

---

## 3. Findings

### Critical

None.

### High

**H1. lastmod is stale on 11 of 14 URLs -- Google will stop trusting the whole sitemap's lastmod.**
Google uses lastmod as a recrawl hint only when it proves consistently accurate; with the homepage and `/about` still dated *before* the mid-August rebuild, `/terms` off by 7 months, and the blog cluster off by 5+ months, the signal is currently working against the site: the rebuilt pages look unchanged since July, so recrawl priority for exactly the pages you most want re-indexed is depressed.

Corrected values (from git evidence in Section 1):

| URL | Current | Corrected |
|-----|---------|-----------|
| `/` | 2026-07-16 | **2026-08-15** |
| `/about` | 2026-07-16 | **2026-08-14** |
| `/chatkit` | 2026-08-12 | **2026-08-15** |
| `/toolkit` | 2026-08-12 | **2026-08-14** |
| `/sk` | 2026-08-16 | **2026-08-19** |
| `/sk/referencie/royal-stroje` | 2026-08-16 | **2026-08-18** |
| `/blog` | 2026-03-13 | **2026-08-14** |
| `/blog/*` (all 3 posts) | 2026-03-01/10/13 | **2026-08-14** |
| `/terms` | 2026-01-20 | **2026-08-18** |

Fix in `app/sitemap.ts` -- see Section 4 (full corrected file).

**H2. hreflang missing on both legal-page pairs -- annotation is one topic-pair short of bidirectional coverage.**
Only `/` <-> `/sk` carry hreflang. The translated pairs `/privacy` <-> `/sk/ochrana-osobnych-udajov` and `/terms` <-> `/sk/obchodne-podmienky` have no hreflang anywhere: not in the sitemap and not on-page (verified in the crawled HTML -- zero `rel="alternate"` link tags on all four pages, because the English legal pages are client components that cannot export Next.js metadata). hreflang only counts when declared on both sides; today Google has no signal that these are translations, so Slovak users can be served the English legal page and the two versions may compete. The sitemap is a fully valid hreflang delivery channel and neatly bypasses the client-component limitation.

Exact corrected sitemap entries (each side lists the full set including itself -- bidirectional and self-referencing; x-default points at the English original, consistent with the homepage pair's convention):

```xml
<url>
<loc>https://mdntech.org/privacy</loc>
<xhtml:link rel="alternate" hreflang="en" href="https://mdntech.org/privacy" />
<xhtml:link rel="alternate" hreflang="sk" href="https://mdntech.org/sk/ochrana-osobnych-udajov" />
<xhtml:link rel="alternate" hreflang="x-default" href="https://mdntech.org/privacy" />
<lastmod>2026-08-18T00:00:00.000Z</lastmod>
</url>
<url>
<loc>https://mdntech.org/sk/ochrana-osobnych-udajov</loc>
<xhtml:link rel="alternate" hreflang="en" href="https://mdntech.org/privacy" />
<xhtml:link rel="alternate" hreflang="sk" href="https://mdntech.org/sk/ochrana-osobnych-udajov" />
<xhtml:link rel="alternate" hreflang="x-default" href="https://mdntech.org/privacy" />
<lastmod>2026-08-18T00:00:00.000Z</lastmod>
</url>
<url>
<loc>https://mdntech.org/terms</loc>
<xhtml:link rel="alternate" hreflang="en" href="https://mdntech.org/terms" />
<xhtml:link rel="alternate" hreflang="sk" href="https://mdntech.org/sk/obchodne-podmienky" />
<xhtml:link rel="alternate" hreflang="x-default" href="https://mdntech.org/terms" />
<lastmod>2026-08-18T00:00:00.000Z</lastmod>
</url>
<url>
<loc>https://mdntech.org/sk/obchodne-podmienky</loc>
<xhtml:link rel="alternate" hreflang="en" href="https://mdntech.org/terms" />
<xhtml:link rel="alternate" hreflang="sk" href="https://mdntech.org/sk/obchodne-podmienky" />
<xhtml:link rel="alternate" hreflang="x-default" href="https://mdntech.org/terms" />
<lastmod>2026-08-18T00:00:00.000Z</lastmod>
</url>
```

The existing `/` <-> `/sk` pair is correct as-is; the English-only product pages and the Slovak-only case study correctly omit hreflang (no fabricated translations) -- keep that.

### Medium

**M1. Blog lastmod is structurally wired to the publication date -- future edits will never surface.**
`app/sitemap.ts` derives blog lastmod by regex-parsing `post.date` ("March 13, 2026" style). There is no "updated" field in the `BlogPost` type, so the 2026-08-14 honesty-polish edits (and any future edit) can never move lastmod. This is the root cause of the blog portion of H1. Fix: add `updated?: string` (ISO date) to `BlogPost` in `data/blog-posts.ts`, set it to `"2026-08-14"` on all three posts, and prefer it in the sitemap (code in Section 4).

### Low

**L1. changefreq/priority present on only 3 of 14 URLs -- inconsistent, and both tags are ignored by Google.**
`/chatkit`, `/toolkit` (monthly / 0.9) and `/sk/referencie/royal-stroje` (monthly / 0.8) carry them; the other 11 URLs do not. They add bytes and audit noise with zero ranking effect. Remove from all three entries rather than adding to the rest.

**L2. Dead-code date parsing in `app/sitemap.ts` (lines 10-13).**
The regex `post.date.match(/(\w+)\s+(\d+),\s+(\d+)/)` captures three groups and reassembles the identical string before passing it to `new Date()` -- a no-op roundtrip equivalent to `new Date(post.date)`. Superseded by the `updated ?? date` logic in Section 4.

### Info

- On-page hreflang for the legal pairs remains impossible while the English legal pages are client components; the sitemap entries in H2 are sufficient on their own (Google accepts any one of the three delivery methods). If the pages are ever refactored to server components, add matching `alternates.languages` metadata -- but never let the two channels disagree.
- Live crawl also confirms: zero sitemap URLs blocked by robots.txt, and the robots.txt `Sitemap:` line uses the correct absolute production URL.

---

## 4. Corrected `app/sitemap.ts`

Changes vs current: legal-pair alternates added (H2), nine lastmod values corrected (H1), blog lastmod prefers new `updated` field (M1), changefreq/priority removed (L1), dead regex removed (L2). Comments preserved/updated.

```typescript
import { MetadataRoute } from "next";
import { getAllPosts } from "@/data/blog-posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mdntech.org";

  const posts = getAllPosts();

  const blogUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    // Prefer the ISO `updated` field (last substantive edit); fall back to
    // the human-readable publication date for posts never edited.
    lastModified: new Date(post.updated ?? post.date),
  }));

  const homeAlternates = {
    languages: {
      en: baseUrl,
      sk: `${baseUrl}/sk`,
      "x-default": baseUrl,
    },
  };

  const privacyAlternates = {
    languages: {
      en: `${baseUrl}/privacy`,
      sk: `${baseUrl}/sk/ochrana-osobnych-udajov`,
      "x-default": `${baseUrl}/privacy`,
    },
  };

  const termsAlternates = {
    languages: {
      en: `${baseUrl}/terms`,
      sk: `${baseUrl}/sk/obchodne-podmienky`,
      "x-default": `${baseUrl}/terms`,
    },
  };

  return [
    {
      url: baseUrl,
      lastModified: new Date("2026-08-15"),
      alternates: homeAlternates,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date("2026-08-14"),
    },
    // Product deep-dives. English-only pages, so no `alternates` block:
    // there is no Slovak twin, and cross-linking them to /sk would lie to
    // crawlers about a translation that does not exist.
    {
      url: `${baseUrl}/chatkit`,
      lastModified: new Date("2026-08-15"),
    },
    {
      url: `${baseUrl}/toolkit`,
      lastModified: new Date("2026-08-14"),
    },
    {
      url: `${baseUrl}/sk`,
      lastModified: new Date("2026-08-19"),
      alternates: homeAlternates,
    },
    // Slovak-only case study -- no EN twin, so no `alternates` block.
    {
      url: `${baseUrl}/sk/referencie/royal-stroje`,
      lastModified: new Date("2026-08-18"),
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date("2026-08-14"),
    },
    ...blogUrls,
    // Legal pages: hreflang pairs declared here in the sitemap because the
    // English originals are client components and cannot export metadata.
    // Sitemap-level hreflang is one of Google's three accepted channels.
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date("2026-08-18"),
      alternates: privacyAlternates,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date("2026-08-18"),
      alternates: termsAlternates,
    },
    {
      url: `${baseUrl}/sk/ochrana-osobnych-udajov`,
      lastModified: new Date("2026-08-18"),
      alternates: privacyAlternates,
    },
    {
      url: `${baseUrl}/sk/obchodne-podmienky`,
      lastModified: new Date("2026-08-18"),
      alternates: termsAlternates,
    },
  ];
}
```

Companion change in `data/blog-posts.ts` (M1):

```typescript
export interface BlogPost {
  // ...existing fields...
  date: string;      // publication date, shown on the page ("March 13, 2026")
  updated?: string;  // ISO date of last substantive content edit; drives sitemap lastmod
}
```

Set `updated: "2026-08-14"` on all three current posts (all were edited in commit `0524041`). Process rule going forward: any commit that edits a page's rendered content should bump the matching hardcoded lastmod in `app/sitemap.ts` (or the post's `updated` field) in the same commit.

---

## 5. Quality Gate Assessment

| Gate | Status | Details |
|------|--------|---------|
| Location pages 30+ (warning) | N/A | 0 location pages |
| Location pages 50+ (hard stop) | N/A | 0 location pages |
| Doorway-page risk | NONE | 14 hand-built pages; the single case study has unique client content |
| Thin-content risk | LOW | Blog posts are long-form with substantive 2026-08 edits |

---

## 6. Category Score

**Sitemap Architecture: 64 / 100**

| Component | Assessment |
|-----------|------------|
| XML validity, size, registration-readiness | Full marks -- well-formed, 14 URLs, single file, GSC-ready |
| Coverage (crawl vs sitemap, status codes, noindex) | Full marks -- perfect 14/14 match, all 200 |
| robots.txt integration | Full marks |
| lastmod accuracy | Heavy deduction (-25): 11/14 stale, including the rebuilt homepage and a 7-month-stale /terms; undermines trust in the sitemap's freshness signal exactly when the rebuild needs recrawling |
| hreflang completeness | Deduction (-8): legal pairs unannotated on both sides; home pair correct |
| Tag hygiene (changefreq/priority consistency, dead code) | Minor deduction (-3) |

Both fixes are contained in one file (`app/sitemap.ts`) plus a two-line data-model addition; after them this category re-scores in the mid-90s.
