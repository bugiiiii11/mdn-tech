import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/config";
import { BaseLayout } from "../base-layout";

// The Slovak root layout — exists so /sk/** ships <html lang="sk"> instead of
// inheriting the English root's lang (the S68 audit flagged all four Slovak
// pages as declared English). Shares app/base-layout.tsx with
// app/(en)/layout.tsx; keep the two files identical except for `lang`.
// siteConfig stays as the metadata base on purpose: every /sk page already
// overrides title/description/canonical itself.

export const viewport: Viewport = {
  themeColor: "#030014",
};

export const metadata: Metadata = siteConfig;

export default function SkRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BaseLayout lang="sk">{children}</BaseLayout>;
}
