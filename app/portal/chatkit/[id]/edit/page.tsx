export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { PortalShell } from '@/components/portal/PortalShell'
import { PortalChatbotForm } from '@/components/portal/chatbots/PortalChatbotForm'

export default async function EditChatbotPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { id } = await params
  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('*')
    .eq('id', id)
    .eq('owner_id', user.id)
    .single()

  if (!chatbot) notFound()

  return (
    <PortalShell>
      <div className="p-6">
        <a href={`/portal/chatkit/${chatbot.id}`} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">← {chatbot.name}</a>
        <h1 className="text-xl font-semibold text-white mt-2 mb-6">Edit chatbot</h1>
        <PortalChatbotForm chatbot={chatbot} userId={user.id} />
      </div>
    </PortalShell>
  )
}
