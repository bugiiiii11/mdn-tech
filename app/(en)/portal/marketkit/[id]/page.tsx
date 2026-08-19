export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Pencil } from 'lucide-react'
import { PortalShell } from '@/components/portal/PortalShell'
import { MarketKitEyebrow, BackChip } from '@/components/portal/marketkit/ui'
import { ProjectWorkspace } from '@/components/portal/marketkit/ProjectWorkspace'
import { hasMarketkitAccess } from '@/lib/marketkit/enrollment'
import type {
  MkProject,
  MkAsset,
  MkFounderQuestion,
  MkStrategy,
  MkContentItem,
  MkAction,
  MkLink,
  MkMetricSnapshot,
  ProjectProfile,
  JobStatus,
} from '@/lib/marketkit/types'

export default async function MarketKitProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')
  if (!(await hasMarketkitAccess(supabase, user.id))) redirect('/portal/toolkit')

  const { data: project } = await supabase
    .from('mk_projects')
    .select('*')
    .eq('id', id)
    .eq('owner_id', user.id)
    .maybeSingle()
  if (!project) notFound()

  const [assetsRes, profileRes, questionsRes, strategyRes, contentRes, actionsRes, linksRes, metricsRes, jobsRes] = await Promise.all([
    supabase.from('mk_project_assets').select('*').eq('project_id', id).order('created_at', { ascending: true }),
    supabase
      .from('mk_project_profiles')
      .select('profile, version')
      .eq('project_id', id)
      .order('version', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase.from('mk_founder_questions').select('*').eq('project_id', id).order('created_at', { ascending: true }),
    supabase
      .from('mk_strategies')
      .select('*')
      .eq('project_id', id)
      .order('version', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase.from('mk_content_items').select('*').eq('project_id', id).order('created_at', { ascending: false }),
    supabase
      .from('mk_actions')
      .select('*')
      .eq('project_id', id)
      .order('week', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(60),
    supabase.from('mk_links').select('*').eq('project_id', id),
    supabase
      .from('mk_metrics_snapshots')
      .select('*')
      .eq('project_id', id)
      .order('ingested_at', { ascending: false })
      .limit(100),
    supabase
      .from('mk_jobs')
      .select('id, kind, status')
      .eq('project_id', id)
      .in('status', ['queued', 'running'])
      .order('created_at', { ascending: false }),
  ])

  const jobs = (jobsRes.data ?? []) as { id: string; kind: string; status: JobStatus }[]
  const scanJob = jobs.find((j) => j.kind === 'scan') ?? null
  const launchJob = jobs.find((j) => j.kind === 'launch_kit') ?? null
  const proposeJob = jobs.find((j) => j.kind === 'sprint_propose') ?? null
  const reviewJob = jobs.find((j) => j.kind === 'sprint_review') ?? null
  const metricsJob = jobs.find((j) => j.kind === 'metrics_screenshot') ?? null
  const dubSyncJob = jobs.find((j) => j.kind === 'dub_sync') ?? null

  return (
    <PortalShell variant="marketing">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <div className="mb-6">
          <BackChip href="/portal/marketkit" label="Portfolio" />
        </div>
        <header className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <MarketKitEyebrow />
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{(project as MkProject).name}</h1>
            {(project as MkProject).url && (
              <a
                href={(project as MkProject).url as string}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-cyan-400/80 hover:text-cyan-300 mt-1 inline-block"
              >
                {((project as MkProject).url as string).replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
          <Link
            href={`/portal/marketkit/${id}/edit`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-300 border border-white/10 hover:border-white/20 hover:text-white rounded-lg transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit details
          </Link>
        </header>

        <ProjectWorkspace
          project={project as MkProject}
          assets={(assetsRes.data ?? []) as MkAsset[]}
          profile={(profileRes.data?.profile ?? null) as ProjectProfile | null}
          profileVersion={profileRes.data?.version ?? null}
          questions={(questionsRes.data ?? []) as MkFounderQuestion[]}
          strategy={(strategyRes.data ?? null) as MkStrategy | null}
          content={(contentRes.data ?? []) as MkContentItem[]}
          actions={(actionsRes.data ?? []) as MkAction[]}
          links={(linksRes.data ?? []) as MkLink[]}
          metrics={(metricsRes.data ?? []) as MkMetricSnapshot[]}
          scanJob={scanJob ? { id: scanJob.id, status: scanJob.status } : null}
          launchJob={launchJob ? { id: launchJob.id, status: launchJob.status } : null}
          proposeJob={proposeJob ? { id: proposeJob.id, status: proposeJob.status } : null}
          reviewJob={reviewJob ? { id: reviewJob.id, status: reviewJob.status } : null}
          metricsJob={metricsJob ? { id: metricsJob.id, status: metricsJob.status } : null}
          dubSyncJob={dubSyncJob ? { id: dubSyncJob.id, status: dubSyncJob.status } : null}
        />
      </div>
    </PortalShell>
  )
}
