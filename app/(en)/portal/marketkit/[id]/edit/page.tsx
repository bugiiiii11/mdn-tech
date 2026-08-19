export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { PortalShell } from '@/components/portal/PortalShell'
import { MarketKitEyebrow, BackChip } from '@/components/portal/marketkit/ui'
import { ProjectForm } from '@/components/portal/marketkit/ProjectForm'
import { DeleteProjectButton } from '@/components/portal/marketkit/DeleteProjectButton'
import { hasMarketkitAccess } from '@/lib/marketkit/enrollment'
import type { MkProject } from '@/lib/marketkit/types'

export default async function EditMarketKitProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')
  if (!(await hasMarketkitAccess(supabase, user.id))) redirect('/portal/toolkit')

  const { data: project } = await supabase
    .from('mk_projects')
    .select('*')
    .eq('id', id)
    .eq('owner_id', user.id)
    .maybeSingle()
  if (!project) notFound()

  return (
    <PortalShell variant="marketing">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <div className="mb-6">
          <BackChip href={`/portal/marketkit/${id}`} label={(project as MkProject).name} />
        </div>
        <header className="mb-8">
          <MarketKitEyebrow />
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Edit project</h1>
        </header>
        <ProjectForm project={project as MkProject} userId={user.id} />

        <div className="mt-10 pt-6 border-t border-white/[0.06] max-w-xl">
          <h2 className="text-sm font-medium text-gray-300 mb-1">Danger zone</h2>
          <p className="text-xs text-gray-500 mb-3">
            Deleting removes the project, its assets, profile, strategy and content permanently.
          </p>
          <DeleteProjectButton projectId={id} projectName={(project as MkProject).name} />
        </div>
      </div>
    </PortalShell>
  )
}
