export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { InfraClient } from '@/components/command-center/infrastructure/InfraClient'

export default async function InfrastructurePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/command-center/login')

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Infrastructure</h1>
        <p className="text-gray-400 text-sm mt-0.5">
          Supabase, Railway, and Vercel monitoring &mdash; auto-refreshes every 60s
        </p>
      </div>
      <InfraClient />
    </div>
  )
}
