"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// URL fragments never reach the server, so next.config.js redirects cannot
// forward old /#section inbound links — this client component is the only
// mechanism that works.
//
// Two generations of dead ids now:
//   1. The 7 pre-rebuild agency sections, which moved wholesale to /about.
//   2. The v2.0 landing ids retired by the v2.1 SEO pass (#free-tools split
//      into the per-product sections; #blog left the landing entirely).
const LEGACY_PAGE_REDIRECTS: Record<string, string> = {
  "about-us": "/about#about-us",
  services: "/about#services",
  process: "/about#process",
  security: "/about#security",
  projects: "/about#projects",
  team: "/about#team",
  "contact-us": "/about#contact-us",
  blog: "/blog",
};

// Retired ids that still have a sensible home on THIS page — scrolled to
// rather than navigated to, so the visitor stays put.
const RETIRED_SECTION_IDS: Record<string, string> = {
  "free-tools": "toolkit",
};

export const LegacyHashRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;

    const pageTarget = LEGACY_PAGE_REDIRECTS[hash];
    if (pageTarget) {
      router.replace(pageTarget);
      return;
    }

    const sectionId = RETIRED_SECTION_IDS[hash];
    if (sectionId) {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `#${sectionId}`);
    }
  }, [router]);

  return null;
};
