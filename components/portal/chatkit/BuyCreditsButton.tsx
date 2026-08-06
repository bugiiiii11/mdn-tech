'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Loader2 } from 'lucide-react'

type Props = {
  chatbotId: string
  packId: string
  label: string
  primary?: boolean
}

export function BuyCreditsButton({ chatbotId, packId, label, primary = true }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleBuy() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/portal/chatbot/${chatbotId}/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Purchase failed')
      }
      router.refresh()
      router.push(`/portal/chatkit/${chatbotId}?purchase=success`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Purchase failed')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleBuy}
        disabled={loading}
        className={`w-full text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-colors ${
          primary
            ? 'button-primary text-white'
            : 'border border-white/15 text-gray-200 hover:border-white/30 hover:text-white'
        }`}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : primary ? <Sparkles className="w-4 h-4" /> : null}
        {loading ? 'Processing…' : label}
      </button>
      {error && <p className="text-xs text-red-400 text-center">{error}</p>}
    </div>
  )
}
