import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProjectStatusBadge } from '@/components/command-center/projects/ProjectStatusBadge'

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/command-center/login')

  const { data: projects } = await supabase
    .from('projects')
    .select(`
      id, name, client_name, status, priority,
      target_end_date, budget_total, budget_spent,
      project_assignments(member_id, team_members(full_name))
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Projects</h1>
          <p className="text-gray-400 text-sm mt-0.5">{(projects ?? []).length} total</p>
        </div>
        <a
          href="/command-center/projects/new"
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          + New project
        </a>
      </div>

      <div className="bg-[#0d0d20] border border-white/5 rounded-xl overflow-hidden">
        {(projects ?? []).length === 0 ? (
          <div className="px-5 py-12 text-center text-gray-500 text-sm">
            No projects yet.{' '}
            <a href="/command-center/projects/new" className="text-purple-400 hover:underline">
              Add your first project
            </a>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs border-b border-white/5">
                <th className="px-5 py-3 font-normal">Project</th>
                <th className="px-4 py-3 font-normal">Client</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-4 py-3 font-normal">Priority</th>
                <th className="px-4 py-3 font-normal">Budget</th>
                <th className="px-4 py-3 font-normal">Due date</th>
              </tr>
            </thead>
            <tbody>
              {(projects ?? []).map((p: any) => {
                const pct = p.budget_total > 0 ? Math.round((p.budget_spent / p.budget_total) * 100) : 0
                return (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3">
                      <a href={`/command-center/projects/${p.id}`} className="text-white hover:text-purple-300 transition-colors font-medium">
                        {p.name}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{p.client_name ?? '—'}</td>
                    <td className="px-4 py-3"><ProjectStatusBadge status={p.status} /></td>
                    <td className="px-4 py-3">
                      <span className={`capitalize text-xs ${
                        p.priority === 'critical' ? 'text-red-400' :
                        p.priority === 'high' ? 'text-orange-400' :
                        p.priority === 'medium' ? 'text-yellow-400' : 'text-gray-400'
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
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {p.target_end_date ? new Date(p.target_end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'}
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
