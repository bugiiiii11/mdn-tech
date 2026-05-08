import { createServiceClient } from '@/lib/supabase/service'

export const FREE_TRIAL_MESSAGES = 50
export const PRO_PACK_CREDITS = 1000
export const PRO_PACK_PRICE_CENTS = 1900

export type ChatbotUsage = {
  allowed: boolean
  used: number
  total_limit: number
  remaining: number
  plan: 'trial' | 'pro'
  credits_purchased: number
  warning: string | null
}

export async function checkChatbotUsage(chatbotId: string): Promise<ChatbotUsage> {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('chatbots')
    .select('messages_used, credits_purchased, plan')
    .eq('id', chatbotId)
    .maybeSingle()

  const used = data?.messages_used ?? 0
  const credits = data?.credits_purchased ?? 0
  const plan = (data?.plan ?? 'trial') as 'trial' | 'pro'
  const total_limit = FREE_TRIAL_MESSAGES + credits
  const remaining = Math.max(0, total_limit - used)

  let warning: string | null = null
  if (used >= total_limit) {
    warning = plan === 'trial'
      ? 'Free trial limit reached. Buy a Pro pack to keep your chatbot live.'
      : 'Credits depleted. Buy another pack to keep your chatbot live.'
  } else if (remaining <= 5) {
    warning = `Only ${remaining} message${remaining === 1 ? '' : 's'} left.`
  }

  return {
    allowed: used < total_limit,
    used,
    total_limit,
    remaining,
    plan,
    credits_purchased: credits,
    warning,
  }
}

export async function incrementChatbotUsage(chatbotId: string): Promise<void> {
  const supabase = createServiceClient()
  await supabase.rpc('increment_chatbot_messages', { chatbot_id_input: chatbotId })
}
