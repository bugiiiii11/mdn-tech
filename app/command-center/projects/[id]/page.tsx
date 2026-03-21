export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ProjectTabs } from '@/components/command-center/projects/ProjectTabs'

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { tab?: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/command-center/login')

  const [{ data: project }, { data: communications }, { data: members }] = await Promise.all([
    supabase
      .from('projects')
      .select(`*, milestones(id, name, due_date, status, assigned_to), project_assignments(member_id, team_members(id, full_name))`)
      .eq('id', params.id)
      .single(),
    supabase
      .from('communications')
      .select(`id, channel, direction, subject, summary, action_items, contact_name, occurred_at, team_members(full_name)`)
      .eq('project_id', params.id)
      .order('occurred_at', { ascending: false }),
    supabase
      .from('team_members')
      .select('id, full_name')
      .eq('is_active', true),
  ])

  if (!project) notFound()

  const tab = searchParams.tab ?? 'overview'

  return (
    <div className="p-6 max-w-4xl space-y-5">
      {/* Breadcrumb */}
      <a href="/command-center/projects" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
        ← Projects
      </a>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">{project.name}</h1>
          {project.client_name && <p className="text-gray-400 text-sm mt-0.5">{project.client_name}</p>}
        </div>
        <a
          href={`/command-center/projects/${project.id}/edit`}
          className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
        >
          Edit
        </a>
      </div>

      <ProjectTabs
        project={project}
        milestones={project.milestones ?? []}
        communications={communications ?? []}
        members={members ?? []}
        currentTab={tab}
        userId={user.id}
      />
    </div>
  )
}
