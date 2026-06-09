"use client";

import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import { FiTrendingUp } from "react-icons/fi";
import { FaRocket } from "react-icons/fa";
import { SK_FOR_WHOM } from "@/constants/sk";

const ICONS: Record<string, IconType> = {
  rocket: FaRocket,
  trending: FiTrendingUp,
};

export const SkForWhom = () => {
  return (
    <section
      id="pre-koho"
      className="flex flex-col items-center justify-center py-20 px-4 md:px-20 w-full max-w-full overflow-hidden"
    >
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: -20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        }}
        className="text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-6 text-center"
      >
        Pre koho to je
      </motion.h2>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {SK_FOR_WHOM.map((item, index) => {
          const Icon = ICONS[item.icon];
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="group relative p-8 rounded-2xl border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm hover:bg-[#7042f825] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                {Icon ? <Icon className="w-6 h-6 text-cyan-400" /> : null}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                {item.title}
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
