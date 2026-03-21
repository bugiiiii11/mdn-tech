import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function CommunicationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/command-center/login')

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-white">Communications</h1>
      <p className="text-gray-400 text-sm mt-1">Client communication log -- coming in Phase 2.</p>
    </div>
  )
}
