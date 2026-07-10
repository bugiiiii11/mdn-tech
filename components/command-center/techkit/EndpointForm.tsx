'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveEndpoint, type EndpointInput } from '@/app/command-center/techkit/actions'

interface ProjectOption {
  id: string
  name: string
}

const inputCls =
  'w-full rounded-lg border border-white/10 bg-[#0a0a1a] px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-purple-500/50 focus:outline-none'
const labelCls = 'mb-1 block text-xs text-gray-400'

export function EndpointForm({
  projects,
  endpoint,
}: {
  projects: ProjectOption[]
  endpoint?: (EndpointInput & { id: string }) | null
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<EndpointInput>({
    name: endpoint?.name ?? '',
    url: endpoint?.url ?? 'https://',
    project_id: endpoint?.project_id ?? null,
    method: endpoint?.method ?? 'GET',
    expected_status_min: endpoint?.expected_status_min ?? 200,
    expected_status_max: endpoint?.expected_status_max ?? 399,
    keyword: endpoint?.keyword ?? null,
    degraded_latency_ms: endpoint?.degraded_latency_ms ?? 3000,
    check_interval_secs: endpoint?.check_interval_secs ?? 300,
    is_active: endpoint?.is_active ?? true,
  })

  function set<K extends keyof EndpointInput>(key: K, value: EndpointInput[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const res = await saveEndpoint(form, endpoint?.id)
      if (res.error) setError(res.error)
      else router.push('/command-center/techkit/endpoints')
    })
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-white/[0.06] bg-[#0d0d20]/80 p-5 backdrop-blur-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelCls}>Name</label>
          <input required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="mdntech.org home" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Project (optional)</label>
          <select value={form.project_id ?? ''} onChange={(e) => set('project_id', e.target.value || null)} className={inputCls}>
            <option value="">— unlinked —</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className={labelCls}>URL</label>
        <input required type="url" value={form.url} onChange={(e) => set('url', e.target.value)} className={inputCls} />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <label className={labelCls}>Method</label>
          <select value={form.method} onChange={(e) => set('method', e.target.value)} className={inputCls}>
            <option value="GET">GET</option>
            <option value="HEAD">HEAD</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Expected status (min–max)</label>
          <div className="flex items-center gap-2">
            <input type="number" min={100} max={599} value={form.expected_status_min} onChange={(e) => set('expected_status_min', Number(e.target.value))} className={inputCls} />
            <input type="number" min={100} max={599} value={form.expected_status_max} onChange={(e) => set('expected_status_max', Number(e.target.value))} className={inputCls} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Degraded above (ms)</label>
          <input type="number" min={100} step={100} value={form.degraded_latency_ms} onChange={(e) => set('degraded_latency_ms', Number(e.target.value))} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Check interval (secs)</label>
          <input type="number" min={60} step={60} value={form.check_interval_secs} onChange={(e) => set('check_interval_secs', Number(e.target.value))} className={inputCls} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelCls}>Keyword (optional — response body must contain it)</label>
          <input value={form.keyword ?? ''} onChange={(e) => set('keyword', e.target.value || null)} placeholder="e.g. M.D.N Tech" className={inputCls} />
        </div>
        <label className="flex items-end gap-2 pb-2 text-sm text-gray-300">
          <input type="checkbox" checked={form.is_active} onChange={(e) => set('is_active', e.target.checked)} className="h-4 w-4 accent-purple-500" />
          Active (checked every interval)
        </label>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="button-primary rounded-lg px-5 py-2 text-sm font-medium text-white disabled:opacity-50">
          {endpoint ? 'Save changes' : 'Add endpoint'}
        </button>
        <button type="button" onClick={() => router.back()} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5">
          Cancel
        </button>
      </div>
    </form>
  )
}
