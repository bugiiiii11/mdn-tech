export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { KBEntryForm } from '@/components/command-center/chatbots/KBEntryForm'

export default async function EditKBEntryPage({ params }: { params: Promise<{ id: string; entryId: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/command-center/login')

  const { id, entryId } = await params
  const [{ data: chatbot }, { data: entry }] = await Promise.all([
    supabase.from('chatbots').select('id, name').eq('id', id).single(),
    supabase.from('chatbot_kb_entries').select('*').eq('id', entryId).single(),
  ])

  if (!chatbot || !entry) notFound()

  return (
    <div className="p-6 max-w-3xl">
      <a href={`/command-center/chatbots/${id}`} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">← {chatbot.name}</a>
      <h1 className="text-xl font-semibold text-white mt-2 mb-6">Edit KB entry</h1>
      <KBEntryForm chatbotId={id} entry={entry} />
    </div>
  )
}
