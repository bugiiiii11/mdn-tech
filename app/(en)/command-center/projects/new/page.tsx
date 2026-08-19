export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProjectForm } from '@/components/command-center/projects/ProjectForm'

export default async function NewProjectPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/command-center/login')

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <a href="/command-center/projects" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
          ← Projects
        </a>
        <h1 className="text-xl font-semibold text-white mt-2">New project</h1>
      </div>
      <ProjectForm />
    </div>
  )
}
