"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { RxTwitterLogo, RxLinkedinLogo, RxInstagramLogo, RxGithubLogo } from "react-icons/rx";

import { APP_URL, getLandingMode, visibleProducts } from "@/lib/marketing/products";

// Shared blackhole bookend above the footer.
const FooterBookend = () => (
  <div className="relative w-full max-w-full overflow-hidden" style={{ height: "270px" }}>
    <video
      autoPlay
      muted
      loop
      playsInline
      className="absolute top-0 left-0 w-full max-w-full pointer-events-none object-contain -z-10"
      style={{ height: "540px" }}
    >
      <source src="/videos/blackhole.webm" type="video/webm" />
    </video>
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

  // EN multi-column footer (website-rebuild v2.0 Phase A2).
  const mode = getLandingMode();
  const products = visibleProducts(mode);

  const socials = [
    { name: "LinkedIn", icon: RxLinkedinLogo, link: "https://www.linkedin.com/company/mdntech/" },
    { name: "X", icon: RxTwitterLogo, link: "https://x.com/MDNTechOrg" },
    { name: "Instagram", icon: RxInstagramLogo, link: "https://www.instagram.com/mdntechorg/" },
    { name: "GitHub", icon: RxGithubLogo, link: "https://github.com/bugiiiii11/handoff" },
  ];

  const linkClass = "text-sm text-gray-400 hover:text-white transition-colors w-fit";

  return (
    <>
      <FooterBookend />
      <footer className="w-full max-w-full relative bg-[#050518] overflow-hidden" style={{ zIndex: 11 }}>
        <div className="max-w-5xl mx-auto px-4 md:px-8 pt-8 pb-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1 max-w-[280px]">
              <Link href="/#home" className="inline-flex items-center gap-2.5 mb-3">
                <Image src="/logo.png" alt="M.D.N Tech logo" width={32} height={32} className="w-8 h-8 opacity-90" />
                <span className="text-xl font-semibold text-white tracking-tight">M.D.N Tech</span>
              </Link>
              <p className="text-gray-500 text-sm leading-relaxed">
                AI-powered tools for modern builders.
              </p>
              <div className="flex items-center gap-1 mt-4 -ml-2">
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

            {/* Products — generated from the landing lineup */}
            <div>
              <h4 className="text-white text-sm font-medium mb-3">Products</h4>
              <nav className="flex flex-col gap-2">
                {products.map((product) =>
                  product.status[mode] === "live" ? (
                    <a key={product.id} href={product.href} className={linkClass}>
                      {product.name}
                    </a>
                  ) : (
                    <Link key={product.id} href="/#products" className={`${linkClass} text-gray-500`}>
                      {product.name}
                      <span className="ml-1.5 text-[10px] uppercase tracking-wide text-purple-400/70">Soon</span>
                    </Link>
                  )
                )}
              </nav>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white text-sm font-medium mb-3">Resources</h4>
              <nav className="flex flex-col gap-2">
                <Link href="/blog" className={linkClass}>
                  Blog
                </Link>
                <a href={`${APP_URL}/toolkit`} className={linkClass}>
                  Claude Code Skills
                </a>
                <a
                  href="https://github.com/bugiiiii11/handoff"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Documentation
                </a>
              </nav>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white text-sm font-medium mb-3">Company</h4>
              <nav className="flex flex-col gap-2">
                <Link href="/about" className={linkClass}>
                  About Us
                </Link>
                <Link href="/about#contact-us" className={linkClass}>
                  Contact
                </Link>
                <Link href="/privacy" className={linkClass}>
                  Privacy Policy
                </Link>
                <Link href="/terms" className={linkClass}>
                  Terms &amp; Conditions
                </Link>
              </nav>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-white text-sm font-medium mb-3">Connect</h4>
              <div className="flex flex-col gap-2">
                <a href="mailto:contact@mdntech.org" className={linkClass}>
                  contact@mdntech.org
                </a>
                <a href="tel:+971582283256" className={linkClass}>
                  +971 58 228 3256
                </a>
                <a href={APP_URL} className={linkClass}>
                  Open the App
                </a>
              </div>
            </div>
          </div>

          {/* Bottom line */}
          <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-500">
            <p className="leading-relaxed">
              Al Shmookh Business Center, One UAQ, UAQ Free Trade Zone, Umm Al Quwain, U.A.E. · License 7813
            </p>
            <p>© 2026 M.D.N TECH</p>
          </div>
        </div>
      </footer>
    </>
  );
};
