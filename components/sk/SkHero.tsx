"use client";

import { motion } from "framer-motion";
import { slideInFromLeft } from "@/lib/motion";
import { SK_HERO } from "@/constants/sk";
import { BlackholeVideo } from "@/components/main/blackhole-video";
import {
  HERO_BLACKHOLE_CLASS,
  HERO_CONTENT_CLASS,
  HERO_CTA_PRIMARY_CLASS,
  HERO_CTA_SIZE_CLASS,
  HERO_SECTION_CLASS,
} from "@/components/main/hero-shell";

// Same shell as the EN hero (components/landing/hero.tsx) via
// components/main/hero-shell.ts. BlackholeVideo also brings the reduced-motion
// pause + poster the raw <video> here used to lack. The secondary CTA keeps
// /sk's quieter white/15 border rather than the EN violet.
export const SkHero = () => {
  return (
    <div id="domov" className={HERO_SECTION_CLASS}>
      <BlackholeVideo className={HERO_BLACKHOLE_CLASS} />

      <motion.div
        initial="hidden"
        animate="visible"
        className={HERO_CONTENT_CLASS}
      >
        <div className="w-full flex flex-col items-center gap-6 justify-center">
          {/* Headline */}
          <motion.h1
            variants={slideInFromLeft(0.3)}
            className="flex flex-col gap-2 text-4xl md:text-6xl lg:text-7xl font-bold text-white w-full max-w-full text-center"
          >
            <span className="break-words">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
                {SK_HERO.titleLine1}
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">
                {SK_HERO.titleLine2}
              </span>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={slideInFromLeft(0.55)}
            className="text-lg md:text-2xl text-gray-300 max-w-[720px] text-center font-medium"
          >
            {SK_HERO.subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={slideInFromLeft(0.75)}
            className="flex flex-col sm:flex-row gap-4 mt-4 items-center justify-center"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={SK_HERO.ctaPrimary.href}
              className={HERO_CTA_PRIMARY_CLASS}
            >
              {SK_HERO.ctaPrimary.label}
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={SK_HERO.ctaSecondary.href}
              className={`${HERO_CTA_SIZE_CLASS} text-center text-gray-200 cursor-pointer rounded-lg font-semibold border border-white/15 hover:border-white/30 hover:text-white transition-colors`}
            >
              {SK_HERO.ctaSecondary.label}
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
