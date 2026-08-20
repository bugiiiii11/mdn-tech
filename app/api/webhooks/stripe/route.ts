import { NextResponse } from 'next/server'
import { getPaymentProvider } from '@/lib/payments/provider'
import { grantPurchasedCredits } from '@/lib/portal/credits'

export const dynamic = 'force-dynamic'

// POST /api/webhooks/stripe — the ONLY place paid credits are granted (launch
// plan 2.3). Signature-verified; idempotent via the ledger's unique
// (provider, provider_ref) index, so Stripe's redeliveries cannot double-grant
// (2.6). Point the Stripe dashboard webhook at this URL with event
// checkout.session.completed once Martin's account exists.
//
// Chargeback clawback (2.7e: negative ledger row + account suspension on
// charge.dispute.created) is deliberately deferred until live keys exist —
// log-and-ack keeps Stripe from retrying meanwhile.
export async function POST(req: Request) {
  const provider = await getPaymentProvider()
  if (!provider) {
    return NextResponse.json({ error: 'Payments not configured' }, { status: 503 })
  }

  const rawBody = await req.text()
  const signature = req.headers.get('stripe-signature')

  let event
  try {
    event = await provider.verifyWebhook(rawBody, signature)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid webhook'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  if (event.type === 'ignored') {
    return NextResponse.json({ received: true, ignored: event.reason })
  }

  const { granted } = await grantPurchasedCredits({
    customerId: event.customerId,
    credits: event.credits,
    packId: event.packId,
    amountCents: event.amountCents,
    provider: provider.id,
    providerRef: event.providerRef,
    note: `Checkout: ${event.packId} pack`,
  })

  return NextResponse.json({ received: true, granted })
}
