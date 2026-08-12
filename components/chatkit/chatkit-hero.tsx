import {
  PageHero,
  StatChip,
  type Crumb,
} from "@/components/product-pages/primitives";
import { APP_URL } from "@/lib/marketing/products";
import {
  CREDIT_PACKS,
  FREE_TRIAL_MESSAGES,
  creditsPerReplyLabel,
} from "@/lib/portal/plans";

// /chatkit hero — the page's ONLY h1 (PageHero renders it), plus the visible
// breadcrumb, which PageHero draws from CHATKIT_TRAIL via its `trail` prop.
//
// No 'use client' here on purpose: this file is pure composition — no hooks,
// no motion, no browser API — so it stays a server component and PageHero
// carries the client boundary on its own.
//
// Every number in the proof chips is derived from lib/portal/plans.ts, the
// billing source of truth, so the hero cannot promise a trial size or a
// per-message rate the portal does not charge.
//
// HONESTY: the trial is the core chatbot only — the four paid unlocks are not
// part of it (feature_unlocks defaults to '{}', migration 017). Nothing here
// says "everything included".

// The visible trail AND the page's BreadcrumbList JSON-LD are built from this
// one array (breadcrumbListSchema in app/(marketing)/chatkit/page.tsx), so the
// schema can never describe a trail the visitor cannot see. The final crumb is
// the current page and carries no href.
export const CHATKIT_TRAIL: Crumb[] = [
  { label: "Home", href: "/" },
  { label: "ChatKit" },
];

// Cheapest published rate = the largest pack. Read from the data, not typed,
// so re-ordering or re-pricing CREDIT_PACKS updates the chip automatically.
const CHEAPEST_RATE = CREDIT_PACKS.reduce((cheapest, pack) =>
  pack.credits > cheapest.credits ? pack : cheapest
).perCreditLabel;

export const ChatKitHero = () => (
  <PageHero
    trail={CHATKIT_TRAIL}
    eyebrow="ChatKit — live, self-service, no card to start"
    title="An AI Chatbot for Your Website That Answers Only From Your Content"
    subtitle="Write your knowledge base, pick a colour, paste one script tag. ChatKit answers your visitors from what you wrote — in their language — and says the fallback line you chose when the answer is not there."
    primaryCta={{
      href: `${APP_URL}/chatkit`,
      // Short enough to stay on one line inside the pill at 360px — the note
      // and the free-messages chip below carry the trial size.
      label: "Create your chatbot free",
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
        <StatChip>{creditsPerReplyLabel()}</StatChip>
      </li>
      <li>
        <StatChip>from {CHEAPEST_RATE}</StatChip>
      </li>
    </ul>
  </PageHero>
);
