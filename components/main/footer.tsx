"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { RxTwitterLogo, RxLinkedinLogo, RxInstagramLogo, RxGithubLogo } from "react-icons/rx";

import { APP_URL, getLandingMode, visibleProducts } from "@/lib/marketing/products";
import type { MarketingProduct } from "@/lib/marketing/products";
import { NewsletterForm } from "@/components/main/newsletter-form";
import { BlackholeVideo } from "@/components/main/blackhole-video";
import { TOOLKIT_REPO } from "@/lib/marketing/links";

// Products with an indexable marketing deep-dive get the internal route in
// the footer instead of product.href (the app host is noindex, so sending
// every sitewide footer link there wastes the strongest internal-link slot).
// The Connect column keeps "Open the App" for people who want the portal.
const MARKETING_ROUTES: Partial<Record<MarketingProduct["id"], string>> = {
  chatkit: "/chatkit",
  toolkit: "/toolkit",
};

// Shared blackhole bookend above the footer. BlackholeVideo carries the
// reduced-motion + poster handling (WCAG 2.2.2).
const FooterBookend = () => (
  <div className="relative w-full max-w-full overflow-hidden" style={{ height: "270px" }}>
    <BlackholeVideo
      className="absolute top-0 left-0 w-full max-w-full pointer-events-none object-contain -z-10"
      style={{ height: "540px" }}
    />
  </div>
);

// SK footer — unchanged from the pre-rebuild version (DO NOT TOUCH /sk).
const SkFooter = () => (
  <>
    <FooterBookend />
    <footer className="w-full max-w-full relative bg-[#050518] overflow-hidden" style={{ zIndex: 11 }}>
      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-6 pb-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-6">
          {/* Brand + description */}
          <div className="max-w-[280px]">
            <Link href="/sk#domov" className="inline-flex items-center gap-2.5 mb-3">
              <Image src="/logo.png" alt="M.D.N Tech logo" width={32} height={32} className="w-8 h-8 opacity-90" />
              <span className="text-xl font-semibold text-white tracking-tight">M.D.N Tech</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Web, SEO, biznis analýza a automatizácia procesov pre slovenské firmy — moderné digitálne riešenia od jedného partnera.
            </p>
          </div>

          {/* Pages */}
          <div>
            <h4 className="text-white text-sm font-medium mb-3">Stránky</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors w-fit">
                Obchodné podmienky
              </Link>
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors w-fit">
                Ochrana súkromia
              </Link>
              <Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors w-fit">
                Blog
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="max-w-[280px]">
            <h4 className="text-white text-sm font-medium mb-3">Kontakt</h4>
            <div className="flex flex-col gap-2">
              <a href="tel:+421904904091" className="text-sm text-gray-400 hover:text-white transition-colors w-fit">
                0904 904 091
              </a>
              <a href="mailto:contact@mdntech.org" className="text-sm text-gray-400 hover:text-white transition-colors w-fit">
                contact@mdntech.org
              </a>
              <p className="text-sm text-gray-400 leading-relaxed">
                Recká cesta 182,<br />925 26 Senec-Boldog
              </p>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-500">
          <p className="leading-relaxed">M.D.N Tech — Váš digitálny partner</p>
          <p>© 2026 M.D.N TECH</p>
        </div>
      </div>
    </footer>
  </>
);

export const Footer = () => {
  const pathname = usePathname();
  const isSk = pathname?.startsWith("/sk") ?? false;

  if (isSk) {
    return <SkFooter />;
  }

  // EN footer (website-rebuild v2.1). Deeper than the page void (#010109 vs
  // #030014) so the page visibly "lands" on it, with a violet hairline where
  // the blackhole bookend meets the panel.
  const mode = getLandingMode();
  const products = visibleProducts(mode);

  const socials = [
    { name: "LinkedIn", icon: RxLinkedinLogo, link: "https://www.linkedin.com/company/mdntech/" },
    { name: "X", icon: RxTwitterLogo, link: "https://x.com/MDNTechOrg" },
    { name: "Instagram", icon: RxInstagramLogo, link: "https://www.instagram.com/mdntechorg/" },
    { name: "GitHub", icon: RxGithubLogo, link: TOOLKIT_REPO },
  ];

  const linkClass = "text-sm text-gray-400 hover:text-white transition-colors w-fit";
  const headingClass =
    "text-white text-xs font-semibold uppercase tracking-wider mb-4";

  return (
    <>
      <FooterBookend />
      <footer
        className="w-full max-w-full relative bg-[#010109] overflow-hidden border-t border-[#7042f833]"
        style={{ zIndex: 11 }}
      >
        {/* Violet horizon glow along the top edge — the last trace of the
            blackhole above, fading into the panel. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-px left-1/2 -translate-x-1/2 h-px w-[70%] bg-gradient-to-r from-transparent via-purple-500/60 to-transparent"
        />

        <div className="max-w-6xl mx-auto px-5 md:px-8 pt-14 pb-6 relative z-10">
          {/* Brand + newsletter band */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 pb-10 mb-10 border-b border-white/[0.06]">
            <div className="max-w-sm">
              <Link href="/#home" className="inline-flex items-center gap-2.5 mb-3">
                <Image src="/logo.png" alt="M.D.N Tech logo" width={32} height={32} className="w-8 h-8 opacity-90" />
                <span className="text-xl font-semibold text-white tracking-tight">M.D.N Tech</span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed">
                Self-service AI tools for growing businesses — built and run by
                a senior engineering team in the UAE.
              </p>
              <div className="flex items-center gap-1 mt-5 -ml-2">
                {socials.map(({ name, icon: Icon, link }) => (
                  <Link
                    key={name}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-white/5 transition-colors"
                    aria-label={name}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="w-full max-w-sm lg:flex-shrink-0">
              <h4 className={headingClass}>Product updates</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                New tools, new features, occasional engineering notes. No spam,
                unsubscribe anytime.
              </p>
              <NewsletterForm />
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Products — generated from the landing lineup */}
            <div>
              <h4 className={headingClass}>Products</h4>
              <nav className="flex flex-col gap-2.5">
                {products.map((product) => {
                  if (product.status[mode] !== "live") {
                    return (
                      <Link
                        key={product.id}
                        href="/#coming-soon"
                        className={linkClass}
                      >
                        {product.name}
                        <span className="ml-1.5 text-[10px] uppercase tracking-wide text-purple-300">Soon</span>
                      </Link>
                    );
                  }
                  const marketingHref = MARKETING_ROUTES[product.id];
                  return marketingHref ? (
                    <Link key={product.id} href={marketingHref} className={linkClass}>
                      {product.name}
                    </Link>
                  ) : (
                    <a key={product.id} href={product.href} className={linkClass}>
                      {product.name}
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Resources */}
            <div>
              <h4 className={headingClass}>Resources</h4>
              <nav className="flex flex-col gap-2.5">
                <Link href="/blog" className={linkClass}>
                  Blog
                </Link>
                <Link href="/toolkit" className={linkClass}>
                  Claude Code Skills
                </Link>
                <a
                  href={TOOLKIT_REPO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  ToolKit on GitHub
                </a>
                <Link href="/#faq" className={linkClass}>
                  FAQ
                </Link>
              </nav>
            </div>

            {/* Company */}
            <div>
              <h4 className={headingClass}>Company</h4>
              <nav className="flex flex-col gap-2.5">
                <Link href="/about" className={linkClass}>
                  About Us
                </Link>
                <Link href="/about#contact-us" className={linkClass}>
                  Contact
                </Link>
                <Link href="/sk" className={linkClass} hrefLang="sk">
                  Slovensky
                </Link>
              </nav>
            </div>

            {/* Connect */}
            <div>
              <h4 className={headingClass}>Connect</h4>
              <div className="flex flex-col gap-2.5">
                <a href={APP_URL} className={linkClass}>
                  Open the App
                </a>
                <a href="mailto:contact@mdntech.org" className={linkClass}>
                  contact@mdntech.org
                </a>
                <a href="tel:+971582283256" className={linkClass}>
                  +971 58 228 3256
                </a>
              </div>
            </div>
          </div>

          {/* Bottom line */}
          <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-gray-400">
            <p className="leading-relaxed">
              M.D.N Tech FZE · Al Shmookh Business Center, One UAQ, UAQ Free Trade Zone, Umm Al Quwain, U.A.E. · License 7813
            </p>
            <div className="flex items-center gap-4 flex-shrink-0">
              <Link href="/privacy" className="hover:text-gray-300 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-gray-300 transition-colors">
                Terms
              </Link>
              <span>© 2026 M.D.N TECH</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
