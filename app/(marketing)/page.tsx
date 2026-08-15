import type { Metadata } from "next";

import { LandingHero } from "@/components/landing/hero";
import { LegacyHashRedirect } from "@/components/landing/legacy-hash-redirect";
import { Products } from "@/components/landing/products";
import { ChatKitSection } from "@/components/landing/chatkit-section";
import { ToolKitSection } from "@/components/landing/toolkit-section";
import { ComingSoon } from "@/components/landing/coming-soon";
import { WhyUs } from "@/components/landing/why-us";
import { Faq } from "@/components/landing/faq";
import { CreditsStrip } from "@/components/landing/credits-strip";

// Reciprocal hreflang cluster so the EN home and /sk point at each other.
export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: {
      sk: "https://mdntech.org/sk",
      en: "https://mdntech.org",
      "x-default": "https://mdntech.org",
    },
  },
};

// Product-first landing (website-rebuild v2.1 — SEO depth pass).
//
// Structure: overview grid -> one deep section per LIVE product -> upcoming
// products (no CTAs) -> credibility -> FAQ -> closing CTA. The blog preview
// and avatar trust bar were removed: /blog and /about are both in the navbar,
// so the landing stays strictly about the products.
//
// Section ids: home / products / chatkit / toolkit / coming-soon / why / faq.
// The 7 legacy ids stay reserved for /about (see LegacyHashRedirect).
export default function Home() {
  return (
    <main className="h-full w-full overflow-x-hidden">
      <div className="flex flex-col gap-10 max-w-full">
        <LegacyHashRedirect />
        <LandingHero />
        <Products />
        <ChatKitSection />
        <ToolKitSection />
        <ComingSoon />
        <WhyUs />
        <Faq />
        <CreditsStrip />
      </div>
    </main>
  );
}
