"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { BlackholeVideo } from "@/components/main/blackhole-video";
import {
  HERO_BLACKHOLE_CLASS,
  HERO_CONTENT_CLASS,
  HERO_SECTION_CLASS,
} from "@/components/main/hero-shell";
import { enterDelay } from "@/components/product-pages/primitives";
import type { BlogPost } from "@/data/blog-posts";

import { BANNER_BG, Constellation, DEFAULT_BANNER_BG } from "./constellation";

// /blog hero on THE shared full-viewport shell. A listing page has no CTA
// pair, so the hero earns its viewport with content instead: the latest
// article rides inside the fold as a wide featured panel ("every section
// earns its scroll" — an empty 100svh of heading would be the empty-spectacle
// anti-reference).
//
// Heading semantics: h1 (page) -> sr-only h2 "Featured" -> h3 (article title),
// so the visible white title never competes with the gradient-crowned h2
// grammar and no heading level is skipped.
export const BlogHero = ({ featured }: { featured: BlogPost }) => (
  <div id="blog-top" className={HERO_SECTION_CLASS}>
    <BlackholeVideo className={HERO_BLACKHOLE_CLASS} />

    {/* Entrance is CSS (.hero-enter-up) — the h1 is this page's LCP element
        and must paint before hydration; framer stays for the hover lift. */}
    <section className={HERO_CONTENT_CLASS}>
      {/* md:pt-24 — this hero's content block is taller than the others
          (featured panel), so pure centering pushes the h1 up into the ring's
          glow at desktop heights; the padding buys the headline clear space. */}
      <div className="flex w-full max-w-4xl flex-col items-center md:pt-24">
        <h1
          className="hero-enter-up max-w-4xl break-words text-center text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500"
          style={enterDelay(0.05)}
        >
          AI Engineering, In Practice
        </h1>

        <p
          className="hero-enter-up mt-6 max-w-3xl text-center text-lg md:text-xl text-gray-300 leading-relaxed"
          style={enterDelay(0.3)}
        >
          Deep guides on Claude Code, agentic systems and smart-contract
          engineering — field notes from a team that ships with these tools
          every day.
        </p>

        {/* Featured: the latest article, inside the fold. The CSS entrance
            fill-mode is `backwards` precisely so this element's framer hover
            transform works once the entrance has finished. */}
        <motion.div
          whileHover={{ y: -4 }}
          className="hero-enter-up group mt-12 w-full"
          style={enterDelay(0.5)}
        >
          <h2 className="sr-only">Featured article</h2>
          <Link
            href={`/blog/${featured.id}`}
            className="flex flex-col md:flex-row overflow-hidden rounded-xl border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm transition-colors duration-300 hover:border-purple-500/70"
          >
            <div
              className={`relative h-40 md:h-auto md:w-2/5 overflow-hidden ${
                BANNER_BG[featured.category] ?? DEFAULT_BANNER_BG
              }`}
            >
              <Constellation
                seed={featured.id}
                className="absolute inset-0 h-full w-full opacity-70 transition-opacity duration-500 group-hover:opacity-100"
              />
              <span className="absolute top-4 left-4 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400 backdrop-blur-sm">
                Latest
              </span>
            </div>

            <div className="flex flex-1 flex-col p-6 md:p-8 text-left">
              <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-gray-400">
                <span>{featured.category}</span>
                <span
                  aria-hidden="true"
                  className="h-1 w-1 rounded-full bg-gray-500"
                />
                <span>{featured.date}</span>
                <span
                  aria-hidden="true"
                  className="h-1 w-1 rounded-full bg-gray-500"
                />
                <span>{featured.readTime}</span>
              </div>

              <h3 className="text-xl md:text-2xl font-semibold text-white transition-colors duration-300 group-hover:text-cyan-400">
                {featured.title}
              </h3>

              <p className="mt-3 text-sm md:text-base leading-relaxed text-gray-300 line-clamp-3">
                {featured.excerpt}
              </p>

              <div className="mt-auto flex items-center gap-2 pt-5 text-sm font-medium text-cyan-400 transition-all duration-300 group-hover:gap-3">
                <span>Read article</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  </div>
);
