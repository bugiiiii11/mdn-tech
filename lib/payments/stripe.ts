// Stripe adapter for the PaymentProvider abstraction (launch plan 2.2/2.3).
// Hosted Checkout in payment mode — no dashboard products needed; packs are
// priced inline from plans.ts so test mode works the moment keys exist.
//
// B2B-only checkout (2.5, confirmed 2026-08-06): company name is a required
// checkout field. VAT ID collection + reverse-charge invoicing are deliberately
// NOT wired yet — they depend on Filip's compliance answers (2.0b); add
// `tax_id_collection` + `customer_creation: 'always'` here once those land.

import Stripe from 'stripe'
import type {
  CheckoutInput,
  CheckoutSession,
  PaymentEvent,
  PaymentProvider,
} from './provider'

export class StripeProvider implements PaymentProvider {
  readonly id = 'stripe' as const
  private stripe: Stripe

  constructor(secretKey: string) {
    this.stripe = new Stripe(secretKey)
  }

  async createCheckout(input: CheckoutInput): Promise<CheckoutSession> {
    const { pack } = input
    const metadata = {
      customer_id: input.customerId,
      pack_id: pack.id,
      credits: String(pack.credits),
    }

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      client_reference_id: input.customerId,
      customer_email: input.customerEmail,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: pack.priceCents,
            product_data: {
              name: `${pack.name} credit pack`,
              description: `${pack.credits.toLocaleString('en-US')} M.D.N Tech credits`,
            },
          },
        },
      ],
      metadata,
      // Mirror onto the PaymentIntent so refunds/disputes map back to the
      // ledger without a session lookup.
      payment_intent_data: { metadata },
      billing_address_collection: 'required',
      custom_fields: [
        {
          key: 'company_name',
          label: { type: 'custom', custom: 'Company name' },
          type: 'text',
        },
      ],
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
    })

    if (!session.url) {
      throw new Error('Stripe returned a checkout session without a URL')
    }
    return { url: session.url }
  }

  async verifyWebhook(rawBody: string, signature: string | null): Promise<PaymentEvent> {
    const secret = process.env.STRIPE_WEBHOOK_SECRET
    if (!secret) throw new Error('STRIPE_WEBHOOK_SECRET is not set')
    if (!signature) throw new Error('Missing stripe-signature header')

    // Throws on bad signature — the route maps that to 400.
    const event = await this.stripe.webhooks.constructEventAsync(rawBody, signature, secret)

    if (event.type !== 'checkout.session.completed') {
      return { type: 'ignored', reason: `unhandled event type ${event.type}` }
    }

    const session = event.data.object
    // Async payment methods complete later via checkout.session.async_payment_succeeded;
    // card payments (our case) are 'paid' here. Never grant on unpaid sessions.
    if (session.payment_status !== 'paid') {
      return { type: 'ignored', reason: `session ${session.id} payment_status=${session.payment_status}` }
    }

    const customerId = session.metadata?.customer_id
    const packId = session.metadata?.pack_id
    const credits = Number(session.metadata?.credits)
    if (!customerId || !packId || !Number.isFinite(credits) || credits <= 0) {
      throw new Error(`checkout.session.completed ${session.id} is missing pack metadata`)
    }

    return {
      type: 'payment_completed',
      customerId,
      packId,
      credits,
      amountCents: session.amount_total ?? 0,
      providerRef: session.id,
    }
  }

  // 2.7b refund support (14 days, only if zero credits from the purchase were
  // spent). The POLICY check lives with the caller; this just moves the money.
  async refund(providerRef: string): Promise<void> {
    const session = await this.stripe.checkout.sessions.retrieve(providerRef)
    const paymentIntent =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id
    if (!paymentIntent) {
      throw new Error(`Checkout session ${providerRef} has no payment intent to refund`)
    }
    await this.stripe.refunds.create({ payment_intent: paymentIntent })
  }
}
