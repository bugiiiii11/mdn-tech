import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "M.D.N Tech FZE terms and conditions for IT development services. Review our service agreement, payment terms, and intellectual property policies.",
  openGraph: {
    title: "Terms & Conditions | M.D.N Tech",
    description:
      "Terms of service for M.D.N Tech FZE IT development and consulting services.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
