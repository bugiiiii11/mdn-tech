import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "M.D.N Tech FZE privacy policy. Learn how we collect, use, and protect your personal data in compliance with GDPR and UAE regulations.",
  // A page-level openGraph/twitter object REPLACES the root one wholesale
  // (shallow merge), so every field must be restated here or it is lost.
  openGraph: {
    type: "website",
    url: "https://mdntech.org/privacy",
    siteName: "M.D.N Tech",
    title: "Privacy Policy | M.D.N Tech",
    description: "How M.D.N Tech FZE handles and protects your personal data.",
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
    title: "Privacy Policy | M.D.N Tech",
    description: "How M.D.N Tech FZE handles and protects your personal data.",
    creator: "@MDNTechOrg",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://mdntech.org/privacy",
    // Declared on BOTH sides (see the SK page) — one-directional hreflang is
    // ignored. x-default is the English original: it prevails on discrepancy.
    languages: {
      en: "https://mdntech.org/privacy",
      sk: "https://mdntech.org/sk/ochrana-osobnych-udajov",
      "x-default": "https://mdntech.org/privacy",
    },
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
