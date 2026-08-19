export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function TeamPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/command-center/login')

  const { data: members } = await supabase
    .from('team_members')
    .select(`
      id, full_name, role, skills, max_concurrent_projects, is_active,
      project_assignments(
        project_id,
        projects(id, name, status)
      )
    `)
    .eq('is_active', true)
    .order('full_name')

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-white">Team</h1>
        <p className="text-gray-400 text-sm mt-0.5">{(members ?? []).length} active members</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {(members ?? []).map((m: any) => {
          const assignments = (m.project_assignments ?? []).filter((a: any) => {
            const status = a.projects?.status
            return status && !['completed', 'paused'].includes(status)
          })
          const utilization = Math.round((assignments.length / m.max_concurrent_projects) * 100)

          return (
            <div key={m.id} className="bg-[#0d0d20] border border-white/5 rounded-xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-white font-medium">{m.full_name}</h2>
                  <p className="text-gray-400 text-xs mt-0.5 capitalize">{m.role}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${utilization >= 90 ? 'text-red-400' : utilization >= 70 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {utilization}% utilization
                  </p>
                  <p className="text-gray-500 text-xs">{assignments.length} / {m.max_concurrent_projects} projects</p>
                </div>
              </div>

              {/* Utilization bar */}
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-4">
                <div
                  className={`h-full rounded-full ${utilization >= 90 ? 'bg-red-500' : utilization >= 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(utilization, 100)}%` }}
                />
              </div>

              {/* Active projects */}
              {assignments.length > 0 && (
                <div className="space-y-1 mb-3">
                  {assignments.map((a: any) => (
                    <a
                      key={a.project_id}
                      href={`/command-center/projects/${a.project_id}`}
                      className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                      {a.projects?.name}
                    </a>
                  ))}
                </div>
              )}

              {/* Skills */}
              {m.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {m.skills.map((s: string) => (
                    <span key={s} className="px-2 py-0.5 bg-white/5 rounded text-xs text-gray-400">{s}</span>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {(members ?? []).length === 0 && (
          <div className="bg-[#0d0d20] border border-white/5 rounded-xl px-5 py-10 text-center text-gray-500 text-sm">
            No team members yet. Add members via Supabase Auth or the settings panel.
          </div>
        )}
      </div>
    </div>
  )
}
