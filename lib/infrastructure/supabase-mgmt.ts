import type { SupabaseHealth, SupabaseProject, ProviderStatus } from './types'

const API_BASE = 'https://api.supabase.com/v1'

function getApiKey(): string | null {
  const key = process.env.SUPABASE_MANAGEMENT_API_KEY
  if (!key || key === 'your_management_api_key_here') return null
  return key
}

export async function fetchSupabaseHealth(): Promise<SupabaseHealth> {
  const apiKey = getApiKey()
  const now = new Date().toISOString()

  if (!apiKey) {
    return {
      provider: 'supabase',
      status: 'not_configured',
      message: 'Management API key not configured',
      lastChecked: now,
      projects: [],
    }
  }

  try {
    const res = await fetch(`${API_BASE}/projects`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 0 },
    })

    if (!res.ok) {
      return {
        provider: 'supabase',
        status: 'degraded',
        message: `API returned ${res.status}`,
        lastChecked: now,
        projects: [],
      }
    }

    const raw: Array<Record<string, unknown>> = await res.json()

    const projects: SupabaseProject[] = raw.map((p) => ({
      id: String(p.id),
      name: String(p.name ?? ''),
      ref: String(p.ref ?? p.id),
      region: String(p.region ?? 'unknown'),
      status: String(p.status ?? 'unknown'),
      database: {
        host: String((p.database as Record<string, unknown>)?.host ?? ''),
        version: String((p.database as Record<string, unknown>)?.version ?? ''),
      },
      createdAt: String(p.created_at ?? ''),
    }))

    const allHealthy = projects.every((p) => p.status === 'ACTIVE_HEALTHY')
    const status: ProviderStatus = projects.length === 0
      ? 'unknown'
      : allHealthy
        ? 'healthy'
        : 'degraded'

    return {
      provider: 'supabase',
      status,
      message: allHealthy
        ? `${projects.length} project(s) healthy`
        : 'Some projects have issues',
      lastChecked: now,
      projects,
    }
  } catch (err) {
    return {
      provider: 'supabase',
      status: 'down',
      message: err instanceof Error ? err.message : 'Failed to reach Supabase API',
      lastChecked: now,
      projects: [],
    }
  }
}
