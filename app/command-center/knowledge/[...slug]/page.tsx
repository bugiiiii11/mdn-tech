export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { KnowledgeContent } from '@/components/command-center/knowledge/KnowledgeContent'

export default async function KnowledgeDocPage({ params }: { params: { slug: string[] } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/command-center/login')

  const slugPath = params.slug.join('/')
  const filePath = path.join(process.cwd(), 'command-center', 'knowledge', `${slugPath}.md`)

  if (!fs.existsSync(filePath)) notFound()

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return (
    <div className="p-6 max-w-3xl">
      <a href="/command-center/knowledge" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
        ← Knowledge Base
      </a>
      <div className="mt-4 mb-6">
        <h1 className="text-2xl font-semibold text-white">{data.title ?? slugPath}</h1>
        <div className="flex items-center gap-3 mt-2">
          {data.category && (
            <span className="text-xs text-gray-400 capitalize">{data.category}</span>
          )}
          {data.updated && (
            <span className="text-xs text-gray-600">Updated {data.updated}</span>
          )}
          {data.tags?.map((t: string) => (
            <span key={t} className="text-[10px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">{t}</span>
          ))}
        </div>
      </div>
      <KnowledgeContent content={content} />
    </div>
  )
}
