import type { SupabaseClient } from '@supabase/supabase-js'

// A customer sees MarketKit only when they have an active `marketkit` enrolment
// (BRIEF §2.2). ChatKit-only customers never see it. Direct-URL access without
// enrolment redirects to /portal/toolkit (enforced by requireMarketkit below).
export async function hasMarketkitAccess(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from('customer_products')
    .select('id')
    .eq('customer_id', userId)
    .eq('product', 'marketkit')
    .eq('status', 'active')
    .maybeSingle()
  return !!data
}
