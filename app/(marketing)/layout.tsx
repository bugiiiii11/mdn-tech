import type { PropsWithChildren } from "react";
import { Cedarville_Cursive, Inter } from "next/font/google";
import { Footer } from "@/components/main/footer";
import { Navbar } from "@/components/main/navbar";
import { StarsCanvas } from "@/components/main/star-background";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });
const cedarvilleCursive = Cedarville_Cursive({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-cedarville-cursive",
  display: "swap",
});

export default async function MarketingLayout({ children }: PropsWithChildren) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  return (
    <div
      className={cn(
        "overflow-y-auto overflow-x-hidden",
        inter.className,
        cedarvilleCursive.variable
      )}
    >
      <StarsCanvas />
      <Navbar isLoggedIn={isLoggedIn} />
      {children}
      <Footer />
    </div>
  );
}
