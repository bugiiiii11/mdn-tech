'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AlertCircle, CheckCircle2, Sparkles } from 'lucide-react'

const FREE_TRIAL_MESSAGES = 50

type UsageState = {
  used: number
  total_limit: number
  remaining: number
  plan: 'trial' | 'pro'
  credits_purchased: number
}

export function UsageMeter({ chatbotId }: { chatbotId: string }) {
  const supabase = createClient()
  const [state, setState] = useState<UsageState | null>(null)

  useEffect(() => {
    async function fetchUsage() {
      const { data } = await supabase
        .from('chatbots')
        .select('messages_used, credits_purchased, plan')
        .eq('id', chatbotId)
        .maybeSingle()

      if (!data) return
      const credits = data.credits_purchased ?? 0
      const used = data.messages_used ?? 0
      const total_limit = FREE_TRIAL_MESSAGES + credits
      setState({
        used,
        total_limit,
        remaining: Math.max(0, total_limit - used),
        plan: (data.plan ?? 'trial') as 'trial' | 'pro',
        credits_purchased: credits,
      })
    }
    fetchUsage()
  }, [chatbotId, supabase])

  if (!state) {
    return (
      <div className="bg-[#0d0d20]/80 border border-white/[0.06] rounded-xl p-4 backdrop-blur-sm">
        <div className="h-2 bg-gray-800 rounded-full animate-pulse" />
      </div>
    )
  }

  const { used, total_limit, remaining, plan, credits_purchased } = state
  const percentage = total_limit > 0 ? Math.round((used / total_limit) * 100) : 0
  const isLimitReached = used >= total_limit
  const isWarning = remaining <= 5 && !isLimitReached

  const isTrial = plan === 'trial' && credits_purchased === 0
  const label = isTrial ? 'Free trial' : 'Pro credits'

  return (
    <div className="bg-[#0d0d20]/80 border border-white/[0.06] rounded-xl p-4 space-y-3 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isLimitReached ? (
            <AlertCircle className="w-4 h-4 text-red-400" />
          ) : isWarning ? (
            <AlertCircle className="w-4 h-4 text-yellow-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          )}
          <h3 className="text-sm font-medium text-white">{label}</h3>
        </div>
        <span className="text-xs text-gray-400">
          {used.toLocaleString()} / {total_limit.toLocaleString()} messages
        </span>
      </div>

      <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all ${
            isLimitReached ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-green-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {isLimitReached && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <p className="text-xs text-red-300">
            Limit reached. Your chatbot is paused on visitor sites.
          </p>
          <Link
            href={`/portal/chatkit/${chatbotId}/upgrade`}
            className="inline-flex items-center gap-1.5 button-primary text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap"
          >
            <Sparkles className="w-3 h-3" />
            Buy credits
          </Link>
        </div>
      )}
      {isWarning && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <p className="text-xs text-yellow-300">
            Only {remaining} {remaining === 1 ? 'message' : 'messages'} left.
          </p>
          <Link
            href={`/portal/chatkit/${chatbotId}/upgrade`}
            className="text-xs text-purple-300 hover:text-purple-200 transition-colors whitespace-nowrap"
          >
            Buy credits →
          </Link>
        </div>
      )}
      {!isLimitReached && !isWarning && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <p className="text-xs text-gray-500">
            {isTrial
              ? 'Free trial — credits never expire after upgrade.'
              : 'Pro credits never expire.'}
          </p>
          <Link
            href={`/portal/chatkit/${chatbotId}/upgrade`}
            className="text-xs text-gray-400 hover:text-purple-300 transition-colors whitespace-nowrap"
          >
            Buy more →
          </Link>
        </div>
      )}
    </div>
  )
}
