export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TechKitShell } from '@/components/command-center/techkit/ui'

interface MetricRow {
  provider: string
  metric_name: string
  project_id: string | null
  label: string | null
  metric_value: number
  unit: string | null
  recorded_at: string
}

interface CruxAgg { lcp?: number; inp?: number; cls?: number; at: string }
interface ProviderAgg { name: string; supaHealth?: number; dbBytes?: number; vercelHealth?: number; railwaySvc?: number }

export default async function TechKitStatsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/command-center/login')

  const since7d = new Date(Date.now() - 7 * 24 * 3600_000).toISOString()
  const [{ data: metrics, error: mErr }, { data: projects }] = await Promise.all([
    supabase
      .from('infra_metrics')
      .select('provider, metric_name, project_id, label, metric_value, unit, recorded_at')
      .gte('recorded_at', since7d)
      .order('recorded_at', { ascending: false })
      .limit(3000),
    supabase.from('projects').select('id, name'),
  ])

  // migration 011 not applied yet → `label` column missing
  if (mErr) {
    return (
      <TechKitShell active="Stats" title="Stats" subtitle="Web vitals, ChatKit rollups and provider metrics">
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-6 text-sm text-amber-200">
          Stats schema not ready — apply <code className="font-mono">supabase/migrations/011_techkit_sessionb.sql</code> in the Supabase SQL editor first.
        </div>
      </TechKitShell>
    )
  }

  const rows = (metrics ?? []) as MetricRow[]
  const nameById = new Map((projects ?? []).map((p) => [p.id as string, p.name as string]))

  // latest value per (provider, metric_name, project_id, label); rows are newest-first
  const latest = new Map<string, MetricRow>()
  for (const r of rows) {
    const key = `${r.provider}|${r.metric_name}|${r.project_id ?? ''}|${r.label ?? ''}`
    if (!latest.has(key)) latest.set(key, r)
  }
  const latestVals = Array.from(latest.values())
  const ck = (name: string) => latestVals.find((r) => r.provider === 'chatkit' && r.metric_name === name)?.metric_value ?? null

  // ChatKit messages_24h series (oldest→newest) for a sparkline
  const ckSeries = rows
    .filter((r) => r.provider === 'chatkit' && r.metric_name === 'messages_24h')
    .map((r) => r.metric_value)
    .reverse()

  // CrUX grouped by origin (label)
  const cruxOrigins = new Map<string, CruxAgg>()
  for (const r of latestVals) {
    if (r.provider !== 'crux' || !r.label) continue
    const o: CruxAgg = cruxOrigins.get(r.label) ?? { at: r.recorded_at }
    if (r.metric_name === 'lcp_ms') o.lcp = r.metric_value
    if (r.metric_name === 'inp_ms') o.inp = r.metric_value
    if (r.metric_name === 'cls') o.cls = r.metric_value
    cruxOrigins.set(r.label, o)
  }

  // provider rows per project
  const providerProjects = new Map<string, ProviderAgg>()
  const ensure = (pid: string): ProviderAgg => {
    const existing = providerProjects.get(pid)
    if (existing) return existing
    const created: ProviderAgg = { name: nameById.get(pid) ?? 'Unlinked' }
    providerProjects.set(pid, created)
    return created
  }
  for (const r of latestVals) {
    if (!r.project_id) continue
    if (r.provider === 'supabase' && r.metric_name === 'health_score') ensure(r.project_id).supaHealth = r.metric_value
    if (r.provider === 'supabase' && r.metric_name === 'db_size_bytes') ensure(r.project_id).dbBytes = r.metric_value
    if (r.provider === 'vercel' && r.metric_name === 'health_score') ensure(r.project_id).vercelHealth = r.metric_value
    if (r.provider === 'railway' && r.metric_name === 'services_count') ensure(r.project_id).railwaySvc = r.metric_value
  }
  const deployErrors = latestVals.find((r) => r.provider === 'vercel' && r.metric_name === 'deploy_errors_24h')?.metric_value ?? null

  const hasAny = rows.length > 0

  return (
    <TechKitShell active="Stats" title="Stats" subtitle="Web vitals, ChatKit rollups and provider metrics">
      {!hasAny && (
        <div className="rounded-xl border border-white/[0.06] bg-[#0d0d20]/80 px-5 py-6 text-sm text-gray-400 backdrop-blur-sm">
          Collecting… providers run hourly, stats every 6 hours. Check back once the first snapshots land.
        </div>
      )}

      {/* ChatKit rollup */}
      <Section title="ChatKit — last 24h" hint="Cross-project aggregate of chatbot message activity">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <StatTile label="Messages" value={fmtInt(ck('messages_24h'))} accent="cyan" spark={ckSeries} />
          <StatTile label="Tokens in" value={fmtInt(ck('tokens_in_24h'))} />
          <StatTile label="Tokens out" value={fmtInt(ck('tokens_out_24h'))} />
          <StatTile label="Avg latency" value={fmtMs(ck('avg_latency_ms'))} />
          <StatTile label="p95 latency" value={fmtMs(ck('p95_latency_ms'))} />
        </div>
      </Section>

      {/* CrUX web vitals */}
      <Section title="Web vitals (CrUX p75)" hint="Real-user Core Web Vitals per origin — Google Chrome UX Report">
        {cruxOrigins.size === 0 ? (
          <EmptyNote>No CrUX data — Google&apos;s Chrome UX Report only covers origins with enough real-user Chrome traffic; the monitored sites currently return &quot;insufficient data&quot;. Vitals appear here automatically once an origin qualifies.</EmptyNote>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {Array.from(cruxOrigins.entries()).map(([origin, v]) => (
              <div key={origin} className="rounded-xl border border-white/[0.06] bg-[#0d0d20]/80 p-4 backdrop-blur-sm">
                <p className="truncate text-xs font-medium text-gray-300" title={origin}>{origin.replace(/^https?:\/\//, '')}</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <Vital label="LCP" value={v.lcp} unit="ms" tone={vitalTone('lcp', v.lcp)} />
                  <Vital label="INP" value={v.inp} unit="ms" tone={vitalTone('inp', v.inp)} />
                  <Vital label="CLS" value={v.cls} unit="" tone={vitalTone('cls', v.cls)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* provider metrics */}
      <Section title="Providers" hint="Latest health + resource snapshot (hourly)">
        {providerProjects.size === 0 ? (
          <EmptyNote>No provider metrics yet — the hourly <code className="font-mono">providers</code> task fills this in.</EmptyNote>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/[0.06] bg-[#0d0d20]/80 backdrop-blur-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left text-xs text-gray-500">
                  <th className="px-5 py-2.5 font-normal">Project</th>
                  <th className="px-4 py-2.5 font-normal">Supabase</th>
                  <th className="px-4 py-2.5 font-normal">DB size</th>
                  <th className="px-4 py-2.5 font-normal">Vercel</th>
                  <th className="px-4 py-2.5 font-normal">Railway svcs</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(providerProjects.values()).sort((a, b) => a.name.localeCompare(b.name)).map((p) => (
                  <tr key={p.name} className="border-b border-white/[0.03] last:border-0">
                    <td className="px-5 py-3 font-medium text-white">{p.name}</td>
                    <td className="px-4 py-3"><HealthPill score={p.supaHealth} /></td>
                    <td className="px-4 py-3 text-gray-300">{p.dbBytes != null ? fmtBytes(p.dbBytes) : <span className="text-gray-600">—</span>}</td>
                    <td className="px-4 py-3"><HealthPill score={p.vercelHealth} /></td>
                    <td className="px-4 py-3 text-gray-300">{p.railwaySvc != null ? p.railwaySvc : <span className="text-gray-600">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {deployErrors != null && (
          <p className="mt-2 text-xs text-gray-500">
            Vercel deploy errors (last 24h): <span className={deployErrors > 0 ? 'text-red-300' : 'text-emerald-300'}>{deployErrors}</span>
          </p>
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

function StatTile({ label, value, accent, spark }: { label: string; value: string; accent?: 'cyan'; spark?: number[] }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d20]/80 px-4 py-3 backdrop-blur-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`mt-0.5 text-xl font-semibold ${accent === 'cyan' ? 'text-cyan-300' : 'text-white'}`}>{value}</p>
      {spark && spark.length > 1 && <MiniSpark points={spark} />}
    </div>
  )
}

function MiniSpark({ points }: { points: number[] }) {
  const max = Math.max(...points, 1)
  return (
    <div className="mt-2 flex h-5 items-end gap-px" title="messages/24h over recent snapshots">
      {points.slice(-24).map((p, i) => (
        <span key={i} className="w-1 rounded-t-[1px] bg-cyan-400/50" style={{ height: `${Math.max(6, (p / max) * 100)}%` }} />
      ))}
    </div>
  )
}

function Vital({ label, value, unit, tone }: { label: string; value: number | undefined; unit: string; tone: 'good' | 'ni' | 'poor' | 'none' }) {
  const tones = {
    good: 'text-emerald-300',
    ni: 'text-amber-300',
    poor: 'text-red-300',
    none: 'text-gray-600',
  }
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-gray-500">{label}</p>
      <p className={`text-sm font-semibold ${tones[tone]}`}>
        {value == null ? '—' : label === 'CLS' ? value.toFixed(3) : `${Math.round(value)}${unit}`}
      </p>
    </div>
  )
}

function HealthPill({ score }: { score?: number }) {
  if (score == null) return <span className="text-gray-600">—</span>
  const [cls, text] = score >= 1 ? ['bg-emerald-500/10 text-emerald-300', 'healthy'] : score <= 0 ? ['bg-red-500/10 text-red-300', 'down'] : ['bg-amber-500/10 text-amber-300', 'degraded']
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${cls}`}>{text}</span>
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-white/[0.06] bg-[#0d0d20]/80 px-5 py-4 text-xs text-gray-500 backdrop-blur-sm">{children}</div>
}

// thresholds: web.dev Core Web Vitals
function vitalTone(kind: 'lcp' | 'inp' | 'cls', v: number | undefined): 'good' | 'ni' | 'poor' | 'none' {
  if (v == null) return 'none'
  if (kind === 'lcp') return v <= 2500 ? 'good' : v <= 4000 ? 'ni' : 'poor'
  if (kind === 'inp') return v <= 200 ? 'good' : v <= 500 ? 'ni' : 'poor'
  return v <= 0.1 ? 'good' : v <= 0.25 ? 'ni' : 'poor'
}

function fmtInt(v: number | null): string {
  if (v == null) return '—'
  return Math.round(v).toLocaleString()
}
function fmtMs(v: number | null): string {
  if (v == null) return '—'
  return `${Math.round(v)}ms`
}
function fmtBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let v = bytes / 1024
  let i = 0
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024
    i++
  }
  return `${v.toFixed(1)} ${units[i]}`
}
