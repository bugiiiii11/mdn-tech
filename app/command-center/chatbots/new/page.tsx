export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ChatbotForm } from '@/components/command-center/chatbots/ChatbotForm'

export default async function NewChatbotPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/command-center/login')

  const { data: projects } = await supabase.from('projects').select('id, name').order('name')

  return (
    <div className="p-6">
      <a href="/command-center/chatbots" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">← Chatbots</a>
      <h1 className="text-xl font-semibold text-white mt-2 mb-6">New chatbot</h1>
      <ChatbotForm projects={projects ?? []} />
    </div>
  )
}
