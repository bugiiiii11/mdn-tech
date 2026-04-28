import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Reveal } from '@/components/portal/handoff/Reveal'

export function ChatKitHero() {
  return (
    <section className="relative pt-12 pb-10 md:pt-20 md:pb-14">
      <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400/80 mb-4">
            ChatKit
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
            <span className="block text-white">AI chatbots</span>
            <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              for your website.
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-6 text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            A knowledge base + one line of code = a chatbot that answers your
            visitors&apos; questions, 24/7.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-8 flex justify-center">
            <Link
              href="/portal/chatkit/new"
              className="inline-flex items-center justify-center gap-2 py-3 px-6 button-primary text-white rounded-lg font-medium"
            >
              <Plus className="w-4 h-4" />
              New chatbot
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
