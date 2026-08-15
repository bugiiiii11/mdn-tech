"use client";

import { motion } from "framer-motion";
import Link from "next/link";

// "Why M.D.N Tech" — replaces the old trust bar (avatars + headcount).
// Deliberately card-less: plain columns on the void, so the section reads as
// a quiet statement of substance between two card-heavy product sections.
// No headcount claims — "senior AI engineers" scales with the team.

const reasons = [
  {
    title: "Senior AI engineers",
    text: "Decades of combined experience shipping AI, Web3, and enterprise systems — and a network that scales when projects demand it.",
  },
  {
    title: "We use what we sell",
    text: "ToolKit runs our sessions, TechKit watches our stack, ChatKit answers for our clients. Every tool earns its keep here first.",
  },
  {
    title: "Self-service by design",
    text: "No sales calls, no onboarding meetings, no gated demos. Sign up, configure, and ship — the whole company is built around that promise.",
  },
  {
    title: "A real company",
    text: "M.D.N Tech FZE, licensed in the UAE (License 7813). Real address, real invoices, real people answering the support inbox.",
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

export const WhyUs = () => {
  return (
    <section
      id="why"
      className="flex flex-col items-center justify-center gap-3 scroll-mt-24 relative py-20 px-4 md:px-20 w-full max-w-full"
    >
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp(0)}
        className="text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-10 text-center"
      >
        Built by Engineers Who Ship
      </motion.h2>

      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp(0.15)}
        className="text-lg text-gray-300 text-center mb-14 max-w-3xl"
      >
        M.D.N Tech is a senior AI engineering team building the tools we
        always wanted to buy.
      </motion.p>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12 } },
        }}
        className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-x-14 gap-y-10"
      >
        {reasons.map((reason) => (
          <motion.div key={reason.title} variants={fadeUp(0)}>
            <h3 className="text-lg font-semibold text-white mb-2">
              {reason.title}
            </h3>
            <p className="text-sm md:text-base text-gray-400 leading-relaxed">
              {reason.text}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp(0.1)}
        className="text-sm text-gray-400 mt-14"
      >
        Need custom development? We take on select projects —{" "}
        <Link
          href="/about"
          className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-medium"
        >
          meet the team →
        </Link>
      </motion.p>
    </section>
  );
};
