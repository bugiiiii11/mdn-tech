export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PortalShell } from '@/components/portal/PortalShell'
import { UserCircle2, Mail, Building2, CalendarClock } from 'lucide-react'

export default async function PortalSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (!customer) redirect('/portal/login')

  const memberSince = customer?.created_at
    ? new Date(customer.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '—'

  const fields: { label: string; value: string; icon: typeof Mail }[] = [
    { label: 'Email', value: user.email ?? '—', icon: Mail },
    { label: 'Name', value: customer?.full_name || '—', icon: UserCircle2 },
    { label: 'Company', value: customer?.company || '—', icon: Building2 },
    { label: 'Member since', value: memberSince, icon: CalendarClock },
  ]

  return (
    <PortalShell>
      <div className="p-6 space-y-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
              <UserCircle2 className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Settings</h1>
              <p className="text-gray-400 text-sm mt-0.5">Manage your account</p>
            </div>
          </div>
        </div>

        {/* Account card */}
        <section className="bg-[#0d0d20] border border-white/5 rounded-xl p-5 space-y-4 max-w-2xl">
          <h2 className="text-sm font-medium text-white">Account</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fields.map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-[#0a0a14] border border-white/5 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-gray-400">{label}</span>
                  <span className="w-5 h-5 rounded-md flex items-center justify-center text-purple-300 bg-purple-500/10">
                    <Icon className="w-3 h-3" />
                  </span>
                </div>
                <p className="text-sm font-medium text-white truncate">{value}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500">
            Need to update something? Contact{' '}
            <a href="mailto:contact@mdntech.org" className="text-purple-400 hover:text-purple-300 transition-colors">
              contact@mdntech.org
            </a>
            .
          </p>
        </section>
      </div>
    </PortalShell>
  )
}
