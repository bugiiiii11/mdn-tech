export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ConversationThread } from '@/components/command-center/chatbots/ConversationThread'

export default async function ConversationDetailPage({
  params,
}: {
  params: Promise<{ id: string; convId: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/command-center/login')

  const { id, convId } = await params

  const [{ data: chatbot }, { data: conversation }, { data: messages }] = await Promise.all([
    supabase.from('chatbots').select('id, name').eq('id', id).single(),
    supabase.from('chat_conversations').select('*').eq('id', convId).single(),
    supabase.from('chat_messages').select('*').eq('conversation_id', convId).order('created_at', { ascending: true }),
  ])

  if (!chatbot || !conversation) notFound()

  return (
    <div className="p-6 space-y-5 max-w-3xl">
      <Link href={`/command-center/chatbots/${id}/conversations`} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
        ← Conversations
      </Link>

      <div>
        <h1 className="text-xl font-semibold text-white">Conversation</h1>
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
          <span>Visitor: {conversation.visitor_id?.slice(0, 12)}...</span>
          {conversation.source_url && <span>From: {conversation.source_url}</span>}
          <span>{conversation.message_count} messages</span>
          <span>Started: {new Date(conversation.started_at).toLocaleString()}</span>
        </div>
      </div>

      <ConversationThread messages={messages ?? []} />
    </div>
  )
}
