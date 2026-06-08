"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { RxTwitterLogo, RxLinkedinLogo, RxInstagramLogo } from "react-icons/rx";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const pathname = usePathname();
  const isSk = pathname?.startsWith("/sk") ?? false;

  const t = isSk
    ? {
        logoHref: "/sk#domov",
        description:
          "Web, SEO, biznis analýza a automatizácia procesov pre slovenské firmy — moderné digitálne riešenia od jedného partnera.",
        pages: "Stránky",
        terms: "Obchodné podmienky",
        privacy: "Ochrana súkromia",
        blog: "Blog",
        stayUpdated: "Zostaň v obraze",
        newsletterDesc: "Prihlás sa na odber noviniek.",
        emailPlaceholder: "Zadaj svoj email",
        subscribe: "Odoberať",
        bottomLine: "M.D.N Tech — digitálny partner pre slovenské firmy · Pôsobíme po celom Slovensku",
      }
    : {
        logoHref: "/#home",
        description:
          "Full-stack AI engineers building production-ready systems with the latest AI models, autonomous agents, and modern engineering practices.",
        pages: "Pages",
        terms: "Terms & Conditions",
        privacy: "Privacy Policy",
        blog: "Blog",
        stayUpdated: "Stay Updated",
        newsletterDesc: "Subscribe to our newsletter for the latest updates.",
        emailPlaceholder: "Enter your email",
        subscribe: "Subscribe",
        bottomLine:
          "Al Shmookh Business Center, One UAQ, UAQ Free Trade Zone, Umm Al Quwain, U.A.E. · License 7813",
      };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error || "Failed to subscribe");
      } else {
        setStatus("success");
        setMessage(data.message || "Successfully subscribed!");
        setEmail("");
      }

      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 4000);
    } catch (error) {
      setStatus("error");
      setMessage("Network error. Please try again.");
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const socials = [
    { name: "LinkedIn", icon: RxLinkedinLogo, link: "https://www.linkedin.com/company/mdntech/" },
    { name: "X", icon: RxTwitterLogo, link: "https://x.com/MDNTechOrg" },
    { name: "Instagram", icon: RxInstagramLogo, link: "https://www.instagram.com/mdntechorg/" },
  ];

  return (
    <>
      {/* Blackhole effect - clipped to show only top half, stuck to footer */}
      <div className="relative w-full max-w-full overflow-hidden" style={{ height: '270px' }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full max-w-full pointer-events-none object-contain -z-10"
          style={{ height: '540px' }}
        >
          <source src="/videos/blackhole.webm" type="video/webm" />
        </video>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-full relative bg-[#050518] overflow-hidden" style={{ zIndex: 11 }}>
        <div className="max-w-5xl mx-auto px-4 md:px-8 pt-6 pb-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-6">
            {/* Brand + description */}
            <div className="max-w-[280px]">
              <Link href={t.logoHref} className="inline-flex items-center gap-2.5 mb-3">
                <Image src="/logo.png" alt="M.D.N Tech logo" width={32} height={32} className="w-8 h-8 opacity-90" />
                <span className="text-xl font-semibold text-white tracking-tight">M.D.N Tech</span>
              </Link>
              <p className="text-gray-500 text-sm leading-relaxed">
                {t.description}
              </p>
            </div>

            {/* Pages */}
            <div>
              <h4 className="text-white text-sm font-medium mb-3">{t.pages}</h4>
              <nav className="flex flex-col gap-2">
                <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors w-fit">
                  {t.terms}
                </Link>
                <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors w-fit">
                  {t.privacy}
                </Link>
                <Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors w-fit">
                  {t.blog}
                </Link>
              </nav>
            </div>

            {/* Newsletter + Socials */}
            <div className="max-w-[280px]">
              <h4 className="text-white text-sm font-medium mb-1">{t.stayUpdated}</h4>
              <p className="text-gray-500 text-sm mb-3">{t.newsletterDesc}</p>
              <form onSubmit={handleSubscribe} className="flex gap-2 mb-2">
                <input
                  type="email"
                  id="newsletter-email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  required
                  autoComplete="email"
                  disabled={isSubmitting}
                  className="flex-1 min-w-0 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/40 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="shrink-0 px-4 py-2 button-primary text-center text-white cursor-pointer rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "..." : t.subscribe}
                </button>
              </form>
              {status !== "idle" && (
                <p className={`text-xs mb-2 ${status === "success" ? "text-green-400" : "text-red-400"}`}>
                  {message}
                </p>
              )}
              <div className="flex items-center gap-1">
                {socials.map(({ name, icon: Icon, link }) => (
                  <Link
                    key={name}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-gray-500 hover:text-purple-400 hover:bg-white/5 transition-colors"
                    aria-label={name}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom line */}
          <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-500">
            <p className="leading-relaxed">
              {t.bottomLine}
            </p>
            <p>© 2026 M.D.N TECH</p>
          </div>
        </div>
      </footer>
    </>
  );
};
