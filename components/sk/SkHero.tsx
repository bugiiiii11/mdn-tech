"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { SK_HERO } from "@/constants/sk";
import { BlackholeVideo } from "@/components/main/blackhole-video";
import {
  HERO_BLACKHOLE_CLASS,
  HERO_CONTENT_CLASS,
  HERO_CTA_PRIMARY_CLASS,
  HERO_CTA_SIZE_CLASS,
  HERO_SECTION_CLASS,
} from "@/components/main/hero-shell";

const delay = (s: number) => ({ "--enter-delay": `${s}s` }) as CSSProperties;

// Same shell as the EN hero (components/landing/hero.tsx) via
// components/main/hero-shell.ts. BlackholeVideo also brings the reduced-motion
// pause + poster the raw <video> here used to lack. The secondary CTA keeps
// /sk's quieter white/15 border rather than the EN violet.
//
// Entrance is CSS (.hero-enter-left in globals.css), not framer-motion — same
// LCP reasoning as the EN hero: this headline must paint before hydration.
export const SkHero = () => {
  return (
    <div id="domov" className={HERO_SECTION_CLASS}>
      <BlackholeVideo className={HERO_BLACKHOLE_CLASS} />

      <div className={HERO_CONTENT_CLASS}>
        <div className="w-full flex flex-col items-center gap-6 justify-center">
          {/* Headline */}
          <h1
            // 7xl is held back to xl: the keyword-led line one is longer than
            // the old "Expandujte", and at 72px it would wrap into a three-line
            // headline on 1024-1279px screens.
            className="hero-enter-left flex flex-col gap-2 text-4xl md:text-6xl xl:text-7xl font-bold text-white w-full max-w-full text-center"
            style={delay(0.3)}
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
          </h1>

          {/* Subtitle */}
          <p
            className="hero-enter-left text-lg md:text-2xl text-gray-300 max-w-[720px] text-center font-medium"
            style={delay(0.55)}
          >
            {SK_HERO.subtitle}
          </p>

          {/* CTAs */}
          <div
            className="hero-enter-left flex flex-col sm:flex-row gap-4 mt-4 items-center justify-center"
            style={delay(0.75)}
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
          </div>
        </div>
      </div>
    </div>
  );
};
