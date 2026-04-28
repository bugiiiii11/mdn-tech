import { ExternalLink } from 'lucide-react'
import { Reveal } from './Reveal'

const GITHUB_URL = 'https://github.com/bugiiiii11/handoff'

export function HandoffHero() {
  return (
    <section className="relative pt-16 pb-16 md:pt-24 md:pb-24">
      <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400/80 mb-4">
            Open source · MIT · Free forever
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
            <span className="block text-white">Make Claude Code</span>
            <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              remember your project.
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-6 text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Four free skills —{' '}
            <code className="font-mono text-purple-300 text-sm">/start</code>,{' '}
            <code className="font-mono text-purple-300 text-sm">/wrap</code>,{' '}
            <code className="font-mono text-purple-300 text-sm">/save</code>,{' '}
            <code className="font-mono text-purple-300 text-sm">/doc-update</code>
            {' '}— that turn every Claude Code session into the next one&apos;s starting point.
            No vendor lock-in. Install in one line.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#install"
              className="inline-flex items-center justify-center gap-2 py-3 px-6 button-primary text-white rounded-lg font-medium"
            >
              Install →
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center justify-center gap-2 py-3 px-6 border border-white/10 hover:border-white/20 hover:bg-white/5 text-gray-200 rounded-lg font-medium transition-colors"
            >
              View on GitHub
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <p className="mt-8 font-mono text-xs text-gray-500">
            MIT licensed · 0 dependencies · Works on macOS / Linux / Windows
          </p>
        </Reveal>
      </div>
    </section>
  )
}
