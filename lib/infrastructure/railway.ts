import type { RailwayHealth, RailwayService, RailwayDeployment, ProviderStatus } from './types'

const API_URL = 'https://backboard.railway.app/graphql/v2'

function getToken(): string | null {
  const token = process.env.RAILWAY_API_TOKEN
  if (!token || token === 'your_railway_token_here') return null
  return token
}

async function gql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const token = getToken()
  if (!token) throw new Error('not_configured')

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 0 },
  })

  if (!res.ok) throw new Error(`Railway API returned ${res.status}`)

  const json = await res.json()
  if (json.errors?.length) throw new Error(json.errors[0].message)
  return json.data as T
}

const PROJECTS_QUERY = `
  query {
    me {
      projects {
        edges {
          node {
            id
            name
            services {
              edges {
                node {
                  id
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`

const DEPLOYMENTS_QUERY = `
  query($projectId: String!, $limit: Int!) {
    deployments(
      input: { projectId: $projectId }
      first: $limit
    ) {
      edges {
        node {
          id
          status
          createdAt
          staticUrl
          service {
            id
            name
          }
        }
      }
    }
  }
`

interface ProjectsResult {
  me: {
    projects: {
      edges: Array<{
        node: {
          id: string
          name: string
          services: {
            edges: Array<{
              node: { id: string; name: string }
            }>
          }
        }
      }>
    }
  }
}

interface DeploymentsResult {
  deployments: {
    edges: Array<{
      node: {
        id: string
        status: string
        createdAt: string
        staticUrl?: string
        service: { id: string; name: string }
      }
    }>
  }
}

export async function fetchRailwayHealth(): Promise<RailwayHealth> {
  const now = new Date().toISOString()

  if (!getToken()) {
    return {
      provider: 'railway',
      status: 'not_configured',
      message: 'Railway API token not configured',
      lastChecked: now,
      services: [],
      deployments: [],
    }
  }

  try {
    const projectsData = await gql<ProjectsResult>(PROJECTS_QUERY)
    const projectEdges = projectsData.me.projects.edges

    const services: RailwayService[] = []
    for (const pEdge of projectEdges) {
      const proj = pEdge.node
      for (const sEdge of proj.services.edges) {
        services.push({
          id: sEdge.node.id,
          name: sEdge.node.name,
          projectId: proj.id,
          projectName: proj.name,
          status: 'active',
        })
      }
    }

    // Fetch recent deployments from first project (if any)
    let deployments: RailwayDeployment[] = []
    if (projectEdges.length > 0) {
      try {
        const depData = await gql<DeploymentsResult>(DEPLOYMENTS_QUERY, {
          projectId: projectEdges[0].node.id,
          limit: 10,
        })
        deployments = depData.deployments.edges.map((e) => ({
          id: e.node.id,
          serviceId: e.node.service.id,
          serviceName: e.node.service.name,
          status: e.node.status,
          createdAt: e.node.createdAt,
          url: e.node.staticUrl,
        }))
      } catch {
        // Deployments query may fail on some plans; continue without them
      }
    }

    const hasFailure = deployments.some((d) => d.status === 'FAILED')
    const status: ProviderStatus = hasFailure ? 'degraded' : 'healthy'

    return {
      provider: 'railway',
      status,
      message: `${services.length} service(s) across ${projectEdges.length} project(s)`,
      lastChecked: now,
      services,
      deployments,
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to reach Railway API'
    return {
      provider: 'railway',
      status: 'down',
      message: msg,
      lastChecked: now,
      services: [],
      deployments: [],
    }
  }
}
