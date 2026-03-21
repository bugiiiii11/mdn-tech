export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Bot, Plus } from 'lucide-react'

export default async function ChatbotsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/command-center/login')

  const { data: chatbots } = await supabase
    .from('chatbots')
    .select(`
      id, name, client_name, type, status, description, created_at,
      projects(name),
      chatbot_kb_entries(count)
    `)
    .neq('status', 'archived')
    .order('created_at', { ascending: false })

  const typeColor = { internal: 'bg-purple-500/10 text-purple-400 border-purple-500/20', client: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' }
  const statusColor = { active: 'text-green-400', draft: 'text-yellow-400', archived: 'text-gray-500' }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Chatbots</h1>
          <p className="text-gray-400 text-sm mt-0.5">Knowledge base management per chatbot</p>
        </div>
        <Link
          href="/command-center/chatbots/new"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> New chatbot
        </Link>
      </div>

      {(chatbots ?? []).length === 0 ? (
        <div className="bg-[#0d0d20] border border-white/5 rounded-xl px-5 py-16 text-center">
          <Bot className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No chatbots yet.</p>
          <p className="text-gray-600 text-xs mt-1">Add a chatbot to start managing its knowledge base.</p>
          <Link href="/command-center/chatbots/new" className="inline-block mt-4 text-sm text-purple-400 hover:text-purple-300 transition-colors">
            Create first chatbot →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {(chatbots ?? []).map((bot: any) => {
            const entryCount = bot.chatbot_kb_entries?.[0]?.count ?? 0
            return (
              <Link
                key={bot.id}
                href={`/command-center/chatbots/${bot.id}`}
                className="bg-[#0d0d20] border border-white/5 rounded-xl p-5 hover:border-purple-500/20 transition-colors group flex items-center gap-4"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-purple-400" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-white font-medium group-hover:text-purple-300 transition-colors">{bot.name}</h2>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border capitalize ${typeColor[bot.type as keyof typeof typeColor] ?? typeColor.client}`}>
                      {bot.type}
                    </span>
                    <span className={`text-[10px] capitalize ${statusColor[bot.status as keyof typeof statusColor] ?? 'text-gray-400'}`}>
                      {bot.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    {bot.client_name && <span className="text-gray-400 text-xs">{bot.client_name}</span>}
                    {bot.projects && <span className="text-gray-600 text-xs">→ {bot.projects.name}</span>}
                    {bot.description && <span className="text-gray-600 text-xs truncate">{bot.description}</span>}
                  </div>
                </div>

                {/* KB count */}
                <div className="text-right flex-shrink-0">
                  <p className="text-white font-medium">{entryCount}</p>
                  <p className="text-gray-500 text-xs">KB entries</p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
