// Shared shell for the per-product marketing pages (/chatkit, /toolkit).
//
// THIS FILE IS A BARREL AND MUST NOT CARRY 'use client'. It is deliberately a
// server module so that the two halves keep their own boundaries:
//
//   ./static-primitives  — GlassCard, StatChip, CheckItem. Plain markup, no
//                          directive, so server sections render them inline.
//   ./motion-primitives  — 'use client'. Everything that touches framer-motion:
//                          fadeUp, CtaButton, PageHero, Section, CtaBand.
//
// A 'use client' directive here would turn every re-export into a client
// reference again and undo the split, which is the whole reason the barrel is
// a separate file from the animated primitives.
//
// FAQ accordion + FAQPage schema live in ./faq; JSON-LD entity references live
// in ./schema.

export {
  CheckItem,
  GlassCard,
  PROSE_LINK_CLASS,
  StatChip,
} from "./static-primitives";

export {
  CtaBand,
  CtaButton,
  FADE_UP,
  PageHero,
  Section,
  fadeUp,
  type Crumb,
  type CtaLink,
} from "./motion-primitives";
