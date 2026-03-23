import Anthropic from '@anthropic-ai/sdk'
import { createServiceClient } from '@/lib/supabase/service'
import { corsHeaders, corsResponse } from '@/lib/chat/cors'
import { buildSystemPrompt } from '@/lib/chat/prompt'
import { checkRateLimit } from '@/lib/chat/rate-limit'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function OPTIONS() {
  return corsResponse()
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ chatbotId: string }> }
) {
  const startTime = Date.now()
  const { chatbotId } = await params

  // Rate limit by IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const { allowed } = checkRateLimit(ip)
  if (!allowed) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Parse body
  let body: { message: string; visitorId: string; conversationId?: string; sourceUrl?: string }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const { message, visitorId, conversationId, sourceUrl } = body
  if (!message || !visitorId || message.length > 2000) {
    return new Response(JSON.stringify({ error: 'Invalid input' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const supabase = createServiceClient()

  // Fetch chatbot + KB entries in parallel
  const [chatbotResult, kbResult] = await Promise.all([
    supabase.from('chatbots').select('id, name, client_name, status, widget_config')
      .eq('id', chatbotId).single(),
    supabase.from('chatbot_kb_entries').select('title, content, category')
      .eq('chatbot_id', chatbotId).order('sort_order').order('category'),
  ])

  if (chatbotResult.error || !chatbotResult.data || chatbotResult.data.status !== 'active') {
    return new Response(JSON.stringify({ error: 'Chatbot not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const chatbot = chatbotResult.data
  const kbEntries = kbResult.data ?? []

  // Get or create conversation
  let convId = conversationId
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
      return new Response(JSON.stringify({ error: 'Failed to create conversation' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
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
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  let fullResponse = ''
  let inputTokens = 0
  let outputTokens = 0

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = anthropic.messages.stream({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
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

        // Save assistant message and update conversation (fire and forget)
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
      ...corsHeaders,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
