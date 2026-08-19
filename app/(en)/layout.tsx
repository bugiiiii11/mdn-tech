import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/config";
import { BaseLayout } from "../base-layout";

// One of TWO root layouts (see app/(sk)/layout.tsx). The split exists solely
// so the Slovak tree can declare <html lang="sk"> — everything else lives in
// the shared app/base-layout.tsx. Navigating between the groups is a full
// document load by design (Next remounts <html>), which also hard-resets the
// /sk chat widget on the way out.

export const viewport: Viewport = {
  themeColor: "#030014",
};

export const metadata: Metadata = siteConfig;

export default function EnRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BaseLayout lang="en">{children}</BaseLayout>;
}
