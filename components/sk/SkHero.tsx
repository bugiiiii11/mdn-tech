"use client";

import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import { slideInFromLeft } from "@/lib/motion";
import { SK_HERO } from "@/constants/sk";

export const SkHero = () => {
  return (
    <div
      id="domov"
      className="relative flex flex-col h-full w-full max-w-full overflow-hidden"
    >
      {/* Blackhole ambient — same asset as EN hero */}
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

      <motion.div
        initial="hidden"
        animate="visible"
        className="flex flex-col min-h-[650px] pb-20 items-center justify-center px-3 md:px-20 mt-40 md:pb-0 w-full max-w-full z-[20]"
      >
        <div className="h-full w-full flex flex-col items-center gap-5 justify-center m-auto">
          {/* Eyebrow */}
          <motion.span
            variants={slideInFromLeft(0.3)}
            className="px-4 py-1.5 rounded-full border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm text-cyan-300 text-xs md:text-sm font-medium tracking-wide"
          >
            {SK_HERO.eyebrow}
          </motion.span>

          {/* Headline */}
          <motion.h1
            variants={slideInFromLeft(0.5)}
            className="flex flex-col gap-2 mt-2 text-4xl md:text-6xl lg:text-7xl font-bold text-white w-full max-w-full text-center"
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
            className="text-lg md:text-2xl text-gray-300 mt-3 max-w-[760px] text-center font-medium"
          >
            {SK_HERO.subtitle}
          </motion.p>

          {/* Description */}
          <motion.p
            variants={slideInFromLeft(0.9)}
            className="text-base md:text-lg text-gray-400 max-w-[700px] text-center leading-relaxed"
          >
            {SK_HERO.description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={slideInFromLeft(1)}
            className="flex flex-col sm:flex-row gap-4 mt-6 items-center justify-center"
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

          {/* Trust badges */}
          <motion.div
            variants={slideInFromLeft(1.1)}
            className="flex flex-wrap gap-x-6 gap-y-2 mt-6 items-center justify-center"
          >
            {SK_HERO.trustBadges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-2 text-sm text-gray-400"
              >
                <FiCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                {badge}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
