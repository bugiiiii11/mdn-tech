"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { GlassCard, Section, fadeUp } from "@/components/product-pages/primitives";
import { APP_URL } from "@/lib/marketing/products";

// "Your knowledge base: the chatbot's only source of truth".
//
// The mechanism paragraph is the most important copy on the page and the most
// likely to be quoted by an AI search engine, so it is deliberately literal:
// nothing is trained, embedded, indexed or retrieved. The knowledge base is
// pasted into a system prompt string on every request (lib/chat/prompt.ts:14-56).
// The words "fine-tuned", "RAG", "vector", "embeddings" and "semantic search"
// are banned here because none of them describe what the code does.
//
// The nine categories are a local const in two places and exported from
// neither — lib/chat/prompt.ts:1 (CATEGORY_ORDER, which also drives grouping at
// :14-29) and components/portal/chatbots/PortalKBEntryForm.tsx:7. Listed by
// hand below; if a tenth category ships, this list must be updated with it.
const CATEGORIES: { name: string; purpose: string }[] = [
  { name: "general", purpose: "hours, location, the basics" },
  { name: "about", purpose: "who you are and what you do" },
  { name: "products", purpose: "what you sell, specs, stock rules" },
  { name: "faq", purpose: "the questions you already answer daily" },
  { name: "policies", purpose: "shipping, returns, refunds, cancellation" },
  { name: "tone", purpose: "how the chatbot should sound" },
  { name: "pricing", purpose: "rates, packages, what is included" },
  { name: "support", purpose: "how to get help or book you" },
  { name: "other", purpose: "anything that does not fit above" },
];

export const KnowledgeBase = () => (
  <Section
    id="knowledge-base"
    title="Your knowledge base: the chatbot's only source of truth"
    intro="Most chatbot pages say 'trained on your data' and stop there. Here is the actual mechanism, which is both more honest and a better reason to trust it."
    wide
  >
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp(0)}
      className="w-full max-w-3xl"
    >
      <GlassCard className="p-8">
        <p className="text-base md:text-lg text-gray-300 leading-relaxed">
          This is what people mean by an AI chatbot trained on your own content.
          With ChatKit nothing is trained, indexed or embedded. Your entries are
          handed to the model with every single question, and the instructions it
          runs under say: answer only from this, and if the answer is not here,
          say the fallback line the owner wrote. That is why it cannot quietly
          invent a shipping policy you never published.
        </p>
      </GlassCard>
    </motion.div>

    {/* Nine categories, and what each is for */}
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp(0.1)}
      className="mt-16 w-full max-w-3xl"
    >
      <h3 className="text-lg font-semibold text-white mb-5">
        Nine categories, and what each one is for
      </h3>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3">
        {CATEGORIES.map((category) => (
          <div key={category.name} className="flex items-baseline gap-3">
            <dt className="font-mono text-sm text-white flex-shrink-0">
              {category.name}
            </dt>
            <dd className="text-sm text-gray-400 leading-relaxed">
              {category.purpose}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 text-sm md:text-base text-gray-300 leading-relaxed">
        The categories are not cosmetic. Entries are grouped and ordered by
        category before they reach the model, so everything you filed under
        policies arrives together, in a predictable place, on every question.
      </p>
    </motion.div>

    {/* The /build-kb workflow — a real, verifiable onboarding asset. */}
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp(0.1)}
      className="mt-14 w-full max-w-3xl"
    >
      <h3 className="text-lg font-semibold text-white mb-3">
        The fastest way to fill it: let Claude Code write it for you
      </h3>
      <p className="text-sm md:text-base text-gray-300 leading-relaxed">
        M.D.N Tech publishes a copy-paste prompt that points Claude Code at your
        whole project — code, docs, README, marketing copy, anything
        user-facing — and has it write a single knowledge-base.md organised into
        ChatKit&apos;s own category headings, skipping any category it does not
        have enough source material for rather than inventing one. You paste
        each section into the matching entry. It is also packaged as{" "}
        <a
          href={`${APP_URL}/toolkit`}
          className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-medium"
        >
          the free /build-kb skill
        </a>{" "}
        in{" "}
        <Link
          href="/#toolkit"
          className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-medium"
        >
          our free directory of Claude Code skills
        </Link>
        . New to Claude Code?{" "}
        <Link
          href="/blog/claude-code-complete-guide"
          className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-medium"
        >
          Our complete guide to Claude Code
        </Link>{" "}
        starts at installation.
      </p>
    </motion.div>

    {/* Honesty block: no crawler, no uploads — framed as the positive it is. */}
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp(0.1)}
      className="mt-14 w-full max-w-3xl"
    >
      <h3 className="text-lg font-semibold text-white mb-3">
        How content gets in
      </h3>
      <p className="text-sm md:text-base text-gray-300 leading-relaxed">
        Everything is added by you, through the entry form. There is no crawler
        pointed at your site, no PDF upload and no help-centre sync. The upside
        is worth the typing: nothing gets published to your visitors that you
        did not write and sort yourself, so the chatbot cannot surface a page you
        forgot was still online.
      </p>
    </motion.div>

    {/* Sort-order guidance. The hard cap is stated once, in #limits. */}
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp(0.1)}
      className="mt-14 w-full max-w-3xl"
    >
      <h3 className="text-lg font-semibold text-white mb-3">
        Sort order is a priority list, not a filing preference
      </h3>
      <p className="text-sm md:text-base text-gray-300 leading-relaxed">
        Entries are sent in sort order, so put your highest-value answers first
        and keep each one tight and single-topic — one entry per subject beats
        one long entry covering five. There is a hard cap on how much reaches the
        model, and it is stated plainly in{" "}
        <a
          href="#limits"
          className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-medium"
        >
          the limits section
        </a>
        .
      </p>
    </motion.div>
  </Section>
);
