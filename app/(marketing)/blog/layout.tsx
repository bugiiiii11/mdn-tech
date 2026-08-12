import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on AI engineering, Web3 development, and building production-ready systems from the M.D.N Tech team.",
  // A page-level openGraph/twitter object REPLACES the root one wholesale
  // (shallow merge), so every field must be restated here or it is lost.
  openGraph: {
    type: "website",
    url: "https://mdntech.org/blog",
    siteName: "M.D.N Tech",
    title: "Blog | M.D.N Tech",
    description:
      "Technical insights and industry perspectives from our full-stack AI engineers.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "M.D.N Tech — Grow Your Business with AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | M.D.N Tech",
    description:
      "Technical insights and industry perspectives from our full-stack AI engineers.",
    creator: "@MDNTechOrg",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://mdntech.org/blog",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
