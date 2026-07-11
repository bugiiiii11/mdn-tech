export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Rocket, Plus, ExternalLink } from 'lucide-react'
import { PortalShell } from '@/components/portal/PortalShell'
import { MarketKitEyebrow, Pill } from '@/components/portal/marketkit/ui'
import { hasMarketkitAccess } from '@/lib/marketkit/enrollment'
import { CATEGORY_LABELS, BUDGET_LABELS, type MkProject, type BudgetTier } from '@/lib/marketkit/types'

export default async function MarketKitPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')
  if (!(await hasMarketkitAccess(supabase, user.id))) redirect('/portal/toolkit')

  const { data: projects } = await supabase
    .from('mk_projects')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  const list = (projects ?? []) as MkProject[]

  return (
    <PortalShell variant="marketing">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">
        <header className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <MarketKitEyebrow />
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Your portfolio</h1>
            <p className="text-gray-400 text-sm mt-2 max-w-xl">
              One place for every project you&apos;re growing. Upload a project, run the AI scan, generate a Launch Kit —
              positioning, channels, checklist and your first content batch.
            </p>
          </div>
          <Link
            href="/portal/marketkit/new"
            className="inline-flex items-center gap-1.5 button-primary text-white text-sm px-4 py-2 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            New project
          </Link>
        </header>

        {list.length === 0 ? (
          <div className="bg-[#0d0d20]/80 border border-white/[0.08] rounded-2xl p-10 text-center backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-5 h-5 text-purple-300" />
            </div>
            <h2 className="text-lg font-semibold text-white">No projects yet</h2>
            <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
              Add your first project to get an AI go-to-market plan tailored to its category and budget.
            </p>
            <Link
              href="/portal/marketkit/new"
              className="inline-flex items-center gap-1.5 button-primary text-white text-sm px-4 py-2 rounded-lg mt-5"
            >
              <Plus className="w-4 h-4" />
              New project
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {list.map((p) => (
              <Link
                key={p.id}
                href={`/portal/marketkit/${p.id}`}
                className="group block bg-[#0d0d20]/80 border border-white/[0.08] hover:border-purple-400/40 hover:bg-[#0d0d20] rounded-xl backdrop-blur-sm transition-all"
              >
                <div className="flex items-center justify-between gap-4 px-5 py-4 flex-wrap">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <Rocket className="w-4 h-4 text-purple-300" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-white group-hover:text-purple-200 transition-colors truncate">
                        {p.name}
                      </div>
                      {p.url && (
                        <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                          <ExternalLink className="w-3 h-3" />
                          <span className="truncate">{p.url.replace(/^https?:\/\//, '')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Pill tone="purple">{CATEGORY_LABELS[p.category]}</Pill>
                    <Pill>{BUDGET_LABELS[p.budget_tier as BudgetTier]}</Pill>
                    {p.status !== 'active' && <Pill tone="yellow">{p.status}</Pill>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PortalShell>
  )
}
