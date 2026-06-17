"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { RxTwitterLogo, RxLinkedinLogo, RxInstagramLogo } from "react-icons/rx";

export const Footer = () => {
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
        bottomLine: "M.D.N Tech — digitálny partner pre slovenské firmy · Pôsobíme po celom Slovensku",
      }
    : {
        logoHref: "/#home",
        description:
          "Web, Apps, SEO, business analysis and process automation for global companies — modern digital solutions from one partner.",
        pages: "Pages",
        terms: "Terms & Conditions",
        privacy: "Privacy Policy",
        blog: "Blog",
        bottomLine:
          "Al Shmookh Business Center, One UAQ, UAQ Free Trade Zone, Umm Al Quwain, U.A.E. · License 7813",
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

            {/* Newsletter + Socials (EN) / Contact (SK) */}
            {isSk ? (
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
            ) : (
              <div className="max-w-[280px]">
                <h4 className="text-white text-sm font-medium mb-3">Contact</h4>
                <div className="flex flex-col gap-2">
                  <a href="tel:+971582283256" className="text-sm text-gray-400 hover:text-white transition-colors w-fit">
                    +971 58 228 3256
                  </a>
                  <a href="mailto:contact@mdntech.org" className="text-sm text-gray-400 hover:text-white transition-colors w-fit">
                    contact@mdntech.org
                  </a>
                </div>
                <div className="flex items-center gap-1 mt-4">
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
            )}
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
