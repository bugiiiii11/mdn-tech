"use client";

import { motion } from "framer-motion";

import { getLandingMode, MARKETING_PRODUCTS } from "@/lib/marketing/products";

// Coming-soon band. Deliberately CTA-free: these products cannot be bought or
// tried yet, so a button here would be a promise we can't keep. Copy attacks
// the PROBLEM each product solves — a different angle from the grid cards
// above, which state what each product does.
//
// Renders nothing in FULL landing mode (every product live => nothing upcoming).

const PROBLEMS: Record<string, { problem: string; answer: string }> = {
  signakit: {
    problem: "Every app needs login, and building it properly costs weeks.",
    answer:
      "Drop-in authentication with Google, Apple, email, or a Web3 wallet — plus a crypto wallet your users never have to configure.",
  },
  marketkit: {
    problem: "The product ships, then marketing stalls for lack of hours.",
    answer:
      "An AI copilot that scans your product, writes the launch kit, and runs weekly growth sprints with metrics you can actually track.",
  },
  techkit: {
    problem: "You find out production is down from a customer email.",
    answer:
      "Uptime, deploys, provider health, and AI spend in one view, with a weekly digest that tells you what changed and what it cost.",
  },
};

export const ComingSoon = () => {
  const mode = getLandingMode();
  const upcoming = MARKETING_PRODUCTS.filter(
    (product) => product.status[mode] === "coming-soon"
  );

  if (upcoming.length === 0) return null;

  return (
    <section
      id="coming-soon"
      className="flex flex-col items-center justify-center gap-3 scroll-mt-24 relative py-20 px-4 md:px-20 w-full max-w-full"
    >
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        }}
        className="text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-10 text-center"
      >
        What We&apos;re Building Next
      </motion.h2>

      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: 0.15 },
          },
        }}
        className="text-lg text-gray-300 text-center mb-14 max-w-3xl"
      >
        Three more tools in development. They will arrive under the account you
        already have — nothing new to sign up for when they land.
      </motion.p>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12 } },
        }}
        className="w-full max-w-5xl flex flex-col divide-y divide-white/[0.06]"
      >
        {upcoming.map((product) => {
          const copy = PROBLEMS[product.id];
          if (!copy) return null;

          return (
            <motion.div
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: "easeOut" },
                },
              }}
              className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-3 md:gap-10 py-8 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-2">
                <h3 className="text-xl font-semibold text-white">
                  {product.name}
                </h3>
                <span className="text-[10px] uppercase tracking-wide font-medium text-purple-400/70 border border-purple-500/30 rounded-full px-2 py-0.5">
                  In development
                </span>
              </div>

              <div>
                <p className="text-base md:text-lg text-gray-300 mb-2 leading-relaxed">
                  {copy.problem}
                </p>
                <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                  {copy.answer}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};
