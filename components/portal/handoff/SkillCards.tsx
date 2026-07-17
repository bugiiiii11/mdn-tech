import { ExternalLink } from 'lucide-react'
import { Reveal } from './Reveal'

interface Skill {
  name: string
  purpose: string
  useWhen: string
  example: string
  sourceUrl: string
}

const SKILL_SOURCE_URL =
  'https://github.com/bugiiiii11/handoff/blob/main/skills/handoff/SKILL.md'

const skills: Skill[] = [
  {
    name: '/handoff start',
    purpose: 'Session briefing — reads the capped handoff.md, checks git status and unpushed commits, consumes any emergency snapshot. Read-only.',
    useWhen: 'At the beginning of every session — Claude needs the briefing before suggesting next steps.',
    example: '> /handoff start\n\nSession Briefing\nLast session: 44 — Handoff v3...\nUnpushed: 2 · Last commit: bc74d79',
    sourceUrl: SKILL_SOURCE_URL,
  },
  {
    name: '/handoff wrap',
    purpose: 'Updates handoff.md (docs before commit), rotates overflow to handoff-archive.md, commits locally. Never pushes unless you ask.',
    useWhen: 'Mid-session checkpoint or end-of-session cleanup — idempotent, safe to call anytime.',
    example: '> /handoff wrap\n\nhandoff.md → Session 45 section\nRotated 1 section to archive\n✓ Committed locally (no push)',
    sourceUrl: SKILL_SOURCE_URL,
  },
  {
    name: '/handoff save',
    purpose: 'Emergency context save — dumps session state to emergency-snapshot.md in a handful of tool calls. No commit, no questions.',
    useWhen: 'When context is nearly full and you need to preserve what happened this session, fast.',
    example: '> /handoff save\n\nWriting emergency-snapshot.md...\n✓ Saved. /handoff start next session resumes.',
    sourceUrl: SKILL_SOURCE_URL,
  },
  {
    name: '/handoff docs',
    purpose: 'Docs-only refresh — runs the wrap’s handoff.md update and archive rotation without committing.',
    useWhen: 'After a focused chunk of work, when you want the docs to reflect reality but aren’t ready to commit.',
    example: '> /handoff docs\n\nhandoff.md → updating Session 45 entry\nNo commit — docs only',
    sourceUrl: SKILL_SOURCE_URL,
  },
]

export function SkillCards() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <Reveal>
          <div className="text-center mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-purple-400/80 mb-3">
              One skill. Four commands.
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
              Small surface. Sharp edges.
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {skills.map((skill, i) => (
            <Reveal key={skill.name} delay={0.05 + i * 0.08}>
              <article className="bg-white/[0.02] border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-colors flex flex-col h-full">
                <header className="flex items-start justify-between mb-3">
                  <h3 className="font-mono text-lg text-cyan-300">{skill.name}</h3>
                  <a
                    href={skill.sourceUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-xs text-gray-500 hover:text-purple-300 transition-colors inline-flex items-center gap-1"
                  >
                    View source <ExternalLink className="w-3 h-3" />
                  </a>
                </header>

                <p className="text-sm text-gray-300 leading-relaxed mb-4">
                  {skill.purpose}
                </p>

                <p className="text-xs text-gray-500 mb-4">
                  <span className="text-gray-400 font-medium">Use it when:</span>{' '}
                  {skill.useWhen}
                </p>

                <pre className="mt-auto bg-[#0a0a14] border border-white/5 rounded-md p-3 overflow-x-auto">
                  <code className="font-mono text-[11px] text-gray-500 leading-relaxed whitespace-pre">
                    {skill.example}
                  </code>
                </pre>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
