'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, Loader2 } from 'lucide-react'
import type { JobKind, JobStatus } from '@/lib/marketkit/types'

// Kicks off an AI job and polls the mk_jobs row until it finishes (BRIEF §6).
// `running` may be passed from the server (a job already in flight on page load).
export function JobRunner({
  projectId,
  kind,
  label,
  runningLabel,
  disabled,
  disabledHint,
  initialJobId,
  initialStatus,
}: {
  projectId: string
  kind: JobKind
  label: string
  runningLabel: string
  disabled?: boolean
  disabledHint?: string
  initialJobId?: string | null
  initialStatus?: JobStatus | null
}) {
  const router = useRouter()
  const supabase = createClient()
  const [jobId, setJobId] = useState<string | null>(
    initialStatus === 'queued' || initialStatus === 'running' ? initialJobId ?? null : null
  )
  const [busy, setBusy] = useState<boolean>(initialStatus === 'queued' || initialStatus === 'running')
  const [error, setError] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!jobId) return
    let cancelled = false

    async function poll() {
      const { data } = await supabase.from('mk_jobs').select('status, error').eq('id', jobId).maybeSingle()
      if (cancelled) return
      if (!data) {
        timer.current = setTimeout(poll, 3000)
        return
      }
      if (data.status === 'done') {
        setBusy(false)
        setJobId(null)
        router.refresh()
        return
      }
      if (data.status === 'error') {
        setBusy(false)
        setJobId(null)
        setError(data.error ?? 'job failed')
        router.refresh()
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

  async function run() {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/portal/marketkit/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, kind }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        // 409 = a job of this kind is already running; adopt it and poll.
        if (res.status === 409 && json.job_id) {
          setJobId(json.job_id)
          return
        }
        throw new Error(json.error ?? `request failed (${res.status})`)
      }
      setJobId(json.job_id)
    } catch (err) {
      setBusy(false)
      setError(err instanceof Error ? err.message : 'could not start job')
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={run}
        disabled={busy || disabled}
        className="inline-flex items-center gap-2 button-primary text-white text-sm px-4 py-2 rounded-lg disabled:opacity-50 transition-colors"
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {busy ? runningLabel : label}
      </button>
      {busy && <p className="text-[11px] text-gray-500">This runs in the background and can take a minute or two.</p>}
      {disabled && disabledHint && !busy && <p className="text-[11px] text-gray-500">{disabledHint}</p>}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}
