// Provider-metrics collectors for the poller's `providers` + `stats` tasks
// (TECHKIT-BRIEF §5.1 / §8). Deno/fetch-only port of lib/infrastructure/* — kept
// separate from the Next.js "Live" tab adapters (T8) because these collect a
// smaller, metrics-focused set (health scores + key numbers) rather than the
// full live-view payload, and must run under Deno with Deno.env.
//
// Each collector is independently try/caught by the caller; a single provider
// outage degrades to "no metrics this run", never a thrown task.

export interface ProviderMetric {
  provider: 'supabase' | 'railway' | 'vercel' | 'crux' | 'chatkit'
  // provider-side project id used to join to projects.{supabase_project_ref |
  // railway_project_id | vercel_project_id}; null = account-level metric.
  providerProjectId: string | null
  metricName: string
  value: number
  unit: string
}

const FETCH_TIMEOUT_MS = 12_000

function timeout() {
  return AbortSignal.timeout(FETCH_TIMEOUT_MS)
}

// ---------------------------------------------------------------- Supabase

const SUPABASE_MGMT_BASE = 'https://api.supabase.com/v1'

export async function fetchSupabaseMetrics(): Promise<ProviderMetric[]> {
  // Named SB_MGMT_* not SUPABASE_* — Supabase reserves the SUPABASE_ prefix for
  // Edge Function secrets (can't set a SUPABASE_-prefixed secret via the API).
  const key = Deno.env.get('SB_MGMT_API_KEY')
  if (!key || key === 'your_management_api_key_here') return []

  const res = await fetch(`${SUPABASE_MGMT_BASE}/projects`, {
    headers: { Authorization: `Bearer ${key}` },
    signal: timeout(),
  })
  if (!res.ok) throw new Error(`supabase mgmt /projects ${res.status}`)
  const projects = (await res.json()) as Array<{ ref?: string; id?: string; status?: string }>

  const out: ProviderMetric[] = []
  for (const p of projects) {
    const ref = String(p.ref ?? p.id ?? '')
    if (!ref) continue
    out.push({
      provider: 'supabase',
      providerProjectId: ref,
      metricName: 'health_score',
      value: p.status === 'ACTIVE_HEALTHY' ? 1 : p.status === 'INACTIVE' ? 0 : 0.5,
      unit: 'status',
    })
    // db size via the read-only query endpoint (idempotent select — safe despite
    // the double-execution quirk on this endpoint). Best-effort per project.
    try {
      const q = await fetch(`${SUPABASE_MGMT_BASE}/projects/${ref}/database/query`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'select pg_database_size(current_database()) as size' }),
        signal: timeout(),
      })
      if (q.ok) {
        const rows = (await q.json()) as Array<{ size?: number | string }>
        const size = Number(rows?.[0]?.size)
        if (Number.isFinite(size)) {
          out.push({ provider: 'supabase', providerProjectId: ref, metricName: 'db_size_bytes', value: size, unit: 'bytes' })
        }
      }
    } catch {
      // project not queryable (paused / permissions) — skip its size this run
    }
  }
  return out
}

// ---------------------------------------------------------------- Railway

const RAILWAY_API = 'https://backboard.railway.app/graphql/v2'

// Workspace tokens can't query `me`; top-level `projects` works for both (Session 34).
const RAILWAY_PROJECTS_QUERY = `
  query {
    projects {
      edges { node { id services { edges { node { id } } } } }
    }
  }
`

async function railwayGql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const token = Deno.env.get('RAILWAY_API_TOKEN')
  if (!token || token === 'your_railway_token_here') throw new Error('not_configured')
  const res = await fetch(RAILWAY_API, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    signal: timeout(),
  })
  if (!res.ok) throw new Error(`railway ${res.status}`)
  const json = await res.json()
  if (json.errors?.length) throw new Error(json.errors[0].message)
  return json.data as T
}

export async function fetchRailwayMetrics(): Promise<ProviderMetric[]> {
  if (!Deno.env.get('RAILWAY_API_TOKEN')) return []
  const data = await railwayGql<{
    projects: { edges: Array<{ node: { id: string; services: { edges: Array<{ node: { id: string } }> } } }> }
  }>(RAILWAY_PROJECTS_QUERY)

  const out: ProviderMetric[] = []
  for (const edge of data.projects.edges) {
    out.push({
      provider: 'railway',
      providerProjectId: edge.node.id,
      metricName: 'services_count',
      value: edge.node.services.edges.length,
      unit: 'count',
    })
    out.push({ provider: 'railway', providerProjectId: edge.node.id, metricName: 'health_score', value: 1, unit: 'status' })
  }
  return out
}

// ---------------------------------------------------------------- Vercel

const VERCEL_API = 'https://api.vercel.com'

async function vercelGet<T>(path: string): Promise<T> {
  const token = Deno.env.get('VERCEL_ACCESS_TOKEN')
  if (!token || token === 'your_vercel_token_here') throw new Error('not_configured')
  const res = await fetch(`${VERCEL_API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal: timeout(),
  })
  if (!res.ok) throw new Error(`vercel ${path} ${res.status}`)
  return res.json() as Promise<T>
}

export async function fetchVercelMetrics(): Promise<ProviderMetric[]> {
  if (!Deno.env.get('VERCEL_ACCESS_TOKEN')) return []
  const [projectsData, deploymentsData] = await Promise.all([
    vercelGet<{ projects: Array<{ id: string; latestDeployments?: Array<{ readyState: string }> }> }>(
      '/v9/projects?limit=50'
    ),
    vercelGet<{ deployments: Array<{ state: string; created: number }> }>(
      '/v6/deployments?limit=50&state=READY,BUILDING,ERROR,QUEUED,CANCELED'
    ),
  ])

  const out: ProviderMetric[] = []
  for (const p of projectsData.projects) {
    const state = p.latestDeployments?.[0]?.readyState ?? 'UNKNOWN'
    out.push({
      provider: 'vercel',
      providerProjectId: p.id,
      metricName: 'health_score',
      value: state === 'READY' ? 1 : state === 'ERROR' || state === 'CANCELED' ? 0 : 0.5,
      unit: 'status',
    })
  }

  const dayAgo = Date.now() - 24 * 3600_000
  const errors24h = deploymentsData.deployments.filter((d) => d.state === 'ERROR' && d.created >= dayAgo).length
  out.push({ provider: 'vercel', providerProjectId: null, metricName: 'deploy_errors_24h', value: errors24h, unit: 'count' })
  return out
}

// Vercel deploy feed WITHOUT webhooks (webhooks are Pro-only; the read API is not).
// Polled hourly by the providers task → deploy_events. Joins deploys to projects by
// project name (the deployment's `name` field) → projects.vercel_project_id.
export interface DeployRecord {
  deployment_id: string
  status: string // created | building | succeeded | failed | canceled
  environment: string | null
  vercelProjectId: string | null
  url: string | null
  actor: string | null
  occurred_at: string
  raw: unknown
}

export async function fetchVercelDeployments(): Promise<DeployRecord[]> {
  if (!Deno.env.get('VERCEL_ACCESS_TOKEN')) return []
  const projectsData = await vercelGet<{ projects: Array<{ id: string; name: string }> }>('/v9/projects?limit=100')
  const nameToId = new Map(projectsData.projects.map((p) => [p.name, p.id]))
  const deps = await vercelGet<{
    deployments: Array<{
      uid: string
      name: string
      url?: string
      state?: string
      created: number
      target?: string | null
      meta?: { githubCommitAuthorName?: string }
    }>
  }>('/v6/deployments?target=production&limit=40')
  return deps.deployments.map((d) => ({
    deployment_id: d.uid,
    status: mapVercelState(d.state ?? ''),
    environment: d.target ?? 'production', // asked for target=production
    vercelProjectId: nameToId.get(d.name) ?? null,
    url: d.url ? `https://${d.url}` : null,
    actor: d.meta?.githubCommitAuthorName ?? null,
    occurred_at: new Date(d.created).toISOString(),
    raw: d,
  }))
}

function mapVercelState(state: string): string {
  switch (state) {
    case 'READY':
      return 'succeeded'
    case 'ERROR':
      return 'failed'
    case 'CANCELED':
      return 'canceled'
    case 'BUILDING':
    case 'QUEUED':
    case 'INITIALIZING':
      return 'building'
    default:
      return state.toLowerCase() || 'building'
  }
}

// ---------------------------------------------------------------- Anthropic (costs)

// Daily org-level Claude spend via the Admin API cost report (TECHKIT-BRIEF §9).
// Requires an ADMIN key (sk-ant-admin…) created in the Anthropic Console —
// the standard ANTHROPIC_API_KEY is rejected with 401/403 on these endpoints.
// `amount` comes back as a decimal string in CENTS ("123.45" = $1.23).
export interface AnthropicCostBucket {
  day: string // YYYY-MM-DD (bucket start, UTC)
  amountUsd: number
}

export async function fetchAnthropicCosts(days = 31): Promise<AnthropicCostBucket[]> {
  const key = Deno.env.get('ANTHROPIC_ADMIN_API_KEY')
  if (!key) return [] // caller reports "skipped — key not set"

  const start = new Date(Date.now() - days * 86400_000)
  start.setUTCHours(0, 0, 0, 0)

  const byDay = new Map<string, number>() // day → cents
  let page: string | null = null
  for (let i = 0; i < 5; i++) {
    const params = new URLSearchParams({
      starting_at: start.toISOString(),
      bucket_width: '1d',
      limit: '31',
    })
    if (page) params.set('page', page)
    const res = await fetch(`https://api.anthropic.com/v1/organizations/cost_report?${params}`, {
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'User-Agent': 'MDN-TechKit-Monitor/1.0 (+https://mdntech.org)',
      },
      signal: timeout(),
    })
    if (res.status === 401 || res.status === 403) {
      throw new Error(`admin key rejected (${res.status}) — cost_report needs an Admin API key (sk-ant-admin…), not the standard key`)
    }
    if (!res.ok) throw new Error(`anthropic cost_report ${res.status}`)
    const json = (await res.json()) as {
      data: Array<{ starting_at: string; results: Array<{ amount: string }> }>
      has_more: boolean
      next_page: string | null
    }
    for (const bucket of json.data) {
      const day = bucket.starting_at.slice(0, 10)
      const cents = bucket.results.reduce((a, r) => a + (Number(r.amount) || 0), 0)
      byDay.set(day, (byDay.get(day) ?? 0) + cents)
    }
    if (!json.has_more || !json.next_page) break
    page = json.next_page
  }

  return [...byDay.entries()]
    .map(([day, cents]) => ({ day, amountUsd: Math.round(cents) / 100 }))
    .sort((a, b) => a.day.localeCompare(b.day))
}

// ---------------------------------------------------------------- CrUX (stats)

// Core Web Vitals p75 per origin — works for ALL sites (no site-side install).
// 404 = insufficient real-user data for this origin (not an error). Needs a free
// GCP key (CRUX_API_KEY); returns [] with no key so stats degrades gracefully.
export async function fetchCruxMetrics(origin: string): Promise<Omit<ProviderMetric, 'providerProjectId'>[]> {
  const key = Deno.env.get('CRUX_API_KEY')
  if (!key) return []
  const res = await fetch(`https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ origin }),
    signal: timeout(),
  })
  if (res.status === 404) return [] // insufficient data for this origin
  if (!res.ok) throw new Error(`crux ${res.status}`)
  const json = (await res.json()) as {
    record?: { metrics?: Record<string, { percentiles?: { p75?: number | string } }> }
  }
  const metrics = json.record?.metrics ?? {}
  const out: Omit<ProviderMetric, 'providerProjectId'>[] = []
  const push = (cruxKey: string, name: string, unit: string) => {
    const p75 = Number(metrics[cruxKey]?.percentiles?.p75)
    if (Number.isFinite(p75)) out.push({ provider: 'crux', metricName: name, value: p75, unit })
  }
  push('largest_contentful_paint', 'lcp_ms', 'ms')
  push('interaction_to_next_paint', 'inp_ms', 'ms')
  push('cumulative_layout_shift', 'cls', 'score')
  return out
}
