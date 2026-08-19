# Technical SEO Audit — mdntech.org

**Audit date:** 2026-08-19
**Property:** https://mdntech.org (Next.js 15, Vercel, apex domain)
**Method:** Live crawl of all 14 indexable pages (HTML + response headers), robots.txt, sitemap.xml, live redirect tests via curl, cross-checked against repo source.
**Overall Technical SEO Score: 81/100**

---

## Executive Summary

The site is in solid technical shape: every page returns 200 with a correct, absolute, self-referential canonical on the apex; unique titles and meta descriptions everywhere (including /privacy and /terms, which get their metadata from server `layout.tsx` files despite the pages being client components); full security header set including CSP and 2-year preload HSTS; clean single-hop 308 redirects for www, http, and both .sk domains with query strings preserved; real lastmod dates in the sitemap; and all critical content present in the server-rendered HTML.

No Critical issues found. The main gaps are international: the EN/SK legal page pairs have **no hreflang anywhere** (neither in-page nor in the sitemap), and **all four Slovak pages are served with `<html lang="en">`**. On performance, a 667 KB (uncompressed) three.js chunk ships on every marketing page for a decorative star background, and the entire above-the-fold content (including the H1/LCP element) is server-rendered at `opacity:0`, gating LCP on JS hydration.

Finding counts: **Critical 0 · High 4 · Medium 4 · Low 5**

---

## Mandatory Checks (from handoff)

| # | Check | Verdict | Evidence |
|---|-------|---------|----------|
| 1 | hreflang for legal page pairs | **FAIL** | `/privacy`, `/terms`, `/sk/ochrana-osobnych-udajov`, `/sk/obchodne-podmienky`: zero `<link rel="alternate" hreflang>` tags in live HTML; sitemap.xml declares `xhtml:link` alternates only on the `/` and `/sk` entries. The `/` <-> `/sk` pair itself is correctly bidirectional (both pages carry the full sk/en/x-default set in-page, and both sitemap entries repeat it). |
| 2 | /privacy and /terms metadata despite "use client" | **PASS** | Live HTML: `<title>Privacy Policy \| M.D.N Tech</title>`, unique meta description, `<link rel="canonical" href="https://mdntech.org/privacy"/>`, page-specific OG/Twitter. Same for /terms. Source: server components `app/(marketing)/privacy/layout.tsx` and `app/(marketing)/terms/layout.tsx` export full `metadata` incl. `alternates.canonical` — the "use client" `page.tsx` is irrelevant to metadata. Legal body text confirmed present in server HTML ("Last Updated: August 16, 2026"). |
| 3 | Redirect hygiene | **PASS** | `https://www.mdntech.org/` → 308 → `https://mdntech.org/` (single hop). `http://mdntech.org/` → 308 → `https://mdntech.org/` (single hop, straight to https apex). `https://mdntech.sk/?utm_source=test` → 308 → `https://mdntech.org/sk?utm_source=test` (query preserved). `https://www.mdntech.sk/` → 308 → `https://mdntech.org/sk` (single hop). `mdntech.com` is a **third-party domain** (AWS ELB, forwards to mdntech.ca) — not part of this property, no action possible or needed. Only imperfection: `http://www.mdntech.org` takes 2 hops (http://www → https://www → apex), which is normal and fine. |
| 4 | Canonicals on every page | **PASS** | All 14 pages have exactly one canonical: present, absolute, self-referential, `https://mdntech.org/...` (never www, never .sk, no trailing slashes). Home canonical `https://mdntech.org` matches the sitemap `<loc>`. |
| 5 | Trailing slash / duplicate URLs | **PASS** | `https://mdntech.org/sk/` → 308 → `/sk`; `/about/` → 308 → `/about`. Uppercase variants (`/ABOUT`) return 404, so no case-duplicate URLs. Query-string variants serve 200 but carry the clean static canonical, so UTM URLs consolidate correctly. |

---

## Findings

### Critical

None. No noindex leaks (no `X-Robots-Tag` header on any response, all pages `<meta name="robots" content="index, follow">`), no broken canonicals, no blocked resources, no soft-404s (unknown URLs return real HTTP 404 via `app/(marketing)/not-found.tsx`).

### High

**H1. EN/SK legal page pairs have no hreflang at all**
- Evidence: `/privacy` <-> `/sk/ochrana-osobnych-udajov` and `/terms` <-> `/sk/obchodne-podmienky` are translations of each other, but neither side declares the other — no in-page `<link rel="alternate" hreflang>` (confirmed in all four live HTML files) and no `xhtml:link` entries in sitemap.xml (only `/` and `/sk` have them). hreflang only counts when declared bidirectionally, so Google treats these as four unrelated pages and may serve the wrong language in SERPs (e.g. the EN privacy policy to Slovak searchers).
- Fix: add `alternates.languages` to all four pages' metadata. The SK legal pages already have `alternates.canonical` in `app/(marketing)/sk/ochrana-osobnych-udajov/page.tsx` and `.../obchodne-podmienky/page.tsx`; extend to the pattern already used in `app/(marketing)/sk/page.tsx`:
  ```ts
  alternates: {
    canonical: "/sk/ochrana-osobnych-udajov",
    languages: {
      sk: "https://mdntech.org/sk/ochrana-osobnych-udajov",
      en: "https://mdntech.org/privacy",
      "x-default": "https://mdntech.org/privacy",
    },
  },
  ```
  Mirror it in `privacy/layout.tsx` and `terms/layout.tsx`, and add matching `xhtml:link` blocks to both entries of each pair in `app/sitemap.ts`. Optionally also add a visible language-switch link on /privacy and /terms (currently /sk/ochrana-osobnych-udajov links to /privacy, but /privacy has zero links to the SK version).

**H2. All four Slovak pages are served with `<html lang="en">`**
- Evidence: `page_sk.html`, `page_sk_referencie_royal-stroje.html`, `page_sk_ochrana-osobnych-udajov.html`, `page_sk_obchodne-podmienky.html` all open with `<html lang="en">`. Root cause: single root layout `app/layout.tsx:77` hardcodes `lang="en"` for every route.
- Impact: contradicts the hreflang sk annotation and the `og:locale=sk_SK` on /sk; wrong screen-reader pronunciation; Bing and other engines weigh the lang attribute more than Google.
- Fix: per-locale `lang`. Cleanest in App Router: split into two route groups with their own root layouts (`app/(en)/layout.tsx` with `lang="en"`, `app/(sk)/layout.tsx` with `lang="sk"`), or read the pathname in the root layout via headers/middleware and set `lang` dynamically. Verify the fix on all four /sk URLs.

**H3. 667 KB three.js chunk ships on every marketing page for a decorative background**
- Evidence: homepage loads 17 JS files totalling ~1.47 MB uncompressed; the largest, `/_next/static/chunks/b536a0f1-0bc70055616c4f4d.js` (667,777 bytes), contains `WebGLRenderer`/`THREE.` — it drives the single decorative `<canvas>` star background. It is referenced from the shared `(marketing)/layout` bundle, so every page pays for it.
- Impact: main-thread parse/compile cost delays hydration (which H4 makes LCP-blocking) and degrades INP on low-end mobiles; the canvas render loop competes with user input.
- Fix: load the stars canvas with `next/dynamic(() => import(...), { ssr: false })` and mount it after first paint (`requestIdleCallback` or an `IntersectionObserver`), or replace with a CSS/static-image starfield. Also consider dropping the 112 KB `polyfills-*.js` by raising `browserslist` targets — modern-only targets make Next skip legacy polyfills.

**H4. Entire above-the-fold content (including the H1/LCP element) is served at `opacity:0`**
- Evidence: homepage H1 renders as `<h1 ... style="opacity:0;transform:translateX(-100px) translateZ(0)">` (framer-motion SSR initial state); 62 elements on `/`, 55 on `/sk`, 79 on `/chatkit`, 77 on `/about` carry `style="opacity:0..."`.
- Impact: the browser cannot paint the hero until React hydrates and the entrance animation runs, so LCP is gated on the full JS payload from H3 (Good LCP threshold: <2.5 s — hydration-gated paint on mid-range mobile will routinely miss it). If JS fails, the page appears blank even though the text exists in the HTML (text extraction by non-JS crawlers such as GPTBot/ClaudeBot still works, which limits the GEO damage).
- Fix: for above-the-fold elements, render visible by default and animate only the transform, or use framer-motion's `initial={false}` on first paint / CSS-only entrance animations gated by `@media (prefers-reduced-motion: no-preference)`. At minimum, exempt the H1 and hero copy from opacity-0 initial states.

### Medium

**M1. SK legal pages inherit the root Open Graph block (wrong og:title, og:url, og:locale)**
- Evidence: `/sk/obchodne-podmienky` and `/sk/ochrana-osobnych-udajov` serve `og:title="M.D.N Tech | AI Chatbot for Your Website & Free AI Tools"`, `og:url="https://mdntech.org"`, `og:locale="en_US"`, `og:image=/og-image.png` — the root defaults — while their `<title>`/description/canonical are correct. Cause: their `page.tsx` metadata omits `openGraph`, and Next's shallow merge pulls the root object in whole. `og:url` pointing at the homepage is also a weak conflicting canonicalization hint.
- Fix: add full `openGraph` (and `twitter`) blocks to both SK legal pages, restating url/title/description/locale (`sk_SK`) — same pattern (and same warning comment) already used in `privacy/layout.tsx` and `terms/layout.tsx`.

**M2. mdntech.sk deep paths redirect into 404s**
- Evidence: `https://mdntech.sk/referencie/royal-stroje` → 308 → `https://mdntech.org/referencie/royal-stroje` → **404** (correct page lives at `/sk/referencie/royal-stroje`). Cause: the catch-all in `next.config.js:76-80` maps `/:path*` on .sk hosts to `https://mdntech.org/:path*` — the English namespace — while only the bare root maps to `/sk`.
- Impact: any shared, printed, or typed deep .sk URL dead-ends; link equity from .sk backlinks to inner pages is lost.
- Fix: in the .sk redirect block, map the known Slovak routes first (`/referencie/:path*` → `/sk/referencie/:path*`, `/ochrana-osobnych-udajov` → `/sk/ochrana-osobnych-udajov`, `/obchodne-podmienky` → `/sk/obchodne-podmienky`), or change the catch-all destination to `https://mdntech.org/sk/:path*` and keep explicit exceptions for shared assets if any.

**M3. Invalid `article:published_time` format on all three blog posts**
- Evidence: `/blog/claude-code-complete-guide` serves `<meta property="article:published_time" content="March 13, 2026"/>`; the other two posts serve "March 10, 2026" and "March 1, 2026". The OG protocol requires ISO 8601 datetimes; human-readable strings are ignored by parsers. (The JSON-LD `datePublished`/`dateModified` are correct ISO — `2026-03-13T00:00:00.000Z` — so impact is limited to OG consumers.)
- Fix: in the blog post metadata generation, pass the raw ISO date to `openGraph.publishedTime` instead of the display-formatted string.

**M4. CSP relies on `'unsafe-inline'` in script-src with no nonces**
- Evidence: every response carries `Content-Security-Policy: ... script-src 'self' 'unsafe-inline'; ...`. Already documented as known debt in `next.config.js` comments (Next inline bootstrap scripts). Everything else is well locked down (`frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, no `unsafe-eval` in prod).
- Impact: `'unsafe-inline'` neutralizes most of CSP's XSS protection; an injected script would run. Not a direct ranking factor, but script injection is an SEO catastrophe when it happens.
- Fix: move to nonce-based CSP via middleware (`strict-dynamic` + per-request nonce) as already planned. Not urgent; scheduled work.

### Low

**L1. /favicon.ico returns 404**
- Evidence: `https://mdntech.org/favicon.ico` → 404 (Next serves `icon.png` 32x32/`icon1.png` 192x192/`apple-icon.png` via link tags, which covers modern browsers and Google). Some crawlers and older agents request `/favicon.ico` blindly, polluting logs with 404s.
- Fix: add `app/favicon.ico` (Next serves it at the root automatically).

**L2. `Access-Control-Allow-Origin: *` on all HTML page responses**
- Evidence: present on all 14 crawled pages and confirmed live on `/` and `/about`. Not set in `next.config.js` (the old `/api/chat/*` CORS block was removed) or `middleware.ts` — likely a Vercel project-level setting.
- Impact: minimal for public HTML (ACAO `*` forbids credentialed requests), but it is unnecessary surface and its source is untracked.
- Fix: locate and remove the setting (check Vercel dashboard project settings); CORS for the widget API is already owned by `lib/chat/cors.ts`.

**L3. Royal Stroje og:image is a 586 KB JPEG**
- Evidence: `https://mdntech.org/portfolio/royalstroje.jpg` = 586,313 bytes, referenced as `og:image` on `/sk/referencie/royal-stroje`. In-page use goes through the `_next/image` optimizer (with `fetchPriority="high"` — good), but social scrapers fetch the raw file.
- Fix: export a ~1200x630 version around 100-200 KB for the OG tag.

**L4. Sitemap fields are inconsistent across entries**
- Evidence: `/chatkit`, `/toolkit`, `/sk/referencie/royal-stroje` have `changefreq`/`priority`; the other 11 entries do not. Google ignores both fields, so this is cosmetic only. lastmod values are real per-page dates (good — this was fixed since the previous audit).
- Fix (optional): drop `changefreq`/`priority` everywhere for consistency.

**L5. Minor redirect/markup notes (informational)**
- `http://www.mdntech.org` resolves in 2 hops (http://www → https://www → apex). Normal; HSTS preload (`includeSubDomains`) makes the first hop vanish for returning browsers. No action.
- In-page hreflang attributes render as `hrefLang="sk"` (camelCase) in the raw HTML. HTML attributes are case-insensitive; parsers and Google read it fine. No action.
- FAQPage JSON-LD on /, /sk, /chatkit, /toolkit will not produce rich results (Google restricted FAQ rich results to government/health sites in 2023), but it is harmless and useful for AI answer engines. Keep.

---

## Category Detail

**1. Crawlability — PASS (95/100).** robots.txt allows all, blocks `/api/` and `/_next/`, references the sitemap, and explicitly allows GPTBot, ClaudeBot, Google-Extended, PerplexityBot, Applebot-Extended, CCBot, AmazonBot (deliberate GEO posture). Sitemap covers all 14 pages with real lastmod dates. Custom 404 exists and returns true HTTP 404.

**2. Indexability — PASS (95/100).** Unique titles (17-96 chars) and descriptions on all 14 pages; `index, follow` everywhere; no X-Robots-Tag headers; canonicals perfect (see mandatory check 4). Blog post titles run long (83-96 chars, will truncate in SERPs) — cosmetic.

**3. International / hreflang — FAIL (55/100).** `/` <-> `/sk` pair correct and bidirectional (in-page + sitemap, with x-default). Legal pairs entirely unannotated (H1); Slovak pages declare `lang="en"` (H2); SK legal OG inherits English root block (M1). `/sk/referencie/royal-stroje` correctly has no hreflang (no EN equivalent exists).

**4. Security — PASS (85/100).** HSTS 2-year with preload + includeSubDomains, X-Frame-Options DENY plus `frame-ancestors 'none'`, nosniff, Referrer-Policy, Permissions-Policy, CSP on every response. Debits: `'unsafe-inline'` script-src (M4), stray ACAO `*` (L2).

**5. URL Structure & Redirects — PASS (85/100).** Clean lowercase hyphenated URLs, max depth 3, no extensions; single-hop 308s for www/http/.sk with query preservation; trailing slashes normalized via 308; no case-duplicates. Debit: .sk deep-path 404s (M2).

**6. Mobile — PASS (95/100).** `width=device-width, initial-scale=1` viewport on every page, no user-scalable restriction, theme-color set, Tailwind responsive classes throughout, self-hosted preloaded woff2 fonts (no third-party font chain — the old Google Fonts @import is gone).

**7. Core Web Vitals — NEEDS IMPROVEMENT (55/100).** LCP: hydration-gated hero (H4) + ~1.47 MB uncompressed JS incl. three.js (H3); mitigations already in place: hero videos use `preload="none"` + poster (fixed since last audit), fonts preloaded, LCP image on royal-stroje uses `fetchPriority="high"`. CLS: low risk — fixed navbar, dimensioned images, `data-nimg` fill wrappers. INP: three.js render loop + heavy framer-motion usage on low-end devices. (INP thresholds: Good <200 ms; FID is dead — removed from Chrome tooling Sept 2024.)

**8. Structured Data — PASS (85/100).** Organization + WebSite on all pages; FAQPage on 4 pages; SoftwareApplication + Offer on /chatkit and /toolkit; ItemList (18 CreativeWorks) on /toolkit; ProfessionalService with Country areaServed on /sk; BlogPosting + BreadcrumbList + correct ISO dates on posts; Article + BreadcrumbList on the royal-stroje case study. All schema URLs use the apex. Debit: OG article timestamp format (M3).

**9. JS Rendering — PASS (80/100).** All content — nav, H1s, body copy, legal text, blog articles, FAQ answers — is present in the server HTML (verified per page); "use client" pages are still SSR'd. Debit: content is visually hidden until hydration (H4), a resilience rather than indexing problem for Google, but the visible-paint dependency matters.

---

## Score

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Crawlability | 95 | 15% | 14.25 |
| Indexability | 95 | 15% | 14.25 |
| International / hreflang | 55 | 10% | 5.50 |
| Security | 85 | 10% | 8.50 |
| URL Structure & Redirects | 85 | 10% | 8.50 |
| Mobile | 95 | 10% | 9.50 |
| Core Web Vitals | 55 | 15% | 8.25 |
| Structured Data | 85 | 5% | 4.25 |
| JS Rendering | 80 | 10% | 8.00 |
| **Total** | | **100%** | **81/100** |

## Recommended Fix Order

1. H1 — hreflang for legal pairs (metadata `alternates.languages` + `app/sitemap.ts`), ~1 hour, pure win.
2. M1 — OG blocks on SK legal pages (same files, same PR as H1).
3. H2 — `lang="sk"` on Slovak pages (root layout split).
4. M2 — .sk deep-path redirect mapping in `next.config.js`.
5. M3 — ISO `article:published_time` on blog posts.
6. H4 + H3 — hero visibility and three.js deferral (biggest CWV lever; needs design sign-off on animation behavior).
7. L1-L3 — favicon.ico, ACAO source hunt, OG image resize.
