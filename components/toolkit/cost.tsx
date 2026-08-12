import Link from "next/link";

import {
  GlassCard,
  Section,
  StatChip,
} from "@/components/product-pages/primitives";
import { MARKETING_PRODUCTS } from "@/lib/marketing/products";
import {
  BASE_CHATBOT_LIMIT,
  CREDITS_PER_MESSAGE,
  CREDIT_PACKS,
  FEATURES,
  FREE_TRIAL_MESSAGES,
} from "@/lib/portal/plans";

import { numberWord } from "./catalogue";

// The pricing section. Publishing the paid product's full price list is what
// makes "free" believable for a developer who assumes there is a catch.
//
// DATA DISCIPLINE: every digit in part two is read from lib/portal/plans.ts,
// the billing source of truth — trial messages, credits per reply, pack prices,
// per-message rates, unlock prices and the base chatbot allowance. Nothing is
// typed by hand, so marketing copy cannot drift from what the portal charges.
//
// HONESTY CONSTRAINTS (do not regress):
//  - The one-time unlocks are NOT part of the trial. A new chatbot ships with
//    feature_unlocks = '{}', so they are separated visually and in words.
//  - Credits live on chatbots.credits_purchased — per chatbot, ChatKit only.
//    One account is true; one balance is not. Part three says so out loud.
//  - ToolKit's price is stated as a fact, not imported: there is deliberately
//    no ToolKit constant in plans.ts, and that absence is the actual argument.
//  - "Free today, with no billing code path that could change that quietly" —
//    never "free forever, guaranteed", and never extended to another product.

const chatbotFeatures = FEATURES.filter(
  (feature) => feature.scope === "chatbot"
);
const extraChatbot = FEATURES.find((feature) => feature.id === "extra_chatbot");

const chatbotAllowance =
  BASE_CHATBOT_LIMIT === 1
    ? "one chatbot"
    : `${numberWord(BASE_CHATBOT_LIMIT)} chatbots`;

const creditSentence =
  CREDITS_PER_MESSAGE === 1
    ? "one credit covers one reply"
    : `${CREDITS_PER_MESSAGE} credits cover one reply`;

export const Cost = () => (
  <Section
    id="cost"
    wide
    title="What this costs, and what M.D.N Tech charges for"
    intro="The directory is free, so the fair question is what pays for it. Here is the entire price list of the product that does."
  >
    <div className="flex w-full flex-col gap-10">
      <GlassCard className="p-8">
        <h3 className="text-lg font-semibold text-white mb-3">
          ToolKit: nothing, and nothing metered
        </h3>
        <p className="text-base text-gray-300 leading-relaxed">
          This is a structural fact rather than a promise. There is no ToolKit
          entry in the billing source of truth at all — no price constant, no
          credit cost, no trial counter, and no metering call anywhere in the
          page tree. No account, no email, no card. Nothing is stored about you
          either: no analytics script, no install counter, no tracking. The only
          server call on the live directory decides whether the top bar shows
          &ldquo;Login&rdquo; or an account menu.
        </p>
        <p className="mt-4 text-sm md:text-base text-gray-400 leading-relaxed">
          So: free today, with no billing code path that could change that
          quietly. That claim is scoped to ToolKit and to nothing else M.D.N
          Tech builds.
        </p>
      </GlassCard>

      <div className="border-t border-white/[0.06] pt-10">
        <h3 className="text-lg font-semibold text-white mb-3">
          What we do charge for: ChatKit
        </h3>
        <p className="mb-8 text-base text-gray-300 leading-relaxed">
          Every new chatbot starts with {FREE_TRIAL_MESSAGES} free messages and
          no card. After that {creditSentence}, and you buy credits in packs.
          There is no subscription — when you stop buying, you stop spending.
        </p>

        <ul className="grid grid-cols-1 gap-5 list-none sm:grid-cols-3">
          {CREDIT_PACKS.map((pack) => (
            <li key={pack.id}>
              <GlassCard className="flex h-full flex-col gap-2">
                <h4 className="text-base font-semibold text-white">
                  {pack.name}
                </h4>
                <p className="text-2xl font-bold text-white">
                  {pack.priceLabel}
                </p>
                <p className="text-sm text-gray-400">
                  {pack.credits.toLocaleString("en-US")} credits
                </p>
                <div className="mt-2">
                  <StatChip>{pack.perCreditLabel}</StatChip>
                </div>
              </GlassCard>
            </li>
          ))}
        </ul>

        <p className="mt-5 text-sm text-gray-400">
          <Link
            href="/chatkit"
            className="text-cyan-400 transition-colors hover:text-cyan-300"
          >
            See what ChatKit costs
          </Link>{" "}
          in full, including what a chatbot can and cannot do before you pay
          anything.
        </p>

        <div className="mt-10">
          <h4 className="text-base font-semibold text-white mb-2">
            Optional one-time unlocks, not included in the trial
          </h4>
          <p className="mb-5 text-sm text-gray-400 leading-relaxed">
            A new chatbot ships with none of these switched on. Each is a single
            payment that turns the capability on permanently — no recurring
            charge, and nothing here is required to run a chatbot.
          </p>
          <ul className="flex flex-col divide-y divide-white/[0.06] border-y border-white/[0.06] list-none">
            {chatbotFeatures.map((feature) => (
              <li
                key={feature.id}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3"
              >
                <span className="text-sm md:text-base text-gray-300">
                  {feature.name}
                </span>
                <span className="text-sm font-medium text-gray-400">
                  {feature.priceLabel} once
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-gray-400 leading-relaxed">
            An account includes {chatbotAllowance}.
            {extraChatbot
              ? ` Extra slots are the same kind of one-time unlock, at ${extraChatbot.priceLabel} each.`
              : ""}
          </p>
        </div>
      </div>

      <GlassCard className="p-8">
        <h3 className="text-lg font-semibold text-white mb-3">
          Credits are per chatbot, and ChatKit only
        </h3>
        <p className="text-base text-gray-300 leading-relaxed">
          Worth stating plainly, because the opposite is the easiest thing to
          imply: credits are held against an individual chatbot, they are spent
          only on ChatKit replies, and ToolKit never touches them. There is no
          shared wallet across products today. One account, not one balance.
        </p>
        <p className="mt-4 text-sm md:text-base text-gray-400 leading-relaxed">
          If you want the wider picture, the homepage lists{" "}
          <Link
            href="/"
            className="text-cyan-400 transition-colors hover:text-cyan-300"
          >
            all {numberWord(MARKETING_PRODUCTS.length)} M.D.N Tech products
          </Link>
          , shipped and unshipped, with the same separation between what exists
          and what is still being built.
        </p>
      </GlassCard>
    </div>
  </Section>
);
