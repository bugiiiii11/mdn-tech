// marketkit-worker — job-queue driven AI pipeline (MARKETKIT-BRIEF §6).
// Invoked fire-and-forget by /api/portal/marketkit/jobs with { job_id } and a
// CRON_SECRET bearer (same shared secret as techkit-poller). Marks the job
// running, returns 202 immediately, and finishes the heavy AI work in the
// background via EdgeRuntime.waitUntil so the caller's fetch can time out safely.
// Session B adds cron batch entrypoints: { task: "sprint_propose_all" | "sprint_review_all" }
// iterate every active project, creating + running one mk_jobs row each (audit trail),
// and send a Telegram summary via the shared notify helpers.
// Deploy: multipart deploy endpoint (no CLI) — see MARKETKIT-SETUP.md.
import { serviceClient } from '../_shared/supabase.ts'
import { sendTelegram } from '../_shared/notify.ts'
import { createDubLink, getDubLinkByExternalId, getDubStats, dubEnabled } from '../_shared/dub.ts'
import { callClaudeJSON, type ClaudeImage } from './claude.ts'
import { encodeBase64 } from 'jsr:@std/encoding/base64'

declare const EdgeRuntime: { waitUntil(p: Promise<unknown>): void }

const BUCKET = 'marketkit-assets'
const MAX_IMAGES = 6
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const MAX_DOCS = 4
const MAX_DOC_CHARS = 8000
const MAX_CRAWL_CHARS = 6000

type Supabase = ReturnType<typeof serviceClient>

Deno.serve(async (req) => {
  const auth = req.headers.get('authorization') ?? ''
  const secret = Deno.env.get('CRON_SECRET')
  if (!secret || auth !== `Bearer ${secret}`) return json({ error: 'unauthorized' }, 401)

  let body: { job_id?: string; task?: string } = {}
  try {
    body = await req.json()
  } catch {
    /* empty */
  }

  const supabase = serviceClient()

  // Cron batch entrypoints (migration 013): one job row per active project.
  if (body.task === 'sprint_propose_all' || body.task === 'sprint_review_all') {
    const kind = body.task === 'sprint_propose_all' ? 'sprint_propose' : 'sprint_review'
    EdgeRuntime.waitUntil(runSprintBatch(supabase, kind))
    return json({ ok: true, task: body.task, status: 'running' }, 202)
  }

  // Daily Dub sync batch (migration 016): refresh tracked-link stats for every
  // active project. Silent (no Telegram) — clicks trickle in, not alert-worthy.
  if (body.task === 'dub_sync_all') {
    EdgeRuntime.waitUntil(runDubSyncBatch(supabase))
    return json({ ok: true, task: body.task, status: 'running' }, 202)
  }

  if (!body.job_id) return json({ error: 'job_id required' }, 400)

  const { data: job, error } = await supabase.from('mk_jobs').select('*').eq('id', body.job_id).single()
  if (error || !job) return json({ error: 'job not found' }, 404)
  if (job.status !== 'queued') return json({ error: `job already ${job.status}` }, 409)

  await supabase
    .from('mk_jobs')
    .update({ status: 'running', started_at: new Date().toISOString() })
    .eq('id', job.id)

  // Background: run to completion after we've answered the HTTP caller.
  EdgeRuntime.waitUntil(runJob(supabase, job))
  return json({ ok: true, job_id: job.id, status: 'running' }, 202)
})

interface JobRow {
  id: string
  kind: string
  project_id: string | null
  input?: Record<string, unknown> | null
}

async function runJob(supabase: Supabase, job: JobRow): Promise<unknown> {
  try {
    let result: unknown
    switch (job.kind) {
      case 'scan':
        result = await runScan(supabase, job.project_id!)
        break
      case 'launch_kit':
        result = await runLaunchKit(supabase, job.project_id!)
        break
      case 'sprint_propose':
        result = await runSprintPropose(supabase, job.project_id!)
        break
      case 'sprint_review':
        result = await runSprintReview(supabase, job.project_id!)
        break
      case 'metrics_screenshot':
        result = await runMetricsScreenshot(supabase, job.project_id!, job.input ?? {})
        break
      case 'dub_sync':
        result = await runDubSync(supabase, job.project_id!)
        break
      default:
        throw new Error(`unknown job kind "${job.kind}"`)
    }
    await supabase
      .from('mk_jobs')
      .update({ status: 'done', result: result as Record<string, unknown>, finished_at: new Date().toISOString() })
      .eq('id', job.id)
    return result
  } catch (err) {
    const message = err instanceof Error ? err.message : 'job failed'
    console.error('marketkit job failed:', job.kind, message)
    await supabase
      .from('mk_jobs')
      .update({ status: 'error', error: message, finished_at: new Date().toISOString() })
      .eq('id', job.id)
    return null
  }
}

// Weekly cron batch: create + run one job per active project, sequentially
// (keeps Claude call concurrency at 1), then send a Telegram summary.
async function runSprintBatch(supabase: Supabase, kind: 'sprint_propose' | 'sprint_review') {
  const { data: projects } = await supabase.from('mk_projects').select('id, name').eq('status', 'active')
  const lines: string[] = []
  for (const project of projects ?? []) {
    const { data: job, error } = await supabase
      .from('mk_jobs')
      .insert({ project_id: project.id, kind, status: 'running', started_at: new Date().toISOString() })
      .select('id, kind, project_id, input')
      .single()
    if (error || !job) {
      console.error('sprint batch: job insert failed for', project.name, error?.message)
      continue
    }
    const result = (await runJob(supabase, job)) as Record<string, unknown> | null
    if (result) {
      const detail =
        kind === 'sprint_propose'
          ? `${result.actions ?? 0} actions proposed`
          : result.reviewed === 0
            ? 'nothing to review'
            : `${result.reviewed} actions reviewed`
      lines.push(`• ${project.name}: ${detail}`)
    } else {
      lines.push(`• ${project.name}: failed (see mk_jobs)`)
    }
  }
  if (lines.length) {
    const title = kind === 'sprint_propose' ? '📋 MarketKit — weekly sprint proposed' : '📊 MarketKit — weekly sprint review'
    await sendTelegram(`${title}\n${lines.join('\n')}\napp.mdntech.org/marketkit`)
  }
}

// ------------------------------------------------------------------ task=scan

async function runScan(supabase: Supabase, projectId: string) {
  const { data: project, error } = await supabase.from('mk_projects').select('*').eq('id', projectId).single()
  if (error || !project) throw new Error('project not found')

  const { images, docs } = await gatherAssets(supabase, projectId)
  const crawl = project.url ? await fetchPageText(project.url) : ''

  const parts: string[] = [
    `PROJECT: ${project.name}`,
    `URL: ${project.url ?? '(none provided)'}`,
    `CATEGORY (owner-declared): ${project.category}`,
    `BUDGET TIER: €${project.budget_tier}/mo`,
    `TARGET LANGUAGE: ${project.language}`,
  ]
  if (docs.length) parts.push(`\nUPLOADED DOCS:\n${docs.join('\n\n---\n\n')}`)
  if (crawl) parts.push(`\nLIVE PAGE TEXT (crawled from ${project.url}):\n${crawl}`)
  if (images.length) parts.push(`\n${images.length} screenshot(s)/logo(s) attached as images below.`)
  parts.push(
    '\nAnalyse this project and return the JSON exactly as specified. Base every field on the evidence above; where evidence is missing, say so plainly rather than inventing traction.'
  )

  const out = await callClaudeJSON<{ profile: unknown; questions: { question: string; why_needed?: string }[] }>({
    model: 'claude-sonnet-5',
    system: SCAN_SYSTEM,
    text: parts.join('\n'),
    images,
    maxTokens: 3000,
    effort: 'medium',
    disableThinking: true,
  })

  // Version the profile.
  const { data: last } = await supabase
    .from('mk_project_profiles')
    .select('version')
    .eq('project_id', projectId)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle()
  const version = (last?.version ?? 0) + 1

  const { error: profErr } = await supabase
    .from('mk_project_profiles')
    .insert({ project_id: projectId, version, profile: out.profile })
  if (profErr) throw new Error(`profile insert failed: ${profErr.message}`)

  const questions = (out.questions ?? []).slice(0, 8).map((q) => ({
    project_id: projectId,
    question: q.question,
    why_needed: q.why_needed ?? null,
    status: 'open',
  }))
  if (questions.length) {
    const { error: qErr } = await supabase.from('mk_founder_questions').insert(questions)
    if (qErr) console.error('questions insert failed:', qErr.message)
  }

  return { profile_version: version, questions: questions.length }
}

// ------------------------------------------------------------- task=launch_kit

async function runLaunchKit(supabase: Supabase, projectId: string) {
  const { data: project, error } = await supabase.from('mk_projects').select('*').eq('id', projectId).single()
  if (error || !project) throw new Error('project not found')

  const { data: profile } = await supabase
    .from('mk_project_profiles')
    .select('profile, version')
    .eq('project_id', projectId)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (!profile) throw new Error('run the AI scan first — no project profile exists yet')

  const { data: answers } = await supabase
    .from('mk_founder_questions')
    .select('question, answer')
    .eq('project_id', projectId)
    .eq('status', 'answered')

  const answered = (answers ?? [])
    .filter((a) => a.answer)
    .map((a) => `Q: ${a.question}\nA: ${a.answer}`)
    .join('\n\n')

  const text = [
    `PROJECT: ${project.name} (${project.url ?? 'no url'})`,
    `CATEGORY: ${project.category}`,
    `BUDGET TIER: €${project.budget_tier}/mo (0 = organic only, 500 = one paid channel, 2000 = 1-2 paid + retargeting)`,
    `CONTENT LANGUAGE: ${project.language}`,
    `\nPROJECT PROFILE (from AI scan):\n${JSON.stringify(profile.profile, null, 2)}`,
    answered ? `\nFOUNDER ANSWERS:\n${answered}` : '',
    '\nProduce the Launch Kit as JSON exactly as specified. Rank channels for THIS category and budget tier using the channel-defaults guidance. Write the content drafts in the project’s content language.',
  ].join('\n')

  const out = await callClaudeJSON<LaunchKitOut>({
    model: 'claude-fable-5',
    system: LAUNCH_KIT_SYSTEM,
    text,
    maxTokens: 8000,
    effort: 'medium',
    fallbackModel: 'claude-opus-4-8',
  })

  const { data: last } = await supabase
    .from('mk_strategies')
    .select('version')
    .eq('project_id', projectId)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle()
  const version = (last?.version ?? 0) + 1

  const { data: strategy, error: sErr } = await supabase
    .from('mk_strategies')
    .insert({
      project_id: projectId,
      version,
      budget_tier: project.budget_tier,
      positioning: out.positioning ?? null,
      icp: out.icp ?? null,
      channel_plan: out.channel_plan ?? null,
      launch_checklist: out.launch_checklist ?? null,
      calendar: out.calendar ?? null,
    })
    .select('id')
    .single()
  if (sErr) throw new Error(`strategy insert failed: ${sErr.message}`)

  const items = (out.content ?? []).slice(0, 10).map((c) => ({
    project_id: projectId,
    platform: c.platform ?? null,
    format: c.format ?? null,
    draft: c.draft ?? null,
    status: 'draft',
  }))
  if (items.length) {
    const { error: cErr } = await supabase.from('mk_content_items').insert(items)
    if (cErr) console.error('content insert failed:', cErr.message)
  }

  return { strategy_id: strategy.id, strategy_version: version, content_items: items.length }
}

interface LaunchKitOut {
  positioning?: string
  icp?: unknown
  channel_plan?: unknown
  launch_checklist?: unknown
  calendar?: unknown
  content?: { platform?: string; format?: string; draft?: string }[]
}

// ---------------------------------------------------------- task=sprint_propose
// The weekly core loop (BRIEF §3.4): 3 concrete actions for the current week,
// each with a UTM-tagged tracking link (M9 — plain UTM now, Dub in backlog B3).

async function runSprintPropose(supabase: Supabase, projectId: string) {
  const { data: project, error } = await supabase.from('mk_projects').select('*').eq('id', projectId).single()
  if (error || !project) throw new Error('project not found')

  const { data: profile } = await supabase
    .from('mk_project_profiles')
    .select('profile')
    .eq('project_id', projectId)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (!profile) throw new Error('run the AI scan first — no project profile exists yet')

  const { data: strategy } = await supabase
    .from('mk_strategies')
    .select('id, positioning, channel_plan, launch_checklist')
    .eq('project_id', projectId)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle()

  const week = mondayOfWeek()

  // One sprint per week: re-rolling replaces unapproved proposals, but never an
  // in-progress week (approved/done/skipped actions committed by the founder).
  const { data: existing } = await supabase
    .from('mk_actions')
    .select('id, status')
    .eq('project_id', projectId)
    .eq('week', week)
  const committed = (existing ?? []).filter((a) => a.status !== 'proposed')
  if (committed.length) {
    throw new Error(`this week's sprint is already in progress (${committed.length} action(s) approved) — review it on the Sprint tab`)
  }
  if (existing?.length) {
    await supabase.from('mk_actions').delete().eq('project_id', projectId).eq('week', week).eq('status', 'proposed')
  }

  // Context: the last 4 weeks of actions (what was tried, what happened) + recent metrics.
  const since = new Date(Date.now() - 28 * 86400_000).toISOString().slice(0, 10)
  const { data: history } = await supabase
    .from('mk_actions')
    .select('week, title, channel, status, expected_outcome, actual_outcome')
    .eq('project_id', projectId)
    .gte('week', since)
    .neq('week', week)
    .order('week', { ascending: false })
    .limit(20)
  const { data: metrics } = await supabase
    .from('mk_metrics_snapshots')
    .select('source, platform, metric, value, period_start, period_end')
    .eq('project_id', projectId)
    .order('ingested_at', { ascending: false })
    .limit(30)

  const text = [
    `PROJECT: ${project.name} (${project.url ?? 'no url'})`,
    `CATEGORY: ${project.category} · BUDGET TIER: €${project.budget_tier}/mo · LANGUAGE: ${project.language}`,
    `SPRINT WEEK: Monday ${week}`,
    `\nPROJECT PROFILE:\n${JSON.stringify(profile.profile, null, 2)}`,
    strategy
      ? `\nSTRATEGY (positioning + ranked channels + checklist):\n${JSON.stringify(
          { positioning: strategy.positioning, channel_plan: strategy.channel_plan, launch_checklist: strategy.launch_checklist },
          null,
          2
        )}`
      : '\nSTRATEGY: none generated yet — propose from the profile and channel defaults.',
    history?.length
      ? `\nPREVIOUS SPRINT ACTIONS (last 4 weeks — do not repeat, build on what worked):\n${JSON.stringify(history, null, 2)}`
      : '\nPREVIOUS SPRINT ACTIONS: none — this is the first sprint.',
    metrics?.length
      ? `\nRECENT METRICS:\n${JSON.stringify(metrics, null, 2)}`
      : '\nRECENT METRICS: none recorded yet.',
    '\nPropose exactly 3 actions for this week as JSON, exactly as specified.',
  ].join('\n')

  const out = await callClaudeJSON<{
    actions: { title: string; channel?: string; effort?: string; cost_eur?: number; expected_outcome?: string }[]
  }>({
    model: 'claude-sonnet-5',
    system: SPRINT_PROPOSE_SYSTEM,
    text,
    maxTokens: 2000,
    effort: 'medium',
    disableThinking: true,
  })

  const proposed = (out.actions ?? []).slice(0, 3)
  if (!proposed.length) throw new Error('model returned no actions')

  let inserted = 0
  for (const a of proposed) {
    // M9: every action ships with a tracked link from day 1 — plain UTM until Dub (B3).
    let linkId: string | null = null
    if (project.url) {
      try {
        const url = new URL(project.url)
        const utm = {
          utm_source: slug(a.channel ?? 'marketkit'),
          utm_medium: 'marketkit',
          utm_campaign: `sprint-${week}`,
        }
        for (const [k, v] of Object.entries(utm)) url.searchParams.set(k, v)
        const { data: link } = await supabase
          .from('mk_links')
          .insert({ project_id: projectId, url: url.toString(), utm })
          .select('id')
          .single()
        linkId = link?.id ?? null
      } catch {
        /* unparseable project URL — action still valid without a link */
      }
    }

    const effort = a.effort === 'S' || a.effort === 'M' || a.effort === 'L' ? a.effort : null
    const { error: aErr } = await supabase.from('mk_actions').insert({
      project_id: projectId,
      strategy_id: strategy?.id ?? null,
      week,
      title: a.title,
      channel: a.channel ?? null,
      effort,
      cost_eur: typeof a.cost_eur === 'number' && isFinite(a.cost_eur) ? a.cost_eur : 0,
      expected_outcome: a.expected_outcome ?? null,
      tracking_link_id: linkId,
      status: 'proposed',
    })
    if (aErr) console.error('action insert failed:', aErr.message)
    else inserted++
  }
  if (!inserted) throw new Error('no actions could be saved')

  return { week, actions: inserted }
}

// ----------------------------------------------------------- task=sprint_review
// Reviews past weeks' committed actions against recorded metrics — honest
// "no data" over invented results. Annotates actual_outcome; status stays
// the founder's call.

async function runSprintReview(supabase: Supabase, projectId: string) {
  const { data: project, error } = await supabase.from('mk_projects').select('*').eq('id', projectId).single()
  if (error || !project) throw new Error('project not found')

  const week = mondayOfWeek()
  const { data: due } = await supabase
    .from('mk_actions')
    .select('id, week, title, channel, status, expected_outcome, tracking_link_id')
    .eq('project_id', projectId)
    .lt('week', week)
    .in('status', ['approved', 'done'])
    .is('reviewed_at', null)
    .order('week', { ascending: true })
  if (!due?.length) return { reviewed: 0 }

  const { data: metrics } = await supabase
    .from('mk_metrics_snapshots')
    .select('source, platform, metric, value, period_start, period_end, ingested_at')
    .eq('project_id', projectId)
    .order('ingested_at', { ascending: false })
    .limit(40)
  const linkIds = due.map((a) => a.tracking_link_id).filter(Boolean) as string[]
  const { data: links } = linkIds.length
    ? await supabase.from('mk_links').select('id, url, clicks, conversions').in('id', linkIds)
    : { data: [] as { id: string; url: string; clicks: number; conversions: number }[] }

  const actionsForModel = due.map((a, i) => ({
    index: i,
    week: a.week,
    title: a.title,
    channel: a.channel,
    status: a.status,
    expected_outcome: a.expected_outcome,
    tracking_link: links?.find((l) => l.id === a.tracking_link_id) ?? null,
  }))

  const text = [
    `PROJECT: ${project.name} (${project.url ?? 'no url'})`,
    `REVIEW DATE: ${new Date().toISOString().slice(0, 10)} (current sprint week starts ${week})`,
    `\nACTIONS TO REVIEW (committed in past weeks, not yet reviewed):\n${JSON.stringify(actionsForModel, null, 2)}`,
    metrics?.length
      ? `\nRECORDED METRICS (newest first):\n${JSON.stringify(metrics, null, 2)}`
      : '\nRECORDED METRICS: none recorded — say so plainly in every review.',
    '\nReview each action as JSON, exactly as specified. Reference actions by their index.',
  ].join('\n')

  const out = await callClaudeJSON<{ reviews: { index: number; actual_outcome: string }[]; week_summary?: string }>({
    model: 'claude-sonnet-5',
    system: SPRINT_REVIEW_SYSTEM,
    text,
    maxTokens: 2000,
    effort: 'medium',
    disableThinking: true,
  })

  const now = new Date().toISOString()
  let reviewed = 0
  for (const r of out.reviews ?? []) {
    const action = due[r.index]
    if (!action || !r.actual_outcome) continue
    const { error: uErr } = await supabase
      .from('mk_actions')
      .update({ actual_outcome: r.actual_outcome, reviewed_at: now })
      .eq('id', action.id)
    if (uErr) console.error('review update failed:', uErr.message)
    else reviewed++
  }

  return { reviewed, week_summary: out.week_summary ?? null }
}

// ------------------------------------------------------ task=metrics_screenshot
// B2: social/analytics screenshot → Claude vision → normalized mk_metrics_snapshots.
// The MVP answer for X/LinkedIn/TikTok/Instagram, where APIs are gated (BRIEF §9).

async function runMetricsScreenshot(supabase: Supabase, projectId: string, input: Record<string, unknown>) {
  const storagePath = typeof input.storage_path === 'string' ? input.storage_path : ''
  if (!storagePath) throw new Error('storage_path missing from job input')

  const { data: blob, error } = await supabase.storage.from(BUCKET).download(storagePath)
  if (error || !blob) throw new Error(`screenshot download failed: ${error?.message ?? 'not found'}`)
  const buf = new Uint8Array(await blob.arrayBuffer())
  if (buf.byteLength > MAX_IMAGE_BYTES) throw new Error('screenshot larger than 5 MB — crop or compress it')

  const filename = typeof input.filename === 'string' ? input.filename : storagePath
  const out = await callClaudeJSON<{
    platform?: string
    period_start?: string | null
    period_end?: string | null
    metrics?: { metric: string; value: number | string; period_start?: string | null; period_end?: string | null }[]
    notes?: string
  }>({
    model: 'claude-sonnet-5',
    system: METRICS_SCREENSHOT_SYSTEM,
    text: `Extract the metrics from this analytics/social screenshot (filename: ${filename}). Return the JSON exactly as specified.`,
    images: [{ media_type: mediaType(filename), data: encodeBase64(buf) }],
    maxTokens: 2000,
    effort: 'medium',
    disableThinking: true,
  })

  const isDate = (s: unknown): s is string => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s)
  const rows = (out.metrics ?? [])
    .map((m) => {
      const value = typeof m.value === 'number' ? m.value : Number(String(m.value).replace(/[,\s]/g, ''))
      if (!m.metric || !isFinite(value)) return null
      return {
        project_id: projectId,
        source: 'screenshot',
        platform: out.platform ?? null,
        metric: slug(m.metric),
        value,
        period_start: isDate(m.period_start) ? m.period_start : isDate(out.period_start) ? out.period_start : null,
        period_end: isDate(m.period_end) ? m.period_end : isDate(out.period_end) ? out.period_end : null,
        raw: { storage_path: storagePath, filename, notes: out.notes ?? null },
      }
    })
    .filter(Boolean)

  if (!rows.length) {
    throw new Error(out.notes ? `no metrics readable: ${out.notes.slice(0, 200)}` : 'no metrics could be read from this screenshot')
  }

  const { error: insErr } = await supabase.from('mk_metrics_snapshots').insert(rows)
  if (insErr) throw new Error(`metrics insert failed: ${insErr.message}`)

  return { inserted: rows.length, platform: out.platform ?? null }
}

// ------------------------------------------------------------- task=dub_sync
// B3: turn tracked-link rows (M9 UTM links from sprint_propose) into Dub short
// links and pull their click/conversion counts. Two moves per project:
//   1. Backfill — create a Dub short link for a link that doesn't have one yet,
//      but ONLY if it belongs to a committed (approved/done) action. Proposed
//      actions are skipped: re-rolls delete them and would orphan the Dub link,
//      permanently burning the free tier's 25-links/month budget.
//   2. Refresh — pull clicks/conversions for every Dub-linked row.
// Then a delete-then-insert project-level daily snapshot so the sprint review +
// Metrics tab see tracked-link performance. Fully no-op (skipped) without a key.

async function runDubSync(supabase: Supabase, projectId: string) {
  if (!dubEnabled()) return { skipped: 'DUB_API_KEY not set' }

  const { data: links } = await supabase
    .from('mk_links')
    .select('id, dub_id, url')
    .eq('project_id', projectId)
  if (!links?.length) return { created: 0, refreshed: 0, clicks: 0, conversions: 0 }

  // Links attached to a committed action — the only ones that earn a Dub link.
  const { data: committed } = await supabase
    .from('mk_actions')
    .select('tracking_link_id')
    .eq('project_id', projectId)
    .in('status', ['approved', 'done'])
    .not('tracking_link_id', 'is', null)
  const committedLinkIds = new Set((committed ?? []).map((a) => a.tracking_link_id as string))

  const now = new Date().toISOString()
  let created = 0
  let refreshed = 0

  for (const link of links) {
    let dubId = link.dub_id as string | null

    // 1. Backfill (committed actions only). link.url still holds the plain UTM
    // destination for rows without a dub_id — that's the Dub target.
    if (!dubId && committedLinkIds.has(link.id)) {
      // If create fails, it may already exist from a prior run where the create
      // succeeded but our DB write failed — recover it by externalId rather than
      // orphaning the link (and permanently losing a free-tier slot).
      const dub = (await createDubLink(link.url, link.id)) ?? (await getDubLinkByExternalId(link.id))
      if (dub) {
        const { error } = await supabase
          .from('mk_links')
          .update({ dub_id: dub.id, url: dub.shortLink, updated_at: now })
          .eq('id', link.id)
        if (error) {
          // The link exists in Dub; next run recovers it by externalId (above).
          console.error('dub backfill: link created but mk_links update failed for', link.id, error.message)
        } else {
          dubId = dub.id
          created++
        }
      }
    }

    // 2. Refresh counts for any Dub-linked row.
    if (dubId) {
      const stats = await getDubStats(dubId)
      if (stats) {
        await supabase
          .from('mk_links')
          .update({ clicks: stats.clicks, conversions: stats.conversions, updated_at: now })
          .eq('id', link.id)
        refreshed++
      }
    }
  }

  // Project-level daily rollup as a metric (source='dub'), idempotent per day.
  // Sum the PERSISTED last-known-good counts across every Dub-linked row (not
  // just this run's successful fetches) so a partial-failure re-run can't
  // overwrite a more-complete same-day snapshot with an undercount.
  const { data: linked } = await supabase
    .from('mk_links')
    .select('clicks, conversions')
    .eq('project_id', projectId)
    .not('dub_id', 'is', null)
  const totalClicks = (linked ?? []).reduce((n, l) => n + (l.clicks ?? 0), 0)
  const totalConversions = (linked ?? []).reduce((n, l) => n + (l.conversions ?? 0), 0)

  if (linked?.length) {
    const today = now.slice(0, 10)
    await supabase
      .from('mk_metrics_snapshots')
      .delete()
      .eq('project_id', projectId)
      .eq('source', 'dub')
      .eq('period_end', today)
    const { error: snapErr } = await supabase.from('mk_metrics_snapshots').insert([
      { project_id: projectId, source: 'dub', platform: 'dub', metric: 'link_clicks', value: totalClicks, period_end: today },
      { project_id: projectId, source: 'dub', platform: 'dub', metric: 'link_conversions', value: totalConversions, period_end: today },
    ])
    if (snapErr) console.error('dub snapshot insert failed:', snapErr.message)
  }

  return { created, refreshed, clicks: totalClicks, conversions: totalConversions }
}

// Daily cron batch: one dub_sync job per active project (audit trail), sequential.
// Silent — no Telegram; click drift isn't alert-worthy.
async function runDubSyncBatch(supabase: Supabase) {
  if (!dubEnabled()) return
  const { data: projects } = await supabase.from('mk_projects').select('id, name').eq('status', 'active')
  for (const project of projects ?? []) {
    const { data: job, error } = await supabase
      .from('mk_jobs')
      .insert({ project_id: project.id, kind: 'dub_sync', status: 'running', started_at: new Date().toISOString() })
      .select('id, kind, project_id, input')
      .single()
    if (error || !job) {
      console.error('dub sync batch: job insert failed for', project.name, error?.message)
      continue
    }
    await runJob(supabase, job)
  }
}

// Monday (UTC) of the current week, YYYY-MM-DD — the sprint week convention.
function mondayOfWeek(): string {
  const d = new Date()
  const utc = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  utc.setUTCDate(utc.getUTCDate() - ((utc.getUTCDay() + 6) % 7))
  return utc.toISOString().slice(0, 10)
}

function slug(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 40) || 'other'
  )
}

// ------------------------------------------------------------------- assets

async function gatherAssets(supabase: Supabase, projectId: string) {
  const { data: assets } = await supabase
    .from('mk_project_assets')
    .select('kind, storage_path, filename')
    .eq('project_id', projectId)

  const images: ClaudeImage[] = []
  const docs: string[] = []

  for (const asset of assets ?? []) {
    const isImage = asset.kind === 'screenshot' || asset.kind === 'logo'
    if (isImage && images.length >= MAX_IMAGES) continue
    if (!isImage && docs.length >= MAX_DOCS) continue

    const { data: blob, error } = await supabase.storage.from(BUCKET).download(asset.storage_path)
    if (error || !blob) {
      console.error('asset download failed:', asset.storage_path, error?.message)
      continue
    }
    const buf = new Uint8Array(await blob.arrayBuffer())

    if (isImage) {
      if (buf.byteLength > MAX_IMAGE_BYTES) continue
      images.push({ media_type: mediaType(asset.filename ?? asset.storage_path), data: encodeBase64(buf) })
    } else {
      const text = new TextDecoder('utf-8', { fatal: false }).decode(buf).slice(0, MAX_DOC_CHARS)
      docs.push(`[${asset.filename ?? asset.storage_path}]\n${text}`)
    }
  }
  return { images, docs }
}

function mediaType(name: string): string {
  const ext = name.toLowerCase().split('.').pop() ?? ''
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg'
  if (ext === 'webp') return 'image/webp'
  if (ext === 'gif') return 'image/gif'
  return 'image/png'
}

async function fetchPageText(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(10_000),
      headers: { 'User-Agent': 'MDN-MarketKit-Scanner/1.0 (+https://mdntech.org)' },
    })
    if (!res.ok) return ''
    const html = await res.text()
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[a-z]+;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, MAX_CRAWL_CHARS)
  } catch (err) {
    console.error('page crawl failed:', url, err instanceof Error ? err.message : err)
    return ''
  }
}

// ------------------------------------------------------------------- prompts

const SCAN_SYSTEM = `You are a go-to-market analyst doing a first-pass business analysis of a project a builder wants to grow. You receive whatever the builder has: a name, maybe a URL (with crawled page text), maybe uploaded docs, maybe screenshots/logos. Read the evidence and produce a tight structured profile plus the highest-leverage questions whose answers would most improve a launch plan.

Return ONLY a single JSON object, no prose, no markdown fences, in exactly this shape:
{
  "profile": {
    "what_it_is": "one or two sentences",
    "category": "saas | consumer_app | game | local_business (your best read; may differ from the owner's tag)",
    "audience": "who it is for",
    "problem": "the core problem it solves",
    "differentiators": ["distinct advantages, evidence-based"],
    "existing_channels": ["channels already in use, if any evidence"],
    "traction": "what you can infer about traction, or 'unknown — no evidence'",
    "stage": "idea | pre-launch | launched | growing (your read)",
    "notes": "anything important that doesn't fit above"
  },
  "questions": [
    { "question": "a specific question for the founder", "why_needed": "why the answer materially changes the plan" }
  ]
}
Rules: 4-7 questions, ordered by leverage. Never fabricate traction, revenue, or user counts — if there is no evidence, say so. Keep arrays concise.`

const LAUNCH_KIT_SYSTEM = `You are a pragmatic go-to-market strategist for small projects with tiny budgets (€0–2000/mo). You produce a concrete, do-this-now Launch Kit, not generic advice. Ground channel choices in these 2026 defaults and adapt to the project's category and budget tier:

€0 (all categories): problem-specific communities + Reddit (highest per-visitor conversion) → SEO/GEO content (FAQ format, freshness, schema) → directories (Uneed, Microlaunch, BetaList) → operator DMs (highest conv/hour) → build-in-public on X as a learning channel. PH/HN only once there's an audience.
≤€500/mo: the above + exactly ONE paid channel — Google Search for high-intent/B2B/local, OR Meta for consumer/visual. Not TikTok paid (needs ~€500/mo alone).
≤€2000/mo: 1-2 paid channels + retargeting + GEO tracking + content promotion.
Category notes: B2B SaaS → self-serve/PLG only at these budgets; local business → Google Business Profile + reviews + local SEO dominate; games/consumer → community + short-video organic (TikTok/Shorts organic, not paid).

Return ONLY a single JSON object, no prose, no markdown fences, in exactly this shape:
{
  "positioning": "one crisp positioning statement (for [who], [product] is the [category] that [key benefit], unlike [alternative])",
  "icp": { "who": "...", "pains": ["..."], "where_they_are": ["specific communities/subreddits/platforms"], "triggers": ["what makes them look for a solution"] },
  "channel_plan": [
    { "channel": "e.g. Reddit — r/xyz", "rank": 1, "rationale": "why for THIS project", "cost": "€0 or ~€X/mo", "effort": "S | M | L", "expected_outcome": "concrete, measurable" }
  ],
  "launch_checklist": [ { "task": "specific action", "why": "..." } ],
  "calendar": [ { "day": 1, "channel": "...", "format": "post | thread | article | image | video", "topic": "specific topic" } ],
  "content": [ { "platform": "x | linkedin | reddit | blog | ...", "format": "post | thread | article", "draft": "a real, ready-to-edit draft — the founder will voice-edit before posting" } ]
}
Rules: rank 3-6 channels for the budget tier (never recommend paid channels above the budget). launch_checklist 6-10 items. calendar exactly 30 entries (day 1..30), realistic cadence, not one per day. content 5-8 real drafts covering the top channels. Write drafts in the project's content language.`

const SPRINT_PROPOSE_SYSTEM = `You are a pragmatic weekly marketing coach for a solo founder with very limited time (3-5 hours/week for marketing) and a tiny budget. Each week you propose exactly 3 concrete, do-this-week actions for one project, based on its profile, strategy, what was tried in previous sprints (and how it went), and recorded metrics.

Return ONLY a single JSON object, no prose, no markdown fences, in exactly this shape:
{
  "actions": [
    {
      "title": "imperative, specific, completable in one week (e.g. 'Post the €0 launch checklist story in r/SideProject')",
      "channel": "the channel it runs on (e.g. 'Reddit — r/SideProject', 'X', 'blog', 'directories', 'DM outreach')",
      "effort": "S | M | L  (S ≈ under 1h, M ≈ 1-3h, L ≈ 3-5h)",
      "cost_eur": 0,
      "expected_outcome": "concrete and measurable (e.g. '200+ visits, 5+ signups', '10 replies')"
    }
  ]
}
Rules: exactly 3 actions. Total effort must fit in 3-5 founder-hours (never three L actions). Never exceed the project's budget tier — €0 tier means every cost_eur is 0. Do not repeat an action from the previous sprints list; if something worked, propose the natural next step; if something was skipped twice, propose an easier variant or drop the channel for now. Prefer the strategy's top-ranked channels and unfinished checklist items. Write titles and expected outcomes in English; any content the founder must write can be in the project's content language.`

const SPRINT_REVIEW_SYSTEM = `You review last week's marketing actions for a solo founder's project. For each action you get its expected outcome, plus whatever metrics were actually recorded (analytics snapshots, link clicks). Be honest and specific: compare expected vs evidence. Where there is no relevant data, say plainly "no measurable data" and name the one tracking step that would fix it next time. Never invent numbers.

Return ONLY a single JSON object, no prose, no markdown fences, in exactly this shape:
{
  "reviews": [
    { "index": 0, "actual_outcome": "2-3 sentences: what the evidence shows vs what was expected, and one takeaway" }
  ],
  "week_summary": "2-3 sentences across all reviewed actions: what worked, what to change"
}
Rules: one review per action, referenced by its index from the input. Keep each actual_outcome under 60 words.`

const METRICS_SCREENSHOT_SYSTEM = `You extract metrics from a screenshot of an analytics or social media dashboard (GA4, Search Console, Plausible, X/Twitter, LinkedIn, Instagram, TikTok, YouTube, Reddit, newsletter tools, app stores...). Read only what is actually visible — never estimate or infer numbers that are not shown.

Return ONLY a single JSON object, no prose, no markdown fences, in exactly this shape:
{
  "platform": "ga4 | gsc | plausible | x | linkedin | instagram | tiktok | youtube | reddit | other",
  "period_start": "YYYY-MM-DD or null if not visible",
  "period_end": "YYYY-MM-DD or null",
  "metrics": [
    { "metric": "snake_case name (e.g. visitors, page_views, impressions, clicks, followers, engagement_rate_pct)", "value": 123 }
  ],
  "notes": "anything ambiguous, cropped, or worth flagging"
}
Rules: values must be plain numbers — expand K/M (1.2K → 1200), strip separators and % signs (name percentage metrics *_pct). Include a per-metric "period_start"/"period_end" only if that metric has its own visible period. If the image is NOT an analytics/metrics screenshot, return {"metrics": [], "notes": "explain what the image shows instead"}.`

// ----------------------------------------------------------------------- util

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: { 'Content-Type': 'application/json' } })
}
