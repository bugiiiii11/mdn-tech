import { createServiceClient } from '@/lib/supabase/service'
import { corsHeaders, corsResponse } from '@/lib/chat/cors'
import { checkUsageLimit } from '@/lib/chat/usage'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function OPTIONS() {
  return corsResponse()
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ chatbotId: string }> }
) {
  const { chatbotId } = await params
  const supabase = createServiceClient()

  const { data: chatbot, error } = await supabase
    .from('chatbots')
    .select('name, client_name, status, widget_config, owner_id')
    .eq('id', chatbotId)
    .single()

  if (error || !chatbot || chatbot.status !== 'active') {
    return NextResponse.json(
      { error: 'Chatbot not found' },
      { status: 404, headers: corsHeaders }
    )
  }

  const config = (chatbot.widget_config ?? {}) as Record<string, unknown>

  // Check usage limit if customer-owned
  let disabled = false
  if (chatbot.owner_id) {
    const { allowed } = await checkUsageLimit(chatbot.owner_id, 'chatkit')
    disabled = !allowed
  }

  return NextResponse.json({
    name: chatbot.name,
    clientName: chatbot.client_name,
    greeting: config.greeting || `Hi! I'm ${chatbot.name}. How can I help you?`,
    primaryColor: config.primary_color || '#7c3aed',
    position: config.position || 'bottom-right',
    disabled,
  }, { headers: corsHeaders })
}
