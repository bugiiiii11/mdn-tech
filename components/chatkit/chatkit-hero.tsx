import { PageHero } from "@/components/product-pages/primitives";
import { APP_URL } from "@/lib/marketing/products";

// /chatkit hero — the page's ONLY h1 (PageHero renders it), in the same
// full-viewport shell as the homepage: blackhole overhead, heading, lede, two
// buttons.
//
// No 'use client' here on purpose: this file is pure composition — no hooks,
// no motion, no browser API — so it stays a server component and PageHero
// carries the client boundary on its own.
//
// The eyebrow pill, the visible breadcrumb, the "No credit card" note and the
// four proof chips were removed on 2026-08-14 to unclutter the fold. The facts
// they carried are not lost: the trial size, the one-line install, the credit
// cost and the cheapest rate are all stated (and derived from
// lib/portal/plans.ts) in the pricing and included-vs-unlocks sections below.
//
// HONESTY: the trial is the core chatbot only — the four paid unlocks are not
// part of it (feature_unlocks defaults to '{}', migration 017). Nothing here
// says "everything included".

export const ChatKitHero = () => (
  <PageHero
    title="An AI Chatbot for Your Website That Answers Only From Your Content"
    subtitle="Write your knowledge base, pick a colour, paste one script tag. ChatKit answers your visitors from what you wrote — in their language — and says the fallback line you chose when the answer is not there."
    primaryCta={{
      href: `${APP_URL}/chatkit`,
      // Short enough to stay on one line inside the pill at 360px — the
      // pricing section carries the trial size.
      label: "Create your chatbot free",
    }}
    secondaryCta={{ href: "#pricing", label: "See what it costs" }}
  />
);
