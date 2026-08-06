"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// URL fragments never reach the server, so next.config.js redirects cannot
// forward old /#section inbound links — this client component is the only
// mechanism that works. The 7 legacy section ids now live on /about; the new
// landing deliberately avoids them (it uses home/products/free-tools/blog).
const LEGACY_HASH_IDS = new Set([
  "about-us",
  "services",
  "process",
  "security",
  "projects",
  "team",
  "contact-us",
]);

export const LegacyHashRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (LEGACY_HASH_IDS.has(hash)) {
      router.replace(`/about#${hash}`);
    }
  }, [router]);

  return null;
};
