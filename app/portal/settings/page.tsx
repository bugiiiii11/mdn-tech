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
    <PortalShell variant="marketing">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <header className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400/80 mb-2">
            Settings
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Account
          </h1>
          <p className="text-gray-400 text-sm mt-2 max-w-xl">
            The basics on file for your M.D.N Tech account. Need to change
            something? Drop us a line and we&apos;ll sort it.
          </p>
        </header>

        <section className="bg-[#0d0d20]/80 border border-white/[0.06] rounded-xl p-5 space-y-5 backdrop-blur-sm">
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
