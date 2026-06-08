"use client";

import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import { FiSearch, FiGlobe, FiTrendingUp, FiZap } from "react-icons/fi";
import { SK_VALUE_LADDER, SK_PRICING } from "@/constants/sk";

const ICONS: Record<string, IconType> = {
  search: FiSearch,
  globe: FiGlobe,
  seo: FiTrendingUp,
  automation: FiZap,
};

export const SkValueLadder = () => {
  return (
    <section
      id="sluzby"
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
        Čo robíme
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="text-base md:text-lg text-gray-400 max-w-3xl mx-auto mb-10 text-center"
      >
        Jeden rebrík od základov až po systémy na mieru. Začni tam, kde si — a
        rastieme spolu o stupeň vyššie.
      </motion.p>

      <div className="w-full max-w-4xl flex flex-col gap-4">
        {SK_VALUE_LADDER.map((item, index) => {
          const Icon = ICONS[item.icon];
          return (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative flex flex-col sm:flex-row sm:items-center gap-5 p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
                item.highlight
                  ? "border-cyan-400/40 bg-cyan-400/[0.06] hover:bg-cyan-400/[0.1]"
                  : "border-[#7042f88b] bg-[#7042f815] hover:bg-[#7042f825]"
              }`}
            >
              {/* Step + icon */}
              <div className="flex items-center gap-4 sm:flex-col sm:items-center sm:gap-2 sm:w-16 flex-shrink-0">
                <span className="text-sm font-mono text-gray-500">
                  {item.step}
                </span>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {Icon ? <Icon className="w-6 h-6 text-cyan-400" /> : null}
                </div>
              </div>

              {/* Text */}
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-bold text-white mb-1.5">
                  {item.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                  {item.description}
                </p>
              </div>

              {/* Price chip */}
              <div className="flex-shrink-0 sm:text-right">
                <span
                  className={`inline-block whitespace-nowrap px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold ${
                    item.highlight
                      ? "bg-cyan-400/15 text-cyan-300 border border-cyan-400/30"
                      : "bg-white/5 text-gray-300 border border-white/10"
                  }`}
                >
                  {item.price}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pricing note */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-4xl mt-8 p-5 rounded-xl border border-white/10 bg-white/[0.03] text-center"
      >
        <p className="text-sm md:text-base text-gray-300">
          Cena na mieru po dohode — sumy vyššie sú len orientačné minimá.
        </p>
        <p className="text-xs md:text-sm text-gray-500 mt-1">
          {SK_PRICING.note}
        </p>
      </motion.div>
    </section>
  );
};
