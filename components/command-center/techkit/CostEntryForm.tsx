'use client'

import { useState, useTransition } from 'react'
import { addManualCost, deleteCost } from '@/app/command-center/techkit/actions'

const PROVIDER_SUGGESTIONS = ['railway', 'anthropic', 'vercel', 'supabase', 'domains', 'other']

function monthBounds(): { start: string; end: string } {
  const now = new Date()
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0))
  return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) }
}

export function CostEntryForm({ projects }: { projects: Array<{ id: string; name: string }> }) {
  const bounds = monthBounds()
  const [provider, setProvider] = useState('railway')
  const [projectId, setProjectId] = useState('')
  const [amount, setAmount] = useState('')
  const [periodStart, setPeriodStart] = useState(bounds.start)
  const [periodEnd, setPeriodEnd] = useState(bounds.end)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [pending, startTransition] = useTransition()

  const submit = () => {
    setError(null)
    setSaved(false)
    startTransition(async () => {
      const res = await addManualCost({
        provider,
        project_id: projectId || null,
        cost_amount: Number(amount),
        period_start: periodStart,
        period_end: periodEnd,
      })
      if (res.error) setError(res.error)
      else {
        setSaved(true)
        setAmount('')
      }
    })
  }

  const inputCls =
    'rounded-lg border border-white/10 bg-[#0a0a18] px-3 py-1.5 text-sm text-white placeholder-gray-600 focus:border-purple-400/50 focus:outline-none'

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d20]/80 p-4 backdrop-blur-sm">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-xs text-gray-500">
          Provider
          <input
            list="cost-providers"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className={`${inputCls} w-32`}
          />
          <datalist id="cost-providers">
            {PROVIDER_SUGGESTIONS.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </label>
        <label className="flex flex-col gap-1 text-xs text-gray-500">
          Project (optional)
          <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className={`${inputCls} w-44`}>
            <option value="">Account-level</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-gray-500">
          Amount (USD)
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="5.00"
            className={`${inputCls} w-24`}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-gray-500">
          Period start
          <input type="date" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} className={inputCls} />
        </label>
        <label className="flex flex-col gap-1 text-xs text-gray-500">
          Period end
          <input type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} className={inputCls} />
        </label>
        <button
          onClick={submit}
          disabled={pending || !amount}
          className="rounded-lg border border-purple-400/30 bg-purple-500/15 px-4 py-1.5 text-sm text-purple-200 transition-colors hover:bg-purple-500/25 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? 'Saving…' : 'Add cost'}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
      {saved && !error && <p className="mt-2 text-xs text-emerald-300">Saved ✓</p>}
    </div>
  )
}

export function DeleteCostButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false)
  const [pending, startTransition] = useTransition()

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-xs text-gray-600 transition-colors hover:text-red-300"
        title="Delete this cost row"
      >
        Delete
      </button>
    )
  }
  return (
    <button
      onClick={() => startTransition(async () => void (await deleteCost(id)))}
      disabled={pending}
      className="text-xs text-red-300 hover:text-red-200 disabled:opacity-50"
    >
      {pending ? 'Deleting…' : 'Confirm?'}
    </button>
  )
}
