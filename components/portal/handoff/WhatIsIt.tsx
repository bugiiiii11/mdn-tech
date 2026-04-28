import { Clock, FileText, AlertTriangle } from 'lucide-react'
import { Reveal } from './Reveal'

const items = [
  {
    icon: Clock,
    problem: '"I waste 10 minutes re-explaining context every session."',
    skill: '/start',
    solution:
      'Reads your handoff file and briefs Claude on the repo state in one command.',
  },
  {
    icon: FileText,
    problem: '"I lose track of what I tried and why."',
    skill: '/wrap',
    solution:
      'Writes a session summary, commits, and pushes — every time. Documentation stays current automatically.',
  },
  {
    icon: AlertTriangle,
    problem: '"Context window dies mid-task."',
    skill: '/save',
    solution:
      'Dumps an emergency snapshot you can resume from in a fresh session. No work lost.',
  },
]

export function WhatIsIt() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <Reveal>
          <div className="text-center mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-purple-400/80 mb-3">
              What it solves
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
              Three pains. One workflow.
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.map(({ icon: Icon, problem, skill, solution }, i) => (
            <Reveal key={skill} delay={0.05 + i * 0.1}>
              <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-colors h-full">
                <Icon className="w-6 h-6 text-purple-400 mb-4" />
                <p className="text-sm text-gray-400 italic mb-4 leading-relaxed">
                  {problem}
                </p>
                <div className="border-t border-white/5 pt-4">
                  <code className="font-mono text-sm text-cyan-300">{skill}</code>
                  <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                    {solution}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
