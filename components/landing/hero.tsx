"use client";

import { motion } from "framer-motion";

import { slideInFromLeft } from "@/lib/motion";
import { APP_URL } from "@/lib/marketing/products";

// New product-first hero (website-rebuild v2.0). Background block copied from
// components/main/hero.tsx — keeps id="home" (footer logo links to /#home).
export const LandingHero = () => {
  return (
    <div
      id="home"
      className="relative flex flex-col h-full w-full max-w-full overflow-hidden"
    >
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
        className="flex flex-row min-h-[650px] pb-20 items-center justify-center px-3 md:px-20 mt-40 md:pb-0 w-full max-w-full z-[20]"
      >
        <div className="h-full w-full flex flex-col items-center gap-5 justify-center m-auto text-start">
          <motion.div
            variants={slideInFromLeft(0.3)}
            className="Welcome-box py-[8px] px-[12px] border border-[#7042f88b] opacity-[0.9] rounded-full"
          >
            <span className="Welcome-text text-[13px] text-gray-300">
              ✦ AI-Powered Developer Tools
            </span>
          </motion.div>

          <motion.h1
            variants={slideInFromLeft(0.5)}
            className="flex flex-col gap-6 mt-6 text-4xl md:text-6xl lg:text-7xl text-bold text-white w-full max-w-full"
          >
            <span className="text-center break-words">
              <span className="text-transparent bg-clip-text font-bold bg-gradient-to-r from-purple-500 to-cyan-500">
                Your Tools.
              </span>{" "}
              <span className="text-transparent bg-clip-text font-bold bg-gradient-to-r from-cyan-500 to-purple-500">
                Your Rules.
              </span>
            </span>
          </motion.h1>

          <motion.p
            variants={slideInFromLeft(0.8)}
            className="text-xl md:text-2xl text-gray-300 my-5 max-w-[700px] text-center font-medium"
          >
            Production-ready AI, Web3, and automation tools — built by
            engineers, ready to deploy.
          </motion.p>

          <motion.p
            variants={slideInFromLeft(0.9)}
            className="text-base md:text-lg text-gray-400 my-2 max-w-[700px] text-center leading-relaxed"
          >
            M.D.N Tech builds self-service developer tools that solve real
            problems. No sales calls, no onboarding meetings. Sign up,
            configure, and ship.
          </motion.p>

          <motion.div
            variants={slideInFromLeft(1)}
            className="flex flex-col sm:flex-row gap-4 mt-8 items-center justify-center"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={APP_URL}
              className="py-3 px-8 button-primary text-center text-white cursor-pointer rounded-lg font-semibold"
            >
              Open the App
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#products"
              className="py-3 px-8 text-center text-white cursor-pointer rounded-lg font-semibold border border-[#7042f88b] bg-[#7042f815] hover:bg-[#7042f825] transition-colors"
            >
              Explore Products
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
