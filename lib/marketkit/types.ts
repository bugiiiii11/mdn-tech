// MarketKit shared types (MARKETKIT-BRIEF.md §4). The jsonb columns are typed here
// so the scan/launch-kit worker output and the UI agree on shape.

export type ProjectCategory = 'saas' | 'consumer_app' | 'game' | 'local_business'
export type ProjectStatus = 'active' | 'paused' | 'archived'
export type BudgetTier = 0 | 500 | 2000
export type JobKind = 'scan' | 'launch_kit' | 'sprint_propose' | 'sprint_review' | 'metrics_screenshot'
export type JobStatus = 'queued' | 'running' | 'done' | 'error'
export type ActionStatus = 'proposed' | 'approved' | 'done' | 'skipped'
export type MetricSource = 'ga4' | 'gsc' | 'dub' | 'screenshot' | 'manual'

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  saas: 'SaaS / B2B',
  consumer_app: 'Consumer app',
  game: 'Game',
  local_business: 'Local business',
}

export const BUDGET_LABELS: Record<BudgetTier, string> = {
  0: '€0 / organic only',
  500: '≤ €500 / mo',
  2000: '≤ €2000 / mo',
}

export interface MkProject {
  id: string
  owner_id: string
  name: string
  url: string | null
  category: ProjectCategory
  status: ProjectStatus
  budget_tier: BudgetTier
  language: string
  created_at: string
  updated_at: string
}

export interface MkAsset {
  id: string
  project_id: string
  kind: 'doc' | 'screenshot' | 'logo' | 'data'
  storage_path: string
  filename: string | null
  notes: string | null
  created_at: string
}

// --- Scan output (mk_project_profiles.profile) ---
export interface ProjectProfile {
  what_it_is: string
  category: string
  audience: string
  problem: string
  differentiators: string[]
  existing_channels: string[]
  traction: string
  stage: string
  notes?: string
}

export interface MkProfile {
  id: string
  project_id: string
  version: number
  profile: ProjectProfile
  created_at: string
}

export interface MkFounderQuestion {
  id: string
  project_id: string
  question: string
  why_needed: string | null
  answer: string | null
  answered_at: string | null
  status: 'open' | 'answered' | 'dismissed'
  created_at: string
}

// --- Launch Kit output (mk_strategies) ---
export interface ICP {
  who: string
  pains: string[]
  where_they_are: string[]
  triggers?: string[]
}

export interface ChannelPlanItem {
  channel: string
  rank: number
  rationale: string
  cost: string        // e.g. "€0" | "~€300/mo"
  effort: 'S' | 'M' | 'L'
  expected_outcome: string
}

export interface ChecklistItem {
  task: string
  why: string
  done?: boolean
}

export interface CalendarItem {
  day: number         // 1..30
  channel: string
  format: string
  topic: string
}

export interface MkStrategy {
  id: string
  project_id: string
  version: number
  budget_tier: number
  positioning: string | null
  icp: ICP | null
  channel_plan: ChannelPlanItem[] | null
  launch_checklist: ChecklistItem[] | null
  calendar: CalendarItem[] | null
  created_at: string
}

export interface MkContentItem {
  id: string
  project_id: string
  action_id: string | null
  platform: string | null
  format: string | null
  draft: string | null
  final: string | null
  voice_edited: boolean
  status: 'draft' | 'approved' | 'published'
  published_at: string | null
  created_at: string
}

export interface MkJob {
  id: string
  project_id: string | null
  kind: JobKind
  status: JobStatus
  input: Record<string, unknown>
  result: Record<string, unknown> | null
  error: string | null
  created_at: string
  started_at: string | null
  finished_at: string | null
}

// --- Sprint loop (mk_actions / mk_links, backlog B4) ---
export interface MkLink {
  id: string
  project_id: string
  dub_id: string | null
  url: string
  utm: Record<string, string>
  clicks: number
  conversions: number
  updated_at: string
}

export interface MkAction {
  id: string
  project_id: string
  strategy_id: string | null
  week: string | null // Monday of the sprint week (date)
  title: string
  channel: string | null
  effort: 'S' | 'M' | 'L' | null
  cost_eur: number | null
  expected_outcome: string | null
  tracking_link_id: string | null
  status: ActionStatus
  actual_outcome: string | null
  reviewed_at: string | null
  created_at: string
}

// --- Metrics (mk_metrics_snapshots, backlog B2) ---
export interface MkMetricSnapshot {
  id: number
  project_id: string
  source: MetricSource
  platform: string | null
  metric: string
  value: number
  period_start: string | null
  period_end: string | null
  ingested_at: string
  raw: Record<string, unknown>
}

// Monday (UTC) of the week containing `d`, as YYYY-MM-DD — matches the worker's
// week convention for mk_actions.week.
export function mondayOfWeek(d: Date = new Date()): string {
  const utc = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  utc.setUTCDate(utc.getUTCDate() - ((utc.getUTCDay() + 6) % 7))
  return utc.toISOString().slice(0, 10)
}
