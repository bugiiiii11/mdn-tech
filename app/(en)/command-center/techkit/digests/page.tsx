export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TechKitShell } from '@/components/command-center/techkit/ui'
import { GenerateDigestButton } from '@/components/command-center/techkit/DigestActions'
import { KnowledgeContent } from '@/components/command-center/knowledge/KnowledgeContent'

interface DigestRow {
  id: string
  week_start: string
  content_md: string
  model: string | null
  sent_email: boolean
  sent_telegram: boolean
  created_at: string
}

function weekLabel(weekStart: string): string {
  const start = new Date(weekStart + 'T00:00:00Z')
  const end = new Date(start.getTime() + 6 * 86400_000)
  return `${weekStart} → ${end.toISOString().slice(0, 10)}`
}

export default async function TechKitDigestsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/command-center/login')

  const { data } = await supabase
    .from('techkit_digests')
    .select('id, week_start, content_md, model, sent_email, sent_telegram, created_at')
    .order('week_start', { ascending: false })
    .limit(26)

  const digests = (data ?? []) as DigestRow[]
  const [latest, ...older] = digests

  return (
    <TechKitShell
      active="Digests"
      title="Weekly digests"
      subtitle="AI ops summary of the last 7 days — generated Mondays 06:30 UTC, delivered by email + Telegram"
    >
      <div className="flex justify-end">
        <GenerateDigestButton />
      </div>

      {!latest ? (
        <div className="rounded-xl border border-white/[0.06] bg-[#0d0d20]/80 px-5 py-4 text-xs text-gray-500 backdrop-blur-sm">
          No digests yet. The first one lands after the Monday 06:30 UTC cron (migration{' '}
          <code className="font-mono">015_techkit_digest.sql</code>), or use <span className="text-gray-300">Generate now</span> to
          digest the trailing 7 days immediately.
        </div>
      ) : (
        <DigestCard digest={latest} open />
      )}

      {older.length > 0 && (
        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-medium text-white">Previous weeks</h2>
            <p className="text-xs text-gray-500">Last {older.length} stored digest{older.length === 1 ? '' : 's'}</p>
          </div>
          <div className="space-y-2">
            {older.map((d) => (
              <DigestCard key={d.id} digest={d} />
            ))}
          </div>
        </section>
      )}
    </TechKitShell>
  )
}

function DigestCard({ digest, open = false }: { digest: DigestRow; open?: boolean }) {
  return (
    <details
      open={open}
      className="group rounded-xl border border-white/[0.06] bg-[#0d0d20]/80 backdrop-blur-sm"
    >
      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 px-5 py-3.5 [&::-webkit-details-marker]:hidden">
        <span className="text-sm font-medium text-white">{weekLabel(digest.week_start)}</span>
        <span className="text-[10px] text-gray-500 font-mono">{digest.model ?? '—'}</span>
        <span className="ml-auto flex items-center gap-2">
          <DeliveryPill label="email" sent={digest.sent_email} />
          <DeliveryPill label="telegram" sent={digest.sent_telegram} />
          <span className="text-gray-600 transition-transform group-open:rotate-90">›</span>
        </span>
      </summary>
      <div className="border-t border-white/[0.05] px-5 py-4">
        <KnowledgeContent content={digest.content_md} />
      </div>
    </details>
  )
}

function DeliveryPill({ label, sent }: { label: string; sent: boolean }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
        sent ? 'bg-emerald-500/10 text-emerald-300' : 'bg-gray-500/10 text-gray-500'
      }`}
      title={sent ? `${label} delivered` : `${label} not delivered`}
    >
      {label} {sent ? '✓' : '—'}
    </span>
  )
}
