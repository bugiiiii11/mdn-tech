import { Metadata } from "next";

// Blog posts data for metadata generation
const BLOG_POSTS_META: Record<
  string,
  { title: string; excerpt: string; date: string; category: string }
> = {
  "ai-engineering-2026": {
    title: "The Rise of AI Engineering in 2026",
    excerpt:
      "How AI-native development practices are reshaping the software industry and what it means for modern product teams.",
    date: "2026-03-05",
    category: "AI & Engineering",
  },
  "web3-enterprise-adoption": {
    title: "Web3 Enterprise Adoption: Beyond the Hype",
    excerpt:
      "A practical look at how enterprises are implementing blockchain technology for real business value.",
    date: "2026-02-28",
    category: "Blockchain & Web3",
  },
  "full-stack-ownership": {
    title: "Why Full-Stack Ownership Beats Team Handoffs",
    excerpt:
      "The case for single-engineer ownership and how it accelerates delivery without sacrificing quality.",
    date: "2026-02-20",
    category: "Engineering",
  },
  "production-ready-ai": {
    title: "Building Production-Ready AI Systems",
    excerpt:
      "From prototype to production: the engineering practices that separate demos from real AI products.",
    date: "2026-02-15",
    category: "AI & Engineering",
  },
  "mobile-web3-integration": {
    title: "Mobile Apps Meet Web3: A Developer's Guide",
    excerpt:
      "Integrating wallet connections, on-chain data, and Web3 features into React Native and Flutter apps.",
    date: "2026-02-08",
    category: "Mobile & Web3",
  },
  "scaling-without-rewrites": {
    title: "Scaling Without Expensive Rewrites",
    excerpt:
      "Architecture decisions that let your codebase grow without accumulating technical debt.",
    date: "2026-02-01",
    category: "Engineering",
  },
};

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = BLOG_POSTS_META[params.slug];

  if (!post) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | M.D.N Tech Blog`,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: ["M.D.N Tech"],
      tags: [post.category],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
