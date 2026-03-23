const WINDOW_MS = 60_000 // 1 minute
const MAX_REQUESTS = 20

const store = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = store.get(ip)

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true, remaining: MAX_REQUESTS - 1 }
  }

  entry.count++
  if (entry.count > MAX_REQUESTS) {
    return { allowed: false, remaining: 0 }
  }

  return { allowed: true, remaining: MAX_REQUESTS - entry.count }
}

// Cleanup old entries periodically to prevent memory leak
setInterval(() => {
  const now = Date.now()
  store.forEach((val, key) => {
    if (now > val.resetAt) store.delete(key)
  })
}, 60_000)
