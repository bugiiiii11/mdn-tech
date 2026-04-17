import { createClient } from '@/lib/supabase/server'
import { NextResponse, NextRequest } from 'next/server'
import { exportConversationsMarkdown } from '@/lib/portal/analytics'

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
    const { data: chatbot } = await supabase
      .from('chatbots')
      .select('id, name, owner_id')
      .eq('id', chatbotId)
      .single()

    if (!chatbot || chatbot.owner_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
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
