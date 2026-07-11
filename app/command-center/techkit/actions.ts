'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

// All actions run under the signed-in admin's session — RLS (is_admin) is the gate.

async function requireUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return { supabase, user }
}

export async function acknowledgeAlert(alertId: string) {
  const { supabase, user } = await requireUser()
  const { error } = await supabase
    .from('alert_events')
    .update({
      status: 'acknowledged',
      acknowledged_at: new Date().toISOString(),
      acknowledged_by: user.id,
    })
    .eq('id', alertId)
    .eq('status', 'open')
  if (error) return { error: error.message }
  revalidatePath('/command-center/techkit')
  revalidatePath('/command-center/techkit/incidents')
  return { ok: true }
}

export async function resolveAlert(alertId: string) {
  const { supabase } = await requireUser()
  const { error } = await supabase
    .from('alert_events')
    .update({ status: 'resolved', resolved_at: new Date().toISOString() })
    .eq('id', alertId)
    .neq('status', 'resolved')
  if (error) return { error: error.message }
  // manual resolve must also unblock the endpoint's state machine
  await supabase
    .from('monitored_endpoints')
    .update({ open_alert_id: null })
    .eq('open_alert_id', alertId)
  revalidatePath('/command-center/techkit')
  revalidatePath('/command-center/techkit/incidents')
  return { ok: true }
}

export interface EndpointInput {
  name: string
  url: string
  project_id: string | null
  method: string
  expected_status_min: number
  expected_status_max: number
  keyword: string | null
  degraded_latency_ms: number
  check_interval_secs: number
  is_active: boolean
}

export async function saveEndpoint(input: EndpointInput, id?: string) {
  const { supabase } = await requireUser()
  const row = { ...input, keyword: input.keyword || null, project_id: input.project_id || null }
  const { error } = id
    ? await supabase.from('monitored_endpoints').update(row).eq('id', id)
    : await supabase.from('monitored_endpoints').insert(row)
  if (error) return { error: error.message }
  revalidatePath('/command-center/techkit')
  revalidatePath('/command-center/techkit/endpoints')
  return { ok: true }
}

export async function deleteEndpoint(id: string) {
  const { supabase } = await requireUser()
  const { error } = await supabase.from('monitored_endpoints').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/command-center/techkit')
  revalidatePath('/command-center/techkit/endpoints')
  return { ok: true }
}

export async function toggleEndpoint(id: string, isActive: boolean) {
  const { supabase } = await requireUser()
  const { error } = await supabase
    .from('monitored_endpoints')
    .update({ is_active: isActive })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/command-center/techkit')
  revalidatePath('/command-center/techkit/endpoints')
  return { ok: true }
}

export interface ManualCostInput {
  provider: string
  project_id: string | null
  cost_amount: number
  period_start: string
  period_end: string
}

export async function addManualCost(input: ManualCostInput) {
  const { supabase } = await requireUser()
  const provider = input.provider.trim().toLowerCase()
  if (!provider) return { error: 'Provider is required' }
  if (!Number.isFinite(input.cost_amount) || input.cost_amount < 0) return { error: 'Amount must be a non-negative number' }
  if (!input.period_start || !input.period_end || input.period_end < input.period_start) {
    return { error: 'Period end must be on or after period start' }
  }
  const { error } = await supabase.from('infra_costs').insert({
    provider,
    project_id: input.project_id || null,
    cost_amount: Math.round(input.cost_amount * 100) / 100,
    currency: 'USD',
    period_start: input.period_start,
    period_end: input.period_end,
    source: 'manual',
  })
  if (error) {
    return {
      error: error.message.includes('duplicate')
        ? 'A cost row for this provider/project/period already exists — delete it first to replace it.'
        : error.message,
    }
  }
  revalidatePath('/command-center/techkit/costs')
  return { ok: true }
}

export async function deleteCost(id: string) {
  const { supabase } = await requireUser()
  const { error } = await supabase.from('infra_costs').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/command-center/techkit/costs')
  return { ok: true }
}

// "Check now" — invokes the poller for one endpoint. Needs CRON_SECRET in the
// Next.js (Vercel) env; degrades to a friendly error until it's set.
export async function checkEndpointNow(endpointId: string) {
  await requireUser()
  const secret = process.env.CRON_SECRET
  if (!secret) return { error: 'CRON_SECRET not set in this environment — add it to Vercel env to enable Check now' }
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/techkit-poller`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${secret}`,
        },
        body: JSON.stringify({ task: 'uptime', endpoint_id: endpointId }),
        signal: AbortSignal.timeout(20_000),
      }
    )
    // The Supabase gateway can return an HTML error page (504 / 546 worker limit)
    // instead of JSON — guard the parse so the user sees a clean status, not
    // "Unexpected token '<'".
    const text = await res.text()
    let json: { error?: string; results?: Array<{ status: string; latency_ms: number | null }> } = {}
    try {
      json = JSON.parse(text)
    } catch {
      return { error: `poller returned HTTP ${res.status} (non-JSON response)` }
    }
    if (!res.ok) return { error: json.error ?? `poller returned ${res.status}` }
    revalidatePath('/command-center/techkit')
    revalidatePath('/command-center/techkit/endpoints')
    return { ok: true, result: json.results?.[0] ?? null }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'poller unreachable' }
  }
}
