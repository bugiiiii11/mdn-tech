import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { hasMarketkitAccess } from '@/lib/marketkit/enrollment'
import { invokeMarketkitWorker } from '@/lib/marketkit/jobs'

export const dynamic = 'force-dynamic'

const ALLOWED_KINDS = ['scan', 'launch_kit', 'sprint_propose', 'sprint_review', 'metrics_screenshot', 'dub_sync'] as const
type Kind = (typeof ALLOWED_KINDS)[number]

// POST /api/portal/marketkit/jobs { project_id, kind } → queue an AI job and
// invoke the worker. The client then polls the mk_jobs row (RLS: owner) for status.
export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!(await hasMarketkitAccess(supabase, user.id))) {
    return NextResponse.json({ error: 'MarketKit not enabled for this account' }, { status: 403 })
  }

  let body: { project_id?: string; kind?: string; input?: Record<string, unknown> }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { project_id, kind } = body
  if (!project_id || !ALLOWED_KINDS.includes(kind as Kind)) {
    return NextResponse.json({ error: 'project_id and a valid kind are required' }, { status: 400 })
  }

  // metrics_screenshot carries the uploaded file's storage path. The worker runs
  // service-role, so pin the path to this project's metrics folder — a foreign
  // path must never reach the worker.
  let input: Record<string, unknown> = {}
  if (kind === 'metrics_screenshot') {
    const storagePath = typeof body.input?.storage_path === 'string' ? body.input.storage_path : ''
    if (!storagePath.startsWith(`mk/${project_id}/metrics/`)) {
      return NextResponse.json({ error: 'invalid storage_path for this project' }, { status: 400 })
    }
    input = {
      storage_path: storagePath,
      filename: typeof body.input?.filename === 'string' ? body.input.filename.slice(0, 200) : null,
    }
  }

  // Ownership check (RLS also enforces this, but fail cleanly with 404).
  const { data: project } = await supabase
    .from('mk_projects')
    .select('id')
    .eq('id', project_id)
    .eq('owner_id', user.id)
    .maybeSingle()
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  // Don't stack duplicate jobs of the same kind while one is in flight.
  const { data: inFlight } = await supabase
    .from('mk_jobs')
    .select('id')
    .eq('project_id', project_id)
    .eq('kind', kind)
    .in('status', ['queued', 'running'])
    .maybeSingle()
  if (inFlight) {
    return NextResponse.json({ error: 'A job of this kind is already running', job_id: inFlight.id }, { status: 409 })
  }

  const { data: job, error } = await supabase
    .from('mk_jobs')
    .insert({ project_id, kind, status: 'queued', input })
    .select('id')
    .single()
  if (error || !job) {
    return NextResponse.json({ error: error?.message ?? 'Could not create job' }, { status: 500 })
  }

  const invoke = await invokeMarketkitWorker(job.id)
  if (!invoke.ok) {
    // Surface the failure and mark the job errored so the UI doesn't spin forever.
    await supabase.from('mk_jobs').update({ status: 'error', error: invoke.error }).eq('id', job.id)
    return NextResponse.json({ error: `Worker unreachable: ${invoke.error}`, job_id: job.id }, { status: 502 })
  }

  return NextResponse.json({ ok: true, job_id: job.id })
}
