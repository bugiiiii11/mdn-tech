export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
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
        <Link
          href={`/portal/chatkit/${chatbot.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-300 border border-white/10 hover:border-white/20 hover:text-white rounded-lg transition-colors w-fit"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          {chatbot.name}
        </Link>
        <h1 className="text-xl font-semibold text-white mt-4 mb-6">Edit chatbot</h1>
        <PortalChatbotForm chatbot={chatbot} userId={user.id} />
      </div>
    </PortalShell>
  )
}
