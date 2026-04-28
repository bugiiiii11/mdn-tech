'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

interface Props {
  code: string
  language?: string
  label?: string
}

export function CodeBlock({ code, language = 'bash', label }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable — user can still select + copy manually
    }
  }

  return (
    <div className="relative group">
      <div className="bg-[#0a0a14] border border-white/10 rounded-lg overflow-hidden">
        {label && (
          <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between gap-3">
            <span className="font-mono text-xs text-gray-500 uppercase tracking-wider">
              {label}
            </span>
            <button
              onClick={handleCopy}
              aria-label={copied ? 'Copied' : 'Copy to clipboard'}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-purple-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded px-2 py-1 -my-1"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}
        <div className="relative">
          <pre className={`p-5 overflow-x-auto ${label ? '' : 'pr-14'}`}>
            <code className={`font-mono text-sm text-gray-200 leading-relaxed language-${language}`}>
              {code}
            </code>
          </pre>
          {!label && (
            <button
              onClick={handleCopy}
              aria-label={copied ? 'Copied' : 'Copy to clipboard'}
              className="absolute top-3 right-3 p-2 rounded-md text-gray-500 hover:text-purple-300 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 transition-colors"
            >
              {copied ? (
                <span className="flex items-center gap-1.5 text-xs text-green-400">
                  <Check className="w-3.5 h-3.5" />
                  Copied
                </span>
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
