"use client";

import { motion } from "framer-motion";

import { ProductCard } from "@/components/landing/product-card";
import { getLandingMode, visibleProducts } from "@/lib/marketing/products";

// "What We Build" — 5 product cards from lib/marketing/products.ts.
// Subtitle adapts to landing mode (MVP vs FULL).
export const Products = () => {
  const mode = getLandingMode();
  const products = visibleProducts(mode);

  const subtitle =
    mode === "full"
      ? "Five tools. One account. One credit balance."
      : "Two tools live today. Three more on the way. One account.";

  return (
    <section
      id="products"
      className="flex flex-col items-center justify-center gap-3 h-full relative overflow-hidden py-20 px-4 md:px-20 w-full max-w-full"
    >
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: -20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
          },
        }}
        className="text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-10 text-center"
      >
        What We Build
      </motion.h2>

      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: -20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: 0.2 },
          },
        }}
        className="text-lg text-gray-400 text-center mb-12 max-w-3xl"
      >
        {subtitle}
      </motion.p>

      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              status={product.status[mode]}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
