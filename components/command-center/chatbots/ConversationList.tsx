'use client'

import { useState } from 'react'
import Link from 'next/link'

type Conversation = {
  id: string
  visitor_id: string
  source_url: string | null
  status: string
  message_count: number
  started_at: string
  last_message_at: string
}

function timeAgo(date: string) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

export function ConversationList({ chatbotId, conversations }: { chatbotId: string; conversations: Conversation[] }) {
  const [filter, setFilter] = useState<'all' | 'active' | 'ended'>('all')

  const filtered = conversations.filter(c => filter === 'all' || c.status === filter)

  return (
    <div className="space-y-3">
      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'active', 'ended'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-lg text-xs capitalize transition-colors ${
              filter === f
                ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                : 'text-gray-500 border border-white/5 hover:text-gray-300'
            }`}
          >
            {f} {f === 'all' ? `(${conversations.length})` : `(${conversations.filter(c => c.status === f).length})`}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-[#0d0d20] border border-white/5 rounded-xl px-5 py-10 text-center text-gray-500 text-sm">
          No conversations yet.
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(conv => (
            <Link
              key={conv.id}
              href={`/command-center/chatbots/${chatbotId}/conversations/${conv.id}`}
              className="flex items-center justify-between bg-[#0d0d20] border border-white/5 rounded-xl px-5 py-3 hover:border-purple-500/20 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${conv.status === 'active' ? 'bg-green-400' : 'bg-gray-600'}`} />
                <div>
                  <p className="text-sm text-white group-hover:text-purple-300 transition-colors">
                    {conv.visitor_id.slice(0, 12)}...
                  </p>
                  {conv.source_url && (
                    <p className="text-[11px] text-gray-600 mt-0.5 truncate max-w-[300px]">{conv.source_url}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-6 text-xs text-gray-500">
                <span>{conv.message_count} msgs</span>
                <span>{timeAgo(conv.last_message_at)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
