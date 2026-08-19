"use client";

import { motion, type Variants } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

import { BlackholeVideo } from "@/components/main/blackhole-video";
import {
  HERO_BLACKHOLE_CLASS,
  HERO_CONTENT_CLASS,
  HERO_CTA_SIZE_CLASS,
  HERO_SECTION_CLASS,
} from "@/components/main/hero-shell";
import { cn } from "@/lib/utils";

// The animated half of the product-page shell (/chatkit, /toolkit). Everything
// here touches framer-motion, so the client boundary starts at this file and
// nowhere else — the static primitives live in ./static-primitives and must
// stay out of it. Import either half from ./primitives.
//
// These primitives own the Event Horizon grammar — gradient crown on h1/h2
// only, violet glass surfaces, cyan for action and proof, gray-300 body — so
// the product pages only supply copy and data. Nothing here holds product copy,
// prices or counts: those stay in lib/portal/plans.ts,
// lib/marketing/toolkit-catalogue.ts and lib/marketing/* and arrive as props.

/** Inline stagger for the CSS hero entrances (.hero-enter-* in globals.css). */
export const enterDelay = (s: number) =>
  ({ "--enter-delay": `${s}s` }) as CSSProperties;

export const fadeUp = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.5, ease: "easeOut" },
  },
});

// The no-delay case hoisted to one identity. `fadeUp(0)` inline in JSX mints a
// fresh Variants object every render, which hands framer-motion a "new"
// animation for content that already played — mostly harmless in these
// render-once sections, but install-section re-renders on every shell-toggle
// click. Keep the factory for the genuinely varying delays.
export const FADE_UP = fadeUp(0);

export type CtaLink = {
  href: string;
  label: string;
  external?: boolean;
  /**
   * Renders an inert control instead of a link — no href, no hover gesture, no
   * keyboard focus. Produced by appCta() in lib/marketing/products.ts while the
   * customer portal is closed (APP_LIVE=false); never set it by hand.
   */
  disabled?: boolean;
};

const PRIMARY_CTA_CLASS =
  "button-primary text-center text-white cursor-pointer rounded-lg font-semibold";

const SECONDARY_CTA_CLASS =
  "text-center text-white cursor-pointer rounded-lg font-semibold border border-[#7042f88b] bg-[#7042f815] hover:bg-[#7042f825] transition-colors";

// Reads as a state, not an invitation: no gradient, no cyan, no cursor change.
// Shares HERO_CTA_DISABLED_CLASS's palette so the hero and in-page versions of
// a closed CTA look like the same thing.
const DISABLED_CTA_CLASS =
  "text-center rounded-lg font-semibold border border-white/[0.12] bg-white/[0.04] text-gray-400 cursor-not-allowed";

// In-page buttons hold the default size; the hero runs one step larger, from
// the same constant the / and /sk heroes use.
const CTA_SIZE_CLASS = {
  md: "py-3 px-8",
  lg: HERO_CTA_SIZE_CLASS,
} as const;

/**
 * The one primary/secondary button on the product pages. Exported so sections
 * that end in a CTA compose it instead of retyping the class string and the
 * 1.05 / 0.95 gestures.
 */
export const CtaButton = ({
  cta,
  variant = "primary",
  size = "md",
  className,
}: {
  cta: CtaLink;
  variant?: "primary" | "secondary";
  size?: "md" | "lg";
  className?: string;
}) =>
  cta.disabled ? (
    // A <span>, not a disabled <button>: there is no action to perform, so it
    // stays out of the tab order entirely rather than sitting in it as a dead
    // stop. aria-disabled still names the state for anyone who lands on it.
    <span
      aria-disabled="true"
      className={cn(CTA_SIZE_CLASS[size], DISABLED_CTA_CLASS, className)}
    >
      {cta.label}
    </span>
  ) : (
    <motion.a
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      href={cta.href}
      target={cta.external ? "_blank" : undefined}
      rel={cta.external ? "noopener noreferrer" : undefined}
      className={cn(
        CTA_SIZE_CLASS[size],
        variant === "primary" ? PRIMARY_CTA_CLASS : SECONDARY_CTA_CLASS,
        className
      )}
    >
      {cta.label}
    </motion.a>
  );

type PageHeroProps = {
  /** Anchor id, so the footer/nav can link back to the top of the page. */
  id?: string;
  title: ReactNode;
  subtitle: string;
  primaryCta: CtaLink;
  secondaryCta?: CtaLink;
};

/**
 * The only h1 on the page, in the same full-viewport shell as / and /sk:
 * blackhole overhead, one heading, one lede, two buttons, nothing else. It
 * plays on mount rather than on scroll — it is above the fold by definition.
 *
 * Deliberately NO eyebrow pill, breadcrumb, reassurance note or proof chips
 * (dropped 2026-08-14): five stacked elements above the first CTA read as
 * clutter, and the same facts are stated in the sections below. Removing the
 * visible breadcrumb also retired the BreadcrumbList JSON-LD on both product
 * pages — that schema is only honest while a visitor can see the trail.
 */
export const PageHero = ({
  id,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
}: PageHeroProps) => (
  // Entrance is CSS (.hero-enter-up in globals.css), not framer-motion: the
  // h1 here is the page's LCP element, and a framer entrance server-renders
  // it at opacity:0 until hydration.
  <div id={id} className={HERO_SECTION_CLASS}>
    <BlackholeVideo className={HERO_BLACKHOLE_CLASS} />

    <section className={HERO_CONTENT_CLASS}>
      <div className="flex w-full flex-col items-center">
        <h1
          className="hero-enter-up max-w-4xl break-words text-center text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500"
          style={enterDelay(0.05)}
        >
          {title}
        </h1>

        <p
          className="hero-enter-up mt-6 max-w-3xl text-center text-lg md:text-xl text-gray-300 leading-relaxed"
          style={enterDelay(0.3)}
        >
          {subtitle}
        </p>

        <div
          className="hero-enter-up mt-10 flex flex-col sm:flex-row items-center gap-4"
          style={enterDelay(0.5)}
        >
          {/* A gated primary ("Coming soon") drops below the live secondary on
              mobile — the first thumb target in the fold must do something. */}
          <CtaButton
            cta={primaryCta}
            variant="primary"
            size="lg"
            className={primaryCta.disabled ? "order-last sm:order-none" : undefined}
          />
          {secondaryCta ? (
            <CtaButton cta={secondaryCta} variant="secondary" size="lg" />
          ) : null}
        </div>
      </div>
    </section>
  </div>
);

/**
 * The animated title/intro pair inside Section (./static-primitives). Only
 * these two strings cross the client boundary — Section itself is a server
 * component precisely so a section's card tree is NOT re-serialized into the
 * RSC flight as client props (the /toolkit directory alone put 124 KB of
 * duplicate flight data in the HTML when Section lived in this file).
 */
export const SectionHeading = ({
  title,
  intro,
}: {
  title: string;
  intro?: string;
}) => (
  <>
    <motion.h2
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={FADE_UP}
      className="text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-10 text-center"
    >
      {title}
    </motion.h2>

    {intro ? (
      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp(0.15)}
        className="text-lg text-gray-300 text-center mb-14 max-w-3xl"
      >
        {intro}
      </motion.p>
    ) : null}
  </>
);

type CtaBandProps = {
  title: string;
  body: string;
  primary: CtaLink;
  secondary?: CtaLink;
  /** Anchor target — every other landmark on these pages has one. */
  id?: string;
};

/** Closing conversion block. Its heading is an h2 — never a second h1. */
export const CtaBand = ({
  title,
  body,
  primary,
  secondary,
  id = "get-started",
}: CtaBandProps) => (
  <section
    id={id}
    className="relative flex w-full max-w-full justify-center scroll-mt-24 py-20 px-4 md:px-20"
  >
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={FADE_UP}
      className="relative w-full max-w-4xl overflow-hidden rounded-xl border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7042f8] to-transparent"
      />
      {/* Vertical wash: mass at the top, light pooling at the buttons. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-cyan-500/10"
      />

      <div className="relative z-10 flex flex-col items-center gap-5 p-6 sm:p-10 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
          {title}
        </h2>
        <p className="max-w-2xl text-base md:text-lg text-gray-300 leading-relaxed">
          {body}
        </p>
        <div className="mt-2 flex flex-col sm:flex-row items-center gap-4">
          <CtaButton cta={primary} variant="primary" />
          {secondary ? <CtaButton cta={secondary} variant="secondary" /> : null}
        </div>
      </div>
    </motion.div>
  </section>
);
