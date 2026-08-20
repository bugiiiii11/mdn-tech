import Link from 'next/link'
import { Check, Coins, Sparkles, ShieldCheck } from 'lucide-react'
import { FREE_TRIAL_MESSAGES, FEATURES, visibleCreditPacks } from '@/lib/portal/plans'

export function ChatKitPricing() {
  const perBotFeatures = FEATURES.filter((f) => f.scope === 'chatbot')

  return (
    <section className="space-y-8 pt-4">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-xs text-cyan-400/80 font-mono uppercase tracking-wider mb-3">
          Pricing
        </p>
        <h2 className="text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 leading-tight">
          Start free. Pay only for what you use.
        </h2>
        <p className="text-gray-400 text-sm md:text-base mt-3">
          Every chatbot starts with {FREE_TRIAL_MESSAGES} free messages. After that, replies draw one credit
          each from your account balance — one balance for all your chatbots and unlocks. No subscriptions.
        </p>
      </div>

      {/* Credit packs */}
      <div className="max-w-5xl mx-auto space-y-3">
        <div className="flex items-center gap-2 justify-center">
          <Coins className="w-4 h-4 text-purple-300" />
          <h3 className="text-sm font-medium text-white">Message credits</h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {visibleCreditPacks().map((pack) => (
            <div
              key={pack.id}
              className={`bg-[#0d0d20]/80 border rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden flex flex-col gap-4 ${
                pack.highlight ? 'border-purple-400/30' : 'border-white/[0.08]'
              }`}
            >
              {pack.highlight && (
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
              )}
              <div className="relative flex flex-col gap-4 h-full">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider font-mono text-purple-200">{pack.name}</span>
                  {pack.highlight && (
                    <span className="text-[10px] uppercase tracking-wider font-mono text-purple-200 bg-purple-500/15 border border-purple-400/30 px-2 py-0.5 rounded-full">
                      Best value
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{pack.priceLabel}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">{pack.description}</p>
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
                    Spend on any chatbot or unlock
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature add-ons */}
      <div className="max-w-5xl mx-auto space-y-3">
        <div className="flex items-center gap-2 justify-center">
          <Sparkles className="w-4 h-4 text-purple-300" />
          <h3 className="text-sm font-medium text-white">One-time feature unlocks</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {perBotFeatures.map((feature) => (
            <div
              key={feature.id}
              className="bg-[#0d0d20]/80 border border-white/[0.08] rounded-2xl p-5 backdrop-blur-sm flex flex-col gap-3"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-medium text-white">{feature.name}</span>
                <span className="text-sm font-semibold text-white whitespace-nowrap">
                  {feature.status === 'coming-soon' ? 'Soon' : feature.creditLabel}
                </span>
              </div>
              <p className="text-xs text-gray-500 flex-1">{feature.tagline}</p>
              {feature.status === 'coming-soon' && (
                <span className="text-[10px] uppercase tracking-wider font-mono text-gray-500">Coming soon</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <Link
          href="/portal/upgrade"
          className="inline-flex items-center gap-2 button-primary text-white text-sm px-6 py-3 rounded-xl"
        >
          <Sparkles className="w-4 h-4" />
          See billing
        </Link>
      </div>

      <div className="max-w-3xl mx-auto bg-[#0d0d20]/60 border border-white/[0.06] rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <h3 className="text-white font-medium text-sm">Why credits instead of a subscription?</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              A recurring bill only makes sense for predictable traffic. Credits fit every case — light, seasonal,
              or spiky — because you only pay for the messages your chatbot actually answers. Unlock the extra
              features you want, once, and skip the ones you don&apos;t.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        <details className="group bg-[#0d0d20]/60 border border-white/[0.06] rounded-xl p-4 backdrop-blur-sm">
          <summary className="text-sm text-white cursor-pointer list-none flex items-center justify-between">
            <span>What counts as a message?</span>
            <span className="text-gray-500 group-open:rotate-180 transition-transform">⌄</span>
          </summary>
          <p className="text-xs text-gray-400 mt-3 leading-relaxed">
            One credit per chatbot reply to a visitor. Visitor questions don&apos;t count, only the chatbot&apos;s
            answers. Replies are capped at ~225 words so each message goes a long way.
          </p>
        </details>

        <details className="group bg-[#0d0d20]/60 border border-white/[0.06] rounded-xl p-4 backdrop-blur-sm">
          <summary className="text-sm text-white cursor-pointer list-none flex items-center justify-between">
            <span>Do credits expire?</span>
            <span className="text-gray-500 group-open:rotate-180 transition-transform">⌄</span>
          </summary>
          <p className="text-xs text-gray-400 mt-3 leading-relaxed">
            Credits are valid for 12 months from purchase and sit on one account balance shared by all your
            chatbots. Stack as many packs as you like — each pack keeps its own 12-month window.
          </p>
        </details>

        <details className="group bg-[#0d0d20]/60 border border-white/[0.06] rounded-xl p-4 backdrop-blur-sm">
          <summary className="text-sm text-white cursor-pointer list-none flex items-center justify-between">
            <span>What happens when I run out of credits?</span>
            <span className="text-gray-500 group-open:rotate-180 transition-transform">⌄</span>
          </summary>
          <p className="text-xs text-gray-400 mt-3 leading-relaxed">
            The chatbot pauses on visitor sites until you top up. Your knowledge base, settings, unlocked
            features, and conversation history are never touched.
          </p>
        </details>

        <details className="group bg-[#0d0d20]/60 border border-white/[0.06] rounded-xl p-4 backdrop-blur-sm">
          <summary className="text-sm text-white cursor-pointer list-none flex items-center justify-between">
            <span>Are feature unlocks recurring?</span>
            <span className="text-gray-500 group-open:rotate-180 transition-transform">⌄</span>
          </summary>
          <p className="text-xs text-gray-400 mt-3 leading-relaxed">
            No. Each unlock — conversation viewer, analytics, and more — is a one-time credit spend per chatbot.
            Unlock it once and it stays on for that chatbot. Reach us at{' '}
            <a href="mailto:contact@mdntech.org" className="text-purple-300 hover:text-purple-200">
              contact@mdntech.org
            </a>
            {' '}with any questions.
          </p>
        </details>
      </div>
    </section>
  )
}
