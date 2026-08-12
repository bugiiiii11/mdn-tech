"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import {
  CtaButton,
  GlassCard,
  PROSE_LINK_CLASS,
  Section,
  StatChip,
  fadeUp,
} from "@/components/product-pages/primitives";
import { APP_URL } from "@/lib/marketing/products";
import {
  CREDITS_PER_MESSAGE,
  CREDIT_PACKS,
  FREE_TRIAL_MESSAGES,
  chatbotAllowanceLabel,
  creditsPerReplyLabel,
  featureById,
} from "@/lib/portal/plans";

// The commercial section — the site's first real ChatKit price list.
//
// DATA DISCIPLINE: there is not one hard-coded currency figure, credit amount
// or per-message rate in this file. Everything is mapped out of CREDIT_PACKS
// and FEATURES in lib/portal/plans.ts, including which pack is highlighted
// (pack.highlight) and how many packs there are. Phase 2 re-prices the unlocks
// in credits; when that lands, this section changes because plans.ts changes.
//
// PAYMENT LANGUAGE — hard constraint: no payment processor is integrated
// (both purchase routes write status 'mock'), so this is a published price
// list, not a checkout. No "buy", "secure payment", "cards accepted",
// "invoice", "refund" or "money-back" language appears anywhere, and the only
// button in the section is the free-trial CTA. The word "checkout" appears
// exactly once — in the closing paragraph's disclosure that it is NOT live
// yet, which is the honest statement of the constraint rather than a hedge
// around it.
//
// HONESTY CONSTRAINT #3: credits live on chatbots.credits_purchased, per
// chatbot. One ACCOUNT is true; one BALANCE is not. Stated explicitly below.

const EXTRA_CHATBOT_PRICE = featureById("extra_chatbot")?.priceLabel ?? "";

// en-US digit grouping without toLocaleString: this is a client component, so
// a formatter runs on both sides of the hydration boundary, and the runtime's
// ICU data is the one input we cannot pin. String arithmetic is deterministic.
const formatCount = (n: number) =>
  String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// Different grammatical shape from creditsPerReplyLabel(), so it stays local —
// but still derived from the constant, never typed.
const CREDIT_RATIO_SENTENCE =
  CREDITS_PER_MESSAGE === 1
    ? "One credit, one reply."
    : `${CREDITS_PER_MESSAGE} credits, one reply.`;

const mechanics = [
  {
    title: CREDIT_RATIO_SENTENCE,
    body: `Visitor questions cost nothing. Only the chatbot's answer moves the counter, once, after the reply has finished streaming. Because it is ${creditsPerReplyLabel()}, the credit number and the message number are the same number — there is no conversion to work out.`,
  },
  {
    title: "Credits do not expire and do not reset.",
    body: "Your allowance is the free trial plus every credit you have ever added, measured against the total number of replies given. There is no monthly reset, no expiry date and no use-it-or-lose-it window. Stop topping up and you simply stop spending.",
  },
  {
    title: `You start with ${FREE_TRIAL_MESSAGES} free messages and no card.`,
    body: "That covers writing the knowledge base, styling the widget, embedding it on your site and watching real answers come back. There is no card field in the signup flow to leave one in.",
  },
];

export const Pricing = () => (
  <Section
    id="pricing"
    title="What an AI chatbot costs when you only pay for replies"
    intro="No subscription of any kind, no monthly minimum, nothing to cancel. You top up credits and spend them only when the chatbot answers someone."
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
      className="grid w-full max-w-5xl grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-8"
    >
      {mechanics.map((mechanic) => (
        <motion.div key={mechanic.title} variants={fadeUp(0)}>
          <h3 className="text-base md:text-lg font-semibold text-white mb-2">
            {mechanic.title}
          </h3>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
            {mechanic.body}
          </p>
        </motion.div>
      ))}
    </motion.div>

    {/* The packs. Mapped from CREDIT_PACKS — order, highlight and every figure
        come from the data. */}
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp(0.1)}
      className="w-full mt-16"
    >
      <h3 className="text-lg font-semibold text-white mb-8 text-center">
        {CREDIT_PACKS.length === 3
          ? "The three credit packs"
          : `The ${CREDIT_PACKS.length} credit packs`}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CREDIT_PACKS.map((pack) => (
          <GlassCard
            key={pack.id}
            className={
              pack.highlight ? "border-[#7042f8] bg-[#7042f81f]" : undefined
            }
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <h4 className="text-lg font-semibold text-white">{pack.name}</h4>
              {pack.highlight ? (
                /* Solid purple-400 at the 12px label size: purple-400/70 at
                   10px measured 4.08:1 on the highlighted card — under AA for
                   the one mark that names the recommended pack. */
                <span className="text-xs font-medium uppercase tracking-wider text-purple-400">
                  Best value
                </span>
              ) : null}
            </div>

            <p className="text-3xl font-bold text-white">{pack.priceLabel}</p>
            <p className="mt-1 text-sm text-gray-400">
              {formatCount(pack.credits)} credits ={" "}
              {formatCount(Math.floor(pack.credits / CREDITS_PER_MESSAGE))}{" "}
              replies
            </p>

            <div className="mt-4">
              <StatChip>{pack.perCreditLabel}</StatChip>
            </div>

            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              {pack.description}
            </p>
          </GlassCard>
        ))}
      </div>

      <p className="mt-8 text-sm md:text-base text-gray-400 leading-relaxed text-center max-w-3xl mx-auto">
        The per-message figure is the number that matters, and it is on every
        card, so you can work out your own bill before you sign up rather than
        asking us for a quote.
      </p>
    </motion.div>

    {/* Scope of a balance — honesty constraint #3. */}
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp(0.1)}
      className="mt-14 w-full max-w-3xl"
    >
      <h3 className="text-lg font-semibold text-white mb-3">
        What a balance is attached to
      </h3>
      <p className="text-sm md:text-base text-gray-300 leading-relaxed">
        Every account starts with {chatbotAllowanceLabel()}, and additional
        slots are a one-time {EXTRA_CHATBOT_PRICE} each. Credits sit on the
        chatbot, not on the account: two chatbots on the same login have two
        separate balances, two knowledge bases and two sets of settings, and
        credits do not move between them.
      </p>
    </motion.div>

    {/* The only button in this section, and it is the free trial — not a
        checkout. No payment processor is integrated. */}
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp(0.15)}
      className="mt-14"
    >
      <CtaButton
        cta={{
          href: `${APP_URL}/chatkit`,
          label: `Start with ${FREE_TRIAL_MESSAGES} free messages`,
        }}
      />
    </motion.div>

    <motion.p
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp(0.1)}
      className="mt-6 max-w-3xl text-center text-sm text-gray-400 leading-relaxed"
    >
      Prices are listed here so you can budget before you start. Payment is not
      live yet: while checkout is being set up, credits are granted from inside
      the app, and no card is charged today. Sign-up and the free trial need no
      card either, and current prices and availability always live{" "}
      <a
        href={`${APP_URL}/chatkit`}
        className={`${PROSE_LINK_CLASS} font-medium`}
      >
        in the app
      </a>
      .{" "}
      <Link href="/terms" className={`${PROSE_LINK_CLASS} font-medium`}>
        Terms of service
      </Link>
      .
    </motion.p>
  </Section>
);
