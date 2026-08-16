"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { RxLinkedinLogo } from "react-icons/rx";
import { FOUNDER } from "@/constants";
import { SK_ABOUT } from "@/constants/sk";

// "Kto sme" trust section (rework plan v1.0, A1): one verifiable founder card
// instead of team-grid theatre — the same call the EN /about page made. Copy
// lives in SK_ABOUT; the personal LinkedIn URL is single-sourced from
// FOUNDER.linkedin (constants/index.ts) and the button renders only once
// Martin fills it in — placeholder links are a named anti-reference.
export const SkAbout = () => {
  return (
    <section
      id="kto-sme"
      className="flex flex-col items-center justify-center py-20 px-4 md:px-20 w-full max-w-full overflow-hidden"
    >
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: -20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        }}
        className="text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-6 text-center"
      >
        {SK_ABOUT.title}
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        whileHover={{ y: -4 }}
        className="w-full max-w-3xl"
      >
        <div className="relative overflow-hidden rounded-2xl border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm p-6 sm:p-8 transition-colors hover:border-purple-500/70">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7042f8] to-transparent"
          />
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="relative h-28 w-28 flex-shrink-0 rounded-full overflow-hidden border-2 border-purple-500/30">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20" />
              <Image
                src={SK_ABOUT.founder.image}
                alt={SK_ABOUT.founder.name}
                width={112}
                height={112}
                className="relative z-10 h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0">
              <h3 className="text-xl font-semibold text-white">
                {SK_ABOUT.founder.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-purple-400">
                {SK_ABOUT.founder.role}
              </p>
              {SK_ABOUT.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-3 text-sm md:text-base text-gray-300 leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}

              <div className="mt-5 flex flex-wrap justify-center sm:justify-start gap-3">
                {FOUNDER.linkedin ? (
                  <a
                    href={FOUNDER.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-[#7042f88b] bg-[#7042f815] px-4 py-2 text-sm font-medium text-gray-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors"
                  >
                    <RxLinkedinLogo className="h-4 w-4" aria-hidden="true" />
                    LinkedIn Martina
                  </a>
                ) : null}
                <a
                  href={SK_ABOUT.companyLinkedIn.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#7042f88b] bg-[#7042f815] px-4 py-2 text-sm font-medium text-gray-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors"
                >
                  <RxLinkedinLogo className="h-4 w-4" aria-hidden="true" />
                  {SK_ABOUT.companyLinkedIn.label}
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
