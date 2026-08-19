import {
  ORGANIZATION_ID,
  WEBSITE_ID,
} from "@/components/product-pages/schema";
import { APP_LIVE } from "@/lib/marketing/products";
import "./globals.css";

// The one <html> shell, shared by both root layouts. It exists because
// <html lang> can only be set in a root layout and Next has no per-page
// override, so the Slovak tree gets its own root via route groups —
// app/(en)/layout.tsx and app/(sk)/layout.tsx both render this with the
// right lang. Everything else about the document is identical on purpose.

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
  // The white-on-black plate, not a transparent mark: search and social
  // surfaces composite this onto backgrounds we do not control, and a bare
  // white mark disappears on every light one.
  logo: "https://mdntech.org/brand/png/logo-final-white-on-black-1000.png",
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
    "https://www.linkedin.com/company/111977261",
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

export function BaseLayout({
  lang,
  children,
}: {
  lang: "en" | "sk";
  children: React.ReactNode;
}) {
  return (
    <html lang={lang}>
      <head>
        {/* Warms the cross-host hop to the portal — pointless while nothing on
            the site links there (APP_LIVE), so it goes with the links. */}
        {APP_LIVE && (
          <>
            <link rel="preconnect" href="https://app.mdntech.org" crossOrigin="anonymous" />
            <link rel="dns-prefetch" href="https://app.mdntech.org" />
          </>
        )}
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
