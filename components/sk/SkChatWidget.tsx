import Script from "next/script";

/**
 * Mounts our own ChatKit widget on the Slovak surfaces (rework plan C2).
 *
 * The pitch on /sk is "we build AI chatbots" — so the chatbot IS the demo.
 * A prospect who asks it about pricing or the CRM and gets a straight Slovak
 * answer has seen the product work before they ever fill in the form.
 *
 * GATED ON PURPOSE. Renders nothing unless `NEXT_PUBLIC_SK_CHATBOT_ID` is
 * set in the environment, because a half-trained bot answering a paying
 * prospect badly is worse than no bot at all. Go-live is:
 *   1. seed the bot + knowledge base: `node scripts/seed-sk-chatbot.mjs`
 *   2. read its answers in the Command Center and fix what is wrong
 *   3. add `allowed_domains = ["mdntech.org", "www.mdntech.org"]` to the row
 *   4. set NEXT_PUBLIC_SK_CHATBOT_ID in Vercel Production and redeploy
 *
 * `afterInteractive` deliberately: the widget must never compete with the
 * hero for main-thread time on a mobile connection — LCP on /sk is the
 * number the campaign is judged on.
 *
 * The src is RELATIVE on purpose. Customer sites load this from an absolute
 * URL, but our own pages run under `script-src 'self'` (next.config.js), and
 * www.mdntech.org is a separate origin as far as CSP is concerned — an
 * absolute www URL here is blocked outright and the widget never appears.
 * Same-origin also keeps the API calls inside `connect-src 'self'`.
 */
export const SkChatWidget = () => {
  const chatbotId = process.env.NEXT_PUBLIC_SK_CHATBOT_ID;
  if (!chatbotId) return null;

  return (
    <Script
      src="/widget.js"
      data-chatbot-id={chatbotId}
      strategy="afterInteractive"
    />
  );
};
