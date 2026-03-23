'use client'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  input_tokens: number | null
  output_tokens: number | null
  latency_ms: number | null
  created_at: string
}

export function ConversationThread({ messages }: { messages: Message[] }) {
  return (
    <div className="space-y-3">
      {messages.map(msg => (
        <div
          key={msg.id}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] rounded-xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-purple-500/20 text-white'
                : 'bg-white/5 text-gray-300'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-600">
              <span>{new Date(msg.created_at).toLocaleTimeString()}</span>
              {msg.role === 'assistant' && msg.input_tokens != null && (
                <>
                  <span>{msg.input_tokens + (msg.output_tokens ?? 0)} tokens</span>
                  {msg.latency_ms != null && <span>{(msg.latency_ms / 1000).toFixed(1)}s</span>}
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
