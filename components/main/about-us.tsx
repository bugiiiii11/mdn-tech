"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { slideInFromTop } from "@/lib/motion";
import { FaRocket, FaShieldAlt, FaBrain, FaUsers } from "react-icons/fa";

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
              <item.icon className="w-6 h-6 text-cyan-400" />
            </motion.div>

            <h3 className="text-xl font-semibold text-white mb-3">
              {item.title}
            </h3>

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
    <section id="about-us" className="flex flex-col items-center justify-center py-20 px-4 md:px-20 w-full max-w-full overflow-hidden">
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={slideInFromTop}
        className="text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-10 text-center"
      >
        Why Our Approach Changes Everything
      </motion.h2>

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
          We combine years of full-stack experience with modern AI engineering practices — building faster, more securely, and with a level of ownership that traditional team structures simply cannot match.
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
              title: "Weeks, Not Months",
              description: "What takes a traditional team months of back-and-forth, handoffs, and reviews, our engineers complete in weeks, smaller projects in days. Not by cutting corners — but by eliminating every inefficiency that slows conventional development down.",
              delay: 0.3,
              icon: FaRocket,
            },
            {
              title: "One Engineer. Full Lifecycle.",
              description: "Most projects at M.D.N Tech are owned end-to-end by a single full-stack AI engineer — acting as architect, developer, and project lead at the same time. No translation loss between teams. No handoffs. One person with complete context, driving the project from discovery to production.",
              delay: 0.4,
              icon: FaUsers,
            },
            {
              title: "Production-Ready from Day One",
              description: "We don't ship prototypes dressed as products. Every feature is tested, every endpoint is secured, and every deployment is validated before it goes live. The result is software that works at scale — from day one.",
              delay: 0.5,
              icon: FaShieldAlt,
            },
            {
              title: "Every Layer. One Team.",
              description: "Front end, back end, mobile, infrastructure, design implementation, SEO — one team, no silos. Our engineers are built to own the whole product, which means faster decisions, cleaner architecture, and a final product that holds together under real-world conditions.",
              delay: 0.6,
              icon: FaBrain,
            },
          ].map((item, index) => (
            <FeatureCard key={index} item={item} index={index} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};