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
