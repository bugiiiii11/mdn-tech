'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { checkEndpointNow, deleteEndpoint, toggleEndpoint } from '@/app/command-center/techkit/actions'

export function EndpointRowActions({ id, isActive }: { id: string; isActive: boolean }) {
  const [pending, startTransition] = useTransition()
  const [note, setNote] = useState<string | null>(null)

  return (
    <div className="flex items-center justify-end gap-2">
      {note && <span className="max-w-[200px] truncate text-xs text-gray-400" title={note}>{note}</span>}
      <button
        onClick={() =>
          startTransition(async () => {
            setNote('checking…')
            const res = await checkEndpointNow(id)
            setNote(res.error ?? (res.result ? `${res.result.status} · ${res.result.latency_ms ?? '—'}ms` : 'done'))
          })
        }
        disabled={pending}
        className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-xs text-cyan-300 transition-colors hover:bg-cyan-500/20 disabled:opacity-50"
      >
        Check now
      </button>
      <button
        onClick={() =>
          startTransition(async () => {
            const res = await toggleEndpoint(id, !isActive)
            if (res.error) setNote(res.error)
          })
        }
        disabled={pending}
        className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-gray-300 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
      >
        {isActive ? 'Pause' : 'Activate'}
      </button>
      <Link
        href={`/command-center/techkit/endpoints/${id}`}
        className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
      >
        Edit
      </Link>
      <button
        onClick={() => {
          if (!confirm('Delete this endpoint and all its check history?')) return
          startTransition(async () => {
            const res = await deleteEndpoint(id)
            if (res.error) setNote(res.error)
          })
        }}
        disabled={pending}
        className="rounded-md border border-red-500/20 px-2.5 py-1 text-xs text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  )
}
