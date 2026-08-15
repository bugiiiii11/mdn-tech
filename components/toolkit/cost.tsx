import Link from "next/link";

import {
  GlassCard,
  PROSE_LINK_CLASS,
  Section,
} from "@/components/product-pages/primitives";
import { MARKETING_PRODUCTS } from "@/lib/marketing/products";
import {
  CREDIT_PACKS,
  FREE_TRIAL_MESSAGES,
  chatbotAllowanceLabel,
  creditsPerReplyLabel,
} from "@/lib/portal/plans";

import { numberWord } from "./catalogue";

// The pricing section. Naming the paid product's entry price is what makes
// "free" believable for a developer who assumes there is a catch.
//
// DATA DISCIPLINE: every digit in part two is read from lib/portal/plans.ts,
// the billing source of truth — trial messages, the per-reply metering phrase,
// the entry pack price and the base chatbot allowance. Nothing is typed by
// hand, so marketing copy cannot drift from what the portal charges.
//
// DELIBERATELY NOT A PRICE TABLE: /chatkit#pricing owns the full credit-pack
// grid and the unlock prices. Republishing them here split the "ChatKit price"
// intent across two indexable pages, so this section quotes the entry price
// only and links to the page that should rank for the rest.
//
// HONESTY CONSTRAINTS (do not regress):
//  - Credits live on chatbots.credits_purchased — per chatbot, ChatKit only.
//    One account is true; one balance is not. Part three says so out loud.
//  - ToolKit's price is stated as a fact, not imported: there is deliberately
//    no ToolKit constant in plans.ts, and that absence is the actual argument.
//  - "Free today, with no billing code path that could change that quietly" —
//    never "free forever, guaranteed", and never extended to another product.
//  - The "only server call" claim is scoped to a SIGNED-OUT visitor: a
//    signed-in one triggers a second Supabase query and carries an auth
//    cookie, so the unscoped version was an overstatement.

export const Cost = () => (
  <Section
    id="cost"
    wide
    title="What this costs, and what M.D.N Tech charges for"
    intro="The directory is free, so the fair question is what pays for it. Here is what the product that does actually charges."
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
          page tree. No account, no email, no card, and no analytics script,
          install counter or tracking anywhere on it. For a signed-out visitor,
          the only server call on the live directory decides whether the top
          bar shows &ldquo;Login&rdquo; or an account menu.
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
        <p className="text-base text-gray-300 leading-relaxed">
          Every new chatbot starts with {FREE_TRIAL_MESSAGES} free messages and
          no card, and an account includes {chatbotAllowanceLabel()}. After the
          trial, replies are metered at {creditsPerReplyLabel()}, and credits
          are priced in packs starting at {CREDIT_PACKS[0].priceLabel}, with no
          subscription. Payment is not live yet — no card is charged today —
          and the full disclosure sits with the price list on the ChatKit page.
        </p>
        <p className="mt-4 text-sm text-gray-400 leading-relaxed">
          The full price list — every pack and every optional one-time unlock —
          lives on one page:{" "}
          <Link href="/chatkit" className={PROSE_LINK_CLASS}>
            see what ChatKit costs
          </Link>
          , including what a chatbot can and cannot do before you pay anything.
        </p>
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
          <Link href="/" className={PROSE_LINK_CLASS}>
            all {numberWord(MARKETING_PRODUCTS.length)} M.D.N Tech products
          </Link>
          , shipped and unshipped, with the same separation between what exists
          and what is still being built.
        </p>
      </GlassCard>
    </div>
  </Section>
);
