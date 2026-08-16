'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { normalizeDomain } from '@/lib/chat/cors'

const inp = 'w-full bg-[#0a0a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors'

// handleSave writes widget_config WHOLESALE — every field the widget can
// consume must exist here and in the form state, or saving this form
// silently erases it from the bot.
type WidgetConfig = {
  greeting?: string
  system_prompt?: string
  primary_color?: string
  /** Optional second gradient stop for the bubble + send button. Empty = flat. */
  secondary_color?: string
  /** Optional https image URL shown inside the launcher bubble + header. */
  launcher_icon?: string
  /** Input placeholder text, for non-English bots. Empty = "Type a message..." */
  input_placeholder?: string
  fallback_message?: string
}

// One domain per line, and whatever the owner pasted gets normalised to a bare
// hostname before it is saved -- the API matches on hostname only.
function parseDomains(raw: string): { domains: string[]; invalid: string[] } {
  const domains: string[] = []
  const invalid: string[] = []
  for (const line of raw.split(/[\n,]/)) {
    const entry = line.trim()
    if (!entry) continue
    const normalized = normalizeDomain(entry)
    if (!normalized) invalid.push(entry)
    else if (!domains.includes(normalized)) domains.push(normalized)
  }
  return { domains, invalid }
}

export function WidgetConfigForm({
  chatbotId,
  config,
  allowedDomains = [],
}: {
  chatbotId: string
  config: WidgetConfig
  allowedDomains?: string[]
}) {
  const router = useRouter()
  const [form, setForm] = useState<WidgetConfig>({
    greeting: config.greeting ?? '',
    system_prompt: config.system_prompt ?? '',
    primary_color: config.primary_color ?? '#7c3aed',
    secondary_color: config.secondary_color ?? '',
    launcher_icon: config.launcher_icon ?? '',
    input_placeholder: config.input_placeholder ?? '',
    fallback_message: config.fallback_message ?? '',
  })
  const [domains, setDomains] = useState(allowedDomains.join('\n'))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    const { domains: parsedDomains, invalid } = parseDomains(domains)
    if (invalid.length > 0) {
      setError(`Not a valid domain: ${invalid.join(', ')}`)
      return
    }

    setSaving(true)
    setError('')
    setSaved(false)

    const supabase = createClient()
    const { error: err } = await supabase
      .from('chatbots')
      .update({ widget_config: form, allowed_domains: parsedDomains })
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
    <div className="bg-[#0d0d20]/80 border border-white/[0.06] rounded-xl p-5 space-y-4 backdrop-blur-sm">
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
          <label className="text-xs text-gray-400 block mb-1">Secondary color (gradient)</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={form.secondary_color || '#06b6d4'}
              onChange={e => setForm({ ...form, secondary_color: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer border border-white/10 bg-transparent"
            />
            <input
              className={inp}
              placeholder="Empty = flat color"
              value={form.secondary_color}
              onChange={e => setForm({ ...form, secondary_color: e.target.value })}
              maxLength={7}
            />
          </div>
          <p className="text-[10px] text-gray-600 mt-1">Bubble + send button become a primary-to-secondary gradient. Clear to keep a flat color.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-400 block mb-1">Launcher icon URL</label>
          <input
            className={inp}
            placeholder="https://yoursite.com/logo.png"
            value={form.launcher_icon}
            onChange={e => setForm({ ...form, launcher_icon: e.target.value })}
          />
          <p className="text-[10px] text-gray-600 mt-1">Shown inside the chat bubble and panel header instead of the generic icon. Transparent PNG/SVG, https only.</p>
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

      <div>
        <label className="text-xs text-gray-400 block mb-1">Input placeholder</label>
        <input
          className={inp}
          placeholder="Type a message..."
          value={form.input_placeholder}
          onChange={e => setForm({ ...form, input_placeholder: e.target.value })}
        />
        <p className="text-[10px] text-gray-600 mt-1">Text shown in the empty message box — set it for non-English bots.</p>
      </div>

      <div>
        <label className="text-xs text-gray-400 block mb-1">Allowed domains</label>
        <textarea
          className={inp + ' h-20 resize-none font-mono text-xs'}
          placeholder={'example.com\n*.example.com'}
          value={domains}
          onChange={e => setDomains(e.target.value)}
          spellCheck={false}
        />
        <p className="text-[10px] text-gray-600 mt-1">
          One per line. Your widget only answers on these domains — anywhere else it is refused, so
          nobody can copy your snippet and spend your credits. <span className="text-gray-500">example.com</span> also
          covers www; use <span className="text-gray-500">*.example.com</span> for all subdomains. Leave empty to allow any site.
        </p>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="button-primary px-4 py-2 rounded-lg text-xs font-medium text-white disabled:opacity-50 transition-colors"
      >
        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save widget settings'}
      </button>
    </div>
  )
}
