"use client";

import { PageHero, StatChip } from "@/components/product-pages/primitives";
import { APP_URL } from "@/lib/marketing/products";
import {
  CREDITS_PER_MESSAGE,
  CREDIT_PACKS,
  FREE_TRIAL_MESSAGES,
} from "@/lib/portal/plans";

// /chatkit hero — the page's ONLY h1 (PageHero renders it).
//
// Every number in the proof chips is derived from lib/portal/plans.ts, the
// billing source of truth, so the hero cannot promise a trial size or a
// per-message rate the portal does not charge.
//
// HONESTY: the trial is the core chatbot only — the four paid unlocks are not
// part of it (feature_unlocks defaults to '{}', migration 017). Nothing here
// says "everything included".

// Cheapest published rate = the largest pack. Read from the data, not typed,
// so re-ordering or re-pricing CREDIT_PACKS updates the chip automatically.
const CHEAPEST_RATE = CREDIT_PACKS.reduce((cheapest, pack) =>
  pack.credits > cheapest.credits ? pack : cheapest
).perCreditLabel;

const CREDIT_PHRASE =
  CREDITS_PER_MESSAGE === 1
    ? "1 credit per reply"
    : `${CREDITS_PER_MESSAGE} credits per reply`;

export const ChatKitHero = () => (
  <PageHero
    eyebrow="ChatKit — live, self-service, no card to start"
    title="An AI Chatbot for Your Website That Answers Only From Your Content"
    subtitle="Write your knowledge base, pick a colour, paste one script tag. ChatKit answers your visitors from what you wrote — in their language — and says the fallback line you chose when the answer is not there."
    primaryCta={{
      href: `${APP_URL}/chatkit`,
      label: `Create your chatbot — ${FREE_TRIAL_MESSAGES} free messages`,
    }}
    secondaryCta={{ href: "#pricing", label: "See what it costs" }}
    note="No credit card, nothing to cancel, no call to book."
  >
    {/* Proof pills only — counts and prices, per the Bent Light Rule. */}
    <ul className="flex flex-wrap items-center justify-center gap-3 list-none">
      <li>
        <StatChip>{FREE_TRIAL_MESSAGES} free messages</StatChip>
      </li>
      <li>
        <StatChip>One line of HTML</StatChip>
      </li>
      <li>
        <StatChip>{CREDIT_PHRASE}</StatChip>
      </li>
      <li>
        <StatChip>from {CHEAPEST_RATE}</StatChip>
      </li>
    </ul>
  </PageHero>
);
