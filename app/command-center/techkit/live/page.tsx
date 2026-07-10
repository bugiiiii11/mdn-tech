export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TechKitShell } from '@/components/command-center/techkit/ui'
import { InfraClient } from '@/components/command-center/infrastructure/InfraClient'

// The pre-TechKit live-fetch view, kept as-is per decision T8 —
// direct provider API calls, auto-refreshes every 60s while open.
export default async function TechKitLivePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/command-center/login')

  return (
    <TechKitShell active="Live" title="Live provider view" subtitle="Direct Supabase / Railway / Vercel API fetch — auto-refreshes every 60s">
      <InfraClient />
    </TechKitShell>
  )
}
