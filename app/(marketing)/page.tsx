import type { Metadata } from "next";

import { LandingHero } from "@/components/landing/hero";
import { Products } from "@/components/landing/products";
import { FreeTools } from "@/components/landing/free-tools";
import { CreditsStrip } from "@/components/landing/credits-strip";
import { TrustBar } from "@/components/landing/trust-bar";
import { BlogPreview } from "@/components/landing/blog-preview";

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

// Product-first landing (website-rebuild v2.0). The previous agency landing
// moves wholesale to /about (Phase A2). Section ids: home / products /
// free-tools / blog — the 7 legacy ids stay reserved for /about.
export default function Home() {
  return (
    <main className="h-full w-full overflow-x-hidden">
      <div className="flex flex-col gap-10 max-w-full">
        <LandingHero />
        <Products />
        <FreeTools />
        <CreditsStrip />
        <TrustBar />
        <BlogPreview />
      </div>
    </main>
  );
}
