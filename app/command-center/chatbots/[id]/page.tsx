export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Bot, Plus, MessageCircle } from 'lucide-react'
import { KBEntryList } from '@/components/command-center/chatbots/KBEntryList'
import { KBExportButton } from '@/components/command-center/chatbots/KBExportButton'
import { WidgetConfigForm } from '@/components/command-center/chatbots/WidgetConfigForm'
import { EmbedSnippet } from '@/components/command-center/chatbots/EmbedSnippet'

const typeColor = {
  internal: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  client: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
}

export default async function ChatbotDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/command-center/login')

  const { id } = await params
  const [{ data: chatbot }, { data: entries }, { count: convCount }, { count: msgCount }] = await Promise.all([
    supabase.from('chatbots').select('*, projects(name)').eq('id', id).single(),
    supabase.from('chatbot_kb_entries').select('*').eq('chatbot_id', id).order('sort_order').order('category'),
    supabase.from('chat_conversations').select('*', { count: 'exact', head: true }).eq('chatbot_id', id),
    supabase.from('chat_messages').select('*', { count: 'exact', head: true }).eq('chatbot_id', id),
  ])

  if (!chatbot) notFound()

  // Group entries by category
  const grouped = (entries ?? []).reduce((acc: Record<string, any[]>, e) => {
    acc[e.category] = [...(acc[e.category] ?? []), e]
    return acc
  }, {})

  const totalWords = (entries ?? []).reduce((sum, e) => sum + (e.content?.split(/\s+/).length ?? 0), 0)

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <a href="/command-center/chatbots" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">← Chatbots</a>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-white">{chatbot.name}</h1>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border capitalize ${typeColor[chatbot.type as keyof typeof typeColor] ?? typeColor.client}`}>
                {chatbot.type}
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-0.5">
              {chatbot.client_name ?? chatbot.projects?.name ?? 'No client'}
              {chatbot.description && ` · ${chatbot.description}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <KBExportButton chatbotName={chatbot.name} entries={entries ?? []} />
          <Link
            href={`/command-center/chatbots/${chatbot.id}/edit`}
            className="px-3 py-1.5 text-xs text-gray-400 border border-white/10 hover:border-white/20 hover:text-white rounded-lg transition-colors"
          >
            Edit
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
        <div className="bg-[#0d0d20] border border-white/5 rounded-xl p-4">
          <p className="text-xs text-gray-400">KB entries</p>
          <p className="text-2xl font-semibold text-white mt-1">{(entries ?? []).length}</p>
        </div>
        <div className="bg-[#0d0d20] border border-white/5 rounded-xl p-4">
          <p className="text-xs text-gray-400">Categories</p>
          <p className="text-2xl font-semibold text-white mt-1">{Object.keys(grouped).length}</p>
        </div>
        <div className="bg-[#0d0d20] border border-white/5 rounded-xl p-4">
          <p className="text-xs text-gray-400">Total words</p>
          <p className="text-2xl font-semibold text-white mt-1">{totalWords.toLocaleString()}</p>
        </div>
        <div className="bg-[#0d0d20] border border-white/5 rounded-xl p-4">
          <p className="text-xs text-gray-400">Conversations</p>
          <p className="text-2xl font-semibold text-white mt-1">{convCount ?? 0}</p>
        </div>
        <div className="bg-[#0d0d20] border border-white/5 rounded-xl p-4">
          <p className="text-xs text-gray-400">Messages</p>
          <p className="text-2xl font-semibold text-white mt-1">{msgCount ?? 0}</p>
        </div>
      </div>

      {/* Conversations link */}
      {(convCount ?? 0) > 0 && (
        <Link
          href={`/command-center/chatbots/${chatbot.id}/conversations`}
          className="flex items-center gap-2 px-4 py-3 bg-[#0d0d20] border border-white/5 rounded-xl hover:border-purple-500/20 transition-colors group"
        >
          <MessageCircle className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
            View all conversations ({convCount})
          </span>
          <span className="text-gray-600 ml-auto text-xs">→</span>
        </Link>
      )}

      {/* Deploy */}
      {chatbot.status === 'active' && (
        <EmbedSnippet chatbotId={chatbot.id} />
      )}

      {/* Widget Config */}
      <WidgetConfigForm chatbotId={chatbot.id} config={chatbot.widget_config ?? {}} />

      {/* KB entries by category */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-white">Knowledge Base</h2>
          <Link
            href={`/command-center/chatbots/${chatbot.id}/entries/new`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-lg text-xs hover:bg-purple-500/20 transition-colors"
          >
            <Plus className="w-3 h-3" /> Add entry
          </Link>
        </div>

        {(entries ?? []).length === 0 ? (
          <div className="bg-[#0d0d20] border border-white/5 rounded-xl px-5 py-12 text-center">
            <p className="text-gray-500 text-sm">No knowledge base entries yet.</p>
            <p className="text-gray-600 text-xs mt-1">Add entries like FAQ, product info, tone of voice, policies.</p>
            <Link
              href={`/command-center/chatbots/${chatbot.id}/entries/new`}
              className="inline-block mt-4 text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              Add first entry →
            </Link>
          </div>
        ) : (
          <KBEntryList chatbotId={chatbot.id} grouped={grouped} />
        )}
      </div>
    </div>
  )
}
