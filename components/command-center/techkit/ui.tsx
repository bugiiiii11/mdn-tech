import Link from 'next/link'

// Shared TechKit presentational bits (server-safe, no hooks).
// Design direction per TECHKIT-BRIEF §7.4: "space elegance without stars" —
// layered dark gradient + brand-tinted glow orbs + vignette; data density first.

const TABS = [
  { href: '/command-center/techkit', label: 'Overview' },
  { href: '/command-center/techkit/incidents', label: 'Incidents' },
  { href: '/command-center/techkit/endpoints', label: 'Endpoints' },
  { href: '/command-center/techkit/costs', label: 'Costs' },
  { href: '/command-center/techkit/stats', label: 'Stats' },
  { href: '/command-center/techkit/live', label: 'Live' },
] as const

export function TechKitShell({
  active,
  title,
  subtitle,
  children,
}: {
  active: (typeof TABS)[number]['label']
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-full">
      {/* ambient: gradient wash + glow orbs + vignette, always behind the data */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1f] via-transparent to-transparent" />
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-cyan-500/[0.05] blur-3xl" />
        <div className="absolute top-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-purple-500/[0.06] blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(3,0,20,0.55)_100%)]" />
      </div>

      <div className="relative p-6 space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-400/80">TechKit</p>
            <h1 className="text-xl font-semibold text-white mt-0.5">{title}</h1>
            <p className="text-gray-400 text-sm mt-0.5">{subtitle}</p>
          </div>
          <nav className="flex gap-1 rounded-lg border border-white/[0.06] bg-[#0d0d20]/80 p-1 backdrop-blur-sm">
            {TABS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className={`rounded-md px-3 py-1.5 text-xs transition-colors ${
                  t.label === active
                    ? 'bg-purple-500/15 text-purple-200'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {t.label}
              </Link>
            ))}
          </nav>
        </div>
        {children}
      </div>
    </div>
  )
}

const STATUS_COLORS: Record<string, string> = {
  up: 'bg-emerald-400',
  degraded: 'bg-amber-400',
  down: 'bg-red-500',
  unknown: 'bg-gray-600',
}

export function StatusDot({ status, pulse = false }: { status: string; pulse?: boolean }) {
  const color = STATUS_COLORS[status] ?? STATUS_COLORS.unknown
  return (
    <span className="relative inline-flex h-2.5 w-2.5">
      {pulse && status === 'down' && (
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${color} opacity-60`} />
      )}
      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${color}`} />
    </span>
  )
}

export function SeverityBadge({ severity }: { severity: string }) {
  const styles: Record<string, string> = {
    critical: 'bg-red-500/10 text-red-300 border-red-500/20',
    warning: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    info: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
  }
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${styles[severity] ?? styles.info}`}>
      {severity}
    </span>
  )
}

export interface RollupSlice {
  hour_start: string
  checks_total: number
  checks_up: number
  checks_degraded: number
  checks_down: number
  p95_latency_ms: number | null
}

// Horizontal segment bar — one segment per hour, worst status wins the color.
// dense = 1px cells with no gap (for 7d bars); default = 4px cells.
export function UptimeBar({ slices, hours, dense = false }: { slices: RollupSlice[]; hours: number; dense?: boolean }) {
  const byHour = new Map(slices.map((s) => [new Date(s.hour_start).getTime(), s]))
  const now = Date.now()
  const cells: { key: number; cls: string; label: string }[] = []
  for (let i = hours - 1; i >= 0; i--) {
    const hourStart = new Date(now - i * 3600_000)
    hourStart.setMinutes(0, 0, 0)
    const s = byHour.get(hourStart.getTime())
    let cls = 'bg-white/[0.06]'
    let label = 'no data'
    if (s) {
      if (s.checks_down > 0) cls = 'bg-red-500'
      else if (s.checks_degraded > 0) cls = 'bg-amber-400'
      else cls = 'bg-emerald-400/80'
      label = `${s.checks_up}/${s.checks_total} up${s.p95_latency_ms ? ` · p95 ${s.p95_latency_ms}ms` : ''}`
    }
    cells.push({ key: hourStart.getTime(), cls, label })
  }
  return (
    <div className={`flex h-4 items-end ${dense ? 'gap-0' : 'gap-px'}`} title={`last ${hours}h`}>
      {cells.map((c) => (
        <span key={c.key} title={c.label} className={`h-full ${dense ? 'w-px' : 'w-1 rounded-[1px]'} ${c.cls}`} />
      ))}
    </div>
  )
}

// Tiny p95 latency sparkline from hourly rollups (CSS bars, no chart lib).
export function SparklineLatency({ slices }: { slices: RollupSlice[] }) {
  const points = slices
    .filter((s) => s.p95_latency_ms !== null)
    .slice(-24)
  if (points.length === 0) return <span className="text-xs text-gray-600">—</span>
  const max = Math.max(...points.map((p) => p.p95_latency_ms!), 1)
  return (
    <div className="flex h-6 items-end gap-px" title={`p95 latency, max ${max}ms`}>
      {points.map((p) => (
        <span
          key={p.hour_start}
          title={`${p.p95_latency_ms}ms`}
          className="w-1 rounded-t-[1px] bg-cyan-400/60"
          style={{ height: `${Math.max(8, (p.p95_latency_ms! / max) * 100)}%` }}
        />
      ))}
    </div>
  )
}

export function uptimePct(slices: RollupSlice[]): string | null {
  const total = slices.reduce((a, s) => a + s.checks_total, 0)
  if (total === 0) return null
  const up = slices.reduce((a, s) => a + s.checks_up, 0)
  return ((up / total) * 100).toFixed(total > 200 ? 2 : 1) + '%'
}
