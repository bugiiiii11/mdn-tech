'use client'

import type { ProviderStatus } from '@/lib/infrastructure/types'
import { Database, Train, Triangle } from 'lucide-react'

const statusConfig: Record<ProviderStatus, { color: string; bg: string; label: string }> = {
  healthy:        { color: 'text-green-400',  bg: 'bg-green-400/10', label: 'Healthy' },
  degraded:       { color: 'text-yellow-400', bg: 'bg-yellow-400/10', label: 'Degraded' },
  down:           { color: 'text-red-400',    bg: 'bg-red-400/10', label: 'Down' },
  unknown:        { color: 'text-gray-400',   bg: 'bg-gray-400/10', label: 'Unknown' },
  not_configured: { color: 'text-gray-500',   bg: 'bg-gray-500/10', label: 'Not Configured' },
}

const providerIcons = {
  supabase: Database,
  railway: Train,
  vercel: Triangle,
}

const providerLabels = {
  supabase: 'Supabase',
  railway: 'Railway',
  vercel: 'Vercel',
}

interface ServiceCardProps {
  provider: 'supabase' | 'railway' | 'vercel'
  status: ProviderStatus
  message: string
  lastChecked: string
  detail?: string
}

export function ServiceCard({ provider, status, message, lastChecked, detail }: ServiceCardProps) {
  const cfg = statusConfig[status]
  const Icon = providerIcons[provider]
  const label = providerLabels[provider]

  return (
    <div className="bg-[#0d0d20] border border-white/5 rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${cfg.bg}`}>
            <Icon className={`w-5 h-5 ${cfg.color}`} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">{label}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{message}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
          {cfg.label}
        </span>
      </div>
      {detail && (
        <p className="text-xs text-gray-500 mt-3">{detail}</p>
      )}
      <p className="text-[10px] text-gray-600 mt-3">
        Last checked: {new Date(lastChecked).toLocaleTimeString()}
      </p>
    </div>
  )
}
