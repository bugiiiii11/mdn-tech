import type { PropsWithChildren } from "react";
import { Inter } from "next/font/google";
import { AttributionCapture } from "@/components/main/attribution-fields";
import { Footer } from "@/components/main/footer";
import { Navbar } from "@/components/main/navbar";
import { ReducedMotionProvider } from "@/components/main/reduced-motion-provider";
import { LazyStarsCanvas } from "@/components/main/lazy-stars-canvas";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export default function MarketingLayout({ children }: PropsWithChildren) {
  return (
    <div
      className={cn(
        // overflow-x-clip, never hidden/auto: an overflow-hidden ancestor is a
        // non-scrolling scrollport and silently disables position:sticky below.
        "overflow-x-clip",
        inter.className
      )}
    >
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[#030014] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:ring-2 focus:ring-cyan-500"
      >
        Skip to content
      </a>
      {/* framer-motion server-renders its `initial` state as inline
          opacity:0, so every reveal is invisible until hydration. The text is
          in the HTML either way, but without this a visitor with JS disabled
          sees an empty page. */}
      {/* dangerouslySetInnerHTML, not a text child: React escapes `"` inside
          element text to &quot;, which would corrupt the attribute selector. */}
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html:
              '[style*="opacity:0"]{opacity:1!important;transform:none!important}',
          }}
        />
      </noscript>

      {/* One provider covers every framer-motion animation on the marketing
          tree: with reducedMotion="user", transform/opacity animations are
          skipped when the visitor asks the OS for reduced motion. */}
      <AttributionCapture />
      <ReducedMotionProvider>
        <LazyStarsCanvas />
        <Navbar />
        <div id="content">{children}</div>
        <Footer />
      </ReducedMotionProvider>
    </div>
  );
}
