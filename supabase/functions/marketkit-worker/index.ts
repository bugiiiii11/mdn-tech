// marketkit-worker — job-queue driven AI pipeline (MARKETKIT-BRIEF §6).
// Invoked fire-and-forget by /api/portal/marketkit/jobs with { job_id } and a
// CRON_SECRET bearer (same shared secret as techkit-poller). Marks the job
// running, returns 202 immediately, and finishes the heavy AI work in the
// background via EdgeRuntime.waitUntil so the caller's fetch can time out safely.
// Deploy: multipart deploy endpoint (no CLI) — see MARKETKIT-SETUP.md.
import { serviceClient } from '../_shared/supabase.ts'
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

  let body: { job_id?: string } = {}
  try {
    body = await req.json()
  } catch {
    /* empty */
  }
  if (!body.job_id) return json({ error: 'job_id required' }, 400)

  const supabase = serviceClient()
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

async function runJob(supabase: Supabase, job: { id: string; kind: string; project_id: string | null }) {
  try {
    let result: unknown
    switch (job.kind) {
      case 'scan':
        result = await runScan(supabase, job.project_id!)
        break
      case 'launch_kit':
        result = await runLaunchKit(supabase, job.project_id!)
        break
      default:
        throw new Error(`unknown job kind "${job.kind}"`)
    }
    await supabase
      .from('mk_jobs')
      .update({ status: 'done', result: result as Record<string, unknown>, finished_at: new Date().toISOString() })
      .eq('id', job.id)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'job failed'
    console.error('marketkit job failed:', job.kind, message)
    await supabase
      .from('mk_jobs')
      .update({ status: 'error', error: message, finished_at: new Date().toISOString() })
      .eq('id', job.id)
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

// ----------------------------------------------------------------------- util

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: { 'Content-Type': 'application/json' } })
}
