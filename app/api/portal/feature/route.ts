import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { featureById } from '@/lib/portal/plans'

export const dynamic = 'force-dynamic'

// POST /api/portal/feature  { featureId: 'extra_chatbot' }
// Mock one-time purchase of an ACCOUNT-scoped feature. Today only the
// "additional chatbot" slot lives here — it bumps customers.extra_chatbot_slots.
// Per-chatbot features go through /api/portal/chatbot/[chatbotId]/feature.
export async function POST(req: Request) {
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
  if (!feature || feature.scope !== 'account') {
    return NextResponse.json({ error: 'Invalid feature' }, { status: 400 })
  }
  if (feature.status !== 'available') {
    return NextResponse.json({ error: 'Feature not available yet' }, { status: 400 })
  }

  const service = createServiceClient()

  const { data: customer } = await service
    .from('customers')
    .select('extra_chatbot_slots')
    .eq('id', user.id)
    .maybeSingle<{ extra_chatbot_slots: number | null }>()

  if (feature.id === 'extra_chatbot') {
    const { error: updateErr } = await service
      .from('customers')
      .update({ extra_chatbot_slots: (customer?.extra_chatbot_slots ?? 0) + 1 })
      .eq('id', user.id)

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 })
    }
  }

  return NextResponse.json({ ok: true, featureId: feature.id })
}
