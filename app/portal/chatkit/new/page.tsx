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
    <PortalShell variant="marketing">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <Link
          href="/portal/chatkit"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-300 border border-white/10 hover:border-white/20 hover:text-white rounded-lg transition-colors w-fit mb-6"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          ChatKit
        </Link>
        <header className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400/80 mb-2">
            ChatKit
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            New chatbot
          </h1>
          <p className="text-gray-400 text-sm mt-2 max-w-xl">
            Name it, set status, and add a description. You can edit any of this
            later, then drop in your knowledge base.
          </p>
        </header>
        <PortalChatbotForm userId={user.id} />
      </div>
    </PortalShell>
  )
}
