"use client";

import { motion } from "framer-motion";

import { APP_URL } from "@/lib/marketing/products";

// Credits value-prop strip — deliberately NOT a pricing table. No prices, no
// packages, no gateway mention; concrete packages + checkout arrive in Phase F.
export const CreditsStrip = () => {
  return (
    <section className="relative py-10 px-4 md:px-20 w-full max-w-full flex justify-center">
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
        className="w-full max-w-4xl relative rounded-xl border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 p-8">
          <div className="text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
              One account. One credit balance. All products.
            </h3>
            <p className="text-sm md:text-base text-gray-400 leading-relaxed">
              Buy credits once, spend them across every M.D.N Tech tool. No
              per-product subscriptions to juggle.
            </p>
          </div>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={APP_URL}
            className="py-3 px-8 button-primary text-center text-white cursor-pointer rounded-lg font-semibold whitespace-nowrap flex-shrink-0"
          >
            Open the App →
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
};
