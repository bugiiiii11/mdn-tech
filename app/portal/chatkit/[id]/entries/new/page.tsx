export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { PortalShell } from '@/components/portal/PortalShell'
import { PortalKBEntryForm } from '@/components/portal/chatbots/PortalKBEntryForm'

export default async function NewEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { id } = await params

  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('id, name')
    .eq('id', id)
    .eq('owner_id', user.id)
    .single()

  if (!chatbot) notFound()

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
            Add an entry
          </h1>
          <p className="text-gray-400 text-sm mt-2 max-w-xl">
            Pick a category, give it a clear title, and paste the markdown content.
            Each entry teaches your chatbot how to answer.
          </p>
        </header>
        <PortalKBEntryForm chatbotId={chatbot.id} />
      </div>
    </PortalShell>
  )
}
