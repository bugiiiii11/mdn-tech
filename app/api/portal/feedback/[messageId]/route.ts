import { createClient } from '@/lib/supabase/server'
import { NextResponse, NextRequest } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
) {
  try {
    const { messageId } = await params
    const supabase = await createClient()

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { rating, chatbotId } = body

    if (!rating || !chatbotId) {
      return NextResponse.json(
        { error: 'Missing rating or chatbotId' },
        { status: 400 }
      )
    }

    // Verify chatbot ownership
    const { data: chatbot } = await supabase
      .from('chatbots')
      .select('id, owner_id')
      .eq('id', chatbotId)
      .single()

    if (!chatbot || chatbot.owner_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Upsert feedback
    const { data, error } = await supabase
      .from('message_feedback')
      .upsert({
        message_id: messageId,
        chatbot_id: chatbotId,
        customer_id: user.id,
        rating,
      })
      .select()
      .single()

    if (error) {
      console.error('Feedback error:', error)
      return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Feedback error:', error)
    return NextResponse.json({ error: 'Feedback failed' }, { status: 500 })
  }
}
