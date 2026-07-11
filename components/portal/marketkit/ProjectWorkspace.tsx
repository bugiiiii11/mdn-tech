'use client'

import { useState } from 'react'
import { Card, Pill } from './ui'
import { AssetUploader } from './AssetUploader'
import { JobRunner } from './JobRunner'
import { FounderQuestions } from './FounderQuestions'
import { LaunchKitView } from './LaunchKitView'
import { SprintBoard } from './SprintBoard'
import { MetricsPanel } from './MetricsPanel'
import {
  CATEGORY_LABELS,
  BUDGET_LABELS,
  type MkProject,
  type MkAsset,
  type ProjectProfile,
  type MkFounderQuestion,
  type MkStrategy,
  type MkContentItem,
  type MkAction,
  type MkLink,
  type MkMetricSnapshot,
  type BudgetTier,
  type JobStatus,
} from '@/lib/marketkit/types'

type Tab = 'profile' | 'launch_kit' | 'sprint' | 'questions' | 'content' | 'metrics'

interface JobState {
  id: string
  status: JobStatus
}

export function ProjectWorkspace({
  project,
  assets,
  profile,
  profileVersion,
  questions,
  strategy,
  content,
  actions,
  links,
  metrics,
  scanJob,
  launchJob,
  proposeJob,
  reviewJob,
  metricsJob,
}: {
  project: MkProject
  assets: MkAsset[]
  profile: ProjectProfile | null
  profileVersion: number | null
  questions: MkFounderQuestion[]
  strategy: MkStrategy | null
  content: MkContentItem[]
  actions: MkAction[]
  links: MkLink[]
  metrics: MkMetricSnapshot[]
  scanJob: JobState | null
  launchJob: JobState | null
  proposeJob: JobState | null
  reviewJob: JobState | null
  metricsJob: JobState | null
}) {
  const [tab, setTab] = useState<Tab>('profile')

  const tabs: { key: Tab; label: string; badge?: number }[] = [
    { key: 'profile', label: 'Profile' },
    { key: 'launch_kit', label: 'Launch Kit' },
    { key: 'sprint', label: 'Sprint', badge: actions.filter((a) => a.status === 'proposed').length },
    { key: 'questions', label: 'Questions', badge: questions.filter((q) => q.status === 'open').length },
    { key: 'content', label: 'Content', badge: content.length },
    { key: 'metrics', label: 'Metrics', badge: metrics.length },
  ]

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-white/[0.08] overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative px-4 py-2.5 text-sm whitespace-nowrap transition-colors ${
              tab === t.key ? 'text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {t.label}
            {t.badge ? <span className="ml-1.5 text-[10px] text-gray-500">({t.badge})</span> : null}
            {tab === t.key && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-purple-400 rounded-full" />}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="space-y-6">
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className="text-sm font-semibold text-white">Intake &amp; assets</h2>
              <div className="flex items-center gap-2">
                <Pill tone="purple">{CATEGORY_LABELS[project.category]}</Pill>
                <Pill>{BUDGET_LABELS[project.budget_tier as BudgetTier]}</Pill>
              </div>
            </div>
            <AssetUploader projectId={project.id} assets={assets} />
            <div className="pt-1">
              <JobRunner
                projectId={project.id}
                kind="scan"
                label={profile ? 'Re-run AI scan' : 'Run AI scan'}
                runningLabel="Scanning…"
                initialJobId={scanJob?.id}
                initialStatus={scanJob?.status}
              />
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-semibold text-white mb-3">
              Project profile{profileVersion ? <span className="text-gray-500 font-normal"> · v{profileVersion}</span> : null}
            </h2>
            {profile ? (
              <ProfileView profile={profile} />
            ) : (
              <p className="text-sm text-gray-500">
                No profile yet. Add your URL and any assets above, then run the AI scan — it reads everything and drafts a
                structured profile plus founder questions.
              </p>
            )}
          </Card>
        </div>
      )}

      {tab === 'launch_kit' && (
        <Card className="p-5 space-y-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-sm font-semibold text-white">Launch Kit</h2>
            <JobRunner
              projectId={project.id}
              kind="launch_kit"
              label={strategy ? 'Regenerate' : 'Generate Launch Kit'}
              runningLabel="Generating…"
              disabled={!profile}
              disabledHint="Run the AI scan first — the Launch Kit builds on the project profile."
              initialJobId={launchJob?.id}
              initialStatus={launchJob?.status}
            />
          </div>
          {strategy ? (
            <LaunchKitView projectName={project.name} strategy={strategy} content={content} />
          ) : (
            <p className="text-sm text-gray-500">
              Positioning, ICP, a ranked channel plan, a launch checklist, a 30-day calendar and your first content batch —
              generated from the profile and your answered questions.
            </p>
          )}
        </Card>
      )}

      {tab === 'sprint' && (
        <Card className="p-5 space-y-5">
          <h2 className="text-sm font-semibold text-white">Weekly sprint</h2>
          <SprintBoard
            projectId={project.id}
            actions={actions}
            links={links}
            hasProfile={!!profile}
            proposeJob={proposeJob}
            reviewJob={reviewJob}
          />
        </Card>
      )}

      {tab === 'questions' && (
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-white mb-3">Founder questions</h2>
          <FounderQuestions questions={questions} />
        </Card>
      )}

      {tab === 'content' && (
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-white mb-3">Content</h2>
          {content.length === 0 ? (
            <p className="text-sm text-gray-500">No content yet — generate a Launch Kit to get your first batch of drafts.</p>
          ) : (
            <div className="space-y-3">
              <p className="text-[11px] text-gray-500">
                Drafts only. Voice-editing and publishing land in a later session — always human-approve before posting (M8).
              </p>
              {content.map((c) => (
                <div key={c.id} className="bg-[#0a0a1a] border border-white/[0.06] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Pill tone="purple">{c.platform ?? 'post'}</Pill>
                    {c.format && <span className="text-[11px] text-gray-500">{c.format}</span>}
                    <Pill tone={c.status === 'published' ? 'green' : c.status === 'approved' ? 'yellow' : 'gray'}>
                      {c.status}
                    </Pill>
                  </div>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{c.draft}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {tab === 'metrics' && (
        <Card className="p-5 space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-white">Metrics</h2>
            <p className="text-[11px] text-gray-500 mt-1">
              Screenshot import + manual entry. GA4 / Search Console / tracked-link pulls land in a later session.
            </p>
          </div>
          <MetricsPanel projectId={project.id} snapshots={metrics} screenshotJob={metricsJob} />
        </Card>
      )}
    </div>
  )
}

function ProfileView({ profile }: { profile: ProjectProfile }) {
  return (
    <div className="space-y-4 text-sm">
      <Field label="What it is" value={profile.what_it_is} />
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Audience" value={profile.audience} />
        <Field label="Category (AI read)" value={profile.category} />
        <Field label="Stage" value={profile.stage} />
        <Field label="Traction" value={profile.traction} />
      </div>
      <Field label="Core problem" value={profile.problem} />
      <ListField label="Differentiators" items={profile.differentiators} />
      <ListField label="Existing channels" items={profile.existing_channels} />
      {profile.notes && <Field label="Notes" value={profile.notes} />}
    </div>
  )
}

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider font-mono text-gray-500 mb-1">{label}</p>
      <p className="text-gray-300 leading-relaxed">{value}</p>
    </div>
  )
}

function ListField({ label, items }: { label: string; items?: string[] }) {
  if (!items || items.length === 0) return null
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider font-mono text-gray-500 mb-1">{label}</p>
      <ul className="list-disc list-inside space-y-0.5 text-gray-300">
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </div>
  )
}
