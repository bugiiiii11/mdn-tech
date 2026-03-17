"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { getAllPosts, BlogPost } from "@/data/blog-posts";
import { slideInFromTop } from "@/lib/motion";

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

// Category icon component
const CategoryIcon = ({ category }: { category: string }) => {
  if (category === "AI & Engineering") {
    // Brain/Neural Network icon for AI
    return (
      <svg
        className="w-20 h-20 text-purple-400/30 group-hover:text-purple-400/50 transition-colors duration-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
        />
        {/* Neural connections */}
        <circle cx="12" cy="8" r="1.5" fill="currentColor" opacity="0.5" />
        <circle cx="8" cy="11" r="1" fill="currentColor" opacity="0.4" />
        <circle cx="16" cy="11" r="1" fill="currentColor" opacity="0.4" />
        <circle cx="10" cy="14" r="0.75" fill="currentColor" opacity="0.3" />
        <circle cx="14" cy="14" r="0.75" fill="currentColor" opacity="0.3" />
      </svg>
    );
  }

  if (category === "Blockchain & Web3") {
    // Blockchain/Connected nodes icon
    return (
      <svg
        className="w-20 h-20 text-cyan-400/30 group-hover:text-cyan-400/50 transition-colors duration-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1}
      >
        {/* Central cube */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
        />
        {/* Connection nodes */}
        <circle cx="12" cy="2.5" r="1.5" fill="currentColor" opacity="0.4" />
        <circle cx="3" cy="7.5" r="1.5" fill="currentColor" opacity="0.4" />
        <circle cx="21" cy="7.5" r="1.5" fill="currentColor" opacity="0.4" />
        <circle cx="3" cy="16.5" r="1.5" fill="currentColor" opacity="0.4" />
        <circle cx="21" cy="16.5" r="1.5" fill="currentColor" opacity="0.4" />
        <circle cx="12" cy="21.5" r="1.5" fill="currentColor" opacity="0.4" />
      </svg>
    );
  }

  // Default tech icon
  return (
    <svg
      className="w-20 h-20 text-gray-400/30 group-hover:text-gray-400/50 transition-colors duration-300"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
      />
    </svg>
  );
};

const BlogCard = ({ post, index }: BlogCardProps) => {
  // Check if this is a full article (has more than just intro + callout)
  const isFullArticle = post.content.length > 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.1, 0.3) }}
      className="group will-change-transform"
    >
      <Link href={`/blog/${post.id}`} className="block">
        <div className="relative h-full rounded-xl border border-[#7042f88b] bg-[#0c0424]/80 overflow-hidden transition-all duration-300 hover:border-purple-500/50 hover:bg-[#0c0424]/90">
          {/* Image Container */}
          <div className="relative h-48 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 z-10" />
            {/* Placeholder gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-[#030014] to-cyan-900/50" />

            {/* Category Icon - Centered */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <CategoryIcon category={post.category} />
            </div>

            {/* Featured Badge for full articles */}
            {isFullArticle && (
              <div className="absolute top-4 right-4 z-20">
                <span className="px-2 py-1 text-xs font-medium text-cyan-400 bg-cyan-500/20 backdrop-blur-sm rounded-full border border-cyan-500/30">
                  Featured
                </span>
              </div>
            )}

            {/* Category Badge */}
            <div className="absolute top-4 left-4 z-20">
              <span className="px-3 py-1 text-xs font-medium text-white bg-purple-500/80 backdrop-blur-sm rounded-full">
                {post.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Meta */}
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
              <span>{post.date}</span>
              <span className="w-1 h-1 rounded-full bg-gray-500" />
              <span>{post.readTime}</span>
            </div>

            {/* Title - Always use gradient text, transition gradient colors */}
            <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-white group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-300 mb-3">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>

            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs text-gray-400 bg-[#7042f810] rounded border border-[#7042f830]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Read More Link */}
            <div className="mt-4 flex items-center gap-2 text-cyan-400 text-sm font-medium group-hover:gap-3 transition-all duration-300">
              <span>Read article</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
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
            </div>
          </div>

          {/* Hover Glow Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-cyan-500/5" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen w-full pt-20">
      <section className="relative flex flex-col items-center justify-center py-20 px-4 md:px-8 lg:px-20 overflow-hidden">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={slideInFromTop}
          className="relative z-10 text-center mb-16 max-w-4xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 inline-block mb-6">
            Our Blog
          </h1>
          <p className="text-lg text-gray-400">
            Insights on AI engineering, Web3 development, and building production-ready systems from the M.D.N Tech team.
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </div>

        {/* Coming Soon Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="relative z-10 mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#7042f88b] bg-[#0c0424]/80">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm text-gray-400">More articles coming soon</span>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
