export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TechKitShell, StatusDot, UptimeBar, uptimePct, type RollupSlice } from '@/components/command-center/techkit/ui'
import { EndpointRowActions } from '@/components/command-center/techkit/EndpointRowActions'

export default async function EndpointsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/command-center/login')

  const since7d = new Date(Date.now() - 7 * 24 * 3600_000).toISOString()
  const [{ data: endpoints, error }, { data: rollups }] = await Promise.all([
    supabase
      .from('monitored_endpoints')
      .select('id, name, url, method, keyword, check_interval_secs, degraded_latency_ms, is_active, current_status, last_checked_at, projects(name)')
      .order('name'),
    supabase
      .from('uptime_rollups_hourly')
      .select('endpoint_id, hour_start, checks_total, checks_up, checks_degraded, checks_down, p95_latency_ms')
      .gte('hour_start', since7d),
  ])

  const rollupsByEndpoint = new Map<string, RollupSlice[]>()
  for (const r of (rollups ?? []) as (RollupSlice & { endpoint_id: string })[]) {
    const list = rollupsByEndpoint.get(r.endpoint_id) ?? []
    list.push(r)
    rollupsByEndpoint.set(r.endpoint_id, list)
  }

  return (
    <TechKitShell active="Endpoints" title="Endpoints" subtitle="Uptime targets checked by the Supabase poller (Vercel-independent)">
      <div className="flex justify-end">
        <Link href="/command-center/techkit/endpoints/new" className="button-primary rounded-lg px-4 py-2 text-sm font-medium text-white">
          + Add endpoint
        </Link>
      </div>

      <section className="rounded-xl border border-white/[0.06] bg-[#0d0d20]/80 backdrop-blur-sm">
        {error ? (
          <p className="px-5 py-10 text-center text-sm text-amber-200">
            TechKit tables not found — apply migration 009 first.
          </p>
        ) : (endpoints ?? []).length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-gray-500">No endpoints yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left text-xs text-gray-500">
                  <th className="px-5 py-2.5 font-normal">Endpoint</th>
                  <th className="px-4 py-2.5 font-normal">Project</th>
                  <th className="px-4 py-2.5 font-normal">Interval</th>
                  <th className="px-4 py-2.5 font-normal">7d uptime</th>
                  <th className="px-4 py-2.5 font-normal">7d history</th>
                  <th className="px-4 py-2.5 text-right font-normal">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(endpoints ?? []).map((e) => {
                  const slices = rollupsByEndpoint.get(e.id) ?? []
                  const projects = e.projects as unknown as { name: string } | null
                  return (
                    <tr key={e.id} className="border-b border-white/[0.03] last:border-0">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <StatusDot status={e.is_active ? e.current_status : 'unknown'} />
                          <div className="min-w-0">
                            <p className="font-medium text-white">
                              {e.name}
                              {!e.is_active && <span className="ml-2 text-[10px] uppercase text-gray-600">paused</span>}
                              {e.keyword && <span className="ml-2 text-[10px] text-gray-600" title={`keyword: ${e.keyword}`}>kw</span>}
                            </p>
                            <p className="max-w-[260px] truncate text-xs text-gray-600">{e.method} {e.url}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">{projects?.name ?? '—'}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{Math.round(e.check_interval_secs / 60)}m</td>
                      <td className="px-4 py-3 text-gray-300">{uptimePct(slices) ?? <span className="text-gray-600">—</span>}</td>
                      <td className="px-4 py-3"><UptimeBar slices={slices} hours={168} dense /></td>
                      <td className="px-4 py-3"><EndpointRowActions id={e.id} isActive={e.is_active} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </TechKitShell>
  )
}
