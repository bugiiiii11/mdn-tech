import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

// The purely-static half of the product-page shell. NO 'use client' HERE, AND
// DO NOT ADD ONE: these three components have no hooks, no framer-motion and no
// event handlers, so keeping them out of the client boundary lets the twelve
// server components under components/toolkit/ and components/chatkit/ render
// them as plain markup instead of as client references.
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
