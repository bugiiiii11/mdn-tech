export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Bot, Plus, MessageCircle, Users, DollarSign } from 'lucide-react'

// Haiku 4.5 pricing per token
const INPUT_COST_PER_TOKEN = 0.8 / 1_000_000   // $0.80/MTok
const OUTPUT_COST_PER_TOKEN = 4.0 / 1_000_000   // $4.00/MTok

function formatCost(cost: number): string {
  if (cost === 0) return '$0.00'
  if (cost < 0.01) return `$${cost.toFixed(4)}`
  return `$${cost.toFixed(2)}`
}

function timeAgo(date: string | null): string {
  if (!date) return '—'
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return `${Math.floor(days / 30)}mo ago`
}

export default async function ChatbotsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/command-center/login')

  // Fetch chatbots, conversations, and message token stats in parallel
  const [{ data: chatbots }, { data: conversations }, { data: messages }] = await Promise.all([
    supabase
      .from('chatbots')
      .select(`
        id, name, client_name, type, status, description, created_at,
        projects(name),
        chatbot_kb_entries(count)
      `)
      .neq('status', 'archived')
      .order('created_at', { ascending: false }),
    supabase
      .from('chat_conversations')
      .select('chatbot_id, visitor_id, message_count, last_message_at'),
    supabase
      .from('chat_messages')
      .select('chatbot_id, input_tokens, output_tokens')
      .eq('role', 'assistant'),
  ])

  // Aggregate stats per chatbot
  type BotStats = {
    conversations: number
    messages: number
    uniqueVisitors: number
    totalInputTokens: number
    totalOutputTokens: number
    lastActive: string | null
  }

  const statsMap = new Map<string, BotStats>()

  for (const bot of chatbots ?? []) {
    statsMap.set(bot.id, {
      conversations: 0, messages: 0, uniqueVisitors: 0,
      totalInputTokens: 0, totalOutputTokens: 0, lastActive: null,
    })
  }

  // Aggregate conversations
  const visitorSets = new Map<string, Set<string>>()
  for (const conv of conversations ?? []) {
    const stats = statsMap.get(conv.chatbot_id)
    if (!stats) continue
    stats.conversations++
    stats.messages += conv.message_count ?? 0
    if (!visitorSets.has(conv.chatbot_id)) visitorSets.set(conv.chatbot_id, new Set())
    visitorSets.get(conv.chatbot_id)!.add(conv.visitor_id)
    if (!stats.lastActive || (conv.last_message_at && conv.last_message_at > stats.lastActive)) {
      stats.lastActive = conv.last_message_at
    }
  }

  visitorSets.forEach((visitors, botId) => {
    const stats = statsMap.get(botId)
    if (stats) stats.uniqueVisitors = visitors.size
  })

  // Aggregate tokens
  for (const msg of messages ?? []) {
    const stats = statsMap.get(msg.chatbot_id)
    if (!stats) continue
    stats.totalInputTokens += msg.input_tokens ?? 0
    stats.totalOutputTokens += msg.output_tokens ?? 0
  }

  // Global totals
  let totalConversations = 0
  let totalMessages = 0
  let totalCost = 0
  let totalVisitors = 0
  statsMap.forEach((stats) => {
    totalConversations += stats.conversations
    totalMessages += stats.messages
    totalVisitors += stats.uniqueVisitors
    totalCost += stats.totalInputTokens * INPUT_COST_PER_TOKEN + stats.totalOutputTokens * OUTPUT_COST_PER_TOKEN
  })

  const typeColor: Record<string, string> = {
    internal: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    client: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  }
  const statusDot: Record<string, string> = {
    active: 'bg-green-500',
    draft: 'bg-yellow-500',
    archived: 'bg-gray-500',
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Chatbots</h1>
          <p className="text-gray-400 text-sm mt-0.5">{(chatbots ?? []).length} total</p>
        </div>
        <Link
          href="/command-center/chatbots/new"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> New chatbot
        </Link>
      </div>

      {/* Summary cards */}
      {(chatbots ?? []).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#0d0d20] border border-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <MessageCircle className="w-3.5 h-3.5 text-cyan-400" />
              <p className="text-xs text-gray-400">Total Messages</p>
            </div>
            <p className="text-2xl font-semibold text-white">{totalMessages.toLocaleString()}</p>
          </div>
          <div className="bg-[#0d0d20] border border-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-3.5 h-3.5 text-green-400" />
              <p className="text-xs text-gray-400">Unique Visitors</p>
            </div>
            <p className="text-2xl font-semibold text-white">{totalVisitors.toLocaleString()}</p>
          </div>
          <div className="bg-[#0d0d20] border border-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Bot className="w-3.5 h-3.5 text-purple-400" />
              <p className="text-xs text-gray-400">Conversations</p>
            </div>
            <p className="text-2xl font-semibold text-white">{totalConversations.toLocaleString()}</p>
          </div>
          <div className="bg-[#0d0d20] border border-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-yellow-400" />
              <p className="text-xs text-gray-400">Total API Cost</p>
            </div>
            <p className="text-2xl font-semibold text-white">{formatCost(totalCost)}</p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#0d0d20] border border-white/5 rounded-xl overflow-hidden">
        {(chatbots ?? []).length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Bot className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No chatbots yet.</p>
            <p className="text-gray-600 text-xs mt-1">Add a chatbot to start managing its knowledge base.</p>
            <Link href="/command-center/chatbots/new" className="inline-block mt-4 text-sm text-purple-400 hover:text-purple-300 transition-colors">
              Create first chatbot →
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs border-b border-white/5">
                <th className="px-5 py-3 font-normal">Chatbot</th>
                <th className="px-4 py-3 font-normal">Client</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-4 py-3 font-normal text-right">Messages</th>
                <th className="px-4 py-3 font-normal text-right">Visitors</th>
                <th className="px-4 py-3 font-normal text-right">Convos</th>
                <th className="px-4 py-3 font-normal text-right">KB</th>
                <th className="px-4 py-3 font-normal text-right">API Cost</th>
                <th className="px-4 py-3 font-normal text-right">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {(chatbots ?? []).map((bot: any) => {
                const entryCount = bot.chatbot_kb_entries?.[0]?.count ?? 0
                const stats = statsMap.get(bot.id)!
                const cost = stats.totalInputTokens * INPUT_COST_PER_TOKEN + stats.totalOutputTokens * OUTPUT_COST_PER_TOKEN

                return (
                  <tr key={bot.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3">
                      <a href={`/command-center/chatbots/${bot.id}`} className="text-white hover:text-purple-300 transition-colors font-medium">
                        {bot.name}
                      </a>
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-medium border capitalize ${typeColor[bot.type] ?? typeColor.client}`}>
                        {bot.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{bot.client_name ?? bot.projects?.name ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDot[bot.status] ?? statusDot.draft}`} />
                        <span className="text-xs text-gray-300 capitalize">{bot.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={stats.messages > 0 ? 'text-white' : 'text-gray-600'}>{stats.messages.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={stats.uniqueVisitors > 0 ? 'text-white' : 'text-gray-600'}>{stats.uniqueVisitors.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={stats.conversations > 0 ? 'text-white' : 'text-gray-600'}>{stats.conversations.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={entryCount > 0 ? 'text-white' : 'text-gray-600'}>{entryCount}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={cost > 0 ? 'text-yellow-400' : 'text-gray-600'}>{formatCost(cost)}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-400 text-xs">{timeAgo(stats.lastActive)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
