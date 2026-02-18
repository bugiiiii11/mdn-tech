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
    <footer className="w-full bg-[#050518]">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 mb-12">
          {/* Left: Brand + socials */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <Image src="/logo.png" alt="" width={32} height={32} className="w-8 h-8 opacity-90" />
              <span className="text-xl font-semibold text-white tracking-tight">M.D.N Tech</span>
            </Link>
            <p className="text-gray-500 text-sm mb-6 max-w-[280px]">
              UAE-based. Web, mobile, AI & blockchain.
            </p>
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

          {/* Right: Links + newsletter */}
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
              <form onSubmit={handleSubscribe} className="flex gap-2">
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
                  className="shrink-0 px-4 py-2.5 rounded-md bg-purple-500/20 text-purple-300 text-sm font-medium hover:bg-purple-500/30 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-gray-600">
          <p className="leading-relaxed">
            Al Shmookh Business Center, One UAQ, UAQ Free Trade Zone, Umm Al Quwain, U.A.E. · License 7813
          </p>
          <p>© 2026 M.D.N TECH</p>
        </div>
      </div>
    </footer>
  );
};
