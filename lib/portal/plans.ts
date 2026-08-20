// Single source of truth for ChatKit billing.
//
// Model (Session 47, credit bank Session 72 / launch plan Phase 2):
//  - Credits are the single platform currency, held at ACCOUNT level in the
//    append-only `credits_ledger` (migration 022). Money only ever buys credit
//    packs; everything else is an internal ledger spend.
//  - Every chatbot gets a free message trial (per chatbot), then each visitor
//    reply spends CREDITS_PER_MESSAGE from the account balance.
//  - Premium capabilities (conversation viewer, analytics, learning, reports,
//    extra chatbots) are ONE-TIME UNLOCKS paid in CREDITS, not money. Each
//    spend permanently switches the feature on.
//  - There are NO monthly subscriptions. Per-chatbot `feature_unlocks` (jsonb)
//    and per-account `extra_chatbot_slots` (int) record what is unlocked.
//
// Pack prices + unlock credit costs were CONFIRMED 2026-08-06 (launch plan
// 2.4/2.4b) -- do not change without Martin. Update constants here; the rest
// of the portal and the marketing pages read from them.

// --- Credits -----------------------------------------------------------------

export const FREE_TRIAL_MESSAGES = 30

// How many credits one visitor message (one bot reply) burns. Kept at 1 so
// "credits" and "messages" read 1:1 for customers; raise it to charge more per
// message without touching the metering code.
export const CREDITS_PER_MESSAGE = 1

export type CreditPack = {
  id: 'starter' | 'growth' | 'scale' | 'enterprise'
  name: string
  credits: number
  priceCents: number
  priceLabel: string
  perCreditLabel: string   // "$0.058 / msg"
  description: string
  highlight?: boolean      // "Best value" card treatment
  // Purchasable via the API but never rendered on pricing surfaces. Enterprise
  // stays hidden until demand shows up (launch plan 2.4) — flip this off to
  // launch it, no other change needed.
  hidden?: boolean
}

export const CREDIT_PACKS: CreditPack[] = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 500,
    priceCents: 2900,
    priceLabel: '$29',
    perCreditLabel: '5.8¢ / message',
    description: 'Top up a low-traffic chatbot.',
  },
  {
    id: 'growth',
    name: 'Growth',
    credits: 2500,
    priceCents: 9900,
    priceLabel: '$99',
    perCreditLabel: '4.0¢ / message',
    description: 'For a site with steady support volume.',
  },
  {
    id: 'scale',
    name: 'Scale',
    credits: 10000,
    priceCents: 29900,
    priceLabel: '$299',
    perCreditLabel: '3.0¢ / message',
    description: 'For high-traffic sites and busy inboxes.',
    highlight: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    credits: 40000,
    priceCents: 99900,
    priceLabel: '$999',
    perCreditLabel: '2.5¢ / message',
    description: 'Volume pricing for serious traffic.',
    hidden: true,
  },
]

/** The packs pricing surfaces may render (Enterprise stays hidden). */
export function visibleCreditPacks(): CreditPack[] {
  return CREDIT_PACKS.filter((p) => !p.hidden)
}

export function creditPackById(id: string): CreditPack | undefined {
  return CREDIT_PACKS.find((p) => p.id === id)
}

// --- Feature add-ons (one-time unlocks) --------------------------------------

export type FeatureId =
  | 'conversations'   // conversation viewer + markdown export (built)
  | 'analytics'       // message trends + top-keyword extraction (built)
  | 'learning'        // auto-improve from rated conversations (built S48)
  | 'reports'         // weekly performance report + email digest (built S49)
  | 'extra_chatbot'   // +1 chatbot slot (account-scoped)

export type FeatureStatus = 'available' | 'coming-soon'
export type FeatureScope = 'chatbot' | 'account'

export type FeatureDef = {
  id: FeatureId
  name: string
  tagline: string
  // One-time unlock cost in CREDITS (ledger spend, kind 'spend_unlock').
  // Reference rate: Growth pack ~4¢/credit — confirmed 2026-08-06, launch
  // plan 2.4b. A Starter pack buys exactly one small unlock; Growth is the
  // natural real entry point.
  creditCost: number
  creditLabel: string      // "500 credits"
  status: FeatureStatus
  scope: FeatureScope
  benefits: string[]
}

export const FEATURES: FeatureDef[] = [
  {
    id: 'conversations',
    name: 'Conversation viewer + export',
    tagline: 'Read every conversation and download the full transcript.',
    creditCost: 500,
    creditLabel: '500 credits',
    status: 'available',
    scope: 'chatbot',
    benefits: [
      'Browse every visitor conversation',
      'Filter fallbacks and untagged replies',
      'One-click Markdown export',
    ],
  },
  {
    id: 'analytics',
    name: 'Trends + keyword analytics',
    tagline: 'See message trends and what visitors ask about most.',
    creditCost: 750,
    creditLabel: '750 credits',
    status: 'available',
    scope: 'chatbot',
    benefits: [
      '7-day message trend chart',
      'Top-keyword extraction',
      'Spot gaps in your knowledge base',
    ],
  },
  {
    id: 'learning',
    name: 'Auto-learning',
    tagline: 'The chatbot improves itself from rated conversations.',
    creditCost: 1250,
    creditLabel: '1,250 credits',
    status: 'available',
    scope: 'chatbot',
    benefits: [
      'Learns from thumbs-up / thumbs-down',
      'Suggests knowledge-base additions',
      'Weekly auto-improvement pass',
    ],
  },
  {
    id: 'reports',
    name: 'Weekly reports',
    tagline: 'A performance digest in your inbox every week.',
    creditCost: 1000,
    creditLabel: '1,000 credits',
    status: 'available',
    scope: 'chatbot',
    benefits: [
      'Weekly email summary',
      'Volume, fallback rate, top topics',
      'Week-over-week deltas',
    ],
  },
  {
    id: 'extra_chatbot',
    name: 'Additional chatbot',
    tagline: 'Add another branded chatbot to your account.',
    creditCost: 1250,
    creditLabel: '1,250 credits',
    status: 'available',
    scope: 'account',
    benefits: [
      '+1 chatbot slot',
      'Separate knowledge base and widget',
      'Stack as many as you need',
    ],
  },
]

export function featureById(id: string): FeatureDef | undefined {
  return FEATURES.find((f) => f.id === id)
}

// Per-chatbot unlock map, stored in chatbots.feature_unlocks (jsonb).
export type FeatureUnlocks = Partial<Record<FeatureId, boolean>>

export function isFeatureUnlocked(
  unlocks: FeatureUnlocks | null | undefined,
  id: FeatureId
): boolean {
  return unlocks?.[id] === true
}

// --- Chatbot slots -----------------------------------------------------------

export const BASE_CHATBOT_LIMIT = 1

// How many chatbots the account may create: the base allowance plus any
// purchased "additional chatbot" slots (customers.extra_chatbot_slots).
export function chatbotLimit(extraSlots: number | null | undefined): number {
  return BASE_CHATBOT_LIMIT + Math.max(0, extraSlots ?? 0)
}

// --- Prose labels --------------------------------------------------------------
//
// The two allowance phrases the marketing surfaces kept retyping as inline
// ternaries (ten copies at the last count, already diverging between digits and
// spelled numbers). Deciding the wording here — next to the constants it reads —
// means raising BASE_CHATBOT_LIMIT or CREDITS_PER_MESSAGE reworks every surface
// the same way. Call sites should migrate to these instead of adding copy #11.

// Small counts read as prose ("two chatbots"), larger ones stay digits.
function spellCount(count: number): string {
  const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
  return words[count] ?? String(count)
}

/** "one chatbot" / "two chatbots" — the base allowance as prose. */
export function chatbotAllowanceLabel(): string {
  return BASE_CHATBOT_LIMIT === 1
    ? 'one chatbot'
    : `${spellCount(BASE_CHATBOT_LIMIT)} chatbots`
}

/** "one credit per reply" / "two credits per reply" — the metering phrase. */
export function creditsPerReplyLabel(): string {
  return CREDITS_PER_MESSAGE === 1
    ? 'one credit per reply'
    : `${spellCount(CREDITS_PER_MESSAGE)} credits per reply`
}
