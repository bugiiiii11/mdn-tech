export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { PortalShell } from '@/components/portal/PortalShell'
import { PortalChatbotForm } from '@/components/portal/chatbots/PortalChatbotForm'

export default async function NewChatbotPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  return (
    <PortalShell>
      <div className="p-6">
        <Link
          href="/portal/chatkit"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-300 border border-white/10 hover:border-white/20 hover:text-white rounded-lg transition-colors w-fit"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          ChatKit
        </Link>
        <h1 className="text-xl font-semibold text-white mt-4 mb-6">New chatbot</h1>
        <PortalChatbotForm userId={user.id} />
      </div>
    </PortalShell>
  )
}
