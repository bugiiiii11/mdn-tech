'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function EmbedSnippet({ chatbotId }: { chatbotId: string }) {
  const [copied, setCopied] = useState(false)
  const snippet = `<script src="https://www.mdntech.org/widget.js" data-chatbot-id="${chatbotId}"></script>`

  function copy() {
    navigator.clipboard.writeText(snippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-[#0d0d20]/80 border border-white/[0.06] rounded-xl p-5 space-y-3 backdrop-blur-sm">
      <h3 className="text-sm font-medium text-white">Deploy</h3>
      <p className="text-xs text-gray-400">
        Add this script tag to your client&apos;s website, just before the closing <code className="text-gray-300">&lt;/body&gt;</code> tag.
      </p>
      <div className="flex items-center gap-2">
        <code className="flex-1 bg-[#0a0a1a] border border-white/10 rounded-lg px-3 py-2 text-xs text-cyan-300 font-mono overflow-x-auto">
          {snippet}
        </code>
        <button
          onClick={copy}
          className="flex-shrink-0 p-2 rounded-lg border border-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}
