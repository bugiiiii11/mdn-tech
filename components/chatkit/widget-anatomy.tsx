"use client";

import { motion } from "framer-motion";

import { Section, fadeUp } from "@/components/product-pages/primitives";

// "What your visitors actually see" — an ANNOTATED widget mock. The homepage
// shows a mock and says nothing; this section says what every number is.
//
// None of these figures are importable — they are CSS string literals in the
// shipped widget:
//   public/widget.js:61   .mdn-bubble  — 56px circle, position: fixed, bottom/right 20px
//   public/widget.js:65   .mdn-panel   — width 380px, max-height 520px, background #0d0d20
//   public/widget.js:59   :host { all: initial }  (Shadow DOM reset)
//   public/widget.js:114-117  container + attachShadow({ mode: 'open' })
//   public/widget.js:99-103   @media (max-width: 480px) — calc(100vw - 16px), 65vh, 50px bubble
//   public/widget.js:47-55    renderMarkdown — escapes first, then bold/link/list
//   public/widget.js:153      "Powered by M.D.N Tech" (hard-coded, no white-label flag)
//   public/widget.js:143,148  hard-coded English chrome ("AI" tag, "Type a message...")
//   public/widget.js:21-44    sessionStorage persistence
//   app/api/chat/[chatbotId]/message/route.ts:202-217,261-268  SSE token streaming
// If the widget is redesigned, this comment is the checklist for what to update.

const specs = [
  {
    title: "A 56-pixel bubble, bottom right",
    body: "The launcher is a 56-pixel circle fixed to the bottom-right corner, and it opens a 380-pixel panel up to 520 pixels tall on a dark #0d0d20 background. The position is fixed — it is not something you can move.",
  },
  {
    title: "Your colour, everywhere it counts",
    body: "The bubble, the header accent, the panel border, the send button and the visitor's own message bubbles all take the primary colour you picked in the widget settings.",
  },
  {
    title: "It cannot break your CSS, and your CSS cannot break it",
    body: "The widget renders inside a Shadow DOM whose host rule is ':host { all: initial }'. Styles do not cross in either direction: your theme cannot squash the panel, and the widget cannot restyle your buttons or inherit your type scale.",
  },
  {
    title: "Mobile is a different layout, not a shrunk one",
    body: "Below 480 pixels the panel goes near-full-width — calc(100vw - 16px) — caps its height at 65vh so it never swallows the page, and the bubble drops to 50 pixels.",
  },
  {
    title: "Answers stream in as they are written",
    body: "Replies arrive token by token over a server-sent event stream, so the visitor watches the answer being typed rather than staring at a spinner. An animated three-dot indicator covers the gap before the first token.",
  },
  {
    title: "The thread survives navigation",
    body: "The visitor id, the conversation id and the recent messages are held in the browser's session storage, so clicking from your pricing page to your contact page does not restart the chat.",
  },
  {
    title: "Light formatting only",
    body: "Bold, links — opened in a new tab with rel=noopener — and simple bullet lines. Everything is HTML-escaped before any formatting is applied.",
  },
  {
    title: "It carries our badge",
    body: "The panel has a small 'Powered by M.D.N Tech' footer link. There is no white-label option today, paid or otherwise.",
  },
  {
    title: "English chrome, multilingual answers",
    body: "The placeholder text, the AI tag and the error strings are English. The answers follow the visitor's language; the widget's own furniture does not.",
  },
];

/** CSS-only mock at the widget's real proportions. Decoration — aria-hidden. */
const WidgetMock = () => (
  <div
    aria-hidden="true"
    className="w-full max-w-[380px] rounded-2xl border border-[#7042f88b] bg-[#0d0d20]/90 backdrop-blur-sm overflow-hidden"
  >
    {/* Header: pulsing dot, name, AI tag, close */}
    <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-[#7042f83d] bg-gradient-to-b from-[#7042f81f] to-transparent">
      <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#7c3aed] opacity-60 animate-ping motion-reduce:animate-none" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#7c3aed]" />
      </span>
      {/* Generic placeholder name — never a real or invented business, so the
          mock cannot read as a customer reference. */}
      <span className="flex-1 text-sm font-semibold text-white">
        Your Assistant
      </span>
      <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-gray-400">
        AI
      </span>
      <span className="text-lg leading-none text-gray-500">&times;</span>
    </div>

    {/* Messages */}
    <div className="flex flex-col gap-2.5 p-4 min-h-[200px]">
      <div className="self-start max-w-[85%] rounded-[14px] rounded-bl-[4px] bg-white/[0.07] px-3.5 py-2.5 text-[13px] leading-relaxed text-gray-300">
        Hi — ask me anything about orders, delivery or returns.
      </div>
      <div className="self-end max-w-[85%] rounded-[14px] rounded-br-[4px] bg-[#7c3aed] px-3.5 py-2.5 text-[13px] leading-relaxed text-white">
        Liefern Sie nach Deutschland?
      </div>
      <div className="self-start max-w-[85%] rounded-[14px] rounded-bl-[4px] bg-white/[0.07] px-3.5 py-2.5 text-[13px] leading-relaxed text-gray-300">
        Ja, wir liefern nach Deutschland in 3–5 Werktagen.
      </div>
      {/* Three-dot typing indicator */}
      <div className="self-start flex items-center gap-1.5 rounded-[14px] bg-white/[0.06] px-4 py-3">
        <span className="h-[7px] w-[7px] rounded-full bg-gray-500 animate-pulse motion-reduce:animate-none" />
        <span className="h-[7px] w-[7px] rounded-full bg-gray-500 animate-pulse motion-reduce:animate-none [animation-delay:200ms]" />
        <span className="h-[7px] w-[7px] rounded-full bg-gray-500 animate-pulse motion-reduce:animate-none [animation-delay:400ms]" />
      </div>
    </div>

    {/* Input row */}
    <div className="flex items-center gap-2 border-t border-[#7042f833] p-3">
      <span className="flex-1 rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-[13px] text-gray-500">
        Type a message...
      </span>
      <span className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-xl bg-[#7c3aed]">
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-white">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </span>
    </div>

    <div className="py-1.5 text-center text-[10px] text-gray-600">
      Powered by M.D.N Tech
    </div>
  </div>
);

export const WidgetAnatomy = () => (
  <Section
    id="widget"
    title="What your visitors actually see"
    intro="The panel below is drawn at the widget's real proportions, in its real layout. Everything alongside it is a specific figure rather than a promise, so you can judge whether it will suit your site before you install it."
    wide
  >
    <div className="grid w-full grid-cols-1 lg:grid-cols-[380px_1fr] gap-12 lg:gap-16 items-start">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp(0)}
        className="flex justify-center lg:sticky lg:top-28"
      >
        <WidgetMock />
      </motion.div>

      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
        className="flex flex-col gap-7 list-none"
      >
        {specs.map((spec) => (
          <motion.li key={spec.title} variants={fadeUp(0)}>
            <h3 className="text-base md:text-lg font-semibold text-white mb-1.5">
              {spec.title}
            </h3>
            <p className="text-sm md:text-base text-gray-400 leading-relaxed">
              {spec.body}
            </p>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  </Section>
);
