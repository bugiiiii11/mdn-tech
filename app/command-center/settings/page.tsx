export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/command-center/login')

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-white">Settings</h1>
      <p className="text-gray-400 text-sm mt-1">Integrations and thresholds -- coming soon.</p>
    </div>
  )
}
