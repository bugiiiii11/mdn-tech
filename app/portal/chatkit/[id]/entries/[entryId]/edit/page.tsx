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
    <PortalShell>
      <div className="p-6">
        <Link
          href={`/portal/chatkit/${chatbot.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-300 border border-white/10 hover:border-white/20 hover:text-white rounded-lg transition-colors w-fit"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          {chatbot.name}
        </Link>
        <h1 className="text-xl font-semibold text-white mt-4 mb-6">Edit KB entry</h1>
        <PortalKBEntryForm chatbotId={chatbot.id} entry={entry} />
      </div>
    </PortalShell>
  )
}
