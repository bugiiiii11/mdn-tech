import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { CREDIT_PACKS, creditPackById } from '@/lib/portal/plans'

export const dynamic = 'force-dynamic'

// POST /api/portal/chatbot/[chatbotId]/purchase  { packId?: 'starter' | 'growth' | 'scale' }
// Mock credit-pack purchase. Adds the pack's credits to the chatbot's balance.
// Real Stripe / MoR checkout slots in here later.
export async function POST(
  req: Request,
  { params }: { params: Promise<{ chatbotId: string }> }
) {
  const { chatbotId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Default to the Starter pack when no body is sent (legacy callers).
  let packId = CREDIT_PACKS[0].id as string
  try {
    const body = await req.json()
    if (body?.packId) packId = String(body.packId)
  } catch {
    // no body — keep default
  }

  const pack = creditPackById(packId)
  if (!pack) return NextResponse.json({ error: 'Invalid pack' }, { status: 400 })

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
    amount_cents: pack.priceCents,
    credits_added: pack.credits,
    kind: 'credits',
    pack_id: pack.id,
    status: 'mock',
  })

  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 })
  }

  const { error: updateErr } = await service
    .from('chatbots')
    .update({
      credits_purchased: (chatbot.credits_purchased ?? 0) + pack.credits,
    })
    .eq('id', chatbotId)

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, credits_added: pack.credits, pack_id: pack.id })
}
