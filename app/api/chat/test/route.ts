import Anthropic from '@anthropic-ai/sdk'
import { createServiceClient } from '@/lib/supabase/service'
import { corsHeaders } from '@/lib/chat/cors'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const checks: Record<string, string> = {}

  // Check env vars
  checks.anthropicKey = process.env.CLAUDE_CHATBOT_API_KEY ? 'set (' + process.env.CLAUDE_CHATBOT_API_KEY.slice(0, 12) + '...)' : 'MISSING'
  checks.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'MISSING'
  checks.serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ? 'set (' + process.env.SUPABASE_SERVICE_ROLE_KEY.slice(0, 12) + '...)' : 'MISSING'

  // Test Supabase
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase.from('chatbots').select('id, name').limit(1)
    checks.supabase = error ? 'ERROR: ' + error.message : 'OK (' + (data?.length ?? 0) + ' chatbots)'
  } catch (e) {
    checks.supabase = 'EXCEPTION: ' + (e instanceof Error ? e.message : String(e))
  }

  // Test Anthropic
  try {
    const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_CHATBOT_API_KEY })
    const msg = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 20,
      messages: [{ role: 'user', content: 'Say "hello" in one word.' }],
    })
    checks.anthropic = 'OK: ' + (msg.content[0].type === 'text' ? msg.content[0].text : 'non-text')
  } catch (e) {
    checks.anthropic = 'ERROR: ' + (e instanceof Error ? e.message : String(e))
  }

  return NextResponse.json(checks, { headers: corsHeaders })
}
