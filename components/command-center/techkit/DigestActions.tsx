'use client'

import { useState, useTransition } from 'react'
import { generateDigestNow } from '@/app/command-center/techkit/actions'

// Runs task=digest on demand. The poller upserts on week_start, so repeated
// clicks on the same day replace the same row instead of piling up digests.
export function GenerateDigestButton() {
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const run = () => {
    setError(null)
    setDone(null)
    startTransition(async () => {
      const res = await generateDigestNow()
      if (res.error) setError(res.error)
      else setDone(res.week_start ?? 'ok')
    })
  }

  return (
    <div className="flex items-center gap-3">
      {error && <span className="text-xs text-red-400">{error}</span>}
      {done && !error && <span className="text-xs text-emerald-400">Digest generated (week {done})</span>}
      <button
        onClick={run}
        disabled={pending}
        className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-gray-300 transition-colors hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
      >
        {pending ? 'Generating… (~15s)' : 'Generate now'}
      </button>
    </div>
  )
}
