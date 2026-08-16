import type { Metadata } from "next";

import { FREE_TRIAL_MESSAGES } from "@/lib/portal/plans";

const siteUrl = "https://mdntech.org";

export const siteConfig: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "M.D.N Tech | AI Chatbot for Your Website & Free AI Tools",
    template: "%s | M.D.N Tech",
  },
  // Kept under ~160 chars so Google does not truncate it in the SERP.
  description: `Add an AI chatbot grounded in your own content to your website in minutes. No coding, ${FREE_TRIAL_MESSAGES} free messages, no credit card required.`,
  keywords: [
    "AI chatbot for website",
    "AI chatbot builder",
    "custom AI chatbot",
    "knowledge base chatbot",
    "embeddable AI chatbot",
    "chatbot without coding",
    "AI customer support",
    "AI tools for business",
    "Claude Code skills",
    "AI developer tools",
    "AI automation for small business",
    "AI development agency",
    "AI engineers UAE",
  ],
  authors: [{ name: "M.D.N Tech FZE", url: siteUrl }],
  creator: "M.D.N Tech FZE",
  publisher: "M.D.N Tech FZE",
  // No `icons` here on purpose. Icons come from the app/ file convention
  // (icon.svg + icon.png + apple-icon.png), which Next emits for every route
  // in the app -- marketing, /portal (app.mdntech.org) and /command-center
  // (admin.mdntech.org) alike. Re-adding a hand-written `icons` block here
  // does not replace those files, it appends a second, competing <link>.
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "M.D.N Tech | AI Chatbot for Your Website & Free AI Tools",
    description:
      `An AI chatbot grounded in your content, live on your site in minutes. ${FREE_TRIAL_MESSAGES} free messages, no credit card, no sales calls.`,
    siteName: "M.D.N Tech",
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
    title: "M.D.N Tech | AI Chatbot for Your Website & Free AI Tools",
    description:
      `An AI chatbot grounded in your content, live on your site in minutes. ${FREE_TRIAL_MESSAGES} free messages, no credit card.`,
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
