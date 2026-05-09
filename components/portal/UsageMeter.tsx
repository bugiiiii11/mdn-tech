import Link from 'next/link'
import { AlertCircle, CheckCircle2, Sparkles } from 'lucide-react'
import type { ChatbotUsage } from '@/lib/chat/usage'

const TIER_LABELS: Record<ChatbotUsage['mode'], string> = {
  trial: 'Free trial',
  starter: 'Starter credits',
  subscription: 'Monthly usage',
}

export function UsageMeter({ chatbotId, usage }: { chatbotId: string; usage: ChatbotUsage }) {
  const { used, total_limit, remaining, mode, tier } = usage
  const percentage = total_limit > 0 ? Math.round((used / total_limit) * 100) : 0
  const isLimitReached = used >= total_limit
  const isWarning =
    !isLimitReached &&
    (mode === 'subscription' ? remaining <= Math.max(50, total_limit * 0.05) : remaining <= 5)

  const isSubscription = mode === 'subscription'
  const upgradeHref = isSubscription ? '/portal/upgrade' : `/portal/chatkit/${chatbotId}/upgrade`
  const upgradeLabel = isSubscription
    ? tier === 'max' ? 'Manage plan' : 'Upgrade plan'
    : 'Buy credits'

  const meterTone = isLimitReached
    ? 'bg-red-500'
    : isWarning
      ? 'bg-yellow-500'
      : 'bg-green-500'

  const iconColor = isLimitReached
    ? 'text-red-400'
    : isWarning
      ? 'text-yellow-400'
      : 'text-green-400'

  return (
    <div className="bg-[#0d0d20]/80 border border-white/[0.06] rounded-xl p-4 space-y-3 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isLimitReached || isWarning ? (
            <AlertCircle className={`w-4 h-4 ${iconColor}`} />
          ) : (
            <CheckCircle2 className={`w-4 h-4 ${iconColor}`} />
          )}
          <h3 className="text-sm font-medium text-white">{TIER_LABELS[mode]}</h3>
        </div>
        <span className="text-xs text-gray-400">
          {used.toLocaleString()} / {total_limit.toLocaleString()}{' '}
          {isSubscription ? 'this month' : 'messages'}
        </span>
      </div>

      <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all ${meterTone}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {isLimitReached && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <p className="text-xs text-red-300">
            {isSubscription
              ? 'Monthly cap reached. Upgrade to keep your chatbots live this cycle.'
              : 'Limit reached. Your chatbot is paused on visitor sites.'}
          </p>
          <Link
            href={upgradeHref}
            className="inline-flex items-center gap-1.5 button-primary text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap"
          >
            <Sparkles className="w-3 h-3" />
            {upgradeLabel}
          </Link>
        </div>
      )}
      {isWarning && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <p className="text-xs text-yellow-300">
            {isSubscription
              ? `${remaining.toLocaleString()} messages left this month.`
              : `Only ${remaining.toLocaleString()} ${remaining === 1 ? 'message' : 'messages'} left.`}
          </p>
          <Link
            href={upgradeHref}
            className="text-xs text-purple-300 hover:text-purple-200 transition-colors whitespace-nowrap"
          >
            {upgradeLabel} →
          </Link>
        </div>
      )}
      {!isLimitReached && !isWarning && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <p className="text-xs text-gray-500">
            {mode === 'trial' && 'Free trial — credits never expire after upgrade.'}
            {mode === 'starter' && 'Starter credits never expire.'}
            {mode === 'subscription' && 'Cap resets at the end of the billing cycle.'}
          </p>
          <Link
            href={upgradeHref}
            className="text-xs text-gray-400 hover:text-purple-300 transition-colors whitespace-nowrap"
          >
            {upgradeLabel} →
          </Link>
        </div>
      )}
    </div>
  )
}
