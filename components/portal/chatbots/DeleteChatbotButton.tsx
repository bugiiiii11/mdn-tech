'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trash2 } from 'lucide-react'

export function DeleteChatbotButton({ chatbotId, chatbotName, userId }: { chatbotId: string; chatbotName: string; userId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${chatbotName}"? This cannot be undone.`)) return

    setDeleting(true)
    const { error } = await supabase.from('chatbots').delete().eq('id', chatbotId).eq('owner_id', userId)

    if (error) {
      alert(`Error: ${error.message}`)
      setDeleting(false)
      return
    }

    router.push('/portal/chatkit')
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
      title="Delete chatbot"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
