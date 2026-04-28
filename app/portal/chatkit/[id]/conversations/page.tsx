export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { PortalShell } from '@/components/portal/PortalShell'
import { ConversationViewer } from '@/components/portal/analytics/ConversationViewer'
import { getConversationsWithMessages } from '@/lib/portal/analytics'

interface ConversationsPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ filter?: string }>
}

export default async function ConversationsPage({
  params,
  searchParams,
}: ConversationsPageProps) {
  const { id: chatbotId } = await params
  const { filter = 'all' } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  // Fetch chatbot to verify ownership
  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('id, name, widget_config, owner_id')
    .eq('id', chatbotId)
    .single()

  if (!chatbot || chatbot.owner_id !== user.id) {
    redirect('/portal/chatkit')
  }

  const fallbackMessage =
    (chatbot.widget_config as any)?.fallback_message ||
    "I'm not sure about that. Please contact us directly for more details."

  const conversations = await getConversationsWithMessages(
    supabase,
    chatbotId,
    fallbackMessage,
    filter as 'all' | 'fallback' | 'untagged'
  )

  const filterTabs: { key: 'all' | 'fallback' | 'untagged'; label: string }[] = [
    { key: 'all', label: 'All conversations' },
    { key: 'fallback', label: 'With fallback messages' },
    { key: 'untagged', label: 'Untagged messages' },
  ]

  return (
    <PortalShell>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <Link
            href={`/portal/chatkit/${chatbot.id}`}
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors mb-3"
          >
            <ChevronLeft size={14} />
            Back to {chatbot.name}
          </Link>
          <h1 className="text-xl font-semibold text-white">{chatbot.name} — Conversations</h1>
          <p className="text-gray-400 text-sm mt-1">
            Review all conversations and rate message quality to improve your knowledge base
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 border-b border-white/5">
          {filterTabs.map(({ key, label }) => {
            const isActive = filter === key
            const href = key === 'all'
              ? `/portal/chatkit/${chatbot.id}/conversations`
              : `/portal/chatkit/${chatbot.id}/conversations?filter=${key}`
            return (
              <Link
                key={key}
                href={href}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'text-white border-purple-500'
                    : 'text-gray-500 border-transparent hover:text-gray-300'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>

        {/* Conversations list */}
        <div className="space-y-3">
          {conversations.length === 0 ? (
            <div className="bg-[#0d0d20] border border-white/5 rounded-xl px-5 py-10 text-center">
              <p className="text-gray-400 text-sm">No conversations found for this filter</p>
            </div>
          ) : (
            <ConversationViewer
              conversations={conversations}
              fallbackMessage={fallbackMessage}
              chatbotId={chatbotId}
            />
          )}
        </div>
      </div>
    </PortalShell>
  )
}
