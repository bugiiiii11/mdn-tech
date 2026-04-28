export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { PortalShell } from '@/components/portal/PortalShell'
import { Bot, Plus, Download, MessageSquare, MessagesSquare, Hash, AlertTriangle, Activity, ChevronLeft } from 'lucide-react'
import { KBEntryList } from '@/components/command-center/chatbots/KBEntryList'
import { KBExportButton } from '@/components/command-center/chatbots/KBExportButton'
import { WidgetConfigForm } from '@/components/command-center/chatbots/WidgetConfigForm'
import { EmbedSnippet } from '@/components/command-center/chatbots/EmbedSnippet'
import { DeleteChatbotButton } from '@/components/portal/chatbots/DeleteChatbotButton'
import { UsageMeter } from '@/components/portal/UsageMeter'
import { TrendChart } from '@/components/portal/analytics/TrendChart'
import { KeywordsBar } from '@/components/portal/analytics/KeywordsBar'
import {
  getChatbotAnalytics,
  getMessagesTrend,
  getTopKeywords,
} from '@/lib/portal/analytics'

export default async function ChatbotDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { id } = await params
  const userId = user.id

  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('*')
    .eq('id', id)
    .eq('owner_id', user.id)
    .single()

  if (!chatbot) notFound()

  const fallbackMsg =
    (chatbot.widget_config as any)?.fallback_message ||
    "I'm not sure about that. Please contact us directly for more details."

  const [{ data: entries }, analytics, trend, keywords] = await Promise.all([
    supabase.from('chatbot_kb_entries').select('*').eq('chatbot_id', id).order('sort_order').order('category'),
    getChatbotAnalytics(supabase, id, fallbackMsg),
    getMessagesTrend(supabase, id, 7),
    getTopKeywords(supabase, id, 8),
  ])

  const grouped = (entries ?? []).reduce((acc: Record<string, any[]>, e) => {
    acc[e.category] = [...(acc[e.category] ?? []), e]
    return acc
  }, {})

  const kbCount = (entries ?? []).length
  const categoryCount = Object.keys(grouped).length
  const hasConversations = analytics.totalConversations > 0
  const recentMessageCount = trend.reduce((sum, p) => sum + p.count, 0)
  const showTrend = recentMessageCount > 0
  const showKeywords = keywords.length > 0

  const tiles: { label: string; value: string; icon: typeof Bot; tone: 'cyan' | 'purple' | 'amber' | 'pink' }[] = [
    { label: 'Conversations', value: `${analytics.totalConversations}`, icon: MessagesSquare, tone: 'cyan' },
    { label: 'Messages', value: `${analytics.totalMessages}`, icon: Hash, tone: 'purple' },
    { label: 'Fallback rate', value: `${analytics.fallbackRate}%`, icon: AlertTriangle, tone: 'amber' },
    { label: 'Avg msgs / conv', value: `${analytics.avgMessagesPerConv}`, icon: Activity, tone: 'pink' },
  ]

  const toneClasses: Record<typeof tiles[number]['tone'], string> = {
    cyan: 'text-cyan-300 bg-cyan-500/10',
    purple: 'text-purple-300 bg-purple-500/10',
    amber: 'text-amber-300 bg-amber-500/10',
    pink: 'text-pink-300 bg-pink-500/10',
  }

  return (
    <PortalShell>
      <div className="p-6 space-y-4 max-w-6xl mx-auto">
        {/* Back */}
        <Link
          href="/portal/chatkit"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-300 border border-white/10 hover:border-white/20 hover:text-white rounded-lg transition-colors w-fit"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          ChatKit
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">{chatbot.name}</h1>
              <span className={`inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full ${
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
              className="px-3 py-1.5 text-xs text-gray-300 border border-white/10 hover:border-white/20 hover:text-white rounded-lg transition-colors"
            >
              Edit
            </Link>
            <DeleteChatbotButton chatbotId={chatbot.id} chatbotName={chatbot.name} userId={userId} />
          </div>
        </div>

        {chatbot.description && <p className="text-gray-400 text-sm">{chatbot.description}</p>}

        {/* Activity overview: stat tiles + smart charts + actions */}
        <section className="bg-[#0d0d20] border border-white/5 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-white">Activity</h2>
            {hasConversations && (
              <div className="flex items-center gap-2">
                <Link
                  href={`/portal/chatkit/${chatbot.id}/conversations`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-gray-300 border border-white/10 hover:border-white/20 hover:text-white rounded-md transition-colors"
                >
                  <MessageSquare className="w-3 h-3" />
                  Conversations
                </Link>
                <a
                  href={`/api/portal/chatbot/${chatbot.id}/export`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-gray-300 border border-white/10 hover:border-white/20 hover:text-white rounded-md transition-colors"
                >
                  <Download className="w-3 h-3" />
                  Export
                </a>
              </div>
            )}
          </div>

          {/* Compact stat tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {tiles.map(({ label, value, icon: Icon, tone }) => (
              <div key={label} className="bg-[#0a0a14] border border-white/5 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-gray-400">{label}</span>
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center ${toneClasses[tone]}`}>
                    <Icon className="w-3 h-3" />
                  </span>
                </div>
                <p className="text-xl font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>

          {/* Charts row — only render meaningful content */}
          {hasConversations ? (
            <div className={`grid gap-3 ${showTrend && showKeywords ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
              {showTrend ? (
                <TrendChart data={trend} title="Messages — last 7 days" />
              ) : (
                <div className="bg-[#0a0a14] border border-white/5 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-300">Messages — last 7 days</p>
                  <p className="text-xs text-gray-500 mt-2">
                    No new messages this week. Most recent activity is older than 7 days.
                  </p>
                </div>
              )}
              {showKeywords ? (
                <KeywordsBar keywords={keywords} title="Top keywords" />
              ) : (
                <div className="bg-[#0a0a14] border border-white/5 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-300">Top keywords</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Not enough user messages yet to extract keywords.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#0a0a14] border border-dashed border-white/10 rounded-lg px-4 py-8 text-center">
              <p className="text-sm text-gray-300">No conversations yet</p>
              <p className="text-xs text-gray-500 mt-1">
                {chatbot.status === 'active'
                  ? 'Deploy the embed snippet below to start collecting messages.'
                  : 'Activate the chatbot and deploy the embed snippet to start collecting messages.'}
              </p>
            </div>
          )}
        </section>

        {/* Usage quota (compact, sits with overview metrics) */}
        <UsageMeter customerId={userId} product="chatkit" />

        {/* Deploy */}
        {chatbot.status === 'active' && (
          <EmbedSnippet chatbotId={chatbot.id} />
        )}

        {/* Widget Config */}
        <WidgetConfigForm chatbotId={chatbot.id} config={chatbot.widget_config ?? {}} />

        {/* Knowledge Base */}
        <section className="bg-[#0d0d20] border border-white/5 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-sm font-medium text-white">Knowledge Base</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {kbCount} {kbCount === 1 ? 'entry' : 'entries'} across {categoryCount} {categoryCount === 1 ? 'category' : 'categories'}
              </p>
            </div>
            <Link
              href={`/portal/chatkit/${chatbot.id}/entries/new`}
              className="inline-flex items-center gap-1.5 button-primary text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add entry
            </Link>
          </div>

          {kbCount === 0 ? (
            <div className="bg-[#0a0a14] border border-dashed border-white/10 rounded-lg px-5 py-10 text-center">
              <p className="text-gray-300 text-sm">Add your first KB entry</p>
              <p className="text-gray-500 text-xs mt-1">Entries like FAQ, product info, tone of voice, and policies teach your chatbot how to answer.</p>
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
        </section>
      </div>
    </PortalShell>
  )
}
