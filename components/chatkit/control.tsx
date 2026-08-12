"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import {
  PROSE_LINK_CLASS,
  Section,
  fadeUp,
} from "@/components/product-pages/primitives";
import { CHAT_BOT_RULE, CHAT_IP_RULE } from "@/lib/chat/rate-limit-rules";

// "Domain control, spend protection, and what happens at zero credits" — the
// two money fears that stop a self-service signup, answered with named
// server-side mechanisms instead of a trust badge.
//
// BANNED in this section and absent from it: SOC 2, ISO 27001, GDPR-compliant,
// HIPAA, enterprise-grade, 99.9% uptime, any SLA or encryption guarantee. None
// of those artefacts exist in the repository, so none of them are claimed.
//
// Sources:
//   lib/chat/cors.ts:50-73    normalizeDomain (URL/port/case/trailing-slash)
//   lib/chat/cors.ts:93-108   matching rules (apex covers www; *. covers both)
//   lib/chat/cors.ts:86-95    empty list = allow any origin  <-- constraint #4
//   lib/chat/cors.ts:1-15     why enforcement is a 403, not CORS headers
//   app/api/chat/[chatbotId]/config/route.ts:39-54  403 at widget load
//   app/api/chat/[chatbotId]/message/route.ts:101-103  403 at send
//   lib/chat/rate-limit-rules.ts  CHAT_IP_RULE / CHAT_BOT_RULE — the client-
//     safe split of rate-limit.ts (which stays server-only via the service
//     client). Imported and interpolated below, so the figures cannot drift
//     from what the route enforces.
//   lib/chat/rate-limit.ts:49-55  deliberate fail-open on infrastructure error
//   lib/chat/schemas.ts:10-35     zod validation before any database work
//   app/api/chat/[chatbotId]/message/route.ts:140-152  conversation scoping
//   lib/chat/usage.ts:69-71 + components/portal/UsageMeter.tsx:14  warn at <= 5
//   app/api/chat/[chatbotId]/config/route.ts:58-63 + public/widget.js:107-109
//     — at zero the widget does not render at all; nothing is deleted.

const blocks = [
  {
    title: "Restrict your chatbot to your own domains",
    body: [
      "You list hostnames one per line, with an optional *. wildcard. example.com also covers www.example.com; *.example.com covers the apex and any subdomain. Whatever you paste — a full URL, a port, a trailing slash, mixed case — is normalised down to a plain hostname before it is saved, so a copy-pasted address from your browser bar works.",
      "Enforcement is a server-side refusal on both the config load and the message send. A stolen snippet fails at widget load rather than on the first question, and because the check lives in the API rather than only in CORS headers, it also stops scripted abuse that ignores browsers entirely.",
      "The list starts empty, which allows any origin, so add your domains the day you go live. This is a control you switch on, not one that is on for you.",
    ],
  },
  {
    title: "Abuse cannot run up your bill",
    body: [
      `Rate limits are applied per visitor IP and per chatbot, per minute — ${CHAT_IP_RULE.limit} requests a minute from one visitor, ${CHAT_BOT_RULE.limit} a minute across a single chatbot — and they are evaluated before the chatbot record, your knowledge base or the model are touched. Traffic that is going to be blocked never reaches anything that costs a credit.`,
      "The limiter is deliberately built to fail open on an infrastructure error. A database hiccup should never take a paying customer's chatbot offline, and every request that gets past the limiter still has to clear the credit check behind it.",
      "Separately: every field on the public endpoint is validated before any database work happens, and a conversation id belonging to one chatbot can never read or write another chatbot's thread, even if somebody knows a valid one.",
    ],
  },
  {
    title: "Running out pauses; it never deletes",
    body: [
      "At five or fewer remaining messages the dashboard meter turns yellow and tells you how many are left. At zero it turns red. That warning is in the dashboard — we do not send a low-balance email.",
      "On your site the widget simply stops rendering. Visitors see nothing at all, rather than a broken bubble or an error message, and nothing is destroyed: your knowledge base, styling, unlocks, conversations and transcripts stay exactly as they were. Adding credits brings the widget straight back.",
    ],
  },
];

export const Control = () => (
  <Section
    id="control"
    title="Domain control, spend protection, and what happens at zero credits"
    intro="Two questions decide whether a self-service signup happens: can somebody copy my snippet and spend my money, and what breaks when I run out. Both have specific answers."
    wide
  >
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } },
      }}
      className="flex w-full max-w-3xl flex-col gap-12"
    >
      {blocks.map((block) => (
        <motion.div key={block.title} variants={fadeUp(0)}>
          <h3 className="text-lg font-semibold text-white mb-3">
            {block.title}
          </h3>
          <div className="flex flex-col gap-3">
            {/* Index keys: the array is a static module const, never
                reordered, and a content-prefix key can silently collide. */}
            {block.body.map((paragraph, index) => (
              <p
                key={index}
                className="text-sm md:text-base text-gray-300 leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>

    <motion.p
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp(0.1)}
      className="mt-12 max-w-3xl text-center text-sm text-gray-400 leading-relaxed"
    >
      No compliance badges here on purpose — these are the mechanisms, named, so
      you can judge them. There is also{" "}
      <Link href="/privacy" className={`${PROSE_LINK_CLASS} font-medium`}>
        our privacy policy
      </Link>
      .
    </motion.p>
  </Section>
);
