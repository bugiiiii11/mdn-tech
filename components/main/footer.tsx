"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { RxTwitterLogo, RxLinkedinLogo, RxInstagramLogo } from "react-icons/rx";

export const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribed:", email);
    setEmail("");
  };

  const socials = [
    { name: "LinkedIn", icon: RxLinkedinLogo, link: "https://www.linkedin.com/company/mdntech/" },
    { name: "Twitter", icon: RxTwitterLogo, link: "https://x.com/MDNTechOrg" },
    { name: "Instagram", icon: RxInstagramLogo, link: "https://www.instagram.com/mdntechorg/" },
  ];

  return (
    <>
      {/* Blackhole effect - clipped to show only top half, stuck to footer */}
      <div className="relative w-full overflow-hidden" style={{ height: '270px' }}>
        <video
          autoPlay
          muted
          loop
          className="absolute top-0 left-0 w-full pointer-events-none object-contain -z-20"
          style={{ height: '540px' }}
        >
          <source src="/videos/blackhole.webm" type="video/webm" />
        </video>
      </div>

      {/* Footer */}
      <footer className="w-full relative bg-[#050518]">
        <div className="max-w-6xl mx-auto px-4 md:px-8 pt-6 pb-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 mb-6">
          {/* Left: Brand + description */}
          <div>
            <Link href="/#home" className="inline-flex items-center gap-2.5 mb-4">
              <Image src="/logo.png" alt="" width={32} height={32} className="w-8 h-8 opacity-90" />
              <span className="text-xl font-semibold text-white tracking-tight">M.D.N Tech</span>
            </Link>
            <p className="text-gray-500 text-sm mb-6 max-w-[280px]">
              Full-stack AI engineers building production-ready systems with the latest AI models, autonomous agents, and modern engineering practices.
            </p>
          </div>

          {/* Right: Links + newsletter + socials */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">
            <nav className="flex flex-col gap-3">
              <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors w-fit">
                Terms & Conditions
              </Link>
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors w-fit">
                Privacy Policy
              </Link>
              <Link href="/#blog" className="text-sm text-gray-400 hover:text-white transition-colors w-fit">
                Blog
              </Link>
            </nav>
            <div className="min-w-0 max-w-[320px]">
              <p className="text-xs text-gray-500 mb-3">Newsletter</p>
              <form onSubmit={handleSubscribe} className="flex gap-2 mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="flex-1 min-w-0 px-3 py-2.5 rounded-md bg-white/5 border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/40"
                />
                <button
                  type="submit"
                  className="shrink-0 px-4 py-2 button-primary text-center text-white cursor-pointer rounded-lg text-sm font-semibold"
                >
                  Subscribe
                </button>
              </form>
              <div className="flex gap-3">
                {socials.map(({ name, icon: Icon, link }) => (
                  <Link
                    key={name}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-md text-gray-500 hover:text-purple-400 hover:bg-white/5 transition-colors"
                    aria-label={name}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div className="pt-4 pb-1 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-500">
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
