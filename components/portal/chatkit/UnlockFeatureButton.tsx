'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, Lock, Check } from 'lucide-react'

type Props = {
  featureId: string
  label: string
  // Per-chatbot feature → pass chatbotId. Account feature (extra_chatbot) → omit.
  chatbotId?: string
  // Already purchased → render a static "Unlocked" state.
  unlocked?: boolean
  // Coming-soon feature → render a disabled "Coming soon" state.
  comingSoon?: boolean
}

// Unlocks are CREDIT spends now (one POST to /api/portal/unlock), so the
// failure that needs real UI is 402 insufficient_credits — it links straight
// to the credit packs.
export function UnlockFeatureButton({ featureId, label, chatbotId, unlocked, comingSoon }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [needsCredits, setNeedsCredits] = useState(false)
  const router = useRouter()

  if (unlocked) {
    return (
      <div className="w-full text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 border border-green-400/30 bg-green-500/10 text-green-300">
        <Check className="w-4 h-4" />
        Unlocked
      </div>
    )
  }

  if (comingSoon) {
    return (
      <div className="w-full text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 border border-white/10 text-gray-500">
        Coming soon
      </div>
    )
  }

  async function handleUnlock() {
    setLoading(true)
    setError(null)
    setNeedsCredits(false)
    try {
      const res = await fetch('/api/portal/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featureId, chatbotId }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        if (res.status === 402) {
          setNeedsCredits(true)
          throw new Error(body.message || 'Not enough credits.')
        }
        throw new Error(body.error || 'Unlock failed')
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unlock failed')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleUnlock}
        disabled={loading}
        className="w-full button-primary text-white text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
        {loading ? 'Processing…' : label}
      </button>
      {error && (
        <p className="text-xs text-red-400 text-center">
          {error}
          {needsCredits && (
            <>
              {' '}
              <Link href="/portal/upgrade" className="text-purple-300 hover:text-purple-200 underline">
                Buy credits
              </Link>
            </>
          )}
        </p>
      )}
    </div>
  )
}
