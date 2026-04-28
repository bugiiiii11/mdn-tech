export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PortalShell } from '@/components/portal/PortalShell'
import { ChatKitHero } from '@/components/portal/chatkit/ChatKitHero'
import { BuildKBGuide } from '@/components/portal/chatkit/BuildKBGuide'
import Link from 'next/link'
import { Plus } from 'lucide-react'

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
    .select('id, name, status, created_at, widget_config')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  const chatbotIds = chatbots?.map(b => b.id) || []
  const { data: conversations } = chatbotIds.length > 0
    ? await supabase
        .from('chat_conversations')
        .select('chatbot_id, message_count')
        .in('chatbot_id', chatbotIds)
    : { data: [] }

  const statsByBot = (conversations || []).reduce((acc: Record<string, { conversations: number; messages: number }>, conv) => {
    if (!acc[conv.chatbot_id]) acc[conv.chatbot_id] = { conversations: 0, messages: 0 }
    acc[conv.chatbot_id].conversations++
    acc[conv.chatbot_id].messages += conv.message_count || 0
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
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Your chatbots</h2>
                <Link
                  href="/portal/chatkit/new"
                  className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New
                </Link>
              </div>

              <div className="bg-[#0d0d20]/80 border border-white/[0.06] rounded-xl overflow-hidden backdrop-blur-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-left text-gray-500">
                      <th className="px-5 py-3 font-medium">Name</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium">Conversations</th>
                      <th className="px-5 py-3 font-medium">Messages</th>
                      <th className="px-5 py-3 font-medium">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chatbots.map(bot => {
                      const stats = statsByBot[bot.id] || { conversations: 0, messages: 0 }
                      return (
                        <tr key={bot.id} className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.02] transition-colors">
                          <td className="px-5 py-4">
                            <Link href={`/portal/chatkit/${bot.id}`} className="text-white hover:text-purple-300 transition-colors font-medium">
                              {bot.name}
                            </Link>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              bot.status === 'active'
                                ? 'bg-green-500/10 text-green-400'
                                : bot.status === 'draft'
                                ? 'bg-yellow-500/10 text-yellow-400'
                                : 'bg-gray-500/10 text-gray-400'
                            }`}>
                              {bot.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-gray-400">{stats.conversations}</td>
                          <td className="px-5 py-4 text-gray-400">{stats.messages}</td>
                          <td className="px-5 py-4 text-gray-500">
                            {new Date(bot.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <BuildKBGuide collapsed />
          </>
        )}
      </div>
    </PortalShell>
  )
}
