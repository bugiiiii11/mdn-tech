import type { PropsWithChildren } from "react";
import { Cedarville_Cursive, Inter } from "next/font/google";
import { Footer } from "@/components/main/footer";
import { Navbar } from "@/components/main/navbar";
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
        "bg-[#030014] overflow-y-auto overflow-x-hidden",
        inter.className,
        cedarvilleCursive.variable
      )}
    >
      <StarsCanvas />
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
