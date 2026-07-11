// techkit-poller — single Edge Function with a `task` switch (TECHKIT-BRIEF §5.1).
// Invoked by pg_cron via net.http_post with `Authorization: Bearer <CRON_SECRET>`,
// or by the CC "Check now" button with `{ task: "uptime", endpoint_id: "<uuid>" }`.
// Deploy: supabase functions deploy techkit-poller --no-verify-jwt
import { serviceClient } from '../_shared/supabase.ts'
import { deliverAlert, type Severity } from '../_shared/notify.ts'
import {
  fetchSupabaseMetrics,
  fetchRailwayMetrics,
  fetchVercelMetrics,
  fetchVercelDeployments,
  fetchCruxMetrics,
  fetchAnthropicCosts,
  type ProviderMetric,
} from '../_shared/providers.ts'

const FETCH_TIMEOUT_MS = 10_000
// slack so a 5-min cron doesn't skip endpoints checked 299s ago
const DUE_SLACK_SECS = 30

interface Endpoint {
  id: string
  project_id: string | null
  name: string
  url: string
  method: string
  expected_status_min: number
  expected_status_max: number
  keyword: string | null
  degraded_latency_ms: number
  check_interval_secs: number
  is_active: boolean
  current_status: string
  consecutive_failures: number
  open_alert_id: string | null
  last_checked_at: string | null
  projects: { name: string } | null
}

interface CheckResult {
  status: 'up' | 'degraded' | 'down'
  http_status: number | null
  latency_ms: number | null
  error: string | null
}

Deno.serve(async (req) => {
  const auth = req.headers.get('authorization') ?? ''
  const secret = Deno.env.get('CRON_SECRET')
  if (!secret || auth !== `Bearer ${secret}`) {
    return json({ error: 'unauthorized' }, 401)
  }

  let body: { task?: string; endpoint_id?: string } = {}
  try {
    body = await req.json()
  } catch {
    // empty body → task undefined → 400 below
  }

  try {
    switch (body.task) {
      case 'uptime':
        return json(await runUptime(body.endpoint_id))
      case 'rollup':
        return json(await runRollup())
      case 'retention':
        return json(await runRetention())
      case 'providers':
        return json(await runProviders())
      case 'stats':
        return json(await runStats())
      case 'costs':
        return json(await runCosts())
      case 'digest':
        return json({ error: `task "${body.task}" not implemented yet (Session D)` }, 501)
      default:
        return json({ error: `unknown task "${body.task ?? ''}"` }, 400)
    }
  } catch (err) {
    console.error('poller task failed:', body.task, err)
    return json({ error: err instanceof Error ? err.message : 'internal error' }, 500)
  }
})

// ---------------------------------------------------------------- task=uptime

async function runUptime(endpointId?: string) {
  const supabase = serviceClient()

  let query = supabase.from('monitored_endpoints').select('*, projects(name)')
  if (endpointId) {
    // "Check now" runs regardless of is_active / interval
    query = query.eq('id', endpointId)
  } else {
    query = query.eq('is_active', true)
  }
  const { data, error } = await query
  if (error) throw new Error(`endpoint fetch failed: ${error.message}`)

  const now = Date.now()
  const due = (data as Endpoint[]).filter((e) => {
    if (endpointId) return true
    if (!e.last_checked_at) return true
    const elapsed = (now - new Date(e.last_checked_at).getTime()) / 1000
    return elapsed >= e.check_interval_secs - DUE_SLACK_SECS
  })

  const outcomes = await Promise.allSettled(due.map((e) => processEndpoint(supabase, e)))
  const summary = outcomes.map((o, i) =>
    o.status === 'fulfilled'
      ? { endpoint: due[i].name, ...o.value }
      : { endpoint: due[i].name, error: String(o.reason) }
  )
  return { ok: true, task: 'uptime', checked: due.length, results: summary }
}

async function processEndpoint(
  supabase: ReturnType<typeof serviceClient>,
  endpoint: Endpoint
) {
  const check = await checkUrl(endpoint)

  const { error: insertErr } = await supabase.from('uptime_checks').insert({
    endpoint_id: endpoint.id,
    status: check.status,
    http_status: check.http_status,
    latency_ms: check.latency_ms,
    error: check.error,
  })
  if (insertErr) console.error('uptime_checks insert failed:', insertErr.message)

  let consecutiveFailures = endpoint.consecutive_failures
  let openAlertId = endpoint.open_alert_id
  let event: string | null = null

  if (check.status === 'up') {
    if (openAlertId) {
      event = await resolveIncident(supabase, endpoint, openAlertId)
      openAlertId = null
    }
    consecutiveFailures = 0
  } else {
    consecutiveFailures += 1
    // §6.1: down opens after 2 consecutive failures (critical); degraded after 3 (warning)
    const threshold = check.status === 'down' ? 2 : 3
    if (consecutiveFailures >= threshold && !openAlertId) {
      openAlertId = await openIncident(supabase, endpoint, check, consecutiveFailures)
      event = 'opened'
    }
  }

  const { error: updateErr } = await supabase
    .from('monitored_endpoints')
    .update({
      current_status: check.status,
      consecutive_failures: consecutiveFailures,
      open_alert_id: openAlertId,
      last_checked_at: new Date().toISOString(),
    })
    .eq('id', endpoint.id)
  if (updateErr) console.error('endpoint state update failed:', updateErr.message)

  return { status: check.status, latency_ms: check.latency_ms, incident: event }
}

async function checkUrl(endpoint: Endpoint): Promise<CheckResult> {
  const started = performance.now()
  try {
    const res = await fetch(endpoint.url, {
      method: endpoint.method === 'HEAD' ? 'HEAD' : 'GET',
      redirect: 'follow',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { 'User-Agent': 'MDN-TechKit-Monitor/1.0 (+https://mdntech.org)' },
    })
    const latency = Math.round(performance.now() - started)

    if (res.status < endpoint.expected_status_min || res.status > endpoint.expected_status_max) {
      await res.body?.cancel()
      return { status: 'down', http_status: res.status, latency_ms: latency, error: `http ${res.status}` }
    }

    if (endpoint.keyword && endpoint.method !== 'HEAD') {
      const text = await res.text()
      if (!text.includes(endpoint.keyword)) {
        return { status: 'down', http_status: res.status, latency_ms: latency, error: 'keyword-miss' }
      }
    } else {
      await res.body?.cancel()
    }

    if (latency > endpoint.degraded_latency_ms) {
      return { status: 'degraded', http_status: res.status, latency_ms: latency, error: `slow: ${latency}ms > ${endpoint.degraded_latency_ms}ms` }
    }
    return { status: 'up', http_status: res.status, latency_ms: latency, error: null }
  } catch (err) {
    const latency = Math.round(performance.now() - started)
    const msg =
      err instanceof DOMException && err.name === 'TimeoutError'
        ? `timeout after ${FETCH_TIMEOUT_MS / 1000}s`
        : err instanceof Error
          ? err.message
          : 'fetch failed'
    return { status: 'down', http_status: null, latency_ms: latency, error: msg }
  }
}

async function openIncident(
  supabase: ReturnType<typeof serviceClient>,
  endpoint: Endpoint,
  check: CheckResult,
  failures: number
): Promise<string | null> {
  const severity: Severity = check.status === 'down' ? 'critical' : 'warning'
  const icon = severity === 'critical' ? '🔴' : '🟠'
  const label = check.status === 'down' ? 'DOWN' : 'DEGRADED'
  const title = `${icon} ${label}: ${endpoint.name}`

  const lines = [
    `${check.error ?? 'check failed'} · ${failures} consecutive failures`,
    `Since: ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC${endpoint.projects ? ` · Project: ${endpoint.projects.name}` : ''}`,
    endpoint.url,
  ]

  // Incident correlation (§5.2): production deploy of the same project in the last 30 min?
  if (endpoint.project_id) {
    const { data: deploys } = await supabase
      .from('deploy_events')
      .select('deployment_id, occurred_at')
      .eq('project_id', endpoint.project_id)
      .eq('environment', 'production')
      .gte('occurred_at', new Date(Date.now() - 30 * 60 * 1000).toISOString())
      .order('occurred_at', { ascending: false })
      .limit(1)
    if (deploys?.length) {
      lines.push(`Possibly caused by deploy ${deploys[0].deployment_id} at ${deploys[0].occurred_at.slice(11, 16)}`)
    }
  }

  const message = lines.join('\n')
  const notified = await deliverAlert({ severity, title, message })

  const { data, error } = await supabase
    .from('alert_events')
    .insert({
      endpoint_id: endpoint.id,
      project_id: endpoint.project_id,
      severity,
      title: `${label}: ${endpoint.name}`,
      message,
      status: 'open',
      notified_channels: notified,
    })
    .select('id')
    .single()
  if (error) {
    console.error('alert_events insert failed:', error.message)
    return null
  }
  return data.id
}

async function resolveIncident(
  supabase: ReturnType<typeof serviceClient>,
  endpoint: Endpoint,
  alertId: string
): Promise<string> {
  const { data: alert } = await supabase
    .from('alert_events')
    .select('severity, opened_at')
    .eq('id', alertId)
    .single()

  await supabase
    .from('alert_events')
    .update({ status: 'resolved', resolved_at: new Date().toISOString() })
    .eq('id', alertId)

  const downMins = alert
    ? Math.max(1, Math.round((Date.now() - new Date(alert.opened_at).getTime()) / 60_000))
    : null
  await deliverAlert({
    severity: (alert?.severity ?? 'critical') as Severity,
    title: `🟢 UP again: ${endpoint.name}`,
    message: downMins !== null ? `Downtime ${downMins} min` : 'Recovered',
  })
  return 'resolved'
}

// ---------------------------------------------------------------- task=rollup

async function runRollup() {
  const supabase = serviceClient()
  const { error } = await supabase.rpc('techkit_rollup_hourly')
  if (error) throw new Error(`rollup failed: ${error.message}`)
  return { ok: true, task: 'rollup' }
}

// ------------------------------------------------------------- task=retention

async function runRetention() {
  const supabase = serviceClient()
  const checksCutoff = new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString()
  const metricsCutoff = new Date(Date.now() - 365 * 24 * 3600 * 1000).toISOString()

  const { error: e1 } = await supabase.from('uptime_checks').delete().lt('checked_at', checksCutoff)
  if (e1) console.error('uptime_checks retention failed:', e1.message)
  const { error: e2 } = await supabase.from('infra_metrics').delete().lt('recorded_at', metricsCutoff)
  if (e2) console.error('infra_metrics retention failed:', e2.message)

  return { ok: true, task: 'retention', errors: [e1?.message, e2?.message].filter(Boolean) }
}

// ------------------------------------------------------------ task=providers

interface ProjectRow {
  id: string
  name: string
  supabase_project_ref: string | null
  railway_project_id: string | null
  vercel_project_id: string | null
}

async function runProviders() {
  const supabase = serviceClient()
  const { data: projects, error: pErr } = await supabase
    .from('projects')
    .select('id, name, supabase_project_ref, railway_project_id, vercel_project_id')
  if (pErr) throw new Error(`projects fetch failed: ${pErr.message}`)

  const rows = projects as ProjectRow[]
  const supabaseMap = new Map(rows.filter((p) => p.supabase_project_ref).map((p) => [p.supabase_project_ref!, p.id]))
  const railwayMap = new Map(rows.filter((p) => p.railway_project_id).map((p) => [p.railway_project_id!, p.id]))
  const vercelMap = new Map(rows.filter((p) => p.vercel_project_id).map((p) => [p.vercel_project_id!, p.id]))
  const nameById = new Map(rows.map((p) => [p.id, p.name]))

  const collectors: Array<[string, Promise<ProviderMetric[]>]> = [
    ['supabase', fetchSupabaseMetrics()],
    ['railway', fetchRailwayMetrics()],
    ['vercel', fetchVercelMetrics()],
  ]
  const settled = await Promise.allSettled(collectors.map(([, p]) => p))

  const batchTime = new Date().toISOString()
  const metricRows: Array<Record<string, unknown>> = []
  const errors: string[] = []
  settled.forEach((s, i) => {
    const provider = collectors[i][0]
    if (s.status === 'rejected') {
      errors.push(`${provider}: ${String(s.reason)}`)
      return
    }
    for (const m of s.value) {
      const project_id =
        m.providerProjectId === null
          ? null
          : m.provider === 'supabase'
            ? supabaseMap.get(m.providerProjectId) ?? null
            : m.provider === 'railway'
              ? railwayMap.get(m.providerProjectId) ?? null
              : m.provider === 'vercel'
                ? vercelMap.get(m.providerProjectId) ?? null
                : null
      metricRows.push({
        project_id,
        provider: m.provider,
        metric_name: m.metricName,
        metric_value: m.value,
        unit: m.unit,
        recorded_at: batchTime,
      })
    }
  })

  if (metricRows.length > 0) {
    const { error: insErr } = await supabase.from('infra_metrics').insert(metricRows)
    if (insErr) errors.push(`insert: ${insErr.message}`)
  }

  // Deploy feed via polling (Vercel webhooks are Pro-only; poll the read API instead).
  const deploy = await ingestVercelDeploys(supabase, vercelMap, nameById, errors)

  const fired = await evaluateMetricRules(supabase, nameById)

  return {
    ok: true,
    task: 'providers',
    metrics_written: metricRows.length,
    deploys_ingested: deploy.ingested,
    deploy_alerts: deploy.alerts,
    alerts_fired: fired,
    errors,
  }
}

// Poll recent production deploys → deploy_events; alert on NEW failures only.
async function ingestVercelDeploys(
  supabase: ReturnType<typeof serviceClient>,
  vercelMap: Map<string, string>,
  nameById: Map<string, string>,
  errors: string[]
): Promise<{ ingested: number; alerts: number }> {
  let ingested = 0
  let alerts = 0
  try {
    const records = await fetchVercelDeployments()
    if (records.length === 0) return { ingested, alerts }

    const ids = records.map((r) => r.deployment_id)
    const { data: existing } = await supabase
      .from('deploy_events')
      .select('deployment_id, status')
      .eq('provider', 'vercel')
      .in('deployment_id', ids)
    const existingSet = new Set(
      ((existing ?? []) as Array<{ deployment_id: string; status: string }>).map((e) => `${e.deployment_id}|${e.status}`)
    )

    const rows = records.map((r) => ({
      provider: 'vercel',
      project_id: r.vercelProjectId ? vercelMap.get(r.vercelProjectId) ?? null : null,
      provider_project_id: r.vercelProjectId,
      deployment_id: r.deployment_id,
      environment: r.environment,
      status: r.status,
      actor: r.actor,
      url: r.url,
      raw: r.raw,
      occurred_at: r.occurred_at,
    }))
    const { error: upErr } = await supabase
      .from('deploy_events')
      .upsert(rows, { onConflict: 'provider,deployment_id,status', ignoreDuplicates: true })
    if (upErr) {
      errors.push(`deploy upsert: ${upErr.message}`)
      return { ingested, alerts }
    }
    ingested = rows.length

    // Alert only on NEW failed production deploys from the last 90 min — so the
    // first poll backfills history silently instead of firing on old failures.
    const recentMs = 90 * 60_000
    for (const r of records) {
      if (
        r.status === 'failed' &&
        r.environment === 'production' &&
        !existingSet.has(`${r.deployment_id}|failed`) &&
        Date.now() - new Date(r.occurred_at).getTime() < recentMs
      ) {
        const pid = r.vercelProjectId ? vercelMap.get(r.vercelProjectId) ?? null : null
        const label = pid ? nameById.get(pid) ?? 'Vercel project' : 'Vercel project'
        const title = `Deploy failed: ${label}`
        const message = [
          `vercel production deploy ${r.deployment_id} failed`,
          r.actor ? `by ${r.actor}` : null,
          r.occurred_at.slice(0, 16).replace('T', ' ') + ' UTC',
        ]
          .filter(Boolean)
          .join('\n')
        const notified = await deliverAlert({ severity: 'warning', title, message })
        await supabase.from('alert_events').insert({
          project_id: pid,
          severity: 'warning',
          title,
          message,
          status: 'open',
          notified_channels: notified,
        })
        alerts++
      }
    }
  } catch (err) {
    errors.push(`deploys: ${err instanceof Error ? err.message : String(err)}`)
  }
  return { ingested, alerts }
}

// §6.2 rule-based metric alerts. Latest value per project for the rule's
// provider+metric_name; fire once per rule (cooldown-guarded) if any breaches.
async function evaluateMetricRules(
  supabase: ReturnType<typeof serviceClient>,
  nameById: Map<string, string>
): Promise<number> {
  const { data: rules, error } = await supabase
    .from('alert_rules')
    .select('*')
    .eq('scope', 'metric')
    .eq('is_active', true)
  if (error || !rules?.length) return 0

  let fired = 0
  for (const rule of rules as Array<Record<string, unknown>>) {
    const provider = rule.provider as string | null
    const metricName = rule.metric_name as string | null
    if (!provider || !metricName) continue

    let q = supabase
      .from('infra_metrics')
      .select('project_id, metric_value, recorded_at')
      .eq('provider', provider)
      .eq('metric_name', metricName)
      .order('recorded_at', { ascending: false })
      .limit(60)
    if (rule.project_id) q = q.eq('project_id', rule.project_id as string)
    const { data: metrics } = await q
    if (!metrics?.length) continue

    // latest value per project
    const latest = new Map<string, number>()
    for (const m of metrics as Array<{ project_id: string | null; metric_value: number }>) {
      const key = m.project_id ?? 'account'
      if (!latest.has(key)) latest.set(key, Number(m.metric_value))
    }

    const condition = (rule.condition as string) ?? 'gt'
    const threshold = Number(rule.threshold)
    const breaches = [...latest.entries()].filter(([, v]) =>
      condition === 'lt' ? v < threshold : v > threshold
    )
    if (breaches.length === 0) continue

    // cooldown guard
    const cooldownMs = (Number(rule.cooldown_minutes) || 240) * 60_000
    if (rule.last_fired_at && Date.now() - new Date(rule.last_fired_at as string).getTime() < cooldownMs) continue

    breaches.sort((a, b) => (condition === 'lt' ? a[1] - b[1] : b[1] - a[1]))
    const [worstKey, worstVal] = breaches[0]
    const worstProject = worstKey === 'account' ? null : worstKey
    const projectLabel = worstProject ? nameById.get(worstProject) ?? worstProject : 'account-level'
    const severity = ((rule.severity as string) ?? 'warning') as Severity

    const title = `${rule.name}`
    const message = [
      `${projectLabel}: ${metricName} = ${worstVal} (${condition === 'lt' ? '<' : '>'} ${threshold})`,
      breaches.length > 1 ? `${breaches.length} projects breaching this rule` : null,
    ]
      .filter(Boolean)
      .join('\n')

    const notified = await deliverAlert({ severity, title, message })
    const { error: insErr } = await supabase.from('alert_events').insert({
      rule_id: rule.id,
      project_id: worstProject,
      severity,
      title,
      message,
      status: 'open',
      notified_channels: notified,
    })
    if (insErr) {
      console.error('metric alert insert failed:', insErr.message)
      continue
    }
    await supabase.from('alert_rules').update({ last_fired_at: new Date().toISOString() }).eq('id', rule.id)
    fired++
  }
  return fired
}

// ---------------------------------------------------------------- task=costs

// Flat monthly plan prices written as `static-config` rows (§9 fallback) so the
// cost dashboard renders per-provider even where no billing API exists. Both are
// on free tiers today — bump here if a plan is upgraded. Railway is intentionally
// absent: its plan price varies and the usage API is plan-dependent — enter it
// via the manual form on the Costs page instead.
const STATIC_MONTHLY_COSTS: Record<string, number> = {
  supabase: 0,
  vercel: 0,
}

async function runCosts() {
  const supabase = serviceClient()
  const notes: Record<string, unknown> = {}
  const rows: Array<Record<string, unknown>> = []

  // 1. Anthropic daily spend (Admin API — closes repo priority 8). Re-fetches a
  // 31-day window and upserts, so late-arriving data and missed crons self-heal.
  try {
    const buckets = await fetchAnthropicCosts()
    if (buckets.length === 0 && !Deno.env.get('ANTHROPIC_ADMIN_API_KEY')) {
      notes.anthropic = 'skipped — ANTHROPIC_ADMIN_API_KEY not set (create an Admin key in the Anthropic Console)'
    } else {
      for (const b of buckets) {
        rows.push({
          project_id: null,
          provider: 'anthropic',
          cost_amount: b.amountUsd,
          currency: 'USD',
          period_start: b.day,
          period_end: b.day,
          source: 'api',
        })
      }
      notes.anthropic = { days: buckets.length }
    }
  } catch (err) {
    notes.anthropic_error = err instanceof Error ? err.message : String(err)
  }

  // 2. Static-config flat plan rows for the current calendar month.
  const now = new Date()
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
  const monthEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0))
  for (const [provider, amount] of Object.entries(STATIC_MONTHLY_COSTS)) {
    rows.push({
      project_id: null,
      provider,
      cost_amount: amount,
      currency: 'USD',
      period_start: monthStart.toISOString().slice(0, 10),
      period_end: monthEnd.toISOString().slice(0, 10),
      source: 'static-config',
    })
  }

  // Upsert needs the NULLS NOT DISTINCT unique constraint from migration 014 —
  // account-level rows carry project_id null, which plain UNIQUE treats as distinct.
  let upserted = 0
  if (rows.length > 0) {
    const { error } = await supabase
      .from('infra_costs')
      .upsert(rows, { onConflict: 'provider,project_id,period_start,period_end' })
    if (error) notes.upsert_error = error.message
    else upserted = rows.length
  }

  const fired = await evaluateCostRules(supabase)
  return { ok: true, task: 'costs', rows_upserted: upserted, alerts_fired: fired, notes }
}

// §6.2 scope='cost' rules. rule.metric_name picks the aggregation:
//   daily_cost — sum of per-day rows (period_start = period_end = yesterday UTC)
//   mtd_cost   — sum of all rows whose period starts in the current month
// rule.provider null = across all providers. Cooldown-guarded like metric rules.
async function evaluateCostRules(supabase: ReturnType<typeof serviceClient>): Promise<number> {
  const { data: rules, error } = await supabase
    .from('alert_rules')
    .select('*')
    .eq('scope', 'cost')
    .eq('is_active', true)
  if (error || !rules?.length) return 0

  const monthStartStr = new Date().toISOString().slice(0, 8) + '01'
  const yesterdayStr = new Date(Date.now() - 86400_000).toISOString().slice(0, 10)
  const { data: costRows } = await supabase
    .from('infra_costs')
    .select('provider, cost_amount, period_start, period_end')
    .gte('period_start', monthStartStr < yesterdayStr ? monthStartStr : yesterdayStr)
  const costs = (costRows ?? []) as Array<{
    provider: string
    cost_amount: number
    period_start: string
    period_end: string
  }>

  let fired = 0
  for (const rule of rules as Array<Record<string, unknown>>) {
    const provider = rule.provider as string | null
    const kind = rule.metric_name as string | null
    let value: number
    let label: string
    if (kind === 'daily_cost') {
      value = costs
        .filter((c) => c.period_start === yesterdayStr && c.period_end === yesterdayStr && (!provider || c.provider === provider))
        .reduce((a, c) => a + Number(c.cost_amount), 0)
      label = `${provider ?? 'all providers'} on ${yesterdayStr}`
    } else if (kind === 'mtd_cost') {
      value = costs
        .filter((c) => c.period_start >= monthStartStr && (!provider || c.provider === provider))
        .reduce((a, c) => a + Number(c.cost_amount), 0)
      label = `${provider ?? 'all providers'} month-to-date`
    } else {
      continue
    }

    const condition = (rule.condition as string) ?? 'gt'
    const threshold = Number(rule.threshold)
    const breached = condition === 'lt' ? value < threshold : value > threshold
    if (!breached) continue

    const cooldownMs = (Number(rule.cooldown_minutes) || 240) * 60_000
    if (rule.last_fired_at && Date.now() - new Date(rule.last_fired_at as string).getTime() < cooldownMs) continue

    const severity = ((rule.severity as string) ?? 'warning') as Severity
    const title = `${rule.name}`
    const message = `${label}: $${value.toFixed(2)} (${condition === 'lt' ? '<' : '>'} $${threshold.toFixed(2)})`

    const notified = await deliverAlert({ severity, title, message })
    const { error: insErr } = await supabase.from('alert_events').insert({
      rule_id: rule.id,
      severity,
      title,
      message,
      status: 'open',
      notified_channels: notified,
    })
    if (insErr) {
      console.error('cost alert insert failed:', insErr.message)
      continue
    }
    await supabase.from('alert_rules').update({ last_fired_at: new Date().toISOString() }).eq('id', rule.id)
    fired++
  }
  return fired
}

// ---------------------------------------------------------------- task=stats

async function runStats() {
  const supabase = serviceClient()
  const batchTime = new Date().toISOString()
  const metricRows: Array<Record<string, unknown>> = []
  const notes: Record<string, unknown> = {}

  // 1. ChatKit cross-project rollup (surfaces the stored-but-hidden chat_messages fields)
  const since = new Date(Date.now() - 24 * 3600_000).toISOString()
  try {
    const { data, error } = await supabase.rpc('techkit_chatkit_rollup', { p_since: since })
    if (error) throw new Error(error.message)
    const agg = (Array.isArray(data) ? data[0] : data) as
      | { messages: number; tokens_in: number; tokens_out: number; avg_latency_ms: number | null; p95_latency_ms: number | null }
      | undefined
    if (agg) {
      const ck = (name: string, value: number | null, unit: string) => {
        if (value !== null && Number.isFinite(Number(value)))
          metricRows.push({ project_id: null, provider: 'chatkit', metric_name: name, metric_value: Number(value), unit, recorded_at: batchTime })
      }
      ck('messages_24h', Number(agg.messages ?? 0), 'count')
      ck('tokens_in_24h', Number(agg.tokens_in ?? 0), 'count')
      ck('tokens_out_24h', Number(agg.tokens_out ?? 0), 'count')
      ck('avg_latency_ms', agg.avg_latency_ms, 'ms')
      ck('p95_latency_ms', agg.p95_latency_ms, 'ms')
      notes.chatkit = { messages_24h: Number(agg.messages ?? 0) }
    }
  } catch (err) {
    notes.chatkit_error = err instanceof Error ? err.message : String(err)
  }

  // 2. CrUX real-user vitals per distinct origin of an active endpoint
  const { data: endpoints } = await supabase
    .from('monitored_endpoints')
    .select('url, project_id')
    .eq('is_active', true)
  const originToProject = new Map<string, string | null>()
  for (const e of (endpoints ?? []) as Array<{ url: string; project_id: string | null }>) {
    try {
      const origin = new URL(e.url).origin
      if (!originToProject.has(origin)) originToProject.set(origin, e.project_id)
    } catch {
      // malformed URL — skip
    }
  }
  const cruxOrigins: string[] = []
  for (const [origin, projectId] of originToProject) {
    try {
      const vitals = await fetchCruxMetrics(origin)
      if (vitals.length > 0) {
        cruxOrigins.push(origin)
        for (const v of vitals) {
          metricRows.push({
            project_id: projectId,
            provider: 'crux',
            metric_name: v.metricName,
            metric_value: v.value,
            unit: v.unit,
            label: origin, // CrUX is origin-level; label separates origins sharing a project
            recorded_at: batchTime,
          })
        }
      }
    } catch (err) {
      notes.crux_error = err instanceof Error ? err.message : String(err)
    }
  }
  notes.crux_origins = cruxOrigins
  if (!Deno.env.get('CRUX_API_KEY')) notes.crux = 'skipped — CRUX_API_KEY not set'

  // 3. Railway CPU/mem + Vercel Web Analytics: probed, deferred.
  // Railway per-service usage metrics vary by plan (MEDIUM confidence, §8) and
  // Vercel has no stable public fetch API for Web Analytics on our plan — CrUX
  // covers vitals and the deploy feed (B2) covers activity, so neither is wired.
  notes.railway_cpu_mem = 'not collected — plan-dependent usage API, deferred'
  notes.vercel_analytics = 'no public fetch API on current plan — using CrUX for vitals'

  if (metricRows.length > 0) {
    const { error } = await supabase.from('infra_metrics').insert(metricRows)
    if (error) notes.insert_error = error.message
  }

  return { ok: true, task: 'stats', metrics_written: metricRows.length, notes }
}

// ----------------------------------------------------------------------- util

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
