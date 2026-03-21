export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { QuickAddComm } from '@/components/command-center/communications/QuickAddComm'
import { CommFeed } from '@/components/command-center/communications/CommFeed'

export default async function CommunicationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/command-center/login')

  const { data: communications } = await supabase
    .from('communications')
    .select(`
      id, channel, direction, subject, summary, action_items,
      contact_name, occurred_at, project_id,
      projects(name),
      team_members(full_name)
    `)
    .order('occurred_at', { ascending: false })
    .limit(50)

  const { data: projects } = await supabase
    .from('projects')
    .select('id, name')
    .order('name')

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Communications</h1>
          <p className="text-gray-400 text-sm mt-0.5">All client interactions</p>
        </div>
      </div>

      <QuickAddComm projects={projects ?? []} userId={user.id} />
      <CommFeed communications={communications ?? []} />
    </div>
  )
}
