"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { APP_URL } from "@/lib/marketing/products";
import {
  CREDIT_PACKS,
  CREDITS_PER_MESSAGE,
  FEATURES,
  FREE_TRIAL_MESSAGES,
  BASE_CHATBOT_LIMIT,
} from "@/lib/portal/plans";
import { LISTED_COUNT, MDN_COUNT } from "@/lib/marketing/toolkit-catalogue";

// FAQ + FAQPage structured data. Both the visible accordion and the JSON-LD
// are generated from the SAME array, so the schema can never drift from the
// rendered text (Google penalises mismatches). Prices come from
// lib/portal/plans.ts, the billing source of truth; skill counts come from
// lib/marketing/toolkit-catalogue, the one definition of "a skill in the
// directory" — never hard-coded here.
//
// An entry may carry an optional `link`, rendered at the end of the answer and
// appended to the schema text by answerText() — the same pattern as
// components/toolkit/faq.tsx, so the JSON-LD still says exactly what a visitor
// reads.
//
// Native <details>/<summary>: keyboard-accessible and open-able with JS
// disabled, which also means crawlers see every answer in the HTML.

const starter = CREDIT_PACKS[0];

// Add-on pricing and authorship counts are derived, never typed by hand, so the
// FAQ (and the FAQPage schema built from it) cannot drift from what we charge
// or from who actually wrote the ToolKit catalogue.
const priceOf = (id: string) =>
  FEATURES.find((feature) => feature.id === id)?.priceLabel ?? "";

const extraChatbotPrice = priceOf("extra_chatbot");

const cheapestAddOn =
  FEATURES.filter((feature) => feature.scope !== "account").sort(
    (a, b) => a.priceCents - b.priceCents
  )[0]?.priceLabel ?? "";

type FaqLink = { href: string; label: string };
type FaqEntry = { question: string; answer: string; link?: FaqLink };

const FAQS: FaqEntry[] = [
  {
    question: "Do I need coding skills to add an AI chatbot to my website?",
    answer:
      "No. You paste your content, choose the chatbot's name, tone, and colors, then copy one line of code into your site. If you can add a Google Analytics tag, you can install ChatKit. There is nothing to host and nothing to maintain.",
  },
  {
    question: "What content can I train the chatbot on?",
    answer:
      "Anything you can paste as text: product descriptions, FAQs, shipping and returns policies, opening hours, service menus, or internal documentation. You organize it into knowledge base entries, and the chatbot answers only from what you gave it — so it represents your business rather than guessing from the open internet.",
  },
  {
    question: "How much does ChatKit cost?",
    answer: `ChatKit runs on credits instead of a monthly subscription. One credit covers one chatbot reply, and packs start at ${starter.priceLabel} for ${starter.credits.toLocaleString("en-US")} credits. Credits do not expire monthly and there is no recurring charge. Optional add-ons such as auto-learning or weekly reports are separate one-time unlocks starting at ${cheapestAddOn}. Payment is not live yet — while checkout is being set up, credits are granted from inside the app and no card is charged today; the full price list lives on the ChatKit page.`,
  },
  {
    question: "Is the free trial really free?",
    answer: `Yes. Every new chatbot starts with ${FREE_TRIAL_MESSAGES} free messages and no credit card is required. That covers building the knowledge base, styling the widget, embedding it on your site, and seeing real answers. The optional paid add-ons are not included in the trial — you only unlock those if you decide you want them.`,
  },
  {
    question: "Which website platforms does ChatKit work with?",
    answer:
      "Any platform that lets you add a snippet of HTML — WordPress, Shopify, Webflow, Wix, Squarespace, or a custom-built site. The widget is a single script tag, so it does not depend on a plugin or a particular framework.",
  },
  {
    question: "What languages does the chatbot support?",
    answer:
      "The chatbot replies in whatever language the visitor writes in, so one chatbot can serve an international audience. Your knowledge base can be written in one language while visitors ask questions in another.",
  },
  {
    question: "Can I stop the chatbot being embedded on other websites?",
    answer:
      "Yes. Each chatbot has a domain allow-list in its widget settings. Once you add your domains, the chatbot answers only on those sites and requests from anywhere else are refused before they reach the AI, so a copied embed code cannot spend your credits. The list starts empty, which allows any site — so set it when you go live.",
  },
  {
    question: "Is ToolKit actually free, or is it a trial?",
    answer: `ToolKit is genuinely free: no trial clock, no account, no upsell. It is a curated directory of ${LISTED_COUNT} Claude Code skills — ${MDN_COUNT} written by us and MIT licensed, the rest hand-picked from other authors, each linking to its own source.`,
    link: { href: "/toolkit", label: "Browse the full directory" },
  },
  {
    question: "How many chatbots can I create?",
    answer: `Every account starts with ${BASE_CHATBOT_LIMIT === 1 ? "one chatbot" : `${BASE_CHATBOT_LIMIT} chatbots`}. If you run several brands or sites, extra chatbot slots are a one-time ${extraChatbotPrice} unlock each, and every chatbot keeps its own knowledge base, styling, credits, and domain allow-list.`,
  },
  {
    question: "Who builds M.D.N Tech, and do you take custom projects?",
    answer:
      "M.D.N Tech FZE is a senior AI engineering team registered in the UAE (license 7813). Alongside the self-service products we take on a limited number of custom AI, Web3, and full-stack development projects — the about page has the team and the contact details.",
  },
];

/** Exactly the text a visitor reads, so the schema cannot drift from the page. */
const answerText = (entry: FaqEntry) =>
  entry.link ? `${entry.answer} ${entry.link.label}.` : entry.answer;

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((entry) => ({
    "@type": "Question",
    name: entry.question,
    acceptedAnswer: { "@type": "Answer", text: answerText(entry) },
  })),
};

export const Faq = () => {
  return (
    <section
      id="faq"
      className="flex flex-col items-center justify-center gap-3 scroll-mt-24 relative py-20 px-4 md:px-20 w-full max-w-full"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        }}
        className="text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-10 text-center"
      >
        Questions, Answered
      </motion.h2>

      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: 0.15 },
          },
        }}
        className="text-lg text-gray-300 text-center mb-14 max-w-3xl"
      >
        Everything people ask before they sign up. One credit covers one reply
        {CREDITS_PER_MESSAGE === 1 ? "" : ` (${CREDITS_PER_MESSAGE} credits per message)`}
        , and nothing here is a subscription.
      </motion.p>

      <div className="w-full max-w-3xl flex flex-col divide-y divide-white/[0.06] border-y border-white/[0.06]">
        {FAQS.map(({ question, answer, link }) => (
          <details key={question} className="group py-5">
            <summary className="flex items-start justify-between gap-6 cursor-pointer list-none text-white hover:text-cyan-400 transition-colors duration-200 [&::-webkit-details-marker]:hidden">
              <h3 className="text-base md:text-lg font-medium">{question}</h3>
              <span
                aria-hidden="true"
                className="flex-shrink-0 mt-1 text-cyan-400 transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </span>
            </summary>
            <p className="mt-3 pr-11 text-sm md:text-base text-gray-400 leading-relaxed">
              {answer}
              {link ? (
                <>
                  {" "}
                  <Link
                    href={link.href}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-medium"
                  >
                    {link.label}
                  </Link>
                  .
                </>
              ) : null}
            </p>
          </details>
        ))}
      </div>

      <p className="text-sm text-gray-400 mt-10 text-center">
        Still deciding?{" "}
        <a
          href={`${APP_URL}/chatkit`}
          className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-medium"
        >
          Try it free
        </a>{" "}
        — or read how we handle your data in our{" "}
        <Link
          href="/privacy"
          className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-medium"
        >
          privacy policy
        </Link>
        .
      </p>
    </section>
  );
};
