"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { SK_CRM } from "@/constants/sk";

// Flagship CRM section (rework plan v1.0, A2): CRM is the service the Royal
// Stroje partner campaign sells, so it gets its own section instead of hiding
// inside value-ladder step 04. Left: what a made-to-measure CRM means in the
// audience's vocabulary. Right: the proof — royalstroje.sk, linking to the
// case study (cyan = evidence, per the Bent Light rule).
export const SkCrm = () => {
  return (
    <section
      id="crm"
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
        {SK_CRM.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="text-base md:text-lg text-gray-400 max-w-3xl mx-auto mb-10 text-center"
      >
        {SK_CRM.intro}
      </motion.p>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* What "na mieru" actually covers */}
        <motion.ul
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-center gap-5 p-6 sm:p-8 rounded-2xl border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm"
        >
          {SK_CRM.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3">
              <FiCheckCircle
                aria-hidden="true"
                className="mt-1 h-5 w-5 flex-shrink-0 text-cyan-400"
              />
              <span className="text-sm md:text-base text-gray-300 leading-relaxed">
                {benefit}
              </span>
            </li>
          ))}
        </motion.ul>

        {/* The proof: royalstroje.sk → case study */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.12 }}
        >
          <Link
            href={SK_CRM.reference.caseStudy.href}
            className="group flex h-full flex-col rounded-2xl overflow-hidden border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm hover:bg-[#7042f825] hover:border-cyan-400/40 transition-all duration-300"
          >
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#0a0a1a]">
              <Image
                src={SK_CRM.reference.image}
                alt={`Náhľad webu ${SK_CRM.reference.name}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030014]/80 via-transparent to-transparent" />
            </div>

            <div className="flex flex-1 flex-col p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-cyan-400/80 mb-2">
                {SK_CRM.reference.eyebrow}
              </p>
              <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                {SK_CRM.reference.name}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-4 flex-1">
                {SK_CRM.reference.description}
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 group-hover:text-cyan-300 transition-colors">
                {SK_CRM.reference.caseStudy.label}
                <FiArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                />
              </span>
            </div>
          </Link>
        </motion.div>
      </div>

      <motion.a
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        href={SK_CRM.cta.href}
        className="button-primary mt-10 py-3 px-8 text-center text-white cursor-pointer rounded-lg font-semibold"
      >
        {SK_CRM.cta.label}
      </motion.a>
    </section>
  );
};
