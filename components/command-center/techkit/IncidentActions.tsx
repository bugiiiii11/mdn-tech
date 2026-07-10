'use client'

import { useState, useTransition } from 'react'
import { acknowledgeAlert, resolveAlert } from '@/app/command-center/techkit/actions'

export function IncidentActions({ alertId, status }: { alertId: string; status: string }) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function run(action: (id: string) => Promise<{ error?: string }>) {
    setError(null)
    startTransition(async () => {
      const res = await action(alertId)
      if (res.error) setError(res.error)
    })
  }

  if (status === 'resolved') return null
  return (
    <div className="flex items-center gap-2">
      {status === 'open' && (
        <button
          onClick={() => run(acknowledgeAlert)}
          disabled={pending}
          className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-gray-300 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
        >
          Acknowledge
        </button>
      )}
      <button
        onClick={() => run(resolveAlert)}
        disabled={pending}
        className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300 transition-colors hover:bg-emerald-500/20 disabled:opacity-50"
      >
        Resolve
      </button>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  )
}
