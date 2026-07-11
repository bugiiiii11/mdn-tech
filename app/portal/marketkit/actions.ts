'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { hasMarketkitAccess } from '@/lib/marketkit/enrollment'

// All actions run under the signed-in customer's session — RLS (owner_id) is the
// gate. We additionally verify the marketkit enrolment so a lapsed customer can't
// keep mutating via a stale form.
async function requireEnrolled() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  if (!(await hasMarketkitAccess(supabase, user.id))) throw new Error('MarketKit not enabled')
  return { supabase, user }
}

export async function answerQuestion(questionId: string, answer: string) {
  const { supabase } = await requireEnrolled()
  const trimmed = answer.trim()
  const { data: q, error } = await supabase
    .from('mk_founder_questions')
    .update(
      trimmed
        ? { answer: trimmed, answered_at: new Date().toISOString(), status: 'answered' }
        : { answer: null, answered_at: null, status: 'open' }
    )
    .eq('id', questionId)
    .select('project_id')
    .single()
  if (error) return { error: error.message }
  revalidatePath(`/portal/marketkit/${q.project_id}`)
  return { ok: true }
}

export async function dismissQuestion(questionId: string) {
  const { supabase } = await requireEnrolled()
  const { data: q, error } = await supabase
    .from('mk_founder_questions')
    .update({ status: 'dismissed' })
    .eq('id', questionId)
    .select('project_id')
    .single()
  if (error) return { error: error.message }
  revalidatePath(`/portal/marketkit/${q.project_id}`)
  return { ok: true }
}

export async function deleteProject(projectId: string) {
  const { supabase } = await requireEnrolled()
  const { error } = await supabase.from('mk_projects').delete().eq('id', projectId)
  if (error) return { error: error.message }
  revalidatePath('/portal/marketkit')
  return { ok: true }
}

// --- Sprint loop (B4) ---

const ACTION_TRANSITIONS: Record<string, string[]> = {
  proposed: ['approved', 'skipped'],
  approved: ['done', 'skipped'],
}

export async function setActionStatus(actionId: string, status: 'approved' | 'done' | 'skipped') {
  const { supabase } = await requireEnrolled()
  const { data: current, error: readErr } = await supabase
    .from('mk_actions')
    .select('status, project_id')
    .eq('id', actionId)
    .single()
  if (readErr) return { error: readErr.message }
  if (!ACTION_TRANSITIONS[current.status]?.includes(status)) {
    return { error: `cannot move a ${current.status} action to ${status}` }
  }
  const { error } = await supabase.from('mk_actions').update({ status }).eq('id', actionId)
  if (error) return { error: error.message }
  revalidatePath(`/portal/marketkit/${current.project_id}`)
  return { ok: true }
}

// --- Metrics (B2) ---

export async function addManualMetric(
  projectId: string,
  input: { metric: string; value: number; platform?: string; period_end?: string }
) {
  const { supabase } = await requireEnrolled()
  const metric = input.metric
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 60)
  if (!metric) return { error: 'metric name is required' }
  if (!Number.isFinite(input.value)) return { error: 'value must be a number' }
  const periodEnd = input.period_end && /^\d{4}-\d{2}-\d{2}$/.test(input.period_end) ? input.period_end : null

  const { error } = await supabase.from('mk_metrics_snapshots').insert({
    project_id: projectId,
    source: 'manual',
    platform: input.platform?.trim() || null,
    metric,
    value: input.value,
    period_end: periodEnd,
  })
  if (error) return { error: error.message }
  revalidatePath(`/portal/marketkit/${projectId}`)
  return { ok: true }
}

export async function deleteMetric(snapshotId: number, projectId: string) {
  const { supabase } = await requireEnrolled()
  const { error } = await supabase.from('mk_metrics_snapshots').delete().eq('id', snapshotId)
  if (error) return { error: error.message }
  revalidatePath(`/portal/marketkit/${projectId}`)
  return { ok: true }
}
