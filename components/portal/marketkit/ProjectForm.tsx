'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CATEGORY_LABELS, BUDGET_LABELS, type MkProject } from '@/lib/marketkit/types'

const inp =
  'w-full bg-[#0a0a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors'

const CATEGORY_ORDER = ['saas', 'consumer_app', 'game', 'local_business'] as const
const BUDGET_ORDER = [0, 500, 2000] as const

export function ProjectForm({ project, userId }: { project?: MkProject; userId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: project?.name ?? '',
    url: project?.url ?? '',
    category: project?.category ?? 'saas',
    budget_tier: project?.budget_tier ?? 0,
    language: project?.language ?? 'en',
    status: project?.status ?? 'active',
  })

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      name: form.name.trim(),
      url: form.url.trim() || null,
      category: form.category,
      budget_tier: Number(form.budget_tier),
      language: form.language.trim() || 'en',
      status: form.status,
    }

    let result
    if (project) {
      result = await supabase.from('mk_projects').update(payload).eq('id', project.id).select('id').single()
    } else {
      result = await supabase
        .from('mk_projects')
        .insert({ ...payload, owner_id: userId })
        .select('id')
        .single()
    }

    if (result.error) {
      setError(result.error.message)
      setSaving(false)
      return
    }
    const id = project?.id ?? (result.data as { id: string }).id
    router.push(`/portal/marketkit/${id}`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      <div className="bg-[#0d0d20]/80 border border-white/[0.06] rounded-xl p-5 space-y-4 backdrop-blur-sm">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Project name *</label>
          <input required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Acme App" className={inp} />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Live URL</label>
          <input
            value={form.url}
            onChange={(e) => set('url', e.target.value)}
            placeholder="https://acme.app"
            className={inp}
          />
          <p className="text-[11px] text-gray-500 mt-1">The scanner crawls this page when you run the AI scan.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Category</label>
            <select value={form.category} onChange={(e) => set('category', e.target.value as typeof form.category)} className={inp}>
              {CATEGORY_ORDER.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Monthly budget</label>
            <select
              value={form.budget_tier}
              onChange={(e) => set('budget_tier', Number(e.target.value) as typeof form.budget_tier)}
              className={inp}
            >
              {BUDGET_ORDER.map((b) => (
                <option key={b} value={b}>
                  {BUDGET_LABELS[b]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Content language</label>
            <input value={form.language} onChange={(e) => set('language', e.target.value)} placeholder="en" className={inp} />
          </div>
          {project && (
            <div>
              <label className="block text-xs text-gray-400 mb-1">Status</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value as typeof form.status)} className={inp}>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="button-primary px-5 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving…' : project ? 'Save changes' : 'Create project'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2 text-sm text-gray-300 border border-white/10 hover:border-white/20 hover:text-white rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
