import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { PropsWithChildren } from "react";

import { Footer } from "@/components/main/footer";
import { Navbar } from "@/components/main/navbar";
import { StarsCanvas } from "@/components/main/star-background";
import { siteConfig } from "@/config";
import { cn } from "@/lib/utils";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
  foundingDate: "2024",
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
  publisher: {
    "@type": "Organization",
    name: "M.D.N Tech FZE",
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body
        className={cn(
          "bg-[#030014] overflow-y-auto overflow-x-hidden",
          inter.className
        )}
      >
        <StarsCanvas />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
