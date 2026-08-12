"use client";

import { motion } from "framer-motion";

import { Section, fadeUp } from "@/components/product-pages/primitives";
import { APP_URL } from "@/lib/marketing/products";
import { FREE_TRIAL_MESSAGES } from "@/lib/portal/plans";

// "Add an AI chatbot to your website in four steps" — the depth answer to the
// homepage's three vague steps. Every field named below is a real control in
// the shipped portal:
//   - Step 1 fields:  components/portal/chatbots/PortalChatbotForm.tsx:15-19
//   - Step 2 fields:  components/portal/chatbots/PortalKBEntryForm.tsx:7,17-22,26
//   - Step 3 fields:  components/command-center/chatbots/WidgetConfigForm.tsx:10-15,84-148
//   - Step 4 snippet: components/command-center/chatbots/EmbedSnippet.tsx:8,19-21
//     (rendered only when status === 'active' — app/portal/chatkit/[id]/page.tsx:285-287)
// None of these are exported constants, so the field names are prose. If a form
// changes, this section changes with it.
//
// The trial size is imported from lib/portal/plans.ts and never typed.

// The literal embed, exactly as EmbedSnippet produces it, with an obviously
// fake id. This is real content a visitor needs to read — NOT aria-hidden.
const EMBED_SNIPPET =
  '<script src="https://www.mdntech.org/widget.js" data-chatbot-id="your-chatbot-id"></script>';

const steps = [
  {
    title: "Create the chatbot",
    body: "Three fields. Name, which is required; Status — Active, Draft or Archived, and it defaults to Active; and an optional Description. There is no onboarding form, no approval queue and nobody to email. The chatbot exists the moment you save.",
  },
  {
    title: "Add knowledge-base entries",
    body: "Each entry is a Title, a Category picked from a dropdown of nine, the Content itself in a textarea with a live word count, and a Sort order. The next section covers what to write, which category to file it under, and why the order matters more than you would expect.",
  },
  {
    title: "Style the widget",
    body: "Five controls, one panel: the greeting message; a free-text custom system prompt, which is where you set personality and house rules; the primary colour from a hex picker; the fallback message it uses when an answer is not in your content; and the allowed-domains list.",
  },
];

export const SetupSteps = () => (
  <Section
    id="setup"
    title="Add an AI chatbot to your website in four steps — no coding"
    intro="Everything below is a form you fill in yourself. These are the actual fields, in the order you meet them, so you can see the whole job before you start it."
    wide
  >
    <motion.ol
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
      className="flex w-full max-w-3xl flex-col gap-9 list-none"
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
            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
              {step.body}
            </p>
          </div>
        </motion.li>
      ))}

      {/* Step 4 carries the code block, so it is written out rather than
          generated from the array above. */}
      <motion.li variants={fadeUp(0)} className="flex gap-5">
        <span
          aria-hidden="true"
          className="flex-shrink-0 w-10 h-10 rounded-full border border-[#7042f88b] bg-[#7042f815] text-cyan-400 font-semibold flex items-center justify-center"
        >
          {steps.length + 1}
        </span>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-white mb-1.5">
            Paste one line before &lt;/body&gt;
          </h3>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
            The portal shows your snippet with a copy button once the
            chatbot&apos;s status is Active. It looks exactly like this, with
            your own chatbot id in place of the placeholder:
          </p>

          <div className="mt-4 overflow-x-auto rounded-xl border border-[#7042f88b] bg-[#030014]/70 backdrop-blur-sm p-4">
            <code className="block whitespace-pre font-mono text-xs md:text-sm text-cyan-300">
              {EMBED_SNIPPET}
            </code>
          </div>

          <p className="mt-4 text-sm text-gray-400 leading-relaxed">
            It has to be a real script tag in your page HTML. Tag managers and
            script injectors that add it dynamically are not supported, because
            widget.js reads the tag it was loaded from —{" "}
            <a
              href="#faq"
              className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-medium"
            >
              the FAQ explains why
            </a>
            .
          </p>
        </div>
      </motion.li>
    </motion.ol>

    <motion.p
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp(0.1)}
      className="mt-12 max-w-3xl text-center text-base md:text-lg text-gray-300 leading-relaxed"
    >
      No plugin, no hosting, nothing to maintain — and you can do all four steps
      before you spend a single credit.
    </motion.p>

    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp(0.15)}
      className="mt-8 flex flex-col items-center gap-3"
    >
      <motion.a
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        href={`${APP_URL}/chatkit`}
        className="py-3 px-8 button-primary text-center text-white cursor-pointer rounded-lg font-semibold"
      >
        Create your chatbot — {FREE_TRIAL_MESSAGES} free messages
      </motion.a>
      <p className="text-sm text-gray-400">
        No credit card, nothing to cancel.
      </p>
    </motion.div>
  </Section>
);
