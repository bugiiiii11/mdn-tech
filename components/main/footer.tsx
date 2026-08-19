"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { RxTwitterLogo, RxLinkedinLogo, RxInstagramLogo, RxGithubLogo } from "react-icons/rx";

import { APP_LIVE, APP_URL, getLandingMode, isAppHref, visibleProducts } from "@/lib/marketing/products";
import type { MarketingProduct } from "@/lib/marketing/products";
import { NewsletterForm } from "@/components/main/newsletter-form";
import { BlackholeVideo } from "@/components/main/blackhole-video";
import { COMPANY_LEGAL_LINE, TOOLKIT_REPO } from "@/lib/marketing/links";
import { SK_NAP, SK_NAV_LINKS } from "@/constants/sk";

// Products with an indexable marketing deep-dive get the internal route in
// the footer instead of product.href (the app host is noindex, so sending
// every sitewide footer link there wastes the strongest internal-link slot).
// The Connect column carries "Open the App" for people who want the portal —
// but only while APP_LIVE says the portal is open to the public.
const MARKETING_ROUTES: Partial<Record<MarketingProduct["id"], string>> = {
  chatkit: "/chatkit",
  toolkit: "/toolkit",
};

// max-w-full + break-words, not just w-fit: w-fit resolves to max-content, so
// a long unbreakable string (contact@mdntech.org) sized past the 320px column
// and was silently cut off by the footer's overflow-x-hidden.
const linkClass =
  "text-sm text-gray-400 hover:text-white transition-colors w-fit max-w-full break-words";
const headingClass =
  "text-white text-xs font-semibold uppercase tracking-wider mb-4";

// Shared blackhole bookend above the footer. BlackholeVideo carries the
// reduced-motion + poster handling (WCAG 2.2.2). `lazy` because the hero
// mounts the same video above the fold — without it both fetch the full
// 740 KB file in parallel on first paint.
const FooterBookend = () => (
  <div className="relative w-full max-w-full overflow-hidden" style={{ height: "270px" }}>
    <BlackholeVideo
      lazy
      className="absolute top-0 left-0 w-full max-w-full pointer-events-none object-contain -z-10"
      style={{ height: "540px" }}
    />
  </div>
);

// SK footer — same shell as the EN footer below (deep #010109 panel, violet
// horizon hairline, uppercase column heads) with Slovak copy and the /sk
// anchor set. The newsletter slot is a consultation CTA instead: /sk already
// closes on its own contact form, and the newsletter copy is English-only.
const SkFooter = () => {
  const skSocials = [
    { name: "LinkedIn", icon: RxLinkedinLogo, link: "https://www.linkedin.com/company/111977261" },
    { name: "X", icon: RxTwitterLogo, link: "https://x.com/MDNTechOrg" },
    { name: "Instagram", icon: RxInstagramLogo, link: "https://www.instagram.com/mdntechorg/" },
  ];

  return (
    <>
      <FooterBookend />
      <footer
        className="w-full max-w-full relative bg-[#010109] overflow-hidden border-t border-[#7042f833]"
        style={{ zIndex: 11 }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-px left-1/2 -translate-x-1/2 h-px w-[70%] bg-gradient-to-r from-transparent via-purple-500/60 to-transparent"
        />

        <div className="max-w-6xl mx-auto px-5 md:px-8 pt-14 pb-6 relative z-10">
          {/* Brand + consultation band */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 pb-10 mb-10 border-b border-white/[0.06]">
            <div className="max-w-sm">
              <Link href="/sk#domov" className="inline-flex items-center gap-2.5 mb-3">
                <Image src="/brand/logo-final-white.svg" alt="M.D.N Tech logo" width={1000} height={589} unoptimized className="h-6 w-auto opacity-90" />
                <span className="text-xl font-semibold text-white tracking-tight">M.D.N Tech</span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed">
                Web, CRM systémy, AI chatboty a SEO pre slovenské firmy —
                moderné digitálne riešenia od jedného partnera.
              </p>
              <div className="flex items-center gap-1 mt-5 -ml-2">
                {skSocials.map(({ name, icon: Icon, link }) => (
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
              <h4 className={headingClass}>Máte projekt?</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Napíšte nám a ozveme sa do 24 hodín. Prvá konzultácia a biznis
                analýza sú zdarma a nezáväzné.
              </p>
              <Link
                href="/sk#kontakt"
                className="mt-5 inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-colors"
              >
                Nezáväzná konzultácia
              </Link>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 md:gap-8 mb-10">
            <div>
              <h4 className={headingClass}>Navigácia</h4>
              <nav className="flex flex-col gap-2.5">
                {SK_NAV_LINKS.map(({ title, link }) => (
                  <Link key={link} href={link} className={linkClass}>
                    {title}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <h4 className={headingClass}>Zdroje</h4>
              <nav className="flex flex-col gap-2.5">
                <Link href="/blog" className={linkClass}>
                  Blog
                </Link>
                <Link href="/" className={linkClass} hrefLang="en">
                  English
                </Link>
              </nav>
            </div>

            <div>
              <h4 className={headingClass}>Kontakt</h4>
              <div className="flex flex-col gap-2.5">
                <a href={SK_NAP.phoneHref} className={linkClass}>
                  {SK_NAP.phoneDisplay}
                </a>
                <a
                  href={SK_NAP.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  WhatsApp {SK_NAP.whatsappDisplay}
                </a>
                <a href={SK_NAP.emailHref} className={linkClass}>
                  {SK_NAP.email}
                </a>
              </div>
            </div>
          </div>

          {/* Bottom line. pr-20 below sm: the ChatKit bubble (widget.js) is
              fixed over the right 64px of the viewport on mobile and sat on
              top of the legal line at 390px — the clearance makes the text
              wrap short of the bubble's column. */}
          <div className="pt-6 pr-20 sm:pr-0 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-gray-400">
            <p className="leading-relaxed">{COMPANY_LEGAL_LINE}</p>
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Slovak translations, not the English originals — these
                  labels pointed at /privacy and /terms and dropped a Slovak
                  visitor into an English legal document. */}
              <Link href="/sk/ochrana-osobnych-udajov" className="hover:text-gray-300 transition-colors">
                Ochrana súkromia
              </Link>
              <Link href="/sk/obchodne-podmienky" className="hover:text-gray-300 transition-colors">
                Obchodné podmienky
              </Link>
              <span>© 2026 M.D.N TECH</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

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
    { name: "LinkedIn", icon: RxLinkedinLogo, link: "https://www.linkedin.com/company/111977261" },
    { name: "X", icon: RxTwitterLogo, link: "https://x.com/MDNTechOrg" },
    { name: "Instagram", icon: RxInstagramLogo, link: "https://www.instagram.com/mdntechorg/" },
    { name: "GitHub", icon: RxGithubLogo, link: TOOLKIT_REPO },
  ];

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
                <Image src="/brand/logo-final-white.svg" alt="M.D.N Tech logo" width={1000} height={589} unoptimized className="h-6 w-auto opacity-90" />
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
          {/* Narrower column gap below md: at 320px a 32px gap left each of the
              two columns ~124px, one pixel-pass short of the contact email. */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-8 mb-10">
            {/* Products — generated from the landing lineup */}
            <div>
              <h4 className={headingClass}>Products</h4>
              <nav className="flex flex-col gap-2.5">
                {products.map((product) => {
                  const marketingHref = MARKETING_ROUTES[product.id];
                  // A live product whose ONLY destination is the portal reads
                  // as "Soon" while the portal is closed (APP_LIVE). ChatKit
                  // and ToolKit are unaffected — they have marketing routes,
                  // and those pages stay live and indexable.
                  const portalOnly =
                    !marketingHref && !APP_LIVE && isAppHref(product.href);
                  if (product.status[mode] !== "live" || portalOnly) {
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
                {APP_LIVE && (
                  <a href={APP_URL} className={linkClass}>
                    Open the App
                  </a>
                )}
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
            <p className="leading-relaxed">{COMPANY_LEGAL_LINE}</p>
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
