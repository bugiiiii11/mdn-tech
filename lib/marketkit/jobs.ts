// Fire-and-forget invocation of the marketkit-worker Edge Function (BRIEF §6).
// The worker authenticates with CRON_SECRET (same shared secret as techkit-poller —
// already provisioned in Vercel env + Edge Function secrets in Session 34).

export async function invokeMarketkitWorker(jobId: string): Promise<{ ok: boolean; error?: string }> {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    return { ok: false, error: 'CRON_SECRET not set in this environment' }
  }
  try {
    // Fire-and-forget: don't await the full run (a scan/launch-kit can take minutes).
    // We still await the initial fetch so we surface an unreachable-worker error,
    // but we do NOT block on the body — the worker updates mk_jobs and the UI polls it.
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/marketkit-worker`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${secret}`,
        },
        body: JSON.stringify({ job_id: jobId }),
        // The worker returns 202 immediately after marking the job running; the
        // heavy AI work continues in the background (EdgeRuntime.waitUntil).
        signal: AbortSignal.timeout(20_000),
      }
    )
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return { ok: false, error: `worker returned HTTP ${res.status}${text ? `: ${text.slice(0, 200)}` : ''}` }
    }
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'worker unreachable' }
  }
}
