import Link from 'next/link'
import { AlertCircle, CheckCircle2, Coins, Sparkles } from 'lucide-react'
import type { ChatbotUsage } from '@/lib/chat/usage'

// Two real states (mode 'internal' is never rendered in the portal — internal
// bots have no owner page): the per-chatbot free trial shows a progress bar;
// after that the meter shows the ACCOUNT credit balance the bot draws from.
export function UsageMeter({ chatbotId, usage }: { chatbotId: string; usage: ChatbotUsage }) {
  const { mode, trialUsed, trialLimit, balance, allowed, warning } = usage

  const upgradeHref = `/portal/chatkit/${chatbotId}/upgrade`
  const blocked = !allowed

  const iconColor = blocked ? 'text-red-400' : warning ? 'text-yellow-400' : 'text-green-400'

  return (
    <div className="bg-[#0d0d20]/80 border border-white/[0.06] rounded-xl p-4 space-y-3 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {blocked || warning ? (
            <AlertCircle className={`w-4 h-4 ${iconColor}`} />
          ) : (
            <CheckCircle2 className={`w-4 h-4 ${iconColor}`} />
          )}
          <h3 className="text-sm font-medium text-white">
            {mode === 'trial' ? 'Free trial' : 'Account credits'}
          </h3>
        </div>
        <span className="text-xs text-gray-400">
          {mode === 'trial' ? (
            <>
              {trialUsed.toLocaleString()} / {trialLimit.toLocaleString()} free messages
            </>
          ) : (
            <span className="inline-flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-purple-300" />
              {balance.toLocaleString()} credits
            </span>
          )}
        </span>
      </div>

      {mode === 'trial' && (
        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all"
            style={{ width: `${Math.min(Math.round((trialUsed / trialLimit) * 100), 100)}%` }}
          />
        </div>
      )}

      {blocked ? (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <p className="text-xs text-red-300">
            Credits depleted. Your chatbot is paused on visitor sites.
          </p>
          <Link
            href={upgradeHref}
            className="inline-flex min-h-[24px] items-center gap-1.5 button-primary text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap"
          >
            <Sparkles className="w-3 h-3" />
            Buy credits
          </Link>
        </div>
      ) : warning ? (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <p className="text-xs text-yellow-300">{warning}</p>
          <Link
            href={upgradeHref}
            className="inline-flex min-h-[24px] items-center text-xs text-purple-300 hover:text-purple-200 transition-colors whitespace-nowrap"
          >
            Buy credits →
          </Link>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <p className="text-xs text-gray-500">
            {mode === 'trial'
              ? `Free trial first — then one credit per reply from your account balance (${balance.toLocaleString()} credits ready).`
              : 'One credit per reply, drawn from your account balance.'}
          </p>
          <Link
            href={upgradeHref}
            className="inline-flex min-h-[24px] items-center text-xs text-gray-400 hover:text-purple-300 transition-colors whitespace-nowrap"
          >
            Buy credits →
          </Link>
        </div>
      )}
    </div>
  )
}
