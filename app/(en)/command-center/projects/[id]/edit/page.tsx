export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ProjectForm } from '@/components/command-center/projects/ProjectForm'

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/command-center/login')

  const { id } = await params
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (!project) notFound()

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <a href={`/command-center/projects/${id}`} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
          ← {project.name}
        </a>
        <h1 className="text-xl font-semibold text-white mt-2">Edit project</h1>
      </div>
      <ProjectForm project={project} />
    </div>
  )
}
