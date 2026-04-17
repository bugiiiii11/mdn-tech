export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
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
    redirect('/portal/dashboard')
  }

  const fallbackMessage =
    (chatbot.widget_config as any)?.fallback_message ||
    "I'm not sure about that. Please contact us directly for more details."

  // Fetch conversations with filtering
  const conversations = await getConversationsWithMessages(
    supabase,
    chatbotId,
    fallbackMessage,
    filter as 'all' | 'fallback' | 'untagged'
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Link
            href="/portal/dashboard"
            className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 mb-4"
          >
            <ChevronLeft size={16} />
            Back to dashboard
          </Link>
          <h1 className="text-2xl font-semibold text-white">{chatbot.name} — Conversations</h1>
          <p className="text-gray-400 text-sm mt-1">
            Review all conversations and rate message quality to improve your knowledge base
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 border-b border-gray-800">
          {(['all', 'fallback', 'untagged'] as const).map(filterOption => {
            const filterLabel = {
              all: 'All conversations',
              fallback: 'With fallback messages',
              untagged: 'Untagged messages',
            }[filterOption]

            return (
              <button
                key={filterOption}
                onClick={() => {
                  const params = new URLSearchParams(filterOption === 'all' ? '' : `filter=${filterOption}`)
                  window.location.search = params.toString()
                }}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  filter === filterOption
                    ? 'text-white border-purple-500'
                    : 'text-gray-500 border-transparent hover:text-gray-400'
                }`}
              >
                {filterLabel}
              </button>
            )
          })}
        </div>

        {/* Conversations list */}
        <div className="space-y-3">
          {conversations.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-400">No conversations found for this filter</p>
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
    </div>
  )
}
