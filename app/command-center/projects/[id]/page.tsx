import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ProjectStatusBadge } from '@/components/command-center/projects/ProjectStatusBadge'
import { MilestoneList } from '@/components/command-center/projects/MilestoneList'

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/command-center/login')

  const { data: project } = await supabase
    .from('projects')
    .select(`
      *,
      milestones(id, name, due_date, status, assigned_to),
      project_assignments(
        member_id,
        team_members(id, full_name, avatar_url)
      )
    `)
    .eq('id', params.id)
    .single()

  if (!project) notFound()

  const milestones = project.milestones ?? []
  const completedMilestones = milestones.filter((m: any) => m.status === 'completed').length
  const progress = milestones.length > 0 ? Math.round((completedMilestones / milestones.length) * 100) : 0
  const budgetPct = project.budget_total > 0 ? Math.round((project.budget_spent / project.budget_total) * 100) : 0
  const isOverdue = project.target_end_date && new Date(project.target_end_date) < new Date() && project.status !== 'completed'

  return (
    <div className="p-6 space-y-5 max-w-4xl">
      {/* Breadcrumb */}
      <a href="/command-center/projects" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
        ← Projects
      </a>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-white">{project.name}</h1>
            <ProjectStatusBadge status={project.status} />
          </div>
          {project.client_name && (
            <p className="text-gray-400 text-sm mt-0.5">{project.client_name}</p>
          )}
        </div>
        <a
          href={`/command-center/projects/${project.id}/edit`}
          className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
        >
          Edit
        </a>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-3 gap-4">
        {/* Progress */}
        <div className="bg-[#0d0d20] border border-white/5 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-2">Milestone progress</p>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-sm font-medium text-white">{progress}%</span>
          </div>
          <p className="text-xs text-gray-500">{completedMilestones} / {milestones.length} milestones</p>
        </div>

        {/* Budget */}
        <div className="bg-[#0d0d20] border border-white/5 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-2">Budget</p>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${budgetPct >= 100 ? 'bg-red-500' : budgetPct >= 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(budgetPct, 100)}%` }}
              />
            </div>
            <span className="text-sm font-medium text-white">{budgetPct}%</span>
          </div>
          <p className="text-xs text-gray-500">
            ${(project.budget_spent ?? 0).toLocaleString()} / ${(project.budget_total ?? 0).toLocaleString()}
          </p>
        </div>

        {/* Timeline */}
        <div className="bg-[#0d0d20] border border-white/5 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-2">Timeline</p>
          <p className={`text-sm font-medium ${isOverdue ? 'text-red-400' : 'text-white'}`}>
            {project.target_end_date
              ? new Date(project.target_end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
              : 'No deadline set'}
          </p>
          {isOverdue && <p className="text-xs text-red-400 mt-0.5">Overdue</p>}
          {project.start_date && (
            <p className="text-xs text-gray-500 mt-0.5">
              Started {new Date(project.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      {project.description && (
        <div className="bg-[#0d0d20] border border-white/5 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Description</p>
          <p className="text-sm text-gray-300">{project.description}</p>
        </div>
      )}

      {/* Links + Infrastructure IDs */}
      <div className="bg-[#0d0d20] border border-white/5 rounded-xl p-4">
        <p className="text-xs text-gray-400 mb-3">Links & infrastructure</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          {project.repository_url && <LinkRow label="Repository" href={project.repository_url} />}
          {project.staging_url && <LinkRow label="Staging" href={project.staging_url} />}
          {project.production_url && <LinkRow label="Production" href={project.production_url} />}
          {project.supabase_project_ref && <InfoRow label="Supabase ref" value={project.supabase_project_ref} />}
          {project.railway_project_id && <InfoRow label="Railway ID" value={project.railway_project_id} />}
          {project.vercel_project_id && <InfoRow label="Vercel ID" value={project.vercel_project_id} />}
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-[#0d0d20] border border-white/5 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-white/5">
          <h2 className="text-sm font-medium text-white">Milestones</h2>
        </div>
        <MilestoneList projectId={project.id} milestones={milestones} />
      </div>
    </div>
  )
}

function LinkRow({ label, href }: { label: string; href: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500 text-xs w-24">{label}</span>
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 text-xs truncate transition-colors">
        {href.replace(/^https?:\/\//, '')}
      </a>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500 text-xs w-24">{label}</span>
      <span className="text-gray-300 text-xs font-mono">{value}</span>
    </div>
  )
}
