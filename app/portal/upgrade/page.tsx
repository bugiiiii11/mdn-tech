export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Check, Sparkles, MessageSquare, Zap, Crown } from 'lucide-react'
import { PortalShell } from '@/components/portal/PortalShell'
import { PLANS, resolveAccountTier, type EffectiveTier } from '@/lib/portal/plans'
import { SubscribeButton, CancelSubscriptionButton } from '@/components/portal/upgrade/PlanActionButton'

const TIER_ICONS: Record<EffectiveTier, { icon: typeof Sparkles; color: string; bg: string }> = {
  free:    { icon: MessageSquare, color: 'text-cyan-300',   bg: 'bg-cyan-500/10' },
  starter: { icon: Sparkles,      color: 'text-purple-300', bg: 'bg-purple-500/10' },
  pro:     { icon: Zap,           color: 'text-purple-300', bg: 'bg-purple-500/15' },
  max:     { icon: Crown,         color: 'text-amber-300',  bg: 'bg-amber-500/15' },
}

export default async function UpgradePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: customer } = await supabase
    .from('customers')
    .select('subscription_plan, subscription_status, current_period_end, period_messages_used')
    .eq('id', user.id)
    .maybeSingle()

  const currentTier = resolveAccountTier({
    subscription_plan: customer?.subscription_plan ?? null,
    subscription_status: customer?.subscription_status ?? null,
    current_period_end: customer?.current_period_end ?? null,
  })

  const periodEnd = customer?.current_period_end
    ? new Date(customer.current_period_end).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      })
    : null
  const isCanceled = customer?.subscription_status === 'canceled'

  const tierOrder: EffectiveTier[] = ['free', 'starter', 'pro', 'max']

  return (
    <PortalShell variant="marketing">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 space-y-10">
        <Link
          href="/portal/chatkit"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-300 border border-white/10 hover:border-white/20 hover:text-white rounded-lg transition-colors w-fit"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          ChatKit
        </Link>

        <div>
          <p className="text-xs text-cyan-400/80 font-mono uppercase tracking-wider mb-2">
            Plans &amp; billing
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {currentTier === 'free' && 'Choose a plan that fits your traffic.'}
            {currentTier === 'starter' && 'Top up credits or scale to a subscription.'}
            {currentTier === 'pro' && (isCanceled
              ? <>Pro is canceled — reactivates only if you resubscribe.</>
              : <>You&apos;re on <span className="text-purple-300">Pro</span>.</>
            )}
            {currentTier === 'max' && (isCanceled
              ? <>Max is canceled — reactivates only if you resubscribe.</>
              : <>You&apos;re on <span className="text-amber-300">Max</span>.</>
            )}
          </h1>
          {customer?.subscription_status === 'active' && periodEnd && (
            <p className="text-gray-400 text-sm mt-2">
              Current cycle ends <span className="text-white">{periodEnd}</span>.{' '}
              {customer.period_messages_used.toLocaleString()} of{' '}
              {(PLANS[currentTier].monthlyMessages ?? 0).toLocaleString()} messages used this cycle.
            </p>
          )}
          {isCanceled && periodEnd && (
            <p className="text-gray-400 text-sm mt-2">
              Access continues until <span className="text-white">{periodEnd}</span>, then you fall back to Free.
            </p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tierOrder.map((tierId) => {
            const plan = PLANS[tierId]
            const { icon: Icon, color, bg } = TIER_ICONS[tierId]
            const isCurrent = tierId === currentTier && customer?.subscription_status === 'active'
            const isPopular = tierId === 'pro'
            const isPaid = plan.isSubscription
            const borderClass = isCurrent
              ? 'border-purple-400/60'
              : isPopular
                ? 'border-purple-400/30'
                : tierId === 'max'
                  ? 'border-amber-400/30'
                  : 'border-white/[0.08]'

            return (
              <div
                key={tierId}
                className={`bg-[#0d0d20]/80 border ${borderClass} rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden flex flex-col`}
              >
                {(isPopular || tierId === 'max' || isCurrent) && (
                  <div className={`absolute -top-12 -right-12 w-40 h-40 ${bg} rounded-full blur-3xl pointer-events-none`} />
                )}
                <div className="relative flex flex-col gap-4 h-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-md flex items-center justify-center ${bg}`}>
                        <Icon className={`w-3.5 h-3.5 ${color}`} />
                      </span>
                      <span className={`text-[11px] uppercase tracking-wider font-mono ${color}`}>
                        {plan.name}
                      </span>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] uppercase tracking-wider font-mono text-green-300 bg-green-500/15 border border-green-400/30 px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                    {!isCurrent && isPopular && (
                      <span className="text-[10px] uppercase tracking-wider font-mono text-purple-200 bg-purple-500/15 border border-purple-400/30 px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-white">{plan.priceLabel.split('/')[0]}</span>
                      {plan.priceLabel.includes('/') && (
                        <span className="text-gray-400 text-sm">/{plan.priceLabel.split('/')[1]}</span>
                      )}
                      {plan.isPayg && <span className="text-gray-400 text-sm">/ pack</span>}
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5 leading-snug">{plan.description}</p>
                  </div>

                  <ul className="space-y-1.5 text-xs flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-1.5 text-gray-200">
                        <Check className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-2 pt-1">
                    {tierId === 'free' && (
                      <div className="text-center text-xs text-gray-500 py-2.5 border border-white/5 rounded-xl">
                        {currentTier === 'free' ? 'Your current plan' : 'Fallback when subs end'}
                      </div>
                    )}
                    {tierId === 'starter' && (
                      <Link
                        href="/portal/chatkit"
                        className="block w-full text-center text-sm py-2.5 rounded-xl border border-white/15 text-gray-200 hover:border-white/30 hover:text-white transition-colors"
                      >
                        Buy credits
                      </Link>
                    )}
                    {isPaid && isCurrent && !isCanceled && (
                      <div className="space-y-2 text-center pt-1">
                        <CancelSubscriptionButton />
                      </div>
                    )}
                    {isPaid && isCurrent && isCanceled && (
                      <SubscribeButton plan={tierId as 'pro' | 'max'} label="Reactivate" primary />
                    )}
                    {isPaid && !isCurrent && (
                      <SubscribeButton
                        plan={tierId as 'pro' | 'max'}
                        label={
                          currentTier === 'free' || currentTier === 'starter'
                            ? `Subscribe to ${plan.name}`
                            : (PLANS[tierId].priceCents > PLANS[currentTier].priceCents ? `Upgrade to ${plan.name}` : `Switch to ${plan.name}`)
                        }
                        primary={isPopular}
                      />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-xs text-gray-500 text-center max-w-2xl mx-auto leading-relaxed">
          Mock checkout for now — subscriptions are activated instantly so you can verify the flow end-to-end. Real
          Stripe billing goes live the moment our merchant account is activated. No card is charged today.
        </p>

        <p className="text-xs text-gray-500 text-center">
          Questions?{' '}
          <a href="mailto:contact@mdntech.org" className="text-purple-300 hover:text-purple-200">
            contact@mdntech.org
          </a>
        </p>
      </div>
    </PortalShell>
  )
}
