"use client";

import { motion } from "framer-motion";

import { TOOLKIT_REPO } from "@/lib/marketing/links";
import { LISTED_COUNT, MDN_COUNT } from "@/lib/marketing/toolkit-catalogue";

// ToolKit deep-dive — the genuinely-free product and top-of-funnel trust
// builder for the developer audience.
//
// HONESTY CONSTRAINT (do not regress): ToolKit is a CURATED DIRECTORY. Most of
// the catalogue is third-party work (Anthropic, Vercel Labs, Trail of Bits,
// obra and others) under each author's own licence. Only the M.D.N Tech skills
// PUBLISHED in our repo may be described as "ours" or MIT — not the
// unpublished entries. Both counts come from lib/marketing/toolkit-catalogue,
// the same module /toolkit reads, so this section and the deep-dive page can
// never publish different numbers.

const points = [
  {
    title: `${LISTED_COUNT} skills, curated not scraped`,
    text: "Every skill in the directory is one we evaluated and would use ourselves — from Anthropic, Vercel Labs, Trail of Bits, the community, and our own workshop. Each entry links straight to its source.",
  },
  {
    title: `${MDN_COUNT} skills we wrote ourselves`,
    text: "Session continuity and chatbot knowledge-base generation — MIT licensed, installable from our GitHub repo, and the same skills we use building this site.",
  },
  {
    title: "Free, and no account needed",
    text: "Browse and install without signing up. Nothing here is a trial, and there is no upsell inside the tools.",
  },
  {
    title: "Install one at a time",
    text: "Pick the skills you actually want; each one installs from its own source with a single command. No bundle, no lock-in.",
  },
];

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.5, ease: "easeOut" },
  },
});

export const ToolKitSection = () => {
  return (
    <section
      id="toolkit"
      className="flex flex-col items-center justify-center gap-3 scroll-mt-24 relative py-20 px-4 md:px-20 w-full max-w-full"
    >
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp(0)}
        className="text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-10 text-center"
      >
        ToolKit: A Free Directory of Claude Code Skills
      </motion.h2>

      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp(0.15)}
        className="text-lg text-gray-300 text-center mb-14 max-w-3xl"
      >
        {LISTED_COUNT} Claude Code skills worth your time — {MDN_COUNT} built
        in-house, the rest hand-picked from Anthropic, Vercel Labs, Trail of
        Bits and the community.
      </motion.p>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Terminal mock — pure CSS, no assets. Shows one of OUR skills. */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp(0.2)}
          aria-hidden="true"
          className="relative rounded-xl border border-[#7042f88b] bg-[#0a0a23]/80 backdrop-blur-sm overflow-hidden w-full max-w-md mx-auto order-2 lg:order-1"
        >
          <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-white/[0.06] bg-[#7042f815]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7042f88b]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#7042f855]"></span>
            <span className="ml-2 text-xs text-gray-400 font-mono">
              handoff — session
            </span>
          </div>
          <div className="p-5 font-mono text-xs sm:text-sm leading-7 overflow-x-auto">
            <p className="whitespace-nowrap">
              <span className="text-cyan-400">$</span>{" "}
              <span className="text-gray-200">/handoff start</span>
            </p>
            <p className="text-gray-400 whitespace-nowrap">
              Session briefing ready — 3 priorities loaded
            </p>
            <p className="mt-2 whitespace-nowrap">
              <span className="text-cyan-400">$</span>{" "}
              <span className="text-gray-200">/handoff wrap</span>
            </p>
            <p className="text-gray-400 whitespace-nowrap">
              handoff.md updated · committed locally
            </p>
            <p className="text-gray-400 whitespace-nowrap">
              Next session picks up exactly here
            </p>
          </div>
        </motion.div>

        {/* Receipts */}
        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
          className="flex flex-col gap-7 list-none order-1 lg:order-2"
        >
          {points.map((point) => (
            <motion.li key={point.title} variants={fadeUp(0)}>
              <h3 className="text-lg font-semibold text-white mb-1.5">
                {point.title}
              </h3>
              <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                {point.text}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp(0.15)}
        className="flex flex-col sm:flex-row items-center gap-4 mt-12"
      >
        {/* The indexable /toolkit page, not the noindex portal — internal link
            equity has to land on the surface that is meant to rank. */}
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href="/toolkit"
          className="py-3 px-8 button-primary text-center text-white cursor-pointer rounded-lg font-semibold"
        >
          Browse the Directory →
        </motion.a>
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href={TOOLKIT_REPO}
          target="_blank"
          rel="noopener noreferrer"
          className="py-3 px-8 text-center text-white cursor-pointer rounded-lg font-semibold border border-[#7042f88b] bg-[#7042f815] hover:bg-[#7042f825] transition-colors"
        >
          Our skills on GitHub
        </motion.a>
      </motion.div>
    </section>
  );
};
