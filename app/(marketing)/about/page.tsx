import type { Metadata } from "next";

import { AboutHero } from "@/components/about/hero";
import { Encryption } from "@/components/main/encryption";
import { Projects } from "@/components/main/projects";
import { Skills } from "@/components/main/skills";
import { AboutUs } from "@/components/main/about-us";
import { Team } from "@/components/main/team";
import { Process } from "@/components/main/process";
import { ContactUs } from "@/components/main/contact-us";

// The entire pre-rebuild landing lives here unmodified (website-rebuild v2.0
// Phase A2). All legacy hash ids (#about-us #services #process #security
// #projects #team #contact-us) keep working; LegacyHashRedirect on the root
// forwards old /#... inbound anchors to this page.
export const metadata: Metadata = {
  title: { absolute: "About Us | The Team Behind the Tools — M.D.N Tech" },
  description:
    "Meet the team behind M.D.N Tech's AI tools — a growing, distributed team of full-stack AI engineers building self-service products and taking on select custom projects.",
  // A page-level openGraph/twitter object REPLACES the root one wholesale
  // (shallow merge); without these blocks the page inherits the homepage's
  // og:url and twitter:title, which contradict the canonical below.
  openGraph: {
    type: "website",
    url: "/about",
    siteName: "M.D.N Tech",
    title: "About Us | The Team Behind the Tools — M.D.N Tech",
    description:
      "Meet the team behind M.D.N Tech's AI tools — a growing, distributed team of full-stack AI engineers.",
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
    title: "About Us | The Team Behind the Tools — M.D.N Tech",
    description:
      "Meet the team behind M.D.N Tech's AI tools — a growing, distributed team of full-stack AI engineers.",
    creator: "@MDNTechOrg",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <main className="h-full w-full overflow-x-hidden">
      <div className="flex flex-col gap-20 max-w-full">
        <AboutHero />
        <AboutUs />
        <Skills />
        <Process />
        <Encryption />
        <Projects />
        <Team />
        <ContactUs />
      </div>
    </main>
  );
}
