# Schema.org Structured Data Audit - mdntech.org

**Audit date:** 2026-08-19
**Site:** https://mdntech.org (live HTML, 14 pages crawled; all returned HTTP 200)
**Format:** JSON-LD exclusively (0 Microdata, 0 RDFa across all pages)
**Parse status:** all 43 JSON-LD blocks parse as valid JSON -- zero syntax errors
**Source cross-check:** `app/layout.tsx` (global Organization + WebSite), `app/(marketing)/blog/[slug]/page.tsx`, `app/(marketing)/chatkit/page.tsx`, `app/(marketing)/toolkit/page.tsx`, `app/(marketing)/sk/page.tsx`, `app/(marketing)/sk/referencie/royal-stroje/page.tsx`

---

## 1. Per-page schema inventory

Every page carries the same global `Organization` (`@id: https://mdntech.org/#organization`) and `WebSite` (`@id: https://mdntech.org/#website`) blocks from `app/layout.tsx`. Page-specific blocks below.

| Page | Blocks | Page-specific types | Notes |
|------|--------|--------------------|-------|
| `/` (home) | 3 | FAQPage (10 Q&A) | FAQ content visible on page |
| `/about` | 2 | -- | No Person/AboutPage schema despite team content |
| `/chatkit` | 5 | SoftwareApplication, WebPage, FAQPage (12 Q&A) | Entities linked via `@id` graph |
| `/toolkit` | 6 | SoftwareApplication, ItemList (18 items), WebPage, FAQPage (11 Q&A) | Richest page on the site |
| `/sk` | 4 | ProfessionalService, FAQPage (8 Q&A) | ProfessionalService is a LocalBusiness subtype |
| `/sk/referencie/royal-stroje` | 3 | `@graph`[Article, BreadcrumbList] | Visible breadcrumb trail present |
| `/blog` | 2 | -- | No CollectionPage/Blog/ItemList |
| `/blog/claude-code-complete-guide` | 4 | BlogPosting, BreadcrumbList | No visible breadcrumb trail |
| `/blog/agentic-ai-systems-guide` | 4 | BlogPosting, BreadcrumbList | No visible breadcrumb trail |
| `/blog/smart-contracts-complete-guide` | 4 | BlogPosting, BreadcrumbList | No visible breadcrumb trail |
| `/privacy` | 2 | -- | Acceptable for legal page |
| `/terms` | 2 | -- | Acceptable for legal page |
| `/sk/ochrana-osobnych-udajov` | 2 | -- | Acceptable |
| `/sk/obchodne-podmienky` | 2 | -- | Acceptable |

General hygiene -- all blocks: `@context` is `https://schema.org` (PASS), no deprecated types (no HowTo, no SpecialAnnouncement), no placeholder text, all URLs absolute, all dates ISO 8601. The old audit's `foundingDate: "2024"` and missing `telephone` issues are fixed (`"2024-01-01"`, `+971582283256`). The domain migration to mdntech.org is complete and consistent in every block.

---

## 2. Mandatory checks (from project handoff)

### Check 1: Breadcrumbs -- visible trail must match schema

**Royal Stroje (`/sk/referencie/royal-stroje`): PASS.**
- Visible trail present: `<nav aria-label="Ste tu">` rendering `M.D.N Tech Slovensko / Referencie / Royal Stroje` with links to `/sk` and `/sk#realizacie`.
- BreadcrumbList schema present in the `@graph` block with 3 ListItems whose `name` and `item` values match the visible links exactly (including the `/sk#realizacie` fragment).
- Minor note (Low): item 2 uses a fragment URL (`https://mdntech.org/sk#realizacie`). Valid, and it matches the visible link, but Google canonicalizes fragments away -- harmless here.

**Other pages with a visible trail but no schema: NONE.** Scanned all 13 remaining pages for breadcrumb nav markup -- no other page renders a visible trail, so there is no case for re-adding BreadcrumbList anywhere else on that basis.

**However, the inverse mismatch exists: FAIL on the 3 blog posts.** The handoff's "breadcrumb schema removed sitewide" claim is inaccurate -- `app/(marketing)/blog/[slug]/page.tsx` (line 127) still emits BreadcrumbList (Home > Blog > Post) on all three posts, and those pages have **no visible trail** (only a "Back to Blog" link, which is not a breadcrumb). Google's breadcrumb guidance expects the markup to represent the on-page trail. Fix either direction: (a) add a visible trail matching the Royal Stroje pattern, or (b) remove the block for consistency with the site's own policy. Option (a) is preferred -- the schema is otherwise well-formed and earns the breadcrumb display in results.

### Check 2: SoftwareApplication on /chatkit and /toolkit

**/toolkit: PASS.** The earlier gaps are fixed here: `installUrl: "https://mdntech.org/toolkit#install"`, `downloadUrl` (GitHub), `license`, and `offers` with `price: "0"`, `priceCurrency: "USD"`, `availability: "https://schema.org/InStock"`. Also has `applicationCategory: DeveloperApplication`, `operatingSystem`, `softwareRequirements: "Claude Code"`, `featureList`.

**/chatkit: PARTIAL -- omissions confirmed, but correctly weighed they are not blockers.**
- `installUrl`: still absent. **Verdict: correct to omit right now.** ChatKit is a web SaaS with gated signup and the portal is currently closed -- an `installUrl` pointing at a closed signup would be misleading markup. Add it (pointing at the live signup URL) only when the portal opens. It is not in Google's required or recommended property list for the Software App rich result.
- `offers.availability`: still absent. Recommended-tier only. Given payment is not live ("credits granted from inside the app, no card charged today" per the site's own FAQ), `InStock` would slightly overstate; adding it when checkout ships is the honest sequencing. Snippet provided in section 4.
- **The actual rich-result blocker for BOTH pages:** Google's Software App rich result requires `aggregateRating` or `review` in addition to `name` and `offers.price`. Neither product has one, so neither is eligible regardless of installUrl/availability. Do NOT fabricate ratings -- collect real reviews first, then add `aggregateRating`. Until then the SoftwareApplication blocks still provide entity/knowledge-graph value and are worth keeping.

### Check 3: /sk and Royal Stroje business schema

**/sk: PASS.** Carries `ProfessionalService` (a LocalBusiness subtype -- satisfies the requirement) with `serviceType` (7 services), `areaServed: Slovensko`, `priceRange: "€€"`, SK phone `+421904904091`, `inLanguage: sk`, `image` (og-image.png -- verified 200, image/png), plus `FAQPage` with 8 questions whose text matches the visible FAQ section. Gap: **no `address` property** -- Google requires `address` for LocalBusiness rich results, so this block is currently ineligible for the local panel treatment (see High recommendation R2).

**Royal Stroje: the old LocalBusiness (geo + openingHours) and FAQPage are REMOVED -- confirmed.** Live page carries only `@graph`[Article, BreadcrumbList]. The strings "LocalBusiness" and "FAQPage" still appearing in the HTML are visible marketing copy describing what was delivered on royalstroje.sk ("Adresa, GPS suradnice a otvaracie hodiny su v kode webu... (LocalBusiness)"), not schema. **This removal was correct:** Royal Stroje's LocalBusiness data (geo, opening hours) belongs on royalstroje.sk, the client's own domain -- publishing another company's LocalBusiness on mdntech.org's case study would have been entity-confusing. The current Article treatment is the right model for a case study. Do not restore it.

### Check 4: Blog post BlogPosting schema

Structure: PARTIAL FAIL.

| Property | Status | Evidence |
|----------|--------|----------|
| `@type: BlogPosting` | PASS | Upgraded from `Article` since last audit |
| `author` | PASS | Organization "M.D.N Tech Team" with `url` -- acceptable for team-authored posts |
| `datePublished` | PASS | ISO 8601 (e.g. `2026-03-13T00:00:00.000Z`) |
| `dateModified` | WARN | Always identical to `datePublished` -- hardcoded `dateModified: isoDate` at `page.tsx` line 104; no modification tracking in `data/blog-posts.ts` |
| `image` | **FAIL** | All three URLs are soft 404s. `curl -I` on `/blog/claude-code-guide.jpg`, `/blog/agentic-ai-systems.jpg`, `/blog/smart-contracts-guide.jpg` returns **HTTP 200 with `content-type: text/html`** (Next.js serves an HTML page, not an image). `public/blog/` does not exist in the repo. `image` is a REQUIRED property for the Article rich result -- Google will fetch these, get HTML, and drop image eligibility. |
| `publisher.logo` | PASS | Valid, resolves 200 image/png |
| `mainEntityOfPage`, `headline`, `description`, `keywords`, `articleSection` | PASS | |

Also fragile (Medium): dates are stored as `"March 13, 2026"` in `data/blog-posts.ts` and regex-parsed through `new Date()` at render time (`page.tsx` lines 91-94) -- locale-dependent, and the fallback on parse failure is `new Date().toISOString()`, i.e. a silently wrong "published today". Store ISO dates in the data file.

Side finding: blog post pages emit **no `og:image` / `twitter:image` at all** (the broken image field is also used nowhere visible on the page). Fixing the image asset fixes both problems.

### Check 5: Organization schema consistency

**PASS.** The Organization block is byte-identical on all 14 pages (single source in `app/layout.tsx`), uses a stable `@id` that WebSite.publisher, SoftwareApplication.author/publisher, and the Royal Stroje Article all reference -- textbook entity linking.

- Logo: `https://mdntech.org/brand/png/logo-final-white-on-black-1000.png` -- **verified HTTP 200, content-type image/png**. 1000px wide, comfortably above Google's 112x112 minimum.
- `sameAs`: Instagram (`mdntechorg`), X (`MDNTechOrg`), LinkedIn (`company/111977261`) -- 3 profiles, consistent everywhere, also reused in the /sk ProfessionalService block.
- Contact: `contact@mdntech.org` (matches site domain now), `telephone: +971582283256`, `availableLanguage: [English, Slovak]`.
- Minor (Low): `address` lacks `postalCode`/`addressRegion` (UAE free-zone addresses often have no postal code -- acceptable); the LinkedIn URL is the numeric form (`/company/111977261`) -- works, but the vanity URL is more robust if one exists.

---

## 3. Validation errors and warnings (full list)

| # | Severity | Page(s) | Issue |
|---|----------|---------|-------|
| E1 | Critical | 3 blog posts | `BlogPosting.image` points to nonexistent files -- server soft-404s them as HTML with HTTP 200. Required property effectively broken; blocks Article rich-result image and misleads crawlers with fake-200 image URLs. |
| E2 | High | 3 blog posts | BreadcrumbList schema with no visible breadcrumb trail -- contradicts both Google guidance and the site's own stated policy (schema was supposed to be removed where no trail exists). |
| E3 | High | `/sk` | ProfessionalService missing `address` -- required for LocalBusiness rich-result eligibility. |
| W1 | Medium | 3 blog posts | `dateModified` hardcoded equal to `datePublished`. |
| W2 | Medium | 3 blog posts | Human-readable dates regex-parsed at render; parse failure silently stamps today's date. |
| W3 | Medium | `/chatkit`, `/toolkit` | No `aggregateRating`/`review` -- Software App rich result requires one of them. Not fixable honestly today; noted for when real reviews exist. |
| W4 | Medium | `/chatkit` | `offers.availability` absent (add when checkout goes live); `installUrl` absent (correct while signup is gated -- add at portal open). |
| W5 | Medium | `/blog` | No CollectionPage/Blog + ItemList schema on the listing page. |
| W6 | Low | 4 pages | FAQPage markup on home, /chatkit, /toolkit, /sk: since the August 2023 restriction, FAQ rich results only show for government/healthcare authority sites. Markup is valid, content is visible (verified on all 4 pages), so no compliance risk -- but expect zero FAQ rich-result gain. Keep for entity/AI-answer value; do not add more expecting SERP features. |
| W7 | Low | `/about` | Team page has no AboutPage/Person schema -- missed opportunity. |
| W8 | Low | Royal Stroje | Breadcrumb item 2 uses fragment URL `/sk#realizacie` -- matches visible link, harmless. |
| W9 | Low | Organization | No `postalCode`/`addressRegion`; LinkedIn numeric URL. |

Deprecated-type scan: clean. No HowTo, SpecialAnnouncement, CourseInfo, EstimatedSalary, or LearningVideo anywhere.

---

## 4. Recommendations

### CRITICAL

**R1 -- Fix BlogPosting image URLs (3 posts).**
Either add real 1200x675+ images at `public/blog/claude-code-guide.jpg`, `agentic-ai-systems.jpg`, `smart-contracts-guide.jpg`, or -- immediate stopgap -- change the three `image:` fields in `data/blog-posts.ts` (lines 35, 391, 844) to `"/og-image.png"` (verified live, 1200x630). The generator at `page.tsx` line 102 already falls back to `/og-image.png` only when `post.image` is falsy, so the data fields must be edited. When real images exist, emit Google's preferred multi-aspect array:

```json
"image": [
  "https://mdntech.org/blog/claude-code-guide-16x9.jpg",
  "https://mdntech.org/blog/claude-code-guide-4x3.jpg",
  "https://mdntech.org/blog/claude-code-guide-1x1.jpg"
]
```

This same fix should feed `openGraph.images` in the blog post `generateMetadata` -- the posts currently ship no og:image at all.

### HIGH

**R2 -- Add `address` to the /sk ProfessionalService.**
Without it the block cannot produce LocalBusiness rich results. Use the registered address (there is no Slovak office -- do not invent one, and do not add `geo`/`openingHoursSpecification` for a location that does not exist):

```json
"address": {
  "@type": "PostalAddress",
  "streetAddress": "Al Shmookh Business Center M 1003, One UAQ, UAQ Free Trade Zone",
  "addressLocality": "Umm Al Quwain",
  "addressCountry": "AE"
}
```

Optionally add `"@id": "https://mdntech.org/sk#business"` and `"parentOrganization": { "@id": "https://mdntech.org/#organization" }` to tie it into the entity graph.

**R3 -- Resolve the blog breadcrumb mismatch.**
Preferred: render a visible trail on blog posts, reusing the Royal Stroje pattern (translated):

```html
<nav aria-label="Breadcrumb" class="mb-8">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/blog">Blog</a></li>
    <li><span aria-current="page">{post.title}</span></li>
  </ol>
</nav>
```

The existing BreadcrumbList JSON-LD already matches this trail exactly -- no schema change needed. Alternative (if design vetoes a trail): delete the `breadcrumbSchema` block from `app/(marketing)/blog/[slug]/page.tsx` (line 127) for policy consistency.

### MEDIUM

**R4 -- Track real modification dates.** Add `dateModified?: string` (ISO) to the `BlogPost` interface, and while there, replace the human-readable `date` strings with ISO (`"2026-03-13"`) and format for display instead of parsing for schema. Kills W1 and W2 together. Remove the `new Date().toISOString()` fallback -- a build-time throw is better than silently claiming a post was published today.

**R5 -- ChatKit Offer, when checkout ships** (do not deploy while payment is off):

```json
"offers": {
  "@type": "Offer",
  "price": "0",
  "priceCurrency": "USD",
  "availability": "https://schema.org/InStock",
  "description": "30 free messages per chatbot, no credit card required"
}
```

At portal open, also add `"installUrl": "https://app.mdntech.org/signup"` (or the live signup URL). Not before.

**R6 -- Blog listing schema** (`/blog`; note the listing is a client component -- inject from a server layout):

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://mdntech.org/blog#webpage",
  "url": "https://mdntech.org/blog",
  "name": "M.D.N Tech Blog",
  "inLanguage": "en",
  "isPartOf": { "@id": "https://mdntech.org/#website" },
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "url": "https://mdntech.org/blog/claude-code-complete-guide" },
      { "@type": "ListItem", "position": 2, "url": "https://mdntech.org/blog/agentic-ai-systems-guide" },
      { "@type": "ListItem", "position": 3, "url": "https://mdntech.org/blog/smart-contracts-complete-guide" }
    ]
  }
}
```

**R7 -- When real user reviews exist**, add `aggregateRating` to both SoftwareApplication blocks to unlock the Software App rich result. Placeholder shape (values must come from genuine collected reviews):

```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "4.8",
  "ratingCount": "27"
}
```

### LOW

**R8 -- /about Person schema** for team members (name, jobTitle, `worksFor: { "@id": "https://mdntech.org/#organization" }`, sameAs to LinkedIn/GitHub), wrapped in an `AboutPage` whose `mainEntity` is the Organization `@id`.
**R9 -- FAQPage expectation-setting:** keep the four existing blocks (visible content matches, zero risk) but treat them as AI-answer/entity fodder, not a SERP feature -- FAQ rich results have been restricted to government/health authority sites since August 2023.
**R10 -- Organization polish:** add `addressRegion: "Umm Al Quwain"`; swap the numeric LinkedIn URL for the vanity URL if claimed.

---

## 5. What is working well

- Single-source global Organization/WebSite with `@id` cross-referencing -- every page-level entity (SoftwareApplication author/publisher, WebSite publisher, Royal Stroje Article author) resolves through the graph. This is above-average implementation quality.
- All prior audit fixes landed: `foundingDate` ISO, telephone added, `BlogPosting` type adopted, `inLanguage` on WebSite, toolkit installUrl/availability/license present.
- Royal Stroje is the model page: visible trail + matching schema, correct removal of the client's LocalBusiness data, clean `@graph`.
- Zero deprecated types, zero parse errors, zero placeholder text, JSON-LD only.

## 6. Category score

| Dimension | Score |
|-----------|-------|
| Technical validity (parse, context, types, URLs, dates) | 24/25 |
| Rich-result eligibility (required props satisfied) | 15/25 |
| Guideline compliance (visible-content match, honesty of markup) | 19/25 |
| Coverage and entity architecture | 20/25 |
| **Total** | **78/100** |

Fixing R1 (blog images) and R3 (breadcrumb mismatch) alone would lift this to ~88.
