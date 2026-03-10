"use client";

import { motion } from "framer-motion";
import { slideInFromTop } from "@/lib/motion";
import Link from "next/link";
import { useParams } from "next/navigation";

// This would typically come from a CMS or database
const BLOG_POSTS: Record<string, {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  content: string[];
}> = {
  "ai-engineering-2026": {
    title: "The Rise of AI Engineering in 2026",
    excerpt: "How AI-native development practices are reshaping the software industry and what it means for modern product teams.",
    category: "AI & Engineering",
    date: "March 5, 2026",
    readTime: "8 min read",
    author: "M.D.N Tech Team",
    content: [
      "The software development landscape has fundamentally shifted. What we once called 'AI-assisted development' has evolved into something far more profound: AI-native engineering.",
      "This article explores how modern development teams are integrating AI at every layer of the product lifecycle — from discovery and architecture to implementation and deployment.",
      "Content coming soon...",
    ],
  },
  "web3-enterprise-adoption": {
    title: "Web3 Enterprise Adoption: Beyond the Hype",
    excerpt: "A practical look at how enterprises are implementing blockchain technology for real business value.",
    category: "Blockchain & Web3",
    date: "February 28, 2026",
    readTime: "6 min read",
    author: "M.D.N Tech Team",
    content: [
      "The enterprise blockchain landscape in 2026 looks nothing like the speculative frenzy of years past. Today, serious organizations are deploying Web3 infrastructure for tangible business outcomes.",
      "In this article, we examine real-world implementations and the engineering decisions that make enterprise Web3 projects succeed.",
      "Content coming soon...",
    ],
  },
  "full-stack-ownership": {
    title: "Why Full-Stack Ownership Beats Team Handoffs",
    excerpt: "The case for single-engineer ownership and how it accelerates delivery without sacrificing quality.",
    category: "Engineering",
    date: "February 20, 2026",
    readTime: "5 min read",
    author: "M.D.N Tech Team",
    content: [
      "The traditional model of specialized teams — frontend, backend, DevOps, QA — creates friction that slows every project. Handoffs lose context. Communication gaps introduce bugs. Timelines stretch.",
      "Here's why full-stack ownership delivers better results faster.",
      "Content coming soon...",
    ],
  },
  "production-ready-ai": {
    title: "Building Production-Ready AI Systems",
    excerpt: "From prototype to production: the engineering practices that separate demos from real AI products.",
    category: "AI & Engineering",
    date: "February 15, 2026",
    readTime: "10 min read",
    author: "M.D.N Tech Team",
    content: [
      "Anyone can build an AI demo. The challenge is building AI that works reliably at scale, handles edge cases gracefully, and maintains performance under real-world conditions.",
      "This guide covers the engineering practices that separate production-grade AI systems from impressive prototypes.",
      "Content coming soon...",
    ],
  },
  "mobile-web3-integration": {
    title: "Mobile Apps Meet Web3: A Developer's Guide",
    excerpt: "Integrating wallet connections, on-chain data, and Web3 features into React Native and Flutter apps.",
    category: "Mobile & Web3",
    date: "February 8, 2026",
    readTime: "7 min read",
    author: "M.D.N Tech Team",
    content: [
      "Mobile Web3 development presents unique challenges: managing wallet connections, handling on-chain transactions, and providing smooth UX despite blockchain latency.",
      "This guide walks through the practical patterns for building Web3-enabled mobile applications.",
      "Content coming soon...",
    ],
  },
  "scaling-without-rewrites": {
    title: "Scaling Without Expensive Rewrites",
    excerpt: "Architecture decisions that let your codebase grow without accumulating technical debt.",
    category: "Engineering",
    date: "February 1, 2026",
    readTime: "6 min read",
    author: "M.D.N Tech Team",
    content: [
      "The most expensive line of code is the one you have to rewrite. Yet most startups face major rewrites within their first few years of growth.",
      "Here's how to make architecture decisions early that support scale without requiring expensive overhauls.",
      "Content coming soon...",
    ],
  },
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = BLOG_POSTS[slug];

  if (!post) {
    return (
      <main className="min-h-screen w-full pt-20">
        <section className="relative flex flex-col items-center justify-center py-20 px-4 md:px-8 lg:px-20 overflow-hidden">
          <div className="relative z-10 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Article Not Found</h1>
            <p className="text-gray-400 mb-8">The article you&apos;re looking for doesn&apos;t exist.</p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:from-purple-600 hover:to-cyan-600 transition-all duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>
              Back to Blog
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full pt-20">
      <article className="relative flex flex-col items-center justify-center py-20 px-4 md:px-8 lg:px-20 overflow-hidden">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 w-full max-w-4xl mx-auto mb-8"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
            Back to Blog
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideInFromTop}
          className="relative z-10 text-center mb-12 max-w-4xl mx-auto"
        >
          {/* Category */}
          <div className="mb-4">
            <span className="px-4 py-1.5 text-sm font-medium text-white bg-purple-500/80 backdrop-blur-sm rounded-full">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-4">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center justify-center gap-4 text-gray-400">
            <span>{post.author}</span>
            <span className="w-1 h-1 rounded-full bg-gray-500" />
            <span>{post.date}</span>
            <span className="w-1 h-1 rounded-full bg-gray-500" />
            <span>{post.readTime}</span>
          </div>
        </motion.div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="p-8 md:p-12 rounded-xl border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm">
              {/* Excerpt */}
              <p className="text-xl text-gray-300 leading-relaxed mb-8 pb-8 border-b border-purple-500/20">
                {post.excerpt}
              </p>

              {/* Article Content */}
              <div className="prose prose-invert prose-lg max-w-none">
                {post.content.map((paragraph, index) => (
                  <p key={index} className="text-gray-300 leading-relaxed mb-6">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Coming Soon Notice */}
              <div className="mt-12 p-6 rounded-lg bg-[#7042f810] border border-purple-500/20">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
                  <p className="text-gray-400">
                    Full article content coming soon. Check back for the complete piece.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative z-10 mt-16 text-center"
        >
          <p className="text-gray-400 mb-4">Interested in working with us?</p>
          <Link
            href="/#contact-us"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:from-purple-600 hover:to-cyan-600 transition-all duration-300"
          >
            Start Your Project
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </motion.div>
      </article>
    </main>
  );
}
