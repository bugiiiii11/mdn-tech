'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Loader2 } from 'lucide-react'

export function BuyCreditsButton({ chatbotId }: { chatbotId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleBuy() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/portal/chatbot/${chatbotId}/purchase`, {
        method: 'POST',
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
        className="w-full button-primary text-white text-sm py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {loading ? 'Processing…' : 'Buy 1,000 credits — $19'}
      </button>
      {error && <p className="text-xs text-red-400 text-center">{error}</p>}
    </div>
  )
}
