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
- Respond in the same language as the user's message.

RESPONSE STYLE (CRITICAL):
- Maximum 2-3 short sentences per answer. Never more.
- NO bullet point lists, NO numbered lists, NO headers, NO markdown formatting.
- Give only the direct answer to what was asked. Nothing extra.
- Do NOT list all categories, services, or products. Only mention what is directly relevant.
- Do NOT add emojis.
- End with a single short call-to-action (phone number or website) only when relevant.
- Think of yourself as a busy professional giving quick, helpful answers over chat.

<knowledge_base>
${kbText}
</knowledge_base>`
}
