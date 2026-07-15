'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ImageUp, Loader2, Plus, Trash2, MousePointerClick } from 'lucide-react'
import { Pill } from './ui'
import { JobRunner } from './JobRunner'
import { addManualMetric, deleteMetric } from '@/app/portal/marketkit/actions'
import type { MkMetricSnapshot, MkLink, JobStatus } from '@/lib/marketkit/types'

// B2 metrics ingestion: screenshot → storage → metrics_screenshot job → Claude
// vision → normalized mk_metrics_snapshots. Plus a manual-entry form for anything
// without a screenshot. GA4/GSC/Dub pulls land in a later session — this is the
// MVP answer for X/LinkedIn/Instagram/TikTok, whose APIs are gated (BRIEF §9).

const BUCKET = 'marketkit-assets'

interface JobState {
  id: string
  status: JobStatus
}

const SOURCE_TONE: Record<string, 'purple' | 'green' | 'yellow' | 'gray'> = {
  screenshot: 'purple',
  manual: 'gray',
  ga4: 'green',
  gsc: 'green',
  dub: 'yellow',
}

export function MetricsPanel({
  projectId,
  snapshots,
  links,
  screenshotJob,
  dubSyncJob,
}: {
  projectId: string
  snapshots: MkMetricSnapshot[]
  links: MkLink[]
  screenshotJob: JobState | null
  dubSyncJob: JobState | null
}) {
  return (
    <div className="space-y-6">
      <TrackedLinks projectId={projectId} links={links} dubSyncJob={dubSyncJob} />
      <ScreenshotIngest projectId={projectId} initialJob={screenshotJob} />
      <ManualEntry projectId={projectId} />
      <SnapshotTable projectId={projectId} snapshots={snapshots} />
    </div>
  )
}

// --- Tracked links (B3 — Dub) ---
// Every sprint action ships with a UTM link (M9). Once Dub is connected they
// become short links with real click/conversion stats, refreshed daily by the
// marketkit-dub-sync cron; "Sync now" pulls on demand.

function TrackedLinks({
  projectId,
  links,
  dubSyncJob,
}: {
  projectId: string
  links: MkLink[]
  dubSyncJob: JobState | null
}) {
  if (links.length === 0) {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-white">Tracked links</h3>
        <p className="text-sm text-gray-500">
          No tracked links yet. Each weekly sprint action ships with a UTM link — once you approve actions on the Sprint
          tab, they appear here with click stats.
        </p>
      </div>
    )
  }

  const connected = links.some((l) => l.dub_id)
  const totalClicks = links.reduce((n, l) => n + (l.clicks ?? 0), 0)
  const totalConversions = links.reduce((n, l) => n + (l.conversions ?? 0), 0)

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-semibold text-white">Tracked links</h3>
          <p className="text-[11px] text-gray-500 mt-1">
            {connected ? (
              <>
                <span className="text-cyan-300/80">{totalClicks.toLocaleString('en-US')}</span> clicks
                {totalConversions > 0 && (
                  <>
                    {' · '}
                    <span className="text-green-400/80">{totalConversions.toLocaleString('en-US')}</span> conversions
                  </>
                )}{' '}
                across {links.length} link{links.length === 1 ? '' : 's'} · refreshed daily
              </>
            ) : (
              'Plain UTM links today. Connect Dub to turn them into short links with real click stats.'
            )}
          </p>
        </div>
        <JobRunner
          projectId={projectId}
          kind="dub_sync"
          label="Sync now"
          runningLabel="Syncing…"
          initialJobId={dubSyncJob?.id}
          initialStatus={dubSyncJob?.status}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider font-mono text-gray-500 border-b border-white/[0.06]">
              <th className="py-2 pr-3 font-normal">Link</th>
              <th className="py-2 pr-3 font-normal">Clicks</th>
              <th className="py-2 pr-3 font-normal">Conv.</th>
              <th className="py-2 font-normal">Updated</th>
            </tr>
          </thead>
          <tbody>
            {links.map((l) => (
              <tr key={l.id} className="border-b border-white/[0.04] text-sm">
                <td className="py-2 pr-3">
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-gray-300 hover:text-cyan-300 transition-colors max-w-[22rem]"
                    title={l.url}
                  >
                    {l.dub_id && <MousePointerClick className="w-3 h-3 text-cyan-400/70 shrink-0" />}
                    <span className="truncate">{l.url.replace(/^https?:\/\//, '')}</span>
                  </a>
                </td>
                <td className="py-2 pr-3 text-white">{(l.clicks ?? 0).toLocaleString('en-US')}</td>
                <td className="py-2 pr-3 text-gray-300">{(l.conversions ?? 0).toLocaleString('en-US')}</td>
                <td className="py-2 text-gray-500 text-xs whitespace-nowrap">{l.updated_at?.slice(0, 10) ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// --- Screenshot upload + extraction job ---

function ScreenshotIngest({ projectId, initialJob }: { projectId: string; initialJob: JobState | null }) {
  const router = useRouter()
  const supabase = createClient()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [jobId, setJobId] = useState<string | null>(
    initialJob && (initialJob.status === 'queued' || initialJob.status === 'running') ? initialJob.id : null
  )
  const [busy, setBusy] = useState(jobId !== null)
  const [phase, setPhase] = useState<'upload' | 'extract'>(jobId ? 'extract' : 'upload')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!jobId) return
    let cancelled = false

    async function poll() {
      const { data } = await supabase.from('mk_jobs').select('status, error, result').eq('id', jobId).maybeSingle()
      if (cancelled) return
      if (!data) {
        timer.current = setTimeout(poll, 3000)
        return
      }
      if (data.status === 'done') {
        const inserted = (data.result as { inserted?: number } | null)?.inserted
        setBusy(false)
        setJobId(null)
        setDone(inserted ? `${inserted} metric${inserted === 1 ? '' : 's'} extracted ✓` : 'done ✓')
        router.refresh()
        return
      }
      if (data.status === 'error') {
        setBusy(false)
        setJobId(null)
        setError(data.error ?? 'extraction failed')
        return
      }
      timer.current = setTimeout(poll, 3000)
    }
    poll()

    return () => {
      cancelled = true
      if (timer.current) clearTimeout(timer.current)
    }
  }, [jobId, router, supabase])

  async function ingest(file: File) {
    setBusy(true)
    setError(null)
    setDone(null)
    setPhase('upload')
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error('screenshot larger than 5 MB — crop or compress it')
      const safe = file.name.replace(/[^\w.\-]+/g, '_').slice(-80)
      const path = `mk/${projectId}/metrics/${crypto.randomUUID()}-${safe}`
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false })
      if (upErr) throw new Error(upErr.message)

      setPhase('extract')
      const res = await fetch('/api/portal/marketkit/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          kind: 'metrics_screenshot',
          input: { storage_path: path, filename: file.name },
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        if (res.status === 409 && json.job_id) {
          setJobId(json.job_id)
          return
        }
        throw new Error(json.error ?? `request failed (${res.status})`)
      }
      setJobId(json.job_id)
    } catch (err) {
      setBusy(false)
      setError(err instanceof Error ? err.message : 'upload failed')
    } finally {
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-white">Import from screenshot</h3>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          if (!busy && e.dataTransfer.files[0]) ingest(e.dataTransfer.files[0])
        }}
        onClick={() => !busy && inputRef.current?.click()}
        className={`rounded-xl border border-dashed p-5 text-center transition-colors ${
          busy ? 'border-white/10 opacity-70' : 'cursor-pointer'
        } ${dragging ? 'border-purple-400/60 bg-purple-500/5' : 'border-white/15 hover:border-white/30'}`}
      >
        {busy ? (
          <Loader2 className="w-5 h-5 text-gray-400 mx-auto mb-2 animate-spin" />
        ) : (
          <ImageUp className="w-5 h-5 text-gray-400 mx-auto mb-2" />
        )}
        <p className="text-sm text-gray-300">
          {busy
            ? phase === 'upload'
              ? 'Uploading…'
              : 'Reading metrics from the screenshot…'
            : 'Drop an analytics screenshot or click to upload'}
        </p>
        <p className="text-[11px] text-gray-500 mt-1">
          X, LinkedIn, Instagram, TikTok, GA4, Search Console, Plausible… — one image at a time, the numbers are
          extracted and normalized automatically.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          hidden
          onChange={(e) => e.target.files?.[0] && ingest(e.target.files[0])}
        />
      </div>
      {done && <p className="text-green-400 text-xs">{done}</p>}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}

// --- Manual entry ---

function ManualEntry({ projectId }: { projectId: string }) {
  const [metric, setMetric] = useState('')
  const [value, setValue] = useState('')
  const [platform, setPlatform] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function submit() {
    const num = Number(value.replace(/[,\s]/g, ''))
    if (!metric.trim() || !Number.isFinite(num)) {
      setError('metric name and a numeric value are required')
      return
    }
    setError(null)
    startTransition(async () => {
      const res = await addManualMetric(projectId, { metric, value: num, platform: platform || undefined })
      if (res?.error) setError(res.error)
      else {
        setMetric('')
        setValue('')
        setPlatform('')
      }
    })
  }

  const inputCls =
    'bg-[#0a0a1a] border border-white/10 focus:border-purple-400/60 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-gray-600 outline-none transition-colors'

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-white">Add manually</h3>
      <div className="flex items-center gap-2 flex-wrap">
        <input
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
          placeholder="metric (e.g. signups)"
          className={`${inputCls} w-44`}
        />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="value"
          inputMode="decimal"
          className={`${inputCls} w-28`}
        />
        <input
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          placeholder="platform (optional)"
          className={`${inputCls} w-40`}
        />
        <button
          onClick={submit}
          disabled={pending}
          className="inline-flex items-center gap-1.5 text-xs text-gray-300 border border-white/10 hover:border-white/20 hover:text-white px-3 py-2 rounded-lg disabled:opacity-50 transition-colors"
        >
          {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
          Add
        </button>
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}

// --- Snapshot table ---

function SnapshotTable({ projectId, snapshots }: { projectId: string; snapshots: MkMetricSnapshot[] }) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function remove(id: number) {
    setError(null)
    startTransition(async () => {
      const res = await deleteMetric(id, projectId)
      if (res?.error) setError(res.error)
    })
  }

  if (snapshots.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No metrics recorded yet. Import a screenshot or add a number manually — the weekly sprint review reads these to
        judge what actually worked.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-white">Recorded metrics</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider font-mono text-gray-500 border-b border-white/[0.06]">
              <th className="py-2 pr-3 font-normal">Metric</th>
              <th className="py-2 pr-3 font-normal">Value</th>
              <th className="py-2 pr-3 font-normal">Platform</th>
              <th className="py-2 pr-3 font-normal">Source</th>
              <th className="py-2 pr-3 font-normal">Period / recorded</th>
              <th className="py-2 font-normal" />
            </tr>
          </thead>
          <tbody>
            {snapshots.map((s) => (
              <tr key={s.id} className="border-b border-white/[0.04] text-sm">
                <td className="py-2 pr-3 text-gray-200 font-mono text-xs">{s.metric}</td>
                <td className="py-2 pr-3 text-white">{formatValue(s.value)}</td>
                <td className="py-2 pr-3 text-gray-400 text-xs">{s.platform ?? '—'}</td>
                <td className="py-2 pr-3">
                  <Pill tone={SOURCE_TONE[s.source] ?? 'gray'}>{s.source}</Pill>
                </td>
                <td className="py-2 pr-3 text-gray-500 text-xs whitespace-nowrap">
                  {s.period_end ?? s.ingested_at.slice(0, 10)}
                </td>
                <td className="py-2 text-right">
                  <button
                    onClick={() => remove(s.id)}
                    disabled={pending}
                    className="text-gray-600 hover:text-red-400 transition-colors disabled:opacity-40"
                    aria-label="Delete metric"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}

function formatValue(v: number): string {
  return Number(v).toLocaleString('en-US', { maximumFractionDigits: 2 })
}
