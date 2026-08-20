import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { featureById, type FeatureUnlocks } from '@/lib/portal/plans'
import { creditBalance, spendCredits } from '@/lib/portal/credits'

export const dynamic = 'force-dynamic'

// POST /api/portal/unlock  { featureId, chatbotId? }
//
// One-time feature unlock paid in CREDITS (launch plan 2.4b) — replaces both
// mock feature routes. Per-chatbot features require chatbotId (ownership
// checked); the account-scoped extra_chatbot slot omits it and stacks.
//
// Order matters: spend first (spend_credits() is the overdraft-proof
// authority), then flip the unlock; a failed flip re-credits automatically
// (2.7c — failed actions give back credits, never money).
export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let featureId: string | undefined
  let chatbotId: string | undefined
  try {
    const body = await req.json()
    featureId = body?.featureId ? String(body.featureId) : undefined
    chatbotId = body?.chatbotId ? String(body.chatbotId) : undefined
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const feature = featureId ? featureById(featureId) : undefined
  if (!feature) return NextResponse.json({ error: 'Invalid feature' }, { status: 400 })
  if (feature.status !== 'available') {
    return NextResponse.json({ error: 'Feature not available yet' }, { status: 400 })
  }

  // Per-chatbot features: verify ownership via the RLS client and short-circuit
  // if already unlocked (idempotent no-op, nothing is spent).
  let unlocks: FeatureUnlocks | null = null
  if (feature.scope === 'chatbot') {
    if (!chatbotId) return NextResponse.json({ error: 'chatbotId required' }, { status: 400 })

    const { data: chatbot } = await supabase
      .from('chatbots')
      .select('id, feature_unlocks')
      .eq('id', chatbotId)
      .eq('owner_id', user.id)
      .maybeSingle<{ id: string; feature_unlocks: FeatureUnlocks | null }>()

    if (!chatbot) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (chatbot.feature_unlocks?.[feature.id] === true) {
      return NextResponse.json({ ok: true, featureId: feature.id, alreadyUnlocked: true })
    }
    unlocks = chatbot.feature_unlocks
  }

  const spend = await spendCredits({
    customerId: user.id,
    amount: feature.creditCost,
    kind: 'spend_unlock',
    chatbotId: feature.scope === 'chatbot' ? chatbotId : undefined,
    featureId: feature.id,
    note: `Unlock: ${feature.name}`,
  })

  if (!spend.ok) {
    const balance = await creditBalance(user.id)
    return NextResponse.json(
      {
        error: 'insufficient_credits',
        message: `This unlock costs ${feature.creditLabel}; your balance is ${balance.toLocaleString('en-US')}.`,
        needed: feature.creditCost,
        balance,
      },
      { status: 402 }
    )
  }

  const service = createServiceClient()
  const applyError =
    feature.scope === 'chatbot'
      ? (
          await service
            .from('chatbots')
            .update({ feature_unlocks: { ...(unlocks ?? {}), [feature.id]: true } })
            .eq('id', chatbotId!)
        ).error
      : await (async () => {
          const { data: customer } = await service
            .from('customers')
            .select('extra_chatbot_slots')
            .eq('id', user.id)
            .maybeSingle<{ extra_chatbot_slots: number | null }>()
          return (
            await service
              .from('customers')
              .update({ extra_chatbot_slots: (customer?.extra_chatbot_slots ?? 0) + 1 })
              .eq('id', user.id)
          ).error
        })()

  if (applyError) {
    // The spend landed but the unlock did not — give the credits back (2.7c).
    await service.from('credits_ledger').insert({
      customer_id: user.id,
      delta: feature.creditCost,
      kind: 'recredit',
      feature_id: feature.id,
      chatbot_id: feature.scope === 'chatbot' ? chatbotId : null,
      note: `Unlock failed to apply, credits returned: ${applyError.message}`,
    })
    return NextResponse.json({ error: 'Unlock failed, credits returned' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, featureId: feature.id, balance: spend.balance })
}
