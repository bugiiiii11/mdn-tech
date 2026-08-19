"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { slideInFromTop } from "@/lib/motion";
import Link from "next/link";
import { PROSE_LINK_CLASS } from "@/components/product-pages/primitives";
import {
  blogBreadcrumb,
  ContentBlock,
  ContentLink,
  BlogPost,
  BlogPostPreview,
} from "@/data/blog-posts";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * "2026-08-19" -> "August 19, 2026". Split on the ISO separator rather than
 * handing the string to Date: the parser this replaces was locale-dependent and
 * silently stamped TODAY whenever it failed, fabricating freshness (S68).
 */
const formatIsoDate = (iso: string) => {
  const [year, month, day] = iso.split("-").map(Number);
  const name = MONTHS[month - 1];
  return name && year && day ? `${name} ${day}, ${year}` : iso;
};

/**
 * Citations for the block above, on their own line (SEO audit item 15). Rendered
 * outside the block's own element so a <ul> stays a list and a callout keeps its
 * single paragraph — the trailing-link pattern from the product-page FAQ.
 */
const BlockLinks = ({
  links,
  label,
}: {
  links: ContentLink[];
  label?: string;
}) => (
  <p className="-mt-3 mb-6 text-sm text-gray-400">
    {label ?? (links.length > 1 ? "Sources" : "Source")}:{" "}
    {links.map((link, i) => (
      <span key={link.href}>
        {i > 0 ? ", " : null}
        {link.external ? (
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={PROSE_LINK_CLASS}
          >
            {link.label}
          </a>
        ) : (
          <Link href={link.href} className={PROSE_LINK_CLASS}>
            {link.label}
          </Link>
        )}
      </span>
    ))}
  </p>
);

// Content block renderer
const renderContent = (block: ContentBlock, index: number) => {
  switch (block.type) {
    case "paragraph":
      return (
        <p key={index} className="text-gray-300 leading-relaxed mb-6">
          {block.content}
        </p>
      );

    case "heading":
      return (
        <h2
          key={index}
          className="text-2xl font-semibold text-white mt-12 mb-6 pb-2 border-b border-purple-500/20"
        >
          {block.content}
        </h2>
      );

    case "subheading":
      return (
        <h3
          key={index}
          className="text-xl font-semibold text-gray-200 mt-8 mb-4"
        >
          {block.content}
        </h3>
      );

    case "list":
      return (
        <ul key={index} className="mb-6 space-y-2">
          {block.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2.5 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case "code":
      return (
        <div key={index} className="mb-6 rounded-lg overflow-hidden border border-purple-500/20">
          {block.language && (
            <div className="bg-[#1a1a2e] px-4 py-2 border-b border-purple-500/20">
              <span className="text-xs font-mono text-gray-500">{block.language}</span>
            </div>
          )}
          <pre className="bg-[#0d0d1a] p-4 overflow-x-auto">
            <code className="text-sm font-mono text-gray-300 whitespace-pre">
              {block.content}
            </code>
          </pre>
        </div>
      );

    case "callout":
      const variants = {
        info: {
          bg: "bg-blue-500/10",
          border: "border-blue-500/30",
          icon: (
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
        tip: {
          bg: "bg-green-500/10",
          border: "border-green-500/30",
          icon: (
            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          ),
        },
        warning: {
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/30",
          icon: (
            <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
        },
        stat: {
          bg: "bg-purple-500/10",
          border: "border-purple-500/30",
          icon: (
            <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          ),
        },
      };
      const variant = variants[block.variant || "info"];
      return (
        <div
          key={index}
          className={`mb-6 p-4 rounded-lg ${variant.bg} border ${variant.border} flex items-start gap-3`}
        >
          <div className="flex-shrink-0 mt-0.5">{variant.icon}</div>
          <p className="text-gray-300">{block.content}</p>
        </div>
      );

    case "quote":
      // Legibility Floor: quotes carry meaning — gray-300, not gray-400.
      return (
        <blockquote
          key={index}
          className="mb-6 pl-4 border-l-2 border-cyan-500 italic text-gray-300"
        >
          {block.content}
        </blockquote>
      );

    default:
      return null;
  }
};

// Related post card. BlogPostPreview, never BlogPost: this file is a client
// component, so these props ship inside the RSC flight payload — two full
// posts here inlined two entire spare articles into every article's HTML.
const RelatedPostCard = ({ post }: { post: BlogPostPreview }) => (
  <Link href={`/blog/${post.id}`} className="block group">
    <div className="p-4 rounded-lg border border-[#7042f830] bg-[#7042f810] hover:border-purple-500/50 transition-all duration-300">
      <span className="text-xs text-purple-400 mb-2 block">{post.category}</span>
      <h4 className="text-white font-medium group-hover:text-cyan-400 transition-colors line-clamp-2">
        {post.title}
      </h4>
    </div>
  </Link>
);

interface BlogPostContentProps {
  post: BlogPost;
  relatedPosts: BlogPostPreview[];
}

export default function BlogPostContent({ post, relatedPosts }: BlogPostContentProps) {
  const breadcrumb = blogBreadcrumb(post);

  return (
    <main className="min-h-screen w-full pt-20">
      <article className="relative flex flex-col items-center justify-center py-20 px-4 md:px-8 lg:px-20 overflow-hidden">
        {/* Visible breadcrumb — the BreadcrumbList in page.tsx is built from
            this same array, so the schema cannot claim a trail the reader
            cannot see. min-h-[24px] keeps the links a legal tap target. */}
        <nav aria-label="Breadcrumb" className="relative z-10 mb-8 w-full max-w-4xl">
          <ol className="flex flex-wrap items-center justify-center gap-x-2 text-xs md:text-sm text-gray-400">
            {breadcrumb.map((crumb, index) => {
              const isLast = index === breadcrumb.length - 1;
              return (
                <li key={crumb.href} className="flex items-center gap-x-2">
                  {index > 0 ? (
                    <span aria-hidden="true" className="text-gray-600">
                      /
                    </span>
                  ) : null}
                  {isLast ? (
                    <span
                      aria-current="page"
                      className="inline-flex min-h-[24px] items-center text-gray-300 line-clamp-1"
                    >
                      {crumb.name}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="inline-flex min-h-[24px] items-center transition-colors hover:text-cyan-400"
                    >
                      {crumb.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Header - Clean style like Terms page */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={slideInFromTop}
          className="relative z-10 text-center mb-16 max-w-4xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 mb-6">
            {post.title}
          </h1>
          {/* Named byline, matching the Person node in the Article schema —
              "M.D.N Tech Team" carried no E-E-A-T signal at all. */}
          <p className="text-lg text-gray-400">
            By{" "}
            <Link href="/about" className={PROSE_LINK_CLASS}>
              {post.author}
            </Link>
            {post.authorRole ? `, ${post.authorRole}` : null}
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Published {post.date}
            {post.updated && post.updated !== post.published
              ? ` · Updated ${formatIsoDate(post.updated)}`
              : null}
            {" · "}
            {post.readTime}
          </p>
        </motion.div>

        {/* Content Layout - Centered */}
        <div className="relative z-10 w-full max-w-5xl mx-auto">
          {/* Back to Blog Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#7042f88b] bg-[#7042f815]  text-gray-300 hover:text-white hover:border-purple-500/50 transition-all duration-300 group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 group-hover:-translate-x-1 transition-transform"
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
              <span className="font-medium">Back to Blog</span>
            </Link>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="p-8 md:p-12 rounded-xl border border-[#7042f88b] bg-[#0c0424]/80">
              {/* Excerpt */}
              <p className="text-xl text-gray-300 leading-relaxed mb-8 pb-8 border-b border-purple-500/20">
                {post.excerpt}
              </p>

              {/* Article Content. Citations ride alongside their block rather
                  than inside it — see BlockLinks. */}
              <div className="prose prose-invert prose-lg max-w-none">
                {post.content.map((block, index) => (
                  <Fragment key={index}>
                    {renderContent(block, index)}
                    {block.links?.length ? (
                      <BlockLinks links={block.links} label={block.linksLabel} />
                    ) : null}
                  </Fragment>
                ))}
              </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="mt-8"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Related Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relatedPosts.map((relatedPost) => (
                    <RelatedPostCard key={relatedPost.id} post={relatedPost} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Back to Blog - Centered */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="mt-16 text-center"
            >
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[#7042f88b] bg-[#7042f815]  text-gray-300 hover:text-white hover:border-purple-500/50 transition-all duration-300 group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 group-hover:-translate-x-1 transition-transform"
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
                <span className="font-medium">Back to Blog</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </article>
    </main>
  );
}
