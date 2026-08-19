export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PortalShell } from '@/components/portal/PortalShell'
import { ChatKitHero } from '@/components/portal/chatkit/ChatKitHero'
import { BuildKBGuide } from '@/components/portal/chatkit/BuildKBGuide'
import { ChatKitPricing } from '@/components/portal/chatkit/ChatKitPricing'
import Link from 'next/link'
import { Bot } from 'lucide-react'

export default async function ChatKitPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: customer } = await supabase
    .from('customers')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (!customer) redirect('/portal/login')

  const { data: chatbots } = await supabase
    .from('chatbots')
    .select('id, name, status, created_at, widget_config, messages_used')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  // Conversations table is only used here to count chats — message totals come
  // from chatbots.messages_used (assistant replies = credits) so the listing
  // matches the detail-page Activity tile and the credit counter.
  const chatbotIds = chatbots?.map(b => b.id) || []
  const { data: conversations } = chatbotIds.length > 0
    ? await supabase
        .from('chat_conversations')
        .select('chatbot_id')
        .in('chatbot_id', chatbotIds)
    : { data: [] }

  const conversationCountByBot = (conversations || []).reduce<Record<string, number>>((acc, conv) => {
    acc[conv.chatbot_id] = (acc[conv.chatbot_id] || 0) + 1
    return acc
  }, {})

  const isEmpty = !chatbots || chatbots.length === 0

  return (
    <PortalShell variant="marketing">
      <ChatKitHero />

      <div className="max-w-6xl mx-auto px-4 md:px-8 pb-20 space-y-12">
        {isEmpty ? (
          <BuildKBGuide />
        ) : (
          <>
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-white">Your chatbots</h2>

              <div className="space-y-2">
                {chatbots.map(bot => {
                  const conversationsCount = conversationCountByBot[bot.id] || 0
                  const messagesCount = bot.messages_used ?? 0
                  const statusClass =
                    bot.status === 'active'
                      ? 'bg-green-500/10 text-green-400'
                      : bot.status === 'draft'
                        ? 'bg-yellow-500/10 text-yellow-400'
                        : 'bg-gray-500/10 text-gray-400'
                  return (
                    <Link
                      key={bot.id}
                      href={`/portal/chatkit/${bot.id}`}
                      className="group block bg-[#0d0d20]/80 border border-white/[0.08] hover:border-purple-400/40 hover:bg-[#0d0d20] rounded-xl backdrop-blur-sm transition-all"
                    >
                      <div className="flex items-center justify-between gap-4 px-5 py-4 flex-wrap">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-purple-300" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-white group-hover:text-purple-200 transition-colors truncate">
                              {bot.name}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full ${statusClass}`}>
                                {bot.status}
                              </span>
                              <span className="text-[11px] text-gray-500">
                                Created {new Date(bot.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-right">
                          <div>
                            <div className="text-sm font-semibold text-white">{conversationsCount}</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">
                              {conversationsCount === 1 ? 'Conv' : 'Convs'}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">{messagesCount}</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">
                              Messages
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>

            <BuildKBGuide collapsed />
          </>
        )}

        <ChatKitPricing />
      </div>
    </PortalShell>
  )
}
