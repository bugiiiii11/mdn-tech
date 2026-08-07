// CORS + per-chatbot origin binding for the public widget API.
//
// Two separate mechanisms, deliberately:
//
//   - CORS headers echo the caller's Origin (instead of the old blanket "*")
//     so the browser's own check stays meaningful and credentials-less
//     cross-site reads keep working for legitimate embeds.
//   - isOriginAllowed() is the ENFORCEMENT. CORS only constrains browsers; a
//     curl request ignores it entirely. So the routes look the origin up
//     against the chatbot's allowed_domains and return 403 themselves.
//
// An attacker can of course forge an Origin header from curl. Domain binding
// is therefore not an authentication boundary -- it stops the realistic abuse
// (someone lifts your snippet, embeds your bot on their site, and spends your
// credits) and pairs with the per-bot rate limit for everything else.

const BASE_CORS = {
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
  // The response body varies per Origin, so shared caches must key on it.
  Vary: 'Origin',
}

export function corsHeaders(origin?: string | null): Record<string, string> {
  return {
    ...BASE_CORS,
    'Access-Control-Allow-Origin': origin || '*',
  }
}

export function corsResponse(origin?: string | null) {
  return new Response(null, { status: 204, headers: corsHeaders(origin) })
}

/** The Origin header, falling back to the Referer's origin (Safari omits
 *  Origin on some same-site GETs, and the widget config call is a GET). */
export function requestOrigin(req: Request): string | null {
  const origin = req.headers.get('origin')
  if (origin && origin !== 'null') return origin
  const referer = req.headers.get('referer')
  if (!referer) return null
  try {
    return new URL(referer).origin
  } catch {
    return null
  }
}

/** Accepts anything an owner might paste -- "https://Example.com/contact",
 *  "www.example.com", "*.example.com" -- and returns the bare lowercase host
 *  (wildcard preserved), or null if it is not a usable hostname. */
export function normalizeDomain(input: string): string | null {
  let value = input.trim().toLowerCase()
  if (!value) return null

  value = value.replace(/^[a-z][a-z0-9+.-]*:\/\//, '') // scheme
  value = value.split('/')[0] // path
  value = value.split('?')[0].split('#')[0]
  value = value.replace(/:\d+$/, '') // port -- ports are not part of the match
  value = value.replace(/\.$/, '') // trailing root dot

  if (!value) return null

  const wildcard = value.startsWith('*.')
  const host = wildcard ? value.slice(2) : value

  // Hostname label check; also rejects a bare "*" (which would mean "any").
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)*$/.test(host)) return null
  if (host.length > 253) return null

  return wildcard ? `*.${host}` : host
}

function hostOf(origin: string): string | null {
  try {
    return new URL(origin).hostname.toLowerCase()
  } catch {
    return null
  }
}

/**
 * Origin check against a chatbot's allow-list.
 *
 * An empty allow-list means "any origin" -- that is the historical behaviour
 * and every existing customer widget depends on it, so binding is opt-in per
 * bot (the routes make it mandatory for owner-less internal bots instead).
 *
 * "example.com" matches example.com and www.example.com; "*.example.com"
 * matches the apex plus any depth of subdomain.
 */
export function isOriginAllowed(origin: string | null, allowedDomains: string[] | null): boolean {
  const list = (allowedDomains ?? []).map(normalizeDomain).filter((d): d is string => d !== null)
  if (list.length === 0) return true
  if (!origin) return false

  const host = hostOf(origin)
  if (!host) return false

  return list.some((entry) => {
    if (entry.startsWith('*.')) {
      const base = entry.slice(2)
      return host === base || host.endsWith(`.${base}`)
    }
    return host === entry || host === `www.${entry}`
  })
}
