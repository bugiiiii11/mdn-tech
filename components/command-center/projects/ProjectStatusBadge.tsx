const statusConfig: Record<string, { label: string; className: string }> = {
  discovery:   { label: 'Discovery',   className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  design:      { label: 'Design',      className: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  development: { label: 'Development', className: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  testing:     { label: 'Testing',     className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  deployed:    { label: 'Deployed',    className: 'bg-green-500/10 text-green-400 border-green-500/20' },
  maintenance: { label: 'Maintenance', className: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  paused:      { label: 'Paused',      className: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
  completed:   { label: 'Completed',   className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
}

export function ProjectStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? { label: status, className: 'bg-gray-500/10 text-gray-400 border-gray-500/20' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${config.className}`}>
      {config.label}
    </span>
  )
}
