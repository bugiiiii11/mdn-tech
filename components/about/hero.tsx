"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { BlackholeVideo } from "@/components/main/blackhole-video";
import {
  HERO_BLACKHOLE_CLASS,
  HERO_CONTENT_CLASS,
  HERO_CTA_PRIMARY_CLASS,
  HERO_CTA_SECONDARY_CLASS,
  HERO_SECTION_CLASS,
} from "@/components/main/hero-shell";
import { PROSE_LINK_CLASS } from "@/components/product-pages/static-primitives";
import { enterDelay } from "@/components/product-pages/primitives";

// /about hero on THE shared full-viewport shell (see hero-shell.ts). Replaces
// the pre-rebuild landing hero this page inherited ("Build Smarter. Ship
// Faster." + landing CTAs) with company-page copy: the h1 matches the page's
// <title> ("The Team Behind the Tools"), and the support paragraph keeps the
// S57-approved products-first framing with the ChatKit/ToolKit prose links.
// Keeps id="home" — the first anchor of the legacy-id tree this page hosts.
export const AboutHero = () => (
  <div id="home" className={HERO_SECTION_CLASS}>
    <BlackholeVideo className={HERO_BLACKHOLE_CLASS} />

    {/* Entrance is CSS (.hero-enter-up) — the h1 is this page's LCP element
        and must paint before hydration; framer stays for the CTA gestures. */}
    <section className={HERO_CONTENT_CLASS}>
      <div className="flex w-full flex-col items-center">
        <h1
          className="hero-enter-up max-w-4xl break-words text-center text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500"
          style={enterDelay(0.05)}
        >
          The Team Behind the Tools
        </h1>

        <p
          className="hero-enter-up mt-6 max-w-3xl text-center text-xl md:text-2xl font-medium text-gray-300"
          style={enterDelay(0.3)}
        >
          Full-stack AI engineers who own every phase of the project lifecycle
          — from idea to production-ready systems, faster and more secure than
          traditional development.
        </p>

        <p
          className="hero-enter-up mt-6 max-w-2xl text-center text-base md:text-lg text-gray-300 leading-relaxed"
          style={enterDelay(0.45)}
        >
          Most of our time goes into our own self-service products —{" "}
          <Link href="/chatkit" className={PROSE_LINK_CLASS}>
            ChatKit
          </Link>{" "}
          and{" "}
          <Link href="/toolkit" className={PROSE_LINK_CLASS}>
            ToolKit
          </Link>{" "}
          — and we take on select custom development projects alongside them.
        </p>

        <div
          className="hero-enter-up mt-10 flex flex-col sm:flex-row items-center gap-4"
          style={enterDelay(0.6)}
        >
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#contact-us"
            className={HERO_CTA_PRIMARY_CLASS}
          >
            Start Your Project
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#process"
            className={HERO_CTA_SECONDARY_CLASS}
          >
            See How We Build
          </motion.a>
        </div>
      </div>
    </section>
  </div>
);
