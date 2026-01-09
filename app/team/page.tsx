"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import { slideInFromTop } from "@/lib/motion";
import { TEAM_MEMBERS } from "@/constants";
import { RxLinkedinLogo, RxGithubLogo, RxTwitterLogo } from "react-icons/rx";
import Image from "next/image";

interface TeamMemberCardProps {
  member: {
    name: string;
    role: string;
    image: string;
    bio: string;
    socials: {
      linkedin?: string;
      github?: string;
      twitter?: string;
    };
  };
  index: number;
}

const TeamMemberCard = ({ member, index }: TeamMemberCardProps) => {
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
        <div className="relative h-full p-8 rounded-xl border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm overflow-hidden transform-gpu min-h-[450px]">
          {/* Glow effect that follows mouse */}
          <motion.div
            className="absolute w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-300"
            style={{
              x: useTransform(mouseXSpring, [-0.5, 0.5], ["-50%", "50%"]),
              y: useTransform(mouseYSpring, [-0.5, 0.5], ["-50%", "50%"]),
            }}
          />

          {/* Content */}
          <div className="relative z-10 transform-gpu flex flex-col items-center text-center h-full">
            {/* Avatar */}
            <motion.div
              className="relative w-40 h-40 mb-6 rounded-full overflow-hidden border-2 border-purple-500/30"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20"></div>
              <Image
                src={member.image}
                alt={member.name}
                width={160}
                height={160}
                className="w-full h-full object-cover relative z-10"
              />
              {/* Shine effect on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent z-20"
                initial={{ x: "-100%" }}
                animate={{
                  x: isHovered ? "100%" : "-100%",
                }}
                transition={{
                  duration: 1,
                  repeat: isHovered ? Infinity : 0,
                  repeatDelay: 1.5,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            {/* Name and Role */}
            <h3 className="text-2xl font-semibold text-white mb-2">
              {member.name}
            </h3>
            <p className="text-base text-purple-400 mb-4 font-medium capitalize">
              {member.role}
            </p>

            {/* Bio */}
            <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
              {member.bio}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-auto">
              {member.socials.linkedin && (
                <motion.a
                  href={member.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-all"
                  aria-label={`${member.name}'s LinkedIn`}
                >
                  <RxLinkedinLogo className="w-5 h-5" />
                </motion.a>
              )}
              {member.socials.github && (
                <motion.a
                  href={member.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-all"
                  aria-label={`${member.name}'s GitHub`}
                >
                  <RxGithubLogo className="w-5 h-5" />
                </motion.a>
              )}
              {member.socials.twitter && (
                <motion.a
                  href={member.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-all"
                  aria-label={`${member.name}'s Twitter`}
                >
                  <RxTwitterLogo className="w-5 h-5" />
                </motion.a>
              )}
            </div>
          </div>

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

export default function TeamPage() {
  return (
    <main className="min-h-screen w-full pt-20">
      <section className="relative flex flex-col items-center justify-center py-20 px-4 md:px-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
          <Image
            src="/world-map.svg"
            alt="World Map"
            width={1200}
            height={800}
            className="w-full h-full object-cover md:object-contain"
            priority={false}
          />
        </div>

        {/* Header Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideInFromTop}
          className="relative z-10 text-center mb-16 max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 mb-6">
            Meet Our Team
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            We&apos;re a passionate group of innovators, creators, and problem-solvers dedicated to delivering exceptional digital experiences. Get to know the talented individuals who make our vision a reality.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="relative z-10 w-full max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {TEAM_MEMBERS.map((member, index) => (
              <TeamMemberCard key={member.name} member={member} index={index} />
            ))}
          </div>
        </div>

        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative z-10 mt-20 text-center max-w-3xl mx-auto"
        >
          <div className="p-8 rounded-xl border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm">
            <h2 className="text-3xl font-semibold text-white mb-4">
              Want to Join Our Team?
            </h2>
            <p className="text-gray-400 mb-6 text-lg">
              We&apos;re always looking for talented individuals who share our passion for innovation and excellence.
            </p>
            <motion.a
              href="#contact-us"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:from-purple-600 hover:to-cyan-600 transition-all duration-300"
            >
              Get in Touch
            </motion.a>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
