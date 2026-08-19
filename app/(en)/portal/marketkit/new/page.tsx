export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PortalShell } from '@/components/portal/PortalShell'
import { MarketKitEyebrow, BackChip } from '@/components/portal/marketkit/ui'
import { ProjectForm } from '@/components/portal/marketkit/ProjectForm'
import { hasMarketkitAccess } from '@/lib/marketkit/enrollment'

export default async function NewMarketKitProjectPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')
  if (!(await hasMarketkitAccess(supabase, user.id))) redirect('/portal/toolkit')

  return (
    <PortalShell variant="marketing">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <div className="mb-6">
          <BackChip href="/portal/marketkit" label="Portfolio" />
        </div>
        <header className="mb-8">
          <MarketKitEyebrow />
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">New project</h1>
          <p className="text-gray-400 text-sm mt-2 max-w-xl">
            Name it, drop the live URL and pick a budget tier. Next you&apos;ll upload assets and run the AI scan.
          </p>
        </header>
        <ProjectForm userId={user.id} />
      </div>
    </PortalShell>
  )
}
