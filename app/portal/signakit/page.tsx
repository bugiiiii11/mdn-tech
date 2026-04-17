export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PortalShell } from '@/components/portal/PortalShell'
import { Shield } from 'lucide-react'

export default async function SignaKitPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  return (
    <PortalShell>
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-white mb-2">SignaKit</h1>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">
              Authentication and user management for your applications. Currently in development.
            </p>
            <span className="inline-block mt-4 text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">
              Coming soon
            </span>
          </div>
        </div>
      </div>
    </PortalShell>
  )
}
