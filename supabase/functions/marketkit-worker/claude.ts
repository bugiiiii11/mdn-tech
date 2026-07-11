// Minimal Anthropic Messages API client for the worker (Deno, raw fetch — matches
// the _shared/notify.ts style). Returns parsed JSON from the model's text output.
// Model ids + params verified against the claude-api skill (2026-07): scan uses
// claude-sonnet-5 (thinking disabled for speed), launch kit uses claude-fable-5
// (thinking always on — omit the param) with a server-side fallback to opus 4.8.

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const ANTHROPIC_VERSION = '2023-06-01'

export interface ClaudeImage {
  media_type: string // image/png | image/jpeg | image/webp | image/gif
  data: string // base64, no newlines
}

interface CallOpts {
  model: string
  system: string
  text: string
  images?: ClaudeImage[]
  maxTokens: number
  effort?: 'low' | 'medium' | 'high'
  disableThinking?: boolean // sonnet-5 accepts {type:'disabled'}; fable-5 rejects it — leave false there
  fallbackModel?: string // fable-5 refusal insurance (server-side-fallback beta)
}

export async function callClaudeJSON<T = unknown>(opts: CallOpts): Promise<T> {
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set in Edge Function secrets')

  const content: Array<Record<string, unknown>> = []
  for (const img of opts.images ?? []) {
    content.push({
      type: 'image',
      source: { type: 'base64', media_type: img.media_type, data: img.data },
    })
  }
  content.push({ type: 'text', text: opts.text })

  const body: Record<string, unknown> = {
    model: opts.model,
    max_tokens: opts.maxTokens,
    system: opts.system,
    messages: [{ role: 'user', content }],
    output_config: { effort: opts.effort ?? 'medium' },
  }
  if (opts.disableThinking) body.thinking = { type: 'disabled' }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': ANTHROPIC_VERSION,
  }
  if (opts.fallbackModel) {
    headers['anthropic-beta'] = 'server-side-fallback-2026-06-01'
    body.fallbacks = [{ model: opts.fallbackModel }]
  }

  const res = await fetch(ANTHROPIC_URL, { method: 'POST', headers, body: JSON.stringify(body) })
  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(`Anthropic ${res.status}: ${errText.slice(0, 400)}`)
  }
  const data = await res.json()

  if (data.stop_reason === 'refusal') {
    throw new Error('model declined the request (safety refusal)')
  }

  const textOut = (data.content ?? [])
    .filter((b: { type: string }) => b.type === 'text')
    .map((b: { text: string }) => b.text)
    .join('')

  return extractJson<T>(textOut)
}

// The model is instructed to return a single JSON object; be defensive about any
// preamble/fencing and parse the outermost {...}.
function extractJson<T>(text: string): T {
  let s = text.trim()
  // strip ```json fences if present
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fence) s = fence[1].trim()
  const start = s.indexOf('{')
  const end = s.lastIndexOf('}')
  if (start === -1 || end === -1 || end < start) {
    throw new Error(`no JSON object in model output: ${s.slice(0, 200)}`)
  }
  try {
    return JSON.parse(s.slice(start, end + 1)) as T
  } catch (err) {
    throw new Error(`failed to parse model JSON: ${err instanceof Error ? err.message : err}`)
  }
}
