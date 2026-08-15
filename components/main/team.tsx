"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { RxLinkedinLogo } from "react-icons/rx";

import { FOUNDER } from "@/constants";
import {
  FADE_UP,
  PROSE_LINK_CLASS,
  StatChip,
  fadeUp,
} from "@/components/product-pages/primitives";

// Growing-team framing (2026-08-14, user decision): the section tells the
// honest story — five full-stack AI engineers, distributed, hiring as
// contracts land — anchored by ONE verifiable founder card instead of a grid
// of profiles nobody can check. The world map is the "B2B worldwide,
// working internationally" backdrop, with a few decorative activity pulses.

// Percent positions inside the 21:10 map frame (world-map.svg viewBox is
// 210x100). Decorative only — unlabeled, aria-hidden.
const MAP_PULSES = [
  { left: "52.5%", top: "24%", delay: 0 }, // Central Europe
  { left: "62%", top: "41%", delay: 0.9 }, // Gulf / UAE
  { left: "25%", top: "31%", delay: 1.7 }, // North America
  { left: "77%", top: "47%", delay: 2.4 }, // Southeast Asia
];

export const Team = () => {
  return (
    <section
      id="team"
      className="relative flex flex-col items-center justify-center py-20 px-4 md:px-20 overflow-hidden w-full max-w-full"
    >
      {/* World map backdrop — kept in its own 21:10 frame so the activity
          pulses can be placed in percentages that always line up with the
          artwork. min-w keeps the map readable on phones (section clips it). */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center opacity-50 pointer-events-none"
      >
        <div className="relative w-full min-w-[680px] max-w-6xl aspect-[21/10]">
          <Image
            src="/world-map.svg"
            alt=""
            width={1200}
            height={571}
            className="w-full h-full"
            priority={false}
          />
          {MAP_PULSES.map(({ left, top, delay }) => (
            <span
              key={`${left}-${top}`}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left, top }}
            >
              <span
                className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400 opacity-60 motion-safe:animate-ping"
                style={{ animationDelay: `${delay}s`, animationDuration: "2.8s" }}
              />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400/70" />
            </span>
          ))}
        </div>
      </div>

      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={FADE_UP}
        className="relative z-10 text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-10 text-center"
      >
        A Growing Team of AI Engineers
      </motion.h2>

      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp(0.1)}
        className="relative z-10 text-lg text-gray-300 text-center mb-6 max-w-3xl leading-relaxed"
      >
        M.D.N Tech is a distributed team — five full-stack AI engineers today,
        working across time zones for B2B clients worldwide. We built our
        careers shipping enterprise systems, Web3 ecosystems and production
        apps, then rebuilt the way we work around Claude Code — the same
        expertise we publish as free skills in{" "}
        <Link href="/toolkit" className={PROSE_LINK_CLASS}>
          ToolKit
        </Link>
        .
      </motion.p>

      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp(0.18)}
        className="relative z-10 text-lg text-gray-300 text-center mb-10 max-w-3xl leading-relaxed"
      >
        Every project is owned end to end by one engineer with full context.
        And as new contracts land, the team grows — senior engineers, designers
        and marketers who work the same way.
      </motion.p>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp(0.25)}
        className="relative z-10 flex flex-wrap items-center justify-center gap-3 mb-14"
      >
        <StatChip>Five full-stack AI engineers</StatChip>
        <StatChip>Working across time zones</StatChip>
        <StatChip>B2B clients worldwide</StatChip>
      </motion.div>

      {/* Founder card — the one human a visitor can verify. */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp(0.3)}
        whileHover={{ y: -4 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="relative overflow-hidden rounded-xl border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm p-6 sm:p-8 transition-colors hover:border-purple-500/70">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7042f8] to-transparent"
          />
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="relative h-28 w-28 flex-shrink-0 rounded-full overflow-hidden border-2 border-purple-500/30">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20" />
              <Image
                src={FOUNDER.image}
                alt={FOUNDER.name}
                width={112}
                height={112}
                className="relative z-10 h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0">
              <h3 className="text-xl font-semibold text-white">
                {FOUNDER.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-purple-400">
                {FOUNDER.role}
              </p>
              <p className="mt-3 text-sm text-gray-300 leading-relaxed">
                {FOUNDER.bio}
              </p>

              {FOUNDER.linkedin ? (
                <a
                  href={FOUNDER.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#7042f88b] bg-[#7042f815] px-4 py-2 text-sm font-medium text-gray-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors"
                >
                  <RxLinkedinLogo className="h-4 w-4" aria-hidden="true" />
                  Connect on LinkedIn
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp(0.35)}
        className="relative z-10 mt-8 text-sm text-gray-400 text-center"
      >
        Think you would fit in?{" "}
        <a href="#contact-us" className={PROSE_LINK_CLASS}>
          Say hello
        </a>
        .
      </motion.p>
    </section>
  );
};
