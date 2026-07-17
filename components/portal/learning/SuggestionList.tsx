'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, RefreshCw, Lightbulb } from 'lucide-react'

export type KBSuggestion = {
  id: string
  title: string
  content: string
  category: string
  rationale: string | null
  created_at: string
}

export function SuggestionList({
  chatbotId,
  suggestions,
}: {
  chatbotId: string
  suggestions: KBSuggestion[]
}) {
  const router = useRouter()
  const [busy, setBusy] = useState<string | null>(null) // suggestion id or 'run'
  const [error, setError] = useState<string | null>(null)
  const [ranEmpty, setRanEmpty] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  async function review(id: string, action: 'accept' | 'dismiss') {
    setBusy(id)
    setError(null)
    const res = await fetch(`/api/portal/chatkit/${chatbotId}/suggestions/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    setBusy(null)
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Something went wrong. Try again.')
      return
    }
    router.refresh()
  }

  async function runNow() {
    setBusy('run')
    setError(null)
    setRanEmpty(false)
    const res = await fetch('/api/portal/chatkit/learning/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatbotId }),
    })
    setBusy(null)
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Learning run failed. Try again.')
      return
    }
    const data = await res.json().catch(() => null)
    const generated = data?.results?.[0]?.suggestions ?? 0
    if (generated === 0) setRanEmpty(true)
    router.refresh()
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs text-gray-500">
          Drafted from replies you rated <span className="text-gray-300">incorrect</span> or{' '}
          <span className="text-gray-300">not helpful</span>. Accepting adds the entry to your
          knowledge base — edit it there afterwards.
        </p>
        <button
          type="button"
          onClick={runNow}
          disabled={busy !== null}
          className="inline-flex items-center gap-1.5 text-xs text-purple-300 hover:text-purple-200 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-3 h-3 ${busy === 'run' ? 'animate-spin' : ''}`} />
          {busy === 'run' ? 'Analyzing…' : 'Run now'}
        </button>
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {suggestions.length === 0 ? (
        <div className="bg-[#0a0a14] border border-dashed border-white/10 rounded-lg px-5 py-8 text-center">
          <Lightbulb className="w-5 h-5 text-gray-600 mx-auto mb-2" />
          <p className="text-sm text-gray-300">
            {ranEmpty ? 'Nothing new to learn from yet' : 'No pending suggestions'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {ranEmpty
              ? 'Rate more replies thumbs-down in the conversation viewer, then run again.'
              : 'The weekly pass runs every Sunday, or hit "Run now" after rating replies.'}
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {suggestions.map((s) => (
            <li key={s.id} className="bg-[#0a0a14] border border-white/5 rounded-lg p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-white">{s.title}</p>
                    <span className="text-[10px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-400/20">
                      {s.category}
                    </span>
                  </div>
                  {s.rationale && (
                    <p className="text-xs text-gray-500 mt-1">{s.rationale}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 mt-1.5 transition-colors"
                  >
                    {expanded === s.id ? 'Hide draft' : 'Show draft'}
                  </button>
                  {expanded === s.id && (
                    <pre className="mt-2 text-xs text-gray-300 bg-[#0d0d20] border border-white/5 rounded-lg p-3 whitespace-pre-wrap font-sans max-h-64 overflow-y-auto">
                      {s.content}
                    </pre>
                  )}
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => review(s.id, 'accept')}
                    disabled={busy !== null}
                    title="Accept — add to knowledge base"
                    className="w-7 h-7 rounded-md bg-green-500/10 text-green-300 border border-green-400/20 hover:bg-green-500/20 disabled:opacity-50 flex items-center justify-center transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => review(s.id, 'dismiss')}
                    disabled={busy !== null}
                    title="Dismiss"
                    className="w-7 h-7 rounded-md bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 disabled:opacity-50 flex items-center justify-center transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
