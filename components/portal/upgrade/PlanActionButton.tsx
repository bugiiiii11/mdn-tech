'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Sparkles } from 'lucide-react'
import type { SubscriptionPlan } from '@/lib/portal/plans'

type Props = {
  plan: SubscriptionPlan
  label: string
  primary?: boolean
}

export function SubscribeButton({ plan, label, primary = false }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/portal/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Subscription failed')
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Subscription failed')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`block w-full text-center text-sm py-2.5 rounded-xl disabled:opacity-50 ${
          primary
            ? 'button-primary text-white inline-flex items-center justify-center gap-1.5'
            : 'border border-white/15 text-gray-200 hover:border-white/30 hover:text-white transition-colors'
        }`}
      >
        {loading ? (
          <span className="inline-flex items-center justify-center gap-1.5">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Processing…
          </span>
        ) : primary ? (
          <>
            <Sparkles className="w-3.5 h-3.5" />
            {label}
          </>
        ) : (
          label
        )}
      </button>
      {error && <p className="text-xs text-red-400 text-center">{error}</p>}
    </div>
  )
}

export function CancelSubscriptionButton({ label = 'Cancel subscription' }: { label?: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  async function handleCancel() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/portal/subscription', { method: 'DELETE' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Cancel failed')
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cancel failed')
      setLoading(false)
      setConfirmOpen(false)
    }
  }

  if (!confirmOpen) {
    return (
      <button
        onClick={() => setConfirmOpen(true)}
        className="text-xs text-gray-400 hover:text-red-300 transition-colors underline-offset-4 hover:underline"
      >
        {label}
      </button>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-400">
        Cancel? You keep access until your current period ends, then drop to Free.
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleCancel}
          disabled={loading}
          className="text-xs px-3 py-1.5 rounded-md bg-red-500/10 border border-red-400/30 text-red-300 hover:bg-red-500/20 transition-colors disabled:opacity-50"
        >
          {loading ? 'Cancelling…' : 'Yes, cancel'}
        </button>
        <button
          onClick={() => setConfirmOpen(false)}
          className="text-xs px-3 py-1.5 rounded-md border border-white/10 text-gray-300 hover:border-white/20 hover:text-white transition-colors"
        >
          Keep my plan
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
