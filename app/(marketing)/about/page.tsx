import type { Metadata } from "next";

import { Encryption } from "@/components/main/encryption";
import { Hero } from "@/components/main/hero";
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
    "Meet the engineers behind M.D.N Tech's developer tools. A senior full-stack AI team with 30+ years combined experience — and we still take on select custom development projects.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <main className="h-full w-full overflow-x-hidden">
      <div className="flex flex-col gap-20 max-w-full">
        <Hero />
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
