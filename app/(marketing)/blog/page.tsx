import { BlogHero } from "@/components/blog/hero";
import { BlogPostCard } from "@/components/blog/post-card";
import { Section } from "@/components/product-pages/primitives";
import { getAllPosts } from "@/data/blog-posts";

// Blog index (2026-08-14 rebuild): full-viewport hero on the shared shell with
// the latest post featured inside the fold, then the remaining posts on the
// product-page Section/card grammar. This file is a server component — the
// motion lives in components/blog/*; metadata stays in ./layout.tsx.
export default function BlogPage() {
  const [featured, ...rest] = getAllPosts();

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

          <div className="mt-16 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#7042f88b] bg-[#7042f815] px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400 motion-safe:animate-pulse" />
              <span className="text-sm text-gray-300">
                More articles coming soon
              </span>
            </div>
          </div>
        </Section>
      </div>
    </main>
  );
}
