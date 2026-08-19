"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiExternalLink } from "react-icons/fi";
import { SK_PORTFOLIO } from "@/constants/sk";

type PortfolioItem = (typeof SK_PORTFOLIO)[number];

const CARD_CLASS =
  "group relative flex h-full flex-col rounded-2xl overflow-hidden border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm hover:bg-[#7042f825] hover:border-cyan-400/40 transition-all duration-300";

const PortfolioCard = ({ item, index }: { item: PortfolioItem; index: number }) => {
  const [imgError, setImgError] = useState(false);
  // Only the flagship reference carries a case study; its card links there
  // (internal), everything else keeps linking to the live site (external).
  const caseStudyHref =
    "caseStudyHref" in item ? item.caseStudyHref : undefined;
  // Founder pull-quote — flagship card only (full testimonial lives in the
  // case study).
  const quote = "quote" in item ? item.quote : undefined;

  const inner = (
    <>
      {/* Preview */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#0a0a1a]">
        {imgError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-600/30 to-cyan-600/20">
            <span className="text-2xl font-bold text-white/90">{item.name}</span>
          </div>
        ) : (
          <Image
            src={item.image}
            alt={`Náhľad webu ${item.name} (${item.domain})`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            loading="lazy"
            onError={() => setImgError(true)}
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030014]/80 via-transparent to-transparent" />
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center justify-between gap-3 mb-2">
          <h3 className="text-lg md:text-xl font-bold text-white">
            {item.name}
          </h3>
          {caseStudyHref ? (
            <FiArrowRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
          ) : (
            <FiExternalLink className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
          )}
        </div>
        <p className="text-sm text-cyan-300/80 mb-3">{item.domain}</p>
        <p className="text-sm text-gray-400 leading-relaxed mb-4 flex-1">
          {item.description}
        </p>
        {quote ? (
          <figure className="mb-4 border-l-2 border-cyan-400/40 pl-3">
            <blockquote className="text-sm italic leading-relaxed text-gray-300">
              &bdquo;{quote.text}&ldquo;
            </blockquote>
            <figcaption className="mt-1 text-xs text-gray-400">
              {quote.author}
            </figcaption>
          </figure>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-full text-xs text-gray-300 bg-white/5 border border-white/10"
            >
              {tag}
            </span>
          ))}
        </div>
        {caseStudyHref ? (
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cyan-400 group-hover:text-cyan-300 transition-colors">
            Prípadová štúdia
            <FiArrowRight aria-hidden="true" className="h-4 w-4" />
          </span>
        ) : null}
      </div>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className="h-full"
    >
      {caseStudyHref ? (
        <Link href={caseStudyHref} className={CARD_CLASS}>
          {inner}
        </Link>
      ) : (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={CARD_CLASS}
        >
          {inner}
        </a>
      )}
    </motion.div>
  );
};

export const SkPortfolio = () => {
  return (
    <section
      id="realizacie"
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
        Realizácie
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="text-base md:text-lg text-gray-400 max-w-3xl mx-auto mb-10 text-center"
      >
        Pozrite si živé weby, ktoré sme vytvorili pre našich slovenských partnerov.
      </motion.p>

      {/* Two-up above md: with four sites a 3-col grid leaves an orphan, and a
          4-col row shrinks the previews past legibility. */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {SK_PORTFOLIO.map((item, index) => (
          <PortfolioCard key={item.domain} item={item} index={index} />
        ))}
      </div>
    </section>
  );
};
