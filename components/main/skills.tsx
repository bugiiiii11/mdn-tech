"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  index: number;
}

const ServiceCard = ({ icon, title, description, index }: ServiceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            delay: index * 0.08,
            duration: 0.5,
            ease: "easeOut",
          },
        },
      }}
      whileHover={{ y: -4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative p-6 rounded-xl border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm group overflow-hidden transition-all duration-300`}
    >
      {/* Glass morphism background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent backdrop-blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* HUD Border Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        {/* Top border - animated draw */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          initial={{ scaleX: 0 }}
          animate={isHovered ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
          style={{ transformOrigin: "left" }}
        />
        
        {/* Bottom border - animated draw */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          initial={{ scaleX: 0 }}
          animate={isHovered ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          style={{ transformOrigin: "right" }}
        />
        
        {/* Left border - animated draw */}
        <motion.div
          className="absolute top-0 bottom-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
          initial={{ scaleY: 0 }}
          animate={isHovered ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          style={{ transformOrigin: "top" }}
        />
        
        {/* Right border - animated draw */}
        <motion.div
          className="absolute top-0 bottom-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
          initial={{ scaleY: 0 }}
          animate={isHovered ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          style={{ transformOrigin: "bottom" }}
        />
        
        {/* Animated corner brackets - Top Left */}
        <motion.div
          className="absolute top-0 left-0"
          initial={{ opacity: 0, scale: 0 }}
          animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="w-6 h-6 border-t-[2px] border-l-[2px] border-cyan-400"></div>
        </motion.div>
        
        {/* Animated corner brackets - Top Right */}
        <motion.div
          className="absolute top-0 right-0"
          initial={{ opacity: 0, scale: 0 }}
          animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="w-6 h-6 border-t-[2px] border-r-[2px] border-cyan-400"></div>
        </motion.div>
        
        {/* Animated corner brackets - Bottom Left */}
        <motion.div
          className="absolute bottom-0 left-0"
          initial={{ opacity: 0, scale: 0 }}
          animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="w-6 h-6 border-b-[2px] border-l-[2px] border-cyan-400"></div>
        </motion.div>
        
        {/* Animated corner brackets - Bottom Right */}
        <motion.div
          className="absolute bottom-0 right-0"
          initial={{ opacity: 0, scale: 0 }}
          animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <div className="w-6 h-6 border-b-[2px] border-r-[2px] border-cyan-400"></div>
        </motion.div>
        
        {/* Scanning line effect */}
        {isHovered && (
          <motion.div
            className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
            initial={{ top: 0 }}
            animate={{
              top: ["0%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        )}
        
        {/* Pulsing border glow */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 border-[1px] border-cyan-400/30"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
        
        {/* Animated corner glow - enhanced HUD effect */}
        {isHovered && (
          <>
            {/* Top Left Corner Glow */}
            <motion.div
              className="absolute top-0 left-0 w-6 h-6"
              animate={{
                boxShadow: [
                  "0 0 0px rgba(34, 211, 238, 0), inset 0 0 0px rgba(34, 211, 238, 0)",
                  "0 0 15px rgba(34, 211, 238, 0.9), inset 0 0 10px rgba(34, 211, 238, 0.3)",
                  "0 0 0px rgba(34, 211, 238, 0), inset 0 0 0px rgba(34, 211, 238, 0)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {/* Top Right Corner Glow */}
            <motion.div
              className="absolute top-0 right-0 w-6 h-6"
              animate={{
                boxShadow: [
                  "0 0 0px rgba(34, 211, 238, 0), inset 0 0 0px rgba(34, 211, 238, 0)",
                  "0 0 15px rgba(34, 211, 238, 0.9), inset 0 0 10px rgba(34, 211, 238, 0.3)",
                  "0 0 0px rgba(34, 211, 238, 0), inset 0 0 0px rgba(34, 211, 238, 0)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.5,
                ease: "easeInOut",
              }}
            />
            {/* Bottom Left Corner Glow */}
            <motion.div
              className="absolute bottom-0 left-0 w-6 h-6"
              animate={{
                boxShadow: [
                  "0 0 0px rgba(34, 211, 238, 0), inset 0 0 0px rgba(34, 211, 238, 0)",
                  "0 0 15px rgba(34, 211, 238, 0.9), inset 0 0 10px rgba(34, 211, 238, 0.3)",
                  "0 0 0px rgba(34, 211, 238, 0), inset 0 0 0px rgba(34, 211, 238, 0)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 1,
                ease: "easeInOut",
              }}
            />
            {/* Bottom Right Corner Glow */}
            <motion.div
              className="absolute bottom-0 right-0 w-6 h-6"
              animate={{
                boxShadow: [
                  "0 0 0px rgba(34, 211, 238, 0), inset 0 0 0px rgba(34, 211, 238, 0)",
                  "0 0 15px rgba(34, 211, 238, 0.9), inset 0 0 10px rgba(34, 211, 238, 0.3)",
                  "0 0 0px rgba(34, 211, 238, 0), inset 0 0 0px rgba(34, 211, 238, 0)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 1.5,
                ease: "easeInOut",
              }}
            />
          </>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <motion.div 
          className="mb-6 text-white/90"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={icon}
            alt={title}
            width={40}
            height={40}
            className="w-10 h-10"
          />
        </motion.div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

const services = [
  {
    icon: "/icons/AI.svg",
    title: "AI Systems & Agent Engineering",
    description: "We design and deploy production-grade AI systems: LLM integration across OpenAI, Anthropic Claude, and open-source models; Retrieval-Augmented Generation (RAG) pipelines; autonomous multi-agent architectures that execute complex workflows without human intervention; AI-powered automation replacing entire operational processes. We build AI that does real work — not demos.",
  },
  {
    icon: "/icons/Web3.svg",
    title: "Blockchain & Web3",
    description: "Smart contract development, DeFi protocol architecture, wallet integrations, and on-chain analytics systems. We build secure, audited contracts and scalable Web3 infrastructure — enhanced by AI-powered verification and on-chain intelligence tools.",
  },
  {
    icon: "/icons/FullStack.svg",
    title: "Full-Stack Development",
    description: "Scalable backend systems, RESTful and GraphQL APIs, microservices architecture, and cloud-native infrastructure on AWS, GCP, and Azure. We write clean, maintainable, production-hardened code — accelerated by AI-assisted development that compresses build cycles without compromising quality.",
  },
  {
    icon: "/icons/Mobile.svg",
    title: "Mobile Development",
    description: "Native-quality iOS and Android apps built with React Native and Flutter. We integrate AI features natively — on-device inference, intelligent personalization, voice interfaces — and support Telegram Mini Apps and Web3 wallet connections. Enterprise-grade mobile with modern AI capabilities.",
  },
  {
    icon: "/icons/UI.svg",
    title: "UI/UX & Product Design",
    description: "Research-backed UX, AI-assisted design systems, and conversion-focused product experiences. We use AI tools to accelerate research synthesis, generate design variations, and produce consistent component libraries that translate directly to code — eliminating the gap between design and implementation.",
  },
  {
    icon: "/icons/Game.svg",
    title: "Game Development",
    description: "Unity and Unreal Engine game development with intelligent NPC systems, procedural content generation, dynamic in-game economies, and Web3 integrations. We apply AI to create game experiences that adapt, evolve, and surprise players at runtime.",
  },
];

export const Skills = () => {
  return (
    <section
      id="services"
      className="flex flex-col items-center justify-center gap-3 h-full relative overflow-hidden py-20 px-4 md:px-20 w-full max-w-full"
    >
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
        What We Build
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
        We don&apos;t just use AI as a tool — we build with it at the core. Every project is engineered by full-stack AI engineers who combine deep technical expertise with the latest AI models, autonomous agents, and spec-driven workflows to deliver production-ready systems at a pace traditional development cannot match.
      </motion.p>

      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              index={index}
            />
          ))}
        </div>
      </div>

      <div className="w-full h-full absolute">
        <div className="w-full h-full z-[-10] opacity-30 absolute flex items-center justify-center bg-cover">
          <video
            className="w-full h-auto"
            preload="false"
            playsInline
            loop
            muted
            autoPlay
          >
            <source src="/videos/skills-bg.webm" type="video/webm" />
          </video>
        </div>
      </div>
    </section>
  );
};
