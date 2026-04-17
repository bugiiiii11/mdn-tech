'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const inp = 'w-full bg-[#0a0a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors'

export function PortalChatbotForm({ chatbot, userId }: { chatbot?: any; userId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: chatbot?.name ?? '',
    description: chatbot?.description ?? '',
    status: chatbot?.status ?? 'active',
  })

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    let result
    if (chatbot) {
      result = await supabase.from('chatbots').update(form).eq('id', chatbot.id)
    } else {
      const payload = { ...form, owner_id: userId }
      result = await supabase.from('chatbots').insert(payload).select('id').single()
    }

    if (result.error) { setError(result.error.message); setSaving(false); return }
    const id = chatbot?.id ?? (result.data as any).id

    // Auto-enroll in ChatKit product if creating a new chatbot
    if (!chatbot) {
      await supabase.from('customer_products').insert({
        customer_id: userId,
        product: 'chatkit',
        plan: 'free',
        status: 'active',
      })
      // Ignore error if product already enrolled (unique constraint)
    }

    router.push(`/portal/chatkit/${id}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      <div className="bg-[#0d0d20] border border-white/5 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-medium text-gray-300">Chatbot info</h2>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Name *</label>
          <input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Support Bot" className={inp} />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Status</label>
          <select value={form.status} onChange={e => set('status', e.target.value)} className={inp}>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Description</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} placeholder="What this chatbot does" className={inp} />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-sm font-medium text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          {saving ? 'Saving...' : chatbot ? 'Save changes' : 'Create chatbot'}
        </button>
        <button type="button" onClick={() => router.back()} className="px-5 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  )
}
