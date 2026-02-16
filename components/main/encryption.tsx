"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { slideInFromTop, slideInFromLeft, slideInFromRight } from "@/lib/motion";

export const Encryption = () => {
  return (
    <section id="security" className="flex flex-row relative items-center justify-center min-h-screen w-full h-full py-20 px-4 md:px-20">
      {/* Background Video */}
      <div className="w-full flex items-start justify-center absolute -z-10">
        <video
          loop
          muted
          autoPlay
          playsInline
          preload="false"
          className="w-full h-auto opacity-30"
        >
          <source src="/videos/encryption-bg.webm" type="video/webm" />
        </video>
      </div>

      <div className="flex flex-col items-center justify-center w-full max-w-6xl relative z-10">
        {/* Main Title */}
        <motion.div
          variants={slideInFromTop}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-4">
            Enterprise{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
              Security
            </span>{" "}
            & Performance
          </h2>
          <p className="text-lg text-gray-400 text-center">
            Built with security-first architecture and optimized for scale
          </p>
        </motion.div>

        {/* Lock Icon Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { y: -50, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: {
                delay: 0.2,
                duration: 0.5,
              },
            },
          }}
          className="flex flex-col items-center justify-center mb-12"
        >
          <div className="flex flex-col items-center group cursor-pointer w-auto h-auto">
            <Image
              src="/lock-top.png"
              alt="Lock top"
              width={50}
              height={50}
              className="translate-y-5 transition-all duration-200 group-hover:translate-y-11"
            />
            <Image
              src="/lock-main.png"
              alt="Lock main"
              width={70}
              height={70}
              className="z-10"
            />
          </div>

          <div className="Welcome-box px-[15px] py-[4px] z-[20] border my-[20px] border-[#7042F88B] opacity-[0.9]">
            <h1 className="Welcome-text text-[12px]">Bank-Grade Security</h1>
          </div>
        </motion.div>

        {/* Security Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-12">
          {[
            {
              title: "End-to-End Encryption",
              description: "AES-256 encryption for data at rest and in transit across all client projects",
              delay: 0.3,
            },
            {
              title: "Secured Smart Contracts",
              description: "Smart contracts deployed across DeFi, NFT marketplace, and decentralized applications",
              delay: 0.4,
            },
            {
              title: "Pursuing SOC 2 Compliance",
              description: "Building towards enterprise-grade security certification and formal audit readiness",
              delay: 0.5,
            },
            {
              title: "Enterprise-Proven Infrastructure",
              description: "Robust architectures built for BMW, Accenture, ČSOB, and Telecom environments",
              delay: 0.6,
            },
            {
              title: "Real-Time Monitoring",
              description: "24/7 system monitoring with automated alerts and incident response",
              delay: 0.7,
            },
            {
              title: "GDPR & Data Compliance",
              description: "Full compliance with international data protection laws and UAE regulations",
              delay: 0.8,
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={slideInFromLeft(feature.delay)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          variants={slideInFromRight(0.9)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-xl md:text-2xl font-medium text-gray-200 mb-4">
            Secure your data with enterprise-grade encryption
          </p>
          <p className="text-base text-gray-400 max-w-2xl">
            From smart contract audits to API security, we ensure your systems are protected at every layer.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
