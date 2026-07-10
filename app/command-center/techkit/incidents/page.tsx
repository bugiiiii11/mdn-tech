export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TechKitShell, SeverityBadge } from '@/components/command-center/techkit/ui'
import { IncidentActions } from '@/components/command-center/techkit/IncidentActions'

const FILTERS = ['all', 'open', 'acknowledged', 'resolved'] as const

export default async function IncidentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/command-center/login')

  const { status } = await searchParams
  const filter = FILTERS.includes(status as (typeof FILTERS)[number]) ? status! : 'all'

  let query = supabase
    .from('alert_events')
    .select('id, severity, title, message, status, notified_channels, opened_at, acknowledged_at, resolved_at, monitored_endpoints(name), projects(name)')
    .order('opened_at', { ascending: false })
    .limit(100)
  if (filter !== 'all') query = query.eq('status', filter)
  const { data: incidents, error } = await query

  return (
    <TechKitShell active="Incidents" title="Incidents" subtitle="Downtime, degradation and rule-based alerts — most recent first">
      <div className="flex gap-1.5">
        {FILTERS.map((f) => (
          <Link
            key={f}
            href={f === 'all' ? '/command-center/techkit/incidents' : `/command-center/techkit/incidents?status=${f}`}
            className={`rounded-full border px-3 py-1 text-xs capitalize transition-colors ${
              filter === f
                ? 'border-purple-500/40 bg-purple-500/15 text-purple-200'
                : 'border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            {f}
          </Link>
        ))}
      </div>

      <section className="rounded-xl border border-white/[0.06] bg-[#0d0d20]/80 backdrop-blur-sm">
        {error ? (
          <p className="px-5 py-10 text-center text-sm text-amber-200">
            TechKit tables not found — apply migration 009 first.
          </p>
        ) : (incidents ?? []).length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-gray-500">
            No incidents{filter !== 'all' ? ` with status "${filter}"` : ''} — quiet skies.
          </p>
        ) : (
          <ul className="divide-y divide-white/5">
            {(incidents ?? []).map((i) => (
              <li key={i.id} className="px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={i.severity} />
                    <span className="text-sm font-medium text-white">{i.title}</span>
                    <StatusChip status={i.status} />
                  </div>
                  <IncidentActions alertId={i.id} status={i.status} />
                </div>
                {i.message && (
                  <pre className="mt-2 whitespace-pre-wrap font-sans text-xs leading-relaxed text-gray-400">{i.message}</pre>
                )}
                <p className="mt-2 text-[11px] text-gray-600">
                  Opened {new Date(i.opened_at).toLocaleString()}
                  {i.acknowledged_at && <> · acknowledged {new Date(i.acknowledged_at).toLocaleString()}</>}
                  {i.resolved_at && <> · resolved {new Date(i.resolved_at).toLocaleString()}</>}
                  {Array.isArray(i.notified_channels) && i.notified_channels.length > 0 && (
                    <> · notified via {(i.notified_channels as string[]).join(', ')}</>
                  )}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </TechKitShell>
  )
}

function StatusChip({ status }: { status: string }) {
  const styles: Record<string, string> = {
    open: 'bg-red-500/10 text-red-300',
    acknowledged: 'bg-amber-500/10 text-amber-300',
    resolved: 'bg-emerald-500/10 text-emerald-300',
  }
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide ${styles[status] ?? 'bg-white/5 text-gray-400'}`}>
      {status}
    </span>
  )
}
