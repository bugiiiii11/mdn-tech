import type { Metadata } from "next";

const siteUrl = "https://mdntech.com";

export const siteConfig: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "M.D.N Tech | AI & Full-Stack Development Agency | UAE",
    template: "%s | M.D.N Tech",
  },
  description:
    "Ship production-ready AI systems, Web3 solutions, and full-stack applications faster. UAE-based tech agency with full lifecycle ownership. From idea to deployment in weeks, not months.",
  keywords: [
    "AI development agency",
    "full-stack development UAE",
    "Web3 development",
    "blockchain solutions",
    "AI engineers",
    "production-ready software",
    "mobile app development",
    "React Native development",
    "Next.js agency",
    "smart contract development",
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
    title: "M.D.N Tech | AI & Full-Stack Development Agency",
    description:
      "Ship production-ready AI systems and full-stack applications faster. UAE-based tech agency with global delivery.",
    siteName: "M.D.N Tech",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "M.D.N Tech - Build Smarter. Ship Faster.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "M.D.N Tech | AI & Full-Stack Development Agency",
    description:
      "Ship production-ready AI systems and full-stack applications faster.",
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
