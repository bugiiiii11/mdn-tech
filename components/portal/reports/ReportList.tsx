'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw, FileBarChart, Mail } from 'lucide-react'

export type ChatbotReport = {
  id: string
  period_start: string
  period_end: string
  stats: {
    conversations: { week: number; prev: number }
    replies: { week: number; prev: number }
    fallbacks: { week: number; prev: number; rate_pct: number | null; prev_rate_pct: number | null }
    ratings: { positive: number; negative: number }
    top_keywords: { word: string; count: number }[]
  }
  summary: string | null
  email_sent: boolean
  created_at: string
}

function delta(week: number, prev: number): string | null {
  if (prev === 0) return null
  const pct = Math.round(((week - prev) / prev) * 100)
  return `${pct >= 0 ? '+' : ''}${pct}%`
}

export function ReportList({
  chatbotId,
  reports,
}: {
  chatbotId: string
  reports: ChatbotReport[]
}) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ranEmpty, setRanEmpty] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(reports[0]?.id ?? null)

  async function runNow() {
    setBusy(true)
    setError(null)
    setRanEmpty(false)
    const res = await fetch('/api/portal/chatkit/reports/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatbotId }),
    })
    setBusy(false)
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Report run failed. Try again.')
      return
    }
    const data = await res.json().catch(() => null)
    if (!data?.results?.[0]?.report) setRanEmpty(true)
    router.refresh()
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs text-gray-500">
          A performance digest of the last 7 days, generated every Monday and emailed to you.
        </p>
        <button
          type="button"
          onClick={runNow}
          disabled={busy}
          className="inline-flex items-center gap-1.5 text-xs text-purple-300 hover:text-purple-200 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-3 h-3 ${busy ? 'animate-spin' : ''}`} />
          {busy ? 'Generating…' : 'Run now'}
        </button>
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {reports.length === 0 ? (
        <div className="bg-[#0a0a14] border border-dashed border-white/10 rounded-lg px-5 py-8 text-center">
          <FileBarChart className="w-5 h-5 text-gray-600 mx-auto mb-2" />
          <p className="text-sm text-gray-300">
            {ranEmpty ? 'No activity to report yet' : 'No reports yet'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {ranEmpty
              ? 'Once visitors chat with your bot this week, a report can be generated.'
              : 'The first report arrives Monday morning, or hit "Run now" for a preview of this week.'}
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {reports.map((r) => {
            const s = r.stats
            const open = expanded === r.id
            const tiles: { label: string; value: string; sub: string | null }[] = [
              {
                label: 'Conversations',
                value: `${s.conversations.week}`,
                sub: delta(s.conversations.week, s.conversations.prev),
              },
              {
                label: 'Bot replies',
                value: `${s.replies.week}`,
                sub: delta(s.replies.week, s.replies.prev),
              },
              {
                label: 'Fallback rate',
                value: s.fallbacks.rate_pct !== null ? `${s.fallbacks.rate_pct}%` : '—',
                sub: s.fallbacks.prev_rate_pct !== null ? `was ${s.fallbacks.prev_rate_pct}%` : null,
              },
              {
                label: 'Rated replies',
                value: `${s.ratings.positive + s.ratings.negative}`,
                sub:
                  s.ratings.positive + s.ratings.negative > 0
                    ? `${s.ratings.positive} up · ${s.ratings.negative} down`
                    : null,
              },
            ]
            return (
              <li key={r.id} className="bg-[#0a0a14] border border-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setExpanded(open ? null : r.id)}
                    className="text-sm font-medium text-white hover:text-purple-200 transition-colors"
                  >
                    {r.period_start} to {r.period_end}
                  </button>
                  {r.email_sent && (
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-400/20">
                      <Mail className="w-2.5 h-2.5" /> emailed
                    </span>
                  )}
                </div>

                {open && (
                  <div className="mt-3 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {tiles.map((t) => (
                        <div key={t.label} className="bg-[#0d0d20] border border-white/5 rounded-lg p-2.5">
                          <p className="text-[10px] text-gray-500">{t.label}</p>
                          <p className="text-base font-semibold text-white mt-0.5">{t.value}</p>
                          {t.sub && <p className="text-[10px] text-gray-500 mt-0.5">{t.sub}</p>}
                        </div>
                      ))}
                    </div>
                    {s.top_keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {s.top_keywords.map((k) => (
                          <span
                            key={k.word}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-400/20"
                          >
                            {k.word} · {k.count}
                          </span>
                        ))}
                      </div>
                    )}
                    {r.summary && (
                      <p className="text-xs text-gray-400 leading-relaxed border-l-2 border-purple-400/30 pl-3">
                        {r.summary}
                      </p>
                    )}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
