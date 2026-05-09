import Link from 'next/link'
import { Check, Sparkles, MessageSquare, Zap, Crown, ShieldCheck } from 'lucide-react'
import { PLANS } from '@/lib/portal/plans'

export function ChatKitPricing() {
  const tiers = [
    {
      plan: PLANS.free,
      icon: MessageSquare,
      iconColor: 'text-cyan-300',
      iconBg: 'bg-cyan-500/10',
      borderColor: 'border-white/[0.08]',
      eyebrowColor: 'text-cyan-200',
      footer: 'Already included with every signup.',
    },
    {
      plan: PLANS.starter,
      icon: Sparkles,
      iconColor: 'text-purple-300',
      iconBg: 'bg-purple-500/10',
      borderColor: 'border-white/[0.08]',
      eyebrowColor: 'text-purple-200',
      footer: 'Top up a single chatbot — no recurring billing.',
    },
    {
      plan: PLANS.pro,
      icon: Zap,
      iconColor: 'text-purple-300',
      iconBg: 'bg-purple-500/15',
      borderColor: 'border-purple-400/30',
      eyebrowColor: 'text-purple-200',
      footer: 'Best for growing sites with steady traffic.',
      badge: 'Popular',
    },
    {
      plan: PLANS.max,
      icon: Crown,
      iconColor: 'text-amber-300',
      iconBg: 'bg-amber-500/15',
      borderColor: 'border-amber-400/30',
      eyebrowColor: 'text-amber-200',
      footer: 'For teams managing multiple brands or high-volume support.',
    },
  ]

  return (
    <section className="space-y-8 pt-4">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-xs text-cyan-400/80 font-mono uppercase tracking-wider mb-3">
          Pricing
        </p>
        <h2 className="text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 leading-tight">
          Start free. Pay as you grow.
        </h2>
        <p className="text-gray-400 text-sm md:text-base mt-3">
          One free chatbot to test, then top up with credits or scale to a monthly subscription when you&apos;re ready.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
        {tiers.map(({ plan, icon: Icon, iconColor, iconBg, borderColor, eyebrowColor, footer, badge }) => (
          <div
            key={plan.id}
            className={`bg-[#0d0d20]/80 border ${borderColor} rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden flex flex-col`}
          >
            {borderColor.includes('purple') || borderColor.includes('amber') ? (
              <div className={`absolute -top-12 -right-12 w-40 h-40 ${iconBg} rounded-full blur-3xl pointer-events-none`} />
            ) : null}
            <div className="relative flex flex-col gap-5 h-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-md flex items-center justify-center ${iconBg}`}>
                    <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
                  </span>
                  <span className={`text-[11px] uppercase tracking-wider font-mono ${eyebrowColor}`}>
                    {plan.name}
                  </span>
                </div>
                {badge && (
                  <span className="text-[10px] uppercase tracking-wider font-mono text-purple-200 bg-purple-500/15 border border-purple-400/30 px-2 py-0.5 rounded-full">
                    {badge}
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.priceLabel.split('/')[0]}</span>
                  {plan.priceLabel.includes('/') && (
                    <span className="text-gray-400 text-sm">/{plan.priceLabel.split('/')[1]}</span>
                  )}
                  {plan.isPayg && <span className="text-gray-400 text-sm">/ pack</span>}
                  {plan.id === 'free' && <span className="text-gray-400 text-sm">/ chatbot</span>}
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

              <p className="text-[11px] text-gray-500 leading-snug pt-1">{footer}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Link
          href="/portal/upgrade"
          className="inline-flex items-center gap-2 button-primary text-white text-sm px-6 py-3 rounded-xl"
        >
          <Sparkles className="w-4 h-4" />
          Manage plan
        </Link>
      </div>

      <div className="max-w-3xl mx-auto bg-[#0d0d20]/60 border border-white/[0.06] rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <h3 className="text-white font-medium text-sm">Why a credit pack alongside subscriptions?</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Subscriptions reset monthly, which is great for predictable traffic. The Starter pack is for the opposite —
              a single chatbot with light or seasonal traffic where a recurring bill doesn&apos;t make sense. Credits
              never expire, so you keep what you paid for.
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
            One message per chatbot reply to a visitor. Visitor questions don&apos;t count, only the chatbot&apos;s
            answers. Replies are capped at ~225 words so each message goes a long way.
          </p>
        </details>

        <details className="group bg-[#0d0d20]/60 border border-white/[0.06] rounded-xl p-4 backdrop-blur-sm">
          <summary className="text-sm text-white cursor-pointer list-none flex items-center justify-between">
            <span>How is the cap counted on Pro and Max?</span>
            <span className="text-gray-500 group-open:rotate-180 transition-transform">⌄</span>
          </summary>
          <p className="text-xs text-gray-400 mt-3 leading-relaxed">
            Account-wide. Your 5,000 / 25,000 monthly messages are shared across all chatbots on your plan and reset at
            the end of each billing cycle. Free trial messages and Starter credits are per-chatbot and never reset.
          </p>
        </details>

        <details className="group bg-[#0d0d20]/60 border border-white/[0.06] rounded-xl p-4 backdrop-blur-sm">
          <summary className="text-sm text-white cursor-pointer list-none flex items-center justify-between">
            <span>What happens when I hit my cap?</span>
            <span className="text-gray-500 group-open:rotate-180 transition-transform">⌄</span>
          </summary>
          <p className="text-xs text-gray-400 mt-3 leading-relaxed">
            On Free / Starter: the chatbot pauses on visitor sites until you buy more credits or subscribe. On Pro / Max:
            it resumes when the new billing cycle starts (or immediately if you upgrade). Your knowledge base, settings,
            and conversation history are never touched.
          </p>
        </details>

        <details className="group bg-[#0d0d20]/60 border border-white/[0.06] rounded-xl p-4 backdrop-blur-sm">
          <summary className="text-sm text-white cursor-pointer list-none flex items-center justify-between">
            <span>Can I cancel a subscription anytime?</span>
            <span className="text-gray-500 group-open:rotate-180 transition-transform">⌄</span>
          </summary>
          <p className="text-xs text-gray-400 mt-3 leading-relaxed">
            Yes. Cancellation takes effect at the end of the current billing cycle — you keep access until then. After
            that you fall back to Free with whatever Starter credits remain on each chatbot. Reach us at{' '}
            <a href="mailto:contact@mdntech.org" className="text-purple-300 hover:text-purple-200">
              contact@mdntech.org
            </a>
            {' '}for refund questions.
          </p>
        </details>
      </div>
    </section>
  )
}
