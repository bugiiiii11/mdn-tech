import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on AI engineering, Web3 development, and building production-ready systems from the M.D.N Tech team.",
  openGraph: {
    title: "Blog | M.D.N Tech",
    description:
      "Technical insights and industry perspectives from our full-stack AI engineers.",
  },
  alternates: {
    canonical: "https://mdntech.com/blog",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
