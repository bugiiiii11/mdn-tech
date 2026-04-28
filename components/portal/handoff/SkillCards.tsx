import { ExternalLink } from 'lucide-react'
import { Reveal } from './Reveal'

interface Skill {
  name: string
  purpose: string
  useWhen: string
  example: string
  sourceUrl: string
}

const skills: Skill[] = [
  {
    name: '/start',
    purpose: 'Session initialization — reads handoff, checks repo state, surfaces emergency snapshots, presents a briefing.',
    useWhen: 'At the beginning of every session — Claude needs the briefing before suggesting next steps.',
    example: '> /start\n\nSession Briefing\nLast session: 21 — Strategic pivot...\nUnpushed: 0 · Last commit: a594d6f',
    sourceUrl: 'https://github.com/bugiiiii11/handoff/blob/main/skills/start/SKILL.md',
  },
  {
    name: '/wrap',
    purpose: 'Auto-detects dirty repos, commits and pushes if needed, updates handoff.md and decisions.md when stale.',
    useWhen: 'Mid-session checkpoint or end-of-session cleanup — safe to call anytime.',
    example: '> /wrap\n\nWorking tree dirty\nProposed commit: feat: install block\nDocs stale? handoff.md needs entry.',
    sourceUrl: 'https://github.com/bugiiiii11/handoff/blob/main/skills/wrap/SKILL.md',
  },
  {
    name: '/save',
    purpose: 'Emergency context save — dumps session state to emergency-snapshot.md before compaction hits.',
    useWhen: 'When context is running low (80%+) and you need to preserve what happened this session.',
    example: '> /save\n\nWriting emergency-snapshot.md...\n✓ Saved. /start in next session resumes.',
    sourceUrl: 'https://github.com/bugiiiii11/handoff/blob/main/skills/save/SKILL.md',
  },
  {
    name: '/doc-update',
    purpose: 'Smart doc updater — refreshes handoff.md, decisions.md, and project docs based on actual session work.',
    useWhen: 'After a focused chunk of work, before /wrap, when you want the docs to reflect reality.',
    example: '> /doc-update\n\nhandoff.md → adding Session 22 entry\ndecisions.md → no new decisions',
    sourceUrl: 'https://github.com/bugiiiii11/handoff/blob/main/skills/doc-update/SKILL.md',
  },
]

export function SkillCards() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <Reveal>
          <div className="text-center mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-purple-400/80 mb-3">
              The four skills
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
