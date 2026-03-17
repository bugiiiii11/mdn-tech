import { Metadata } from "next";
import { getPostById, getAllPosts } from "@/data/blog-posts";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostById(params.slug);

  if (!post) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    };
  }

  // Parse date for ISO format
  const dateMatch = post.date.match(/(\w+)\s+(\d+),\s+(\d+)/);
  const isoDate = dateMatch
    ? new Date(`${dateMatch[1]} ${dateMatch[2]}, ${dateMatch[3]}`).toISOString()
    : new Date().toISOString();

  return {
    title: post.title,
    description: post.metaDescription,
    keywords: post.tags,
    authors: [{ name: post.author }],
    openGraph: {
      title: `${post.title} | M.D.N Tech Blog`,
      description: post.metaDescription,
      type: "article",
      publishedTime: isoDate,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.metaDescription,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: `https://mdntech.com/blog/${post.id}`,
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.id,
  }));
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
