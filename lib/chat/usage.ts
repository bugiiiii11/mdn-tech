import { createServiceClient } from '@/lib/supabase/service'

const FREE_TIER_LIMITS: Record<string, number> = {
  chatkit: 50, // 50 messages per month
  signakit: 100,
  tradekit: 100,
}

function getCurrentPeriod() {
  const now = new Date()
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return { periodStart, periodEnd }
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export async function checkUsageLimit(customerId: string, product: 'chatkit' | 'signakit' | 'tradekit'): Promise<{ allowed: boolean; used: number; limit: number }> {
  const supabase = createServiceClient()
  const limit = FREE_TIER_LIMITS[product]
  const { periodStart, periodEnd } = getCurrentPeriod()

  const { data: usage } = await supabase
    .from('product_usage')
    .select('value')
    .eq('customer_id', customerId)
    .eq('product', product)
    .eq('metric', 'messages')
    .gte('period_start', formatDate(periodStart))
    .lte('period_end', formatDate(periodEnd))
    .single()

  const used = usage?.value ?? 0
  return { allowed: used < limit, used: Math.floor(used), limit }
}

export async function incrementUsage(customerId: string, product: string, metric: string, increment: number = 1): Promise<void> {
  const supabase = createServiceClient()
  const { periodStart, periodEnd } = getCurrentPeriod()

  // Try to update existing usage row
  const { data: existing, error: selectError } = await supabase
    .from('product_usage')
    .select('id, value')
    .eq('customer_id', customerId)
    .eq('product', product)
    .eq('metric', metric)
    .gte('period_start', formatDate(periodStart))
    .lte('period_end', formatDate(periodEnd))
    .single()

  if (existing) {
    // Update existing row
    await supabase
      .from('product_usage')
      .update({ value: existing.value + increment })
      .eq('id', existing.id)
  } else {
    // Insert new row
    await supabase.from('product_usage').insert({
      customer_id: customerId,
      product,
      metric,
      value: increment,
      period_start: formatDate(periodStart),
      period_end: formatDate(periodEnd),
    })
  }
}

export function getUsageWarning(used: number, limit: number): string | null {
  const percentage = (used / limit) * 100
  if (percentage >= 90) return 'You\'ve used 90% of your free message limit'
  if (percentage >= 75) return 'You\'ve used 75% of your free message limit'
  return null
}
