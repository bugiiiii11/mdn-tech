// Infrastructure monitoring types for Supabase, Railway, and Vercel

export type ProviderStatus = 'healthy' | 'degraded' | 'down' | 'unknown' | 'not_configured'

export interface ProviderHealth {
  provider: 'supabase' | 'railway' | 'vercel'
  status: ProviderStatus
  message: string
  lastChecked: string // ISO timestamp
}

// --- Supabase Management API ---

export interface SupabaseProject {
  id: string
  name: string
  ref: string
  region: string
  status: string // active_healthy, coming_up, etc.
  database: {
    host: string
    version: string
  }
  createdAt: string
}

export interface SupabaseHealth {
  provider: 'supabase'
  status: ProviderStatus
  message: string
  lastChecked: string
  projects: SupabaseProject[]
}

// --- Railway GraphQL API ---

export interface RailwayService {
  id: string
  name: string
  projectId: string
  projectName: string
  status: string
  url?: string
}

export interface RailwayDeployment {
  id: string
  serviceId: string
  serviceName: string
  status: string // SUCCESS, BUILDING, DEPLOYING, FAILED, etc.
  createdAt: string
  url?: string
}

export interface RailwayHealth {
  provider: 'railway'
  status: ProviderStatus
  message: string
  lastChecked: string
  services: RailwayService[]
  deployments: RailwayDeployment[]
}

// --- Vercel REST API ---

export interface VercelProject {
  id: string
  name: string
  framework: string | null
  latestDeployment?: {
    id: string
    state: string
    url: string
    createdAt: string
  }
}

export interface VercelDeployment {
  uid: string
  name: string
  state: string // READY, BUILDING, ERROR, QUEUED, CANCELED
  url: string
  createdAt: number
  meta?: {
    githubCommitMessage?: string
    githubCommitRef?: string
  }
}

export interface VercelHealth {
  provider: 'vercel'
  status: ProviderStatus
  message: string
  lastChecked: string
  projects: VercelProject[]
  deployments: VercelDeployment[]
}

// --- Aggregate ---

export interface InfrastructureOverview {
  supabase: SupabaseHealth
  railway: RailwayHealth
  vercel: VercelHealth
  fetchedAt: string
}
