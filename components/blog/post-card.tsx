"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { fadeUp } from "@/components/product-pages/primitives";
import type { BlogPost } from "@/data/blog-posts";

import { BANNER_BG, Constellation, DEFAULT_BANNER_BG } from "./constellation";

// Blog grid card on the product-page motion grammar (fadeUp on scroll, 4px
// hover lift) instead of the old bespoke slide-ins. Two deliberate fixes from
// the previous card: the title is solid white -> cyan on hover (gradient text
// is reserved for h1/h2 — the Gradient Crown Rule), and the excerpt is
// gray-300, not gray-400 (the Legibility Floor Rule: if it matters, it is not
// muted).
export const BlogPostCard = ({
  post,
  index,
}: {
  post: BlogPost;
  index: number;
}) => (
  <motion.article
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    variants={fadeUp(Math.min(index * 0.1, 0.3))}
    whileHover={{ y: -4 }}
    className="group h-full"
  >
    <Link
      href={`/blog/${post.id}`}
      className="flex h-full flex-col overflow-hidden rounded-xl border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm transition-colors duration-300 hover:border-purple-500/70"
    >
      {/* Constellation banner — unique per post, brightens on hover. */}
      <div
        className={`relative h-44 overflow-hidden ${
          BANNER_BG[post.category] ?? DEFAULT_BANNER_BG
        }`}
      >
        <Constellation
          seed={post.id}
          className="absolute inset-0 h-full w-full opacity-70 transition-opacity duration-500 group-hover:opacity-100"
        />
        <span className="absolute top-4 left-4 rounded-full border border-purple-500/40 bg-purple-500/20 px-3 py-1 text-xs font-medium text-purple-200 backdrop-blur-sm">
          {post.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-3 text-sm text-gray-400">
          <span>{post.date}</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-gray-500" />
          <span>{post.readTime}</span>
        </div>

        <h3 className="mb-3 text-xl font-semibold text-white transition-colors duration-300 group-hover:text-cyan-400">
          {post.title}
        </h3>

        <p className="text-sm leading-relaxed text-gray-300 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded border border-[#7042f830] bg-[#7042f810] px-2 py-0.5 text-xs text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>

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
  </motion.article>
);
