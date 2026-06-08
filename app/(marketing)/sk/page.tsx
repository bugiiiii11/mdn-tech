import type { Metadata } from "next";
import { SkHero } from "@/components/sk/SkHero";
import { SkForWhom } from "@/components/sk/SkForWhom";
import { SkValueLadder } from "@/components/sk/SkValueLadder";
import { SkWhyUs } from "@/components/sk/SkWhyUs";
import { SkPortfolio } from "@/components/sk/SkPortfolio";
import { SkProcess } from "@/components/sk/SkProcess";
import { SkContact } from "@/components/sk/SkContact";
import { SK_SITE, SK_NAP } from "@/constants/sk";

export const metadata: Metadata = {
  title: SK_SITE.title,
  description: SK_SITE.description,
  keywords: [...SK_SITE.keywords],
  alternates: {
    canonical: "/sk",
    languages: {
      sk: "https://mdntech.org/sk",
      en: "https://mdntech.org",
      "x-default": "https://mdntech.org",
    },
  },
  openGraph: {
    type: "website",
    locale: "sk_SK",
    url: SK_SITE.url,
    title: SK_SITE.title,
    description: SK_SITE.description,
    siteName: "M.D.N Tech",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "M.D.N Tech — digitálny partner pre slovenské firmy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SK_SITE.title,
    description: SK_SITE.description,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "M.D.N Tech",
  url: SK_SITE.url,
  image: `${SK_SITE.baseUrl}/og-image.png`,
  description: SK_SITE.description,
  inLanguage: "sk",
  priceRange: "€€",
  areaServed: {
    "@type": "Country",
    name: "Slovensko",
  },
  availableLanguage: ["sk", "en"],
  email: SK_NAP.email,
  telephone: SK_NAP.phoneIntl,
  serviceType: [
    "Tvorba webových stránok",
    "SEO optimalizácia",
    "Biznis analýza",
    "Automatizácia procesov",
    "Klientske portály a systémy na mieru",
  ],
  sameAs: [
    "https://www.instagram.com/mdntechorg/",
    "https://x.com/MDNTechOrg",
    "https://www.linkedin.com/company/mdntech/",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: SK_NAP.phoneIntl,
    email: SK_NAP.email,
    contactType: "sales",
    areaServed: "SK",
    availableLanguage: ["Slovak", "English"],
  },
};

export default function SkLandingPage() {
  return (
    <main lang="sk" className="h-full w-full overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(professionalServiceSchema),
        }}
      />
      <div className="flex flex-col gap-10 md:gap-16 max-w-full">
        <SkHero />
        <SkForWhom />
        <SkValueLadder />
        <SkWhyUs />
        <SkPortfolio />
        <SkProcess />
        <SkContact />
      </div>
    </main>
  );
}
