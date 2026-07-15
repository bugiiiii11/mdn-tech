// Dub (dub.co) REST client for the marketkit-worker (B3 — tracked links).
// Enabled only when DUB_API_KEY is set. Every call is best-effort and returns a
// sentinel (null) on any failure — a missing key or a Dub outage must NEVER
// break the sprint loop; the caller keeps the plain UTM link and moves on.
//
// API shape (dub.co REST, 2026):
//   POST   /links            { url, externalId } -> { id, shortLink, ... }
//   GET    /links/info?linkId=<id>               -> { clicks, leads, sales, ... }
// Auth: Authorization: Bearer <DUB_API_KEY>.

const DUB_API = 'https://api.dub.co'
const TIMEOUT_MS = 10_000

export function dubEnabled(): boolean {
  return !!Deno.env.get('DUB_API_KEY')
}

function authHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${Deno.env.get('DUB_API_KEY')}`,
    'Content-Type': 'application/json',
  }
}

export interface DubLink {
  id: string
  shortLink: string
}

// Create a Dub short link pointing at `url`. `externalId` maps the Dub link
// back to our mk_links row (so we could look it up without a stored id).
// Returns null on any failure — the caller keeps the plain UTM destination.
export async function createDubLink(url: string, externalId: string): Promise<DubLink | null> {
  if (!dubEnabled()) return null
  try {
    const res = await fetch(`${DUB_API}/links`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ url, externalId }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!res.ok) {
      console.error('dub createLink failed:', res.status, (await res.text().catch(() => '')).slice(0, 200))
      return null
    }
    const link = parseDubLink(await res.json().catch(() => null))
    if (!link) console.error('dub createLink: unexpected response shape')
    return link
  } catch (err) {
    console.error('dub createLink error:', err instanceof Error ? err.message : err)
    return null
  }
}

// Look up an existing Dub link by the externalId we set at create time
// (GET /links/info?externalId=<id> — bare, no prefix on this endpoint).
// Used to RECOVER a link that was created but whose id we failed to persist:
// createLink then 409s on the unique externalId, so we fetch the existing one
// instead of orphaning it. Returns null on 404 (doesn't exist) or any error.
export async function getDubLinkByExternalId(externalId: string): Promise<DubLink | null> {
  if (!dubEnabled()) return null
  try {
    const res = await fetch(`${DUB_API}/links/info?externalId=${encodeURIComponent(externalId)}`, {
      headers: authHeaders(),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!res.ok) return null
    return parseDubLink(await res.json().catch(() => null))
  } catch (err) {
    console.error('dub getLinkByExternalId error:', err instanceof Error ? err.message : err)
    return null
  }
}

function parseDubLink(data: unknown): DubLink | null {
  const d = data as { id?: unknown; shortLink?: unknown } | null
  const id = typeof d?.id === 'string' ? d.id : null
  const shortLink = typeof d?.shortLink === 'string' ? d.shortLink : null
  return id && shortLink ? { id, shortLink } : null
}

export interface DubStats {
  clicks: number
  conversions: number
}

// Aggregate lifetime click/conversion counts for a Dub link, by Dub link id.
// Reads them straight off the link object (GET /links/info) — a *standard*
// endpoint (60 req/min on the free tier), unlike GET /analytics which is
// Pro-only. So click counts work on the free plan. conversions prefers the
// link's own `conversions` field, else max(leads, sales) to avoid double-
// counting the click→lead→sale funnel; conversions stay 0 until conversion
// tracking is installed on the destination (Business+ plan, not MVP scope).
// Returns null on any failure — the caller leaves the stored counts untouched.
export async function getDubStats(linkId: string): Promise<DubStats | null> {
  if (!dubEnabled()) return null
  try {
    const res = await fetch(`${DUB_API}/links/info?linkId=${encodeURIComponent(linkId)}`, {
      headers: authHeaders(),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!res.ok) {
      console.error('dub getStats failed:', res.status, (await res.text().catch(() => '')).slice(0, 200))
      return null
    }
    const data = await res.json().catch(() => null)
    if (!data) return null
    const conversions =
      data.conversions != null ? num(data.conversions) : Math.max(num(data.leads), num(data.sales))
    return { clicks: num(data.clicks), conversions }
  } catch (err) {
    console.error('dub getStats error:', err instanceof Error ? err.message : err)
    return null
  }
}

function num(v: unknown): number {
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : 0
}
