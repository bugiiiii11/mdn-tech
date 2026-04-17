export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PortalShell } from '@/components/portal/PortalShell'

export default async function PortalSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <PortalShell>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-white">Settings</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage your account</p>
        </div>

        <div className="bg-[#0d0d20] border border-white/5 rounded-xl p-5 space-y-4 max-w-lg">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Email</label>
            <p className="text-sm text-white">{user.email}</p>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Name</label>
            <p className="text-sm text-white">{customer?.full_name || '—'}</p>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Company</label>
            <p className="text-sm text-white">{customer?.company || '—'}</p>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Member since</label>
            <p className="text-sm text-gray-400">
              {customer?.created_at
                ? new Date(customer.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                : '—'}
            </p>
          </div>
        </div>
      </div>
    </PortalShell>
  )
}
