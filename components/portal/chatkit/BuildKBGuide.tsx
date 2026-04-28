import { CodeBlock } from '@/components/portal/handoff/CodeBlock'
import { Reveal } from '@/components/portal/handoff/Reveal'
import { BookOpen, Sparkles, Upload, ChevronDown } from 'lucide-react'
import Link from 'next/link'

const KB_PROMPT = `Hey Claude Code — please scan this entire project (code, docs, README, marketing copy, anything user-facing) and generate a single knowledge-base.md file for a chatbot that will answer visitor questions on the website.

Organize the file into these category headings, in order:
General · About · Products · FAQ · Policies · Tone · Pricing · Support.

Skip any category you don't have enough information for — don't invent content. Use clear markdown, short paragraphs, and bullet lists where useful.

When done, save the result as knowledge-base.md in the repo root and tell me which categories you populated.`

interface Props {
  collapsed?: boolean
}

export function BuildKBGuide({ collapsed = false }: Props) {
  const body = (
    <div className="space-y-6">
      {/* Step 1 */}
      <div className="flex items-start gap-4">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/15 text-cyan-300 text-sm flex items-center justify-center font-mono border border-cyan-500/20">
          1
        </span>
        <div className="flex-1 pt-0.5 min-w-0">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            Install Claude Code
          </h3>
          <p className="text-sm text-gray-400 mt-1.5 leading-relaxed">
            Get the M.D.N skills with a one-line installer.{' '}
            <Link
              href="/portal/toolkit#install"
              className="text-purple-300 hover:text-purple-200 underline-offset-2 hover:underline"
            >
              See the full install guide →
            </Link>
          </p>
        </div>
      </div>

      {/* Step 2 */}
      <div className="flex items-start gap-4">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/15 text-purple-300 text-sm flex items-center justify-center font-mono border border-purple-500/20">
          2
        </span>
        <div className="flex-1 pt-0.5 min-w-0">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Paste this prompt into Claude Code
          </h3>
          <p className="text-sm text-gray-400 mt-1.5 mb-3 leading-relaxed">
            Open Claude Code in your project folder, paste this, and let it
            read everything.
          </p>
          <CodeBlock code={KB_PROMPT} language="markdown" label="Prompt" />
        </div>
      </div>

      {/* Step 3 */}
      <div className="flex items-start gap-4">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-500/15 text-pink-300 text-sm flex items-center justify-center font-mono border border-pink-500/20">
          3
        </span>
        <div className="flex-1 pt-0.5 min-w-0">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Upload className="w-4 h-4 text-pink-400" />
            Add it as a knowledge base
          </h3>
          <p className="text-sm text-gray-400 mt-1.5 leading-relaxed">
            Click <span className="text-white font-medium">+ New chatbot</span>,
            name it, then paste each section of{' '}
            <code className="font-mono text-purple-300 text-xs bg-white/5 px-1.5 py-0.5 rounded">
              knowledge-base.md
            </code>{' '}
            into the matching category as KB entries.
          </p>
        </div>
      </div>
    </div>
  )

  if (collapsed) {
    return (
      <Reveal>
        <details className="group bg-[#0d0d20]/60 border border-white/[0.06] rounded-xl overflow-hidden backdrop-blur-sm">
          <summary className="cursor-pointer px-5 py-4 flex items-center justify-between text-sm hover:bg-white/[0.02] transition-colors select-none">
            <span className="font-medium text-white">
              Building a knowledge base for a new chatbot?
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500 group-open:rotate-180 transition-transform" />
          </summary>
          <div className="px-5 pb-7 pt-5 border-t border-white/[0.06]">
            {body}
          </div>
        </details>
      </Reveal>
    )
  }

  return (
    <Reveal>
      <section className="relative">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400/80 mb-3">
              Get started
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Build your knowledge base in 3 steps
            </h2>
            <p className="text-gray-400 mt-3 text-sm md:text-base max-w-xl mx-auto">
              Let Claude Code scan your project and generate a chatbot-ready
              knowledge base for you.
            </p>
          </div>

          <div className="bg-[#0d0d20]/60 border border-white/[0.06] rounded-2xl p-6 md:p-8 backdrop-blur-sm">
            {body}
          </div>
        </div>
      </section>
    </Reveal>
  )
}
