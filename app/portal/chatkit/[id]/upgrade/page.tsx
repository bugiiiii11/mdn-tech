export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { PortalShell } from '@/components/portal/PortalShell'
import { ChevronLeft, Sparkles, Check } from 'lucide-react'
import { BuyCreditsButton } from '@/components/portal/chatkit/BuyCreditsButton'

export default async function UpgradePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { id } = await params

  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('id, name, messages_used, credits_purchased, plan')
    .eq('id', id)
    .eq('owner_id', user.id)
    .maybeSingle()

  if (!chatbot) notFound()

  const credits = chatbot.credits_purchased ?? 0
  const used = chatbot.messages_used ?? 0
  const total = 50 + credits
  const remaining = Math.max(0, total - used)
  const isLimitReached = used >= total

  return (
    <PortalShell variant="marketing">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 space-y-8">
        <Link
          href={`/portal/chatkit/${id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-300 border border-white/10 hover:border-white/20 hover:text-white rounded-lg transition-colors w-fit"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Back to {chatbot.name}
        </Link>

        <div>
          <p className="text-xs text-cyan-400/80 font-mono uppercase tracking-wider mb-2">Buy credits</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Keep <span className="text-purple-300">{chatbot.name}</span> live.
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            {used.toLocaleString()} / {total.toLocaleString()} messages used.{' '}
            {isLimitReached ? 'Widget paused.' : `${remaining.toLocaleString()} remaining.`} Credits never expire.
          </p>
        </div>

        <div className="bg-[#0d0d20]/80 border border-purple-400/30 rounded-2xl p-6 md:p-8 space-y-5 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
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
              <li className="flex items-center gap-2 text-gray-200">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>1,000 message credits</span>
              </li>
              <li className="flex items-center gap-2 text-gray-200">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>Credits never expire</span>
              </li>
              <li className="flex items-center gap-2 text-gray-200">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>One-time payment, no subscription</span>
              </li>
              <li className="flex items-center gap-2 text-gray-200">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>Stack as many packs as you need</span>
              </li>
            </ul>

            <BuyCreditsButton chatbotId={id} />

            <p className="text-xs text-gray-500 text-center leading-relaxed">
              Mock checkout for now — credits are granted instantly so you can verify the flow end-to-end.
              Stripe payment goes live the moment our account is activated.
            </p>
          </div>
        </div>

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
