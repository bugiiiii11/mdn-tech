import type { Metadata } from "next";
import { Encryption } from "@/components/main/encryption";
import { Hero } from "@/components/main/hero";
import { Projects } from "@/components/main/projects";
import { Skills } from "@/components/main/skills";
import { AboutUs } from "@/components/main/about-us";
import { Team } from "@/components/main/team";
import { Process } from "@/components/main/process";
import { ContactUs } from "@/components/main/contact-us";

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

export default function Home() {
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
