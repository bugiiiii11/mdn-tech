import { Bell, ExternalLink } from 'lucide-react'
import { Reveal } from './Reveal'

const GITHUB_URL = 'https://github.com/bugiiiii11/handoff'
const WAITLIST_EMAIL = 'chaosgenesisnft@gmail.com'

export function PlanKitTeaser() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <Reveal>
        <div className="relative bg-gradient-to-br from-purple-900/20 via-[#0d0d20] to-cyan-900/10 border border-purple-500/20 rounded-2xl p-8 md:p-12 overflow-hidden">
          {/* Decorative gradient orb */}
          <div
            className="absolute -top-32 -right-32 w-64 h-64 rounded-full opacity-30 blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(6,182,212,0) 70%)',
            }}
          />

          <div className="relative">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-purple-300/90 mb-3">
              Coming soon · Paid tier
            </p>

            <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight max-w-3xl">
              PlanKit — sprint loop, Telegram nudges, end-of-day shutdown.
            </h2>

            <p className="mt-4 text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed">
              The same workflow, extended. Daily planning, intent capture, Claude-generated
              end-of-day summaries, and Telegram notifications when Claude needs you.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center justify-center gap-2 py-2.5 px-5 button-primary text-white text-sm rounded-lg"
              >
                <Bell className="w-4 h-4" />
                Watch the GitHub repo
              </a>
              <a
                href={`mailto:${WAITLIST_EMAIL}?subject=PlanKit%20waitlist`}
                className="inline-flex items-center justify-center gap-2 py-2.5 px-5 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white text-sm rounded-lg transition-colors"
              >
                Join the waitlist
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  )
}
