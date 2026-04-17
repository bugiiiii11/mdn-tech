export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PortalShell } from '@/components/portal/PortalShell'
import Link from 'next/link'

export default async function ChatKitPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  // Fetch customer's chatbots
  const { data: chatbots } = await supabase
    .from('chatbots')
    .select('id, name, status, created_at, widget_config')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  // Fetch message stats for each chatbot
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

  return (
    <PortalShell>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">ChatKit</h1>
            <p className="text-gray-400 text-sm mt-0.5">AI-powered chatbots for your website</p>
          </div>
          <Link
            href="/portal/chatkit/new"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            + New chatbot
          </Link>
        </div>

        {!chatbots || chatbots.length === 0 ? (
          <div className="bg-[#0d0d20] border border-white/5 rounded-xl px-5 py-10 text-center">
            <p className="text-gray-500 text-sm">No chatbots yet.</p>
            <Link href="/portal/chatkit/new" className="inline-block mt-3 text-sm text-purple-400 hover:text-purple-300 transition-colors">
              Create your first chatbot
            </Link>
          </div>
        ) : (
          <div className="bg-[#0d0d20] border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left text-gray-500">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Conversations</th>
                  <th className="px-4 py-3 font-medium">Messages</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {chatbots.map(bot => {
                  const stats = statsByBot[bot.id] || { conversations: 0, messages: 0 }
                  return (
                    <tr key={bot.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        <Link href={`/portal/chatkit/${bot.id}`} className="text-white hover:text-purple-300 transition-colors font-medium">
                          {bot.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
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
                      <td className="px-4 py-3 text-gray-400">{stats.conversations}</td>
                      <td className="px-4 py-3 text-gray-400">{stats.messages}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(bot.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PortalShell>
  )
}
