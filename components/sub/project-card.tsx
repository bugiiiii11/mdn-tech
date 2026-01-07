"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";

type ProjectCardProps = {
  src: string;
  title: string;
  description: string;
  link: string;
  category?: string;
  technologies?: string[];
};

export const ProjectCard = ({
  src,
  title,
  description,
  link,
  category,
  technologies = [],
}: ProjectCardProps) => {
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
      className="group relative perspective-1000 h-full"
    >
      <div className="relative h-full transform-gpu">
        <Link
          href={link}
          target="_blank"
          rel="noreferrer noopener"
          className="relative block h-full overflow-hidden rounded-xl border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm transform-gpu"
        >
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

          {/* Image Container */}
          <div className="relative h-64 overflow-hidden">
            <Image
              src={src}
              alt={title}
              width={600}
              height={400}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isHovered ? "scale-110" : "scale-100"
              }`}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Category Badge */}
            {category && (
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/30">
                <span className="text-xs font-medium ">{category}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="relative z-10 transform-gpu p-6">
            <h3 className="text-xl font-semibold text-white mb-3 transition-colors duration-300">
              {title}
            </h3>
            <motion.p
              className="text-sm text-gray-400 leading-relaxed line-clamp-3 mb-4"
              animate={{
                color: isHovered ? "#e5e7eb" : "#9ca3af",
              }}
              transition={{ duration: 0.3 }}
            >
              {description}
            </motion.p>

            {/* Technologies */}
            {technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {technologies.slice(0, 3).map((tech, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs rounded bg-purple-500/10 text-purple-300 border border-purple-500/20"
                  >
                    {tech}
                  </span>
                ))}
                {technologies.length > 3 && (
                  <span className="px-2 py-1 text-xs rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    +{technologies.length - 3}
                  </span>
                )}
              </div>
            )}
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
        </Link>
      </div>
    </motion.div>
  );
};
