# SEO Action Plan: mdntech.org

**Generated:** August 19, 2026 (Session 68)
**Current Score:** 76/100 (March baseline was 58)
**Target:** 85+/100 -- realistic once the Critical + High items land; performance is worth ~5 weighted points alone.

Guardrails (do not re-open): /sk H1 + "Co robime" H2 stay as written; no fabricated ratings/claims; no ChatKit installUrl while gated; no schema-only breadcrumbs.

---

## Critical -- fix immediately

### 1. Blog images do not exist (rich results broken)
**Impact:** Article rich results + social sharing for all 3 posts | **Effort:** 1-2 h
**Files:** `data/blog-posts.ts` (lines ~35/391/844), `public/blog/` (missing)
All three BlogPosting `image` URLs (`/blog/*.jpg`) return HTTP 200 with `text/html` (soft-404). Posts also ship zero og:image. Either generate three real hero images into `public/blog/` (reuse the OG-card generator pattern in `scripts/generate-og-images.mjs`) or remove the `image` property until real ones exist. Add og:image to post metadata at the same time.

### 2. Three.js ships on every page; hero hidden until hydration
**Impact:** LCP 3.9-4.5 s -> target < 2.5 s; the single biggest score lever, open since March | **Effort:** 0.5-1 day
**Files:** hero/starfield components (three.js + react-three-fiber imports), scroll-reveal wrapper
Three.js + r3f = ~786 KB uncompressed, 54% of all JS, loaded on blog and legal pages too. And the H1 is server-rendered at `opacity:0` (62 elements on /) so nothing paints until hydration finishes -- TTFB is 60-70 ms, the whole delay is client-side.
- `next/dynamic` with `ssr: false` for the 3D canvas; render a static (CSS gradient or poster) background immediately.
- Exempt above-the-fold text from the scroll-reveal initial `opacity:0` (or set initial visible + animate on hydration only below the fold).
- Do not load the three.js chunk at all on /blog/*, /privacy, /terms and the SK legal pages.

### 3. blackhole.webm downloads twice per view
**Impact:** 1.3-1.5 MB media per load on / and /sk | **Effort:** 1-2 h
Two autoplay `<video>` elements fetch the same 740 KB file in parallel (autoplay overrides `preload="none"`). Render one video element (or gate the second by viewport/media query so only one mounts), add `poster` + `fetchpriority="high"` on the poster so LCP does not wait for video.

---

## High -- fix within a week

### 4. `<html lang="en">` on all four Slovak pages
**Effort:** 1-3 h | **File:** `app/layout.tsx:77`
Contradicts hreflang + og:locale and mislabels the pages for the exact market /sk targets. Root layout hardcodes the attr; cleanest Next.js fix is route-group root layouts (`(en)` / `(sk)`) or deriving `lang` from the pathname in the root layout.

### 5. hreflang for the legal page pairs (bidirectional)
**Effort:** 1 h | **Files:** `app/(marketing)/privacy/layout.tsx`, `.../terms/layout.tsx`, SK legal page metadata, `app/sitemap.ts`
/privacy <-> /sk/ochrana-osobnych-udajov and /terms <-> /sk/obchodne-podmienky have zero hreflang anywhere. Add `alternates.languages` in the EXISTING server layouts (no page split needed -- the S66 "use client blocks metadata" concern is outdated) and mirror in the sitemap. Ready-to-paste entries in `sitemap-audit.md`.

### 6. Sitemap lastmod stale on 11/14 URLs
**Effort:** 1 h | **Files:** `app/sitemap.ts`, `data/blog-posts.ts`
Home/about say 2026-07-16 (rebuild shipped mid-August); /terms says 2026-01-20 but changed 2026-08-18. Add `updated?: string` to the blog data model (lastmod is structurally wired to publish date today). Corrected `app/sitemap.ts` included in `sitemap-audit.md`. Also: drop the inconsistent changefreq/priority (3/14 URLs) and the dead date-regex at lines 10-13 while in there.

### 7. Blog BreadcrumbList without visible breadcrumbs
**Effort:** 1-2 h | **File:** `app/(marketing)/blog/[slug]/page.tsx`
The S58 sitewide removal missed the 3 blog posts: schema present, no visible trail -- the exact mismatch it was meant to fix. Either copy the Royal Stroje pattern (visible `aria-label` trail + schema) or delete the schema block.

### 8. /sk ProfessionalService lacks `address`
**Effort:** 30 min | **File:** /sk JSON-LD source (grep `ProfessionalService` in constants/components)
Without `address` the page is ineligible for LocalBusiness-family rich results despite otherwise solid markup + FAQPage. Use the FZE registered address already published in the footer/legal line.

### 9. /about pre-honesty-pass numbers -- OWNER DECISION
**Effort:** 30 min once decided | **File:** /about content source
"50+ smart contracts", "100+ Web3 partnerships", "30+ years for corporates" contradict the honesty standard S67 set on /sk. Verify each number or rewrite to the /sk standard (describe the work, skip unverifiable counts). Do not auto-fix -- Martin decides which numbers are defensible.

---

## Medium -- fix within a month

### 10. mdntech.sk deep paths 404
**Effort:** 30 min | **File:** `next.config.js` redirects()
`mdntech.sk/referencie/royal-stroje` -> 308 -> `mdntech.org/referencie/royal-stroje` -> 404. The host-based catch-all must map `/:path*` -> `/sk/:path*` (special-case paths already starting with /sk to avoid doubling). Matters before the ~150-partner email campaign if any .sk deep links go out.

### 11. SK legal pages inherit the English OG block
**Effort:** 30 min | **Files:** SK legal page metadata
og:title English, og:url pointing at the homepage, og:locale en_US. Set proper openGraph in each SK legal page's metadata export.

### 12. Mobile hero: dead "Coming soon" button above the live CTA
**Effort:** 30 min | **Files:** hero CTA stacks on / and /chatkit
First thumb target in the hero does nothing while the portal is gated. Reorder so the live CTA is first on mobile, or visually demote/remove the dead button until APP_LIVE.

### 13. /sk chat bubble overlaps footer registration line at 390px
**Effort:** 30 min | **Files:** `public/widget.js` / `SkChatWidget.tsx` (bubble offset), or footer bottom padding on /sk
Evidence: `screenshots/sk_mobile_footer_widget.png`. Add scroll-position-aware offset or footer clearance. (Keep the S67 teardown behavior intact -- see handoff Key Files warning.)

### 14. Blog dateModified + fragile date parsing
**Effort:** 1 h | **File:** `app/(marketing)/blog/[slug]/page.tsx:91-104`
`dateModified` hardcoded equal to `datePublished`; locale-dependent `Date` parsing silently stamps TODAY on failure (fabricated freshness). Store ISO dates in `data/blog-posts.ts` (pairs with item 6's `updated` field), emit ISO `article:published_time`.

### 15. Blog refresh bundle (queued /blog/[slug] redesign)
**Effort:** 0.5-1 day, combine with the redesign already queued in the handoff
Frozen since 2026-03-13 with time-stamped claims ("Latest Features (March 2026)") and a 5-month-old "coming soon" badge. Bundle into one pass: update stale claims, add Person authorship (Martin) with Person schema + byline, add outbound citations (METR, SWE-bench etc. are mentioned but uncited -- /toolkit's 23 attributed links are the house pattern), fix items 1/7/14 in the same files.

### 16. /toolkit ships its content twice (303 KB HTML)
**Effort:** 2-4 h | **Files:** /toolkit page -> client components
A single 124 KB RSC flight block re-serializes the whole skills directory as client props (same pattern on /blog, 68 KB). Move filtering/search to a server boundary or pass IDs + render server-side so the directory is serialized once.

---

## Low -- backlog

17. Tap targets sub-24px: footer links (20px), breadcrumbs (16px), /toolkit copy buttons + "Source" links (59 targets on that page).
18. Dead Cedarville Cursive font preload on all 14 pages (22.6 KB, `.cursive` class unused) -- actually a 10-minute quick win, do it with item 2.
19. /sk H1 hard `<br>` isolates "chatboty" on its own line at 390px -- swap to responsive break or non-breaking group.
20. Scroll-reveal holds below-fold sections at opacity 0 -- any screenshot/preview tooling must scroll through first (bit the visual agent; first full-page capture was 19/20 black).
21. Blog posts: zero internal links from money pages to posts and back beyond nav -- add contextual cross-links.
22. Consider collecting real ChatKit reviews post-launch to unlock `aggregateRating` (never fabricate).

---

## Resolved since March (do not re-fix)

- Template remnants (example.com, sponsor links): GONE
- 8x H1 on homepage: now single H1 sitewide
- Blog/team unreachable: nav + footer link everything
- Canonicals, redirects (www, .sk, trailing slash): all single-hop 308, PASS
- CLS: 0.00 measured (was predicted fail)
- /privacy + /terms metadata: present via server layouts (S66 concern outdated)
- ToolKit installUrl/availability: present (S60 item closed)
- mdntech.com: third-party domain (forwards to mdntech.ca) -- task 15's ".com 301" is moot
