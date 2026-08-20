export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { PortalShell } from '@/components/portal/PortalShell'
import { ChevronLeft, Check, CheckCircle2, Coins, XCircle } from 'lucide-react'
import { BuyCreditsButton } from '@/components/portal/chatkit/BuyCreditsButton'
import { UnlockFeatureButton } from '@/components/portal/chatkit/UnlockFeatureButton'
import { creditBalance } from '@/lib/portal/credits'
import {
  FREE_TRIAL_MESSAGES,
  FEATURES,
  visibleCreditPacks,
  isFeatureUnlocked,
  type FeatureUnlocks,
} from '@/lib/portal/plans'

export default async function UpgradePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ purchase?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { id } = await params
  const { purchase } = await searchParams

  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('id, name, messages_used, feature_unlocks')
    .eq('id', id)
    .eq('owner_id', user.id)
    .maybeSingle()

  if (!chatbot) notFound()

  const balance = await creditBalance(user.id)
  const used = chatbot.messages_used ?? 0
  const trialLeft = Math.max(0, FREE_TRIAL_MESSAGES - used)
  const blocked = trialLeft === 0 && balance <= 0
  const unlocks = chatbot.feature_unlocks as FeatureUnlocks
  const paymentsLive = Boolean(process.env.STRIPE_SECRET_KEY)
  const returnTo = `/portal/chatkit/${id}/upgrade`

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
          <p className="text-xs text-cyan-400/80 font-mono uppercase tracking-wider mb-2">Credits &amp; add-ons</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Top up <span className="text-purple-300">{chatbot.name}</span>.
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Account balance: {balance.toLocaleString()} credits, shared across all your chatbots.{' '}
            {trialLeft > 0
              ? `This chatbot still has ${trialLeft.toLocaleString()} free trial messages before replies use credits.`
              : blocked
                ? 'Widget paused — buy credits to resume.'
                : 'One credit per reply.'}{' '}
            Credits are valid for 12 months from purchase.
          </p>
        </div>

        {/* Credit packs */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-purple-300" />
            <h2 className="text-sm font-medium text-white">Buy credits</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {visibleCreditPacks().map((pack) => (
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
                    {pack.credits.toLocaleString()} credits
                  </li>
                  <li className="flex items-center gap-1.5 text-gray-200">
                    <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                    {pack.perCreditLabel}
                  </li>
                  <li className="flex items-center gap-1.5 text-gray-200">
                    <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                    Spend on any chatbot or unlock
                  </li>
                </ul>
                <BuyCreditsButton
                  packId={pack.id}
                  label={`Buy ${pack.credits.toLocaleString()} — ${pack.priceLabel}`}
                  returnTo={returnTo}
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
            One-time unlocks for this chatbot, paid in credits. Unlock once, keep forever — no subscription.
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
                      {comingSoon ? '' : feature.creditLabel}
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
                    label={`Unlock — ${feature.creditLabel}`}
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

        {!paymentsLive && (
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            Mock checkout for now — credits and unlocks are granted instantly so you can verify the flow end-to-end.
            Real payment goes live the moment our account is activated. No card is charged today.
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
