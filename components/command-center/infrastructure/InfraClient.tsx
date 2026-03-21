'use client'

import { useEffect, useState, useCallback } from 'react'
import { ServiceCard } from './ServiceCard'
import { DeploymentList } from './DeploymentList'
import { RefreshCw } from 'lucide-react'
import type { InfrastructureOverview } from '@/lib/infrastructure/types'

interface Deployment {
  id: string
  service: string
  provider: string
  status: string
  url?: string
  createdAt: string
}

export function InfraClient() {
  const [data, setData] = useState<InfrastructureOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/infrastructure')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json: InfrastructureOverview = await res.json()
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchData, 60_000)
    return () => clearInterval(interval)
  }, [fetchData])

  if (loading && !data) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#0d0d20] border border-white/5 rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-white/5 rounded w-24 mb-2" />
              <div className="h-3 bg-white/5 rounded w-32" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5">
        <p className="text-sm text-red-400">Failed to load infrastructure data: {error}</p>
        <button
          onClick={fetchData}
          className="mt-2 text-xs text-red-300 hover:text-red-200 underline"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!data) return null

  // Merge deployments from Railway and Vercel into a single list
  const deployments: Deployment[] = [
    ...data.railway.deployments.map((d) => ({
      id: d.id,
      service: d.serviceName,
      provider: 'railway',
      status: d.status,
      url: d.url,
      createdAt: d.createdAt,
    })),
    ...data.vercel.deployments.map((d) => ({
      id: d.uid,
      service: d.name,
      provider: 'vercel',
      status: d.state,
      url: d.url,
      createdAt: new Date(d.createdAt).toISOString(),
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const allNotConfigured =
    data.supabase.status === 'not_configured' &&
    data.railway.status === 'not_configured' &&
    data.vercel.status === 'not_configured'

  return (
    <div className="space-y-6">
      {/* Refresh bar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {loading ? 'Refreshing...' : `Updated ${new Date(data.fetchedAt).toLocaleTimeString()}`}
        </p>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Setup hint when no providers configured */}
      {allNotConfigured && (
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-5">
          <h3 className="text-sm font-medium text-purple-300">Setup Required</h3>
          <p className="text-xs text-gray-400 mt-1">
            Add your API keys to <code className="text-purple-400">.env.local</code> to enable monitoring:
          </p>
          <ul className="text-xs text-gray-400 mt-2 space-y-1 list-disc list-inside">
            <li><code className="text-purple-400">SUPABASE_MANAGEMENT_API_KEY</code> — from dashboard.supabase.com/account/tokens</li>
            <li><code className="text-purple-400">RAILWAY_API_TOKEN</code> — from railway.app/account/tokens</li>
            <li><code className="text-purple-400">VERCEL_ACCESS_TOKEN</code> — from vercel.com/account/tokens</li>
          </ul>
        </div>
      )}

      {/* Service cards */}
      <div className="grid grid-cols-3 gap-4">
        <ServiceCard
          provider="supabase"
          status={data.supabase.status}
          message={data.supabase.message}
          lastChecked={data.supabase.lastChecked}
          detail={data.supabase.projects.length > 0
            ? `${data.supabase.projects.length} project(s): ${data.supabase.projects.map(p => p.name).join(', ')}`
            : undefined
          }
        />
        <ServiceCard
          provider="railway"
          status={data.railway.status}
          message={data.railway.message}
          lastChecked={data.railway.lastChecked}
          detail={data.railway.services.length > 0
            ? `${data.railway.services.length} service(s): ${data.railway.services.map(s => s.name).join(', ')}`
            : undefined
          }
        />
        <ServiceCard
          provider="vercel"
          status={data.vercel.status}
          message={data.vercel.message}
          lastChecked={data.vercel.lastChecked}
          detail={data.vercel.projects.length > 0
            ? `${data.vercel.projects.length} project(s): ${data.vercel.projects.map(p => p.name).join(', ')}`
            : undefined
          }
        />
      </div>

      {/* Supabase projects detail */}
      {data.supabase.projects.length > 0 && (
        <div className="bg-[#0d0d20] border border-white/5 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-white/5">
            <h3 className="text-sm font-medium text-white">Supabase Projects</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs border-b border-white/5">
                <th className="px-5 py-2 font-normal">Name</th>
                <th className="px-4 py-2 font-normal">Region</th>
                <th className="px-4 py-2 font-normal">Status</th>
                <th className="px-4 py-2 font-normal">DB Version</th>
              </tr>
            </thead>
            <tbody>
              {data.supabase.projects.map((p) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-2.5 text-white">{p.name}</td>
                  <td className="px-4 py-2.5 text-gray-400 text-xs">{p.region}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs font-mono ${
                      p.status === 'ACTIVE_HEALTHY' ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-400 text-xs">{p.database.version || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Vercel projects detail */}
      {data.vercel.projects.length > 0 && (
        <div className="bg-[#0d0d20] border border-white/5 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-white/5">
            <h3 className="text-sm font-medium text-white">Vercel Projects</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs border-b border-white/5">
                <th className="px-5 py-2 font-normal">Name</th>
                <th className="px-4 py-2 font-normal">Framework</th>
                <th className="px-4 py-2 font-normal">Latest Deploy</th>
                <th className="px-4 py-2 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.vercel.projects.map((p) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-2.5 text-white">{p.name}</td>
                  <td className="px-4 py-2.5 text-gray-400 text-xs">{p.framework ?? '—'}</td>
                  <td className="px-4 py-2.5 text-gray-400 text-xs">
                    {p.latestDeployment
                      ? new Date(p.latestDeployment.createdAt).toLocaleDateString()
                      : '—'
                    }
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs font-mono ${
                      p.latestDeployment?.state === 'READY' ? 'text-green-400' :
                      p.latestDeployment?.state === 'ERROR' ? 'text-red-400' :
                      'text-gray-400'
                    }`}>
                      {p.latestDeployment?.state ?? '—'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Combined deployments */}
      <DeploymentList deployments={deployments} />
    </div>
  )
}
