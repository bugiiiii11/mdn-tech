'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AlertCircle } from 'lucide-react'

export function UsageMeter({ customerId, product }: { customerId: string; product: 'chatkit' | 'signakit' | 'tradekit' }) {
  const supabase = createClient()
  const [used, setUsed] = useState(0)
  const [limit, setLimit] = useState(50)
  const [loading, setLoading] = useState(true)

  const limits: Record<string, number> = {
    chatkit: 50,
    signakit: 100,
    tradekit: 100,
  }

  useEffect(() => {
    async function fetchUsage() {
      const now = new Date()
      const periodStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      const startStr = periodStart.toISOString().split('T')[0]
      const endStr = periodEnd.toISOString().split('T')[0]

      const { data } = await supabase
        .from('product_usage')
        .select('value')
        .eq('customer_id', customerId)
        .eq('product', product)
        .eq('metric', 'messages')
        .gte('period_start', startStr)
        .lte('period_end', endStr)
        .single()

      setUsed(Math.floor(data?.value ?? 0))
      setLimit(limits[product])
      setLoading(false)
    }

    fetchUsage()
  }, [customerId, product, supabase, limits])

  const percentage = Math.round((used / limit) * 100)
  const isLimitReached = used >= limit
  const isWarning = used >= limit * 0.75 && !isLimitReached

  return (
    <div className="bg-[#0d0d20] border border-white/5 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isLimitReached && <AlertCircle className="w-4 h-4 text-red-400" />}
          <h3 className="text-sm font-medium text-white">Message Usage</h3>
        </div>
        {!loading && <span className="text-xs text-gray-400">{used} / {limit}</span>}
      </div>

      {!loading ? (
        <>
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all ${
                isLimitReached ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>

          {isLimitReached && (
            <p className="text-xs text-red-400">
              Limit reached. Upgrade your plan to continue using this chatbot.
            </p>
          )}
          {isWarning && (
            <p className="text-xs text-yellow-400">
              You&apos;re approaching your message limit. Consider upgrading to continue without limits.
            </p>
          )}
        </>
      ) : (
        <div className="h-2 bg-gray-800 rounded-full animate-pulse" />
      )}
    </div>
  )
}
