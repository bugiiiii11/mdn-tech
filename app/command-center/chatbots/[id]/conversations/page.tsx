export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ConversationList } from '@/components/command-center/chatbots/ConversationList'

export default async function ConversationsPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/command-center/login')

  const { id } = await params
  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('id, name')
    .eq('id', id)
    .single()

  if (!chatbot) notFound()

  const { data: conversations } = await supabase
    .from('chat_conversations')
    .select('*')
    .eq('chatbot_id', id)
    .order('last_message_at', { ascending: false })
    .limit(100)

  return (
    <div className="p-6 space-y-5">
      <Link href={`/command-center/chatbots/${id}`} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
        ← {chatbot.name}
      </Link>
      <h1 className="text-xl font-semibold text-white">Conversations</h1>
      <ConversationList chatbotId={id} conversations={conversations ?? []} />
    </div>
  )
}
