"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { slideInFromTop } from "@/lib/motion";
import { FaRocket, FaShieldAlt, FaBrain, FaRobot, FaLock, FaUsers } from "react-icons/fa";

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
    icon: React.ComponentType<{ className?: string }>;
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
              <item.icon className="w-6 h-6 text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-cyan-400" style={{ fill: 'url(#icon-gradient)' }} />
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgb(168, 85, 247)" />
                    <stop offset="100%" stopColor="rgb(34, 211, 238)" />
                  </linearGradient>
                </defs>
              </svg>
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
        className="text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-10 text-center"
      >
        Why AI Engineering Changes Everything
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
        <p className="text-lg text-gray-400 mb-16 text-center max-w-3xl leading-relaxed">
          In 2026, the difference between a good development partner and a great one is how deeply AI is embedded in their engineering practice.
        </p>
      </motion.div>

      {/* Value Propositions */}
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
              title: "10× Faster Development Cycles",
              description: "Our engineers use Claude Code, autonomous agent teams, and spec-driven workflows to compress months of development into weeks. A feature that requires a traditional developer a sprint takes our AI engineers hours. We don't guess — we plan with AI, validate the plan, then execute with precision. The result: faster delivery without technical debt.",
              delay: 0.3,
              icon: FaRocket,
            },
            {
              title: "Production-Quality from Day One",
              description: "We don't ship prototypes and call them products. Every system is built with TypeScript strict mode, automated testing, security hardening, and CI/CD pipelines from the first commit. AI accelerates our velocity; our engineering standards ensure what ships is production-ready, secure, and maintainable.",
              delay: 0.4,
              icon: FaShieldAlt,
            },
            {
              title: "The Latest Models, Applied Correctly",
              description: "We work with Claude, ChatGPT, Gemini, Midjourney, and emerging models as they release. We know which model to use for which task, how to chain them, how to guard against prompt injection, and how to build systems that remain reliable when models are updated or swapped.",
              delay: 0.5,
              icon: FaBrain,
            },
            {
              title: "Autonomous Agents That Actually Work",
              description: "We design multi-agent systems where specialized AI agents handle research, planning, implementation, and validation in parallel. Our agent architectures are built for production: with proper sandboxing, fallback logic, approval gates, and observability. Not chatbot demos — real autonomous systems doing real work.",
              delay: 0.6,
              icon: FaRobot,
            },
            {
              title: "Security-Hardened by Default",
              description: "Security is not a phase for us — it is woven into every layer. Every API endpoint is authenticated, rate-limited, and validated. Every AI integration is sandboxed. Every deployment goes through automated security scanning before it reaches production.",
              delay: 0.7,
              icon: FaLock,
            },
            {
              title: "Single Team, Full Depth",
              description: "You work with full-stack AI engineers who understand the entire system — from database schema to AI model selection to mobile UI. No handoffs between siloed specialists. No translation loss between design, backend, and AI teams. One team with complete ownership.",
              delay: 0.8,
              icon: FaUsers,
            },
          ].map((item, index) => (
            <FeatureCard key={index} item={item} index={index} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};