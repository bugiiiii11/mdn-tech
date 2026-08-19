import { Metadata } from "next";
import Link from "next/link";
import { getPostById, getRelatedPosts, getAllPosts } from "@/data/blog-posts";
import BlogPostContent from "./BlogPostContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths for all blog posts
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.id,
  }));
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostById(slug);

  if (!post) {
    return {
      title: "Article Not Found | M.D.N Tech",
      description: "The article you're looking for doesn't exist.",
    };
  }

  const imageUrl = `https://mdntech.org${post.image}`;

  return {
    title: `${post.title} | M.D.N Tech Blog`,
    description: post.metaDescription || post.excerpt,
    keywords: post.tags.join(", "),
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.metaDescription || post.excerpt,
      type: "article",
      // ISO, not the display string: article:published_time is a machine tag
      // and "March 13, 2026" is not a valid value for it.
      publishedTime: post.published,
      modifiedTime: post.updated ?? post.published,
      authors: [post.author],
      tags: post.tags,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.metaDescription || post.excerpt,
      images: [imageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostById(slug);

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

  const relatedPosts = getRelatedPosts(post.id, 2);

  // Article JSON-LD schema for rich snippets
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    image: `https://mdntech.org${post.image || "/og-image.png"}`,
    datePublished: post.published,
    dateModified: post.updated ?? post.published,
    author: {
      "@type": "Organization",
      name: post.author,
      url: "https://mdntech.org",
    },
    publisher: {
      "@type": "Organization",
      name: "M.D.N Tech FZE",
      logo: {
        "@type": "ImageObject",
        url: "https://mdntech.org/brand/png/logo-final-white-on-black-1000.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://mdntech.org/blog/${post.id}`,
    },
    keywords: post.tags.join(", "),
    articleSection: post.category,
  };

  // No BreadcrumbList here on purpose: these pages render no visible
  // breadcrumb trail, and schema without a matching visible trail is the
  // mismatch the S58 sitewide removal existed to fix (this file was missed).
  // When the /blog/[slug] redesign adds a visible trail, re-add the schema
  // alongside it — copy the pattern from /sk/referencie/royal-stroje.
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <BlogPostContent post={post} relatedPosts={relatedPosts} />
    </>
  );
}
