import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "M.D.N Tech FZE privacy policy. Learn how we collect, use, and protect your personal data in compliance with GDPR and UAE regulations.",
  openGraph: {
    title: "Privacy Policy | M.D.N Tech",
    description: "How M.D.N Tech FZE handles and protects your personal data.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://mdntech.com/privacy",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
