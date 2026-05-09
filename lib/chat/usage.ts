import { createServiceClient } from '@/lib/supabase/service'
import {
  FREE_TRIAL_MESSAGES,
  STARTER_PACK_CREDITS,
  STARTER_PACK_PRICE_CENTS,
  PLANS,
  resolveChatbotTier,
  isSubscriptionActive,
  type EffectiveTier,
  type SubscriptionPlan,
} from '@/lib/portal/plans'

export { FREE_TRIAL_MESSAGES, STARTER_PACK_CREDITS, STARTER_PACK_PRICE_CENTS }

export type ChatbotUsage = {
  allowed: boolean
  used: number
  total_limit: number
  remaining: number
  tier: EffectiveTier
  // Mode determines how UsageMeter labels the meter.
  mode: 'trial' | 'starter' | 'subscription'
  warning: string | null
}

type CustomerSubState = {
  id: string
  subscription_plan: SubscriptionPlan | null
  subscription_status: string | null
  current_period_start: string | null
  current_period_end: string | null
  period_messages_used: number
}

type ChatbotState = {
  id: string
  owner_id: string | null
  messages_used: number
  credits_purchased: number
}

// Internal helper — loads chatbot + (if owned) customer subscription state.
async function loadCapContext(chatbotId: string) {
  const supabase = createServiceClient()
  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('id, owner_id, messages_used, credits_purchased')
    .eq('id', chatbotId)
    .maybeSingle<ChatbotState>()

  if (!chatbot || !chatbot.owner_id) {
    return { chatbot: chatbot ?? null, customer: null }
  }

  // Lazy period rollover for active subs (no-op if not subscribed or period not expired).
  await supabase.rpc('rollover_customer_period', { customer_id_input: chatbot.owner_id })

  const { data: customer } = await supabase
    .from('customers')
    .select('id, subscription_plan, subscription_status, current_period_start, current_period_end, period_messages_used')
    .eq('id', chatbot.owner_id)
    .maybeSingle<CustomerSubState>()

  return { chatbot, customer: customer ?? null }
}

export async function checkChatbotUsage(chatbotId: string): Promise<ChatbotUsage> {
  const { chatbot, customer } = await loadCapContext(chatbotId)

  // Internal/admin chatbots (no owner) bypass billing.
  if (!chatbot || !chatbot.owner_id) {
    return {
      allowed: true,
      used: 0,
      total_limit: Number.POSITIVE_INFINITY,
      remaining: Number.POSITIVE_INFINITY,
      tier: 'free',
      mode: 'trial',
      warning: null,
    }
  }

  const customerSubInput = {
    subscription_plan: customer?.subscription_plan ?? null,
    subscription_status: customer?.subscription_status ?? null,
    current_period_end: customer?.current_period_end ?? null,
  }
  const tier = resolveChatbotTier(customerSubInput, { credits_purchased: chatbot.credits_purchased })

  // Active subscription (or canceled-but-still-in-period) → account-wide monthly cap
  if (customer && customer.subscription_plan && isSubscriptionActive(customerSubInput)) {
    const cap = PLANS[customer.subscription_plan].monthlyMessages ?? 0
    const used = customer.period_messages_used
    const remaining = Math.max(0, cap - used)

    let warning: string | null = null
    if (used >= cap) {
      warning = 'Monthly message cap reached. Upgrade your plan or wait for the next billing cycle.'
    } else if (remaining <= Math.max(50, cap * 0.05)) {
      warning = `${remaining.toLocaleString()} messages left this month.`
    }

    return {
      allowed: used < cap,
      used,
      total_limit: cap,
      remaining,
      tier,
      mode: 'subscription',
      warning,
    }
  }

  // Free or Starter PAYG → per-chatbot lifetime cap
  const totalLimit = FREE_TRIAL_MESSAGES + chatbot.credits_purchased
  const used = chatbot.messages_used
  const remaining = Math.max(0, totalLimit - used)
  const mode: 'trial' | 'starter' = chatbot.credits_purchased > 0 ? 'starter' : 'trial'

  let warning: string | null = null
  if (used >= totalLimit) {
    warning = mode === 'trial'
      ? 'Free trial limit reached. Buy a Starter pack or subscribe to keep your chatbot live.'
      : 'Credits depleted. Buy another Starter pack or subscribe to keep your chatbot live.'
  } else if (remaining <= 5) {
    warning = `Only ${remaining} message${remaining === 1 ? '' : 's'} left.`
  }

  return {
    allowed: used < totalLimit,
    used,
    total_limit: totalLimit,
    remaining,
    tier,
    mode,
    warning,
  }
}

// Increments BOTH the per-chatbot lifetime counter (for analytics) and the
// per-customer period counter (for active subs). Awaiting both keeps Vercel
// from terminating the lambda before the writes land — see commit cb377f1.
export async function incrementChatbotUsage(chatbotId: string): Promise<void> {
  const supabase = createServiceClient()

  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('owner_id')
    .eq('id', chatbotId)
    .maybeSingle()

  const ownerId = chatbot?.owner_id as string | null | undefined

  // Determine whether the owning customer has an active sub (decides whether
  // to also increment the period counter). Active = real status='active' OR
  // canceled-but-period-not-expired.
  let alsoIncrementCustomerPeriod = false
  if (ownerId) {
    const { data: customer } = await supabase
      .from('customers')
      .select('subscription_status, current_period_end')
      .eq('id', ownerId)
      .maybeSingle()
    if (customer) {
      alsoIncrementCustomerPeriod = isSubscriptionActive({
        subscription_status: customer.subscription_status,
        current_period_end: customer.current_period_end,
      })
    }
  }

  // Wrap PostgrestFilterBuilder in Promise.resolve so TS treats it as a real
  // Promise inside Promise.all (supabase-js returns a thenable, not a Promise).
  const writes: Promise<unknown>[] = [
    Promise.resolve(supabase.rpc('increment_chatbot_messages', { chatbot_id_input: chatbotId })),
  ]
  if (alsoIncrementCustomerPeriod && ownerId) {
    writes.push(
      Promise.resolve(supabase.rpc('increment_customer_period_messages', { customer_id_input: ownerId })),
    )
  }

  await Promise.all(writes)
}
