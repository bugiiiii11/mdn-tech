'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Plus, ChevronDown } from 'lucide-react'

const CHANNELS = ['email', 'call', 'slack', 'whatsapp', 'meeting', 'other']

export function QuickAddComm({ projects, userId }: { projects: { id: string; name: string }[]; userId: string }) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const [form, setForm] = useState({
    project_id: '',
    channel: 'email',
    direction: 'outbound',
    contact_name: '',
    subject: '',
    summary: '',
    action_items: '',
    occurred_at: new Date().toISOString().slice(0, 16),
  })

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await supabase.from('communications').insert({
      ...form,
      author_id: userId,
      occurred_at: new Date(form.occurred_at).toISOString(),
    })
    setSaving(false)
    setOpen(false)
    setForm(f => ({ ...f, subject: '', summary: '', action_items: '', contact_name: '' }))
    router.refresh()
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-[#0d0d20] border border-white/5 rounded-xl text-sm text-gray-400 hover:text-white hover:border-purple-500/20 transition-colors"
      >
        <Plus className="w-4 h-4" /> Log communication
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#0d0d20] border border-purple-500/20 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-medium text-white">Log communication</h2>
        <button type="button" onClick={() => setOpen(false)} className="text-gray-500 hover:text-white text-xs transition-colors">Cancel</button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Project</label>
          <select value={form.project_id} onChange={e => set('project_id', e.target.value)} required className={inp}>
            <option value="">Select project</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Channel</label>
          <select value={form.channel} onChange={e => set('channel', e.target.value)} className={inp}>
            {CHANNELS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Direction</label>
          <select value={form.direction} onChange={e => set('direction', e.target.value)} className={inp}>
            <option value="outbound">Outbound</option>
            <option value="inbound">Inbound</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Contact name</label>
          <input value={form.contact_name} onChange={e => set('contact_name', e.target.value)} placeholder="Client contact" className={inp} />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Date & time</label>
          <input type="datetime-local" value={form.occurred_at} onChange={e => set('occurred_at', e.target.value)} className={inp} />
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">Subject</label>
        <input value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="Brief subject line" className={inp} />
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">Summary *</label>
        <textarea required value={form.summary} onChange={e => set('summary', e.target.value)} rows={3} placeholder="What was discussed?" className={inp} />
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">Action items</label>
        <textarea value={form.action_items} onChange={e => set('action_items', e.target.value)} rows={2} placeholder="Follow-up tasks (if any)" className={inp} />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="px-4 py-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-lg text-sm font-medium text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
      >
        {saving ? 'Saving...' : 'Log entry'}
      </button>
    </form>
  )
}

const inp = 'w-full bg-[#0a0a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors'
