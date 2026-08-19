export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { TechKitShell } from '@/components/command-center/techkit/ui'
import { EndpointForm } from '@/components/command-center/techkit/EndpointForm'

export default async function EditEndpointPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/command-center/login')

  const { id } = await params
  const [{ data: endpoint }, { data: projects }] = await Promise.all([
    supabase.from('monitored_endpoints').select('*').eq('id', id).maybeSingle(),
    supabase.from('projects').select('id, name').order('name'),
  ])
  if (!endpoint) notFound()

  return (
    <TechKitShell active="Endpoints" title="Edit endpoint" subtitle={endpoint.url}>
      <div className="max-w-3xl">
        <EndpointForm projects={projects ?? []} endpoint={endpoint} />
      </div>
    </TechKitShell>
  )
}
