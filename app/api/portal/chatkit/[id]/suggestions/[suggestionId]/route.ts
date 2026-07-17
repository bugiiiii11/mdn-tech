import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Review an auto-learning KB suggestion: accept promotes it to a real
// chatbot_kb_entries row; dismiss just archives it. Owner-only; RLS on
// chatbot_kb_suggestions enforces the same ownership at the DB layer.

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; suggestionId: string }> }
) {
  const { id: chatbotId, suggestionId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { action?: string } = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const action = body.action
  if (action !== 'accept' && action !== 'dismiss') {
    return NextResponse.json({ error: 'action must be accept or dismiss' }, { status: 400 })
  }

  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('id, owner_id')
    .eq('id', chatbotId)
    .single()
  if (!chatbot || chatbot.owner_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data: suggestion } = await supabase
    .from('chatbot_kb_suggestions')
    .select('*')
    .eq('id', suggestionId)
    .eq('chatbot_id', chatbotId)
    .single()
  if (!suggestion) return NextResponse.json({ error: 'Suggestion not found' }, { status: 404 })
  if (suggestion.status !== 'pending') {
    return NextResponse.json({ error: 'Suggestion already reviewed' }, { status: 409 })
  }

  let kbEntryId: string | null = null
  if (action === 'accept') {
    const { data: entry, error: entryError } = await supabase
      .from('chatbot_kb_entries')
      .insert({
        chatbot_id: chatbotId,
        title: suggestion.title,
        content: suggestion.content,
        category: suggestion.category,
      })
      .select('id')
      .single()
    if (entryError || !entry) {
      return NextResponse.json({ error: 'Failed to create KB entry' }, { status: 500 })
    }
    kbEntryId = entry.id
  }

  const { error: updateError } = await supabase
    .from('chatbot_kb_suggestions')
    .update({
      status: action === 'accept' ? 'accepted' : 'dismissed',
      kb_entry_id: kbEntryId,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', suggestionId)
  if (updateError) {
    return NextResponse.json({ error: 'Failed to update suggestion' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, status: action === 'accept' ? 'accepted' : 'dismissed', kbEntryId })
}
