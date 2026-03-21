export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ChatbotForm } from '@/components/command-center/chatbots/ChatbotForm'

export default async function EditChatbotPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/command-center/login')

  const [{ data: chatbot }, { data: projects }] = await Promise.all([
    supabase.from('chatbots').select('*').eq('id', params.id).single(),
    supabase.from('projects').select('id, name').order('name'),
  ])

  if (!chatbot) notFound()

  return (
    <div className="p-6">
      <a href={`/command-center/chatbots/${params.id}`} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">← {chatbot.name}</a>
      <h1 className="text-xl font-semibold text-white mt-2 mb-6">Edit chatbot</h1>
      <ChatbotForm chatbot={chatbot} projects={projects ?? []} />
    </div>
  )
}
