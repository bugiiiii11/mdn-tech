import type { Metadata } from "next";

const siteUrl = "https://mdntech.org";

export const siteConfig: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "M.D.N Tech | AI Developer Tools — ChatKit, ToolKit & More",
    template: "%s | M.D.N Tech",
  },
  description:
    "Self-service AI developer tools, built by engineers. Turn your content into an embeddable AI chatbot with ChatKit, supercharge Claude Code with free ToolKit skills — sign up, configure, and ship. UAE-based team.",
  keywords: [
    "AI developer tools",
    "AI chatbot builder",
    "embeddable AI chatbot",
    "Claude Code skills",
    "knowledge base chatbot",
    "developer tools platform",
    "AI development agency",
    "full-stack development UAE",
    "Web3 development",
    "AI engineers",
    "production-ready software",
    "LLM integration",
    "AI automation",
  ],
  authors: [{ name: "M.D.N Tech FZE", url: siteUrl }],
  creator: "M.D.N Tech FZE",
  publisher: "M.D.N Tech FZE",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "M.D.N Tech | AI Developer Tools — ChatKit, ToolKit & More",
    description:
      "Self-service AI developer tools, built by engineers. Sign up, configure, and ship — no sales calls, no onboarding meetings.",
    siteName: "M.D.N Tech",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "M.D.N Tech - Your Tools. Your Rules.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "M.D.N Tech | AI Developer Tools — ChatKit, ToolKit & More",
    description:
      "Self-service AI developer tools, built by engineers. Sign up, configure, and ship.",
    creator: "@MDNTechOrg",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};
