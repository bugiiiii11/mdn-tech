// THE hero shell — one shape for every above-the-fold block on the marketing
// site (/, /sk, /chatkit, /toolkit). Plain constants, no directive, so server
// and client components can both import them.
//
// KEEP THIS FILE UNDER components/. tailwind.config.ts scans ./app,
// ./components and ./pages only — a class string that lives in lib/ generates
// no CSS at all, and the failure is silent: the markup ships with classes that
// match nothing, so the hero renders unstyled at its content height. (Learned
// the hard way on 2026-08-14; PROSE_LINK_CLASS lives in components/ for the
// same reason.)
//
// Three rules the classes below encode:
//
//  1. The hero owns the whole first screen. min-h-[100svh] means the next
//     section never peeks above the fold at any window size; `svh` (not `vh`)
//     keeps that honest on mobile, where the URL bar changes the viewport.
//  2. The blackhole is framed independently of the hero's height. Sizing it
//     with h-full off the hero container (the pre-2026-08 approach) meant any
//     height change rescaled and re-anchored the ring — which is how it ended
//     up hidden behind the navbar on phones. Explicit height + the asset's
//     true 16:9 aspect (blackhole.webm is 3840x2160) pins the visible arc just
//     below the fixed 65px navbar at every tier. The lg values reproduce the
//     approved desktop geometry exactly (810px box at -340px = a 1440px ring).
//  3. Copy clears the glow. On phones the ring's light reaches ~345px down, so
//     the content box starts below it and centres in what is left; from md up
//     there is room to centre against the whole viewport.

export const HERO_SECTION_CLASS =
  "relative flex flex-col min-h-[100svh] w-full max-w-full overflow-hidden";

export const HERO_BLACKHOLE_CLASS =
  "rotate-180 absolute -z-10 pointer-events-none left-1/2 -translate-x-1/2 w-auto max-w-none aspect-video object-contain h-[560px] top-[-215px] md:h-[700px] md:top-[-290px] lg:h-[810px] lg:top-[-340px]";

export const HERO_CONTENT_CLASS =
  "flex flex-1 items-center justify-center pt-[195px] pb-16 md:pt-[65px] md:pb-12 px-3 md:px-20 w-full max-w-full z-[20]";

// Hero buttons run one step larger than the in-page CtaButton default
// (py-3 px-8). The step is held back until sm: at 320px a full-size Slovak
// label ("Nezáväzná konzultácia zdarma") would outgrow the column.
export const HERO_CTA_SIZE_CLASS =
  "py-3.5 px-8 text-base sm:py-4 sm:px-10 sm:text-lg";

export const HERO_CTA_PRIMARY_CLASS = `${HERO_CTA_SIZE_CLASS} button-primary text-center text-white cursor-pointer rounded-lg font-semibold`;

export const HERO_CTA_SECONDARY_CLASS = `${HERO_CTA_SIZE_CLASS} text-center text-white cursor-pointer rounded-lg font-semibold border border-[#7042f88b] bg-[#7042f815] hover:bg-[#7042f825] transition-colors`;

// A hero CTA whose destination is closed (the portal, while APP_LIVE is false).
// Same footprint as the primary so the fold does not reflow when the flag
// flips, but drained of every affordance: no gradient, no cursor, no hover.
export const HERO_CTA_DISABLED_CLASS = `${HERO_CTA_SIZE_CLASS} text-center rounded-lg font-semibold border border-white/[0.12] bg-white/[0.04] text-gray-400 cursor-not-allowed`;
