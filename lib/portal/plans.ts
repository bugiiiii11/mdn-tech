// Single source of truth for ChatKit billing.
//
// Model (Session 47): credits fuel messages, features are one-time unlocks.
//  - Every chatbot gets a free message trial, then the owner tops up CREDITS.
//    Each visitor message the bot answers costs CREDITS_PER_MESSAGE.
//  - Premium capabilities (conversation viewer, analytics, learning, reports,
//    extra chatbots) are ONE-TIME UNLOCKS, not subscription tiers. Each is a
//    single payment that permanently switches the feature on.
//  - There are NO monthly subscriptions. The old Free/Starter/Pro/Max tiers and
//    the subscription_* columns are retired; per-chatbot `feature_unlocks`
//    (jsonb) and per-account `extra_chatbot_slots` (int) replace them.
//
// Update prices / credits / feature costs here; the rest of the portal reads
// from these constants so labels, gates, and cap checks stay in sync.

// --- Credits -----------------------------------------------------------------

export const FREE_TRIAL_MESSAGES = 30

// How many credits one visitor message (one bot reply) burns. Kept at 1 so
// "credits" and "messages" read 1:1 for customers; raise it to charge more per
// message without touching the metering code.
export const CREDITS_PER_MESSAGE = 1

export type CreditPack = {
  id: 'starter' | 'growth' | 'scale'
  name: string
  credits: number
  priceCents: number
  priceLabel: string
  perCreditLabel: string   // "$0.058 / msg"
  description: string
  highlight?: boolean      // "Best value" card treatment
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
    highlight: true,
  },
  {
    id: 'scale',
    name: 'Scale',
    credits: 10000,
    priceCents: 29900,
    priceLabel: '$299',
    perCreditLabel: '3.0¢ / message',
    description: 'For high-traffic sites and busy inboxes.',
  },
]

export function creditPackById(id: string): CreditPack | undefined {
  return CREDIT_PACKS.find((p) => p.id === id)
}

// Legacy aliases — the credit-purchase route and usage checks still refer to a
// "default" pack. Points at the Starter pack so existing callers keep working.
export const STARTER_PACK_CREDITS = CREDIT_PACKS[0].credits
export const STARTER_PACK_PRICE_CENTS = CREDIT_PACKS[0].priceCents

// --- Feature add-ons (one-time unlocks) --------------------------------------

export type FeatureId =
  | 'conversations'   // conversation viewer + markdown export (built)
  | 'analytics'       // message trends + top-keyword extraction (built)
  | 'learning'        // auto-improve from rated conversations (NOT built yet)
  | 'reports'         // weekly performance report (NOT built yet)
  | 'extra_chatbot'   // +1 chatbot slot (account-scoped)

export type FeatureStatus = 'available' | 'coming-soon'
export type FeatureScope = 'chatbot' | 'account'

export type FeatureDef = {
  id: FeatureId
  name: string
  tagline: string
  priceCents: number
  priceLabel: string
  status: FeatureStatus
  scope: FeatureScope
  benefits: string[]
}

export const FEATURES: FeatureDef[] = [
  {
    id: 'conversations',
    name: 'Conversation viewer + export',
    tagline: 'Read every conversation and download the full transcript.',
    priceCents: 1900,
    priceLabel: '$19',
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
    priceCents: 2900,
    priceLabel: '$29',
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
    priceCents: 4900,
    priceLabel: '$49',
    status: 'coming-soon',
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
    priceCents: 3900,
    priceLabel: '$39',
    status: 'coming-soon',
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
    priceCents: 4900,
    priceLabel: '$49',
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
