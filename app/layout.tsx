import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/config";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#030014",
};

export const metadata: Metadata = siteConfig;

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "M.D.N Tech FZE",
  alternateName: "M.D.N Tech",
  url: "https://mdntech.com",
  logo: "https://mdntech.com/logo.png",
  description:
    "UAE-based tech agency specializing in AI systems, Web3 solutions, and full-stack development with global delivery.",
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
    availableLanguage: "English",
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
  name: "M.D.N Tech",
  url: "https://mdntech.com",
  description:
    "Ship production-ready AI systems, Web3 solutions, and full-stack applications faster.",
  inLanguage: "en",
  publisher: {
    "@type": "Organization",
    name: "M.D.N Tech FZE",
  },
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
