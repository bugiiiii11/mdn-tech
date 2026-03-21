'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function KnowledgeContent({ content }: { content: string }) {
  return (
    <div className="prose prose-invert prose-sm max-w-none
      prose-headings:text-white prose-headings:font-semibold
      prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
      prose-p:text-gray-300 prose-p:leading-relaxed
      prose-a:text-purple-400 prose-a:no-underline hover:prose-a:text-purple-300
      prose-strong:text-white
      prose-code:text-cyan-300 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-[#0a0a1a] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl
      prose-blockquote:border-purple-500/40 prose-blockquote:text-gray-400
      prose-li:text-gray-300
      prose-hr:border-white/10
      prose-table:text-sm
      prose-th:text-gray-300 prose-th:font-medium
      prose-td:text-gray-400
    ">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
