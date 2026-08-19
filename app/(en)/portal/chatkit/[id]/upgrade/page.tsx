export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { PortalShell } from '@/components/portal/PortalShell'
import { ChevronLeft, Check, Coins } from 'lucide-react'
import { BuyCreditsButton } from '@/components/portal/chatkit/BuyCreditsButton'
import { UnlockFeatureButton } from '@/components/portal/chatkit/UnlockFeatureButton'
import {
  FREE_TRIAL_MESSAGES,
  CREDIT_PACKS,
  FEATURES,
  isFeatureUnlocked,
  type FeatureUnlocks,
} from '@/lib/portal/plans'

export default async function UpgradePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { id } = await params

  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('id, name, messages_used, credits_purchased, feature_unlocks')
    .eq('id', id)
    .eq('owner_id', user.id)
    .maybeSingle()

  if (!chatbot) notFound()

  const credits = chatbot.credits_purchased ?? 0
  const used = chatbot.messages_used ?? 0
  const total = FREE_TRIAL_MESSAGES + credits
  const remaining = Math.max(0, total - used)
  const isLimitReached = used >= total
  const unlocks = chatbot.feature_unlocks as FeatureUnlocks

  // Per-chatbot add-ons only; the account-scoped "additional chatbot" lives on
  // the account billing page.
  const chatbotFeatures = FEATURES.filter((f) => f.scope === 'chatbot')

  return (
    <PortalShell variant="marketing">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-10">
        <Link
          href={`/portal/chatkit/${id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-300 border border-white/10 hover:border-white/20 hover:text-white rounded-lg transition-colors w-fit"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Back to {chatbot.name}
        </Link>

        <div>
          <p className="text-xs text-cyan-400/80 font-mono uppercase tracking-wider mb-2">Credits &amp; add-ons</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Top up <span className="text-purple-300">{chatbot.name}</span>.
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            {used.toLocaleString()} / {total.toLocaleString()} messages used.{' '}
            {isLimitReached ? 'Widget paused — buy credits to resume.' : `${remaining.toLocaleString()} remaining.`}{' '}
            1 credit = 1 message. Credits never expire.
          </p>
        </div>

        {/* Credit packs */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-purple-300" />
            <h2 className="text-sm font-medium text-white">Buy message credits</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {CREDIT_PACKS.map((pack) => (
              <div
                key={pack.id}
                className={`bg-[#0d0d20]/80 border rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden flex flex-col gap-4 ${
                  pack.highlight ? 'border-purple-400/40' : 'border-white/[0.08]'
                }`}
              >
                {pack.highlight && (
                  <span className="absolute top-4 right-4 text-[10px] uppercase tracking-wider font-mono text-purple-200 bg-purple-500/15 border border-purple-400/30 px-2 py-0.5 rounded-full">
                    Best value
                  </span>
                )}
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-mono text-purple-200">{pack.name}</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-bold text-white">{pack.priceLabel}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{pack.description}</p>
                </div>
                <ul className="space-y-1.5 text-xs flex-1">
                  <li className="flex items-center gap-1.5 text-gray-200">
                    <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                    {pack.credits.toLocaleString()} message credits
                  </li>
                  <li className="flex items-center gap-1.5 text-gray-200">
                    <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                    {pack.perCreditLabel}
                  </li>
                  <li className="flex items-center gap-1.5 text-gray-200">
                    <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                    Never expires
                  </li>
                </ul>
                <BuyCreditsButton
                  chatbotId={id}
                  packId={pack.id}
                  label={`Buy ${pack.credits.toLocaleString()} — ${pack.priceLabel}`}
                  primary={pack.highlight}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Feature add-ons */}
        <section className="space-y-4">
          <h2 className="text-sm font-medium text-white">Feature add-ons</h2>
          <p className="text-xs text-gray-500 -mt-2">
            One-time unlocks for this chatbot. Buy once, keep forever — no subscription.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {chatbotFeatures.map((feature) => {
              const unlocked = isFeatureUnlocked(unlocks, feature.id)
              const comingSoon = feature.status === 'coming-soon'
              return (
                <div
                  key={feature.id}
                  className="bg-[#0d0d20]/80 border border-white/[0.08] rounded-2xl p-5 backdrop-blur-sm flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{feature.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{feature.tagline}</p>
                    </div>
                    <span className="text-sm font-semibold text-white whitespace-nowrap">
                      {comingSoon ? '' : feature.priceLabel}
                    </span>
                  </div>
                  <ul className="space-y-1.5 text-xs flex-1">
                    {feature.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-1.5 text-gray-300">
                        <Check className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <UnlockFeatureButton
                    featureId={feature.id}
                    chatbotId={id}
                    label={`Unlock — ${feature.priceLabel}`}
                    unlocked={unlocked}
                    comingSoon={comingSoon}
                  />
                </div>
              )
            })}
          </div>
        </section>

        <div className="bg-[#0d0d20]/60 border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm">
          <p className="text-sm text-gray-300 mb-1">Need another chatbot?</p>
          <p className="text-xs text-gray-500 mb-3">
            Additional chatbots are an account-level add-on, not tied to this one.
          </p>
          <Link
            href="/portal/upgrade"
            className="inline-flex items-center gap-1.5 text-sm text-purple-300 hover:text-purple-200 transition-colors"
          >
            Manage account add-ons →
          </Link>
        </div>

        <p className="text-xs text-gray-500 text-center leading-relaxed">
          Mock checkout for now — credits and unlocks are granted instantly so you can verify the flow end-to-end.
          Real payment goes live the moment our account is activated. No card is charged today.
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
