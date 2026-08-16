import { createServiceClient } from '@/lib/supabase/service'
import { corsHeaders, corsResponse, isOriginAllowed, requestOrigin } from '@/lib/chat/cors'
import { checkChatbotUsage } from '@/lib/chat/usage'
import { chatbotIdSchema } from '@/lib/chat/schemas'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function OPTIONS(req: Request) {
  return corsResponse(requestOrigin(req))
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ chatbotId: string }> }
) {
  const { chatbotId: rawChatbotId } = await params
  const origin = requestOrigin(req)
  const cors = corsHeaders(origin)

  const idCheck = chatbotIdSchema.safeParse(rawChatbotId)
  if (!idCheck.success) {
    return NextResponse.json({ error: 'Chatbot not found' }, { status: 404, headers: cors })
  }
  const chatbotId = idCheck.data

  const supabase = createServiceClient()

  const { data: chatbot, error } = await supabase
    .from('chatbots')
    .select('name, client_name, status, widget_config, owner_id, allowed_domains')
    .eq('id', chatbotId)
    .single()

  if (error || !chatbot || chatbot.status !== 'active') {
    return NextResponse.json({ error: 'Chatbot not found' }, { status: 404, headers: cors })
  }

  // Same domain binding as the message route: refuse to hand over the widget
  // config (greeting, colour, client name) to an unauthorised embed, so a
  // lifted snippet fails visibly at load instead of on first message.
  const allowedDomains: string[] = chatbot.allowed_domains ?? []
  if (!chatbot.owner_id && allowedDomains.length === 0) {
    return NextResponse.json(
      { error: 'This chatbot is not configured for public use.' },
      { status: 403, headers: cors }
    )
  }
  if (!isOriginAllowed(origin, allowedDomains)) {
    return NextResponse.json(
      { error: 'This chatbot is not authorised on this domain.' },
      { status: 403, headers: cors }
    )
  }

  const config = (chatbot.widget_config ?? {}) as Record<string, unknown>

  // Pause widget when chatbot has hit its message cap (customer-owned only)
  let disabled = false
  if (chatbot.owner_id) {
    const { allowed } = await checkChatbotUsage(chatbotId)
    disabled = !allowed
  }

  // Optional branding, validated here because the widget concatenates these
  // into CSS / an img src: colours must be hex literals, the icon an https
  // URL. Anything else is dropped, never passed through.
  const primaryColor =
    typeof config.primary_color === 'string' &&
    /^#[0-9a-fA-F]{3,8}$/.test(config.primary_color)
      ? config.primary_color
      : '#7c3aed'
  const secondaryColor =
    typeof config.secondary_color === 'string' &&
    /^#[0-9a-fA-F]{3,8}$/.test(config.secondary_color)
      ? config.secondary_color
      : undefined
  const launcherIcon =
    typeof config.launcher_icon === 'string' &&
    /^https:\/\/[^\s"'<>]+$/.test(config.launcher_icon)
      ? config.launcher_icon
      : undefined

  return NextResponse.json({
    name: chatbot.name,
    clientName: chatbot.client_name,
    greeting: config.greeting || `Hi! I'm ${chatbot.name}. How can I help you?`,
    inputPlaceholder:
      typeof config.input_placeholder === 'string' && config.input_placeholder
        ? config.input_placeholder
        : undefined,
    primaryColor,
    secondaryColor,
    launcherIcon,
    position: config.position || 'bottom-right',
    disabled,
  }, { headers: cors })
}
