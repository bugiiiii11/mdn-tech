'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const STATUSES = ['discovery', 'design', 'development', 'testing', 'deployed', 'maintenance', 'paused', 'completed']
const PRIORITIES = ['critical', 'high', 'medium', 'low']

type ProjectFormProps = {
  project?: any
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: project?.name ?? '',
    client_name: project?.client_name ?? '',
    status: project?.status ?? 'discovery',
    priority: project?.priority ?? 'medium',
    start_date: project?.start_date ?? '',
    target_end_date: project?.target_end_date ?? '',
    budget_total: project?.budget_total ?? '',
    description: project?.description ?? '',
    repository_url: project?.repository_url ?? '',
    staging_url: project?.staging_url ?? '',
    production_url: project?.production_url ?? '',
    supabase_project_ref: project?.supabase_project_ref ?? '',
    railway_project_id: project?.railway_project_id ?? '',
    vercel_project_id: project?.vercel_project_id ?? '',
  })

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      ...form,
      budget_total: form.budget_total ? parseFloat(form.budget_total) : null,
      budget_spent: project?.budget_spent ?? 0,
      start_date: form.start_date || null,
      target_end_date: form.target_end_date || null,
    }

    let result
    if (project) {
      result = await supabase.from('projects').update(payload).eq('id', project.id)
    } else {
      result = await supabase.from('projects').insert(payload).select('id').single()
    }

    if (result.error) {
      setError(result.error.message)
      setSaving(false)
      return
    }

    const id = project?.id ?? (result.data as any).id
    router.push(`/command-center/projects/${id}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Core info */}
      <Section title="Project info">
        <Field label="Project name *">
          <input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Swarm Resistance" className={input} />
        </Field>
        <Field label="Client name">
          <input value={form.client_name} onChange={e => set('client_name', e.target.value)} placeholder="Client or company name" className={input} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Status">
            <select value={form.status} onChange={e => set('status', e.target.value)} className={input}>
              {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </Field>
          <Field label="Priority">
            <select value={form.priority} onChange={e => set('priority', e.target.value)} className={input}>
              {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Description">
          <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Brief project summary" className={input} />
        </Field>
      </Section>

      {/* Dates & budget */}
      <Section title="Timeline & budget">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Start date">
            <input type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} className={input} />
          </Field>
          <Field label="Target end date">
            <input type="date" value={form.target_end_date} onChange={e => set('target_end_date', e.target.value)} className={input} />
          </Field>
        </div>
        <Field label="Budget (USD)">
          <input type="number" min="0" step="100" value={form.budget_total} onChange={e => set('budget_total', e.target.value)} placeholder="10000" className={input} />
        </Field>
      </Section>

      {/* URLs */}
      <Section title="Links">
        <Field label="Repository URL">
          <input value={form.repository_url} onChange={e => set('repository_url', e.target.value)} placeholder="https://github.com/..." className={input} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Staging URL">
            <input value={form.staging_url} onChange={e => set('staging_url', e.target.value)} placeholder="https://staging.example.com" className={input} />
          </Field>
          <Field label="Production URL">
            <input value={form.production_url} onChange={e => set('production_url', e.target.value)} placeholder="https://example.com" className={input} />
          </Field>
        </div>
      </Section>

      {/* Provider IDs */}
      <Section title="Infrastructure IDs">
        <p className="text-xs text-gray-500 -mt-1 mb-3">Paste the project identifiers from each provider dashboard. These connect infrastructure monitoring.</p>
        <Field label="Supabase project ref">
          <input value={form.supabase_project_ref} onChange={e => set('supabase_project_ref', e.target.value)} placeholder="abcdefghijkl" className={input} />
        </Field>
        <Field label="Railway project ID">
          <input value={form.railway_project_id} onChange={e => set('railway_project_id', e.target.value)} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" className={input} />
        </Field>
        <Field label="Vercel project ID">
          <input value={form.vercel_project_id} onChange={e => set('vercel_project_id', e.target.value)} placeholder="prj_xxxxxxxxxxxx" className={input} />
        </Field>
      </Section>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-lg text-sm font-medium text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          {saving ? 'Saving...' : project ? 'Save changes' : 'Create project'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

const input = 'w-full bg-[#0a0a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#0d0d20] border border-white/5 rounded-xl p-5 space-y-4">
      <h2 className="text-sm font-medium text-gray-300">{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      {children}
    </div>
  )
}
