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
    { name: "LinkedIn", icon: RxLinkedinLogo, link: "https://linkedin.com" },
    { name: "Twitter", icon: RxTwitterLogo, link: "https://twitter.com" },
    { name: "Instagram", icon: RxInstagramLogo, link: "https://instagram.com" },
  ];

  return (
    <footer className="w-full bg-[#030014] py-12 md:py-16 border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <Image src="/logo.png" alt="" width={28} height={28} className="w-7 h-7" />
          <span className="text-lg font-semibold text-white">M.D.N Tech</span>
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 mb-8 text-sm text-gray-400">
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms & Conditions
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/#blog" className="hover:text-white transition-colors">
            Blog
          </Link>
        </div>

        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 justify-center mb-8 max-w-sm mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email for newsletter"
            required
            className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-white/20"
          />
          <button
            type="submit"
            className="py-2.5 px-5 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/15 transition-colors"
          >
            Subscribe
          </button>
        </form>

        <div className="flex justify-center gap-6 mb-8">
          {socials.map(({ name, icon: Icon, link }) => (
            <Link
              key={name}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
              aria-label={name}
            >
              <Icon className="w-5 h-5" />
            </Link>
          ))}
        </div>

        <p className="text-gray-500 text-xs leading-relaxed mb-2">
          Al Shmookh Business Center, One UAQ, UAQ Free Trade Zone, Umm Al Quwain, U.A.E. · License 7813
        </p>
        <p className="text-gray-600 text-xs">
          © 2026 M.D.N TECH
        </p>
      </div>
    </footer>
  );
};
