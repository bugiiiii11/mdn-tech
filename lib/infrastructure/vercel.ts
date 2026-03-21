import type { VercelHealth, VercelProject, VercelDeployment, ProviderStatus } from './types'

const API_BASE = 'https://api.vercel.com'

function getToken(): string | null {
  const token = process.env.VERCEL_ACCESS_TOKEN
  if (!token || token === 'your_vercel_token_here') return null
  return token
}

async function vercelGet<T>(path: string): Promise<T> {
  const token = getToken()
  if (!token) throw new Error('not_configured')

  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 0 },
  })

  if (!res.ok) throw new Error(`Vercel API returned ${res.status}`)
  return res.json() as Promise<T>
}

interface VercelProjectsResponse {
  projects: Array<{
    id: string
    name: string
    framework: string | null
    latestDeployments?: Array<{
      id: string
      readyState: string
      url: string
      createdAt: number
    }>
  }>
}

interface VercelDeploymentsResponse {
  deployments: Array<{
    uid: string
    name: string
    state: string
    url: string
    created: number
    meta?: {
      githubCommitMessage?: string
      githubCommitRef?: string
    }
  }>
}

export async function fetchVercelHealth(): Promise<VercelHealth> {
  const now = new Date().toISOString()

  if (!getToken()) {
    return {
      provider: 'vercel',
      status: 'not_configured',
      message: 'Vercel access token not configured',
      lastChecked: now,
      projects: [],
      deployments: [],
    }
  }

  try {
    const [projectsData, deploymentsData] = await Promise.all([
      vercelGet<VercelProjectsResponse>('/v9/projects?limit=20'),
      vercelGet<VercelDeploymentsResponse>('/v6/deployments?limit=15&state=READY,BUILDING,ERROR'),
    ])

    const projects: VercelProject[] = projectsData.projects.map((p) => {
      const latest = p.latestDeployments?.[0]
      return {
        id: p.id,
        name: p.name,
        framework: p.framework,
        latestDeployment: latest
          ? {
              id: latest.id,
              state: latest.readyState,
              url: latest.url,
              createdAt: new Date(latest.createdAt).toISOString(),
            }
          : undefined,
      }
    })

    const deployments: VercelDeployment[] = deploymentsData.deployments.map((d) => ({
      uid: d.uid,
      name: d.name,
      state: d.state,
      url: d.url,
      createdAt: d.created,
      meta: d.meta,
    }))

    const hasError = deployments.some((d) => d.state === 'ERROR')
    const status: ProviderStatus = hasError ? 'degraded' : 'healthy'

    return {
      provider: 'vercel',
      status,
      message: `${projects.length} project(s), ${deployments.length} recent deployments`,
      lastChecked: now,
      projects,
      deployments,
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to reach Vercel API'
    return {
      provider: 'vercel',
      status: 'down',
      message: msg,
      lastChecked: now,
      projects: [],
      deployments: [],
    }
  }
}
