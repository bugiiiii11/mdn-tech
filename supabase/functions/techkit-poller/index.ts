// techkit-poller — single Edge Function with a `task` switch (TECHKIT-BRIEF §5.1).
// Invoked by pg_cron via net.http_post with `Authorization: Bearer <CRON_SECRET>`,
// or by the CC "Check now" button with `{ task: "uptime", endpoint_id: "<uuid>" }`.
// Deploy: supabase functions deploy techkit-poller --no-verify-jwt
import { serviceClient } from '../_shared/supabase.ts'
import { deliverAlert, type Severity } from '../_shared/notify.ts'

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
      case 'stats':
      case 'costs':
      case 'digest':
        return json({ error: `task "${body.task}" not implemented yet (Sessions B-D)` }, 501)
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

// ----------------------------------------------------------------------- util

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
