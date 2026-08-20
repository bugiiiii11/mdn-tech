export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, CheckCircle2, Coins, Bot, Sparkles, XCircle } from 'lucide-react'
import { PortalShell } from '@/components/portal/PortalShell'
import { BuyCreditsButton } from '@/components/portal/chatkit/BuyCreditsButton'
import { UnlockFeatureButton } from '@/components/portal/chatkit/UnlockFeatureButton'
import { creditBalance } from '@/lib/portal/credits'
import {
  FREE_TRIAL_MESSAGES,
  FEATURES,
  visibleCreditPacks,
  chatbotLimit,
  featureById,
} from '@/lib/portal/plans'

export default async function AccountUpgradePage({
  searchParams,
}: {
  searchParams: Promise<{ purchase?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { purchase } = await searchParams

  const [{ data: customer }, { count: chatbotCount }, balance] = await Promise.all([
    supabase
      .from('customers')
      .select('extra_chatbot_slots')
      .eq('id', user.id)
      .maybeSingle(),
    supabase
      .from('chatbots')
      .select('id', { count: 'exact', head: true })
      .eq('owner_id', user.id),
    creditBalance(user.id),
  ])

  const extraSlots = customer?.extra_chatbot_slots ?? 0
  const limit = chatbotLimit(extraSlots)
  const used = chatbotCount ?? 0
  const extraChatbot = featureById('extra_chatbot')!
  const perBotFeatures = FEATURES.filter((f) => f.scope === 'chatbot')
  const paymentsLive = Boolean(process.env.STRIPE_SECRET_KEY)

  return (
    <PortalShell variant="marketing">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-10">
        <Link
          href="/portal/chatkit"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-300 border border-white/10 hover:border-white/20 hover:text-white rounded-lg transition-colors w-fit"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          ChatKit
        </Link>

        {purchase === 'success' && (
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-400/30 rounded-xl px-4 py-3">
            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
            <p className="text-sm text-green-300">Purchase complete — credits added to your account.</p>
          </div>
        )}
        {purchase === 'cancelled' && (
          <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3">
            <XCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <p className="text-sm text-gray-300">Checkout cancelled — no card was charged.</p>
          </div>
        )}

        <div>
          <p className="text-xs text-cyan-400/80 font-mono uppercase tracking-wider mb-2">Billing</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Pay only for what you use.
          </h1>
          <p className="text-gray-400 text-sm mt-3 max-w-2xl">
            No subscriptions. Every chatbot starts with {FREE_TRIAL_MESSAGES} free messages, then replies draw
            one credit each from your account balance. The same credits pay for one-time feature unlocks.
            Credits are valid for 12 months from purchase.
          </p>
        </div>

        {/* Balance + credit packs */}
        <section className="bg-[#0d0d20]/60 border border-white/[0.06] rounded-2xl p-6 backdrop-blur-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-purple-300" />
              <h2 className="text-sm font-medium text-white">Account credits</h2>
            </div>
            <span className="text-sm text-gray-300">
              Balance: <span className="font-semibold text-white">{balance.toLocaleString()}</span> credits
            </span>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {visibleCreditPacks().map((pack) => (
              <div
                key={pack.id}
                className={`bg-[#0a0a14] border rounded-xl p-4 flex flex-col gap-3 ${
                  pack.highlight ? 'border-purple-400/30' : 'border-white/5'
                }`}
              >
                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-semibold text-white">{pack.priceLabel}</span>
                    <span className="text-[11px] text-gray-500">{pack.perCreditLabel}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {pack.credits.toLocaleString()} credits · {pack.name}
                    {pack.highlight && <span className="text-purple-300"> · Best value</span>}
                  </p>
                </div>
                <BuyCreditsButton
                  packId={pack.id}
                  label={`Buy ${pack.name}`}
                  returnTo="/portal/upgrade"
                  primary={pack.highlight}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            One balance for your whole account — every chatbot and every unlock draws from it.
          </p>
        </section>

        {/* Account add-on: additional chatbot */}
        <section className="space-y-4">
          <h2 className="text-sm font-medium text-white">Account add-ons</h2>
          <div className="bg-[#0d0d20]/80 border border-white/[0.08] rounded-2xl p-5 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-300 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{extraChatbot.name}</p>
              <p className="text-xs text-gray-500 mt-1">{extraChatbot.tagline}</p>
              <p className="text-[11px] text-gray-500 mt-1">
                Using {used} of {limit} chatbot{limit === 1 ? '' : 's'} ({extraSlots} extra purchased).
              </p>
            </div>
            <div className="sm:w-48">
              <UnlockFeatureButton featureId="extra_chatbot" label={`Add a chatbot — ${extraChatbot.creditLabel}`} />
            </div>
          </div>
        </section>

        {/* Per-chatbot feature catalog (informational) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-300" />
            <h2 className="text-sm font-medium text-white">Per-chatbot feature unlocks</h2>
          </div>
          <p className="text-xs text-gray-500 -mt-2">
            Unlock these from an individual chatbot&apos;s page. One-time credit spend, per chatbot.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {perBotFeatures.map((feature) => (
              <div
                key={feature.id}
                className="bg-[#0d0d20]/60 border border-white/[0.06] rounded-xl p-4 backdrop-blur-sm flex items-start justify-between gap-3"
              >
                <div>
                  <p className="text-sm text-gray-200">{feature.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{feature.tagline}</p>
                </div>
                <span className="text-xs whitespace-nowrap font-mono text-gray-400">
                  {feature.status === 'coming-soon' ? 'Soon' : feature.creditLabel}
                </span>
              </div>
            ))}
          </div>
        </section>

        {!paymentsLive && (
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            Mock checkout for now — credits and unlocks are granted instantly so you can verify the flow. Real
            payment goes live the moment our account is activated. No card is charged today.
          </p>
        )}

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
