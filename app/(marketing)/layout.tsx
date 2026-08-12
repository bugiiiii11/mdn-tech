import type { PropsWithChildren } from "react";
import { Cedarville_Cursive, Inter } from "next/font/google";
import { Footer } from "@/components/main/footer";
import { Navbar } from "@/components/main/navbar";
import { ReducedMotionProvider } from "@/components/main/reduced-motion-provider";
import { StarsCanvas } from "@/components/main/star-background";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });
const cedarvilleCursive = Cedarville_Cursive({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-cedarville-cursive",
  display: "swap",
});

export default function MarketingLayout({ children }: PropsWithChildren) {
  return (
    <div
      className={cn(
        "overflow-y-auto overflow-x-hidden",
        inter.className,
        cedarvilleCursive.variable
      )}
    >
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
      <ReducedMotionProvider>
        <StarsCanvas />
        <Navbar />
        {children}
        <Footer />
      </ReducedMotionProvider>
    </div>
  );
}
