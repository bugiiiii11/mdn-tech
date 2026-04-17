'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { FileText, ChevronRight } from 'lucide-react'

const categoryColor: Record<string, string> = {
  general:  'bg-gray-500/10 text-gray-400 border-gray-500/20',
  about:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
  products: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  faq:      'bg-purple-500/10 text-purple-400 border-purple-500/20',
  policies: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  tone:     'bg-pink-500/10 text-pink-400 border-pink-500/20',
  pricing:  'bg-green-500/10 text-green-400 border-green-500/20',
  support:  'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  other:    'bg-gray-500/10 text-gray-400 border-gray-500/20',
}

export function KBEntryList({ chatbotId, grouped, basePath = '/command-center' }: { chatbotId: string; grouped: Record<string, any[]>; basePath?: string }) {
  const categoryOrder = ['about', 'tone', 'products', 'pricing', 'faq', 'policies', 'support', 'general', 'other']
  const sorted = [
    ...categoryOrder.filter(c => grouped[c]),
    ...Object.keys(grouped).filter(c => !categoryOrder.includes(c)),
  ]

  return (
    <div className="space-y-3">
      {sorted.map(cat => (
        <div key={cat} className="bg-[#0d0d20] border border-white/5 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border capitalize ${categoryColor[cat] ?? categoryColor.general}`}>
              {cat}
            </span>
            <span className="text-gray-600 text-xs">{grouped[cat].length} {grouped[cat].length === 1 ? 'entry' : 'entries'}</span>
          </div>
          <div className="divide-y divide-white/5">
            {grouped[cat].map((entry: any) => {
              const words = entry.content?.trim().split(/\s+/).filter(Boolean).length ?? 0
              return (
                <Link
                  key={entry.id}
                  href={`${basePath}/chatbots/${chatbotId}/entries/${entry.id}/edit`}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors group"
                >
                  <FileText className="w-4 h-4 text-gray-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm group-hover:text-purple-300 transition-colors">{entry.title}</p>
                    <p className="text-gray-600 text-xs truncate mt-0.5">
                      {entry.content?.slice(0, 80).replace(/[#*`]/g, '').trim()}...
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-gray-600 text-xs">{words} words</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-gray-500 transition-colors flex-shrink-0" />
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
