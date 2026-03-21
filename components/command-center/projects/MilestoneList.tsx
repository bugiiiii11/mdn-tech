'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Circle, Clock, AlertCircle, Plus } from 'lucide-react'

const statusIcon: Record<string, React.ReactNode> = {
  completed:   <CheckCircle2 className="w-4 h-4 text-green-400" />,
  in_progress: <Clock className="w-4 h-4 text-cyan-400" />,
  overdue:     <AlertCircle className="w-4 h-4 text-red-400" />,
  pending:     <Circle className="w-4 h-4 text-gray-500" />,
}

type Milestone = {
  id: string
  name: string
  due_date: string | null
  status: string
  assigned_to: string | null
}

export function MilestoneList({ projectId, milestones: initial }: { projectId: string; milestones: Milestone[] }) {
  const [milestones, setMilestones] = useState(initial)
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDate, setNewDate] = useState('')
  const supabase = createClient()
  const router = useRouter()

  async function addMilestone() {
    if (!newName.trim()) return
    const { data, error } = await supabase
      .from('milestones')
      .insert({ project_id: projectId, name: newName.trim(), due_date: newDate || null, status: 'pending' })
      .select()
      .single()
    if (!error && data) {
      setMilestones(m => [...m, data as Milestone])
      setNewName('')
      setNewDate('')
      setAdding(false)
    }
  }

  async function toggleStatus(id: string, current: string) {
    const next = current === 'completed' ? 'pending' : 'completed'
    await supabase.from('milestones').update({ status: next, ...(next === 'completed' ? { completed_at: new Date().toISOString() } : { completed_at: null }) }).eq('id', id)
    setMilestones(ms => ms.map(m => m.id === id ? { ...m, status: next } : m))
  }

  return (
    <div>
      {milestones.length === 0 && !adding && (
        <div className="px-5 py-8 text-center text-gray-500 text-sm">
          No milestones yet.
        </div>
      )}

      <ul className="divide-y divide-white/5">
        {milestones.map(m => {
          const isOverdue = m.due_date && new Date(m.due_date) < new Date() && m.status !== 'completed'
          const status = isOverdue && m.status !== 'completed' ? 'overdue' : m.status
          return (
            <li key={m.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors">
              <button onClick={() => toggleStatus(m.id, m.status)} className="flex-shrink-0 hover:scale-110 transition-transform">
                {statusIcon[status] ?? statusIcon.pending}
              </button>
              <span className={`text-sm flex-1 ${m.status === 'completed' ? 'text-gray-500 line-through' : 'text-white'}`}>
                {m.name}
              </span>
              {m.due_date && (
                <span className={`text-xs ${isOverdue ? 'text-red-400' : 'text-gray-500'}`}>
                  {new Date(m.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
              )}
            </li>
          )
        })}
      </ul>

      {/* Add milestone */}
      {adding ? (
        <div className="px-5 py-3 border-t border-white/5 flex items-center gap-2">
          <input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addMilestone()}
            placeholder="Milestone name"
            className="flex-1 bg-[#0a0a1a] border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-purple-500/50"
          />
          <input
            type="date"
            value={newDate}
            onChange={e => setNewDate(e.target.value)}
            className="bg-[#0a0a1a] border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-purple-500/50"
          />
          <button onClick={addMilestone} className="px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-lg text-sm hover:bg-purple-500/30 transition-colors">Add</button>
          <button onClick={() => setAdding(false)} className="px-3 py-1.5 text-gray-400 text-sm hover:text-white transition-colors">Cancel</button>
        </div>
      ) : (
        <div className="px-5 py-3 border-t border-white/5">
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-purple-400 transition-colors"
          >
            <Plus className="w-3 h-3" /> Add milestone
          </button>
        </div>
      )}
    </div>
  )
}
