const CATEGORY_ORDER = ['about', 'tone', 'products', 'pricing', 'faq', 'policies', 'support', 'general', 'other']

export function buildSystemPrompt(
  chatbot: { name: string; client_name?: string; widget_config?: Record<string, unknown> },
  kbEntries: { title: string; content: string; category: string }[]
): string {
  const config = chatbot.widget_config ?? {}
  const fallback = (config.fallback_message as string) ||
    'I\'m not sure about that. Please contact us directly for more details.'

  const customPrompt = (config.system_prompt as string) ||
    `You are ${chatbot.name}, a helpful AI assistant for ${chatbot.client_name || 'our company'}.`

  // Group entries by category
  const grouped: Record<string, string[]> = {}
  for (const entry of kbEntries) {
    if (!grouped[entry.category]) grouped[entry.category] = []
    grouped[entry.category].push(`### ${entry.title}\n${entry.content}`)
  }

  // Build KB text in preferred order
  const categories = [
    ...CATEGORY_ORDER.filter(c => grouped[c]),
    ...Object.keys(grouped).filter(c => !CATEGORY_ORDER.includes(c)),
  ]

  const kbText = categories
    .map(cat => `## ${cat.charAt(0).toUpperCase() + cat.slice(1)}\n\n${grouped[cat].join('\n\n')}`)
    .join('\n\n---\n\n')

  return `${customPrompt}

IMPORTANT RULES:
- Answer questions ONLY based on the knowledge base provided below.
- If the answer is not in the knowledge base, say: "${fallback}"
- Never make up information that is not in the knowledge base.
- Be SHORT and concise. Maximum 3-5 sentences per response. Use bullet points only when listing more than 3 items.
- Do NOT repeat the entire product catalog or service list. Give a brief summary and direct to contact/website for details.
- Respond in the same language as the user's message.

<knowledge_base>
${kbText}
</knowledge_base>`
}
