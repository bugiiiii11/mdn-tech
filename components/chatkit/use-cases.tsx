"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import {
  PROSE_LINK_CLASS,
  Section,
  FADE_UP,
  fadeUp,
} from "@/components/product-pages/primitives";
import { chatbotAllowanceLabel, featureById } from "@/lib/portal/plans";

// "AI customer support for small businesses" — recognition, not testimonials.
//
// HARD RULE for this section: no testimonials, no logos, no customer counts,
// no "trusted by" strip, no invented names or quotes. Nothing in the codebase
// supports a single social-proof claim, so the substance comes from the real
// data model instead: each scenario is described as the actual knowledge-base
// CATEGORIES that business would fill in (the nine in lib/chat/prompt.ts:1 and
// components/portal/chatbots/PortalKBEntryForm.tsx:7).
//
// The extra-chatbot price and the base slot count are read from
// lib/portal/plans.ts, never typed.

const EXTRA_CHATBOT_PRICE = featureById("extra_chatbot")?.priceLabel ?? "";

const scenarios = [
  {
    title: "An e-commerce store",
    categories: ["policies", "products", "faq"],
    entries:
      "Shipping, returns and refunds under policies. Sizing, materials and stock rules under products. Order tracking under faq.",
    outcome:
      "The three questions that fill your inbox get answered at 11pm, in the buyer's language, on the product page where the doubt appeared rather than two emails later.",
  },
  {
    title: "A service business — clinic, studio, trades, restaurant",
    categories: ["general", "pricing", "support"],
    entries:
      "Hours, location and parking under general. The service menu under pricing. How to book and the cancellation window under support.",
    outcome:
      "Fewer 'are you open on Sunday?' calls, and the fallback rate quietly tells you which detail you never got round to publishing.",
  },
  {
    title: "A SaaS or app with docs",
    categories: ["products", "faq", "support"],
    entries:
      "What the product does under products. Setup, integrations and limits under faq. Where to get help under support.",
    outcome:
      "The repetitive pre-sales questions get deflected without adding a help-desk seat, and the keyword list shows which part of the docs people cannot find.",
  },
  {
    title: "An agency or freelancer running client sites",
    categories: ["about", "pricing", "faq"],
    entries:
      "One chatbot per client site, each with its own knowledge base, colour and domain list.",
    outcome: `A support layer you can hand over at the end of a project. Each additional chatbot is a one-time ${EXTRA_CHATBOT_PRICE} slot unlock, and every chatbot keeps its own separate credits, content and settings — nothing is shared between them.`,
  },
];

export const UseCases = () => (
  <Section
    id="use-cases"
    title="AI customer support for small businesses, without a support team"
    intro={`Every account starts with ${chatbotAllowanceLabel()}. Here is what filling it in looks like for four kinds of business, described in the categories you would actually use.`}
    wide
  >
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
      }}
      className="grid w-full max-w-5xl grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-11"
    >
      {scenarios.map((scenario) => (
        <motion.div key={scenario.title} variants={FADE_UP}>
          <h3 className="text-lg font-semibold text-white mb-3">
            {scenario.title}
          </h3>
          {/* Category names are labels, not proof — kept off the cyan palette. */}
          <ul className="flex flex-wrap gap-2 mb-3 list-none">
            {scenario.categories.map((category) => (
              <li
                key={category}
                className="rounded-full border border-white/[0.12] px-2.5 py-0.5 font-mono text-xs text-gray-400"
              >
                {category}
              </li>
            ))}
          </ul>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
            {scenario.entries}
          </p>
          <p className="mt-2 text-sm md:text-base text-gray-300 leading-relaxed">
            {scenario.outcome}
          </p>
        </motion.div>
      ))}
    </motion.div>

    <motion.p
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp(0.1)}
      className="mt-14 max-w-3xl text-center text-sm md:text-base text-gray-400 leading-relaxed"
    >
      We run ChatKit on our own client sites — the same widget, the same nine
      categories, the same credit counter. You can read about{" "}
      <Link href="/about" className={PROSE_LINK_CLASS}>
        the engineers who build and run it
      </Link>{" "}
      if that matters to you.
    </motion.p>
  </Section>
);
