"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useState, useRef } from "react";

interface TechResultProps {
  icon: string;
  category: string;
  results: {
    metric: string;
    value: string;
  }[];
  index: number;
}

const TechResultCard = ({ icon, category, results, index }: TechResultProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { y: 50, opacity: 0, scale: 0.9, rotateX: -15 },
        visible: {
          y: 0,
          opacity: 1,
          scale: 1,
          rotateX: 0,
          transition: {
            delay: index * 0.1,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group relative perspective-1000"
    >
      <div className="relative h-full transform-gpu">
        {/* Main card */}
        <div className="relative h-full p-6 rounded-xl border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm overflow-hidden transform-gpu">
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-60"
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + (i % 3) * 30}%`,
              }}
              animate={{
                y: isHovered ? [0, -20, 0] : 0,
                x: isHovered ? [0, 10, 0] : 0,
                opacity: isHovered ? [0, 1, 0] : 0,
                scale: isHovered ? [0, 1.5, 0] : 0,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Glow effect that follows mouse */}
          <motion.div
            className="absolute w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-300"
            style={{
              x: useTransform(mouseXSpring, [-0.5, 0.5], ["-50%", "50%"]),
              y: useTransform(mouseYSpring, [-0.5, 0.5], ["-50%", "50%"]),
            }}
          />

          {/* Content */}
          <div className="relative z-10 transform-gpu">
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Image
                  src={icon}
                  alt={category}
                  width={40}
                  height={40}
                  className="w-8 h-8"
                />
              </motion.div>
              <h3 className="text-xl font-semibold text-white">{category}</h3>
            </div>
            <div className="space-y-4">
              {results.map((result, i) => (
                <div key={i} className="flex items-center justify-between">
                  <motion.span
                    className="text-gray-400 text-sm"
                    animate={{
                      color: isHovered ? "#e5e7eb" : "#9ca3af",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {result.metric}
                  </motion.span>
                  <span className="text-white font-semibold">{result.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shine sweep effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            initial={{ x: "-100%" }}
            animate={{
              x: isHovered ? "100%" : "-100%",
            }}
            transition={{
              duration: 1.5,
              repeat: isHovered ? Infinity : 0,
              repeatDelay: 2,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

const techResults = [
  {
    icon: "/icons/FullStack.svg",
    category: "Full-Stack Development",
    results: [
      { metric: "Web Platforms Delivered", value: "20+" },
      { metric: "APIs Developed", value: "100+" },
      { metric: "Microservices Built", value: "20+" },
      { metric: "Cloud Deployments", value: "30+" },
    ],
  },
  {
    icon: "/icons/Mobile.svg",
    category: "Mobile Development",
    results: [
      { metric: "Mobile Apps Built", value: "20+" },
      { metric: "Telegram Mini Apps", value: "3" },
      { metric: "App Features Delivered", value: "50+" },
      { metric: "Enterprise Mobile Projects", value: "20+" },
    ],
  },
  {
    icon: "/icons/Game.svg",
    category: "Game Development",
    results: [
      { metric: "Unity Games Built", value: "5" },
      { metric: "Game Mechanics Designed", value: "15+" },
      { metric: "In-Game Economies Designed", value: "5" },
      { metric: "Web3 Game Integrations", value: "10+" },
    ],
  },
  {
    icon: "/icons/Web3.svg",
    category: "Blockchain & Web3",
    results: [
      { metric: "Smart Contracts Deployed", value: "50+" },
      { metric: "Web3 Partnerships", value: "100+" },
      { metric: "Web3 Games Released", value: "2" },
      { metric: "Community members", value: "100k+" },
    ],
  },
  {
    icon: "/icons/AI.svg",
    category: "AI & Agent Systems",
    results: [
      { metric: "AI-Powered Apps Built", value: "5+" },
      { metric: "Automated Workflows Deployed", value: "25+" },
      { metric: "Development Speed Increase", value: "10×" },
      { metric: "Full Project Lifecycles Delivered", value: "30+" },
    ],
  },
  {
    icon: "/icons/UI.svg",
    category: "Enterprise Track Record",
    results: [
      { metric: "Enterprise Systems Built", value: "20+" },
      { metric: "Years Delivering For Corporates", value: "30+" },
      { metric: "Corporate Clients Served", value: "8" },
      { metric: "Enterprise Mobile Projects", value: "10+" },
    ],
  },
];



export const Projects = () => {
  return (
    <section
      id="projects"
      className="flex flex-col items-center justify-center py-20 px-4 md:px-20 w-full max-w-full overflow-hidden"
    >
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
        Our Results
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
        className="text-lg text-gray-400 text-center mb-12 max-w-2xl"
      >
        Years of combined experience — now under one roof.
      </motion.p>

      {/* Technology Results Grid */}
      <div className="w-full max-w-6xl mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techResults.map((tech, index) => (
            <TechResultCard
              key={tech.category}
              icon={tech.icon}
              category={tech.category}
              results={tech.results}
              index={index}
            />
          ))}
        </div>
      </div>

    </section>
  )
}
