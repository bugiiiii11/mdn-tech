import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { STARTER_PACK_CREDITS, STARTER_PACK_PRICE_CENTS } from '@/lib/chat/usage'

export const dynamic = 'force-dynamic'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ chatbotId: string }> }
) {
  const { chatbotId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Ownership check via RLS-enforced client
  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('id, owner_id, credits_purchased')
    .eq('id', chatbotId)
    .eq('owner_id', user.id)
    .maybeSingle()

  if (!chatbot) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const service = createServiceClient()

  const { error: insertErr } = await service.from('chatbot_purchases').insert({
    chatbot_id: chatbotId,
    customer_id: user.id,
    amount_cents: STARTER_PACK_PRICE_CENTS,
    credits_added: STARTER_PACK_CREDITS,
    status: 'mock',
  })

  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 })
  }

  const { error: updateErr } = await service
    .from('chatbots')
    .update({
      credits_purchased: (chatbot.credits_purchased ?? 0) + STARTER_PACK_CREDITS,
    })
    .eq('id', chatbotId)

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, credits_added: STARTER_PACK_CREDITS })
}
