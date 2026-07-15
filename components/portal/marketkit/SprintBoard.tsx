'use client'

import { useState, useTransition } from 'react'
import { Check, Copy, SkipForward, CheckCheck, MousePointerClick } from 'lucide-react'
import { Pill } from './ui'
import { JobRunner } from './JobRunner'
import { setActionStatus } from '@/app/portal/marketkit/actions'
import { mondayOfWeek, type MkAction, type MkLink, type JobStatus, type ActionStatus } from '@/lib/marketkit/types'

// Weekly sprint loop UI (BRIEF §3.4 / backlog B4): actions grouped by sprint week,
// proposed → approve/skip → done, with the AI review's actual_outcome inline.
// The Monday crons drive the loop hands-free; the buttons here exist for dogfood
// and mid-week re-rolls.

interface JobState {
  id: string
  status: JobStatus
}

const STATUS_TONE: Record<ActionStatus, 'purple' | 'yellow' | 'green' | 'gray'> = {
  proposed: 'purple',
  approved: 'yellow',
  done: 'green',
  skipped: 'gray',
}

export function SprintBoard({
  projectId,
  actions,
  links,
  hasProfile,
  proposeJob,
  reviewJob,
}: {
  projectId: string
  actions: MkAction[]
  links: MkLink[]
  hasProfile: boolean
  proposeJob: JobState | null
  reviewJob: JobState | null
}) {
  const currentWeek = mondayOfWeek()
  const weeks = Array.from(new Set(actions.map((a) => a.week ?? 'unscheduled'))).sort((a, b) => (a < b ? 1 : -1))
  const hasReviewable = actions.some((a) => a.week && a.week < currentWeek && (a.status === 'approved' || a.status === 'done') && !a.reviewed_at)

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col gap-2">
          <JobRunner
            projectId={projectId}
            kind="sprint_propose"
            label={actions.some((a) => a.week === currentWeek) ? 'Re-roll this week' : 'Propose this week’s sprint'}
            runningLabel="Proposing…"
            disabled={!hasProfile}
            disabledHint="Run the AI scan first — sprint proposals build on the project profile."
            initialJobId={proposeJob?.id}
            initialStatus={proposeJob?.status}
          />
          <p className="text-[11px] text-gray-500">
            Every Monday the loop runs on its own: past week reviewed at 06:00, 3 new actions proposed at 07:00.
          </p>
        </div>
        {hasReviewable && (
          <JobRunner
            projectId={projectId}
            kind="sprint_review"
            label="Review past weeks now"
            runningLabel="Reviewing…"
            initialJobId={reviewJob?.id}
            initialStatus={reviewJob?.status}
          />
        )}
      </div>

      {actions.length === 0 ? (
        <p className="text-sm text-gray-500">
          No sprint yet. Each week you get 3 concrete, budget-respecting actions — approve the ones you’ll do, skip the
          rest, and next Monday the loop reviews what actually happened against your metrics.
        </p>
      ) : (
        weeks.map((week) => (
          <section key={week}>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-semibold text-white">{week === 'unscheduled' ? 'Unscheduled' : `Week of ${formatWeek(week)}`}</h3>
              {week === currentWeek && <Pill tone="purple">current</Pill>}
            </div>
            <div className="space-y-2">
              {actions
                .filter((a) => (a.week ?? 'unscheduled') === week)
                .map((a) => (
                  <ActionCard key={a.id} action={a} link={links.find((l) => l.id === a.tracking_link_id) ?? null} />
                ))}
            </div>
          </section>
        ))
      )}
    </div>
  )
}

function ActionCard({ action, link }: { action: MkAction; link: MkLink | null }) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  function move(status: 'approved' | 'done' | 'skipped') {
    setError(null)
    startTransition(async () => {
      const res = await setActionStatus(action.id, status)
      if (res?.error) setError(res.error)
    })
  }

  async function copyLink() {
    if (!link) return
    await navigator.clipboard.writeText(link.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="bg-[#0a0a1a] border border-white/[0.06] rounded-lg p-4 space-y-2">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <p className="text-sm font-medium text-white leading-snug">{action.title}</p>
        <Pill tone={STATUS_TONE[action.status]}>{action.status}</Pill>
      </div>

      <div className="flex items-center gap-2 flex-wrap text-[11px] text-gray-500">
        {action.channel && <span className="text-cyan-300/80">{action.channel}</span>}
        {action.effort && <span className="font-mono">effort {action.effort}</span>}
        {typeof action.cost_eur === 'number' && action.cost_eur > 0 && <span className="font-mono">€{action.cost_eur}</span>}
      </div>

      {action.expected_outcome && (
        <p className="text-xs text-gray-400">
          <span className="text-gray-500">Expected:</span> {action.expected_outcome}
        </p>
      )}

      {action.actual_outcome && (
        <p className="text-xs text-cyan-200/80 bg-cyan-500/[0.06] border border-cyan-400/10 rounded-md px-2.5 py-1.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-400/70">Review · </span>
          {action.actual_outcome}
        </p>
      )}

      {link && (
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={copyLink}
            className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-gray-300 transition-colors min-w-0"
            title={link.url}
          >
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            <span className="truncate">{copied ? 'Copied ✓' : link.url.replace(/^https?:\/\//, '')}</span>
          </button>
          {link.dub_id && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-gray-500 whitespace-nowrap">
              <MousePointerClick className="w-3 h-3 text-cyan-400/70" />
              {link.clicks} {link.clicks === 1 ? 'click' : 'clicks'}
              {link.conversions > 0 && <span className="text-green-400/80">· {link.conversions} conv</span>}
            </span>
          )}
        </div>
      )}

      {(action.status === 'proposed' || action.status === 'approved') && (
        <div className="flex items-center gap-2 pt-1">
          {action.status === 'proposed' && (
            <button
              onClick={() => move('approved')}
              disabled={pending}
              className="inline-flex items-center gap-1.5 button-primary text-white text-xs px-3 py-1.5 rounded-lg disabled:opacity-50 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              Approve
            </button>
          )}
          {action.status === 'approved' && (
            <button
              onClick={() => move('done')}
              disabled={pending}
              className="inline-flex items-center gap-1.5 button-primary text-white text-xs px-3 py-1.5 rounded-lg disabled:opacity-50 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark done
            </button>
          )}
          <button
            onClick={() => move('skipped')}
            disabled={pending}
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 border border-white/10 hover:border-white/20 hover:text-white px-3 py-1.5 rounded-lg disabled:opacity-50 transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5" />
            Skip
          </button>
        </div>
      )}

      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}

function formatWeek(week: string): string {
  return new Date(`${week}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
