export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Check, Coins, Bot, Sparkles } from 'lucide-react'
import { PortalShell } from '@/components/portal/PortalShell'
import { UnlockFeatureButton } from '@/components/portal/chatkit/UnlockFeatureButton'
import {
  FREE_TRIAL_MESSAGES,
  CREDIT_PACKS,
  FEATURES,
  chatbotLimit,
  featureById,
} from '@/lib/portal/plans'

export default async function AccountUpgradePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const [{ data: customer }, { count: chatbotCount }] = await Promise.all([
    supabase
      .from('customers')
      .select('extra_chatbot_slots')
      .eq('id', user.id)
      .maybeSingle(),
    supabase
      .from('chatbots')
      .select('id', { count: 'exact', head: true })
      .eq('owner_id', user.id),
  ])

  const extraSlots = customer?.extra_chatbot_slots ?? 0
  const limit = chatbotLimit(extraSlots)
  const used = chatbotCount ?? 0
  const extraChatbot = featureById('extra_chatbot')!
  const perBotFeatures = FEATURES.filter((f) => f.scope === 'chatbot')

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

        <div>
          <p className="text-xs text-cyan-400/80 font-mono uppercase tracking-wider mb-2">Billing</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Pay only for what you use.
          </h1>
          <p className="text-gray-400 text-sm mt-3 max-w-2xl">
            No subscriptions. Every chatbot starts with {FREE_TRIAL_MESSAGES} free messages, then you top up
            credits — 1 credit per message, never expiring. Premium features are one-time unlocks you buy once
            and keep.
          </p>
        </div>

        {/* How credits work */}
        <section className="bg-[#0d0d20]/60 border border-white/[0.06] rounded-2xl p-6 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-purple-300" />
            <h2 className="text-sm font-medium text-white">Message credits</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {CREDIT_PACKS.map((pack) => (
              <div
                key={pack.id}
                className={`bg-[#0a0a14] border rounded-xl p-4 ${
                  pack.highlight ? 'border-purple-400/30' : 'border-white/5'
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-semibold text-white">{pack.priceLabel}</span>
                  <span className="text-[11px] text-gray-500">{pack.perCreditLabel}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{pack.credits.toLocaleString()} credits · {pack.name}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Credits are purchased per chatbot from its own page. Open a chatbot to top it up.
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
              <UnlockFeatureButton featureId="extra_chatbot" label={`Add a chatbot — ${extraChatbot.priceLabel}`} />
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
            Unlock these from an individual chatbot&apos;s page. One-time payment, per chatbot.
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
                  {feature.status === 'coming-soon' ? 'Soon' : feature.priceLabel}
                </span>
              </div>
            ))}
          </div>
        </section>

        <p className="text-xs text-gray-500 text-center leading-relaxed">
          Mock checkout for now — unlocks are granted instantly so you can verify the flow. Real payment goes live
          the moment our account is activated. No card is charged today.
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
