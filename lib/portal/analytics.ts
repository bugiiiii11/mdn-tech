import { SupabaseClient } from '@supabase/supabase-js';

const STOPWORDS = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours',
  'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself',
  'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which',
  'who', 'whom', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most',
  'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than',
  'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'is', 'are',
  'am', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
  'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'the', 'a', 'an',
  'and', 'or', 'if', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with',
  'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above',
  'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again',
  'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'yes', 'no',
  'please', 'thanks', 'thank', 'ok', 'okay', 'hi', 'hello', 'hey', 'thanks', 'thankyou',
  'thats', 'that', 'this', 'these', 'those', 'hows', 'whats', 'wheres', 'whos', 'whose',
]);

export interface ChatbotAnalytics {
  totalMessages: number;
  totalConversations: number;
  avgMessagesPerConv: number;
  fallbackCount: number;
  fallbackRate: number;
}

export interface MessageTrendPoint {
  date: string;
  count: number;
}

export interface Keyword {
  word: string;
  count: number;
}

export interface ConversationExport {
  conversationId: string;
  visitorId: string;
  startedAt: string;
  sourceUrl: string;
  messages: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }[];
}

/**
 * Get analytics for a single chatbot (messages, conversations, fallback rate)
 */
export async function getChatbotAnalytics(
  supabase: SupabaseClient,
  chatbotId: string,
  fallbackMessage: string
): Promise<ChatbotAnalytics> {
  // Get conversation stats
  const { data: conversations } = await supabase
    .from('chat_conversations')
    .select('id, message_count')
    .eq('chatbot_id', chatbotId);

  const totalConversations = conversations?.length || 0;
  const totalMessages = conversations?.reduce((sum, c) => sum + c.message_count, 0) || 0;
  const avgMessagesPerConv = totalConversations > 0 ? totalMessages / totalConversations : 0;

  // Count fallback messages (where bot's response contains the fallback message)
  const { data: assistantMessages } = await supabase
    .from('chat_messages')
    .select('id, content')
    .eq('chatbot_id', chatbotId)
    .eq('role', 'assistant');

  const fallbackMessages = assistantMessages?.filter((msg) =>
    msg.content.toLowerCase().includes(fallbackMessage.toLowerCase())
  ) || [];

  const fallbackCount = fallbackMessages.length;
  const totalAssistantMessages = assistantMessages?.length || 0;
  const fallbackRate =
    totalAssistantMessages > 0 ? (fallbackCount / totalAssistantMessages) * 100 : 0;

  return {
    totalMessages,
    totalConversations,
    avgMessagesPerConv: Math.round(avgMessagesPerConv * 10) / 10,
    fallbackCount,
    fallbackRate: Math.round(fallbackRate * 10) / 10,
  };
}

/**
 * Get message count trend over the past N days
 */
export async function getMessagesTrend(
  supabase: SupabaseClient,
  chatbotId: string,
  days: number = 7
): Promise<MessageTrendPoint[]> {
  const { data: messages } = await supabase
    .from('chat_messages')
    .select('created_at')
    .eq('chatbot_id', chatbotId)
    .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

  const trendMap = new Map<string, number>();

  // Initialize all days with 0
  for (let i = 0; i < days; i++) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    trendMap.set(dateStr, 0);
  }

  // Count messages per day
  messages?.forEach((msg) => {
    const dateStr = new Date(msg.created_at).toISOString().split('T')[0];
    trendMap.set(dateStr, (trendMap.get(dateStr) || 0) + 1);
  });

  // Convert to array, sort by date ascending, format date as "Mon 15"
  return Array.from(trendMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([dateStr, count]) => {
      const date = new Date(dateStr);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const day = date.getDate();
      return {
        date: `${dayName} ${day}`,
        count,
      };
    });
}

/**
 * Extract top keywords from user messages
 */
export async function getTopKeywords(
  supabase: SupabaseClient,
  chatbotId: string,
  limit: number = 10
): Promise<Keyword[]> {
  const { data: userMessages } = await supabase
    .from('chat_messages')
    .select('content')
    .eq('chatbot_id', chatbotId)
    .eq('role', 'user');

  const wordCount = new Map<string, number>();

  userMessages?.forEach((msg) => {
    const words: string[] = msg.content
      .toLowerCase()
      .split(/[\s\p{P}]+/u)
      .filter((word: string) => word.length > 2 && !STOPWORDS.has(word));

    words.forEach((word: string) => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    });
  });

  return Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }));
}

/**
 * Export all conversations as markdown
 */
export async function exportConversationsMarkdown(
  supabase: SupabaseClient,
  chatbotId: string,
  chatbotName: string
): Promise<string> {
  const { data: conversations } = await supabase
    .from('chat_conversations')
    .select('id, visitor_id, source_url, started_at')
    .eq('chatbot_id', chatbotId)
    .order('started_at', { ascending: false });

  let markdown = `# ${chatbotName} — Conversations Export\n`;
  markdown += `Generated: ${new Date().toLocaleString()}\n\n`;

  if (!conversations || conversations.length === 0) {
    markdown += 'No conversations found.\n';
    return markdown;
  }

  for (const conv of conversations) {
    const { data: messages } = await supabase
      .from('chat_messages')
      .select('role, content, created_at')
      .eq('conversation_id', conv.id)
      .order('created_at', { ascending: true });

    const startDate = new Date(conv.started_at).toLocaleString();
    markdown += `---\n\n`;
    markdown += `## Conversation — ${startDate}\n`;
    markdown += `**Visitor:** ${conv.visitor_id} | **Source:** ${conv.source_url || 'unknown'}\n\n`;

    messages?.forEach((msg) => {
      const time = new Date(msg.created_at).toLocaleTimeString();
      const role = msg.role === 'user' ? '👤 User' : '🤖 Bot';
      markdown += `**${role}** (${time}): ${msg.content}\n\n`;
    });
  }

  return markdown;
}

/**
 * Get conversations with messages for the conversation viewer
 */
export async function getConversationsWithMessages(
  supabase: SupabaseClient,
  chatbotId: string,
  fallbackMessage: string,
  filter: 'all' | 'fallback' | 'untagged' = 'all'
) {
  let query = supabase
    .from('chat_conversations')
    .select(
      `
      id,
      visitor_id,
      source_url,
      started_at,
      message_count,
      chat_messages(id, role, content, created_at),
      message_feedback(id, rating)
    `
    )
    .eq('chatbot_id', chatbotId)
    .order('started_at', { ascending: false });

  const { data: conversations } = await query;

  if (!conversations) return [];

  return conversations.filter((conv) => {
    const messages = conv.chat_messages as any[];
    if (!messages) return true;

    if (filter === 'fallback') {
      return messages.some(
        (msg) =>
          msg.role === 'assistant' &&
          msg.content.toLowerCase().includes(fallbackMessage.toLowerCase())
      );
    }

    if (filter === 'untagged') {
      const feedback = conv.message_feedback as any[];
      return messages.some((msg) => {
        const hasRating = feedback?.some((f) => f.id === msg.id);
        return !hasRating;
      });
    }

    return true;
  });
}
