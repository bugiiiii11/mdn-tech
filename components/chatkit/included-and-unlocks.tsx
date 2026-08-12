"use client";

import { motion } from "framer-motion";

import {
  CheckItem,
  GlassCard,
  Section,
  fadeUp,
} from "@/components/product-pages/primitives";
import {
  BASE_CHATBOT_LIMIT,
  FEATURES,
  FREE_TRIAL_MESSAGES,
  featureById,
} from "@/lib/portal/plans";

// "What every chatbot includes, and what costs extra".
//
// HONESTY CONSTRAINT #1, enforced structurally: a new chatbot ships with
// feature_unlocks = '{}' (supabase/migrations/017_chatkit_credits_addons.sql:22-23),
// so the conversation viewer, analytics, weekly reports and auto-learning are
// PAID one-time unlocks and are never part of the trial. The two blocks below
// are separated by a rule and by their headings, and nothing on this page says
// "everything included".
//
// Names and prices come from FEATURES in lib/portal/plans.ts — the billing
// source of truth — so they cannot drift from what the portal charges. Only
// the longer descriptions are written here, keyed by feature id.
//
// Free-tier facts and their sources:
//   four dashboard tiles — lib/portal/analytics.ts:53-93, rendered
//     unconditionally at app/portal/chatkit/[id]/page.tsx:57,94-99
//   usage meter states — components/portal/UsageMeter.tsx:5-8,14,41-51
//   knowledge-base Markdown export — app/portal/chatkit/[id]/page.tsx:141
//     (KBExportButton, not gated) and components/command-center/chatbots/KBExportButton.tsx
//
// The 7-day window, top-8 keywords, five drafts per run and the Monday cadence
// are argument literals, not constants:
//   app/portal/chatkit/[id]/page.tsx:58-59
//   app/api/portal/chatkit/learning/run/route.ts:22-25
//   supabase/migrations/019_chatkit_reports.sql:49 ('10 6 * * 1')
// The report cadence is described as the designed schedule, and the on-demand
// run — which does work today — is stated first.

const included: { title: string; body: string }[] = [
  {
    title: "Answers from your content",
    body: "Grounded in the knowledge base you wrote, with your own fallback line whenever the answer is not in it.",
  },
  {
    title: "Replies in the visitor's language",
    body: "One chatbot for an international audience, with no per-language setup and no second knowledge base.",
  },
  {
    title: "Name, greeting, colour and instructions",
    body: "Including the free-text system prompt, which is where you set how the chatbot behaves rather than just what it knows.",
  },
  {
    title: "The domain allow-list",
    body: "Restrict the chatbot to hostnames you name. It starts empty, which allows any origin, so fill it in the day you go live.",
  },
  {
    title: "The streaming widget",
    body: "Shadow-DOM isolated, mobile-responsive, token-by-token replies, conversation kept across page navigation.",
  },
  {
    title: "Four live dashboard tiles",
    body: "Conversations, Messages, Fallback rate and Average messages per conversation run for every chatbot with no unlock. The four numbers that tell you whether the chatbot is earning its place are not behind a paywall — most comparison shoppers assume they are.",
  },
  {
    title: "The live usage meter",
    body: "Messages used against your total, with a bar that turns yellow when you are nearly out and red at zero, and a label that switches from Free trial to Message credits the moment you top up.",
  },
  {
    title: "One-click knowledge-base export",
    body: "Download your entire knowledge base as dated Markdown, grouped by category, whenever you want it. This is the free export and it is separate from the paid conversation export — your content is never held hostage.",
  },
];

// Longer-form mechanics, keyed by the real FeatureId. Name and price are read
// from FEATURES so only the description lives here.
const UNLOCK_DETAIL: Record<string, string> = {
  conversations:
    "Every transcript end to end, with three filter tabs — all conversations, the ones containing a fallback, and untagged replies. You can give any individual reply a thumbs-up or thumbs-down, and export the lot as Markdown in one click. The ratings are yours alone; visitors never see a rating control.",
  analytics:
    "A 7-day message trend chart and the top 8 topics pulled out of visitor questions, with common words filtered out so the list reads as subjects rather than 'the' and 'and'. Read the keyword list as the gaps in your knowledge base — it is a writing brief, not a vanity chart.",
  reports:
    "A digest of conversations, replies, fallback count and rate, your positive and negative ratings and the top topics, each measured against the previous week, with a short plain-language summary and one suggested action. You can run it on demand from the dashboard; the designed cadence is a Monday morning email. A week with no activity sends nothing rather than an empty report.",
  learning:
    "It takes the replies you rated badly in the last week, pairs each with the question that triggered it, and drafts up to five new knowledge-base entries to close the gap. Nothing changes until you accept it: every draft is a pending suggestion, accept promotes it to a real entry, dismiss archives it, and where the correct answer is unknowable the draft writes a [FILL IN] placeholder instead of inventing one.",
};

const chatbotUnlocks = FEATURES.filter((feature) => feature.scope === "chatbot");
const extraChatbot = featureById("extra_chatbot");

export const IncludedAndUnlocks = () => (
  <Section
    id="included-vs-addons"
    title="What every chatbot includes, and what costs extra"
    intro="The line between the two is drawn in the code, not in the copy: a new chatbot is created with no unlocks at all, so everything in the first list works on the free trial and nothing in the second does."
    wide
  >
    {/* Block A — genuinely ungated */}
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp(0)}
      className="w-full"
    >
      <h3 className="text-lg font-semibold text-white mb-2 text-center">
        Included with every chatbot, including on the free trial
      </h3>
      <p className="text-sm text-gray-400 text-center mb-8">
        All of this works within your {FREE_TRIAL_MESSAGES} free messages, with
        no card on file.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-7">
        {included.map((item) => (
          <CheckItem key={item.title} title={item.title}>
            {item.body}
          </CheckItem>
        ))}
      </div>
    </motion.div>

    {/* Block B — paid, permanently separated by a rule */}
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp(0.1)}
      className="w-full mt-16 pt-12 border-t border-white/[0.06]"
    >
      <h3 className="text-lg font-semibold text-white mb-2 text-center">
        Optional one-time unlocks
      </h3>
      <p className="text-sm md:text-base text-gray-300 text-center mb-9 max-w-2xl mx-auto leading-relaxed">
        One payment each, per chatbot, permanent. Not subscriptions, and none of
        them are needed for the chatbot to work.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {chatbotUnlocks.map((feature) => (
          <GlassCard key={feature.id}>
            <h4 className="text-base font-semibold text-white mb-2 flex flex-wrap items-center gap-x-3 gap-y-2">
              {feature.name}
              <span className="text-xs font-medium text-gray-400 border border-white/[0.12] rounded-full px-2 py-0.5 whitespace-nowrap">
                {feature.priceLabel} once
              </span>
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              {UNLOCK_DETAIL[feature.id] ?? feature.tagline}
            </p>
          </GlassCard>
        ))}
      </div>

      {/* Account-scoped, so it is called out separately from the four above. */}
      {extraChatbot ? (
        <p className="mt-8 text-sm md:text-base text-gray-400 leading-relaxed text-center max-w-3xl mx-auto">
          One more unlock sits at account level rather than on a single chatbot:{" "}
          <span className="text-white font-medium">{extraChatbot.name}</span>{" "}
          <span className="text-xs font-medium text-gray-400 border border-white/[0.12] rounded-full px-2 py-0.5 whitespace-nowrap">
            {extraChatbot.priceLabel} once
          </span>
          . Every account starts with{" "}
          {BASE_CHATBOT_LIMIT === 1 ? "one chatbot" : `${BASE_CHATBOT_LIMIT} chatbots`}
          , and each slot you add is a separate chatbot with its own knowledge
          base, styling, domain list and credits.
        </p>
      ) : null}
    </motion.div>
  </Section>
);
