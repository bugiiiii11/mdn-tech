"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Blog post data - you can move this to a separate file or CMS later
const BLOG_POSTS = [
  {
    id: "ai-engineering-2026",
    title: "The Rise of AI Engineering in 2026",
    excerpt: "How AI-native development practices are reshaping the software industry and what it means for modern product teams.",
    image: "/blog/placeholder-1.jpg",
    category: "AI & Engineering",
    date: "March 5, 2026",
    readTime: "8 min read",
  },
  {
    id: "web3-enterprise-adoption",
    title: "Web3 Enterprise Adoption: Beyond the Hype",
    excerpt: "A practical look at how enterprises are implementing blockchain technology for real business value.",
    image: "/blog/placeholder-2.jpg",
    category: "Blockchain & Web3",
    date: "February 28, 2026",
    readTime: "6 min read",
  },
  {
    id: "full-stack-ownership",
    title: "Why Full-Stack Ownership Beats Team Handoffs",
    excerpt: "The case for single-engineer ownership and how it accelerates delivery without sacrificing quality.",
    image: "/blog/placeholder-3.jpg",
    category: "Engineering",
    date: "February 20, 2026",
    readTime: "5 min read",
  },
  {
    id: "production-ready-ai",
    title: "Building Production-Ready AI Systems",
    excerpt: "From prototype to production: the engineering practices that separate demos from real AI products.",
    image: "/blog/placeholder-4.jpg",
    category: "AI & Engineering",
    date: "February 15, 2026",
    readTime: "10 min read",
  },
  {
    id: "mobile-web3-integration",
    title: "Mobile Apps Meet Web3: A Developer's Guide",
    excerpt: "Integrating wallet connections, on-chain data, and Web3 features into React Native and Flutter apps.",
    image: "/blog/placeholder-5.jpg",
    category: "Mobile & Web3",
    date: "February 8, 2026",
    readTime: "7 min read",
  },
  {
    id: "scaling-without-rewrites",
    title: "Scaling Without Expensive Rewrites",
    excerpt: "Architecture decisions that let your codebase grow without accumulating technical debt.",
    image: "/blog/placeholder-6.jpg",
    category: "Engineering",
    date: "February 1, 2026",
    readTime: "6 min read",
  },
];

interface BlogCardProps {
  post: typeof BLOG_POSTS[0];
  index: number;
}

const BlogCard = ({ post, index }: BlogCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/blog/${post.id}`} className="block">
        <div className="relative h-full rounded-xl border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-purple-500/50 hover:bg-[#7042f825]">
          {/* Image Container */}
          <div className="relative h-48 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 z-10" />
            {/* Placeholder gradient when no image */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-[#030014] to-cyan-900/50" />
            {/* Uncomment when you have actual images */}
            {/* <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            /> */}

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

            {/* Title */}
            <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-300">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>

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
  return (
    <main className="min-h-screen w-full pt-20">
      <section className="relative flex flex-col items-center justify-center py-20 px-4 md:px-8 lg:px-20 overflow-hidden">
        {/* Header */}
        <motion.h1
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5 },
            },
          }}
          className="text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-10 text-center"
        >
          Our Blog
        </motion.h1>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, delay: 0.2 },
            },
          }}
          className="text-lg text-gray-400 text-center mb-16 max-w-2xl"
        >
          Insights on AI engineering, Web3 development, and building production-ready systems from the M.D.N Tech team.
        </motion.p>

        {/* Blog Grid */}
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </div>

        {/* Coming Soon Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="relative z-10 mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm text-gray-400">More articles coming soon</span>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
