'use client'

import { Download } from 'lucide-react'
import type { MkStrategy, MkContentItem } from '@/lib/marketkit/types'

function toMarkdown(name: string, s: MkStrategy, content: MkContentItem[]): string {
  const L: string[] = [`# ${name} — Launch Kit`, '']
  if (s.positioning) L.push('## Positioning', '', s.positioning, '')
  if (s.icp) {
    L.push('## Ideal customer', '', `**Who:** ${s.icp.who}`, '')
    if (s.icp.pains?.length) L.push('**Pains:**', ...s.icp.pains.map((p) => `- ${p}`), '')
    if (s.icp.where_they_are?.length) L.push('**Where they are:**', ...s.icp.where_they_are.map((w) => `- ${w}`), '')
    if (s.icp.triggers?.length) L.push('**Triggers:**', ...s.icp.triggers.map((t) => `- ${t}`), '')
  }
  if (s.channel_plan?.length) {
    L.push('## Channel plan', '')
    for (const c of s.channel_plan) {
      L.push(`### ${c.rank}. ${c.channel}  \`${c.cost}\` · effort ${c.effort}`)
      L.push(c.rationale, `_Expected:_ ${c.expected_outcome}`, '')
    }
  }
  if (s.launch_checklist?.length) {
    L.push('## Launch checklist', '')
    for (const c of s.launch_checklist) L.push(`- [ ] **${c.task}** — ${c.why}`)
    L.push('')
  }
  if (s.calendar?.length) {
    L.push('## 30-day content calendar', '')
    for (const d of s.calendar) L.push(`- **Day ${d.day}** · ${d.channel} · ${d.format} — ${d.topic}`)
    L.push('')
  }
  if (content.length) {
    L.push('## Content drafts', '')
    for (const c of content) {
      L.push(`### ${c.platform ?? 'post'} · ${c.format ?? ''}`, '', c.draft ?? '', '')
    }
  }
  return L.join('\n')
}

export function LaunchKitView({
  projectName,
  strategy,
  content,
}: {
  projectName: string
  strategy: MkStrategy
  content: MkContentItem[]
}) {
  function exportMd() {
    const md = toMarkdown(projectName, strategy, content)
    // UTF-8 BOM so Windows editors detect the encoding (em-dashes/€/emoji mojibake as ANSI otherwise)
    const blob = new Blob(['\uFEFF' + md], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${projectName.replace(/[^\w]+/g, '-').toLowerCase()}-launch-kit.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const s = strategy
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] text-gray-500 font-mono uppercase tracking-wider">Version {s.version}</span>
        <button
          onClick={exportMd}
          className="inline-flex items-center gap-1.5 text-xs text-gray-300 border border-white/10 hover:border-white/20 hover:text-white rounded-lg px-3 py-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Export Markdown
        </button>
      </div>

      {s.positioning && (
        <section>
          <h3 className="text-sm font-semibold text-white mb-2">Positioning</h3>
          <p className="text-sm text-gray-300 leading-relaxed">{s.positioning}</p>
        </section>
      )}

      {s.icp && (
        <section>
          <h3 className="text-sm font-semibold text-white mb-2">Ideal customer</h3>
          <p className="text-sm text-gray-300 mb-2">{s.icp.who}</p>
          <div className="grid sm:grid-cols-3 gap-3">
            <MiniList title="Pains" items={s.icp.pains} />
            <MiniList title="Where they are" items={s.icp.where_they_are} />
            <MiniList title="Triggers" items={s.icp.triggers} />
          </div>
        </section>
      )}

      {s.channel_plan && s.channel_plan.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-white mb-2">Channel plan</h3>
          <div className="space-y-2">
            {s.channel_plan.map((c, i) => (
              <div key={i} className="bg-[#0a0a1a] border border-white/[0.06] rounded-lg p-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-sm font-medium text-white">
                    {c.rank}. {c.channel}
                  </span>
                  <span className="text-[11px] font-mono text-cyan-300">
                    {c.cost} · effort {c.effort}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{c.rationale}</p>
                <p className="text-[11px] text-gray-500 mt-1">Expected: {c.expected_outcome}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {s.launch_checklist && s.launch_checklist.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-white mb-2">Launch checklist</h3>
          <ul className="space-y-1.5">
            {s.launch_checklist.map((c, i) => (
              <li key={i} className="text-sm text-gray-300">
                <span className="text-purple-300">▢</span> <span className="font-medium text-white">{c.task}</span>
                <span className="text-gray-500"> — {c.why}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {s.calendar && s.calendar.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-white mb-2">30-day content calendar</h3>
          <div className="grid sm:grid-cols-2 gap-1.5">
            {s.calendar.map((d, i) => (
              <div key={i} className="text-xs text-gray-400 bg-[#0a0a1a] border border-white/[0.05] rounded px-2.5 py-1.5">
                <span className="text-gray-500 font-mono">D{d.day}</span> · {d.channel} · {d.format} —{' '}
                <span className="text-gray-300">{d.topic}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {content.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-white mb-2">Content drafts</h3>
          <div className="space-y-3">
            {content.map((c) => (
              <div key={c.id} className="bg-[#0a0a1a] border border-white/[0.06] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300">
                    {c.platform ?? 'post'}
                  </span>
                  {c.format && <span className="text-[11px] text-gray-500">{c.format}</span>}
                </div>
                <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{c.draft}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function MiniList({ title, items }: { title: string; items?: string[] }) {
  if (!items || items.length === 0) return null
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider font-mono text-gray-500 mb-1">{title}</p>
      <ul className="space-y-0.5">
        {items.map((it, i) => (
          <li key={i} className="text-xs text-gray-300">
            {it}
          </li>
        ))}
      </ul>
    </div>
  )
}
