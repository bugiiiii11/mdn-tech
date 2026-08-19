export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TechKitShell } from '@/components/command-center/techkit/ui'
import { EndpointForm } from '@/components/command-center/techkit/EndpointForm'

export default async function NewEndpointPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/command-center/login')

  const { data: projects } = await supabase.from('projects').select('id, name').order('name')

  return (
    <TechKitShell active="Endpoints" title="Add endpoint" subtitle="New uptime target for the 5-minute poller">
      <div className="max-w-3xl">
        <EndpointForm projects={projects ?? []} />
      </div>
    </TechKitShell>
  )
}
