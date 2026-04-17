export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PortalShell } from '@/components/portal/PortalShell'
import { Download, Zap } from 'lucide-react'
import Link from 'next/link'
import { TrendChart } from '@/components/portal/analytics/TrendChart'
import { KeywordsBar } from '@/components/portal/analytics/KeywordsBar'
import {
  getChatbotAnalytics,
  getMessagesTrend,
  getTopKeywords,
} from '@/lib/portal/analytics'

export default async function PortalDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  // Fetch customer profile
  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  // Fetch customer's chatbots
  const { data: chatbots } = await supabase
    .from('chatbots')
    .select('id, name, widget_config')
    .eq('owner_id', user.id)

  const firstName = customer?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'there'

  let analytics = { totalMessages: 0, totalConversations: 0, avgMessagesPerConv: 0, fallbackCount: 0, fallbackRate: 0 }
  let trend: any[] = []
  let keywords: any[] = []
  let totalChatbots = chatbots?.length || 0

  // If customer has chatbots, aggregate analytics
  if (chatbots && chatbots.length > 0) {
    try {
      const allAnalytics = await Promise.all(
        chatbots.map(bot => {
          const fallbackMsg = (bot.widget_config as any)?.fallback_message || 'I\'m not sure about that'
          return getChatbotAnalytics(supabase, bot.id, fallbackMsg)
        })
      )

      analytics = {
        totalMessages: allAnalytics.reduce((sum, a) => sum + a.totalMessages, 0),
        totalConversations: allAnalytics.reduce((sum, a) => sum + a.totalConversations, 0),
        avgMessagesPerConv: allAnalytics.length > 0
          ? Math.round((allAnalytics.reduce((sum, a) => sum + a.avgMessagesPerConv, 0) / allAnalytics.length) * 10) / 10
          : 0,
        fallbackCount: allAnalytics.reduce((sum, a) => sum + a.fallbackCount, 0),
        fallbackRate: allAnalytics.length > 0
          ? Math.round((allAnalytics.reduce((sum, a) => sum + a.fallbackRate, 0) / allAnalytics.length) * 10) / 10
          : 0,
      }

      // Get trend for first chatbot (most recent)
      const primaryBot = chatbots[0]
      const primaryFallback = (primaryBot.widget_config as any)?.fallback_message || 'I\'m not sure about that'
      trend = await getMessagesTrend(supabase, primaryBot.id, 7)
      keywords = await getTopKeywords(supabase, primaryBot.id, 10)
    } catch (error) {
      console.error('Dashboard analytics error:', error)
    }
  }

  const hasConversations = analytics.totalConversations > 0
  const primaryChatbotId = chatbots?.[0]?.id

  return (
    <PortalShell>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">ChatBot Analytics</h1>
            <p className="text-gray-400 text-sm mt-0.5">Welcome back, {firstName}</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
            <Zap size={16} />
            Upgrade to Pro
          </button>
        </div>

        {/* Metrics cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Total Messages</p>
            <p className="text-3xl font-bold text-white">{analytics.totalMessages}</p>
            <p className="text-xs text-gray-500 mt-2">across all chatbots</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Conversations</p>
            <p className="text-3xl font-bold text-white">{analytics.totalConversations}</p>
            <p className="text-xs text-gray-500 mt-2">unique visitors</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Fallback Rate</p>
            <p className="text-3xl font-bold text-white">{analytics.fallbackRate}%</p>
            <p className="text-xs text-gray-500 mt-2">{analytics.fallbackCount} didn&apos;t-know responses</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Avg Messages</p>
            <p className="text-3xl font-bold text-white">{analytics.avgMessagesPerConv}</p>
            <p className="text-xs text-gray-500 mt-2">per conversation</p>
          </div>
        </div>

        {/* Charts */}
        {hasConversations && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrendChart data={trend} title="Messages over 7 days" />
            <KeywordsBar keywords={keywords} title="Top keywords asked about" />
          </div>
        )}

        {!hasConversations && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400">No conversations yet</p>
            <p className="text-sm text-gray-500 mt-1">Deploy a chatbot to start seeing analytics</p>
          </div>
        )}

        {/* Actions */}
        {primaryChatbotId && hasConversations && (
          <div className="flex gap-3">
            <a
              href={`/api/portal/chatbot/${primaryChatbotId}/export`}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-700 transition-colors"
            >
              <Download size={16} />
              Export as Markdown
            </a>
          </div>
        )}

        {/* Chatbots */}
        {totalChatbots > 0 && (
          <div>
            <h2 className="text-sm font-medium text-gray-400 mb-3">Your Chatbots ({totalChatbots})</h2>
            <div className="space-y-2">
              {chatbots?.map(bot => (
                <Link
                  key={bot.id}
                  href={`/portal/chatkit/${bot.id}`}
                  className="block p-3 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors"
                >
                  <p className="font-medium text-white">{bot.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">View settings & KB entries →</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </PortalShell>
  )
}
