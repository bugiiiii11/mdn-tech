'use client';
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { LINKS, NAV_LINKS, SOCIALS } from "@/constants";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="w-screen h-[65px] fixed top-0 left-0 right-0 shadow-lg shadow-[#2A0E61]/50 bg-[#03001427] backdrop-blur-md z-50">
      {/* Navbar Container */}
      <div className="w-full h-full flex items-center justify-between px-3 md:px-10">
        {/* Logo + Name - always links to homepage */}
        <Link
          href="/#home"
          className="flex items-center gap-1.5 md:gap-2 flex-shrink-0 min-w-0"
        >
          <Image
            src="/logo.png"
            alt="M.D.N Tech"
            width={32}
            height={32}
            className="w-7 h-7 md:w-8 md:h-8 flex-shrink-0"
          />
          <div className="font-bold text-gray-300 text-sm md:text-base whitespace-nowrap overflow-hidden text-ellipsis">M.D.N Tech</div>
        </Link>

        {/* Web Navbar */}
        <div className="hidden md:flex w-[500px] h-full flex-row items-center justify-between">
          <div className="flex items-center justify-between w-full h-auto border border-[rgba(112,66,248,0.38)] bg-[rgba(3,0,20,0.37)] mr-[15px] px-[20px] py-[10px] rounded-full text-gray-200">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.title}
                href={link.link}
                className="cursor-pointer hover:text-[rgb(112,66,248)] transition"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>

        <Link
          href="/#contact-us"
          className="py-2 hidden md:flex px-4 button-primary text-center text-white cursor-pointer rounded-lg max-w-[200px]"
        >
          Start Project
        </Link>

        {/* Hamburger Menu */}
        <button
          className="md:hidden text-white focus:outline-none text-xl flex-shrink-0 w-10 h-10 flex items-center justify-center -mr-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-[65px] left-0 w-screen bg-gradient-to-b from-[#030014] to-[#0a0118] backdrop-blur-lg border-t border-[#7042f861] shadow-2xl md:hidden z-40">
          <div className="relative p-6">
            {/* Close button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg border border-[#7042f838] bg-[#7042f815] hover:border-[#7042f8] text-gray-400 hover:text-cyan-400 transition-all duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Links */}
            <div className="flex flex-col gap-2 mb-6">
              {NAV_LINKS.map((link, index) => (
                <Link
                  key={link.title}
                  href={link.link}
                  className="group relative px-4 py-3 rounded-lg overflow-hidden transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 border border-[#7042f838] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Link text */}
                  <span className="relative text-gray-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 font-medium transition-all duration-300">
                    {link.title}
                  </span>
                </Link>
              ))}

              <Link
                href={LINKS.sourceCode}
                target="_blank"
                rel="noreferrer noopener"
                className="group relative px-4 py-3 rounded-lg overflow-hidden transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 border border-[#7042f838] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative text-gray-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 font-medium transition-all duration-300">
                  Source Code
                </span>
              </Link>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mb-6" />

            {/* Social Icons */}
            <div className="flex justify-center gap-4">
              {SOCIALS.map(({ link, name, icon: Icon }) => (
                <Link
                  href={link}
                  target="_blank"
                  rel="noreferrer noopener"
                  key={name}
                  className="group relative p-3 rounded-lg border border-[#7042f838] bg-[#7042f815] hover:border-[#7042f8] transition-all duration-300"
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/0 to-cyan-500/0 group-hover:from-purple-500/20 group-hover:to-cyan-500/20 transition-all duration-300" />
                  <Icon className="relative h-6 w-6 text-gray-400 group-hover:text-cyan-400 transition-colors duration-300" />
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <Link
              href="/#contact-us"
              className="mt-6 w-full block"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="w-full py-3 px-6 button-primary text-center text-white rounded-lg font-semibold hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200">
                Start Project
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};