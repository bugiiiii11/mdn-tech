export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TechKitShell } from '@/components/command-center/techkit/ui'
import { CostEntryForm, DeleteCostButton } from '@/components/command-center/techkit/CostEntryForm'

interface CostRow {
  id: string
  provider: string
  project_id: string | null
  cost_amount: number
  currency: string
  period_start: string
  period_end: string
  source: string
}

interface CostRule {
  id: string
  name: string
  provider: string | null
  metric_name: string | null
  condition: string
  threshold: number
  severity: string
  is_active: boolean
  last_fired_at: string | null
}

// providers get stable colors in the MTD breakdown bar
const PROVIDER_COLORS: Record<string, string> = {
  anthropic: 'bg-amber-400/80',
  supabase: 'bg-emerald-400/80',
  vercel: 'bg-gray-300/80',
  railway: 'bg-purple-400/80',
}
const FALLBACK_COLOR = 'bg-cyan-400/80'

export default async function TechKitCostsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/command-center/login')

  const now = new Date()
  const sixMonthsAgo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1))
  const [{ data: costs }, { data: projects }, { data: rules }] = await Promise.all([
    supabase
      .from('infra_costs')
      .select('id, provider, project_id, cost_amount, currency, period_start, period_end, source')
      .gte('period_start', sixMonthsAgo.toISOString().slice(0, 10))
      .order('period_start', { ascending: false })
      .limit(1000),
    supabase.from('projects').select('id, name').order('name'),
    supabase.from('alert_rules').select('*').eq('scope', 'cost').order('name'),
  ])

  const rows = (costs ?? []) as CostRow[]
  const projectList = (projects ?? []) as Array<{ id: string; name: string }>
  const costRules = (rules ?? []) as CostRule[]
  const nameById = new Map(projectList.map((p) => [p.id, p.name]))

  // months are attributed by period_start (daily API rows and monthly flat rows both start in their month)
  const thisMonth = now.toISOString().slice(0, 7)
  const lastMonthDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1))
  const lastMonth = lastMonthDate.toISOString().slice(0, 7)
  const monthOf = (r: CostRow) => r.period_start.slice(0, 7)

  const sum = (list: CostRow[]) => list.reduce((a, r) => a + Number(r.cost_amount), 0)
  const mtdRows = rows.filter((r) => monthOf(r) === thisMonth)
  const mtdTotal = sum(mtdRows)
  const lastMonthTotal = sum(rows.filter((r) => monthOf(r) === lastMonth))
  const delta = lastMonthTotal > 0 ? ((mtdTotal - lastMonthTotal) / lastMonthTotal) * 100 : null

  // per-provider MTD breakdown
  const byProvider = new Map<string, number>()
  for (const r of mtdRows) byProvider.set(r.provider, (byProvider.get(r.provider) ?? 0) + Number(r.cost_amount))
  const providerSlices = Array.from(byProvider.entries()).sort((a, b) => b[1] - a[1])

  // Anthropic daily series, last 30 days (period_start === period_end ⇒ daily API row)
  const anthropicDaily = rows
    .filter((r) => r.provider === 'anthropic' && r.period_start === r.period_end)
    .slice(0, 30)
    .reverse()
  const anthropicMtd = byProvider.get('anthropic') ?? 0

  // 6-month trend
  const byMonth = new Map<string, number>()
  for (let i = 5; i >= 0; i--) {
    const m = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1)).toISOString().slice(0, 7)
    byMonth.set(m, 0)
  }
  for (const r of rows) {
    const m = monthOf(r)
    if (byMonth.has(m)) byMonth.set(m, byMonth.get(m)! + Number(r.cost_amount))
  }
  const monthTrend = Array.from(byMonth.entries())
  const trendMax = Math.max(...monthTrend.map(([, v]) => v), 0.01)

  // table shows this + last month
  const tableRows = rows.filter((r) => monthOf(r) === thisMonth || monthOf(r) === lastMonth)
  const hasAnthropicData = anthropicDaily.length > 0

  return (
    <TechKitShell active="Costs" title="Costs" subtitle="Month-to-date spend per provider, daily Claude spend, manual entries">
      {/* summary tiles */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Tile label={`MTD total (${thisMonth})`} value={fmtUsd(mtdTotal)} accent />
        <Tile
          label={`Last month (${lastMonth})`}
          value={fmtUsd(lastMonthTotal)}
          sub={delta !== null ? `${delta >= 0 ? '+' : ''}${delta.toFixed(0)}% vs last month` : undefined}
        />
        <Tile label="Anthropic MTD" value={fmtUsd(anthropicMtd)} />
        <Tile label="Providers tracked" value={String(providerSlices.length)} />
      </div>

      {/* MTD per-provider breakdown */}
      <Section title="This month by provider" hint="All sources — API-collected, static plan prices, and manual entries">
        {providerSlices.length === 0 ? (
          <EmptyNote>No cost rows for {thisMonth} yet — the daily <code className="font-mono">costs</code> task (06:15 UTC) fills this in.</EmptyNote>
        ) : (
          <div className="rounded-xl border border-white/[0.06] bg-[#0d0d20]/80 p-4 backdrop-blur-sm">
            {mtdTotal > 0 && (
              <div className="mb-3 flex h-3 w-full overflow-hidden rounded-full bg-white/[0.04]">
                {providerSlices.map(([provider, amount]) =>
                  amount > 0 ? (
                    <span
                      key={provider}
                      title={`${provider}: ${fmtUsd(amount)}`}
                      className={`${PROVIDER_COLORS[provider] ?? FALLBACK_COLOR} h-full`}
                      style={{ width: `${(amount / mtdTotal) * 100}%` }}
                    />
                  ) : null
                )}
              </div>
            )}
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {providerSlices.map(([provider, amount]) => (
                <div key={provider} className="flex items-center gap-2 text-sm">
                  <span className={`h-2.5 w-2.5 rounded-full ${PROVIDER_COLORS[provider] ?? FALLBACK_COLOR}`} />
                  <span className="text-gray-300">{provider}</span>
                  <span className="ml-auto font-medium text-white">{fmtUsd(amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* Anthropic daily */}
      <Section title="Claude spend — daily" hint="Anthropic Admin API cost report, refreshed daily at 06:15 UTC (31-day self-healing window)">
        {!hasAnthropicData ? (
          <EmptyNote>
            No Anthropic cost data yet. This needs the <code className="font-mono">ANTHROPIC_ADMIN_API_KEY</code> Edge Function secret —
            an <span className="text-gray-300">Admin key</span> created in the Anthropic Console (the standard API key is rejected by the cost endpoints).
            Once set, the next daily run backfills the last 31 days.
          </EmptyNote>
        ) : (
          <div className="rounded-xl border border-white/[0.06] bg-[#0d0d20]/80 p-4 backdrop-blur-sm">
            <DailyBars rows={anthropicDaily} />
          </div>
        )}
      </Section>

      {/* 6-month trend */}
      <Section title="6-month trend" hint="Total tracked cost per calendar month, all providers">
        <div className="rounded-xl border border-white/[0.06] bg-[#0d0d20]/80 p-4 backdrop-blur-sm">
          <div className="flex items-end justify-between gap-2">
            {monthTrend.map(([month, value]) => (
              <div key={month} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-xs text-gray-400">{fmtUsd(value)}</span>
                <div className="flex h-24 w-full max-w-[72px] items-end rounded-md bg-white/[0.03]">
                  <div
                    className={`w-full rounded-md ${month === thisMonth ? 'bg-cyan-400/70' : 'bg-purple-400/50'}`}
                    style={{ height: `${Math.max(3, (value / trendMax) * 100)}%` }}
                    title={`${month}: ${fmtUsd(value)}`}
                  />
                </div>
                <span className="text-[10px] text-gray-500">{month}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* manual entry */}
      <Section title="Add a cost manually" hint="For providers without APIs — Railway plan fees, domains, one-off charges. Stored as source=manual">
        <CostEntryForm projects={projectList} />
      </Section>

      {/* rows table */}
      <Section title="Cost rows" hint="This month and last month, newest first">
        {tableRows.length === 0 ? (
          <EmptyNote>Nothing recorded yet.</EmptyNote>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/[0.06] bg-[#0d0d20]/80 backdrop-blur-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left text-xs text-gray-500">
                  <th className="px-5 py-2.5 font-normal">Provider</th>
                  <th className="px-4 py-2.5 font-normal">Project</th>
                  <th className="px-4 py-2.5 font-normal">Period</th>
                  <th className="px-4 py-2.5 text-right font-normal">Amount</th>
                  <th className="px-4 py-2.5 font-normal">Source</th>
                  <th className="px-4 py-2.5 font-normal" />
                </tr>
              </thead>
              <tbody>
                {tableRows.map((r) => (
                  <tr key={r.id} className="border-b border-white/[0.03] last:border-0">
                    <td className="px-5 py-2.5">
                      <span className="flex items-center gap-2 text-white">
                        <span className={`h-2 w-2 rounded-full ${PROVIDER_COLORS[r.provider] ?? FALLBACK_COLOR}`} />
                        {r.provider}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-400">
                      {r.project_id ? nameById.get(r.project_id) ?? '—' : <span className="text-gray-600">account</span>}
                    </td>
                    <td className="px-4 py-2.5 text-gray-400">
                      {r.period_start === r.period_end ? r.period_start : `${r.period_start} → ${r.period_end}`}
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium text-white">{fmtUsd(Number(r.cost_amount))}</td>
                    <td className="px-4 py-2.5">
                      <SourcePill source={r.source} />
                    </td>
                    <td className="px-4 py-2.5 text-right">{r.source !== 'api' && <DeleteCostButton id={r.id} />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* cost alert rules */}
      <Section title="Cost alert rules" hint="Evaluated by the daily costs task — warning severity goes to Telegram. Tune thresholds in the alert_rules table">
        {costRules.length === 0 ? (
          <EmptyNote>No cost rules — apply <code className="font-mono">supabase/migrations/014_techkit_costs.sql</code> to seed the defaults.</EmptyNote>
        ) : (
          <div className="grid gap-2 md:grid-cols-2">
            {costRules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#0d0d20]/80 px-4 py-3 backdrop-blur-sm">
                <div>
                  <p className="text-sm text-white">{rule.name}</p>
                  <p className="text-xs text-gray-500">
                    {rule.metric_name === 'daily_cost' ? 'daily' : 'month-to-date'} · {rule.provider ?? 'all providers'} ·{' '}
                    {rule.condition === 'lt' ? '<' : '>'} ${Number(rule.threshold).toFixed(2)}
                    {rule.last_fired_at && ` · last fired ${rule.last_fired_at.slice(0, 10)}`}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    rule.is_active ? 'bg-emerald-500/10 text-emerald-300' : 'bg-gray-500/10 text-gray-400'
                  }`}
                >
                  {rule.is_active ? 'active' : 'off'}
                </span>
              </div>
            ))}
          </div>
        )}
      </Section>
    </TechKitShell>
  )
}

// ------------------------------------------------------------------ pieces

function Section({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-sm font-medium text-white">{title}</h2>
        <p className="text-xs text-gray-500">{hint}</p>
      </div>
      {children}
    </section>
  )
}

function Tile({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d20]/80 px-4 py-3 backdrop-blur-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`mt-0.5 text-xl font-semibold ${accent ? 'text-cyan-300' : 'text-white'}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-500">{sub}</p>}
    </div>
  )
}

function DailyBars({ rows }: { rows: Array<{ period_start: string; cost_amount: number }> }) {
  const max = Math.max(...rows.map((r) => Number(r.cost_amount)), 0.01)
  return (
    <div className="flex h-24 items-end gap-1">
      {rows.map((r) => (
        <div
          key={r.period_start}
          title={`${r.period_start}: ${fmtUsd(Number(r.cost_amount))}`}
          className="min-w-[6px] flex-1 rounded-t-sm bg-amber-400/60 transition-colors hover:bg-amber-300/80"
          style={{ height: `${Math.max(3, (Number(r.cost_amount) / max) * 100)}%` }}
        />
      ))}
    </div>
  )
}

function SourcePill({ source }: { source: string }) {
  const styles: Record<string, string> = {
    api: 'bg-cyan-500/10 text-cyan-300',
    manual: 'bg-purple-500/10 text-purple-300',
    'static-config': 'bg-gray-500/10 text-gray-400',
  }
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${styles[source] ?? styles.manual}`}>{source}</span>
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-white/[0.06] bg-[#0d0d20]/80 px-5 py-4 text-xs text-gray-500 backdrop-blur-sm">{children}</div>
}

function fmtUsd(v: number): string {
  return `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
