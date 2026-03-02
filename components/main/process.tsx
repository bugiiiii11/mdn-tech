"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import { slideInFromTop } from "@/lib/motion";

interface ProcessStepProps {
  step: {
    title: string;
    items: string[];
    delay: number;
  };
  index: number;
  isLast: boolean;
}

const ProcessStepCard = ({ step, index, isLast }: ProcessStepProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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
    <div className="relative flex flex-col md:flex-row items-start gap-6 md:gap-8">
      {/* Timeline connector - only show on desktop and not for last item */}
      {!isLast && (
        <div className="hidden md:block absolute left-6 top-20 w-0.5 h-[calc(100%+3rem)] bg-gradient-to-b from-purple-500/50 via-cyan-500/50 to-transparent" />
      )}

      {/* Step number circle */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          delay: step.delay,
          duration: 0.5,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 border-4 border-[#030014] flex items-center justify-center shadow-lg"
      >
        <span className="text-white font-bold text-lg">{index + 1}</span>
      </motion.div>

      {/* Card */}
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
              delay: step.delay,
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
        className="group relative perspective-1000 flex-1"
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
              <div
                className="flex items-center justify-between cursor-pointer group/title"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <h3 className="text-xl font-semibold text-white">
                  {step.title}
                </h3>
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-cyan-400 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </div>

              <motion.ul
                initial={false}
                animate={{
                  height: isExpanded ? "auto" : 0,
                  opacity: isExpanded ? 1 : 0,
                  marginTop: isExpanded ? 16 : 0,
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-3 overflow-hidden"
              >
                {step.items.map((item, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-3 text-gray-400"
                    animate={{
                      color: isHovered ? "#e5e7eb" : "#9ca3af",
                    }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <span className="text-cyan-400 mt-1.5">•</span>
                    <span className="leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
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
    </div>
  );
};

const processSteps = [
  {
    title: "Discovery & Specification",
    items: [
      "Deep discovery session analyzing requirements and competitive landscape",
      "Comprehensive specification document (SPEC.md) as single source of truth",
      "Requirements, acceptance criteria, data models, API contracts documented",
      "Explicit non-goals defined to eliminate scope creep"
    ],
    delay: 0.2,
  },
  {
    title: "Architecture & System Design",
    items: [
      "Complete system architecture: tech stack, database schema, API structure",
      "Security model and AI integration points designed upfront",
      "Every decision documented with rationale",
      "Architecture validated against performance and scalability requirements"
    ],
    delay: 0.4,
  },
  {
    title: "AI-Accelerated Development",
    items: [
      "Full-stack AI engineers using Claude Code agent teams",
      "Automated code generation with human judgment on critical decisions",
      "AI handles repetitive work; engineers handle creativity and context",
      "Production-ready code with tests and documentation from day one"
    ],
    delay: 0.6,
  },
  {
    title: "Testing & Security Validation",
    items: [
      "Automated unit, integration, and end-to-end testing",
      "AI-powered code review scanning for vulnerabilities",
      "Test coverage and performance benchmarks",
      "No code reaches production without passing quality gates"
    ],
    delay: 0.8,
  },
  {
    title: "Deployment & Continuous Improvement",
    items: [
      "Zero-downtime pipelines with automated rollback capability",
      "Full observability: error tracking, performance monitoring, analytics",
      "Proactive performance optimization post-launch",
      "Ongoing support with rapid feature iteration"
    ],
    delay: 1.0,
  },
];

export const Process = () => {
  return (
    <section id="process" className="flex flex-col items-center justify-center py-20 px-4 md:px-20">
      <motion.h1
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={slideInFromTop}
        className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-10 text-center"
      >
        How We Build
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
            transition: {
              delay: 0.2,
              duration: 0.5,
            },
          },
        }}
        className="text-lg text-gray-400 text-center mb-16 max-w-3xl"
      >
        Our five-phase methodology is built around one principle: no phase begins until the previous one is approved. Each phase is AI-accelerated to compress timelines, fully documented so nothing lives only in someone&apos;s head, and reviewed by both our engineers and you before we move forward.
      </motion.p>

      {/* Timeline */}
      <div className="w-full max-w-4xl">
        <div className="flex flex-col gap-8 md:gap-12">
          {processSteps.map((step, index) => (
            <ProcessStepCard
              key={step.title}
              step={step}
              index={index}
              isLast={index === processSteps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

