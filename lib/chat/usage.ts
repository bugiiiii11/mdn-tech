import { createServiceClient } from '@/lib/supabase/service'
import {
  FREE_TRIAL_MESSAGES,
  CREDITS_PER_MESSAGE,
  STARTER_PACK_CREDITS,
  STARTER_PACK_PRICE_CENTS,
} from '@/lib/portal/plans'

export { FREE_TRIAL_MESSAGES, STARTER_PACK_CREDITS, STARTER_PACK_PRICE_CENTS }

export type ChatbotUsage = {
  allowed: boolean
  used: number
  total_limit: number
  remaining: number
  // Mode determines how UsageMeter labels the meter.
  mode: 'trial' | 'credits'
  warning: string | null
}

type ChatbotState = {
  id: string
  owner_id: string | null
  messages_used: number
  credits_purchased: number
}

// Messages a chatbot may answer: the free trial plus whatever its purchased
// credits buy at CREDITS_PER_MESSAGE. Credits are per-chatbot and never expire.
function messageAllowance(creditsPurchased: number): number {
  return FREE_TRIAL_MESSAGES + Math.floor(creditsPurchased / CREDITS_PER_MESSAGE)
}

export async function checkChatbotUsage(chatbotId: string): Promise<ChatbotUsage> {
  const supabase = createServiceClient()
  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('id, owner_id, messages_used, credits_purchased')
    .eq('id', chatbotId)
    .maybeSingle<ChatbotState>()

  // Internal/admin chatbots (no owner) have no credit balance to draw down, so
  // there is nothing for this function to meter. They are NOT unlimited: the
  // public route caps them with INTERNAL_BOT_DAILY_RULE and refuses to serve
  // them at all unless allowed_domains is set (see the chat message route).
  // Before that, a leaked owner-less chatbot id was free unlimited Claude.
  if (!chatbot || !chatbot.owner_id) {
    return {
      allowed: true,
      used: 0,
      total_limit: Number.POSITIVE_INFINITY,
      remaining: Number.POSITIVE_INFINITY,
      mode: 'trial',
      warning: null,
    }
  }

  // Per-chatbot lifetime allowance: free trial + purchased credits.
  const totalLimit = messageAllowance(chatbot.credits_purchased)
  const used = chatbot.messages_used
  const remaining = Math.max(0, totalLimit - used)
  const mode: 'trial' | 'credits' = chatbot.credits_purchased > 0 ? 'credits' : 'trial'

  let warning: string | null = null
  if (used >= totalLimit) {
    warning = mode === 'trial'
      ? 'Free trial limit reached. Buy credits to keep your chatbot live.'
      : 'Credits depleted. Buy more credits to keep your chatbot live.'
  } else if (remaining <= 5) {
    warning = `Only ${remaining} message${remaining === 1 ? '' : 's'} left.`
  }

  return {
    allowed: used < totalLimit,
    used,
    total_limit: totalLimit,
    remaining,
    mode,
    warning,
  }
}

// Atomically increments the per-chatbot lifetime message counter. Awaited so
// Vercel doesn't terminate the lambda before the write lands — see commit cb377f1.
export async function incrementChatbotUsage(chatbotId: string): Promise<void> {
  const supabase = createServiceClient()
  await supabase.rpc('increment_chatbot_messages', { chatbot_id_input: chatbotId })
}
