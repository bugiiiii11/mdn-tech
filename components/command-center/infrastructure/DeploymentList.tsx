'use client'

interface Deployment {
  id: string
  service: string
  provider: string
  status: string
  url?: string
  createdAt: string
}

const statusColors: Record<string, string> = {
  SUCCESS: 'text-green-400',
  READY: 'text-green-400',
  ACTIVE_HEALTHY: 'text-green-400',
  BUILDING: 'text-blue-400',
  DEPLOYING: 'text-blue-400',
  QUEUED: 'text-gray-400',
  FAILED: 'text-red-400',
  ERROR: 'text-red-400',
  CANCELED: 'text-gray-500',
  CANCELLED: 'text-gray-500',
}

interface DeploymentListProps {
  deployments: Deployment[]
}

export function DeploymentList({ deployments }: DeploymentListProps) {
  if (deployments.length === 0) {
    return (
      <div className="bg-[#0d0d20] border border-white/5 rounded-xl p-5">
        <h3 className="text-sm font-medium text-white mb-3">Recent Deployments</h3>
        <p className="text-xs text-gray-500">No deployments to show.</p>
      </div>
    )
  }

  return (
    <div className="bg-[#0d0d20] border border-white/5 rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-white/5">
        <h3 className="text-sm font-medium text-white">Recent Deployments</h3>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 text-xs border-b border-white/5">
            <th className="px-5 py-2 font-normal">Service</th>
            <th className="px-4 py-2 font-normal">Provider</th>
            <th className="px-4 py-2 font-normal">Status</th>
            <th className="px-4 py-2 font-normal">Time</th>
          </tr>
        </thead>
        <tbody>
          {deployments.map((d) => (
            <tr key={d.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
              <td className="px-5 py-2.5">
                {d.url ? (
                  <a
                    href={d.url.startsWith('http') ? d.url : `https://${d.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-purple-300 transition-colors"
                  >
                    {d.service}
                  </a>
                ) : (
                  <span className="text-white">{d.service}</span>
                )}
              </td>
              <td className="px-4 py-2.5">
                <span className="text-xs text-gray-400 capitalize">{d.provider}</span>
              </td>
              <td className="px-4 py-2.5">
                <span className={`text-xs font-mono ${statusColors[d.status] ?? 'text-gray-400'}`}>
                  {d.status}
                </span>
              </td>
              <td className="px-4 py-2.5">
                <span className="text-xs text-gray-400">
                  {formatRelative(d.createdAt)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function formatRelative(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)

  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.floor(diffHr / 24)
  return `${diffDay}d ago`
}
