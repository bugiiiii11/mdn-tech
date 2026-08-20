import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { creditPackById } from '@/lib/portal/plans'
import { getPaymentProvider } from '@/lib/payments/provider'
import { grantPurchasedCredits } from '@/lib/portal/credits'

export const dynamic = 'force-dynamic'

// POST /api/portal/credits/purchase  { packId, returnTo? }
//
// THE credit checkout — the single successor to the three mock routes (launch
// plan 2.4b): credits are account-level, so there is no chatbotId here, and
// feature unlocks no longer touch money (see /api/portal/unlock).
//
// With payment keys configured: creates a hosted checkout session and returns
// { url }; the CREDITS ARE GRANTED BY THE WEBHOOK, never here. Without keys
// (pre-Stripe-UAE dev/E2E): grants immediately via the ledger, marked
// provider 'mock'.
export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let packId: string | undefined
  let returnTo = '/portal/upgrade'
  try {
    const body = await req.json()
    if (body?.packId) packId = String(body.packId)
    // Only same-site paths — never redirect checkout back to a foreign origin.
    if (typeof body?.returnTo === 'string' && body.returnTo.startsWith('/') && !body.returnTo.startsWith('//')) {
      returnTo = body.returnTo
    }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const pack = packId ? creditPackById(packId) : undefined
  if (!pack) return NextResponse.json({ error: 'Invalid pack' }, { status: 400 })

  const provider = await getPaymentProvider()

  if (provider) {
    const origin = new URL(req.url).origin
    const join = returnTo.includes('?') ? '&' : '?'
    const { url } = await provider.createCheckout({
      customerId: user.id,
      customerEmail: user.email ?? '',
      pack,
      successUrl: `${origin}${returnTo}${join}purchase=success`,
      cancelUrl: `${origin}${returnTo}${join}purchase=cancelled`,
    })
    return NextResponse.json({ url })
  }

  // Mock path: no payment keys yet. Same ledger write the webhook would do.
  const { granted } = await grantPurchasedCredits({
    customerId: user.id,
    credits: pack.credits,
    packId: pack.id,
    amountCents: pack.priceCents,
    provider: 'mock',
    providerRef: crypto.randomUUID(),
    note: 'Mock checkout — no payment keys configured',
  })
  if (!granted) {
    return NextResponse.json({ error: 'Duplicate purchase reference' }, { status: 409 })
  }
  return NextResponse.json({ ok: true, credits_added: pack.credits, pack_id: pack.id })
}
