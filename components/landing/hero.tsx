"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";

import { APP_LIVE, APP_URL } from "@/lib/marketing/products";
import { BlackholeVideo } from "@/components/main/blackhole-video";
import {
  HERO_BLACKHOLE_CLASS,
  HERO_CONTENT_CLASS,
  HERO_CTA_DISABLED_CLASS,
  HERO_CTA_PRIMARY_CLASS,
  HERO_CTA_SECONDARY_CLASS,
  HERO_SECTION_CLASS,
} from "@/components/main/hero-shell";

const delay = (s: number) => ({ "--enter-delay": `${s}s` }) as CSSProperties;

// Product-first hero (website-rebuild v2.1). Shape, framing and button sizing
// all come from components/main/hero-shell.ts, which /sk, /chatkit and /toolkit
// share — see that file for why the blackhole is sized independently of the
// hero. Keeps id="home" (footer logo links to /#home).
//
// Entrance is CSS (.hero-enter-left in globals.css), not framer-motion: this
// text is the LCP element, and a framer entrance server-renders it at
// opacity:0 until hydration. framer stays only for the CTA hover gestures.
export const LandingHero = () => {
  return (
    <div id="home" className={HERO_SECTION_CLASS}>
      <BlackholeVideo className={HERO_BLACKHOLE_CLASS} />

      <div className={HERO_CONTENT_CLASS}>
        <div className="w-full flex flex-col items-center gap-5 justify-center text-start">
          <h1
            className="hero-enter-left flex flex-col gap-6 text-4xl md:text-6xl lg:text-7xl text-white w-full max-w-full"
            style={delay(0.3)}
          >
            <span className="text-center break-words">
              <span className="text-transparent bg-clip-text font-bold bg-gradient-to-r from-purple-500 to-cyan-500">
                Grow Your Business
              </span>{" "}
              <span className="text-transparent bg-clip-text font-bold bg-gradient-to-r from-cyan-500 to-purple-500">
                with AI.
              </span>
            </span>
          </h1>

          <p
            className="hero-enter-left text-xl md:text-2xl text-gray-300 my-5 max-w-[700px] text-center font-medium"
            style={delay(0.55)}
          >
            An AI chatbot grounded in your content, free Claude Code skills,
            and more — self-service tools that go live in minutes, no sales
            calls.
          </p>

          <div
            className="hero-enter-left flex flex-col sm:flex-row gap-4 mt-8 items-center justify-center"
            style={delay(0.75)}
          >
            {/* "Start Free" goes to the portal, so it becomes an inert state
                while the portal is closed (APP_LIVE). The secondary button
                keeps the fold actionable — it leads to the product sections,
                which is where a visitor can still do something today.
                order-last: on mobile the stack is vertical and the first thumb
                target must be the live CTA, not the dead state. */}
            {APP_LIVE ? (
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={APP_URL}
                className={HERO_CTA_PRIMARY_CLASS}
              >
                Start Free
              </motion.a>
            ) : (
              <span
                aria-disabled="true"
                className={`${HERO_CTA_DISABLED_CLASS} order-last sm:order-none`}
              >
                Coming soon
              </span>
            )}
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#products"
              className={HERO_CTA_SECONDARY_CLASS}
            >
              Explore the Tools
            </motion.a>
          </div>
        </div>
      </div>
    </div>
  );
};
