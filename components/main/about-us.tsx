"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { slideInFromTop } from "@/lib/motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

const AnimatedCounter = ({ value, suffix = "", duration = 2 }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
};

interface FeatureCardProps {
  item: {
    title: string;
    description: string;
    delay: number;
  };
  index: number;
}

const FeatureCard = ({ item, index }: FeatureCardProps) => {
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
            delay: item.delay,
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
            {/* Icon placeholder with animation */}
            <motion.div
              className="w-12 h-12 mb-4 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-cyan-400 rounded"></div>
            </motion.div>

            <h4 className="text-xl font-semibold text-white mb-3">
              {item.title}
            </h4>

            <motion.p
              className="text-gray-400 leading-relaxed"
              animate={{
                color: isHovered ? "#e5e7eb" : "#9ca3af",
              }}
              transition={{ duration: 0.3 }}
            >
              {item.description}
            </motion.p>
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

export const AboutUs = () => {
  return (
    <section id="about-us" className="flex flex-col items-center justify-center py-20 px-4 md:px-20">
      <motion.h1
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={slideInFromTop}
        className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-10 text-center"
      >
        About Us
      </motion.h1>

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
        className="flex flex-col items-center justify-center max-w-4xl w-full"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
          Building Digital Excellence
        </h2>

        <p className="text-lg text-gray-400 mb-2 text-center max-w-3xl leading-relaxed">
          A UAE-based development studio delivering web, mobile, AI, and blockchain solutions for startups and enterprises worldwide.
        </p>

        <p className="text-lg text-gray-400 mb-16 text-center max-w-3xl leading-relaxed">
          We specialize in turning complex technical ideas into scalable, production-ready systems.
        </p>
      </motion.div>

      {/* Proven Experience */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { y: -30, opacity: 0 },
          visible: {
            y: 0,
            opacity: 1,
            transition: { delay: 0.3, duration: 0.5 },
          },
        }}
        className="flex flex-col items-center justify-center max-w-4xl w-full mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
          Built by Engineers Who&apos;ve Shipped at Scale
        </h2>
        <p className="text-lg text-gray-400 mb-8 text-center max-w-3xl leading-relaxed">
          M.D.N Tech is new. Our expertise isn&apos;t. Our founding team has spent decades building production systems for enterprise clients, scaling startups, and shipping products used by millions. We brought that experience together under one roof — so you get senior-level execution from day one.
        </p>
        <p className="text-sm text-gray-500 italic mb-4">Our team has delivered for</p>
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-lg font-semibold text-gray-300">
          <span>BMW</span>
          <span className="text-gray-600">·</span>
          <span>Accenture</span>
          <span className="text-gray-600">·</span>
          <span>ČSOB</span>
          <span className="text-gray-600">·</span>
          <span>Telecom</span>
          <span className="text-gray-600">·</span>
          <span>Cryptomeda</span>
        </div>
      </motion.div>

      {/* Impact Metrics */}
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
              delay: 0.4,
              duration: 0.5,
            },
          },
        }}
        className="w-full max-w-6xl mb-16"
      >
        <div className="flex flex-col md:flex-row items-center justify-center gap-0">
          <div className="flex flex-col items-center justify-center flex-1 py-8 px-6">
            <div className="text-5xl md:text-6xl font-bold text-white mb-3">
              <AnimatedCounter value={20} suffix="+" duration={2} />
            </div>
            <div className="text-white text-center text-sm md:text-base">Web Platforms Delivered</div>
          </div>
          <div className="hidden md:block w-px h-20 bg-gray-600"></div>
          <div className="flex flex-col items-center justify-center flex-1 py-8 px-6">
            <div className="text-5xl md:text-6xl font-bold text-white mb-3">
              <AnimatedCounter value={15} suffix="+" duration={2} />
            </div>
            <div className="text-white text-center text-sm md:text-base">Mobile Apps Launched</div>
          </div>
          <div className="hidden md:block w-px h-20 bg-gray-600"></div>
          <div className="flex flex-col items-center justify-center flex-1 py-8 px-6">
            <div className="text-5xl md:text-6xl font-bold text-white mb-3">
              <AnimatedCounter value={30} suffix="+" duration={2} />
            </div>
            <div className="text-white text-center text-sm md:text-base">Smart Contracts Deployed</div>
          </div>
        </div>
      </motion.div>

      {/* Why M.D.N Tech */}
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
              delay: 0.6,
              duration: 0.5,
            },
          },
        }}
        className="w-full max-w-6xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Enterprise-Grade Architecture",
              description: "Built to scale from day one — supporting millions of users and transactions.",
              delay: 0.8,
            },
            {
              title: "Modern Technology Stack",
              description: "AI, React, Node.js, blockchain, cloud-native systems.",
              delay: 0.9,
            },
            {
              title: "UAE-Based, Global Reach",
              description: "UAE presence with international delivery standards.",
              delay: 1.0,
            },
            {
              title: "Full Lifecycle Partnership",
              description: "From idea and design to launch and post-release optimization.",
              delay: 1.1,
            },
          ].map((item, index) => (
            <FeatureCard key={index} item={item} index={index} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};