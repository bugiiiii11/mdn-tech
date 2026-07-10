// Alert delivery: Telegram + Resend email (TECHKIT-BRIEF §6.3).
// Every sender is try/caught — a delivery failure must never crash the poller.
// Returns the list of channels that actually delivered, for alert_events.notified_channels.

export type Severity = 'info' | 'warning' | 'critical'

export interface AlertPayload {
  severity: Severity
  title: string
  message: string
}

// Severity routing (§6.2): critical = email + telegram; warning = telegram; info = in-app only.
export async function deliverAlert(payload: AlertPayload): Promise<string[]> {
  const delivered: string[] = []
  if (payload.severity === 'critical' || payload.severity === 'warning') {
    if (await sendTelegram(`${payload.title}\n${payload.message}`)) delivered.push('telegram')
  }
  if (payload.severity === 'critical') {
    if (await sendEmail(payload.title, payload.message)) delivered.push('email')
  }
  return delivered
}

export async function sendTelegram(text: string): Promise<boolean> {
  const token = Deno.env.get('TELEGRAM_BOT_TOKEN')
  const chatId = Deno.env.get('TELEGRAM_ALERT_CHAT_ID')
  if (!token || !chatId) return false
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // no parse_mode: incident text contains URLs/underscores that break Markdown entity parsing
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
    })
    if (!res.ok) console.error('telegram send failed:', res.status, await res.text())
    return res.ok
  } catch (err) {
    console.error('telegram send error:', err)
    return false
  }
}

export async function sendEmail(subject: string, body: string): Promise<boolean> {
  const apiKey = Deno.env.get('RESEND_API_KEY')
  const to = Deno.env.get('ALERT_EMAIL_TO')
  if (!apiKey || !to) return false
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'TechKit <alerts@mdntech.org>',
        to: to.split(',').map((s) => s.trim()),
        subject,
        html: alertEmailHtml(subject, body),
      }),
    })
    if (!res.ok) console.error('resend send failed:', res.status, await res.text())
    return res.ok
  } catch (err) {
    console.error('resend send error:', err)
    return false
  }
}

// Dark branded template consistent with supabase/email-templates/.
function alertEmailHtml(title: string, body: string): string {
  const lines = body
    .split('\n')
    .map((l) => `<p style="margin:0 0 8px;color:#d1d5db;font-size:14px;line-height:1.6;">${escapeHtml(l)}</p>`)
    .join('')
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background-color:#030014;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#030014;padding:40px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#0d0d20;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:36px;">
          <tr><td>
            <p style="margin:0 0 4px;color:#22d3ee;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-family:monospace;">TechKit alert</p>
            <h1 style="margin:0 0 20px;color:#ffffff;font-size:20px;font-weight:700;">${escapeHtml(title)}</h1>
            ${lines}
            <p style="margin:24px 0 0;font-size:13px;"><a href="https://admin.mdntech.org/command-center/techkit/incidents" style="color:#22d3ee;text-decoration:none;">Open incidents in Command Center &rarr;</a></p>
          </td></tr>
        </table>
        <p style="margin:20px 0 0;color:#4b5563;font-size:11px;">M.D.N Tech &middot; automated TechKit monitoring</p>
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
