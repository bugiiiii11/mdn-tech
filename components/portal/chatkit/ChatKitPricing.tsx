import { Check, Sparkles, MessageSquare, ShieldCheck } from 'lucide-react'

export function ChatKitPricing() {
  return (
    <section className="space-y-8 pt-4">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-xs text-cyan-400/80 font-mono uppercase tracking-wider mb-3">
          Pricing
        </p>
        <h2 className="text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 leading-tight">
          Pay once. Use forever.
        </h2>
        <p className="text-gray-400 text-sm md:text-base mt-3">
          No subscriptions. No surprise bills. Try every chatbot for free, then buy credits when you&apos;re ready —
          they never expire.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
        <div className="bg-[#0d0d20]/80 border border-white/[0.08] rounded-2xl p-7 space-y-5 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-300" />
            <span className="text-xs text-cyan-200 uppercase tracking-wider font-mono">Free trial</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-white">$0</span>
            <span className="text-gray-400 text-sm">/ chatbot</span>
          </div>

          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2 text-gray-200">
              <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>50 message credits per chatbot</span>
            </li>
            <li className="flex items-start gap-2 text-gray-200">
              <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Full knowledge base — unlimited entries</span>
            </li>
            <li className="flex items-start gap-2 text-gray-200">
              <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Embed on any site, any framework</span>
            </li>
            <li className="flex items-start gap-2 text-gray-200">
              <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Conversation history + export</span>
            </li>
          </ul>

          <p className="text-xs text-gray-500 text-center pt-1">
            Already included with every new chatbot.
          </p>
        </div>

        <div className="bg-[#0d0d20]/80 border border-purple-400/30 rounded-2xl p-7 space-y-5 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative space-y-5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span className="text-xs text-purple-200 uppercase tracking-wider font-mono">Pro pack</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-white">$19</span>
              <span className="text-gray-400 text-sm">/ pack</span>
            </div>

            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2 text-gray-200">
                <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>1,000 message credits per chatbot</span>
              </li>
              <li className="flex items-start gap-2 text-gray-200">
                <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Credits never expire</span>
              </li>
              <li className="flex items-start gap-2 text-gray-200">
                <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>One-time payment, no subscription</span>
              </li>
              <li className="flex items-start gap-2 text-gray-200">
                <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Stack as many packs as you need</span>
              </li>
            </ul>

            <p className="text-xs text-gray-500 text-center pt-1">
              Buy from any chatbot&apos;s detail page → Buy more.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto bg-[#0d0d20]/60 border border-white/[0.06] rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <h3 className="text-white font-medium text-sm">Why prepaid credits?</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              A subscription that auto-bills can sting if a popular site burns through messages and your card later
              fails. Prepaid credits put you in control — your chatbot pauses gracefully when credits run out, and you
              buy more whenever you&apos;re ready. No invoices, no debt, no surprises.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        <details className="group bg-[#0d0d20]/60 border border-white/[0.06] rounded-xl p-4 backdrop-blur-sm">
          <summary className="text-sm text-white cursor-pointer list-none flex items-center justify-between">
            <span>Are credits per chatbot or per account?</span>
            <span className="text-gray-500 group-open:rotate-180 transition-transform">⌄</span>
          </summary>
          <p className="text-xs text-gray-400 mt-3 leading-relaxed">
            Per chatbot. Each chatbot you create gets its own 50 free trial messages, and you buy Pro packs separately
            for each one. That way a busy chatbot can&apos;t drain credits from a quieter one.
          </p>
        </details>

        <details className="group bg-[#0d0d20]/60 border border-white/[0.06] rounded-xl p-4 backdrop-blur-sm">
          <summary className="text-sm text-white cursor-pointer list-none flex items-center justify-between">
            <span>What counts as a message?</span>
            <span className="text-gray-500 group-open:rotate-180 transition-transform">⌄</span>
          </summary>
          <p className="text-xs text-gray-400 mt-3 leading-relaxed">
            One credit per chatbot reply to a visitor. Visitor questions don&apos;t count, only the chatbot&apos;s
            answers. Replies are capped at ~225 words so each credit goes a long way.
          </p>
        </details>

        <details className="group bg-[#0d0d20]/60 border border-white/[0.06] rounded-xl p-4 backdrop-blur-sm">
          <summary className="text-sm text-white cursor-pointer list-none flex items-center justify-between">
            <span>What happens when credits run out?</span>
            <span className="text-gray-500 group-open:rotate-180 transition-transform">⌄</span>
          </summary>
          <p className="text-xs text-gray-400 mt-3 leading-relaxed">
            The widget pauses on visitor sites until you buy another pack. No data is lost — your knowledge base,
            conversation history, and embed snippet stay intact. Top up and the chatbot resumes immediately.
          </p>
        </details>

        <details className="group bg-[#0d0d20]/60 border border-white/[0.06] rounded-xl p-4 backdrop-blur-sm">
          <summary className="text-sm text-white cursor-pointer list-none flex items-center justify-between">
            <span>Is there a refund policy?</span>
            <span className="text-gray-500 group-open:rotate-180 transition-transform">⌄</span>
          </summary>
          <p className="text-xs text-gray-400 mt-3 leading-relaxed">
            Unused credits are refundable within 14 days of purchase. Reach us at{' '}
            <a href="mailto:contact@mdntech.org" className="text-purple-300 hover:text-purple-200">
              contact@mdntech.org
            </a>
            .
          </p>
        </details>
      </div>
    </section>
  )
}
