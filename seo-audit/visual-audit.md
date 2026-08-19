# Visual / Above-the-Fold / Mobile Rendering Audit — mdntech.org

Date: 2026-08-19
Method: Playwright 1.59.1 (repo node_modules, Chromium headless) + DOM checks on 14 pre-fetched HTML pages.

## Method note

Screenshots WERE captured. Playwright and cached Chromium were available in the repo, so no installs were needed. Captures live in `seo-audit/screenshots/`:

| File | What it is |
|---|---|
| `home_desktop_1920x1080.png` / `home_mobile_390x844.png` | / above the fold |
| `sk_desktop_1920x1080.png` / `sk_mobile_390x844.png` | /sk above the fold |
| `chatkit_desktop_1920x1080.png` / `chatkit_mobile_390x844.png` | /chatkit above the fold |
| `toolkit_desktop_1920x1080.png` / `toolkit_mobile_390x844.png` | /toolkit above the fold |
| `sk-referencie-royal-stroje_desktop_1920x1080.png` / `..._mobile_390x844.png` | case study above the fold |
| `sk_mobile_fullpage.png` | full-page /sk mobile (780x33682 px, DSF 2) for section-order review |
| `sk_mobile_contact_widget.png` | /sk mobile scrolled to FAQ/contact, widget bubble visible |
| `sk_mobile_footer_widget.png` | /sk mobile scrolled to footer, widget bubble visible |
| `sk_mobile_menu_open.png` | /sk mobile with hamburger menu open |

Capture caveat worth knowing: the first full-page capture of /sk came out black below the first viewport because sections animate in on scroll (whileInView, initial opacity 0). The committed `sk_mobile_fullpage.png` was re-captured after programmatically scrolling through the page so every section is rendered. Any future screenshot tooling for this site needs the same scroll-through step.

In addition to screenshots, in-page metrics were collected per page/viewport (scrollWidth vs viewport, H1/CTA bounding boxes, fixed elements, tap-target sizes, computed font sizes, buffered layout-shift entries via PerformanceObserver).

## Above-the-fold assessment (per key page)

Fold = 844 CSS px at 390px wide (mobile), 1080 px at 1920 (desktop).

| Page | H1 above fold (mobile) | Value prop above fold | CTA above fold (mobile) | Desktop |
|---|---|---|---|---|
| / | Yes ("Grow Your Business with AI.", 36px) | Yes | Yes — "Explore the Tools" bottom edge at 702px | All visible |
| /sk | Yes (36px, 4 lines) | Yes | Yes — BOTH CTAs ("Nezáväzná konzultácia zdarma" + "Pozrite realizácie") fully in fold | All visible |
| /chatkit | Yes (36px) | Yes | Yes — "See what it costs" bottom at 735px | All visible |
| /toolkit | Yes (36px) | Yes | Yes — both CTAs in fold | All visible |
| /sk/referencie/royal-stroje | Yes (30px) + breadcrumb | Yes | Yes — both CTAs in fold, live-site screenshot peeks above fold | All visible |

This is a genuinely strong above-the-fold story: on every key page at 390x844 the visitor sees H1 + value prop + at least one primary CTA with no scrolling. Text legibility over the dark "Event Horizon" background is good everywhere tested — the headline block sits below the bright lensing arc, so the gradient headline and near-white body copy sit on near-black background with strong contrast.

One conversion nit: on / and /chatkit the disabled gray "Coming soon" ghost button is stacked ABOVE the live primary CTA on mobile, so the first button a thumb reaches is dead (see Findings, Medium).

## Mobile findings

- **No horizontal overflow on any tested page/viewport.** `scrollWidth == 390` everywhere; no offending wide elements.
- **CLS: 0.00 measured on all 10 page/viewport combos** (buffered layout-shift observer through networkidle + 3.5s). No visible layout jumps on load; hero background is a fixed, pointer-events-none layer and the 65px fixed navbar is present from first paint.
- **Navigation**: hamburger opens correctly on /sk; menu items are 342x48 px — proper tap targets. The hamburger button itself is 40x40 (slightly under the 44-48px recommendation).
- **/sk chat widget bubble** (`#mdn-chat-widget`, shadow DOM, 50x50 button, `z-index: 2147483647`, bottom-right with ~14px right / ~70px bottom offset):
  - Does NOT overlap the hero CTAs at 390px (CTAs end at x~294, bubble starts at x~326; vertically CTA bottom 703 vs bubble top 724).
  - DOES overlap the footer company-registration line at 390px — "M.D.N Tech FZE · Al Shmookh Business Center, One UAQ ... License ..." runs under the bubble; the license number is obscured when scrolled to the bottom (`sk_mobile_footer_widget.png`).
  - Rides over the right edge of full-width body copy while scrolling (e.g. the "Expandujte svoj biznis online" paragraph, `sk_mobile_contact_widget.png`) and clips the corner of the Royal Stroje screenshot on the case-study page. Cosmetic, standard widget behavior, but visible.
  - Bubble tap target 50x50 — fine.
- **/sk section order (owner review item)**: confirmed via DOM offsets and the full-page capture — Hero -> Pre koho to je (y 944) -> Služby (1798) -> CRM (3714) -> **Prečo my (6370) -> Realizácie (8332)** -> Kto sme (10660) -> Ako to funguje (11583) -> FAQ (12948) -> Kontakt (14045) -> footer. The Prečo my -> Realizácie transition reads well on mobile: six benefit cards stack cleanly, then the Realizácie heading + Royal Stroje card follow. Nothing broken; total page height 16,841 CSS px (~20 screens) is long but each section is skimmable.
- **/sk H1 wrap at 390px**: the hard line break in "Web, CRM a AI chatboty\npre rast vášho biznisu." produces a 4-line wrap with "chatboty" isolated on line 2. Cosmetic.
- **Tap targets**: footer link lists are 20px tall on ~30px line spacing (below the 24px WCAG 2.5.8 minimum, well below the 48px comfort target); breadcrumb links on the case study are 16px tall; /toolkit mobile has 59 sub-40px targets (copy-to-clipboard buttons 46x24, "Source ↗" links 53x16).
- **Font sizes**: body base 16px everywhere (good). Sub-12px text is limited to 10px "SOON"/"IN DEVELOPMENT" badges and an 11px "Powered by M.D.N Tech" label in the ChatKit demo — decorative, but at the edge of legibility.

## Viewport meta + alt-text coverage (DOM checks, all 14 pages)

`<meta name="viewport" content="width=device-width, initial-scale=1"/>` present on **all 14 pages**. Exactly one `<h1>` per page. Fixed-position elements per page are the same two everywhere (hero background layer, 65px navbar) — nothing that covers content on mobile except the /sk chat widget noted above.

| Page | Images | With alt | Empty alt | Missing alt |
|---|---|---|---|---|
| / | 2 | 2 | 0 | 0 |
| /sk | 8 | 8 | 0 | 0 |
| /chatkit | 2 | 2 | 0 | 0 |
| /toolkit | 2 | 2 | 0 | 0 |
| /about | 16 | 15 | 1 (`/world-map.svg`) | 0 |
| /blog | 2 | 2 | 0 | 0 |
| /blog/agentic-ai-systems-guide | 2 | 2 | 0 | 0 |
| /blog/claude-code-complete-guide | 2 | 2 | 0 | 0 |
| /blog/smart-contracts-complete-guide | 2 | 2 | 0 | 0 |
| /privacy | 2 | 2 | 0 | 0 |
| /terms | 2 | 2 | 0 | 0 |
| /sk/obchodne-podmienky | 2 | 2 | 0 | 0 |
| /sk/ochrana-osobnych-udajov | 2 | 2 | 0 | 0 |
| /sk/referencie/royal-stroje | 3 | 3 | 0 | 0 |

Alt coverage is effectively 100%. The single empty alt is the decorative world map on /about — empty alt is the correct treatment for decorative images, so no action needed.

## Findings

### Critical

None.

### High

None.

### Medium

1. **/sk chat widget bubble obscures the company registration/license line in the footer at 390px.** The fixed 50x50 bubble (max z-index) sits over the tail of "M.D.N Tech FZE · Al Shmookh Business Center ... License ..." when scrolled to the bottom. Fix: add right-side padding-bottom clearance to the footer legal block on mobile (e.g. `pr-16` on that paragraph below 480px), or shift the bubble's bottom offset.
2. **Small tap targets below WCAG 2.5.8 (24px) on mobile across footer, breadcrumbs, and /toolkit utility controls.** Footer links 20px tall, case-study breadcrumbs 16px, /toolkit "Source" links 53x16 and copy buttons 46x24 (59 sub-40px targets on that page). Fix: add `py-2`-style padding to footer/breadcrumb links and enlarge copy/source hit areas to >= 40px.
3. **Dead "Coming soon" ghost button is the FIRST button in the mobile hero on / and /chatkit**, stacked above the live primary CTA, and its gray-on-dark label is low-contrast. First tap in the hero does nothing. Fix: swap stacking order on mobile (live CTA first) or restyle "Coming soon" as a non-interactive badge.

### Low

4. **/sk H1 hard line break wraps awkwardly at 390px** ("chatboty" alone on line 2 of 4). Make the `<br>` desktop-only (`hidden sm:inline`) or reword.
5. **10px badge text ("SOON", "IN DEVELOPMENT") and 11px "Powered by M.D.N Tech"** are below the 12px legibility floor. Bump to 11-12px minimum.
6. **Hamburger button is 40x40**, slightly under the 44-48px recommendation (menu items themselves are 48px — good).
7. **Scroll-reveal animations keep below-fold sections at opacity 0 until scrolled into view.** Users are unaffected and text is in the DOM (indexable), but any headless capture/preview without scrolling renders ~19 of 20 screens black, and JS-off visitors see nothing below the hero. Consider a reduced-motion / no-JS fallback that leaves content visible.
8. **Widget bubble clips the corner of the Royal Stroje screenshot** on the case-study page at 390px. Cosmetic only.

### Positives worth keeping

- H1 + value prop + CTA above the fold on all 5 key pages at 390x844 and 1920x1080.
- Zero horizontal overflow, zero measured CLS, viewport meta on all 14 pages, one H1 per page.
- 100% effective alt-text coverage (43/44 with alt, 1 correctly-empty decorative).
- 16px body text; strong contrast over the Event Horizon background on every tested page.
- Mobile menu items 48px tall; /sk hero shows both primary and secondary CTA without scrolling.
- /sk resequenced order (Realizácie below Prečo my) renders cleanly on mobile — see `sk_mobile_fullpage.png`.

## Category score

**Visual / Mobile Rendering: 85 / 100**

Deductions: widget-over-footer overlap (-4), sub-minimum tap targets across footer/breadcrumbs/toolkit controls (-6), dead-button-first hero order on mobile (-3), minor legibility and wrap issues (-2).
