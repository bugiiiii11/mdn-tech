import Anthropic from '@anthropic-ai/sdk'
import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { isFeatureUnlocked, type FeatureUnlocks } from '@/lib/portal/plans'
import { extractKeywords, type Keyword } from '@/lib/portal/analytics'

// Weekly report generation pass. Two callers:
//  - Monday pg_cron (migration 019) with Bearer CHATKIT_CRON_SECRET -> all
//    reports-unlocked chatbots.
//  - Chatbot owner ("Run now" on the detail page) with {chatbotId} -> that
//    bot only, after ownership + unlock checks.
//
// For each bot: aggregate the last 7 days vs the 7 days before (conversations,
// replies, fallback rate, ratings, top keywords) -> Claude drafts a short
// narrative -> upsert chatbot_reports + email the owner via Resend.

export const dynamic = 'force-dynamic'
export const maxDuration = 120

const WINDOW_DAYS = 7
const TOP_KEYWORDS = 8
const POSITIVE_RATINGS = ['correct', 'helpful']
const DEFAULT_FALLBACK =
  "I'm not sure about that. Please contact us directly for more details."

type ReportBot = {
  id: string
  name: string
  owner_id: string
  feature_unlocks: FeatureUnlocks | null
  widget_config: { fallback_message?: string } | null
}

type ReportStats = {
  conversations: { week: number; prev: number }
  replies: { week: number; prev: number }
  fallbacks: { week: number; prev: number; rate_pct: number | null; prev_rate_pct: number | null }
  ratings: { positive: number; negative: number }
  top_keywords: Keyword[]
}

const BOT_COLUMNS = 'id, name, owner_id, feature_unlocks, widget_config'

export async function POST(request: NextRequest) {
  const cronSecret = process.env.CHATKIT_CRON_SECRET
  const authHeader = request.headers.get('authorization') ?? ''
  const isCron = Boolean(cronSecret) && authHeader === `Bearer ${cronSecret}`

  let body: { chatbotId?: string } = {}
  try {
    body = await request.json()
  } catch {
    // empty body is fine (cron sends {"source":"cron"})
  }

  const service = createServiceClient()

  let bots: ReportBot[] = []
  if (isCron) {
    const { data } = await service
      .from('chatbots')
      .select(BOT_COLUMNS)
      .eq('status', 'active')
      .not('owner_id', 'is', null)
    bots = ((data ?? []) as ReportBot[]).filter((c) =>
      isFeatureUnlocked(c.feature_unlocks, 'reports')
    )
  } else {
    // Owner-triggered manual run
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!body.chatbotId) return NextResponse.json({ error: 'Missing chatbotId' }, { status: 400 })

    const { data: chatbot } = await service
      .from('chatbots')
      .select(BOT_COLUMNS)
      .eq('id', body.chatbotId)
      .single()

    if (!chatbot || chatbot.owner_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (!isFeatureUnlocked(chatbot.feature_unlocks as FeatureUnlocks, 'reports')) {
      return NextResponse.json({ error: 'Weekly reports are not unlocked for this chatbot' }, { status: 403 })
    }
    bots = [chatbot as ReportBot]
  }

  const results: { chatbotId: string; report: boolean; emailed: boolean; skipped?: string }[] = []

  for (const bot of bots) {
    try {
      const outcome = await runForChatbot(service, bot)
      results.push({ chatbotId: bot.id, ...outcome })
    } catch (err) {
      results.push({
        chatbotId: bot.id,
        report: false,
        emailed: false,
        skipped: err instanceof Error ? err.message : 'unknown error',
      })
    }
  }

  return NextResponse.json({ processed: bots.length, results })
}

async function runForChatbot(
  service: ReturnType<typeof createServiceClient>,
  bot: ReportBot
): Promise<{ report: boolean; emailed: boolean; skipped?: string }> {
  const now = Date.now()
  const periodStart = new Date(now - WINDOW_DAYS * 24 * 60 * 60 * 1000)
  const prevStart = new Date(now - 2 * WINDOW_DAYS * 24 * 60 * 60 * 1000)
  const periodEnd = new Date(now)

  const [{ data: conversations }, { data: messages }, { data: feedback }] = await Promise.all([
    service
      .from('chat_conversations')
      .select('started_at')
      .eq('chatbot_id', bot.id)
      .gte('started_at', prevStart.toISOString()),
    service
      .from('chat_messages')
      .select('role, content, created_at')
      .eq('chatbot_id', bot.id)
      .gte('created_at', prevStart.toISOString()),
    service
      .from('message_feedback')
      .select('rating')
      .eq('chatbot_id', bot.id)
      .gte('created_at', periodStart.toISOString()),
  ])

  const sinceIso = periodStart.toISOString()
  const inWeek = (ts: string) => ts >= sinceIso

  const convWeek = (conversations ?? []).filter((c) => inWeek(c.started_at)).length
  const convPrev = (conversations ?? []).length - convWeek

  const fallbackMsg = (bot.widget_config?.fallback_message || DEFAULT_FALLBACK).toLowerCase()
  let repliesWeek = 0
  let repliesPrev = 0
  let fallbacksWeek = 0
  let fallbacksPrev = 0
  const userTextsWeek: string[] = []

  for (const msg of messages ?? []) {
    const week = inWeek(msg.created_at)
    if (msg.role === 'assistant') {
      const isFallback = msg.content.toLowerCase().includes(fallbackMsg)
      if (week) {
        repliesWeek++
        if (isFallback) fallbacksWeek++
      } else {
        repliesPrev++
        if (isFallback) fallbacksPrev++
      }
    } else if (msg.role === 'user' && week) {
      userTextsWeek.push(msg.content)
    }
  }

  if (convWeek === 0 && repliesWeek === 0) {
    return { report: false, emailed: false, skipped: 'no activity this week' }
  }

  const positive = (feedback ?? []).filter((f) => POSITIVE_RATINGS.includes(f.rating)).length
  const negative = (feedback ?? []).length - positive

  const rate = (fallbacks: number, replies: number) =>
    replies > 0 ? Math.round((fallbacks / replies) * 1000) / 10 : null

  const stats: ReportStats = {
    conversations: { week: convWeek, prev: convPrev },
    replies: { week: repliesWeek, prev: repliesPrev },
    fallbacks: {
      week: fallbacksWeek,
      prev: fallbacksPrev,
      rate_pct: rate(fallbacksWeek, repliesWeek),
      prev_rate_pct: rate(fallbacksPrev, repliesPrev),
    },
    ratings: { positive, negative },
    top_keywords: extractKeywords(userTextsWeek, TOP_KEYWORDS),
  }

  const summary = await draftNarrative(bot.name, stats)

  const periodStartDate = periodStart.toISOString().slice(0, 10)
  const periodEndDate = periodEnd.toISOString().slice(0, 10)

  const { error: upsertErr } = await service.from('chatbot_reports').upsert(
    {
      chatbot_id: bot.id,
      period_start: periodStartDate,
      period_end: periodEndDate,
      stats,
      summary,
      email_sent: false,
    },
    { onConflict: 'chatbot_id,period_start' }
  )
  if (upsertErr) throw new Error(`report upsert failed: ${upsertErr.message}`)

  const emailed = await sendReportEmail(service, bot, stats, summary, periodStartDate, periodEndDate)
  if (emailed) {
    await service
      .from('chatbot_reports')
      .update({ email_sent: true })
      .eq('chatbot_id', bot.id)
      .eq('period_start', periodStartDate)
  }

  return { report: true, emailed }
}

async function draftNarrative(botName: string, stats: ReportStats): Promise<string | null> {
  try {
    const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_CHATBOT_API_KEY })
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [
        {
          role: 'user',
          content: `You write the narrative for a weekly performance report of a website support chatbot named "${botName}". This week's stats vs the previous week (JSON):

${JSON.stringify(stats)}

fallbacks = replies where the bot could not answer and showed its fallback message. ratings = owner ratings of individual replies. top_keywords = most frequent words in visitor questions.

Write 2-4 plain sentences for the chatbot's owner: how the week went, the most notable change vs last week, and one concrete, actionable suggestion (e.g. a knowledge-base topic to add based on keywords or fallbacks). No greeting, no sign-off, no markdown, no hype.`,
        },
      ],
    })
    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim()
    return text || null
  } catch (err) {
    console.error('report narrative failed:', err)
    return null // email still goes out stats-only
  }
}

// --- Email -------------------------------------------------------------------

async function sendReportEmail(
  service: ReturnType<typeof createServiceClient>,
  bot: ReportBot,
  stats: ReportStats,
  summary: string | null,
  periodStart: string,
  periodEnd: string
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return false

  const { data: customer } = await service
    .from('customers')
    .select('email')
    .eq('id', bot.owner_id)
    .maybeSingle()
  if (!customer?.email) return false

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'ChatKit <reports@mdntech.org>',
        to: [customer.email],
        subject: `${bot.name} — weekly chatbot report (${periodStart} to ${periodEnd})`,
        html: reportEmailHtml(bot, stats, summary, periodStart, periodEnd),
      }),
    })
    if (!res.ok) console.error('report email failed:', res.status, await res.text())
    return res.ok
  } catch (err) {
    console.error('report email error:', err)
    return false
  }
}

function delta(week: number, prev: number): string {
  if (prev === 0) return week > 0 ? 'new' : '—'
  const pct = Math.round(((week - prev) / prev) * 100)
  return `${pct >= 0 ? '+' : ''}${pct}% WoW`
}

// Dark branded template consistent with supabase/email-templates/ and the
// TechKit alert email.
function reportEmailHtml(
  bot: ReportBot,
  stats: ReportStats,
  summary: string | null,
  periodStart: string,
  periodEnd: string
): string {
  const statRow = (label: string, value: string, sub: string) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#9ca3af;font-size:13px;">${label}</td>
      <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#ffffff;font-size:15px;font-weight:600;text-align:right;">${value}</td>
      <td style="padding:10px 0 10px 12px;border-bottom:1px solid rgba(255,255,255,0.06);color:#6b7280;font-size:12px;text-align:right;white-space:nowrap;">${sub}</td>
    </tr>`

  const fallbackRate = stats.fallbacks.rate_pct !== null ? `${stats.fallbacks.rate_pct}%` : '—'
  const prevRate = stats.fallbacks.prev_rate_pct !== null ? `was ${stats.fallbacks.prev_rate_pct}%` : '—'
  const ratingsTotal = stats.ratings.positive + stats.ratings.negative

  const keywords = stats.top_keywords.length
    ? `<p style="margin:20px 0 6px;color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Visitors asked about</p>
       <p style="margin:0;color:#d1d5db;font-size:13px;line-height:1.8;">${stats.top_keywords
         .map((k) => `<span style="display:inline-block;background:rgba(168,85,247,0.12);border:1px solid rgba(168,85,247,0.25);border-radius:6px;padding:2px 8px;margin:0 6px 6px 0;">${escapeHtml(k.word)} · ${k.count}</span>`)
         .join('')}</p>`
    : ''

  const narrative = summary
    ? `<p style="margin:20px 0 0;color:#d1d5db;font-size:14px;line-height:1.7;">${escapeHtml(summary)}</p>`
    : ''

  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background-color:#030014;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#030014;padding:40px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#0d0d20;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:36px;">
          <tr><td>
            <p style="margin:0 0 4px;color:#c084fc;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-family:monospace;">ChatKit weekly report</p>
            <h1 style="margin:0 0 4px;color:#ffffff;font-size:20px;font-weight:700;">${escapeHtml(bot.name)}</h1>
            <p style="margin:0 0 20px;color:#6b7280;font-size:12px;">${periodStart} to ${periodEnd}</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${statRow('Conversations', String(stats.conversations.week), delta(stats.conversations.week, stats.conversations.prev))}
              ${statRow('Bot replies', String(stats.replies.week), delta(stats.replies.week, stats.replies.prev))}
              ${statRow('Fallback rate', fallbackRate, prevRate)}
              ${statRow('Rated replies', String(ratingsTotal), ratingsTotal > 0 ? `${stats.ratings.positive} positive · ${stats.ratings.negative} negative` : '—')}
            </table>
            ${keywords}
            ${narrative}
            <p style="margin:24px 0 0;font-size:13px;"><a href="https://app.mdntech.org/portal/chatkit/${bot.id}" style="color:#c084fc;text-decoration:none;">Open dashboard &rarr;</a></p>
          </td></tr>
        </table>
        <p style="margin:20px 0 0;color:#4b5563;font-size:11px;">M.D.N Tech &middot; ChatKit weekly reports</p>
      </td></tr>
    </table>
  </body>
</html>`
}

function escapeHtml(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}
