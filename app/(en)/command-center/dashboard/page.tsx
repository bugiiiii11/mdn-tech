export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProjectStatusBadge } from '@/components/command-center/projects/ProjectStatusBadge'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/command-center/login')

  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, status, priority, target_end_date, budget_total, budget_spent')
    .order('priority', { ascending: true })

  const { data: member } = await supabase
    .from('team_members')
    .select('id, full_name, role')
    .eq('id', user.id)
    .single()

  const statusCounts = (projects ?? []).reduce((acc: Record<string, number>, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1
    return acc
  }, {})

  const atRisk = (projects ?? []).filter(p => {
    const spent = p.budget_spent ?? 0
    const total = p.budget_total ?? 0
    return total > 0 && spent / total >= 0.8
  })

  const now = new Date()
  const overdue = (projects ?? []).filter(p =>
    p.target_end_date && new Date(p.target_end_date) < now && p.status !== 'completed'
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-white">
          {member ? `Welcome, ${member.full_name.split(' ')[0]}` : 'Dashboard'}
        </h1>
        <p className="text-gray-400 text-sm mt-0.5">Operations overview</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="Active Projects" value={(projects ?? []).filter(p => !['completed', 'paused'].includes(p.status)).length} />
        <KpiCard label="At Risk" value={atRisk.length} warn={atRisk.length > 0} />
        <KpiCard label="Overdue" value={overdue.length} warn={overdue.length > 0} />
        <KpiCard label="Completed" value={statusCounts['completed'] ?? 0} />
      </div>

      {/* Project list */}
      <div className="bg-[#0d0d20] border border-white/5 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-sm font-medium text-white">All Projects</h2>
          <a
            href="/command-center/projects/new"
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
          >
            + New project
          </a>
        </div>
        {(projects ?? []).length === 0 ? (
          <div className="px-5 py-10 text-center text-gray-500 text-sm">
            No projects yet.{' '}
            <a href="/command-center/projects/new" className="text-purple-400 hover:underline">
              Create your first project
            </a>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs border-b border-white/5">
                <th className="px-5 py-2 font-normal">Name</th>
                <th className="px-4 py-2 font-normal">Status</th>
                <th className="px-4 py-2 font-normal">Priority</th>
                <th className="px-4 py-2 font-normal">Budget</th>
                <th className="px-4 py-2 font-normal">Due</th>
              </tr>
            </thead>
            <tbody>
              {(projects ?? []).map(p => {
                const pct = p.budget_total > 0 ? Math.round((p.budget_spent / p.budget_total) * 100) : 0
                const isOverdue = p.target_end_date && new Date(p.target_end_date) < now && p.status !== 'completed'
                return (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3">
                      <a href={`/command-center/projects/${p.id}`} className="text-white hover:text-purple-300 transition-colors font-medium">
                        {p.name}
                      </a>
                    </td>
                    <td className="px-4 py-3"><ProjectStatusBadge status={p.status} /></td>
                    <td className="px-4 py-3">
                      <span className={`capitalize text-xs ${
                        p.priority === 'critical' ? 'text-red-400' :
                        p.priority === 'high' ? 'text-orange-400' :
                        p.priority === 'medium' ? 'text-yellow-400' :
                        'text-gray-400'
                      }`}>{p.priority}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <span className="text-gray-400 text-xs">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
                        {p.target_end_date ? new Date(p.target_end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function KpiCard({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
  return (
    <div className="bg-[#0d0d20] border border-white/5 rounded-xl px-5 py-4">
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`text-2xl font-semibold mt-1 ${warn ? 'text-yellow-400' : 'text-white'}`}>{value}</p>
    </div>
  )
}
