export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Sparkles } from 'lucide-react'
import { PortalShell } from '@/components/portal/PortalShell'
import { PortalChatbotForm } from '@/components/portal/chatbots/PortalChatbotForm'
import { chatbotLimit } from '@/lib/portal/plans'

export default async function NewChatbotPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const [{ data: customer }, { count: existingCount }] = await Promise.all([
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

  const limit = chatbotLimit(customer?.extra_chatbot_slots ?? 0)
  const currentCount = existingCount ?? 0
  const atLimit = currentCount >= limit

  return (
    <PortalShell variant="marketing">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <Link
          href="/portal/chatkit"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-300 border border-white/10 hover:border-white/20 hover:text-white rounded-lg transition-colors w-fit mb-6"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          ChatKit
        </Link>
        <header className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400/80 mb-2">
            ChatKit
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            New chatbot
          </h1>
          <p className="text-gray-400 text-sm mt-2 max-w-xl">
            Name it, set status, and add a description. You can edit any of this
            later, then drop in your knowledge base.
          </p>
        </header>

        {atLimit ? (
          <section className="bg-[#0d0d20]/80 border border-purple-400/30 rounded-2xl p-6 md:p-8 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative space-y-4 max-w-xl">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-300" />
                <span className="text-xs text-purple-200 uppercase tracking-wider font-mono">
                  Chatbot limit reached
                </span>
              </div>
              <h2 className="text-xl font-semibold text-white">
                You&apos;re using {currentCount} of {limit}{' '}
                {limit === 1 ? 'chatbot' : 'chatbots'}.
              </h2>
              <p className="text-sm text-gray-400">
                Add another chatbot slot to your account — a one-time{' '}
                <span className="text-purple-300 font-medium">$49</span> unlock, no subscription.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/portal/upgrade"
                  className="inline-flex items-center gap-1.5 button-primary text-white text-sm px-4 py-2 rounded-lg"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Add a chatbot
                </Link>
                <Link
                  href="/portal/chatkit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-gray-300 border border-white/10 hover:border-white/20 hover:text-white rounded-lg transition-colors"
                >
                  Back to ChatKit
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <PortalChatbotForm userId={user.id} />
        )}
      </div>
    </PortalShell>
  )
}
