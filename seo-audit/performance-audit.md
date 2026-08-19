# Performance Audit: mdntech.org

**Date:** 2026-08-19
**Framework:** Next.js 15 (App Router, RSC), Vercel hosting
**Scope:** 14 prerendered pages; deep-dive on `/`, `/sk`, `/chatkit`, `/toolkit`, `/blog/claude-code-complete-guide`
**Supersedes:** the 2026-03-17 audit of the pre-rebuild site (mdntech.com). Several of its P0 items were fixed in the rebuild (posters + `preload="none"` on videos, next/font, image dimensions, resource hints). One P0 item was NOT fixed -- see Critical #1.

---

## Method

What was **measured** vs what was **statically analyzed**:

- **PageSpeed Insights API:** attempted keyless for `/` and `/sk` -- returned HTTP 429 (shared anonymous daily quota exhausted). **No PSI lab data and no CrUX field data (LCP/INP/CLS) were retrieved.** Nothing below is field data; INP is assessed via its lab proxy TBT.
- **Local Lighthouse 12.8.2** (Chrome headless, default mobile emulation: moto-G-class device, 4x CPU throttle, slow-4G network throttle) run against production for the 5 key pages. Caveat: Lighthouse flagged the host CPU as slower than its reference on one run, so **TBT values are inflated and scores are somewhat pessimistic** -- treat absolute numbers as directional; the bottleneck attribution (long tasks, LCP phases, request weights) is robust.
- **Static analysis** of the fetched HTML + response headers for all 14 pages, plus direct fetches of the production JS/CSS/font/video assets to get real compressed transfer sizes and identify libraries inside chunks.

---

## Lab Metrics (local Lighthouse, mobile emulation)

| Page | Score | FCP | LCP | TBT | CLS | Speed Index | LCP element |
|------|-------|-----|-----|-----|-----|-------------|-------------|
| `/` | 57 | 1.6 s | 3.9 s | 3,360 ms | **0** | 2.8 s | hero `<video>` (blackhole poster) |
| `/sk` | 51 | 2.0 s | 4.5 s | 2,890 ms | **0** | 4.5 s | hero `<video>` (blackhole poster) |
| `/toolkit` | 56 | 1.7 s | 4.1 s | 1,690 ms | **0** | 4.9 s | hero `<p>` text |
| `/chatkit` | 57 | 1.7 s | 4.3 s | 1,420 ms | **0** | 4.5 s | hero container |
| `/blog/claude-code-complete-guide` | 61 | 1.5 s | 4.0 s | 1,400 ms | **0** | 2.2 s | intro `<p>` text |

**Core Web Vitals status (lab assessment, thresholds: LCP <=2.5s, INP <=200ms, CLS <=0.1):**

| Metric | Status | Evidence |
|--------|--------|----------|
| LCP | **FAIL** (lab 3.9-4.5 s, needs-improvement/poor band) | Render delay is 2.2-3.6 s of it on every page |
| INP | **AT RISK** (no field data; lab proxy TBT 1.4-3.4 s, far above the ~200 ms comfort zone) | Single 1.9 s long task from the React/Next runtime chunk while evaluating the three.js scene |
| CLS | **PASS** (0 on all five pages) | Dimensions/fill containers on images, font-display: swap, fixed-size video slots |

**LCP phase breakdown (Lighthouse):** TTFB 700-980 ms (throttled network; real server TTFB is 60-70 ms), Load Delay ~0, Load Time 0-1.3 s, **Render Delay 2,211-3,569 ms** -- the main thread, not the network, is the LCP bottleneck on every page.

**Page weight (initial load, compressed):** `/` 1,859 KB, `/sk` 2,137 KB, `/toolkit` 2,066 KB, `/chatkit` 2,067 KB, blog post 1,337 KB. Media (blackhole.webm) is 1.3-1.5 MB of that on `/` and `/sk`. JS is ~391-398 KB compressed (~1.3 MB+ uncompressed) and is nearly identical on every page, including legal pages and blog posts.

---

## Findings

### CRITICAL

#### C1. Three.js + react-three-fiber still ship on every page (~213 KB br, 54% of all JS)

The 2026-03 audit's #1 recommendation ("remove Three.js starfield from layout") was **not** implemented in the rebuild. Confirmed by downloading and fingerprinting the production chunks:

| Chunk | Compressed (br) | Uncompressed | Contents |
|-------|-----------------|--------------|----------|
| `b536a0f1-0bc70055616c4f4d.js` | 166.8 KB | 652 KB | three.js core (WebGLRenderer, PointsMaterial) |
| `7602-4e7992b955d47cef.js` | 45.8 KB | 134 KB | @react-three/fiber + glue |
| `3841-9ab29cbe541d529e.js` | 35.1 KB | 100 KB | framer-motion |
| `fd9d1056-...js` | 54.1 KB | 169 KB | react + react-dom |
| `2117-0f410736e75fc897.js` | 32.3 KB | 121 KB | Next/React runtime |

Both three.js chunks are referenced in the `<head>` of **all 14 pages** (they sit in the shared `(marketing)/layout` graph) -- blog articles and legal pages pay 213 KB compressed / ~786 KB uncompressed of WebGL code for a decorative starfield. Direct measured consequences:

- Script Evaluation 3.8-4.0 s of main-thread work per page (throttled)
- Longest task 1,756-1,899 ms attributed to the runtime chunk evaluating/mounting the scene
- LCP Render Delay 2.2-3.6 s (= the entire LCP problem; TTFB and asset loading are fine)
- Lighthouse flags ~40 KB of `b536a0f1` as unused even while the starfield runs

**Fix (in order of payoff):**
1. Replace the starfield with a CSS/canvas-2D particle effect (~2-3 KB). This alone should move every page from ~55 to ~80+ and cut LCP by 1.5-2 s.
2. If WebGL must stay: `next/dynamic(() => import('./star-background'), { ssr: false })` **plus** mount only after `requestIdleCallback`/first user interaction, so it never competes with hydration and LCP. Also render it only on desktop (`matchMedia('(min-width: 768px)')`) -- mobile gets the worst of the CPU cost and the least visual benefit.
3. Either way, verify with the bundle analyzer that three.js leaves the shared layout graph (it must be imported only inside the dynamically-imported component).

**Expected impact:** LCP -1.5 to -2 s, TBT -50 to -70%, ~213 KB less JS on every page.

#### C2. `blackhole.webm` (740 KB) downloads twice per page view on `/` and `/sk`

Two `<video>` elements (hero, rotated, and a second lower one) both reference `<source src="/videos/blackhole.webm">`. `preload="none"` is set, but `autoPlay` overrides it -- both elements begin fetching immediately and in parallel, so the browser cannot serve the second from cache. Lighthouse network log confirms: `/` fetched 740 KB + 570 KB, `/sk` fetched 740 KB + 740 KB of the same file. That is **1.3-1.5 MB of media** on a marketing page whose LCP is the video's poster, and it competes for bandwidth exactly during the LCP window on slow connections.

**Fix options:**
- Give the second (below-fold) video `autoplay` only via IntersectionObserver: keep `preload="none"`, no `autoplay` attribute in markup, call `.play()` when it scrolls into view. First video will then be in HTTP cache (asset is `immutable`, so the second use is free).
- Or drop the second video entirely and reuse the 47 KB poster with a CSS effect.
- Also consider re-encoding: 757 KB for a looping background is trimmable to ~300-400 KB (lower bitrate/resolution/duration; it sits behind content at reduced opacity).

**Expected impact:** -570 to -740 KB per view, faster video start, less bandwidth contention around LCP.

### HIGH

#### H1. LCP 3.9-4.5 s driven entirely by main-thread render delay

On every page the LCP phase profile is the same: real TTFB is excellent (60-70 ms edge-cached; the 700-980 ms in the table is simulated slow-4G), load delay ~0, but **render delay 2.2-3.6 s** while hydration and the WebGL scene evaluate. This is the downstream symptom of C1 plus global framer-motion. Fixing C1 is the fix; two additional cheap wins:

- Preload the LCP poster on `/` and `/sk`: `<link rel="preload" as="image" href="/videos/blackhole-poster.webp" fetchpriority="high">` (poster is currently discovered late via the `<video>` element).
- Audit which sections genuinely need `"use client"` + framer-motion; entrance animations on static sections can be CSS `@keyframes` + IntersectionObserver, letting chunk `3841` (100 KB unc.) leave the shared graph.

#### H2. Dead font preloaded on all 14 pages: Cedarville Cursive (22.6 KB)

`7ab6c71e1cbd6ab6-s.p.woff2` (Cedarville Cursive via next/font) is `<link rel="preload" as="font">` in the head of every page, but the generated `.cursive`/`__className_a58734` class **appears in zero rendered pages**. Font preloads are high priority and compete with critical CSS/JS inside the LCP window.

**Fix:** remove the Cedarville Cursive `next/font` instantiation from the layout (and the `--font-cedarville-cursive` plumbing in globals). If a page later needs it, instantiate it in that page's module only. Saves 22.6 KB of high-priority bytes everywhere.

### MEDIUM

#### M1. `/sk` always pays a late, non-preloaded 83.5 KB font (Inter latin-ext)

Slovak diacritics fall in the `latin-ext` unicode-range, so `/sk` pages always fetch `8e9860b6e62d6359-s.woff2` (83.5 KB -- the largest single font) *after* CSS parses, on top of the preloaded 48 KB latin subset. `display: swap` prevents invisible text and CLS measured 0, but Slovak visitors get a visible font swap and `/sk` carries 154 KB of fonts vs 70 KB on English pages.

**Fix:** in the SK layout/head add `<link rel="preload" as="font" type="font/woff2" crossorigin href="/_next/static/media/8e9860b6e62d6359-s.woff2">` (or set the next/font `subsets: ['latin', 'latin-ext']` so Next emits the preload on SK routes). Longer term, self-subset Inter to latin + Slovak codepoints only -- 83.5 KB is the full latin-ext block, most of it unused.

#### M2. `/toolkit` HTML is 303 KB because 146 KB of RSC flight data is inlined

The document is 296 KB raw (20-24 KB is typical for the other pages' payload class). Breakdown: 146 KB of `self.__next_f.push` flight data, of which a **single 124 KB block** serializes the entire skills-directory dataset as props to a client component -- on top of the same content already present as rendered HTML (33 KB text). Users download the directory content roughly twice, and the browser parses 146 KB of inline JS before hydration.

**Fix:** render the skill list/cards in a Server Component and pass only what the interactive part needs (e.g., ids + filter fields for the client-side filter, not full descriptions/content). Rule of thumb: any prop crossing the server-to-client boundary is shipped twice.

#### M3. `/blog` index over-serializes: 68 KB flight data for 2 KB of visible text

Same pattern as M2 at smaller scale -- the blog index inlines 68 KB of flight data (likely full post metadata/excerpts/JSON passed to a client list) while rendering only ~2 KB of text. The blog post page inlines 52 KB. Trim the props crossing to client components (cards need title, slug, date, excerpt -- not full content or full schema objects).

#### M4. TBT/INP headroom: 6 tasks >50 ms per page, worst 1.9 s

Even discounting local-CPU inflation, a single ~1.9 s task (scene mount + hydration) will translate to poor INP for any user who taps during load on a mid-range phone. Largely resolved by C1/H1; additionally keep hover/scroll handlers passive and avoid `getBoundingClientRect()` in mousemove paths that survived the rebuild.

### LOW

#### L1. Useless self-preconnect; missing hints where they'd help

Every page emits `<link rel="preconnect" href="https://mdntech.org">` + `dns-prefetch` to itself -- the connection is already open (that's how the HTML arrived). Remove; replace with the poster preload from H1 (and M1's font preload on `/sk`).

#### L2. Poster image can be ~half its size

`blackhole-poster.webp` is 47.5 KB and is the LCP image on `/` and `/sk`. A darker, blurred background frame compresses well -- re-export at lower quality or as AVIF; ~20 KB is achievable with no visible difference behind overlaid text.

#### L3. JSON-LD duplicated inside flight data

FAQ/ItemList JSON-LD blocks on `/toolkit` (and others) appear twice in the HTML: once as `application/ld+json` and again escaped inside the RSC flight stream (~12 KB duplicated on `/toolkit`). Byte waste only -- SEO parsing is unaffected. Rendering the `<script type="application/ld+json">` outside any client-component boundary avoids the duplication.

---

## What is working well (keep it this way)

- **CLS = 0 on all tested pages** -- images have explicit dimensions or fill containers, videos have fixed-height slots, fonts use `display: swap` with fallback metric adjustment.
- **TTFB 60-70 ms** -- all 14 pages are prerendered (`X-Vercel-Cache: PRERENDER/HIT`), served from Vercel edge (fra1) with Brotli.
- **Static assets** are `public, max-age=31536000, immutable`, correctly fingerprinted.
- **next/image** delivers AVIF (e.g., a 1080 px portfolio PNG arrives as 18.9 KB AVIF) with sensible `sizes` and lazy loading below the fold.
- **Zero third-party scripts.** The `/sk` chat widget is first-party, mounts client-side after hydration, injects no external blocking script, and caused no measured CLS. Its cost is inside the shared JS bundle (counted in C1/H1 numbers).
- Old audit's fixed items confirmed in production: video `poster` + valid `preload="none"`, no Google Fonts CSS `@import`, next/font self-hosting with preload of the primary subset.

---

## Prioritized plan (expected effect on mobile lab scores)

| # | Action | Effort | Expected impact |
|---|--------|--------|-----------------|
| 1 | C1: remove/defer three.js + R3F from the shared layout | M | LCP -1.5-2 s, TBT -50-70%, score ~55 -> ~80 |
| 2 | C2: IntersectionObserver-gate the second video (kill duplicate 740 KB) | S | -0.6-0.7 MB/view, faster hero video |
| 3 | H2: drop dead Cedarville Cursive preload | S | 22.6 KB high-priority bytes off every page |
| 4 | H1: preload hero poster with fetchpriority=high on `/` and `/sk` | S | LCP -100-300 ms on video-LCP pages |
| 5 | M1: preload/subset latin-ext Inter for `/sk` | S | No visible font swap for SK users |
| 6 | M2/M3: trim server-to-client props on `/toolkit` and `/blog` | M | /toolkit HTML 303 KB -> ~140 KB |
| 7 | L1/L2: hint cleanup, recompress poster | S | Marginal |

After items 1-4, re-run PSI (quota permitting, or with an API key) and check CrUX for field LCP/INP once traffic accumulates -- field data is the ground truth Google uses at the 75th percentile.

---

## Category score: 55/100

Rationale: CLS is perfect and the delivery layer (edge caching, TTFB, compression, image pipeline, no third parties) is near-ideal, but every tested page fails lab LCP (3.9-4.5 s) and carries an interactivity liability (TBT 1.4-3.4 s throttled) caused by one architectural decision -- a ~786 KB (unc.) WebGL decoration in the shared layout -- plus a duplicated 740 KB background video. Both are contained, well-understood fixes; implementing items 1-4 above should put the site in the 80-90 lab range with genuine "good" CWV headroom.
