export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
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
        <a href={`/portal/chatkit/${chatbot.id}`} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">← {chatbot.name}</a>
        <h1 className="text-xl font-semibold text-white mt-2 mb-6">Edit KB entry</h1>
        <PortalKBEntryForm chatbotId={chatbot.id} entry={entry} />
      </div>
    </PortalShell>
  )
}
