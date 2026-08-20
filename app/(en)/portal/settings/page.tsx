export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PortalShell } from '@/components/portal/PortalShell'
import { UserCircle2, Mail, Building2, CalendarClock, Coins, ArrowUpRight, Bot } from 'lucide-react'
import { FREE_TRIAL_MESSAGES, chatbotLimit } from '@/lib/portal/plans'
import { creditBalance } from '@/lib/portal/credits'
import { AccountSecurity } from '@/components/portal/settings/AccountSecurity'

export default async function PortalSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const [{ data: customer }, { count: chatbotCount }, balance] = await Promise.all([
    supabase.from('customers').select('*').eq('id', user.id).maybeSingle(),
    supabase.from('chatbots').select('id', { count: 'exact', head: true }).eq('owner_id', user.id),
    creditBalance(user.id),
  ])

  if (!customer) redirect('/portal/login')

  const memberSince = customer?.created_at
    ? new Date(customer.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '—'

  const extraSlots = customer?.extra_chatbot_slots ?? 0
  const limit = chatbotLimit(extraSlots)
  const botsUsed = chatbotCount ?? 0

  const fields: { label: string; value: string; icon: typeof Mail }[] = [
    { label: 'Email', value: user.email ?? '—', icon: Mail },
    { label: 'Name', value: customer?.full_name || '—', icon: UserCircle2 },
    { label: 'Company', value: customer?.company || '—', icon: Building2 },
    { label: 'Member since', value: memberSince, icon: CalendarClock },
  ]

  return (
    <PortalShell variant="marketing">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-6">
        <header>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400/80 mb-2">
            Settings
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Account
          </h1>
          <p className="text-gray-400 text-sm mt-2 max-w-xl">
            The basics on file for your M.D.N Tech account, plus your ChatKit billing.
          </p>
        </header>

        {/* Billing card */}
        <section className="bg-[#0d0d20]/80 border border-white/[0.06] rounded-xl p-5 space-y-4 backdrop-blur-sm">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-purple-300" />
              <h2 className="text-sm font-medium text-white">ChatKit billing</h2>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full border text-green-300 bg-green-500/10 border-green-400/30">
              Pay as you go
            </span>
          </div>

          <div className="bg-[#0a0a14] border border-white/5 rounded-lg p-4 space-y-2">
            <p className="text-sm text-gray-200">
              Account balance: <span className="font-semibold text-white">{balance.toLocaleString()}</span>{' '}
              credits. Every chatbot gets {FREE_TRIAL_MESSAGES} free messages, then replies draw one credit
              each from this balance. No subscription — feature unlocks are one-time credit spends.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
              <Bot className="w-3.5 h-3.5 text-gray-500" />
              Using {botsUsed} of {limit} chatbot{limit === 1 ? '' : 's'}
              {extraSlots > 0 && <span className="text-gray-500">· {extraSlots} extra purchased</span>}
            </div>
          </div>

          <Link
            href="/portal/upgrade"
            className="inline-flex items-center gap-1.5 text-xs text-purple-300 hover:text-purple-200 transition-colors"
          >
            Manage credits &amp; add-ons
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </section>

        {/* Profile card */}
        <section className="bg-[#0d0d20]/80 border border-white/[0.06] rounded-xl p-5 space-y-5 backdrop-blur-sm">
          <h2 className="text-sm font-medium text-white">Profile</h2>
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
            Need to update your name or company? Contact{' '}
            <a href="mailto:contact@mdntech.org" className="text-purple-400 hover:text-purple-300 transition-colors">
              contact@mdntech.org
            </a>
            .
          </p>
        </section>

        {/* Security card: change email + password */}
        <AccountSecurity currentEmail={user.email ?? ''} />
      </div>
    </PortalShell>
  )
}
