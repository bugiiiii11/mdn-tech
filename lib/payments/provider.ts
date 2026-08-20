// PaymentProvider abstraction (launch plan 2.2).
//
// Stripe is the first adapter; N-Genius becomes a second adapter later — the
// trigger is DATA, not calendar (decided 2026-08-06): at ~$2k+/mo check the
// Stripe card-country report; heavy UAE/GCC volume justifies N-Genius (~AED
// 3,500 setup), mostly-EU cards means it can wait. Dual operation (N-Genius
// locally + Stripe internationally) stays possible behind this interface.
//
// Money only ever buys CREDIT PACKS. Grants land in `credits_ledger` via the
// webhook (signature-verified, idempotent on (provider, provider_ref)); the
// checkout route never writes credits itself.

import type { CreditPack } from '@/lib/portal/plans'

export type CheckoutInput = {
  customerId: string
  customerEmail: string
  pack: CreditPack
  // Absolute URLs the hosted checkout returns to.
  successUrl: string
  cancelUrl: string
}

export type CheckoutSession = {
  // Hosted checkout URL to redirect the customer to.
  url: string
}

export type PaymentEvent =
  | {
      type: 'payment_completed'
      customerId: string
      packId: string
      credits: number
      amountCents: number
      // Provider-unique reference for ledger idempotency (Stripe: session id).
      providerRef: string
    }
  // Verified-but-irrelevant events (and relevant-but-unpaid ones) — the
  // webhook route acks these with 200 so the provider stops retrying.
  | { type: 'ignored'; reason: string }

export interface PaymentProvider {
  readonly id: 'stripe' | 'ngenius'
  createCheckout(input: CheckoutInput): Promise<CheckoutSession>
  // Throws on bad signature (webhook route answers 400); returns a normalized
  // event otherwise.
  verifyWebhook(rawBody: string, signature: string | null): Promise<PaymentEvent>
  refund(providerRef: string): Promise<void>
}

/**
 * The active provider, or null while no payment keys are configured — callers
 * fall back to the mock grant path so local dev and E2E work before Martin's
 * Stripe UAE account is verified (task 1). Set STRIPE_SECRET_KEY (+
 * STRIPE_WEBHOOK_SECRET for the webhook) to go live; test-mode keys work.
 */
export async function getPaymentProvider(): Promise<PaymentProvider | null> {
  if (process.env.STRIPE_SECRET_KEY) {
    const { StripeProvider } = await import('./stripe')
    return new StripeProvider(process.env.STRIPE_SECRET_KEY)
  }
  return null
}
