// App-side access to the account credit ledger (migration 022). Server-only:
// every call uses the service client, because `authenticated` deliberately has
// no write path and no EXECUTE on the ledger functions.
//
// Ledger rules recap: append-only, balance = sum(delta), spends go through
// spend_credits() (overdraft-proof, per-customer advisory lock), grants are
// plain inserts with (provider, provider_ref) idempotency for webhooks.

import { createServiceClient } from '@/lib/supabase/service'

// 12-month expiry stamp for purchase/promo grants (launch plan 2.7a). The
// enforcement sweep is a later cron; the stamp must be right from day one.
export function creditExpiryDate(from = new Date()): string {
  const d = new Date(from)
  d.setMonth(d.getMonth() + 12)
  return d.toISOString()
}

export async function creditBalance(customerId: string): Promise<number> {
  const service = createServiceClient()
  const { data, error } = await service.rpc('credit_balance', {
    p_customer: customerId,
  })
  if (error) throw new Error(`credit_balance failed: ${error.message}`)
  return Number(data ?? 0)
}

export type SpendKind = 'spend_message' | 'spend_unlock'

export type SpendResult =
  | { ok: true; balance: number }
  | { ok: false; reason: 'insufficient_credits' }

export async function spendCredits(opts: {
  customerId: string
  amount: number
  kind: SpendKind
  chatbotId?: string
  featureId?: string
  note?: string
}): Promise<SpendResult> {
  const service = createServiceClient()
  const { data, error } = await service.rpc('spend_credits', {
    p_customer: opts.customerId,
    p_amount: opts.amount,
    p_kind: opts.kind,
    p_chatbot: opts.chatbotId ?? null,
    p_feature: opts.featureId ?? null,
    p_note: opts.note ?? null,
  })
  if (error) {
    if (error.message.includes('insufficient_credits')) {
      return { ok: false, reason: 'insufficient_credits' }
    }
    throw new Error(`spend_credits failed: ${error.message}`)
  }
  return { ok: true, balance: Number(data ?? 0) }
}

/**
 * Grant credits from a completed purchase (webhook or mock checkout). Uses the
 * (provider, provider_ref) unique index for idempotency: a redelivered webhook
 * inserts nothing and reports granted=false.
 */
export async function grantPurchasedCredits(opts: {
  customerId: string
  credits: number
  packId: string
  amountCents: number
  provider: string
  providerRef: string
  note?: string
}): Promise<{ granted: boolean }> {
  const service = createServiceClient()
  const { error } = await service.from('credits_ledger').insert({
    customer_id: opts.customerId,
    delta: opts.credits,
    kind: 'purchase',
    pack_id: opts.packId,
    amount_cents: opts.amountCents,
    provider: opts.provider,
    provider_ref: opts.providerRef,
    expires_at: creditExpiryDate(),
    note: opts.note ?? null,
  })
  if (error) {
    // 23505 = unique_violation on (provider, provider_ref): duplicate delivery.
    if (error.code === '23505') return { granted: false }
    throw new Error(`credit grant failed: ${error.message}`)
  }
  return { granted: true }
}
