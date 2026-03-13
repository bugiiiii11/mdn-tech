import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the full-stack AI engineers at M.D.N Tech. Our team brings 20+ years combined experience in AI, blockchain, and production-ready software development.",
  openGraph: {
    title: "Our Team | M.D.N Tech",
    description:
      "Meet the engineers behind M.D.N Tech - full-stack AI developers with decades of combined experience.",
  },
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
