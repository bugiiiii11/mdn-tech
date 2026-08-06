"use client";

import { motion } from "framer-motion";

import { APP_URL } from "@/lib/marketing/products";
import { toolkitSkills } from "@/lib/portal/toolkit-skills";
import { FREE_TRIAL_MESSAGES } from "@/lib/portal/plans";

// "Start Free" — no account required. Counts imported from portal sources of
// truth (toolkit-skills.ts, plans.ts) so copy never drifts from reality.
const cards = [
  {
    title: "Claude Code Skills",
    stat: `${toolkitSkills.length} production-tested skills`,
    description:
      "Session continuity, safety hooks, and workflow automation for Claude Code. Free forever, MIT licensed, one-line install. No account needed.",
    cta: "Browse Skills",
    href: `${APP_URL}/toolkit`,
  },
  {
    title: "Try ChatKit Free",
    stat: `${FREE_TRIAL_MESSAGES} free trial messages`,
    description:
      "Build a chatbot from your own content and embed it on your site in minutes. Full feature access during trial — no credit card required.",
    cta: "Start Free",
    href: `${APP_URL}/chatkit`,
  },
];

export const FreeTools = () => {
  return (
    <section
      id="free-tools"
      className="flex flex-col items-center justify-center gap-3 relative py-20 px-4 md:px-20 w-full max-w-full"
    >
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: -20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        }}
        className="text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-10 text-center"
      >
        Free Tools
      </motion.h2>

      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: -20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: 0.2 },
          },
        }}
        className="text-lg text-gray-400 text-center mb-12 max-w-3xl"
      >
        No account required. Start using our tools right now.
      </motion.p>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: "easeOut",
                },
              },
            }}
            whileHover={{ y: -4 }}
            className="relative p-8 rounded-xl border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm group overflow-hidden transition-all duration-300 flex flex-col"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10 flex flex-col flex-1">
              <span className="inline-flex self-start px-3 py-1 mb-4 text-xs font-medium text-cyan-400 bg-cyan-500/10 rounded-full border border-cyan-500/30">
                {card.stat}
              </span>

              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                {card.title}
              </h3>

              <p className="text-sm text-gray-400 leading-relaxed flex-1 group-hover:text-gray-300 transition-colors duration-300">
                {card.description}
              </p>

              <a
                href={card.href}
                className="mt-6 inline-flex items-center gap-2 text-cyan-400 text-sm font-semibold group-hover:gap-3 transition-all duration-300"
              >
                {card.cta}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
