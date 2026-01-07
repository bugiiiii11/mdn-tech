"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { SkillText } from "@/components/sub/skill-text";

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
      className={`relative p-6 md:p-8 border-purple-500/40 group overflow-hidden transition-all duration-300 border`}
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
        <h3 className="text-base font-semibold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
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
    title: "AI & Machine Learning",
    description: "LLM integration, RAG systems, AI agents, and intelligent automation solutions.",
  },
  {
    icon: "/icons/Web3.svg",
    title: "Blockchain & Web3",
    description: "Smart contracts, DeFi systems, wallet integrations, and blockchain analytics.",
  },
  {
    icon: "/icons/FullStack.svg",
    title: "Full-Stack Development",
    description: "Scalable backend systems, APIs, microservices, and cloud-native architecture.",
  },
  {
    icon: "/icons/Mobile.svg",
    title: "Mobile Development",
    description: "iOS & Android apps with React Native, Flutter, and Web3 integrations.",
  },
  {
    icon: "/icons/UI.svg",
    title: "UI/UX & Product Design",
    description: "UX research, design systems, product branding, and conversion-focused design.",
  },
  {
    icon: "/icons/Game.svg",
    title: "Game Development",
    description: "Unity, Unreal Engine, Web3 games, multiplayer systems, and AR/VR experiences.",
  },
];

export const Skills = () => {
  return (
    <section
      id="services"
      className="flex flex-col items-center justify-center gap-3 h-full relative overflow-hidden py-20 px-4 md:px-20"
    >
      <SkillText />

      <div className="w-full max-w-6xl mt-12">
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
