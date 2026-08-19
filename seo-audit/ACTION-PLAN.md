# SEO Action Plan: mdntech.org

**Generated:** August 19, 2026 (Session 68)
**Current Score:** 76/100 (March baseline was 58)
**Target:** 85+/100 -- realistic once the Critical + High items land; performance is worth ~5 weighted points alone.
**Status (S70, 2026-08-19):** done in S68: 1, 2, 4-7, 9, 14, 18. Done in S69: 3, 8, 10-13, 16. Done in S70: 15, 17, 19, 21 (see the DONE notes in place). **Remaining: 20 (tooling note, nothing to fix) and 22 (real ChatKit reviews -- post-launch, needs real customers). The build queue is otherwise empty; the open work is the prod deploy + the .sk deep-link check under item 10.**

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

### 3. blackhole.webm downloads twice per view -- DONE S69 (2026-08-19)
Two autoplay `<video>` elements fetched the same 740 KB file in parallel (autoplay overrides `preload="none"`). Fixed: the footer bookend passes `lazy` to `BlackholeVideo`, which renders the poster `<img>` alone until an IntersectionObserver (1000px rootMargin) sees it -- by then the hero's fetch is in HTTP cache. Verified in build output: one `<video>` per page. Bonus: blog/legal pages now defer the footer video entirely until scrolled near.

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

### 7. Blog BreadcrumbList without visible breadcrumbs -- DONE (S68 removed the schema, S70 restored both)
S68 deleted the orphaned schema. S70 added the visible trail and re-emitted the BreadcrumbList alongside it, both from `blogBreadcrumb()` -- see item 15.

### 8. /sk ProfessionalService lacks `address` -- DONE S69 (2026-08-19)
`PostalAddress` (the FZE registered seat, structured in `SK_NAP.address` -- must stay in sync with `COMPANY_LEGAL_LINE`) added to the /sk schema. `areaServed` keeps the market claim on Slovakia. The chatbot seed script does not read the new fields, so no re-seed was needed.

### 9. /about pre-honesty-pass numbers -- OWNER DECISION
**Effort:** 30 min once decided | **File:** /about content source
"50+ smart contracts", "100+ Web3 partnerships", "30+ years for corporates" contradict the honesty standard S67 set on /sk. Verify each number or rewrite to the /sk standard (describe the work, skip unverifiable counts). Do not auto-fix -- Martin decides which numbers are defensible.

---

## Medium -- fix within a month

### 10. mdntech.sk deep paths 404 -- DONE S69 (2026-08-19)
The host-based catch-all in `next.config.js` now maps `/:path*` -> `mdntech.org/sk/:path*`, with a `/sk/:path*` pass-through rule above it so already-prefixed paths do not double. Campaign deep links on .sk are safe. (Needs a prod deploy before the partner campaign; verify one deep link after.)

### 11. SK legal pages inherit the English OG block -- DONE S69 (2026-08-19)
Full Slovak openGraph + twitter blocks (sk_SK, correct og:url, `/og-image-sk.png`) on both SK legal pages, restating every field because a page-level block replaces the root wholesale. Verified in build output.

### 12. Mobile hero: dead "Coming soon" button above the live CTA -- DONE S69 (2026-08-19)
The gated primary gets `order-last sm:order-none` on / (landing hero) and in PageHero (applies only while `primaryCta.disabled`, so /chatkit demotes and /toolkit's live primary is untouched). Desktop row order unchanged.

### 13. /sk chat bubble overlaps footer registration line at 390px -- DONE S69 (2026-08-19)
Footer clearance, not a widget change (`widget.js` is shared with customer embeds): the SK footer bottom block gets `pr-20 sm:pr-0`, so the legal line and link row wrap short of the bubble's fixed column (right 64px at <=480px, right 76px up to sm). S67 teardown untouched.

### 14. Blog dateModified + fragile date parsing
**Effort:** 1 h | **File:** `app/(marketing)/blog/[slug]/page.tsx:91-104`
`dateModified` hardcoded equal to `datePublished`; locale-dependent `Date` parsing silently stamps TODAY on failure (fabricated freshness). Store ISO dates in `data/blog-posts.ts` (pairs with item 6's `updated` field), emit ISO `article:published_time`.

### 15. Blog refresh bundle -- DONE S70 (2026-08-19)
- **Staleness fixed at the root, not reset.** "Latest Features (March 2026)" is now "Beyond the Basics" and the version-pinned "Opus 4.6 with Effort Levels" subsection describes what effort *is* and links the docs for the current ladder, under a callout saying outright that this section does not track model versions. Do not reintroduce a dated feature list -- it goes stale in one release cycle.
- **Both "coming soon" placeholders removed.** The /blog index pill became a prose cross-link into /chatkit and /toolkit (also item 21); the `isFullArticle` placeholder block in BlogPostContent was dead code (every post is long) and is gone.
- **Person authorship.** Posts are bylined to the founder (`AUTHOR` in `data/blog-posts.ts`, **kept in sync by hand with `FOUNDER` in `constants/index.ts`** -- deliberately not imported, that module pulls react-icons into the blog client graph). Article schema author is a Person with `jobTitle` + `worksFor`; publisher is `organizationRef()`. No `sameAs` until `FOUNDER.linkedin` is real.
- **Citations shipped** via a new `links?: ContentLink[]` (+ `linksLabel`) field on `ContentBlock`, rendered as a trailing "Source(s):" line by `BlockLinks`. Attribution added for SWE-bench, METR, Claude Code docs, the effort parameter, API pricing, MCP, A2A, Hacken's H1 2025 report (the $3.1bn / $1.8bn / $263m figures), OpenZeppelin, Chainlink VRF and EIP-20/721/1155.
- **The METR claim was corrected, not just cited:** the post now gives the actual result (16 devs, ~19% slower) and says METR has since labelled it historical. A2A is no longer described as "Google's" -- it is Linux Foundation-governed.
- **Item 7 closed with it:** visible breadcrumb + BreadcrumbList are both built from `blogBreadcrumb()` in `data/blog-posts.ts` -- one array, per the schema.ts rule. If the trail is ever removed, remove the schema node with it.
- Byline block also carries published/updated/read-time; `formatIsoDate()` splits the ISO string instead of parsing it (the parser S68 replaced silently stamped TODAY on failure).

### 16. /toolkit + /blog over-serialization -- DONE S69 (2026-08-19), with a finding correction
The /blog half was the real waste and is fixed: client cards (`BlogHero`, `BlogPostCard`, `RelatedPostCard`) now take `BlogPostPreview` (id/title/excerpt/category/date/readTime/tags), never full `BlogPost` -- the index shipped every article's entire `content` array as props (~90 KB -> 62 KB) and each article page inlined its 2 related articles in full (verified gone). `Section` also moved to the server half of the primitives (only its animated heading is a client leaf), so no section's card tree crosses the boundary as client props anymore.
**Correction to the original finding:** /toolkit stays ~303 KB. The 124-130 KB flight block is Next's inlined RSC seed tree of the RENDERED page -- App Router inlines it for hydration on every page regardless of client boundaries, so "serialize once" is not achievable by moving boundaries; the ~140 KB target would require rendering less directory content. Do not re-attempt via restructuring.

---

## Low -- backlog

17. Tap targets sub-24px -- **DONE S70.** `inline-flex min-h-[24px] items-center` on the footer `linkClass` (every call site is a `flex flex-col gap-2.5` column, so nothing moved), on both breadcrumb trails, on /toolkit's "Source" links, and on the shared code-block Copy button. The directory link also dropped its duplicated `font-medium` -- `PROSE_LINK_CLASS` is used bare by contract.
18. Dead Cedarville Cursive font preload on all 14 pages (22.6 KB, `.cursive` class unused) -- actually a 10-minute quick win, do it with item 2.
19. /sk H1 hard `<br>` isolates "chatboty" at 390px -- **DONE S70.** The `<br>` became two `block` spans with `text-balance` (Tailwind 3.4.1), so the browser evens out line one instead of stranding a word. H1 copy untouched -- that guardrail still stands.
20. Scroll-reveal holds below-fold sections at opacity 0 -- any screenshot/preview tooling must scroll through first (bit the visual agent; first full-page capture was 19/20 black).
21. Blog internal links -- **DONE S70, and the finding was half-right.** Money pages already deep-linked into the Claude Code guide (`components/chatkit/knowledge-base.tsx`, `components/toolkit/what-is-a-skill.tsx`) plus /blog from three more places; what was genuinely missing was the return path. Posts now carry contextual links out (guide -> /toolkit, agentic -> /chatkit, contracts -> /about) and the /blog index closes on a ChatKit/ToolKit line instead of the retired "coming soon" pill.
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
