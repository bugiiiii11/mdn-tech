"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

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

export const fadeUp = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.5, ease: "easeOut" },
  },
});

export type CtaLink = {
  href: string;
  label: string;
  external?: boolean;
};

const PRIMARY_CTA_CLASS =
  "py-3 px-8 button-primary text-center text-white cursor-pointer rounded-lg font-semibold";

const SECONDARY_CTA_CLASS =
  "py-3 px-8 text-center text-white cursor-pointer rounded-lg font-semibold border border-[#7042f88b] bg-[#7042f815] hover:bg-[#7042f825] transition-colors";

/**
 * The one primary/secondary button on the product pages. Exported so sections
 * that end in a CTA compose it instead of retyping the class string and the
 * 1.05 / 0.95 gestures.
 */
export const CtaButton = ({
  cta,
  variant = "primary",
  className,
}: {
  cta: CtaLink;
  variant?: "primary" | "secondary";
  className?: string;
}) => (
  <motion.a
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    href={cta.href}
    target={cta.external ? "_blank" : undefined}
    rel={cta.external ? "noopener noreferrer" : undefined}
    className={cn(
      variant === "primary" ? PRIMARY_CTA_CLASS : SECONDARY_CTA_CLASS,
      className
    )}
  >
    {cta.label}
  </motion.a>
);

/**
 * One rung of the visible breadcrumb. The last crumb carries no href and is
 * rendered as the current page. Build the BreadcrumbList JSON-LD from the same
 * array via breadcrumbListSchema() so the schema cannot claim a trail the page
 * does not show.
 */
export type Crumb = {
  label: string;
  /** Omit on the final crumb (the current page). */
  href?: string;
};

const Breadcrumb = ({ trail }: { trail: Crumb[] }) => (
  <nav aria-label="Breadcrumb" className="mb-6 flex w-full justify-center">
    <ol className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-400">
      {trail.map((crumb, index) => (
        <li key={crumb.label} className="flex items-center gap-2">
          {index > 0 ? (
            <span aria-hidden="true" className="text-gray-500">
              /
            </span>
          ) : null}
          {crumb.href ? (
            <a
              href={crumb.href}
              className="text-cyan-400 transition-colors duration-300 hover:text-cyan-300"
            >
              {crumb.label}
            </a>
          ) : (
            <span aria-current="page">{crumb.label}</span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  primaryCta: CtaLink;
  secondaryCta?: CtaLink;
  note?: string;
  /**
   * Optional visible breadcrumb, rendered above the eyebrow. The hero owns the
   * navbar clearance either way, so callers never need a negative-margin hack.
   */
  trail?: Crumb[];
  children?: ReactNode;
};

/** The only h1 on the page. Above the fold, so it plays on mount. */
export const PageHero = ({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  note,
  trail,
  children,
}: PageHeroProps) => {
  const hasTrail = Boolean(trail && trail.length > 0);

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      className={cn(
        "relative z-[20] flex w-full max-w-full flex-col items-center px-4 pb-10 md:px-20",
        // The hero owns the clearance under the fixed 65px navbar. With a
        // breadcrumb the trail takes the top slot, so the block starts higher.
        hasTrail ? "mt-28" : "mt-40"
      )}
    >
      {hasTrail ? (
        <motion.div variants={fadeUp(0)} className="w-full">
          <Breadcrumb trail={trail as Crumb[]} />
        </motion.div>
      ) : null}

      {/* The ✦ belongs to the pill, not the copy — callers pass plain text. */}
      <motion.div
        variants={fadeUp(0.1)}
        // max-w-full: .Welcome-box is width:max-content with overflow:hidden,
        // so without it a long eyebrow is silently clipped by the page's
        // overflow-x-hidden instead of wrapping (checked at 320px).
        className="Welcome-box max-w-full py-[8px] px-[12px] border border-[#7042f88b] opacity-[0.9] rounded-full"
      >
        {/* No text colour here: .Welcome-text sets -webkit-text-fill-color,
            which wins over any Tailwind colour class. */}
        <span className="Welcome-text text-[13px] text-center">
          <span aria-hidden="true">✦ </span>
          {eyebrow}
        </span>
      </motion.div>

      <motion.h1
        variants={fadeUp(0.25)}
        className="mt-6 max-w-4xl break-words text-center text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500"
      >
        {title}
      </motion.h1>

      <motion.p
        variants={fadeUp(0.4)}
        className="mt-6 max-w-3xl text-center text-lg md:text-xl text-gray-300 leading-relaxed"
      >
        {subtitle}
      </motion.p>

      <motion.div
        variants={fadeUp(0.55)}
        className="mt-8 flex flex-col sm:flex-row items-center gap-4"
      >
        <CtaButton cta={primaryCta} variant="primary" />
        {secondaryCta ? (
          <CtaButton cta={secondaryCta} variant="secondary" />
        ) : null}
      </motion.div>

      {note ? (
        <motion.p
          variants={fadeUp(0.65)}
          className="mt-5 text-center text-sm text-gray-400"
        >
          {note}
        </motion.p>
      ) : null}

      {children ? (
        <motion.div
          variants={fadeUp(0.75)}
          className="mt-14 flex w-full justify-center"
        >
          {children}
        </motion.div>
      ) : null}
    </motion.section>
  );
};

type SectionProps = {
  id: string;
  title: string;
  intro?: string;
  children: ReactNode;
  className?: string;
  /** Widens the content column from max-w-4xl to max-w-6xl for grids. */
  wide?: boolean;
};

export const Section = ({
  id,
  title,
  intro,
  children,
  className,
  wide = false,
}: SectionProps) => (
  <section
    id={id}
    className={cn(
      "relative flex w-full max-w-full flex-col items-center justify-center gap-3 scroll-mt-24 py-20 px-4 md:px-20",
      className
    )}
  >
    <motion.h2
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp(0)}
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

    <div
      className={cn(
        "flex w-full flex-col items-center",
        wide ? "max-w-6xl" : "max-w-4xl",
        !intro && "mt-4"
      )}
    >
      {children}
    </div>
  </section>
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
      variants={fadeUp(0)}
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

      <div className="relative z-10 flex flex-col items-center gap-5 p-10 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
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
