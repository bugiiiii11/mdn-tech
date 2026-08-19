export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { PortalShell } from '@/components/portal/PortalShell'
import { PortalKBEntryForm } from '@/components/portal/chatbots/PortalKBEntryForm'

export default async function EditEntryPage({ params }: { params: Promise<{ id: string; entryId: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { id, entryId } = await params

  const [{ data: chatbot }, { data: entry }] = await Promise.all([
    supabase
      .from('chatbots')
      .select('id, name')
      .eq('id', id)
      .eq('owner_id', user.id)
      .single(),
    supabase
      .from('chatbot_kb_entries')
      .select('*')
      .eq('id', entryId)
      .eq('chatbot_id', id)
      .single(),
  ])

  if (!chatbot || !entry) notFound()

  return (
    <PortalShell variant="marketing">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <Link
          href={`/portal/chatkit/${chatbot.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-300 border border-white/10 hover:border-white/20 hover:text-white rounded-lg transition-colors w-fit mb-6"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          {chatbot.name}
        </Link>
        <header className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400/80 mb-2">
            {chatbot.name} · Knowledge base
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Edit entry
          </h1>
        </header>
        <PortalKBEntryForm chatbotId={chatbot.id} entry={entry} />
      </div>
    </PortalShell>
  )
}
