import Link from "next/link";

import { BlogHero } from "@/components/blog/hero";
import { BlogPostCard } from "@/components/blog/post-card";
import { PROSE_LINK_CLASS, Section } from "@/components/product-pages/primitives";
import { getAllPosts, toPostPreview } from "@/data/blog-posts";

// Blog index (2026-08-14 rebuild): full-viewport hero on the shared shell with
// the latest post featured inside the fold, then the remaining posts on the
// product-page Section/card grammar. This file is a server component — the
// motion lives in components/blog/*; metadata stays in ./layout.tsx.
//
// toPostPreview() is load-bearing, not tidiness: BlogHero and BlogPostCard are
// client components, so whatever object they receive is serialized into the
// page's RSC flight data — full posts inlined every article's content here.
export default function BlogPage() {
  const [featured, ...rest] = getAllPosts().map(toPostPreview);

  return (
    <main className="h-full w-full overflow-x-hidden">
      <div className="flex flex-col gap-10 max-w-full">
        <BlogHero featured={featured} />

        <Section id="articles" title="More Articles" wide>
          {/* Two columns by design: the featured post lives in the hero, so
              rows of two keep the grid balanced at any article count. */}
          <div className="grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
            {rest.map((post, index) => (
              <BlogPostCard key={post.id} post={post} index={index} />
            ))}
          </div>

          {/* Was a "More articles coming soon" pill — a promise five months
              stale by the S68 audit. A crawlable route into the product pages
              is worth more than a pulsing dot (audit items 15 and 21). */}
          <p className="mt-16 max-w-2xl text-center text-sm md:text-base leading-relaxed text-gray-300">
            These are the tools behind the write-ups:{" "}
            <Link href="/chatkit" className={PROSE_LINK_CLASS}>
              ChatKit
            </Link>
            , the support chatbot the agentic-systems piece describes, and{" "}
            <Link href="/toolkit" className={PROSE_LINK_CLASS}>
              ToolKit
            </Link>
            , the free Claude Code skills from the workflow guide.
          </p>
        </Section>
      </div>
    </main>
  );
}
