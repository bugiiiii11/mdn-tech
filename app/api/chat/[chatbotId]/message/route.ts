import Anthropic from '@anthropic-ai/sdk'
import { createServiceClient } from '@/lib/supabase/service'
import { corsHeaders, corsResponse, isOriginAllowed, requestOrigin } from '@/lib/chat/cors'
import { buildSystemPrompt } from '@/lib/chat/prompt'
import {
  checkRateLimit,
  clientIp,
  CHAT_IP_RULE,
  CHAT_BOT_RULE,
  INTERNAL_BOT_DAILY_RULE,
} from '@/lib/chat/rate-limit'
import { chatMessageSchema, chatbotIdSchema, firstIssue } from '@/lib/chat/schemas'
import { checkChatbotUsage, incrementChatbotUsage } from '@/lib/chat/usage'

const MAX_KB_ENTRIES = 5
const MAX_KB_ENTRY_CHARS = 2000
const CHATBOT_MAX_OUTPUT_TOKENS = 300

export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function OPTIONS(req: Request) {
  // The preflight echoes whatever origin asked. Enforcement is the 403 in POST,
  // not CORS -- see lib/chat/cors.ts.
  return corsResponse(requestOrigin(req))
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ chatbotId: string }> }
) {
  const startTime = Date.now()
  const { chatbotId: rawChatbotId } = await params
  const origin = requestOrigin(req)
  const cors = { ...corsHeaders(origin), 'Content-Type': 'application/json' }

  const json = (body: unknown, status: number, extra?: Record<string, string>) =>
    new Response(JSON.stringify(body), { status, headers: { ...cors, ...extra } })

  // A malformed id would otherwise reach PostgREST and come back as a 500.
  const idCheck = chatbotIdSchema.safeParse(rawChatbotId)
  if (!idCheck.success) {
    return json({ error: 'Chatbot not found' }, 404)
  }
  const chatbotId = idCheck.data

  // Rate limit BEFORE any other work. Both buckets are derivable from the URL
  // alone, so an attacker cannot make us run the chatbot + knowledge-base
  // queries (or Claude) an unbounded number of times by sending requests that
  // were always going to 404.
  const ip = clientIp(req)
  const limit = await checkRateLimit([
    { key: `ip:${ip}`, ...CHAT_IP_RULE },
    { key: `bot:${chatbotId}`, ...CHAT_BOT_RULE },
  ])
  if (!limit.allowed) {
    return json({ error: 'Too many requests' }, 429, {
      'Retry-After': String(limit.retryAfter),
    })
  }

  // Parse + validate body
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return json({ error: 'Invalid JSON' }, 400)
  }

  const parsed = chatMessageSchema.safeParse(raw)
  if (!parsed.success) {
    return json({ error: firstIssue(parsed.error) }, 400)
  }
  const { message, visitorId, conversationId, sourceUrl } = parsed.data

  const supabase = createServiceClient()

  // Fetch chatbot + KB entries in parallel
  const [chatbotResult, kbResult] = await Promise.all([
    supabase.from('chatbots')
      .select('id, name, client_name, status, widget_config, owner_id, allowed_domains')
      .eq('id', chatbotId).single(),
    supabase.from('chatbot_kb_entries').select('title, content, category')
      .eq('chatbot_id', chatbotId).order('sort_order').order('category'),
  ])

  if (chatbotResult.error || !chatbotResult.data || chatbotResult.data.status !== 'active') {
    return json({ error: 'Chatbot not found' }, 404)
  }

  const chatbot = chatbotResult.data
  const allKbEntries = kbResult.data ?? []
  const allowedDomains: string[] = chatbot.allowed_domains ?? []
  const isInternal = !chatbot.owner_id

  // Domain binding. Owner-less internal bots are unmetered, so for them an
  // unset allow-list is a hard deny rather than "allow any origin".
  if (isInternal && allowedDomains.length === 0) {
    return json({ error: 'This chatbot is not configured for public use.' }, 403)
  }
  if (!isOriginAllowed(origin, allowedDomains)) {
    return json({ error: 'This chatbot is not authorised on this domain.' }, 403)
  }

  // Unmetered bots burn Claude tokens with no credit balance to stop them, so
  // their ceiling is a daily message cap instead. Only checkable once we know
  // the bot has no owner, hence the second call.
  if (isInternal) {
    const daily = await checkRateLimit([
      { key: `botday:${chatbotId}`, ...INTERNAL_BOT_DAILY_RULE },
    ])
    if (!daily.allowed) {
      return json({ error: 'Daily message limit reached.' }, 429, {
        'Retry-After': String(daily.retryAfter),
      })
    }
  }

  // Per-chatbot lifetime usage check (only customer-owned bots are metered)
  if (!isInternal) {
    const { allowed } = await checkChatbotUsage(chatbotId)
    if (!allowed) {
      return json(
        { error: 'Message limit reached. The site owner needs to buy more credits.' },
        429
      )
    }
  }

  // Cap KB context: top-N by sort_order, each truncated to MAX_KB_ENTRY_CHARS,
  // so input tokens stay bounded regardless of how big the customer's KB grows.
  const kbEntries = allKbEntries.slice(0, MAX_KB_ENTRIES).map((e) => ({
    title: e.title,
    category: e.category,
    content: e.content.length > MAX_KB_ENTRY_CHARS
      ? e.content.slice(0, MAX_KB_ENTRY_CHARS) + '\n\n[…truncated]'
      : e.content,
  }))

  // Get or create conversation. An attacker-supplied conversationId is a valid
  // uuid by now but need not belong to this chatbot -- scope the lookup so one
  // bot can never append to (or read history from) another's conversation.
  let convId: string | undefined
  if (conversationId) {
    const { data: existing } = await supabase
      .from('chat_conversations')
      .select('id')
      .eq('id', conversationId)
      .eq('chatbot_id', chatbotId)
      .maybeSingle()
    convId = existing?.id
  }

  if (!convId) {
    const { data: conv, error } = await supabase
      .from('chat_conversations')
      .insert({
        chatbot_id: chatbotId,
        visitor_id: visitorId,
        visitor_ip: ip !== 'unknown' ? ip : null,
        source_url: sourceUrl || null,
      })
      .select('id')
      .single()

    if (error || !conv) {
      return json({ error: 'Failed to create conversation' }, 500)
    }
    convId = conv.id
  }

  // Insert user message
  await supabase.from('chat_messages').insert({
    conversation_id: convId,
    chatbot_id: chatbotId,
    role: 'user',
    content: message,
  })

  // Fetch conversation history (last 20 messages)
  const { data: history } = await supabase
    .from('chat_messages')
    .select('role, content')
    .eq('conversation_id', convId)
    .order('created_at', { ascending: true })
    .limit(20)

  // Build messages for Claude
  const systemPrompt = buildSystemPrompt(chatbot, kbEntries)
  const messages: { role: 'user' | 'assistant'; content: string }[] = (history ?? []).map(m => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }))

  // Stream Claude response
  const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_CHATBOT_API_KEY })

  let fullResponse = ''
  let inputTokens = 0
  let outputTokens = 0

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = anthropic.messages.stream({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: CHATBOT_MAX_OUTPUT_TOKENS,
          system: systemPrompt,
          messages,
        })

        response.on('text', (text) => {
          fullResponse += text
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token: text })}\n\n`))
        })

        const finalMessage = await response.finalMessage()
        inputTokens = finalMessage.usage.input_tokens
        outputTokens = finalMessage.usage.output_tokens

        // Send done event with conversation ID
        controller.enqueue(encoder.encode(
          `data: ${JSON.stringify({ done: true, conversationId: convId })}\n\n`
        ))
        controller.close()

        // Persist assistant message + conversation update + per-chatbot usage
        // increment together. All three are awaited so Vercel doesn't terminate
        // the lambda before the credit counter ticks. Internal bots increment
        // too -- it costs nothing and gives ops a real number to look at.
        const latencyMs = Date.now() - startTime
        await Promise.all([
          supabase.from('chat_messages').insert({
            conversation_id: convId,
            chatbot_id: chatbotId,
            role: 'assistant',
            content: fullResponse,
            input_tokens: inputTokens,
            output_tokens: outputTokens,
            latency_ms: latencyMs,
          }),
          supabase.from('chat_conversations')
            .update({
              message_count: (history?.length ?? 0) + 1,
              last_message_at: new Date().toISOString(),
            })
            .eq('id', convId),
          incrementChatbotUsage(chatbotId),
        ])
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error'
        controller.enqueue(encoder.encode(
          `data: ${JSON.stringify({ error: errorMsg })}\n\n`
        ))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      ...corsHeaders(origin),
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
