import { createServiceClient } from '@/lib/supabase/service'

// Durable rate limiting, backed by the rate_limits table + rate_limit_hit()
// RPC from migration 021.
//
// The previous implementation was a module-level Map. On Vercel each request
// may hit a cold lambda with its own fresh, empty Map, and warm instances are
// load-balanced -- so an attacker got roughly (limit x instances) requests and
// the counter reset every few minutes on its own. It stopped nothing.
//
// One RPC call evaluates every bucket for the request (per-IP, per-bot, and
// the daily cap on unmetered bots) inside a single round trip.

export type RateLimitRule = {
  key: string
  /** Max hits allowed inside the window. */
  limit: number
  /** Window length in seconds. */
  window: number
}

export type RateLimitResult = {
  allowed: boolean
  /** Which rule tripped, for logging -- never returned to the caller. */
  blocked: string | null
  /** Seconds until the tripped window rolls over (Retry-After). */
  retryAfter: number
}

// Public chat surface. Per-IP stops one visitor hammering; per-bot caps what a
// leaked chatbot id can cost across many IPs (a botnet defeats the IP bucket).
export const CHAT_IP_RULE = { limit: 20, window: 60 }
export const CHAT_BOT_RULE = { limit: 120, window: 60 }

// Owner-less internal bots have no credit balance to run down, so their spend
// ceiling is time-based instead. See lib/chat/usage.ts.
export const INTERNAL_BOT_DAILY_RULE = { limit: 500, window: 86_400 }

const ALLOW: RateLimitResult = { allowed: true, blocked: null, retryAfter: 0 }

export async function checkRateLimit(rules: RateLimitRule[]): Promise<RateLimitResult> {
  if (rules.length === 0) return ALLOW

  const supabase = createServiceClient()
  const { data, error } = await supabase.rpc('rate_limit_hit', {
    buckets: rules.map((r) => ({ key: r.key, limit: r.limit, window: r.window })),
  })

  // Fail open on infrastructure errors: the chat endpoint is a customer-facing
  // product surface, and every request that gets past here still has to clear
  // the usage/credit check before it can cost anything.
  if (error || !data) {
    console.error('rate_limit_hit failed, allowing request:', error?.message)
    return ALLOW
  }

  const result = data as { allowed?: boolean; blocked?: string | null; retry_after?: number }
  return {
    allowed: result.allowed !== false,
    blocked: result.blocked ?? null,
    retryAfter: result.retry_after ?? 0,
  }
}

/** Client IP as Vercel reports it. x-forwarded-for is attacker-controllable in
 *  general, but on Vercel the platform rewrites the left-most entry. */
export function clientIp(req: Request): string {
  return (
    req.headers.get('x-real-ip')?.trim() ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  )
}
