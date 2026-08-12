"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { fadeUp } from "@/components/product-pages/primitives";
import { APP_URL } from "@/lib/marketing/products";
import { CREDITS_PER_MESSAGE, FREE_TRIAL_MESSAGES } from "@/lib/portal/plans";

// ChatKit FAQ + FAQPage structured data.
//
// ANTI-DRIFT PATTERN (copied deliberately from components/landing/faq.tsx):
// the visible accordion and the JSON-LD are generated from the SAME FAQS
// array, so the schema can never describe an answer the page does not show.
// Native <details>/<summary> keeps every answer in the HTML with JS disabled
// and keyboard-operable.
//
// These 12 questions are disjoint from the homepage FAQ's 10 by topic, not
// just by wording: the homepage answers WHAT ChatKit is, this page answers HOW
// IT BEHAVES. No question string is shared, so the two FAQPage graphs do not
// compete.
//
// Every count and price inside an answer is interpolated from
// lib/portal/plans.ts. Answers are self-contained prose with no "see above",
// because assistants read them out of context — which is also why the privacy
// policy is named by URL inside answer 10 rather than linked.

const CREDIT_PER_REPLY =
  CREDITS_PER_MESSAGE === 1
    ? "one credit per reply"
    : `${CREDITS_PER_MESSAGE} credits per reply`;

const FAQS: { question: string; answer: string }[] = [
  {
    question: "Where does the chat bubble appear on my site, and can I move it?",
    answer:
      "The launcher is a 56-pixel circle fixed to the bottom-right corner of every page the script runs on, and it opens a 380-pixel panel above itself. The position is not configurable in ChatKit today. On screens narrower than 480 pixels the bubble shrinks to 50 pixels and the panel goes near-full-width so it does not cover your page.",
  },
  {
    question: "Do visitors' questions cost credits, or only the replies?",
    answer: `Only the replies. A visitor can type as much as they like at no cost; the counter moves once, after the chatbot has finished answering, at ${CREDIT_PER_REPLY}. That is why the Messages tile on your dashboard and your credit balance always agree with each other.`,
  },
  {
    question: "What happens when my free messages or credits run out?",
    answer:
      "The widget stops rendering on your site, so visitors see nothing rather than a broken bubble or an error. Nothing is deleted: your knowledge base, widget styling, unlocked features, conversations and transcripts all stay exactly as they were. The dashboard warns you when five messages remain and turns red at zero, and adding credits brings the widget back immediately.",
  },
  {
    question: "What does the chatbot do when the answer is not in my content?",
    answer:
      "It outputs the fallback message you wrote in the widget settings, word for word, instead of improvising an answer. Those fallbacks are counted and shown as a Fallback rate tile on your dashboard for every chatbot at no extra cost, so you can see how often visitors ask about something your content does not cover and write the missing entry.",
  },
  {
    question: "How long are the answers, and how quickly do they appear?",
    answer:
      "Two to three sentences, by design: the chatbot is instructed to answer like a busy professional rather than write an essay, and there is a hard ceiling on reply length behind that instruction. The reply streams token by token, so text starts appearing while the rest is still being written, with an animated typing indicator until the first word arrives.",
  },
  {
    question: "Does it remember what a visitor asked earlier?",
    answer:
      "Yes, within the same browsing session. The recent conversation is replayed to the model on every turn, so a follow-up like 'and to Germany?' is understood without repeating the original question. The visitor id, conversation id and recent messages are kept in the browser's session storage, so moving from one page of your site to another keeps the same thread.",
  },
  {
    question: "Will the widget clash with my site's design or break my CSS?",
    answer:
      "No, in either direction. The widget renders inside a Shadow DOM whose host element resets all inherited styling, so your stylesheet cannot reach into the panel and the widget's styles cannot leak out onto your buttons or typography. You choose the primary colour, which drives the bubble, the header accent, the panel border, the send button and the visitor's own message bubbles.",
  },
  {
    question:
      "Can I install it through Google Tag Manager or a script-injecting plugin?",
    answer:
      "No. ChatKit needs a literal script tag in your page HTML, just before the closing body tag, because the widget reads its chatbot id from the tag it was loaded from. A copy added dynamically by a tag manager or an async loader has no such tag to read, so the widget exits silently and nothing appears.",
  },
  {
    question: "Can I remove the 'Powered by M.D.N Tech' link?",
    answer:
      "Not today. The panel carries a small 'Powered by M.D.N Tech' footer link, and there is no white-label option and no paid removal in ChatKit. If an unbranded widget is a requirement for you, this is the point to stop reading rather than the point to start a trial.",
  },
  {
    question: "Do you store my visitors' conversations, and what exactly is saved?",
    answer:
      "Yes. Every visitor message and every chatbot reply is stored as a full transcript, together with a randomly generated visitor id that is not tied to any identity, the IP address the message came from, and the URL of the page where the chat started. That retention is precisely what makes transcripts, exports, fallback rate and keyword analytics possible. The privacy policy at mdntech.org/privacy sets out what we store and why.",
  },
  {
    question: "What is the fastest way to build the knowledge base?",
    answer:
      "Run our copy-paste Claude Code prompt inside your own project — it is also packaged as the free /build-kb skill in ToolKit. It reads your code, docs, README and marketing copy and writes a single knowledge-base.md organised into ChatKit's own category headings, skipping any category it does not have enough material for rather than inventing content. You then paste each section into the matching entry, which takes minutes rather than an evening.",
  },
  {
    question: "Can I test on a staging site before going live on my real domain?",
    answer:
      "Yes. The widget reads its settings from your account every time it loads, so you can embed it on a staging site while the domain allow-list is still empty, check it there, then add your live domains before launch. Bear in mind that an empty allow-list allows any origin, so filling it in is the last step before going live, not the first.",
  },
];

// Generated from the same array the accordion renders — never a second copy.
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

export const ChatKitFaq = () => (
  <section
    id="faq"
    className="relative flex w-full max-w-full flex-col items-center justify-center gap-3 scroll-mt-24 py-20 px-4 md:px-20"
  >
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />

    <motion.h2
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp(0)}
      className="text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-10 text-center"
    >
      ChatKit questions we get asked most
    </motion.h2>

    <motion.p
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp(0.15)}
      className="text-lg text-gray-300 text-center mb-14 max-w-3xl"
    >
      The behavioural questions — where the bubble sits, what counts as a
      credit, what happens when you run out, and what we keep.
    </motion.p>

    <div className="w-full max-w-3xl flex flex-col divide-y divide-white/[0.06] border-y border-white/[0.06]">
      {FAQS.map(({ question, answer }) => (
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </span>
          </summary>
          <p className="mt-3 pr-11 text-sm md:text-base text-gray-400 leading-relaxed">
            {answer}
          </p>
        </details>
      ))}
    </div>

    {/* The page's final CTA lives here — no filler CTA section after it. */}
    <p className="text-sm text-gray-400 mt-10 text-center max-w-2xl leading-relaxed">
      <a
        href={`${APP_URL}/chatkit`}
        className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-medium"
      >
        Start with {FREE_TRIAL_MESSAGES} free messages
      </a>{" "}
      — or read{" "}
      <Link
        href="/privacy"
        className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-medium"
      >
        exactly what we store
      </Link>
      ,{" "}
      <Link
        href="/"
        className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-medium"
      >
        the rest of the M.D.N Tech lineup
      </Link>
      , or{" "}
      <Link
        href="/blog"
        className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-medium"
      >
        more from our engineering blog
      </Link>
      .
    </p>
  </section>
);
