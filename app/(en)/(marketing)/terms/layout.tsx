import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "M.D.N Tech FZE terms and conditions for IT development services. Review our service agreement, payment terms, and intellectual property policies.",
  // A page-level openGraph/twitter object REPLACES the root one wholesale
  // (shallow merge), so every field must be restated here or it is lost.
  openGraph: {
    type: "website",
    url: "https://mdntech.org/terms",
    siteName: "M.D.N Tech",
    title: "Terms & Conditions | M.D.N Tech",
    description:
      "Terms of service for M.D.N Tech FZE IT development and consulting services.",
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
    title: "Terms & Conditions | M.D.N Tech",
    description:
      "Terms of service for M.D.N Tech FZE IT development and consulting services.",
    creator: "@MDNTechOrg",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://mdntech.org/terms",
    // Declared on BOTH sides (see the SK page) — one-directional hreflang is
    // ignored. x-default is the English original: it prevails on discrepancy.
    languages: {
      en: "https://mdntech.org/terms",
      sk: "https://mdntech.org/sk/obchodne-podmienky",
      "x-default": "https://mdntech.org/terms",
    },
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
