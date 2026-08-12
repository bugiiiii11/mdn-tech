"use client";

import { motion } from "framer-motion";

import { Section, fadeUp } from "@/components/product-pages/primitives";
import { CREDITS_PER_MESSAGE } from "@/lib/portal/plans";

// "How ChatKit answers" — the three unusual behavioural constraints in the
// system prompt, sold as reasons to buy rather than apologised for.
//
// Sources (all prose, none exported):
//   lib/chat/prompt.ts:33-37  IMPORTANT RULES — answer only from the KB, output
//                             the owner's fallback verbatim, never invent,
//                             reply in the same language as the visitor
//   lib/chat/prompt.ts:39-52  RESPONSE STYLE + CONVERSATION HISTORY — 2-3
//                             sentences, no lists/headers/markdown/emoji, no
//                             recapping, brief reply to casual greetings
//   app/api/chat/[chatbotId]/message/route.ts:17  output ceiling (300 tokens)
//   app/api/chat/[chatbotId]/message/route.ts:186 history replay (last 20)
//   lib/portal/analytics.ts:53-93  the free fallback-rate tile
//
// NO latency claim anywhere: latency_ms is recorded after the fact and the
// route permits up to 30s. "Streams token by token" is the true, sellable
// statement. The model is named as Anthropic's Claude WITHOUT the pinned model
// id, so a version bump does not falsify the page.

const CREDIT_PHRASE =
  CREDITS_PER_MESSAGE === 1
    ? "one reply is one credit"
    : `one reply is ${CREDITS_PER_MESSAGE} credits`;

const rules = [
  {
    title: "It answers like a busy professional, not a brochure",
    body: `The instructions cap every reply at two or three sentences, with no bullet lists, no headings, no markdown and no emojis, and a hard ceiling on output length behind that. On a support widget this is what people actually want: the answer, not an essay. It is also the cheaper behaviour, because ${CREDIT_PHRASE} whether the reply is one line or five.`,
  },
  {
    title: "When it does not know, it says your line — word for word",
    body: "You write the fallback message in the widget settings, and the model is instructed to output it verbatim rather than improvise something plausible. Every fallback is then counted, so the Fallback rate tile on your dashboard — free with every chatbot — tells you exactly how often visitors asked something your content does not cover. Read it as a content to-do list, not a failure rate.",
  },
  {
    title: "One chatbot, every language your visitors use",
    body: "The model replies in the same language the question was asked in. There is no per-language setup and no second chatbot to build: your knowledge base can be written in English while a visitor asks in German and gets German back. The widget's own chrome stays English — the answers travel, the furniture does not.",
  },
  {
    title: "It follows the thread",
    body: "The recent conversation is replayed to the model on every turn, and the instructions forbid re-introducing itself or recapping what it has already said, so a follow-up like “and to Germany?” lands correctly instead of restarting the pitch. A casual greeting gets a short friendly reply rather than a product dump.",
  },
];

export const AnswerBehaviour = () => (
  <Section
    id="answers"
    title="How ChatKit answers: short, grounded, and in the visitor's language"
    intro="Most of what follows is a constraint rather than a feature. Each one is deliberate, and together they are why the chatbot is safe to put in front of your customers."
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
      className="grid w-full max-w-5xl grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10"
    >
      {rules.map((rule) => (
        <motion.div key={rule.title} variants={fadeUp(0)}>
          <h3 className="text-lg font-semibold text-white mb-2">{rule.title}</h3>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
            {rule.body}
          </p>
        </motion.div>
      ))}
    </motion.div>

    <motion.p
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp(0.1)}
      className="mt-12 text-sm text-gray-400 text-center"
    >
      Powered by Anthropic&apos;s Claude.
    </motion.p>
  </Section>
);
