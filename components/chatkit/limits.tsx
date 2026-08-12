"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { Section, fadeUp } from "@/components/product-pages/primitives";
import { APP_URL } from "@/lib/marketing/products";
import { FREE_TRIAL_MESSAGES } from "@/lib/portal/plans";

// "Honest limits: what ChatKit does not do" — the page's structural moat.
// Card-less, matching components/landing/why-us.tsx, so it reads as a
// statement rather than a feature grid. Calm and factual; never apologetic,
// never a roadmap promise.
//
// FREE_TRIAL_MESSAGES is the only import. Every other figure here is a
// deliberate statement of a code fact with no exported constant behind it:
//   app/api/chat/[chatbotId]/message/route.ts:15  MAX_KB_ENTRIES = 5
//   app/api/chat/[chatbotId]/message/route.ts:16  MAX_KB_ENTRY_CHARS = 2000
//     (applied at :83-85 and :132-138 — entries are ordered by sort_order then
//     category, sliced to 5, and each one truncated)
//   app/api/chat/[chatbotId]/message/route.ts:17  output ceiling, 300 tokens
//   public/widget.js:5-6    document.currentScript — why tag managers fail
//   public/widget.js:61,65  fixed bottom-right position
//   public/widget.js:153    hard-coded "Powered by M.D.N Tech"
//   supabase/migrations/005_message_feedback.sql:7,14-19  owner-only ratings
//   app/api/portal/chatkit/[id]/suggestions/[suggestionId]/route.ts:24-27,64-80
//     accept | dismiss only — auto-learning never writes on its own
//   app/api/chat/[chatbotId]/message/route.ts:154-178  what is retained
// If any of these change, this section is wrong and must change with them.

const limits = [
  {
    title: "No crawler, no uploads, no imports",
    body: "You cannot point it at your sitemap or drop in a PDF. Content is added through the entry form — or generated locally with the free /build-kb Claude Code prompt and pasted in.",
  },
  {
    title: "Keep the knowledge base short and ordered",
    body: "Only the first 5 knowledge-base entries in sort order reach the model, each capped at 2,000 characters. You can store more — they are listed, counted and exported — but they will not answer visitors. Write few, dense, well-sorted entries.",
  },
  {
    title: "Short answers only, by design",
    body: "Two or three sentences, no bullet lists and no headings, with a hard ceiling on length behind that. If you need a bot that outputs long formatted documents, this is the wrong tool.",
  },
  {
    title: "Fixed position",
    body: "The launcher sits in the bottom-right corner and cannot be moved.",
  },
  {
    title: "No white-label",
    body: "The panel carries a 'Powered by M.D.N Tech' link and there is no option to remove it, paid or otherwise.",
  },
  {
    title: "A real script tag, not a tag manager",
    body: "The snippet must be in your page HTML. A copy injected dynamically by a tag manager or an async loader will not initialise, because the widget reads its chatbot id from the tag it was loaded from.",
  },
  {
    title: "Visitors do not rate answers",
    body: "Thumbs-up and thumbs-down live in your dashboard, for you. Auto-learning learns from your judgement, not from strangers'.",
  },
  {
    title: "Auto-learning never edits your chatbot on its own",
    body: "Every suggestion waits for you to accept it, and a suggestion that trips the injection checks needs a second, explicit confirmation before it can be accepted at all.",
  },
];

export const Limits = () => (
  <Section
    id="limits"
    title="Honest limits: what ChatKit does not do"
    intro="Every chatbot page on the internet lists what the product does. Here is what ours does not, so you can decide before you spend an evening on it."
    wide
  >
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
      }}
      className="grid w-full max-w-5xl grid-cols-1 sm:grid-cols-2 gap-x-14 gap-y-9"
    >
      {limits.map((limit) => (
        <motion.div key={limit.title} variants={fadeUp(0)}>
          <h3 className="text-base md:text-lg font-semibold text-white mb-2">
            {limit.title}
          </h3>
          <p className="text-sm md:text-base text-gray-400 leading-relaxed">
            {limit.body}
          </p>
        </motion.div>
      ))}

      {/* Two limits carry links, so they are written out rather than mapped. */}
      <motion.div variants={fadeUp(0)}>
        <h3 className="text-base md:text-lg font-semibold text-white mb-2">
          Conversations are stored, not discarded
        </h3>
        <p className="text-sm md:text-base text-gray-400 leading-relaxed">
          Full transcripts, plus a random visitor id, the IP address the message
          came from and the page the chat started on. That retention is what
          makes transcripts, exports and analytics possible — our privacy policy
          has{" "}
          <Link
            href="/privacy"
            className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-medium"
          >
            exactly what we store
          </Link>
          .
        </p>
      </motion.div>

      <motion.div variants={fadeUp(0)}>
        <h3 className="text-base md:text-lg font-semibold text-white mb-2">
          No certifications or uptime guarantee to quote
        </h3>
        <p className="text-sm md:text-base text-gray-400 leading-relaxed">
          We have no compliance badge to show you and we do not publish an
          uptime figure. What we do have are the named mechanisms in{" "}
          <a
            href="#control"
            className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-medium"
          >
            the previous section
          </a>
          .
        </p>
      </motion.div>
    </motion.div>

    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp(0.15)}
      className="mt-14 flex flex-col items-center gap-5"
    >
      <p className="max-w-3xl text-center text-base md:text-lg text-gray-300 leading-relaxed">
        If none of that is a dealbreaker, {FREE_TRIAL_MESSAGES} messages will
        tell you the rest.
      </p>
      <motion.a
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        href={`${APP_URL}/chatkit`}
        className="py-3 px-8 button-primary text-center text-white cursor-pointer rounded-lg font-semibold"
      >
        Create your chatbot — {FREE_TRIAL_MESSAGES} free messages
      </motion.a>
    </motion.div>
  </Section>
);
