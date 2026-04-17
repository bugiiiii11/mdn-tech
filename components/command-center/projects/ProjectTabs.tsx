'use client'

import { useRouter, usePathname } from 'next/navigation'
import { ProjectStatusBadge } from './ProjectStatusBadge'
import { MilestoneList } from './MilestoneList'
import { CommFeed } from '../communications/CommFeed'
import { QuickAddComm } from '../communications/QuickAddComm'
import { useEffect, useState } from 'react'

const TABS = ['overview', 'milestones', 'budget', 'communications']

type Props = {
  project: any
  milestones: any[]
  communications: any[]
  members: { id: string; full_name: string }[]
  currentTab: string
  userId: string
}

export function ProjectTabs({ project, milestones, communications, members, currentTab, userId }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  function goTab(tab: string) {
    router.push(`${pathname}?tab=${tab}`, { scroll: false })
  }

  const budgetPct = project.budget_total > 0 ? Math.round((project.budget_spent / project.budget_total) * 100) : 0
  const completedMs = milestones.filter((m: any) => m.status === 'completed').length
  const progress = milestones.length > 0 ? Math.round((completedMs / milestones.length) * 100) : 0
  const isOverdue = project.target_end_date && new Date(project.target_end_date) < new Date() && project.status !== 'completed'

  return (
    <div>
      {/* Tab nav */}
      <div className="flex gap-1 border-b border-white/5 mb-5">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => goTab(t)}
            className={`px-4 py-2 text-sm capitalize transition-colors border-b-2 -mb-px ${
              currentTab === t
                ? 'text-white border-purple-500'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {currentTab === 'overview' && (
        <div className="space-y-4">
          {/* Status + meta */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#0d0d20] border border-white/5 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-2">Status</p>
              <ProjectStatusBadge status={project.status} />
              <p className={`text-xs mt-2 capitalize ${
                project.priority === 'critical' ? 'text-red-400' :
                project.priority === 'high' ? 'text-orange-400' :
                project.priority === 'medium' ? 'text-yellow-400' : 'text-gray-400'
              }`}>{project.priority} priority</p>
            </div>

            <div className="bg-[#0d0d20] border border-white/5 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-2">Progress</p>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-sm font-medium text-white">{progress}%</span>
              </div>
              <p className="text-xs text-gray-500">{completedMs}/{milestones.length} milestones</p>
            </div>

            <div className="bg-[#0d0d20] border border-white/5 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Due date</p>
              <p className={`text-sm font-medium ${isOverdue ? 'text-red-400' : 'text-white'}`}>
                {project.target_end_date
                  ? new Date(project.target_end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                  : 'No deadline'}
              </p>
              {isOverdue && <p className="text-xs text-red-400 mt-0.5">Overdue</p>}
            </div>
          </div>

          {project.description && (
            <div className="bg-[#0d0d20] border border-white/5 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Description</p>
              <p className="text-sm text-gray-300">{project.description}</p>
            </div>
          )}

          <div className="bg-[#0d0d20] border border-white/5 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-3">Links & infrastructure</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {project.repository_url && <LinkRow label="Repository" href={project.repository_url} />}
              {project.staging_url && <LinkRow label="Staging" href={project.staging_url} />}
              {project.production_url && <LinkRow label="Production" href={project.production_url} />}
              {project.supabase_project_ref && <InfoRow label="Supabase ref" value={project.supabase_project_ref} />}
              {project.railway_project_id && <InfoRow label="Railway ID" value={project.railway_project_id} />}
              {project.vercel_project_id && <InfoRow label="Vercel ID" value={project.vercel_project_id} />}
            </div>

            {/* Dev/Prod infrastructure from metadata */}
            {project.metadata?.infrastructure && (
              <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                {project.metadata.infrastructure.dev && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Dev Environment</p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                      {project.metadata.infrastructure.dev.supabase_ref && (
                        <InfoRow label="Supabase" value={project.metadata.infrastructure.dev.supabase_ref} />
                      )}
                      {project.metadata.infrastructure.dev.railway_backend && (
                        <InfoRow label="Railway" value={project.metadata.infrastructure.dev.railway_backend} />
                      )}
                    </div>
                  </div>
                )}

                {project.metadata.infrastructure.prod && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Prod Environment</p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                      {project.metadata.infrastructure.prod.supabase_ref && (
                        <InfoRow label="Supabase" value={project.metadata.infrastructure.prod.supabase_ref} />
                      )}
                      {project.metadata.infrastructure.prod.railway_backend && (
                        <InfoRow label="Railway" value={project.metadata.infrastructure.prod.railway_backend} />
                      )}
                    </div>
                  </div>
                )}

                {project.metadata.infrastructure.auth_service && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Auth Service</p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                      {project.metadata.infrastructure.auth_service.name && (
                        <InfoRow label="Service" value={project.metadata.infrastructure.auth_service.name} />
                      )}
                      {project.metadata.infrastructure.auth_service.supabase_ref && (
                        <InfoRow label="Supabase" value={project.metadata.infrastructure.auth_service.supabase_ref} />
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Milestones */}
      {currentTab === 'milestones' && (
        <div className="bg-[#0d0d20] border border-white/5 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-white/5">
            <h2 className="text-sm font-medium text-white">Milestones</h2>
          </div>
          <MilestoneList projectId={project.id} milestones={milestones} />
        </div>
      )}

      {/* Budget */}
      {currentTab === 'budget' && (
        <div className="space-y-4">
          {/* Main budget card */}
          <div className="bg-[#0d0d20] border border-white/5 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-white">Budget overview</h2>
              <span className={`text-lg font-semibold ${budgetPct >= 100 ? 'text-red-400' : budgetPct >= 80 ? 'text-yellow-400' : 'text-green-400'}`}>
                {budgetPct}%
              </span>
            </div>

            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full rounded-full transition-all ${budgetPct >= 100 ? 'bg-red-500' : budgetPct >= 80 ? 'bg-yellow-500' : 'bg-gradient-to-r from-cyan-500 to-green-500'}`}
                style={{ width: `${Math.min(budgetPct, 100)}%` }}
              />
            </div>

            <div className="flex justify-between text-sm">
              <div>
                <p className="text-gray-400 text-xs">Spent</p>
                <p className="text-white font-medium">${(project.budget_spent ?? 0).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs">Total budget</p>
                <p className="text-white font-medium">${(project.budget_total ?? 0).toLocaleString()}</p>
              </div>
            </div>

            {budgetPct >= 80 && (
              <div className={`mt-4 px-3 py-2 rounded-lg text-xs ${budgetPct >= 100 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                {budgetPct >= 100
                  ? 'Budget exceeded. Review spend immediately.'
                  : `${100 - budgetPct}% of budget remaining. Monitor closely.`}
              </div>
            )}
          </div>

          {/* Remaining */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0d0d20] border border-white/5 rounded-xl p-4">
              <p className="text-xs text-gray-400">Remaining</p>
              <p className={`text-xl font-semibold mt-1 ${(project.budget_total - project.budget_spent) < 0 ? 'text-red-400' : 'text-white'}`}>
                ${Math.max(0, (project.budget_total ?? 0) - (project.budget_spent ?? 0)).toLocaleString()}
              </p>
            </div>
            <div className="bg-[#0d0d20] border border-white/5 rounded-xl p-4">
              <p className="text-xs text-gray-400">Health</p>
              <p className={`text-xl font-semibold mt-1 ${budgetPct >= 100 ? 'text-red-400' : budgetPct >= 80 ? 'text-yellow-400' : 'text-green-400'}`}>
                {budgetPct >= 100 ? 'Over budget' : budgetPct >= 80 ? 'At risk' : 'On track'}
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            To update budget spend, edit the project and update the &quot;Budget spent&quot; field.
          </p>
        </div>
      )}

      {/* Communications */}
      {currentTab === 'communications' && (
        <div className="space-y-4">
          <QuickAddComm projects={[{ id: project.id, name: project.name }]} userId={userId} />
          <CommFeed communications={communications.map(c => ({ ...c, projects: { name: project.name }, project_id: project.id }))} />
        </div>
      )}
    </div>
  )
}

function LinkRow({ label, href }: { label: string; href: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500 text-xs w-24">{label}</span>
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 text-xs truncate transition-colors">
        {href.replace(/^https?:\/\//, '')}
      </a>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500 text-xs w-24">{label}</span>
      <span className="text-gray-300 text-xs font-mono">{value}</span>
    </div>
  )
}
