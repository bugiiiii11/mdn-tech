import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { messageIds } = await request.json()
  if (!Array.isArray(messageIds) || messageIds.length === 0) {
    return NextResponse.json([])
  }

  const { data: feedbacks, error } = await supabase
    .from('message_feedback')
    .select('id, message_id, rating')
    .in('message_id', messageIds)
    .eq('customer_id', user.id)

  if (error) {
    console.error('Feedback fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 })
  }

  return NextResponse.json(feedbacks || [])
}
