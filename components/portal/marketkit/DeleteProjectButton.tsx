'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { deleteProject } from '@/app/portal/marketkit/actions'

export function DeleteProjectButton({ projectId, projectName }: { projectId: string; projectName: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function onDelete() {
    start(async () => {
      const res = await deleteProject(projectId)
      if (res?.error) {
        setError(res.error)
        return
      }
      router.push('/portal/marketkit')
      router.refresh()
    })
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="inline-flex items-center gap-1.5 text-sm text-red-400 border border-red-500/30 hover:bg-red-500/10 rounded-lg px-4 py-2 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
        Delete project
      </button>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-300">
        Delete <span className="font-medium text-white">{projectName}</span> and everything in it?
      </p>
      <div className="flex gap-2">
        <button
          onClick={onDelete}
          disabled={pending}
          className="inline-flex items-center gap-1.5 text-sm text-white bg-red-500/80 hover:bg-red-500 rounded-lg px-4 py-2 disabled:opacity-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          {pending ? 'Deleting…' : 'Yes, delete'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={pending}
          className="text-sm text-gray-300 border border-white/10 hover:border-white/20 rounded-lg px-4 py-2 transition-colors"
        >
          Cancel
        </button>
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}
