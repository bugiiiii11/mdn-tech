import { createServiceClient } from '@/lib/supabase/service'
import { FREE_TRIAL_MESSAGES, CREDITS_PER_MESSAGE } from '@/lib/portal/plans'
import { creditBalance, spendCredits } from '@/lib/portal/credits'

export { FREE_TRIAL_MESSAGES }

// Account-level credit metering (migration 022 / launch plan 2.1):
//  - The free trial is PER CHATBOT: the first FREE_TRIAL_MESSAGES replies cost
//    nothing (chatbots.messages_used is the lifetime counter).
//  - Beyond the trial, each reply spends CREDITS_PER_MESSAGE from the OWNER'S
//    ACCOUNT balance in credits_ledger — one balance across all chatbots.
//  - chatbots.credits_purchased is retired legacy state (rolled up by 022);
//    nothing here reads or writes it any more.

export type ChatbotUsage = {
  allowed: boolean
  // Meter labelling: internal bots are unmetered here, trial bots show trial
  // progress, everything else shows the account credit balance.
  mode: 'internal' | 'trial' | 'credits'
  trialUsed: number
  trialLimit: number
  // Account balance (also fetched during trial so the meter can show it).
  balance: number
  warning: string | null
}

// Meter warning threshold — the configurable low-balance EMAIL threshold
// (launch plan 2.7g) is a separate, later build.
const LOW_BALANCE_WARNING = 50

type ChatbotState = {
  id: string
  owner_id: string | null
  messages_used: number
}

export async function checkChatbotUsage(chatbotId: string): Promise<ChatbotUsage> {
  const supabase = createServiceClient()
  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('id, owner_id, messages_used')
    .eq('id', chatbotId)
    .maybeSingle<ChatbotState>()

  // Internal/admin chatbots (no owner) have no balance to draw down, so there
  // is nothing for this function to meter. They are NOT unlimited: the public
  // route caps them with INTERNAL_BOT_DAILY_RULE and refuses to serve them at
  // all unless allowed_domains is set (see the chat message route). Before
  // that, a leaked owner-less chatbot id was free unlimited Claude.
  if (!chatbot || !chatbot.owner_id) {
    return {
      allowed: true,
      mode: 'internal',
      trialUsed: 0,
      trialLimit: FREE_TRIAL_MESSAGES,
      balance: 0,
      warning: null,
    }
  }

  const trialUsed = Math.min(chatbot.messages_used, FREE_TRIAL_MESSAGES)
  const inTrial = chatbot.messages_used < FREE_TRIAL_MESSAGES
  const balance = await creditBalance(chatbot.owner_id)

  if (inTrial) {
    const trialLeft = FREE_TRIAL_MESSAGES - chatbot.messages_used
    // No warning while a funded balance is ready to take over from the trial.
    const warning =
      trialLeft <= 5 && balance < LOW_BALANCE_WARNING
        ? `Only ${trialLeft} free trial message${trialLeft === 1 ? '' : 's'} left. Buy credits to keep your chatbot live.`
        : null
    return {
      allowed: true,
      mode: 'trial',
      trialUsed,
      trialLimit: FREE_TRIAL_MESSAGES,
      balance,
      warning,
    }
  }

  const allowed = balance >= CREDITS_PER_MESSAGE
  let warning: string | null = null
  if (!allowed) {
    warning = 'Credits depleted. Buy more credits to keep your chatbot live.'
  } else if (balance <= LOW_BALANCE_WARNING) {
    warning = `Only ${balance.toLocaleString('en-US')} credit${balance === 1 ? '' : 's'} left on your account.`
  }

  return {
    allowed,
    mode: 'credits',
    trialUsed,
    trialLimit: FREE_TRIAL_MESSAGES,
    balance,
    warning,
  }
}

// Records one answered visitor message: bumps the per-chatbot lifetime counter
// (atomic; awaited so Vercel doesn't terminate the lambda before the write
// lands — see commit cb377f1) and, past the free trial, spends
// CREDITS_PER_MESSAGE from the owner's account ledger.
export async function incrementChatbotUsage(chatbotId: string): Promise<void> {
  const supabase = createServiceClient()
  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('owner_id, messages_used')
    .eq('id', chatbotId)
    .maybeSingle<{ owner_id: string | null; messages_used: number }>()

  await supabase.rpc('increment_chatbot_messages', { chatbot_id_input: chatbotId })

  // messages_used was read BEFORE the increment: reply N is free while
  // N < FREE_TRIAL_MESSAGES, exactly matching the 022 roll-up formula.
  if (chatbot?.owner_id && chatbot.messages_used >= FREE_TRIAL_MESSAGES) {
    const spend = await spendCredits({
      customerId: chatbot.owner_id,
      amount: CREDITS_PER_MESSAGE,
      kind: 'spend_message',
      chatbotId,
    })
    if (!spend.ok) {
      // The pre-reply check passed but concurrent traffic drained the balance
      // after the reply went out — this one rides free rather than clawing
      // back a delivered answer. Rare and self-limiting (the next check blocks).
      console.warn(`[usage] balance drained mid-request for chatbot ${chatbotId}`)
    }
  }
}
