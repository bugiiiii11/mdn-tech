export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PortalShell } from '@/components/portal/PortalShell'
import { UserCircle2, Mail, Building2, CalendarClock, Sparkles, ArrowUpRight } from 'lucide-react'
import { PLANS, resolveAccountTier } from '@/lib/portal/plans'
import { CancelSubscriptionButton } from '@/components/portal/upgrade/PlanActionButton'

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

  const tier = resolveAccountTier({
    subscription_plan: customer?.subscription_plan ?? null,
    subscription_status: customer?.subscription_status ?? null,
    current_period_end: customer?.current_period_end ?? null,
  })
  const plan = PLANS[tier]
  const isCanceled = customer?.subscription_status === 'canceled'
  const periodEnd = customer?.current_period_end
    ? new Date(customer.current_period_end).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null

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
            The basics on file for your M.D.N Tech account, plus your current ChatKit plan.
          </p>
        </header>

        {/* Subscription card */}
        <section className="bg-[#0d0d20]/80 border border-white/[0.06] rounded-xl p-5 space-y-4 backdrop-blur-sm">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <h2 className="text-sm font-medium text-white">ChatKit plan</h2>
            </div>
            <span
              className={`text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full border ${
                isCanceled
                  ? 'text-amber-200 bg-amber-500/10 border-amber-400/30'
                  : tier === 'free'
                    ? 'text-gray-300 bg-gray-500/10 border-white/10'
                    : 'text-green-300 bg-green-500/10 border-green-400/30'
              }`}
            >
              {isCanceled ? 'Cancelling' : tier === 'free' ? 'Free' : 'Active'}
            </span>
          </div>

          <div className="bg-[#0a0a14] border border-white/5 rounded-lg p-4 space-y-2">
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <span className="text-lg font-semibold text-white">{plan.name}</span>
                <span className="text-gray-500 text-xs ml-2">{plan.priceLabel}</span>
              </div>
              {plan.monthlyMessages !== null && customer?.subscription_status === 'active' && (
                <span className="text-xs text-gray-400">
                  {(customer.period_messages_used ?? 0).toLocaleString()} /{' '}
                  {plan.monthlyMessages.toLocaleString()} this cycle
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">{plan.description}</p>
            {periodEnd && (customer?.subscription_status === 'active' || isCanceled) && (
              <p className="text-xs text-gray-500">
                {isCanceled ? 'Access ends' : 'Renews'} {periodEnd}.
              </p>
            )}
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <Link
              href="/portal/upgrade"
              className="inline-flex items-center gap-1.5 text-xs text-purple-300 hover:text-purple-200 transition-colors"
            >
              {tier === 'free' ? 'See plans' : 'Manage plan'}
              <ArrowUpRight className="w-3 h-3" />
            </Link>
            {customer?.subscription_status === 'active' && !isCanceled && (
              <CancelSubscriptionButton />
            )}
          </div>
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
            Need to update profile details? Contact{' '}
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
