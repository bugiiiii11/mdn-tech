import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { featureById, type FeatureUnlocks } from '@/lib/portal/plans'

export const dynamic = 'force-dynamic'

// POST /api/portal/chatbot/[chatbotId]/feature  { featureId }
// Mock one-time unlock of a per-chatbot feature (conversations, analytics, ...).
// Permanently flips chatbots.feature_unlocks[featureId] = true. Account-scoped
// features (extra_chatbot) go through /api/portal/feature instead.
export async function POST(
  req: Request,
  { params }: { params: Promise<{ chatbotId: string }> }
) {
  const { chatbotId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let featureId: string | undefined
  try {
    const body = await req.json()
    featureId = body?.featureId ? String(body.featureId) : undefined
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const feature = featureId ? featureById(featureId) : undefined
  if (!feature || feature.scope !== 'chatbot') {
    return NextResponse.json({ error: 'Invalid feature' }, { status: 400 })
  }
  if (feature.status !== 'available') {
    return NextResponse.json({ error: 'Feature not available yet' }, { status: 400 })
  }

  // Ownership check via RLS-enforced client
  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('id, owner_id, feature_unlocks')
    .eq('id', chatbotId)
    .eq('owner_id', user.id)
    .maybeSingle<{ id: string; owner_id: string; feature_unlocks: FeatureUnlocks | null }>()

  if (!chatbot) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Idempotent — already unlocked is a no-op success.
  if (chatbot.feature_unlocks?.[feature.id] === true) {
    return NextResponse.json({ ok: true, featureId: feature.id, alreadyUnlocked: true })
  }

  const service = createServiceClient()

  const { error: insertErr } = await service.from('chatbot_purchases').insert({
    chatbot_id: chatbotId,
    customer_id: user.id,
    amount_cents: feature.priceCents,
    credits_added: 0,
    kind: 'feature',
    feature_id: feature.id,
    status: 'mock',
  })

  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 })
  }

  const nextUnlocks: FeatureUnlocks = { ...(chatbot.feature_unlocks ?? {}), [feature.id]: true }

  const { error: updateErr } = await service
    .from('chatbots')
    .update({ feature_unlocks: nextUnlocks })
    .eq('id', chatbotId)

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, featureId: feature.id })
}
