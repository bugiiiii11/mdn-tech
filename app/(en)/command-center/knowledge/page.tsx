export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'

type DocMeta = {
  slug: string
  title: string
  category: string
  tags: string[]
  updated: string
}

function getKnowledgeDocs(): DocMeta[] {
  const base = path.join(process.cwd(), 'command-center', 'knowledge')
  const docs: DocMeta[] = []

  function walk(dir: string) {
    if (!fs.existsSync(dir)) return
    for (const file of fs.readdirSync(dir)) {
      const full = path.join(dir, file)
      if (fs.statSync(full).isDirectory()) {
        walk(full)
      } else if (file.endsWith('.md')) {
        const content = fs.readFileSync(full, 'utf-8')
        const { data } = matter(content)
        const rel = path.relative(base, full).replace(/\\/g, '/').replace('.md', '')
        docs.push({
          slug: rel,
          title: data.title ?? file.replace('.md', ''),
          category: data.category ?? 'doc',
          tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
          updated: data.updated
            ? new Date(data.updated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : '',
        })
      }
    }
  }

  walk(base)
  return docs
}

const categoryLabel: Record<string, string> = {
  skill: 'Skills',
  doc: 'Docs',
  howto: 'How-to',
}

const categoryColor: Record<string, string> = {
  skill: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  doc: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  howto: 'bg-green-500/10 text-green-400 border-green-500/20',
}

export default async function KnowledgePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/command-center/login')

  const docs = getKnowledgeDocs()
  const grouped = docs.reduce((acc: Record<string, DocMeta[]>, d) => {
    acc[d.category] = [...(acc[d.category] ?? []), d]
    return acc
  }, {})

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Knowledge Base</h1>
        <p className="text-gray-400 text-sm mt-0.5">{docs.length} documents</p>
      </div>

      {docs.length === 0 ? (
        <div className="bg-[#0d0d20] border border-white/5 rounded-xl px-5 py-10 text-center text-gray-500 text-sm">
          No documents yet. Add .md files to <code className="text-gray-400">command-center/knowledge/</code>
        </div>
      ) : (
        Object.entries(grouped).map(([cat, items]) => (
          <div key={cat}>
            <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              {categoryLabel[cat] ?? cat}
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {items.map(doc => (
                <Link
                  key={doc.slug}
                  href={`/command-center/knowledge/${doc.slug}`}
                  className="bg-[#0d0d20] border border-white/5 rounded-xl px-5 py-3 flex items-center justify-between hover:border-purple-500/20 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${categoryColor[doc.category] ?? categoryColor.doc}`}>
                      {categoryLabel[doc.category] ?? doc.category}
                    </span>
                    <span className="text-white text-sm group-hover:text-purple-300 transition-colors">{doc.title}</span>
                    {doc.tags.length > 0 && (
                      <div className="flex gap-1">
                        {doc.tags.slice(0, 3).map((t: string) => (
                          <span key={t} className="text-[10px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  {doc.updated && (
                    <span className="text-xs text-gray-600">{doc.updated}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
