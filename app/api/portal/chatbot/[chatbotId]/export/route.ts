import { createClient } from '@/lib/supabase/server'
import { NextResponse, NextRequest } from 'next/server'
import { exportConversationsMarkdown } from '@/lib/portal/analytics'
import { hasFeature, resolveChatbotTier } from '@/lib/portal/plans'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chatbotId: string }> }
) {
  try {
    const { chatbotId } = await params
    const supabase = await createClient()

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify chatbot ownership
    const [{ data: chatbot }, { data: customer }] = await Promise.all([
      supabase
        .from('chatbots')
        .select('id, name, owner_id, credits_purchased')
        .eq('id', chatbotId)
        .single(),
      supabase
        .from('customers')
        .select('subscription_plan, subscription_status, current_period_end')
        .eq('id', user.id)
        .maybeSingle(),
    ])

    if (!chatbot || chatbot.owner_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Conversation export is Starter+ (matches the detail-page gate)
    const tier = resolveChatbotTier(
      {
        subscription_plan: customer?.subscription_plan ?? null,
        subscription_status: customer?.subscription_status ?? null,
        current_period_end: customer?.current_period_end ?? null,
      },
      chatbot
    )
    if (!hasFeature(tier, 'conversations')) {
      return NextResponse.json(
        { error: 'Conversation export requires the Starter pack or a subscription' },
        { status: 403 }
      )
    }

    // Generate markdown
    const markdown = await exportConversationsMarkdown(
      supabase,
      chatbotId,
      chatbot.name
    )

    // Return as file download
    const filename = `${chatbot.name.toLowerCase().replace(/\s+/g, '-')}-conversations-${new Date().toISOString().split('T')[0]}.md`

    return new NextResponse(markdown, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
