export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { KBEntryForm } from '@/components/command-center/chatbots/KBEntryForm'

export default async function NewKBEntryPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/command-center/login')

  const { data: chatbot } = await supabase.from('chatbots').select('id, name').eq('id', params.id).single()
  if (!chatbot) notFound()

  return (
    <div className="p-6 max-w-3xl">
      <a href={`/command-center/chatbots/${params.id}`} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">← {chatbot.name}</a>
      <h1 className="text-xl font-semibold text-white mt-2 mb-6">New KB entry</h1>
      <KBEntryForm chatbotId={params.id} />
    </div>
  )
}
