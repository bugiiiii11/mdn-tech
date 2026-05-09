import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { PLANS, type SubscriptionPlan } from '@/lib/portal/plans'

export const dynamic = 'force-dynamic'

const PLAN_MS = 30 * 24 * 60 * 60 * 1000

// POST /api/portal/subscription { plan: 'pro' | 'max' }
// Mock subscription create / change. Real Stripe Checkout slots in here later.
export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { plan?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const plan = body.plan as SubscriptionPlan | undefined
  if (plan !== 'pro' && plan !== 'max') {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const service = createServiceClient()

  const { data: existing } = await service
    .from('customers')
    .select('subscription_plan, subscription_status, current_period_end, period_messages_used')
    .eq('id', user.id)
    .maybeSingle()

  const fromPlan = existing?.subscription_plan ?? null
  const isActive = existing?.subscription_status === 'active'
  const eventType = !isActive
    ? 'created'
    : fromPlan === plan
      ? 'reactivated'
      : (PLANS[plan].priceCents > PLANS[(fromPlan as SubscriptionPlan) ?? 'pro'].priceCents ? 'upgraded' : 'downgraded')

  const now = new Date()
  // On a fresh sub or plan change, reset the period window. Keep the existing
  // period_messages_used if the customer is just reactivating the same plan
  // mid-cycle (real Stripe webhooks would handle this differently).
  const resetPeriod = !isActive || fromPlan !== plan
  const periodStart = resetPeriod ? now : existing?.current_period_end ? new Date(existing.current_period_end) : now
  const periodEnd = new Date((resetPeriod ? now.getTime() : (existing?.current_period_end ? new Date(existing.current_period_end).getTime() : now.getTime())) + PLAN_MS)

  const { error: updateErr } = await service
    .from('customers')
    .update({
      subscription_plan: plan,
      subscription_status: 'active',
      current_period_start: periodStart.toISOString(),
      current_period_end: periodEnd.toISOString(),
      period_messages_used: resetPeriod ? 0 : existing?.period_messages_used ?? 0,
    })
    .eq('id', user.id)

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  await service.from('subscription_events').insert({
    customer_id: user.id,
    event_type: eventType,
    from_plan: fromPlan,
    to_plan: plan,
    metadata: { mock: true },
  })

  return NextResponse.json({ ok: true, plan, period_end: periodEnd.toISOString() })
}

// DELETE /api/portal/subscription — cancel active sub.
// Marks status canceled but keeps period_end so the customer keeps access
// through the rest of the cycle (Stripe convention).
export async function DELETE() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const service = createServiceClient()

  const { data: existing } = await service
    .from('customers')
    .select('subscription_plan, subscription_status')
    .eq('id', user.id)
    .maybeSingle()

  if (!existing || existing.subscription_status !== 'active') {
    return NextResponse.json({ error: 'No active subscription' }, { status: 400 })
  }

  const { error: updateErr } = await service
    .from('customers')
    .update({ subscription_status: 'canceled' })
    .eq('id', user.id)

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  await service.from('subscription_events').insert({
    customer_id: user.id,
    event_type: 'canceled',
    from_plan: existing.subscription_plan,
    to_plan: null,
    metadata: { mock: true },
  })

  return NextResponse.json({ ok: true })
}
