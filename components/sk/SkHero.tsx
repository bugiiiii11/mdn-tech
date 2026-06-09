"use client";

import { motion } from "framer-motion";
import { slideInFromLeft } from "@/lib/motion";
import { SK_HERO } from "@/constants/sk";

export const SkHero = () => {
  return (
    <div
      id="domov"
      className="relative flex flex-col h-full w-full max-w-full overflow-hidden"
    >
      {/* Blackhole ambient — identical asset + positioning to the EN hero */}
      <video
        autoPlay
        muted
        loop
        preload="auto"
        playsInline
        className="rotate-180 absolute top-[-355px] md:top-[-340px] left-1/2 -translate-x-1/2 w-[350%] md:w-full md:left-0 md:translate-x-0 h-full object-contain -z-10 pointer-events-none"
      >
        <source src="/videos/blackhole.webm" type="video/webm" />
      </video>

      {/*
        Mobile min-h is 685px (vs the EN hero's 650px) on purpose: the blackhole
        video is sized by `h-full` off this container, so to land it at the same
        vertical position as the EN home its container must be the same height.
        The leaner SK copy bottoms out at the 650px floor, while the EN hero's
        extra paragraph runs ~658–712px on mobile (~685px at 390px) — so 685px
        matches EN. Desktop keeps 650px (EN parity there is unchanged).
      */}
      <motion.div
        initial="hidden"
        animate="visible"
        className="flex flex-col min-h-[685px] md:min-h-[650px] pb-20 items-center justify-center px-3 md:px-20 mt-40 md:pb-0 w-full max-w-full z-[20]"
      >
        <div className="h-full w-full flex flex-col items-center gap-6 justify-center m-auto">
          {/* Headline */}
          <motion.h1
            variants={slideInFromLeft(0.5)}
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
            variants={slideInFromLeft(0.8)}
            className="text-lg md:text-2xl text-gray-300 max-w-[720px] text-center font-medium"
          >
            {SK_HERO.subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={slideInFromLeft(1)}
            className="flex flex-col sm:flex-row gap-4 mt-4 items-center justify-center"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={SK_HERO.ctaPrimary.href}
              className="py-3 px-8 button-primary text-center text-white cursor-pointer rounded-lg font-semibold"
            >
              {SK_HERO.ctaPrimary.label}
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={SK_HERO.ctaSecondary.href}
              className="py-3 px-8 text-center text-gray-200 cursor-pointer rounded-lg font-semibold border border-white/15 hover:border-white/30 hover:text-white transition-colors"
            >
              {SK_HERO.ctaSecondary.label}
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
