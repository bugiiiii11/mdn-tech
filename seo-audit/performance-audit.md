# Performance Audit: mdntech.com

**Date:** 2026-03-17
**Framework:** Next.js 14.2.15 (React 18)
**Hosting:** Likely Vercel (based on Next.js setup)

---

## Executive Summary

The site carries an extremely heavy JavaScript footprint due to Three.js, React Three Fiber, Framer Motion, and Swiper loaded on the homepage. Multiple autoplay videos, a persistent WebGL canvas, and excessive Framer Motion animations across every section compound the problem. The homepage is essentially a single-page application with 8 above-the-fold sections, all client-rendered with `"use client"` directives.

**Estimated Performance Score:** 25-40/100 (Lighthouse)
**Core Web Vitals Prediction:** FAILING on all three metrics

| Metric | Predicted | Threshold | Status |
|--------|-----------|-----------|--------|
| LCP | 5-8s | <=2.5s | POOR |
| INP | 300-600ms | <=200ms | POOR |
| CLS | 0.15-0.35 | <=0.1 | POOR |

---

## CRITICAL: JavaScript Bundle Weight

### Heavy Dependencies (estimated uncompressed sizes)

| Package | Estimated Size (minified) | Used Where |
|---------|---------------------------|------------|
| three | ~650 KB | star-background.tsx (layout - every page) |
| @react-three/fiber | ~180 KB | star-background.tsx (layout - every page) |
| @react-three/drei | ~300 KB (tree-shakeable) | star-background.tsx (layout - every page) |
| framer-motion | ~140 KB | Every single component |
| swiper | ~140 KB | projects.tsx (currently commented out, but imported) |
| react-icons | Variable (~20-40 KB) | about-us, team, contact-us, footer, navbar |
| @emailjs/browser | ~15 KB | contact-us.tsx |
| @heroicons/react | ~25 KB | contact-us.tsx |
| maath | ~15 KB | star-background.tsx |

**Total estimated JS payload: ~1.2-1.5 MB+ (minified, before gzip)**

This is catastrophic for performance. The recommended total JS budget for a performant site is under 300 KB compressed.

### Why This Matters

- Three.js alone (~650 KB) is loaded on EVERY page because `StarsCanvas` is in `layout.tsx`
- The WebGL context initializes immediately on page load, competing with LCP rendering
- Framer Motion is imported in every `"use client"` component (11 components total)
- All components use `"use client"` -- nothing is server-rendered beyond the initial layout shell

---

## Issue #1: Three.js WebGL Canvas in Layout (CRITICAL - LCP, INP)

**File:** `components/main/star-background.tsx`
**Location:** `app/layout.tsx` line 95

```tsx
<StarsCanvas />  // Loaded in root layout = every page
```

The `StarsCanvas` component renders a full-screen Three.js `<Canvas>` with 1000 animated particles using `useFrame()` which runs every animation frame. This:

- Blocks the main thread during initialization (~200-500ms)
- Creates a persistent WebGL context consuming GPU resources
- Runs `useFrame` continuously, creating constant main thread work
- Competes directly with LCP element rendering
- Loads three.js, @react-three/fiber, @react-three/drei, and maath on every page

**Impact:** +2-4 seconds to LCP, +100-300ms to INP
**Fix:** Replace with a CSS-only starfield animation, or lazy-load with `requestIdleCallback` after LCP fires. If WebGL is essential, defer initialization until after the page is interactive.

---

## Issue #2: Multiple Autoplay Videos (CRITICAL - LCP, CLS)

**Files:**
- `components/main/hero.tsx` -- `blackhole.webm` (hero background)
- `components/main/encryption.tsx` -- `encryption-bg.webm`
- `components/main/skills.tsx` -- `skills-bg.webm`
- `components/main/footer.tsx` -- `blackhole.webm` (second instance)

Four `<video autoPlay>` elements load simultaneously. Key problems:

1. **Hero video has no poster attribute** -- shows nothing until video loads, delaying perceived LCP
2. **No preload strategy** -- `preload="false"` is not a valid value (should be `preload="none"`)
3. **`blackhole.webm` loads twice** -- hero and footer use the same video file
4. **No lazy loading on below-fold videos** -- encryption-bg and skills-bg load immediately
5. **Videos lack width/height attributes** -- causes layout shifts as they load
6. **Video format** -- only WebM provided, no MP4 fallback for Safari compatibility

**Impact:** +1-3 seconds to LCP, +0.1-0.2 CLS
**Fix:**
- Add `poster` attribute to hero video with a compressed JPEG/WebP still frame
- Change below-fold videos to `preload="none"` (valid value) and use Intersection Observer to trigger playback
- Set explicit dimensions on all video elements
- Add MP4 fallback for Safari
- Consider replacing decorative background videos with CSS gradients or lightweight animations

---

## Issue #3: Every Component is Client-Rendered (HIGH - LCP)

Every component in the project uses `"use client"`:

- `hero-content.tsx` -- "use client"
- `about-us.tsx` -- "use client"
- `skills.tsx` -- "use client"
- `encryption.tsx` -- "use client"
- `projects.tsx` -- "use client"
- `process.tsx` -- "use client"
- `team.tsx` -- "use client"
- `contact-us.tsx` -- "use client"
- `navbar.tsx` -- "use client"
- `footer.tsx` -- "use client"
- `star-background.tsx` -- "use client"

This means Next.js cannot server-render any meaningful content. The HTML sent to the browser is essentially an empty shell, and all content must wait for JS to download, parse, and execute.

**Impact:** +2-4 seconds to LCP on slow connections
**Fix:**
- Convert static sections (AboutUs, Skills description, Process, Team bios, Encryption content) to Server Components
- Extract only the interactive parts (animations, hover effects) into small client component wrappers
- The text content of most sections could render as pure HTML from the server

---

## Issue #4: Excessive Framer Motion Animations (HIGH - INP, CLS)

Nearly every element on the page has Framer Motion animations:

- **whileInView animations** on every section heading and card
- **Mouse-tracking 3D perspective transforms** on every card (about-us, projects, process, team) using `useMotionValue`, `useSpring`, and `useTransform`
- **Continuous hover animations**: floating particles (6 per card), scanning line effects, pulsing border glows, shine sweep effects
- **Animation on every mousemove event** with `getBoundingClientRect()` calls

The `ServiceCard` in `skills.tsx` alone has:
- 4 animated border draw effects
- 4 animated corner brackets
- A scanning line animation (infinite loop)
- A pulsing border glow (infinite loop)
- 4 corner glow effects with box-shadow animations (infinite loops)
- 6 floating particle animations
- A mouse-following glow effect
- A shine sweep effect

This pattern is repeated across `about-us.tsx`, `projects.tsx`, `process.tsx`, and `team.tsx`.

**Impact:** INP 300-600ms on mid-range devices, continuous main thread blocking
**Fix:**
- Replace Framer Motion whileInView with CSS `@keyframes` + `IntersectionObserver` (native)
- Use CSS transforms instead of JS-driven mouse tracking
- Remove or drastically reduce particle effects and continuous animations
- Use `will-change: transform` sparingly (currently applied via `.transform-gpu` to many elements)
- Consider `content-visibility: auto` for below-fold sections

---

## Issue #5: Dual Font Loading Strategy (MEDIUM - LCP, CLS)

**Files:** `app/layout.tsx`, `app/globals.css`

Two font loading mechanisms are used simultaneously:

1. `next/font/google` for Inter (line 2 of layout.tsx) -- optimal, uses font-display: swap
2. `@import url("https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap")` in globals.css line 1 -- render-blocking CSS import

The `@import` in CSS is render-blocking. The browser must:
1. Download globals.css
2. Discover the @import
3. Make a new request to fonts.googleapis.com
4. Download the font CSS
5. Download the font file

This creates a 4-request waterfall chain before the page can render.

**Impact:** +200-500ms to LCP, potential FOUT causing CLS
**Fix:**
- Use `next/font/google` for Cedarville Cursive as well (already used for Inter)
- Remove the `@import` from globals.css entirely
- If Cedarville Cursive is not actually used visibly (only `.cursive` class), remove it entirely

---

## Issue #6: No Resource Hints or Preloading (MEDIUM - LCP)

**File:** `app/layout.tsx`

The layout has no `<link rel="preload">`, `<link rel="preconnect">`, or `<link rel="dns-prefetch">` hints in the `<head>`.

Missing preconnections:
- `fonts.googleapis.com` (for the CSS @import)
- `fonts.gstatic.com` (for font files)
- EmailJS domain (loaded in contact form)

Missing preloads:
- Hero video (`/videos/blackhole.webm`) -- the LCP element background
- Logo image (`/logo.png`) -- above the fold in navbar

**Fix:**
Add to layout.tsx `<head>`:
```tsx
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
<link rel="preload" as="video" href="/videos/blackhole.webm" type="video/webm" />
<link rel="preload" as="image" href="/logo.png" />
```

---

## Issue #7: Navbar Uses backdrop-blur (MEDIUM - INP)

**File:** `components/main/navbar.tsx` line 12

```tsx
className="... backdrop-blur-md z-50"
```

`backdrop-filter: blur()` is one of the most expensive CSS properties. Applied to a fixed navbar, it forces the GPU to re-composite every frame during scrolling. This is especially harmful because the Three.js canvas is animating behind it.

Also present in:
- Mobile menu backdrop (line 64): `backdrop-blur-sm`
- Mobile menu (line 71): `backdrop-blur-lg`
- Multiple card components: `backdrop-blur-sm`

**Impact:** Janky scrolling, +50-150ms to INP on mid-range devices
**Fix:** Remove `backdrop-blur` from the fixed navbar. Use a solid or semi-transparent background instead. Keep blur only for modal overlays that appear briefly.

---

## Issue #8: Images Without Optimization (MEDIUM - LCP, CLS)

### Logo in Navbar
```tsx
<Image src="/logo.png" alt="M.D.N Tech" width={32} height={32} />
```
PNG format for a small logo. Should be SVG or WebP.

### Team Member Images
```tsx
<Image src={member.image} width={128} height={128} />
```
Team photos at 128x128 -- format unknown but likely PNG/JPG. Should use Next.js Image optimization with WebP/AVIF output.

### World Map SVG
```tsx
<Image src="/world-map.svg" width={1200} height={800} />
```
Large SVG loaded for background decoration. Should be lazy loaded (it has `priority={false}` which is good).

### Service Icons
Multiple SVG icons loaded for each service card (6 icons) and tech result cards (6 icons).

**Fix:**
- Convert logo to SVG
- Ensure team photos use Next.js Image component with proper sizing (already using `<Image>`)
- Verify `next.config.js` has image optimization enabled (currently no image config present)
- Add explicit `sizes` prop to responsive images for better srcset generation

---

## Issue #9: next.config.js Missing Performance Optimizations (MEDIUM)

**File:** `next.config.js`

The current config only sets security headers. Missing optimizations:

```js
// Missing configurations:
module.exports = {
  // No image optimization config
  // No webpack bundle analysis
  // No experimental optimizations
  // No output: 'standalone' for smaller deployments
  // No compiler options for removing console.log in production
  // No modularizeImports for react-icons (tree-shaking)
}
```

**Fix:** Add to next.config.js:
```js
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  modularizeImports: {
    'react-icons/fa': { transform: 'react-icons/fa/{{member}}' },
    'react-icons/rx': { transform: 'react-icons/rx/{{member}}' },
  },
  // ... existing headers config
};
```

---

## Issue #10: Swiper CSS Imported Globally (LOW)

**File:** `components/main/projects.tsx` lines 13-14

```tsx
import 'swiper/css';
import 'swiper/css/pagination';
```

Swiper CSS and JS are imported even though the Swiper carousel section is currently commented out (lines 376-422). This dead code still gets bundled.

**Impact:** ~30-50 KB of unnecessary CSS/JS
**Fix:** Remove Swiper imports entirely since the carousel is commented out, or dynamically import if re-enabled.

---

## Issue #11: Invalid Video Preload Value (LOW)

**Files:** `encryption.tsx` line 19, `skills.tsx` line 349

```tsx
preload="false"  // Invalid -- should be preload="none"
```

The valid values for `preload` are: `"none"`, `"metadata"`, `"auto"`, or `""`. The string `"false"` is not a valid value and browsers will treat it as the default (`"auto"` or browser-dependent), meaning videos will preload despite the intent to prevent it.

**Fix:** Change to `preload="none"` in both files.

---

## Issue #12: EmailJS Loaded Eagerly (LOW - Bundle Size)

**File:** `components/main/contact-us.tsx`

```tsx
import emailjs from "@emailjs/browser";
```

EmailJS is statically imported at the top of the contact form component. Since ContactUs is near the bottom of the page, this could be dynamically imported.

**Fix:**
```tsx
const handleSubmit = async (e: React.FormEvent) => {
  const emailjs = (await import("@emailjs/browser")).default;
  // ... rest of handler
};
```

---

## Prioritized Recommendations

### P0 -- Critical (Expected LCP improvement: 3-5 seconds)

1. **Remove Three.js starfield from layout** -- Replace with CSS-only animation or load lazily after LCP
2. **Defer below-fold videos** -- Use `preload="none"` and Intersection Observer for playback
3. **Add poster image to hero video** -- Provide instant visual content before video loads
4. **Convert static sections to Server Components** -- Render HTML on server for AboutUs, Skills, Process, Team, Encryption

### P1 -- High (Expected INP improvement: 100-300ms)

5. **Replace Framer Motion whileInView with CSS animations** -- Reduce JS on main thread
6. **Remove mouse-tracking 3D effects** or limit to desktop only with `matchMedia`
7. **Remove backdrop-blur from fixed navbar** -- Use solid background
8. **Reduce particle/glow animation count** -- Maximum 2-3 per card, not 10+

### P2 -- Medium (Expected improvement: 200-500ms LCP, 0.05-0.1 CLS)

9. **Fix font loading** -- Move Cedarville Cursive to `next/font/google`, remove CSS @import
10. **Add resource hints** -- Preconnect to font origins, preload hero assets
11. **Add image optimization config** to next.config.js (AVIF/WebP formats)
12. **Fix invalid preload="false"** on video elements

### P3 -- Low (Bundle size reduction)

13. **Remove Swiper imports** -- Carousel code is commented out
14. **Dynamic import EmailJS** -- Only load when form is submitted
15. **Add modularizeImports** for react-icons tree-shaking
16. **Remove console.log in production** via compiler option

---

## Estimated Impact of All Fixes

| Metric | Current (est.) | After P0 | After P0+P1 | After All |
|--------|---------------|----------|-------------|-----------|
| LCP | 5-8s | 2.5-4s | 2-3s | 1.5-2.5s |
| INP | 300-600ms | 250-500ms | 100-200ms | 80-150ms |
| CLS | 0.15-0.35 | 0.05-0.15 | 0.03-0.1 | <0.05 |
| JS Bundle | ~1.2-1.5 MB | ~500-700 KB | ~300-500 KB | ~200-350 KB |
| Lighthouse | 25-40 | 50-65 | 70-80 | 85-95 |

---

## Architecture Recommendation

The site would benefit significantly from a fundamental architectural shift:

1. **Server Components by default** -- Only wrap interactive elements (hover effects, forms, video controls) in `"use client"` boundaries
2. **Progressive enhancement** -- Render all text content as server HTML, then hydrate interactive features
3. **Remove Three.js entirely** -- A CSS starfield achieves 90% of the visual effect at 1% of the cost
4. **Use CSS animations** for entrance effects instead of Framer Motion where possible
5. **Consider Astro or partial hydration** if most pages are content-heavy with minimal interactivity

---

## Files Analyzed

- `app/layout.tsx` -- Root layout with Three.js canvas
- `app/page.tsx` -- Homepage with 8 sections
- `app/globals.css` -- Global styles with render-blocking font import
- `next.config.js` -- Minimal config, missing optimizations
- `package.json` -- Heavy dependency list
- `config/index.ts` -- Site metadata configuration
- `components/main/star-background.tsx` -- Three.js WebGL starfield
- `components/main/hero.tsx` -- Hero with autoplay video
- `components/main/hero-content.tsx` -- Framer Motion hero content
- `components/main/navbar.tsx` -- Fixed navbar with backdrop-blur
- `components/main/about-us.tsx` -- Client component with complex animations
- `components/main/skills.tsx` -- Client component with video + animated cards
- `components/main/encryption.tsx` -- Client component with video background
- `components/main/process.tsx` -- Client component with animated timeline
- `components/main/projects.tsx` -- Client component with Swiper imports
- `components/main/team.tsx` -- Client component with team cards
- `components/main/contact-us.tsx` -- Client component with EmailJS
- `components/main/footer.tsx` -- Client component with video
