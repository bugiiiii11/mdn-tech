export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import {
  TechKitShell,
  StatusDot,
  SeverityBadge,
  UptimeBar,
  SparklineLatency,
  uptimePct,
  type RollupSlice,
} from '@/components/command-center/techkit/ui'
import { IncidentActions } from '@/components/command-center/techkit/IncidentActions'

interface EndpointRow {
  id: string
  name: string
  url: string
  is_active: boolean
  current_status: string
  last_checked_at: string | null
  projects: { name: string } | null
}

export default async function TechKitOverviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/command-center/login')

  const since24h = new Date(Date.now() - 24 * 3600_000).toISOString()
  const [{ data: endpoints, error: epError }, { data: rollups }, { data: incidents }] = await Promise.all([
    supabase
      .from('monitored_endpoints')
      .select('id, name, url, is_active, current_status, last_checked_at, projects(name)')
      .order('name'),
    supabase
      .from('uptime_rollups_hourly')
      .select('endpoint_id, hour_start, checks_total, checks_up, checks_degraded, checks_down, p95_latency_ms')
      .gte('hour_start', since24h),
    supabase
      .from('alert_events')
      .select('id, severity, title, message, status, opened_at, monitored_endpoints(name)')
      .in('status', ['open', 'acknowledged'])
      .order('opened_at', { ascending: false }),
  ])

  // migration 009 not applied yet → tables missing
  if (epError) {
    return (
      <TechKitShell active="Overview" title="Overview" subtitle="Uptime, incidents and provider health across all MDN projects">
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-6 text-sm text-amber-200">
          TechKit tables not found — apply <code className="font-mono">supabase/migrations/009_techkit.sql</code> in the Supabase SQL editor first.
        </div>
      </TechKitShell>
    )
  }

  const rollupsByEndpoint = new Map<string, RollupSlice[]>()
  for (const r of (rollups ?? []) as (RollupSlice & { endpoint_id: string })[]) {
    const list = rollupsByEndpoint.get(r.endpoint_id) ?? []
    list.push(r)
    rollupsByEndpoint.set(r.endpoint_id, list)
  }

  const eps = (endpoints ?? []) as unknown as EndpointRow[]
  const active = eps.filter((e) => e.is_active)
  const downCount = active.filter((e) => e.current_status === 'down').length
  const degradedCount = active.filter((e) => e.current_status === 'degraded').length
  const openIncidents = incidents ?? []

  // group endpoints by project
  const groups = new Map<string, EndpointRow[]>()
  for (const e of eps) {
    const key = e.projects?.name ?? 'Unlinked'
    const list = groups.get(key) ?? []
    list.push(e)
    groups.set(key, list)
  }

  return (
    <TechKitShell active="Overview" title="Overview" subtitle="Uptime, incidents and provider health across all MDN projects">
      {/* summary strip */}
      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryTile
          tone={downCount > 0 ? 'red' : 'green'}
          value={String(downCount)}
          label="endpoints down"
        />
        <SummaryTile
          tone={degradedCount > 0 ? 'amber' : 'green'}
          value={String(degradedCount)}
          label="degraded"
        />
        <SummaryTile
          tone={openIncidents.length > 0 ? 'red' : 'green'}
          value={String(openIncidents.length)}
          label="open incidents"
        />
      </div>

      {downCount === 0 && degradedCount === 0 && openIncidents.length === 0 && (
        <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-5 py-3 text-sm text-emerald-300">
          All systems operational{active.length > 0 ? ` — ${active.length} endpoints monitored` : ''}.
        </div>
      )}

      {/* open incidents */}
      {openIncidents.length > 0 && (
        <section className="rounded-xl border border-white/[0.06] bg-[#0d0d20]/80 backdrop-blur-sm">
          <h2 className="border-b border-white/5 px-5 py-3 text-sm font-medium text-white">Open incidents</h2>
          <ul className="divide-y divide-white/5">
            {openIncidents.map((i) => (
              <li key={i.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={i.severity} />
                    <span className="text-sm font-medium text-white">{i.title}</span>
                    {i.status === 'acknowledged' && <span className="text-[10px] uppercase tracking-wide text-gray-500">ack&apos;d</span>}
                  </div>
                  <p className="mt-1 truncate text-xs text-gray-500">
                    {new Date(i.opened_at).toLocaleString()} · {i.message?.split('\n')[0]}
                  </p>
                </div>
                <IncidentActions alertId={i.id} status={i.status} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* health grid, grouped by project */}
      <section className="rounded-xl border border-white/[0.06] bg-[#0d0d20]/80 backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
          <h2 className="text-sm font-medium text-white">Endpoints</h2>
          <Link href="/command-center/techkit/endpoints" className="text-xs text-purple-300 hover:underline">
            Manage →
          </Link>
        </div>
        {eps.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-gray-500">
            No endpoints yet — seed them via migration 009 or{' '}
            <Link href="/command-center/techkit/endpoints/new" className="text-purple-400 hover:underline">add one</Link>.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left text-xs text-gray-500">
                  <th className="px-5 py-2.5 font-normal">Endpoint</th>
                  <th className="px-4 py-2.5 font-normal">24h uptime</th>
                  <th className="px-4 py-2.5 font-normal">Last 24h</th>
                  <th className="px-4 py-2.5 font-normal">p95 latency</th>
                  <th className="px-4 py-2.5 font-normal">Last check</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(groups.entries()).map(([project, list]) => (
                  <GroupRows key={project} project={project} list={list} rollups={rollupsByEndpoint} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </TechKitShell>
  )
}

function SummaryTile({ tone, value, label }: { tone: 'red' | 'amber' | 'green'; value: string; label: string }) {
  const tones = {
    red: 'border-red-500/20 text-red-300',
    amber: 'border-amber-500/20 text-amber-300',
    green: 'border-emerald-500/15 text-emerald-300',
  }
  return (
    <div className={`rounded-xl border bg-[#0d0d20]/80 px-5 py-4 backdrop-blur-sm ${tones[tone]}`}>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="mt-0.5 text-xs text-gray-500">{label}</p>
    </div>
  )
}

function GroupRows({
  project,
  list,
  rollups,
}: {
  project: string
  list: EndpointRow[]
  rollups: Map<string, RollupSlice[]>
}) {
  return (
    <>
      <tr className="bg-white/[0.02]">
        <td colSpan={5} className="px-5 py-1.5 text-[10px] font-mono uppercase tracking-[0.15em] text-gray-500">
          {project}
        </td>
      </tr>
      {list.map((e) => {
        const slices = rollups.get(e.id) ?? []
        const pct = uptimePct(slices)
        return (
          <tr key={e.id} className="border-b border-white/[0.03] last:border-0">
            <td className="px-5 py-3">
              <div className="flex items-center gap-2.5">
                <StatusDot status={e.is_active ? e.current_status : 'unknown'} pulse />
                <div className="min-w-0">
                  <p className="font-medium text-white">
                    {e.name}
                    {!e.is_active && <span className="ml-2 text-[10px] uppercase text-gray-600">paused</span>}
                  </p>
                  <p className="truncate text-xs text-gray-600">{e.url}</p>
                </div>
              </div>
            </td>
            <td className="px-4 py-3 text-gray-300">{pct ?? <span className="text-gray-600">collecting…</span>}</td>
            <td className="px-4 py-3"><UptimeBar slices={slices} hours={24} /></td>
            <td className="px-4 py-3"><SparklineLatency slices={slices} /></td>
            <td className="px-4 py-3 text-xs text-gray-500">
              {e.last_checked_at ? new Date(e.last_checked_at).toLocaleTimeString() : '—'}
            </td>
          </tr>
        )
      })}
    </>
  )
}
