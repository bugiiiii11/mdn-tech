import type { Metadata, Viewport } from "next";
import {
  ORGANIZATION_ID,
  WEBSITE_ID,
} from "@/components/product-pages/schema";
import { siteConfig } from "@/config";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#030014",
};

export const metadata: Metadata = siteConfig;

// These two nodes are the site's ONLY Organization and WebSite declarations.
// The @id on each is what every other page references (author, publisher,
// isPartOf) instead of re-declaring an anonymous copy of the same company —
// see components/product-pages/schema.ts for the shared references.
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "M.D.N Tech FZE",
  alternateName: "M.D.N Tech",
  url: "https://mdntech.org",
  logo: "https://mdntech.org/logo.png",
  description:
    "UAE-based team building self-service AI developer tools — ChatKit, ToolKit, and more — plus select custom AI, Web3, and full-stack development.",
  foundingDate: "2024-01-01",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "Al Shmookh Business Center M 1003, One UAQ, UAQ Free Trade Zone",
    addressLocality: "Umm Al Quwain",
    addressCountry: "AE",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: "contact@mdntech.org",
    telephone: "+971582283256",
    contactType: "sales",
    availableLanguage: ["English", "Slovak"],
  },
  sameAs: [
    "https://www.instagram.com/mdntechorg/",
    "https://x.com/MDNTechOrg",
    "https://www.linkedin.com/company/mdntech/",
  ],
  knowsAbout: [
    "Artificial Intelligence",
    "Machine Learning",
    "Blockchain",
    "Web3",
    "Full-Stack Development",
    "Mobile App Development",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: "M.D.N Tech",
  url: "https://mdntech.org",
  description:
    "Self-service AI developer tools, built by engineers — ChatKit chatbots, free Claude Code skills, and more.",
  inLanguage: ["en", "sk"],
  publisher: { "@id": ORGANIZATION_ID },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://app.mdntech.org" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://app.mdntech.org" />
        <link rel="preconnect" href="https://mdntech.org" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://mdntech.org" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="bg-[#030014]">
        {children}
      </body>
    </html>
  );
}
