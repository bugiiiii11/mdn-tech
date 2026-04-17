export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PortalShell } from '@/components/portal/PortalShell'
import { ToolKitContent } from '@/components/portal/toolkit/ToolKitContent'
import { toolkitSkills, toolkitMCPs } from '@/lib/portal/toolkit-skills'

const categoryLabels: Record<string, string> = {
  'session-management': 'Session Management',
  'marketing': 'Marketing',
  'testing': 'Testing & QA',
  'safety': 'Safety & Validation',
  'design': 'Design',
  'seo': 'SEO',
  'infrastructure': 'Infrastructure',
}

export default async function ToolKitPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: customer } = await supabase
    .from('customers')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (!customer) redirect('/portal/login')

  return (
    <PortalShell>
      <ToolKitContent skills={toolkitSkills} mcps={toolkitMCPs} categoryLabels={categoryLabels} />
    </PortalShell>
  )
}
