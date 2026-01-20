"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { RxDiscordLogo, RxTwitterLogo } from "react-icons/rx";
import { motion } from "framer-motion";

export const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribed:", email);
    setEmail("");
  };

  const footerLinks = {
    Product: [
      { name: "Features", link: "#features" },
      { name: "Integrations", link: "#integrations" },
      { name: "Pricing", link: "#pricing" },
      { name: "Changelog", link: "#changelog" },
      { name: "Roadmap", link: "#roadmap" },
    ],
    Company: [
      { name: "Our team", link: "#team" },
      { name: "Our values", link: "#values" },
      { name: "Blog", link: "#blog" },
    ],
    Resources: [
      { name: "Downloads", link: "#downloads" },
      { name: "Documentation", link: "#documentation" },
      { name: "Contact", link: "#contact-us" },
    ],
  };

  return (
    <footer className="w-full bg-[#030014] relative">
      <video
        autoPlay
        muted
        loop
        className="absolute md:top-[-240px] top-[-330px] left-0 w-full h-full md:object-fill object-contain -z-20"
      >
        <source src="/videos/blackhole.webm" type="video/webm" />
      </video>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Left Side - Logo & Social */}
          <div className="flex flex-col">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center mr-3">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>
              <span className="text-white text-xl font-semibold">M.D.N Tech</span>
            </div>
          </div>

          {/* Right Side - Navigation Links */}
          <div className="grid grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="flex flex-col">
                <h3 className="text-white font-bold mb-4">{title}</h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.link}
                        className="text-gray-300 hover:text-white transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700/50 my-8"></div>

        {/* Newsletter Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="flex-1">
            <h3 className="text-white font-bold mb-2">Join our newsletter</h3>
            <p className="text-gray-400 text-sm">
              Keep up to date with everything M.D.N Tech
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex gap-2 flex-1 md:justify-end">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="px-4 py-2 bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 min-w-[200px]"
            />
            <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#contact-us"
            className="py-3 px-8 button-primary text-center text-white cursor-pointer rounded-lg font-semibold transition-all duration-300"
          >
            Subscribe
          </motion.a>
          </form>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700/50 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-4 text-gray-400">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-gray-600">•</span>
            <Link
              href="/terms"
              className="hover:text-white transition-colors"
            >
              Terms of Conditions
            </Link>
          </div>
          <div className="text-gray-400">
            M.D.N Tech App, LLC. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
