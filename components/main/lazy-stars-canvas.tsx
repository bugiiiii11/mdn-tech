"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// S68 LCP fix. The starfield is three.js + react-three-fiber — ~786 KB
// uncompressed, more than half of all JS — and a static import in the
// marketing layout put it in the blocking bundle of EVERY marketing page.
// Two changes here:
//
//  1. dynamic(ssr: false) moves the whole three.js graph into an async chunk
//     that is not part of any page's First Load JS.
//  2. The chunk is not even REQUESTED until the browser goes idle after
//     hydration, so it never competes with LCP/INP on the network or the
//     main thread. The fallback timeout keeps it from waiting forever on
//     pages that never go idle.
//
// Reading pages skip the canvas entirely: on an article or a legal text a
// spinning WebGL starfield is pure battery cost, and those pages' own star
// dust comes from the static CSS background anyway.
const StarsCanvas = dynamic(
  () => import("./star-background").then((m) => m.StarsCanvas),
  { ssr: false }
);

const READING_ROUTES = [
  /^\/blog\/.+/,
  /^\/privacy\/?$/,
  /^\/terms\/?$/,
  /^\/sk\/(ochrana-osobnych-udajov|obchodne-podmienky)\/?$/,
];

export const LazyStarsCanvas = () => {
  const pathname = usePathname();
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    // Feature-tested (Safari < 18 has no requestIdleCallback); the timeout
    // fallback keeps the stars appearing on a fixed schedule there.
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setIdle(true), {
        timeout: 3000,
      });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setIdle(true), 1500);
    return () => window.clearTimeout(id);
  }, []);

  if (!idle || READING_ROUTES.some((r) => r.test(pathname))) return null;
  return <StarsCanvas />;
};
