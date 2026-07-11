'use client'

import { useState, useTransition } from 'react'
import { Check, X } from 'lucide-react'
import { answerQuestion, dismissQuestion } from '@/app/portal/marketkit/actions'
import type { MkFounderQuestion } from '@/lib/marketkit/types'

function QuestionRow({ q }: { q: MkFounderQuestion }) {
  const [answer, setAnswer] = useState(q.answer ?? '')
  const [pending, start] = useTransition()
  const [editing, setEditing] = useState(q.status !== 'answered')

  function save() {
    start(async () => {
      await answerQuestion(q.id, answer)
      if (answer.trim()) setEditing(false)
    })
  }

  return (
    <div className="bg-[#0a0a1a] border border-white/[0.06] rounded-lg p-4 space-y-2">
      <p className="text-sm text-white">{q.question}</p>
      {q.why_needed && <p className="text-[11px] text-gray-500">Why it matters: {q.why_needed}</p>}

      {editing ? (
        <div className="space-y-2 pt-1">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={2}
            placeholder="Your answer…"
            className="w-full bg-[#0d0d20] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50"
          />
          <div className="flex gap-2">
            <button
              onClick={save}
              disabled={pending}
              className="inline-flex items-center gap-1.5 button-primary text-white text-xs px-3 py-1.5 rounded-lg disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              {pending ? 'Saving…' : 'Save answer'}
            </button>
            <button
              onClick={() =>
                start(async () => {
                  await dismissQuestion(q.id)
                })
              }
              disabled={pending}
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 disabled:opacity-50"
            >
              <X className="w-3.5 h-3.5" />
              Dismiss
            </button>
          </div>
        </div>
      ) : (
        <div className="pt-1">
          <p className="text-sm text-gray-300 whitespace-pre-wrap">{q.answer}</p>
          <button onClick={() => setEditing(true)} className="text-[11px] text-purple-300 hover:text-purple-200 mt-1">
            Edit answer
          </button>
        </div>
      )}
    </div>
  )
}

export function FounderQuestions({ questions }: { questions: MkFounderQuestion[] }) {
  const open = questions.filter((q) => q.status !== 'dismissed')
  if (open.length === 0) {
    return <p className="text-sm text-gray-500">No questions yet — run the AI scan to generate them.</p>
  }
  const answered = open.filter((q) => q.status === 'answered').length
  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">
        {answered} of {open.length} answered — answers feed into the Launch Kit.
      </p>
      {open.map((q) => (
        <QuestionRow key={q.id} q={q} />
      ))}
    </div>
  )
}
