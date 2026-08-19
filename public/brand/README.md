# MDN Tech brand assets

Final mark (2026-08-17): the **original** MDN Tech logo, vectorized and cleaned up.
The 2026-08-16 black-hole redesign was rejected — the brief changed from "new shape"
to "adjust the existing one". Two edits were applied to the original mark:

1. **Thin inner circle removed.** It was not one circle but two arcs on different radii
   (R~192 free-standing, R~200 fused into the main mass, shared center) plus two stubs
   where the circle crossed the diagonal. All removed.
2. **Mirrored left to right.** The mark is flipped horizontally against the original, so the
   diagonal now leans the other way. Hood stays up; a top-bottom flip was explored and rejected.

The mark was never a vector before this — it existed only as `public/logo.png` /
`logo2.png`. It was redrawn with marching squares on the alpha channel (sub-pixel
interpolation) plus a Schneider least-squares Bezier fit: 78 curves, 98.5% overlap
with the source PNG, deviation under 1 px.

## Use these

| File | Use |
|---|---|
| `logo-final.svg` | Primary, `currentColor` — navbar, footer, anywhere inline (inherits CSS color) |
| `logo-final-gradient.svg` | Purple gradient — dark backgrounds (hero, OG images, LinkedIn logo/banners) |
| `logo-final-black.svg` | Solid black, transparent background — light grounds, print, partner logo sheets |
| `logo-final-white.svg` | Solid white, transparent background — dark grounds, chat widget bubble |
| `logo-final-black-on-white.svg` | Black mark on white plate — when a background cannot be guaranteed |
| `logo-final-white-on-black.svg` | White mark on `#0B0A14` plate — same, dark version |

Gradient: `#C4B5FD -> #8B5CF6 -> #6D28D9`.
Aspect ratio ~1.7:1 (wide). In square containers (LinkedIn 300x300, favicons)
scale the mark to ~75-80% of canvas width and center vertically.

## PNG exports

`png/` holds Chromium-rendered exports of the SVGs above (2026-08-17). SVG stays the
source of truth — regenerate the PNGs rather than editing them.

| Pattern | What |
|---|---|
| `logo-final-{gradient,black,white}-{500,1000,2000}.png` | Wide native ratio, transparent background |
| `logo-final-black-on-white-1000.png`, `logo-final-white-on-black-1000.png` | Wide, opaque plate baked in |
| `logo-square-gradient-dark-{300,400,1000}.png` | Square, mark at 78% width on `#0B0A14` — LinkedIn logo, avatars |
| `logo-square-white-violet-300.png`, `logo-square-black-white-300.png` | Square, single-color on a flat plate |
| `favicon-{gradient,white}-{16,32,48,64,180,512}.png` | Square, transparent, mark at 88% width |

## Working files, do not ship

| File | What it is |
|---|---|
| `logo-traced.svg` | 1:1 trace of the original PNG, inner circle still present — reference only |
| `logo-nocircle.svg` | Circle removed, original orientation — not mirrored, superseded |
| `logo-nocircle-mirror.svg` | Left-right mirror — same geometry as `logo-final.svg` |
| `logo-nocircle-mirror-vflip*.svg` | Top-bottom flip exploration — rejected |
| `mdn-mark*.svg` | 2026-08-16 black-hole redesign — rejected, kept for the record |

## Where the mark is wired in

| Surface | Source | Regenerate with |
|---|---|---|
| Favicons (`app/icon.png`, `app/icon1.png`, `app/apple-icon.png`) | `logo-final-gradient.svg` on a `#0B0A14` rounded tile | `node scripts/generate-favicons.mjs` |
| Link previews (`public/og-image.png`, `og-image-sk.png`) | `logo-final-white.svg` | `node scripts/generate-og-images.mjs` |
| Blog cards (`public/blog/*.jpg` — BlogPosting image + per-post og:image) | `logo-final-white.svg` | `node scripts/generate-blog-images.mjs` |
| Navbar, footers, portal top bar | `logo-final-white.svg` via `next/image` (`unoptimized`) | — |
| schema.org Organization logo | `png/logo-final-white-on-black-1000.png` | — |
| Chat widget bubble (`launcher_icon`) | `png/logo-final-white-500.png` | re-run `scripts/seed-sk-chatbot.mjs` |

`public/logo.png` is a copy of `png/logo-final-white-1000.png`, kept only so links
that already point at the old path stay current. Nothing in the app reads it.
