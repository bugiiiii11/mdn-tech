"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import {
  FiArrowRight,
  FiBarChart2,
  FiCalendar,
  FiCheckCircle,
  FiFileText,
  FiGrid,
  FiPackage,
  FiUsers,
} from "react-icons/fi";
import { SK_CRM, SK_CRM_SCREENSHOT } from "@/constants/sk";

// Flagship CRM section (rework plan v1.0, A2): CRM is the service the Royal
// Stroje partner campaign sells, so it gets its own section instead of hiding
// inside value-ladder step 04.
//
// The section used to prove itself with a screenshot of the CLIENT'S WEBSITE,
// which is the wrong artefact in a CRM pitch -- a prospect asking "what does
// the system actually look like" was shown a marketing page. It now leads with
// the system itself and spells out the modules by name, because "CRM na mieru"
// means nothing until you can point at a dashboard, a client list and an
// invoice screen. The live site stays as proof, but as a reference link rather
// than the hero image.

const MODULE_ICONS: Record<string, IconType> = {
  dashboard: FiGrid,
  clients: FiUsers,
  catalogue: FiPackage,
  invoice: FiFileText,
  calendar: FiCalendar,
  reports: FiBarChart2,
};

const GLASS_CARD_CLASS =
  "rounded-2xl border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm";

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

      {/* The system itself. Null until a sanitised export exists — see the gate
          on SK_CRM_SCREENSHOT — and the section reads fine without it. */}
      {SK_CRM_SCREENSHOT ? (
        <motion.figure
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl mb-12"
        >
          <div
            className={`relative w-full aspect-[16/9] overflow-hidden bg-[#0a0a1a] ${GLASS_CARD_CLASS}`}
          >
            <Image
              src={SK_CRM_SCREENSHOT.src}
              alt={SK_CRM_SCREENSHOT.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              loading="lazy"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#030014]/50 via-transparent to-transparent" />
          </div>
          <figcaption className="mt-3 text-center text-xs md:text-sm text-gray-500">
            {SK_CRM_SCREENSHOT.caption}
          </figcaption>
        </motion.figure>
      ) : null}

      {/* Modules — the concrete answer to "what does it actually do". */}
      <motion.h3
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl text-sm font-medium uppercase tracking-wider text-cyan-400/80 mb-6"
      >
        {SK_CRM.modulesTitle}
      </motion.h3>

      <ul className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SK_CRM.modules.map((module, index) => {
          const Icon = MODULE_ICONS[module.icon];
          return (
            <motion.li
              key={module.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: Math.min(index, 3) * 0.06 }}
              className={`p-6 ${GLASS_CARD_CLASS}`}
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-purple-500/30 bg-gradient-to-br from-purple-500/20 to-cyan-500/20">
                {Icon ? (
                  <Icon aria-hidden="true" className="h-5 w-5 text-cyan-400" />
                ) : null}
              </div>
              <h4 className="mb-2 text-base md:text-lg font-bold text-white">
                {module.title}
              </h4>
              <p className="text-sm leading-relaxed text-gray-400">
                {module.description}
              </p>
            </motion.li>
          );
        })}
      </ul>

      {/* What "na mieru" buys you, and the live receipt for it. */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mt-6">
        <motion.ul
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`flex flex-col justify-center gap-5 p-6 sm:p-8 ${GLASS_CARD_CLASS}`}
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

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.12 }}
        >
          <Link
            href={SK_CRM.reference.caseStudy.href}
            className={`group flex h-full flex-col justify-center p-6 sm:p-8 transition-all duration-300 hover:bg-[#7042f825] hover:border-cyan-400/40 ${GLASS_CARD_CLASS}`}
          >
            <p className="text-xs font-medium uppercase tracking-wider text-cyan-400/80 mb-2">
              {SK_CRM.reference.eyebrow}
            </p>
            <h3 className="text-lg md:text-xl font-bold text-white mb-2">
              {SK_CRM.reference.name}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              {SK_CRM.reference.description}
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 group-hover:text-cyan-300 transition-colors">
              {SK_CRM.reference.caseStudy.label}
              <FiArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
              />
            </span>
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
