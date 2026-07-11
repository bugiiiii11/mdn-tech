'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { UploadCloud, FileText, Image as ImageIcon, Table, Trash2 } from 'lucide-react'
import type { MkAsset } from '@/lib/marketkit/types'

const BUCKET = 'marketkit-assets'

function inferKind(name: string): MkAsset['kind'] {
  const ext = name.toLowerCase().split('.').pop() ?? ''
  if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)) return 'screenshot'
  if (['csv', 'json', 'xlsx', 'xls'].includes(ext)) return 'data'
  return 'doc'
}

function kindIcon(kind: MkAsset['kind']) {
  if (kind === 'screenshot' || kind === 'logo') return <ImageIcon className="w-4 h-4 text-purple-300" />
  if (kind === 'data') return <Table className="w-4 h-4 text-cyan-300" />
  return <FileText className="w-4 h-4 text-gray-300" />
}

export function AssetUploader({ projectId, assets }: { projectId: string; assets: MkAsset[] }) {
  const router = useRouter()
  const supabase = createClient()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function uploadFiles(files: FileList | File[]) {
    setBusy(true)
    setError(null)
    try {
      for (const file of Array.from(files)) {
        const safe = file.name.replace(/[^\w.\-]+/g, '_').slice(-80)
        const id = crypto.randomUUID()
        const path = `mk/${projectId}/${id}-${safe}`
        const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false })
        if (upErr) throw new Error(`${file.name}: ${upErr.message}`)
        const { error: rowErr } = await supabase.from('mk_project_assets').insert({
          project_id: projectId,
          kind: inferKind(file.name),
          storage_path: path,
          filename: file.name,
        })
        if (rowErr) throw new Error(`${file.name}: ${rowErr.message}`)
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'upload failed')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function remove(asset: MkAsset) {
    setBusy(true)
    setError(null)
    try {
      await supabase.storage.from(BUCKET).remove([asset.storage_path])
      const { error: delErr } = await supabase.from('mk_project_assets').delete().eq('id', asset.id)
      if (delErr) throw new Error(delErr.message)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'delete failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-xl border border-dashed p-6 text-center transition-colors ${
          dragging ? 'border-purple-400/60 bg-purple-500/5' : 'border-white/15 hover:border-white/30'
        }`}
      >
        <UploadCloud className="w-6 h-6 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-300">{busy ? 'Uploading…' : 'Drop files or click to upload'}</p>
        <p className="text-[11px] text-gray-500 mt-1">Screenshots, logos, docs, data (CSV/JSON). The scan reads these.</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      {assets.length > 0 && (
        <ul className="space-y-1.5">
          {assets.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between gap-3 px-3 py-2 bg-[#0a0a1a] border border-white/[0.06] rounded-lg"
            >
              <div className="flex items-center gap-2 min-w-0">
                {kindIcon(a.kind)}
                <span className="text-sm text-gray-200 truncate">{a.filename ?? a.storage_path}</span>
                <span className="text-[10px] uppercase tracking-wider font-mono text-gray-500">{a.kind}</span>
              </div>
              <button
                onClick={() => remove(a)}
                disabled={busy}
                className="text-gray-500 hover:text-red-400 transition-colors disabled:opacity-40"
                aria-label="Remove asset"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
