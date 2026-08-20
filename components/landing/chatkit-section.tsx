"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { APP_LIVE, APP_URL } from "@/lib/marketing/products";
import { FEATURES, FREE_TRIAL_MESSAGES } from "@/lib/portal/plans";

// ChatKit deep-dive — the conversion workhorse of the landing page. Everything
// a visitor needs to decide before clicking the CTA.
//
// HONESTY CONSTRAINT (do not regress): a new chatbot ships with feature_unlocks
// = '{}' (migration 017), so auto-learning, weekly reports, the conversation
// viewer and analytics are NOT part of the trial — they are one-time paid
// unlocks. The two groups below must stay separated, and add-on prices are read
// from plans.ts so they can never drift from what the portal charges.

const steps = [
  {
    title: "Feed it your content",
    text: "Paste your docs, FAQs, or product info and build the knowledge base entry by entry — no training runs, no code.",
  },
  {
    title: "Make it yours",
    text: "Name it, pick the tone, match your brand colors, write the welcome message.",
  },
  {
    title: "Embed one line",
    text: "Copy a single script tag into your site. Works on WordPress, Shopify, Webflow, or custom builds.",
  },
];

// Ships with every chatbot, including during the trial.
const included = [
  {
    title: "Answers from your content",
    text: "Grounded in your knowledge base — it represents your business, not the whole internet.",
  },
  {
    title: "Replies in your visitor's language",
    text: "One chatbot serves an international audience; it answers in whatever language the question was asked in.",
  },
  {
    title: "Your branding, your welcome message",
    text: "Name, tone, colors, and greeting are all yours — the widget looks like part of your site.",
  },
  {
    title: "Domain allow-list",
    text: "Name the sites your chatbot may answer on, and requests from anywhere else are refused before they cost you a credit.",
  },
];

// Paid one-time unlocks, priced in credits. From the billing source of truth.
const priceOf = (id: string) =>
  FEATURES.find((feature) => feature.id === id)?.creditLabel ?? "";

const addOns = [
  {
    title: "Auto-learning",
    price: priceOf("learning"),
    text: "Reviews the replies you rated poorly and drafts knowledge-base improvements for you to approve.",
  },
  {
    title: "Weekly email reports",
    price: priceOf("reports"),
    text: "Conversations, ratings, and top questions, run on demand — the designed cadence is a Monday morning email.",
  },
  {
    title: "Conversation viewer",
    price: priceOf("conversations"),
    text: "Read full transcripts, rate individual replies, and export them.",
  },
  {
    title: "Trends & analytics",
    price: priceOf("analytics"),
    text: "Question trends and keyword breakdowns across your traffic.",
  },
];

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.5, ease: "easeOut" },
  },
});

export const ChatKitSection = () => {
  return (
    <section
      id="chatkit"
      className="flex flex-col items-center justify-center gap-3 scroll-mt-24 relative py-20 px-4 md:px-20 w-full max-w-full"
    >
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp(0)}
        className="text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-10 text-center"
      >
        ChatKit: Your AI Chatbot, Grounded in Your Content
      </motion.h2>

      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp(0.15)}
        className="text-lg text-gray-300 text-center mb-14 max-w-3xl"
      >
        Turn your website, docs, or FAQs into a branded AI assistant that
        answers customers around the clock — on your site, in your voice.
      </motion.p>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* How it works — a real 3-step sequence */}
        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          className="flex flex-col gap-8 list-none"
        >
          {steps.map((step, i) => (
            <motion.li key={step.title} variants={fadeUp(0)} className="flex gap-5">
              <span
                aria-hidden="true"
                className="flex-shrink-0 w-10 h-10 rounded-full border border-[#7042f88b] bg-[#7042f815] text-cyan-400 font-semibold flex items-center justify-center"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1.5">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                  {step.text}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ol>

        {/* Chat widget mock — pure CSS, no assets */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp(0.2)}
          aria-hidden="true"
          className="relative rounded-xl border border-[#7042f88b] bg-[#0a0a23]/80 backdrop-blur-sm overflow-hidden max-w-md w-full mx-auto"
        >
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06] bg-[#7042f815]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60 animate-ping motion-reduce:animate-none"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
            </span>
            <span className="text-sm font-semibold text-white">
              Your AI Assistant
            </span>
            <span className="ml-auto text-xs text-gray-400">online</span>
          </div>
          <div className="flex flex-col gap-3 p-5">
            <div className="self-start max-w-[85%] rounded-2xl rounded-bl-md bg-[#7042f826] border border-[#7042f83d] px-4 py-2.5 text-sm text-gray-200">
              Hi! I know everything about this business. How can I help?
            </div>
            <div className="self-end max-w-[85%] rounded-2xl rounded-br-md bg-cyan-500/15 border border-cyan-500/25 px-4 py-2.5 text-sm text-gray-200">
              Do you ship internationally?
            </div>
            <div className="self-start max-w-[85%] rounded-2xl rounded-bl-md bg-[#7042f826] border border-[#7042f83d] px-4 py-2.5 text-sm text-gray-200">
              Yes — we ship to all EU countries within 3–5 business days.
              Orders over €100 ship free. Anything else?
            </div>
          </div>
          <div className="px-5 pb-5">
            <div className="rounded-lg border border-[#7042f855] bg-[#030014]/60 px-4 py-2.5 text-sm text-gray-500">
              Type your question…
            </div>
          </div>
        </motion.div>
      </div>

      {/* What every chatbot includes */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp(0.1)}
        className="w-full max-w-6xl mt-16 pt-10 border-t border-white/[0.06]"
      >
        <h3 className="text-lg font-semibold text-white mb-6 text-center">
          Included with every chatbot
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
          {included.map((feature) => (
            <div key={feature.title}>
              <h4 className="text-base font-semibold text-white mb-1.5 flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 5.29a1 1 0 010 1.415l-7.5 7.5a1 1 0 01-1.415 0l-3.5-3.5a1 1 0 111.415-1.414l2.792 2.792 6.793-6.793a1 1 0 011.415 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {feature.title}
              </h4>
              <p className="text-sm text-gray-400 leading-relaxed pl-7">
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Paid add-ons, priced honestly and kept visually distinct */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp(0.1)}
        className="w-full max-w-6xl mt-14 pt-10 border-t border-white/[0.06]"
      >
        <h3 className="text-lg font-semibold text-white mb-2 text-center">
          Optional add-ons
        </h3>
        <p className="text-sm text-gray-400 text-center mb-6">
          One-time unlocks, not subscriptions. Add them if and when you need
          them.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
          {addOns.map((addOn) => (
            <div key={addOn.title}>
              <h4 className="text-base font-semibold text-white mb-1.5">
                {addOn.title}
                {addOn.price && (
                  <span className="ml-2 text-xs font-medium text-gray-400 border border-white/[0.12] rounded-full px-2 py-0.5 whitespace-nowrap">
                    {addOn.price} once
                  </span>
                )}
              </h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                {addOn.text}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Trial framing + CTA */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp(0.15)}
        className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-5 mt-12"
      >
        {/* Inert while the portal is closed (APP_LIVE); the trial terms below
            still describe what lands when it opens. */}
        {APP_LIVE ? (
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={`${APP_URL}/chatkit`}
            className="py-3 px-8 button-primary text-center text-white cursor-pointer rounded-lg font-semibold"
          >
            Start Free →
          </motion.a>
        ) : (
          <span
            aria-disabled="true"
            className="py-3 px-8 text-center rounded-lg font-semibold border border-white/[0.12] bg-white/[0.04] text-gray-400 cursor-not-allowed"
          >
            Coming soon
          </span>
        )}
        <p className="text-sm text-gray-400">
          {FREE_TRIAL_MESSAGES} free messages · no credit card · nothing to
          cancel
        </p>
        {/* Internal link into the indexable deep-dive — the app CTA above goes
            to a noindex host, so this is where homepage authority flows. */}
        <Link
          href="/chatkit"
          className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-medium text-sm"
        >
          Read the full ChatKit breakdown →
        </Link>
      </motion.div>
    </section>
  );
};
