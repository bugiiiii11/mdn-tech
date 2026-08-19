import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { SectionHeading } from "./motion-primitives";

// The server-renderable half of the product-page shell. NO 'use client' HERE,
// AND DO NOT ADD ONE: keeping these out of the client boundary lets the server
// components under components/toolkit/ and components/chatkit/ render them as
// plain markup instead of as client references. Section composes the animated
// SectionHeading (a client leaf) but is itself a server component — that is
// the point: only the title/intro strings cross the boundary, never the
// section's children, so a card grid is not re-serialized into the RSC flight
// as client props (/toolkit shipped 124 KB of duplicate flight data when
// Section lived in ./motion-primitives).
//
// The animated half lives in ./motion-primitives (which does carry the
// directive); ./primitives re-exports both so no import site has to know which
// half an export came from. Because ./primitives itself is a server module,
// importing GlassCard from it does not drag the boundary along.

// The one spelling of the inline prose link. Variants had grown across the
// page trees (with/without duration-300, with/without font-medium), so
// equivalent links rendered differently on /chatkit and /toolkit — consumers
// should use this constant bare, never with appended weight or colour classes.
export const PROSE_LINK_CLASS =
  "font-medium text-cyan-400 transition-colors duration-300 hover:text-cyan-300";

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
    <SectionHeading title={title} intro={intro} />

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

export const GlassCard = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "rounded-xl border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm p-6",
      className
    )}
  >
    {children}
  </div>
);

export const StatChip = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400">
    {children}
  </span>
);

/** Renders an h4 — place it under a group that already has an h3. */
export const CheckItem = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div>
    <h4 className="text-base font-semibold text-white mb-1.5 flex items-start gap-2">
      {/* Cyan, not gray: the tick is the evidence that a capability is
          included, and it is the only mark distinguishing it from SkipItem's
          dash where both appear in one section (the Bent Light Rule allows
          cyan for proof). gray-500 measured 4.28:1 and read as decoration. */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M16.704 5.29a1 1 0 010 1.415l-7.5 7.5a1 1 0 01-1.415 0l-3.5-3.5a1 1 0 111.415-1.414l2.792 2.792 6.793-6.793a1 1 0 011.415 0z"
          clipRule="evenodd"
        />
      </svg>
      {title}
    </h4>
    {/* Body of a titled item is gray-300 (the Legibility Floor Rule); gray-400
        is for genuinely subordinate lines only. */}
    <p className="text-sm text-gray-300 leading-relaxed pl-7">{children}</p>
  </div>
);
