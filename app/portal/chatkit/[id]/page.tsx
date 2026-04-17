export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { PortalShell } from '@/components/portal/PortalShell'
import { Bot, Plus, MessageCircle, Trash2 } from 'lucide-react'
import { KBEntryList } from '@/components/command-center/chatbots/KBEntryList'
import { KBExportButton } from '@/components/command-center/chatbots/KBExportButton'
import { WidgetConfigForm } from '@/components/command-center/chatbots/WidgetConfigForm'
import { EmbedSnippet } from '@/components/command-center/chatbots/EmbedSnippet'
import { DeleteChatbotButton } from '@/components/portal/chatbots/DeleteChatbotButton'
import { UsageMeter } from '@/components/portal/UsageMeter'

export default async function ChatbotDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { id } = await params
  const userId = user.id

  const [{ data: chatbot }, { data: entries }, { count: convCount }, { count: msgCount }] = await Promise.all([
    supabase.from('chatbots').select('*').eq('id', id).eq('owner_id', user.id).single(),
    supabase.from('chatbot_kb_entries').select('*').eq('chatbot_id', id).order('sort_order').order('category'),
    supabase.from('chat_conversations').select('*', { count: 'exact', head: true }).eq('chatbot_id', id),
    supabase.from('chat_messages').select('*', { count: 'exact', head: true }).eq('chatbot_id', id),
  ])

  if (!chatbot) notFound()

  const grouped = (entries ?? []).reduce((acc: Record<string, any[]>, e) => {
    acc[e.category] = [...(acc[e.category] ?? []), e]
    return acc
  }, {})

  const totalWords = (entries ?? []).reduce((sum, e) => sum + (e.content?.split(/\s+/).length ?? 0), 0)

  return (
    <PortalShell>
      <div className="p-6 space-y-5">
        {/* Header */}
        <a href="/portal/chatkit" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">← ChatKit</a>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">{chatbot.name}</h1>
              <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                chatbot.status === 'active'
                  ? 'bg-green-500/10 text-green-400'
                  : chatbot.status === 'draft'
                  ? 'bg-yellow-500/10 text-yellow-400'
                  : 'bg-gray-500/10 text-gray-400'
              }`}>
                {chatbot.status}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <KBExportButton chatbotName={chatbot.name} entries={entries ?? []} />
            <Link
              href={`/portal/chatkit/${chatbot.id}/edit`}
              className="px-3 py-1.5 text-xs text-gray-400 border border-white/10 hover:border-white/20 hover:text-white rounded-lg transition-colors"
            >
              Edit
            </Link>
            <DeleteChatbotButton chatbotId={chatbot.id} chatbotName={chatbot.name} userId={userId} />
          </div>
        </div>

        {chatbot.description && <p className="text-gray-400 text-sm">{chatbot.description}</p>}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#0d0d20] border border-white/5 rounded-xl p-4">
            <p className="text-xs text-gray-400">KB entries</p>
            <p className="text-2xl font-semibold text-white mt-1">{(entries ?? []).length}</p>
          </div>
          <div className="bg-[#0d0d20] border border-white/5 rounded-xl p-4">
            <p className="text-xs text-gray-400">Categories</p>
            <p className="text-2xl font-semibold text-white mt-1">{Object.keys(grouped).length}</p>
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

        {/* Usage Meter */}
        <UsageMeter customerId={userId} product="chatkit" />

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
              href={`/portal/chatkit/${chatbot.id}/entries/new`}
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
                href={`/portal/chatkit/${chatbot.id}/entries/new`}
                className="inline-block mt-4 text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                Add first entry →
              </Link>
            </div>
          ) : (
            <KBEntryList chatbotId={chatbot.id} grouped={grouped} basePath="/portal/chatkit" />
          )}
        </div>
      </div>
    </PortalShell>
  )
}
