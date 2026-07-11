// techkit-webhook — deployment webhook receiver (TECHKIT-BRIEF §5.2).
// Separate from techkit-poller because it authenticates differently (provider
// signatures, not CRON_SECRET). Writes deploy_events; opens a warning alert on
// failed production deploys. The poller's openIncident() reads deploy_events to
// correlate downtime with a recent deploy.
//
//   POST /techkit-webhook?provider=vercel   — verify x-vercel-signature (HMAC-SHA1)
//   POST /techkit-webhook?provider=railway  — Railway project webhook (URL-as-secret,
//                                             optional ?token= match)
// Deploy: multipart Management API deploy (verify_jwt=false via config.toml).
import { serviceClient } from '../_shared/supabase.ts'
import { deliverAlert } from '../_shared/notify.ts'

interface DeployEvent {
  provider: 'vercel' | 'railway'
  provider_project_id: string | null
  deployment_id: string
  environment: string | null
  status: string // created | building | succeeded | failed | canceled
  actor: string | null
  url: string | null
  occurred_at: string
  raw: unknown
}

Deno.serve(async (req) => {
  if (req.method === 'GET') return json({ ok: true, service: 'techkit-webhook' })
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405)

  const provider = new URL(req.url).searchParams.get('provider')
  const rawBody = await req.text()

  try {
    if (provider === 'vercel') return json(await handleVercel(req, rawBody))
    if (provider === 'railway') return json(await handleRailway(req, rawBody))
    return json({ error: `unknown or missing provider "${provider ?? ''}"` }, 400)
  } catch (err) {
    console.error('webhook failed:', provider, err)
    return json({ error: err instanceof Error ? err.message : 'internal error' }, 500)
  }
})

// ------------------------------------------------------------------- Vercel

async function handleVercel(req: Request, rawBody: string) {
  const secret = Deno.env.get('VERCEL_WEBHOOK_SECRET')
  const signature = req.headers.get('x-vercel-signature') ?? ''
  if (!secret) return { error: 'VERCEL_WEBHOOK_SECRET not set' }
  if (!(await verifyHmacSha1(rawBody, signature, secret))) {
    return { error: 'invalid signature' }
  }

  const evt = JSON.parse(rawBody) as {
    type?: string
    createdAt?: number
    payload?: {
      deployment?: { id?: string; url?: string; name?: string; meta?: { githubCommitAuthorName?: string } }
      project?: { id?: string }
      target?: string | null
      user?: { username?: string }
    }
  }
  const type = evt.type ?? ''
  if (!type.startsWith('deployment.')) return { ok: true, ignored: type }

  const dep = evt.payload?.deployment
  const status = mapVercelStatus(type)
  const event: DeployEvent = {
    provider: 'vercel',
    provider_project_id: evt.payload?.project?.id ?? null,
    deployment_id: dep?.id ?? `unknown-${evt.createdAt ?? ''}`,
    environment: evt.payload?.target ?? 'preview',
    status,
    actor: dep?.meta?.githubCommitAuthorName ?? evt.payload?.user?.username ?? null,
    url: dep?.url ? `https://${dep.url}` : null,
    occurred_at: evt.createdAt ? new Date(evt.createdAt).toISOString() : new Date().toISOString(),
    raw: evt,
  }
  return await persist(event)
}

function mapVercelStatus(type: string): string {
  switch (type) {
    case 'deployment.created':
      return 'created'
    case 'deployment.succeeded':
    case 'deployment.ready':
    case 'deployment.promoted':
      return 'succeeded'
    case 'deployment.error':
      return 'failed'
    case 'deployment.canceled':
      return 'canceled'
    default:
      return 'building'
  }
}

// ------------------------------------------------------------------ Railway

async function handleRailway(req: Request, rawBody: string) {
  // Railway project webhooks have no signature; the URL itself is the secret.
  // If RAILWAY_WEBHOOK_TOKEN is set, require a matching ?token= for defense in depth.
  const expected = Deno.env.get('RAILWAY_WEBHOOK_TOKEN')
  if (expected) {
    const token = new URL(req.url).searchParams.get('token') ?? ''
    if (token !== expected) return { error: 'invalid token' }
  }

  const evt = JSON.parse(rawBody) as {
    type?: string
    status?: string
    timestamp?: string
    project?: { id?: string; name?: string }
    environment?: { name?: string }
    deployment?: { id?: string; meta?: { commitAuthor?: string } }
    service?: { name?: string }
  }
  if (evt.type && evt.type !== 'DEPLOY') return { ok: true, ignored: evt.type }

  const event: DeployEvent = {
    provider: 'railway',
    provider_project_id: evt.project?.id ?? null,
    deployment_id: evt.deployment?.id ?? `${evt.project?.id ?? 'unknown'}-${evt.timestamp ?? ''}`,
    environment: evt.environment?.name ?? null,
    status: mapRailwayStatus(evt.status ?? ''),
    actor: evt.deployment?.meta?.commitAuthor ?? null,
    url: null,
    occurred_at: evt.timestamp ? new Date(evt.timestamp).toISOString() : new Date().toISOString(),
    raw: evt,
  }
  return await persist(event)
}

function mapRailwayStatus(status: string): string {
  switch (status.toUpperCase()) {
    case 'SUCCESS':
      return 'succeeded'
    case 'FAILED':
    case 'CRASHED':
      return 'failed'
    case 'BUILDING':
    case 'DEPLOYING':
    case 'INITIALIZING':
      return 'building'
    case 'REMOVED':
    case 'REMOVING':
      return 'canceled'
    default:
      return status.toLowerCase() || 'building'
  }
}

// ------------------------------------------------------------------ persist

async function persist(event: DeployEvent) {
  const supabase = serviceClient()

  // resolve project_id from the provider-side id
  let projectId: string | null = null
  let projectName: string | null = null
  if (event.provider_project_id) {
    const col = event.provider === 'vercel' ? 'vercel_project_id' : 'railway_project_id'
    const { data } = await supabase.from('projects').select('id, name').eq(col, event.provider_project_id).maybeSingle()
    if (data) {
      projectId = data.id
      projectName = data.name
    }
  }

  const { error } = await supabase.from('deploy_events').upsert(
    {
      provider: event.provider,
      project_id: projectId,
      provider_project_id: event.provider_project_id,
      deployment_id: event.deployment_id,
      environment: event.environment,
      status: event.status,
      actor: event.actor,
      url: event.url,
      raw: event.raw,
      occurred_at: event.occurred_at,
    },
    { onConflict: 'provider,deployment_id,status', ignoreDuplicates: true }
  )
  if (error) {
    console.error('deploy_events upsert failed:', error.message)
    return { error: error.message }
  }

  // Failed production deploy → open a built-in warning alert (§5.2)
  const isProd = (event.environment ?? '').toLowerCase() === 'production'
  let alerted = false
  if (event.status === 'failed' && isProd) {
    const label = projectName ?? event.provider_project_id ?? event.provider
    const title = `Deploy failed: ${label}`
    const message = [
      `${event.provider} production deploy ${event.deployment_id} failed`,
      event.actor ? `by ${event.actor}` : null,
      event.occurred_at.slice(0, 16).replace('T', ' ') + ' UTC',
    ]
      .filter(Boolean)
      .join('\n')
    const notified = await deliverAlert({ severity: 'warning', title, message })
    await supabase.from('alert_events').insert({
      project_id: projectId,
      severity: 'warning',
      title,
      message,
      status: 'open',
      notified_channels: notified,
    })
    alerted = true
  }

  return { ok: true, provider: event.provider, status: event.status, project: projectName, alerted }
}

// --------------------------------------------------------------------- util

async function verifyHmacSha1(body: string, signatureHex: string, secret: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body))
  const computed = [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('')
  return timingSafeEqual(computed, signatureHex.toLowerCase())
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
