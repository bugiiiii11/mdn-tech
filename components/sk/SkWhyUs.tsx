"use client";

import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import {
  FiClock,
  FiGift,
  FiLayers,
  FiCpu,
  FiCheckCircle,
  FiUsers,
} from "react-icons/fi";
import { SK_WHY_US } from "@/constants/sk";

const ICONS: Record<string, IconType> = {
  clock: FiClock,
  gift: FiGift,
  layers: FiLayers,
  cpu: FiCpu,
  check: FiCheckCircle,
  users: FiUsers,
};

export const SkWhyUs = () => {
  return (
    <section
      id="preco-my"
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
        Prečo my
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="text-base md:text-lg text-gray-400 max-w-3xl mx-auto mb-10 text-center"
      >
        AI-poháňaná boutique, ktorá myslí biznisovo a dodáva v rekordnom čase.
      </motion.p>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SK_WHY_US.map((item, index) => {
          const Icon = ICONS[item.icon];
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: (index % 3) * 0.1 }}
              className="group relative p-6 rounded-2xl border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm hover:bg-[#7042f825] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {Icon ? <Icon className="w-6 h-6 text-cyan-400" /> : null}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
