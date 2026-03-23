'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const inp = 'w-full bg-[#0a0a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors'

type WidgetConfig = {
  greeting?: string
  system_prompt?: string
  primary_color?: string
  fallback_message?: string
}

export function WidgetConfigForm({ chatbotId, config }: { chatbotId: string; config: WidgetConfig }) {
  const router = useRouter()
  const [form, setForm] = useState<WidgetConfig>({
    greeting: config.greeting ?? '',
    system_prompt: config.system_prompt ?? '',
    primary_color: config.primary_color ?? '#7c3aed',
    fallback_message: config.fallback_message ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    setSaving(true)
    setError('')
    setSaved(false)

    const supabase = createClient()
    const { error: err } = await supabase
      .from('chatbots')
      .update({ widget_config: form })
      .eq('id', chatbotId)

    setSaving(false)
    if (err) {
      setError(err.message)
    } else {
      setSaved(true)
      router.refresh()
      setTimeout(() => setSaved(false), 2000)
    }
  }

  return (
    <div className="bg-[#0d0d20] border border-white/5 rounded-xl p-5 space-y-4">
      <h3 className="text-sm font-medium text-white">Widget Settings</h3>

      <div>
        <label className="text-xs text-gray-400 block mb-1">Greeting message</label>
        <input
          className={inp}
          placeholder="Hi! How can I help you today?"
          value={form.greeting}
          onChange={e => setForm({ ...form, greeting: e.target.value })}
        />
      </div>

      <div>
        <label className="text-xs text-gray-400 block mb-1">System prompt</label>
        <textarea
          className={inp + ' h-24 resize-none'}
          placeholder="You are a helpful assistant for our company..."
          value={form.system_prompt}
          onChange={e => setForm({ ...form, system_prompt: e.target.value })}
        />
        <p className="text-[10px] text-gray-600 mt-1">Custom instructions for the AI. Leave empty for default.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-400 block mb-1">Primary color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={form.primary_color}
              onChange={e => setForm({ ...form, primary_color: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer border border-white/10 bg-transparent"
            />
            <input
              className={inp}
              value={form.primary_color}
              onChange={e => setForm({ ...form, primary_color: e.target.value })}
              maxLength={7}
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Fallback message</label>
          <input
            className={inp}
            placeholder="I'm not sure about that. Contact us directly."
            value={form.fallback_message}
            onChange={e => setForm({ ...form, fallback_message: e.target.value })}
          />
        </div>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-4 py-2 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save widget settings'}
      </button>
    </div>
  )
}
