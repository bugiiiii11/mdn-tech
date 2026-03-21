'use client'

import { useState } from 'react'
import { Mail, Phone, MessageSquare, Users, Video, MoreHorizontal, ArrowDownLeft, ArrowUpRight } from 'lucide-react'

const channelIcon: Record<string, React.ReactNode> = {
  email:    <Mail className="w-3.5 h-3.5" />,
  call:     <Phone className="w-3.5 h-3.5" />,
  slack:    <MessageSquare className="w-3.5 h-3.5" />,
  whatsapp: <MessageSquare className="w-3.5 h-3.5" />,
  meeting:  <Video className="w-3.5 h-3.5" />,
  other:    <MoreHorizontal className="w-3.5 h-3.5" />,
}

const channelColor: Record<string, string> = {
  email:    'bg-blue-500/10 text-blue-400',
  call:     'bg-green-500/10 text-green-400',
  slack:    'bg-purple-500/10 text-purple-400',
  whatsapp: 'bg-emerald-500/10 text-emerald-400',
  meeting:  'bg-orange-500/10 text-orange-400',
  other:    'bg-gray-500/10 text-gray-400',
}

type Comm = {
  id: string
  channel: string
  direction: string
  subject: string | null
  summary: string | null
  action_items: string | null
  contact_name: string | null
  occurred_at: string
  project_id: string
  projects: { name: string } | { name: string }[] | null
  team_members: { full_name: string } | { full_name: string }[] | null
}

export function CommFeed({ communications }: { communications: Comm[] }) {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? communications
    : filter === 'actions' ? communications.filter(c => c.action_items)
    : communications.filter(c => c.channel === filter)

  return (
    <div className="bg-[#0d0d20] border border-white/5 rounded-xl overflow-hidden">
      {/* Filter bar */}
      <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2 overflow-x-auto">
        {['all', 'email', 'call', 'slack', 'meeting', 'actions'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
              filter === f ? 'bg-purple-500/20 text-purple-300' : 'text-gray-400 hover:text-white'
            }`}
          >
            {f === 'actions' ? 'Has action items' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-600 whitespace-nowrap">{filtered.length} entries</span>
      </div>

      {filtered.length === 0 ? (
        <div className="px-5 py-10 text-center text-gray-500 text-sm">
          No communications logged yet.
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {filtered.map(c => (
            <div key={c.id} className="px-5 py-4 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-start gap-3">
                {/* Channel icon */}
                <div className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${channelColor[c.channel] ?? channelColor.other}`}>
                  {channelIcon[c.channel] ?? channelIcon.other}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Direction */}
                    <span className="text-gray-500">
                      {c.direction === 'inbound'
                        ? <ArrowDownLeft className="w-3 h-3 text-green-400 inline" />
                        : <ArrowUpRight className="w-3 h-3 text-blue-400 inline" />
                      }
                    </span>

                    {/* Subject or summary preview */}
                    <span className="text-white text-sm font-medium">
                      {c.subject ?? c.summary?.slice(0, 60) ?? 'No subject'}
                    </span>

                    {/* Project */}
                    {c.projects && (
                      <a
                        href={`/command-center/projects/${c.project_id}`}
                        className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        {Array.isArray(c.projects) ? c.projects[0]?.name : c.projects.name}
                      </a>
                    )}

                    {/* Action items flag */}
                    {c.action_items && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-yellow-500/10 text-yellow-400 rounded border border-yellow-500/20">
                        Action items
                      </span>
                    )}
                  </div>

                  {/* Summary */}
                  {c.summary && (
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">{c.summary}</p>
                  )}

                  {/* Action items */}
                  {c.action_items && (
                    <p className="text-yellow-400/80 text-xs mt-1 line-clamp-1">→ {c.action_items}</p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-600">
                    {c.contact_name && <span>{c.contact_name}</span>}
                    {c.team_members && <span>by {Array.isArray(c.team_members) ? c.team_members[0]?.full_name : c.team_members.full_name}</span>}
                    <span>{new Date(c.occurred_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
