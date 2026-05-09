// Single source of truth for ChatKit pricing tiers.
// Update prices / caps / chatbot limits here; the rest of the portal reads
// from these constants so labels, gates, and cap checks stay in sync.

export type SubscriptionPlan = 'pro' | 'max'
export type EffectiveTier = 'free' | 'starter' | 'pro' | 'max'

export const FREE_TRIAL_MESSAGES = 30

// Starter is a one-time PAYG credit pack — not a subscription.
export const STARTER_PACK_CREDITS = 500
export const STARTER_PACK_PRICE_CENTS = 2900

export type PlanDefinition = {
  id: EffectiveTier
  name: string
  priceCents: number          // 0 for free, sticker price for paid
  priceLabel: string          // "$29", "$99/mo", "$299/mo"
  chatbotLimit: number
  monthlyMessages: number | null   // null = no monthly cap (free/starter use per-chatbot lifetime)
  trialMessages: number | null     // free trial only
  isSubscription: boolean
  isPayg: boolean
  features: string[]
  description: string
}

export const PLANS: Record<EffectiveTier, PlanDefinition> = {
  free: {
    id: 'free',
    name: 'Free',
    priceCents: 0,
    priceLabel: '$0',
    chatbotLimit: 1,
    monthlyMessages: null,
    trialMessages: FREE_TRIAL_MESSAGES,
    isSubscription: false,
    isPayg: false,
    features: [
      `${FREE_TRIAL_MESSAGES} trial messages`,
      'Knowledge base — unlimited entries',
      'Embed on any site',
      'Basic dashboard',
    ],
    description: 'Try one chatbot end-to-end before committing.',
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    priceCents: STARTER_PACK_PRICE_CENTS,
    priceLabel: '$29',
    chatbotLimit: 1,
    monthlyMessages: null,
    trialMessages: null,
    isSubscription: false,
    isPayg: true,
    features: [
      `${STARTER_PACK_CREDITS} message credits`,
      'Credits never expire',
      'One-time payment, no subscription',
      'Conversation viewer + export',
    ],
    description: 'Top up a single chatbot. No recurring billing.',
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    priceCents: 9900,
    priceLabel: '$99/mo',
    chatbotLimit: 2,
    monthlyMessages: 5000,
    trialMessages: null,
    isSubscription: true,
    isPayg: false,
    features: [
      'Up to 2 chatbots',
      '5,000 messages / month',
      'Conversation viewer + export',
      'Trends + keyword analytics',
    ],
    description: 'For growing sites that have outgrown the trial.',
  },
  max: {
    id: 'max',
    name: 'Max',
    priceCents: 29900,
    priceLabel: '$299/mo',
    chatbotLimit: 3,
    monthlyMessages: 25000,
    trialMessages: null,
    isSubscription: true,
    isPayg: false,
    features: [
      'Up to 3 chatbots',
      '25,000 messages / month',
      'Everything in Pro',
      'Weekly auto-reports',
      'Chatbot learning (auto-improve)',
    ],
    description: 'For high-traffic sites and teams managing multiple brands.',
  },
}

const TIER_ORDER: EffectiveTier[] = ['free', 'starter', 'pro', 'max']

export function tierAtLeast(tier: EffectiveTier, minimum: EffectiveTier): boolean {
  return TIER_ORDER.indexOf(tier) >= TIER_ORDER.indexOf(minimum)
}

type CustomerSubInput = {
  subscription_plan: SubscriptionPlan | null
  subscription_status: string | null
  current_period_end: string | null
}

// Stripe convention: a canceled subscription still grants benefits until
// current_period_end (the customer paid for the cycle). Only after the
// period expires does access revert to Free.
export function isSubscriptionActive(customer: {
  subscription_status: string | null
  current_period_end: string | null
}): boolean {
  if (customer.subscription_status === 'active') return true
  if (customer.subscription_status === 'canceled' && customer.current_period_end) {
    return new Date(customer.current_period_end).getTime() > Date.now()
  }
  return false
}

// Resolve the effective tier for one chatbot in one account.
// - active (or canceled-but-still-in-period) sub on the account wins
// - else, credits_purchased > 0 on this chatbot bumps it to 'starter'
// - else 'free'
export function resolveChatbotTier(
  customer: CustomerSubInput,
  chatbot: { credits_purchased: number | null }
): EffectiveTier {
  if (customer.subscription_plan && isSubscriptionActive(customer)) {
    return customer.subscription_plan
  }
  if ((chatbot.credits_purchased ?? 0) > 0) {
    return 'starter'
  }
  return 'free'
}

// Account-level tier (no chatbot context — used for chatbot creation gates,
// settings page, account-scoped upgrade UI).
export function resolveAccountTier(customer: CustomerSubInput): EffectiveTier {
  if (customer.subscription_plan && isSubscriptionActive(customer)) {
    return customer.subscription_plan
  }
  return 'free'
}

// Feature gates used in UI + API:
//   conversations    — Starter+
//   analytics        — Pro+
//   learning         — Max only
export function hasFeature(
  tier: EffectiveTier,
  feature: 'conversations' | 'analytics' | 'learning' | 'reports'
): boolean {
  switch (feature) {
    case 'conversations': return tierAtLeast(tier, 'starter')
    case 'analytics':     return tierAtLeast(tier, 'pro')
    case 'learning':      return tier === 'max'
    case 'reports':       return tier === 'max'
  }
}
