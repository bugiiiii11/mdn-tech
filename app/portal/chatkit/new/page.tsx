export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PortalShell } from '@/components/portal/PortalShell'
import { PortalChatbotForm } from '@/components/portal/chatbots/PortalChatbotForm'

export default async function NewChatbotPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  return (
    <PortalShell>
      <div className="p-6">
        <a href="/portal/chatkit" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">← ChatKit</a>
        <h1 className="text-xl font-semibold text-white mt-2 mb-6">New chatbot</h1>
        <PortalChatbotForm userId={user.id} />
      </div>
    </PortalShell>
  )
}
