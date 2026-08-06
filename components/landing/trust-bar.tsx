"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { TEAM_MEMBERS } from "@/constants";

// Trust bar — 3 team avatars + credibility line, links to /about (the full
// agency story lives there after the migration).
export const TrustBar = () => {
  return (
    <section className="relative py-14 px-4 md:px-20 w-full max-w-full flex justify-center">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" },
          },
        }}
        className="w-full max-w-4xl flex flex-col items-center gap-5 text-center"
      >
        <Link href="/about" className="group flex flex-col items-center gap-5">
          {/* Overlapping avatars */}
          <div className="flex -space-x-3">
            {TEAM_MEMBERS.map((member) => (
              <Image
                key={member.name}
                src={member.image}
                alt={member.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full border-2 border-[#7042f88b] object-cover"
              />
            ))}
          </div>

          <p className="text-base md:text-lg text-gray-300 font-medium group-hover:text-cyan-400 transition-colors duration-300">
            Built by 3 senior engineers · 30+ years combined experience · Based
            in UAE
          </p>
        </Link>

        <p className="text-sm text-gray-500">
          Full-stack AI · Blockchain · Enterprise systems
        </p>

        <p className="text-sm text-gray-400">
          Need custom development? We take on select projects —{" "}
          <Link
            href="/about"
            className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-medium"
          >
            meet the team →
          </Link>
        </p>
      </motion.div>
    </section>
  );
};
