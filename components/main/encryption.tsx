"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { slideInFromTop, slideInFromLeft, slideInFromRight } from "@/lib/motion";

export const Encryption = () => {
  return (
    <section id="security" className="flex flex-row relative items-center justify-center min-h-screen w-full max-w-full h-full py-20 px-4 md:px-20 overflow-hidden">
      {/* Background Video */}
      <div className="w-full max-w-full flex items-start justify-center absolute -z-10 overflow-hidden">
        <video
          loop
          muted
          autoPlay
          playsInline
          preload="false"
          className="w-full max-w-full h-auto opacity-30"
        >
          <source src="/videos/encryption-bg.webm" type="video/webm" />
        </video>
      </div>

      <div className="flex flex-col items-center justify-center w-full max-w-6xl relative z-10">
        {/* Main Title */}
        <motion.h1
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5 },
            },
          }}
          className="text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-10 text-center"
        >
          Our Engineering Stack
        </motion.h1>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, delay: 0.2 },
            },
          }}
          className="text-lg text-gray-400 text-center mb-12 max-w-3xl"
        >
          A modern, production-tested stack — chosen for performance, reliability, and the ability to move fast without creating technical debt.
        </motion.p>

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
            <h1 className="Welcome-text text-[12px]">Production-Tested Stack</h1>
          </div>
        </motion.div>

        {/* AI Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-12">
          {[
            {
              title: "Web & Frontend",
              description: "React · Next.js · Vite · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion",
              delay: 0.3,
            },
            {
              title: "Backend & APIs",
              description: "Node.js · Python · Java · FastAPI · tRPC · GraphQL · REST",
              delay: 0.4,
            },
            {
              title: "Database & Storage",
              description: "PostgreSQL · Supabase · MongoDB · Redis · SQL · S3-compatible storage",
              delay: 0.5,
            },
            {
              title: "Infrastructure & DevOps",
              description: "Vercel · Railway · AWS · Docker · GitHub · CI/CD pipelines",
              delay: 0.6,
            },
            {
              title: "AI & Intelligent Systems",
              description: "LLM integration · RAG pipelines · AI agents · MCP servers · Claude Code",
              delay: 0.7,
            },
            {
              title: "Game Development",
              description: "Unity · Unreal Engine 5 · Web3 game integrations",
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
          <p className="text-base text-gray-400 max-w-3xl leading-relaxed">
            This is the stack we reach for every day — but our tools never stand still. We continuously evaluate and adopt the latest technologies as they emerge.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
