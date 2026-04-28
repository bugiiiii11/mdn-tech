'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const CATEGORIES = ['general', 'about', 'products', 'faq', 'policies', 'tone', 'pricing', 'support', 'other']

const inp = 'w-full bg-[#0a0a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors'

export function PortalKBEntryForm({ chatbotId, entry }: { chatbotId: string; entry?: any }) {
  const router = useRouter()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: entry?.title ?? '',
    category: entry?.category ?? 'general',
    content: entry?.content ?? '',
    sort_order: entry?.sort_order ?? 0,
  })

  function set(k: string, v: string | number) { setForm(f => ({ ...f, [k]: v })) }

  const wordCount = form.content.trim().split(/\s+/).filter(Boolean).length

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = { ...form, chatbot_id: chatbotId }
    let result
    if (entry) {
      result = await supabase.from('chatbot_kb_entries').update(form).eq('id', entry.id)
    } else {
      result = await supabase.from('chatbot_kb_entries').insert(payload)
    }

    if (result.error) { setError(result.error.message); setSaving(false); return }
    router.push(`/portal/chatkit/${chatbotId}`)
    router.refresh()
  }

  async function handleDelete() {
    if (!entry) return
    await supabase.from('chatbot_kb_entries').delete().eq('id', entry.id)
    router.push(`/portal/chatkit/${chatbotId}`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-[#0d0d20]/80 border border-white/[0.06] rounded-xl p-5 space-y-4 backdrop-blur-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Title *</label>
            <input required value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Product Overview" className={inp} />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Category</label>
            <select value={form.category} onChange={e => set('category', e.target.value)} className={inp}>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-gray-400">Content (markdown) *</label>
            <span className="text-xs text-gray-600">{wordCount} words</span>
          </div>
          <textarea
            required
            value={form.content}
            onChange={e => set('content', e.target.value)}
            rows={20}
            placeholder={`Write the knowledge base content here in markdown.

## Example
This section can contain product details, FAQs, tone guidelines, policies, etc.

**Use markdown** for structured content:
- Lists work great
- Headers organize sections
- Code blocks for technical info`}
            className={`${inp} font-mono text-xs leading-relaxed resize-y`}
          />
          <p className="text-xs text-gray-600 mt-1">Supports markdown. This content will be exported as part of the unified knowledge base.</p>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="button-primary px-5 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : entry ? 'Save changes' : 'Add to knowledge base'}
          </button>
          <button type="button" onClick={() => router.back()} className="px-5 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
            Cancel
          </button>
        </div>

        {entry && (
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            Delete entry
          </button>
        )}
      </div>
    </form>
  )
}
