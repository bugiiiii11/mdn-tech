# Full SEO Audit Report: mdntech.org

**Audit Date:** August 19, 2026 (Session 68; replaces the March 17, 2026 mdntech.com audit -- score then: 58/100)
**Domain:** https://mdntech.org (+ mdntech.sk 308 -> /sk)
**Business Type:** Hybrid -- B2B AI product marketing (ChatKit "AI chatbot for website", ToolKit "Claude Code skills"; EN, global) + Slovak web/CRM/AI-chatbot agency for SMEs (/sk, local)
**Framework:** Next.js 15 (App Router) on Vercel, edge-prerendered
**Pages audited:** 14 (full crawl = sitemap, no orphans, all HTTP 200)

Specialist reports: `technical-seo.md`, `content-quality.md`, `schema-audit.md`, `sitemap-audit.md`, `performance-audit.md`, `visual-audit.md`, screenshots in `screenshots/`.

---

## SEO Health Score: 76/100 (was 58 in March)

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Technical SEO | 81/100 | 25% | 20.25 |
| Content Quality & E-E-A-T | 74/100 | 25% | 18.50 |
| On-Page SEO | 80/100 | 20% | 16.00 |
| Schema / Structured Data | 78/100 | 10% | 7.80 |
| Performance (CWV) | 55/100 | 10% | 5.50 |
| Images | 70/100 | 5% | 3.50 |
| AI Search Readiness | 79/100 | 5% | 3.95 |
| **Total** | | **100%** | **76/100** |

On-Page is derived from the technical + content page-level checks (titles unique and keyword-aligned, meta descriptions on all 14 pages, single H1 sitewide, self-referential apex canonicals; deductions: SK legal pages inherit the English OG block, non-ISO `article:published_time`, weak blog linking). Images: alt coverage effectively 100% and AVIF via next/image, but the three blog hero images do not exist at all. AI Readiness: robots.txt explicitly allows 7 AI crawlers, full SSR content, FAQPage schema on money pages; blog staleness is the drag.

---

## Executive Summary

The rebuild fixed almost everything the March audit flagged: template remnants gone, one H1 per page, real internal linking, strong money pages (/chatkit 4,714 words, /toolkit 5,598 words, both rated category-leading), correct canonicals, single-hop 308s, CLS 0.00 measured. Two systemic problems remain, one old and one new:

1. **Performance is still the #1 item, unchanged since March.** Three.js + react-three-fiber ship on every page including blog and legal (~786 KB uncompressed, 54% of all JS), the hero H1 is server-rendered at `opacity:0` so LCP waits for hydration (3.9-4.5 s mobile lab), and `blackhole.webm` (740 KB) downloads twice per view on / and /sk. TTFB is 60-70 ms -- the entire LCP problem is client-side render delay.
2. **The Slovak surface undercuts itself technically.** All four /sk pages serve `<html lang="en">`, the legal EN/SK pairs have zero hreflang anywhere, SK legal pages carry English OG tags, and mdntech.sk deep paths 404 (redirect drops the /sk prefix). The copy is right; the signals around it are not.

### Top 5 Critical/High Issues

1. Blog post images are soft-404s -- `public/blog/` does not exist; BlogPosting `image` breaks Article rich results and posts ship zero og:image (Critical, schema)
2. Three.js on every page + hero at `opacity:0` -> LCP 3.9-4.5 s, TBT 1.4-3.4 s on mobile lab (Critical, performance; carried over from March unfixed)
3. `blackhole.webm` fetched twice in parallel on / and /sk -- 1.3-1.5 MB media per load (Critical, performance)
4. `<html lang="en">` hardcoded for all Slovak pages (`app/layout.tsx:77`) (High, technical + content)
5. hreflang missing on both legal pairs + sitemap lastmod stale on 11/14 URLs (High, technical + sitemap)

### Top 5 Quick Wins

1. Fix `lang` per route (one-line root cause, needs a per-locale layout split or dynamic attr)
2. Add bidirectional hreflang for the legal pairs -- `alternates.languages` in the existing server layouts + `app/sitemap.ts` entries (snippets ready in `sitemap-audit.md`)
3. Correct sitemap lastmod (11/14 stale; add `updated` field to `data/blog-posts.ts`)
4. Remove the dead Cedarville Cursive font preload (22.6 KB high-priority on all 14 pages, used nowhere)
5. Remove BreadcrumbList from the 3 blog posts or render the visible trail (Royal Stroje is the pattern to copy)

---

## Handoff-Specific Verdicts (S67 open questions)

| Check | Verdict |
|-------|---------|
| S58 breadcrumb-schema removal acceptable? | PASS for the removal itself; Royal Stroje now has visible trail + matching BreadcrumbList (the correct pattern). BUT all 3 blog posts still emit BreadcrumbList with no visible trail -- they were missed by the removal. Fix either direction. |
| S60 `installUrl`/`availability` omissions | ToolKit: fixed, now present. ChatKit: still omitted and that is CORRECT while the portal is gated -- do not add until APP_LIVE. Real rich-result blocker on both is missing `aggregateRating`/`review`; do not fabricate -- collect real reviews post-launch. |
| /privacy + /terms "cannot export metadata" (S66 note) | OUTDATED -- both have full title/description/canonical via server `layout.tsx` wrappers (`app/(marketing)/privacy/layout.tsx` etc.). No page split needed; hreflang goes in those same layouts. |
| Legal pairs hreflang | CONFIRMED missing everywhere (in-page count is 0 on all 14 pages; sitemap covers only / <-> /sk). |
| /sk H1 + "Co robime" H2 re-measure | CONFIRMED correct as rewritten in S67 -- title, H1 and H2 carry the head keywords; content audit recommends NO changes. |
| mdntech.com 301 (task 15) | NOT OURS -- mdntech.com is a third party forwarding to mdntech.ca. No 301 possible; drop the task. |
| /sk mobile section order (owner review pending) | Captured in `screenshots/sk_mobile_fullpage.png`: Hero -> Pre koho -> Sluzby -> CRM -> Preco my -> Realizacie -> Kto sme -> Ako to funguje -> FAQ -> Kontakt; renders cleanly. |

---

## Category Summaries

### Technical SEO -- 81/100 (0 C / 4 H / 4 M / 5 L)
Redirect hygiene passes everywhere (single-hop 308s, queries preserved, www and .sk normalize correctly). Canonicals and trailing-slash handling perfect. Fails: legal-pair hreflang, `lang="en"` on Slovak pages, hero SSR'd at `opacity:0` gating LCP, three.js sitewide. Medium: mdntech.sk deep paths 404 (`next.config.js` catch-all maps to the EN namespace instead of `/sk/:path*`), SK legal pages inherit English og:title/og:url/og:locale, non-ISO `article:published_time`. Details: `technical-seo.md`.

### Content Quality -- 74/100 (0 C / 3 H / 5 M / 5 L; E-E-A-T 66, AI citation 78)
Money pages are the strength. High findings: /sk pages declared English (counted once, fixed under technical), /about still carries pre-honesty-pass numbers ("50+ smart contracts", "100+ Web3 partnerships", "30+ years") contradicting the standard set on /sk -- OWNER DECISION: verify or remove; blog frozen since March 2026 with time-stamped claims and a stale "coming soon" badge. Medium: no human authorship on blog (Organization-only bylines; Martin never connected), zero outbound citations in post bodies vs /toolkit's 23. Details: `content-quality.md`.

### Schema -- 78/100 (1 C / 2 H / 5 M / 5 L)
43 JSON-LD blocks, all parse, JSON-LD only, Organization graph byte-identical across pages with verified logo. Critical: blog image soft-404s. High: blog BreadcrumbList without visible trail; /sk ProfessionalService lacks `address` (ineligible for LocalBusiness rich results). Medium: `dateModified` hardcoded equal to `datePublished` with fragile locale-dependent parsing that silently stamps today's date on failure (`app/(marketing)/blog/[slug]/page.tsx:91-104`). Details: `schema-audit.md`.

### Sitemap -- 64/100 (0 C / 2 H / 1 M / 2 L)
Valid XML, perfect coverage, registration-ready. High: lastmod stale on 11/14 URLs (home/about predate the rebuild; /terms predates its own Railway->Supabase edit); legal-pair hreflang absent. Medium: blog lastmod structurally wired to publish date -- needs `updated?: string` in `data/blog-posts.ts`. Corrected `app/sitemap.ts` included in `sitemap-audit.md`.

### Performance -- 55/100 (2 C / 2 H / 4 M / 3 L)
Local Lighthouse 12.8.2 mobile (PSI keyless quota exhausted; no CrUX field data): / 57, /sk 51, /toolkit 56, /chatkit 57, blog 61. LCP 3.9-4.5 s (fail), TBT 1.4-3.4 s (INP risk, locally inflated), CLS 0 (pass). Root cause is singular: hydration blocks paint. Also: dead font preload, /toolkit ships its entire skills directory twice (124 KB RSC flight re-serializing rendered content -> 303 KB HTML). Strengths: 60-70 ms TTFB, edge cache, AVIF, zero third-party scripts. Details: `performance-audit.md`.

### Visual / Mobile -- 85/100 (0 C / 0 H / 3 M / 5 L; 13 screenshots)
H1 + value prop + CTA above the fold on all key pages at both viewports; zero horizontal overflow; measured CLS 0.00; alt coverage ~100%. Medium: /sk chat bubble overlaps the footer registration line at 390px (`sk_mobile_footer_widget.png`); dead gray "Coming soon" button stacks ABOVE the live primary CTA in mobile heroes on / and /chatkit; sub-24px tap targets (footer 20px, /toolkit copy buttons/source links -- 59 small targets). Low: /sk H1 hard break wraps to 4 lines at 390px ("chatboty" isolated). Details: `visual-audit.md`.

---

## Do-Not-Do Guardrails (decided, do not re-open)

- Do NOT rewrite the /sk H1 or "Co robime" H2 -- keyword-correct as of S67.
- Do NOT add claims, counts or rankings the S67 honesty pass removed (incl. Royal Stroje rankings).
- Do NOT fabricate `aggregateRating`/`review` schema.
- Do NOT add `installUrl` to ChatKit while the portal is gated.
- Do NOT re-add sitewide BreadcrumbList schema without visible trails.

Prioritized fixes with effort estimates: see `ACTION-PLAN.md`.
