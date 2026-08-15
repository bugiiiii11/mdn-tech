"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
// import Image from "next/image"; // Uncomment when restoring lock icon section

import { slideInFromTop, slideInFromLeft, slideInFromRight } from "@/lib/motion";

export const Encryption = () => {
  // Raw <video autoPlay> ignores the OS reduced-motion setting, and the
  // marketing tree's ReducedMotionProvider only covers framer animations —
  // pause the scenery explicitly (DESIGN.md: every video needs a pause path).
  const reducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reducedMotion) video.pause();
    else video.play().catch(() => {});
  }, [reducedMotion]);

  return (
    <section id="security" className="flex flex-row relative items-center justify-center min-h-screen w-full max-w-full h-full py-20 px-4 md:px-20 overflow-hidden">
      {/* Background Video */}
      <div className="w-full max-w-full flex items-start justify-center absolute -z-10 overflow-hidden">
        <video
          ref={videoRef}
          loop
          muted
          autoPlay={!reducedMotion}
          playsInline
          preload="none"
          className="w-full max-w-full h-auto opacity-30"
        >
          <source src="/videos/encryption-bg.webm" type="video/webm" />
        </video>
      </div>

      <div className="flex flex-col items-center justify-center w-full max-w-6xl relative z-10">
        {/* Main Title */}
        <motion.h2
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
        </motion.h2>

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
          className="text-lg text-gray-300 text-center mb-12 max-w-3xl"
        >
          The technologies our engineers have shipped production systems with across their careers — and the core stack we build on every day.
        </motion.p>

        {/* Lock Icon Section - Hidden for now, uncomment to restore
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
        */}

        {/* AI Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full mb-12">
          {[
            {
              title: "Web & Frontend",
              description: "React · Next.js · Vue · Svelte · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion · Three.js · WebAssembly",
              delay: 0.3,
            },
            {
              title: "Backend & APIs",
              description: "Node.js · Python · Go · Rust · FastAPI · NestJS · GraphQL · tRPC · REST · WebSockets · Kafka",
              delay: 0.4,
            },
            {
              title: "Database & Storage",
              description: "PostgreSQL · MongoDB · Redis · Supabase · Pinecone · Elasticsearch · Prisma · Snowflake · S3-compatible storage",
              delay: 0.5,
            },
            {
              title: "Infrastructure & DevOps",
              description: "AWS · Google Cloud · Azure · Vercel · Netlify · Docker · Kubernetes · Terraform · GitHub Actions · Prometheus · Grafana",
              delay: 0.6,
            },
            {
              title: "AI & Intelligent Systems",
              description: "OpenAI · Anthropic · LangChain · LlamaIndex · RAG pipelines · AI agents · Vector databases · Fine-tuning · MCP servers · Claude Code",
              delay: 0.7,
            },
            {
              title: "Game Development",
              description: "Unity · Unreal Engine 5 · Godot · Blender · Photon · Web3 gaming · AR/VR",
              delay: 0.8,
            },
            {
              title: "Mobile",
              description: "React Native · Flutter · Swift · Kotlin · Progressive Web Apps (PWA)",
              delay: 0.8,
            },
            {
              title: "Payment & E-commerce",
              description: "Stripe · Shopify · Medusa · Paddle · Lemon Squeezy · Crypto payments",
              delay: 0.8,
            },
            {
              title: "CMS & Digital Experience",
              description: "Sanity · Contentful · Strapi · WordPress · Payload CMS · TinaCMS",
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
              <p className="text-sm text-gray-300 leading-relaxed">{feature.description}</p>
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
          {/* S57 honesty fix: the daily core is Next.js/TypeScript/Supabase/
              Vercel — the wider grid is career experience, not daily use. */}
          <p className="text-base text-gray-300 max-w-3xl leading-relaxed">
            Our daily core is Next.js, TypeScript, Supabase, and Vercel — the rest is experience we draw on when a project calls for it. The stack never stands still: we evaluate and adopt new technology as it earns its place.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
