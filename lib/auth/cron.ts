import { timingSafeEqual } from 'crypto'

// Shared secret check for the pg_cron-triggered ChatKit routes.
//
// `authHeader === "Bearer " + secret` compares byte by byte and returns on the
// first mismatch, so how long it takes leaks how much of the prefix was right.
// The routes are public and unauthenticated by design (pg_cron calls them over
// the internet), which makes them measurable. timingSafeEqual removes that.

function constantTimeEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8')
  const bufB = Buffer.from(b, 'utf8')
  // timingSafeEqual throws on unequal lengths; hashing to a fixed width would
  // hide the length, but the length of a Bearer header is observable anyway.
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

/** True when the request carries the CHATKIT_CRON_SECRET bearer token. False
 *  whenever the secret is unset, so an unconfigured deploy can never be
 *  mistaken for an authorised cron call. */
export function isCronRequest(request: Request): boolean {
  const secret = process.env.CHATKIT_CRON_SECRET
  if (!secret) return false

  const authHeader = request.headers.get('authorization') ?? ''
  return constantTimeEquals(authHeader, `Bearer ${secret}`)
}
