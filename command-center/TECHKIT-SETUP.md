# TechKit go-live runbook (Session A → A4/A8 manual steps)

> ✅ **COMPLETED 2026-07-10 (Session 34) — monitoring is LIVE, A8 kill test passed.**
> Executed mostly via the Supabase Management API (`SUPABASE_MANAGEMENT_API_KEY`) rather than
> SQL editor + CLI: migrations 009+010 applied remotely, `techkit-poller` deployed through the
> multipart deploy endpoint (no CLI install), secrets set via `/v1/projects/{ref}/secrets`.
> Deviations/learnings: (a) the SQL query endpoint can double-execute at the HTTP layer — after
> any error, audit actual DB state, don't trust the response; (b) local `curl.exe` fails on this
> machine's TLS interception — use `Invoke-RestMethod`/.NET `HttpClient`; (c) the Telegram chat id
> must come from `getUpdates` *after messaging the bot* (the bot's own id gives 403); (d) the 4
> mdntech.org endpoints needed a post-seed `project_id` link fix (`ilike '%mdn%tech%'` can't match
> the dotted `M.D.N Tech` name). Alert recipient: `contact@mdntech.org`.
> Kept below for reference + the **Known issues** section, which is still open for Session B.

Everything code-side is committed; these are the manual steps to turn monitoring on.
Order matters. Companion doc: `TECHKIT-BRIEF.md` (§12 secrets table, §13 exit criteria).

## 1. Apply migrations (Supabase SQL editor, project `ijfgwzacaabzeknlpaff`)

1. Run `supabase/migrations/009_techkit.sql` — tables + RLS + rollup RPC + seed roster + A2 project-key fixes.
2. Verify: `select name, url, is_active, project_id from monitored_endpoints order by name;`
   — expect 9 rows (7 active, Royal Works + Swarm Resistance inactive). Check `project_id` links resolved.
3. Do **not** run 010 yet (needs the deployed function + Vault secret first).

## 2. Create accounts / keys (Martin)

| What | How | Feeds |
|------|-----|-------|
| Telegram bot | @BotFather → `/newbot` (e.g. `mdn_techkit_bot`) → copy token. Then message the bot once, and get your chat id via `https://api.telegram.org/bot<TOKEN>/getUpdates` (the `chat.id` field). | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ALERT_CHAT_ID` |
| Resend API key | resend.com dashboard → API Keys → create **sending-only** key (domain `mdntech.org` is already verified). | `RESEND_API_KEY` |
| CRON_SECRET | Generate: `openssl rand -hex 32` (or any long random string). | Edge Function secret + Vault + (optionally) Vercel env |
| Alert recipient | Decide: just Martin or also CTO (brief §15 Q3). | `ALERT_EMAIL_TO` |

Note: `alerts@mdntech.org` is used as the From address — Resend's verified domain covers any
`@mdntech.org` sender, no extra setup needed.

## 3. Deploy the Edge Function + set secrets

Requires the Supabase CLI (`npm i -g supabase`, then `supabase login`).

```bash
cd M.D.N-Tech-main
supabase link --project-ref ijfgwzacaabzeknlpaff
supabase secrets set CRON_SECRET=<value> \
  TELEGRAM_BOT_TOKEN=<value> TELEGRAM_ALERT_CHAT_ID=<value> \
  RESEND_API_KEY=<value> ALERT_EMAIL_TO=<email[,email2]>
supabase functions deploy techkit-poller --no-verify-jwt
```

Smoke test (should return `{"ok":true,"task":"uptime","checked":7,...}`):

```bash
curl -s -X POST https://ijfgwzacaabzeknlpaff.supabase.co/functions/v1/techkit-poller \
  -H "Authorization: Bearer <CRON_SECRET>" -H "Content-Type: application/json" \
  -d '{"task":"uptime"}'
```

## 4. Schedule pg_cron

1. SQL editor: `select vault.create_secret('<CRON_SECRET value>', 'techkit_cron_secret');`
2. Run `supabase/migrations/010_techkit_cron.sql` (uptime */5m, rollup hourly, retention daily).
3. Verify after ~10 min: `select * from cron.job_run_details order by start_time desc limit 5;`
   and `select endpoint_id, status, latency_ms, checked_at from uptime_checks order by checked_at desc limit 10;`

## 5. Vercel env (optional, enables the "Check now" button)

Add `CRON_SECRET=<same value>` to the Vercel project env (all environments) and redeploy.
Everything else in CC works without it.

## 6. A8 kill test (exit criterion)

1. TechKit → Endpoints → Add endpoint: name `kill-test`, URL `https://mdntech.org/definitely-404`,
   interval 300s, active.
2. Wait 2 check cycles (~10 min, or hit "Check now" twice ≥1 min apart).
3. Expect: 🔴 Telegram message + email from `alerts@mdntech.org` + incident on TechKit overview
   with the red sidebar badge.
4. Edit the endpoint URL to `https://mdntech.org`, wait one cycle (or "Check now") →
   🟢 recovery message, incident auto-resolves.
5. Delete the kill-test endpoint.

## Known issues found during Session A

- **RAILWAY_API_TOKEN is rejected** (`Not Authorized`) for account-level GraphQL queries — the
  Live tab's Railway panel has likely been broken for a while. Regenerate an **account** token
  in Railway settings and update `.env.local` + Vercel env (+ Supabase secrets in Session B).
- SignaKit's `projects.railway_project_id` holds a domain, not a project id — fix once the new
  Railway token works (query `me { projects { edges { node { id name } } } }`).
- `'Swarm Resistance dev'` project row mixes the dev Vercel project id with the prod URL;
  prod Vercel project is `prj_rVes2ZCMkq9SwBdjOKqv5Sym26CX` (`swarm-resistance-frontend`).
- Melicharek + Royal Works have Vercel projects but no CC `projects` rows (endpoints seeded
  unlinked; add project rows via CC if per-project grouping is wanted).

---

# TechKit Session B go-live (2026-07-11)

> ✅ **Backend LIVE.** Providers (hourly) + stats (every 6h) tasks deployed and smoke-tested green
> against production. Done entirely via the Management API (same pattern as Session A) — see the
> `scratchpad` stage scripts referenced in the handoff. **CC Stats page/overview changes render once
> `main` is pushed → Vercel deploys** (held for coordinated commit — a MarketKit session shared the tree).

**What was done (self-serve, Management API):**
1. **Edge secrets set** — `SB_MGMT_API_KEY` (NOT `SUPABASE_MANAGEMENT_API_KEY`: Supabase reserves the
   `SUPABASE_` prefix and rejects it), `RAILWAY_API_TOKEN`, `VERCEL_ACCESS_TOKEN`. `SUPABASE_URL` +
   `SUPABASE_SERVICE_ROLE_KEY` are auto-injected, no need to set.
2. **`techkit-poller` redeployed v6** (now bundles `_shared/providers.ts`) + **`techkit-webhook` deployed v1**,
   both multipart, both `verify_jwt=false`.
3. **Migration `011_techkit_sessionb.sql` applied** — `techkit_chatkit_rollup()` RPC, `infra_metrics.label`
   column, seed rule "Supabase DB > 400 MB", and cron `techkit-providers` (`0 * * * *`) + `techkit-stats`
   (`30 */6 * * *`). All 5 TechKit crons now active.
4. **Smoke test green:** `providers` → 39 metrics, 0 alerts; `stats` → ChatKit rollup written; webhook GET
   `{ok:true}`; webhook fail-closes without `VERCEL_WEBHOOK_SECRET`.

**External steps — resolved 2026-07-11:**

| Item | Outcome |
|---|---|
| `CRUX_API_KEY` | ✅ **Set + verified.** Key works (google.com/web.dev return data). **All monitored origins currently 404 "insufficient data"** — mdntech.org + the client sites are below CrUX's real-user-traffic threshold. The collector handles 404 as insufficient-data (not an error); the Stats vitals panel shows an empty state and **auto-populates once any origin gains enough traffic**. Nothing to fix. |
| Vercel deploy feed | ✅ **Via polling, no Pro plan needed.** Vercel *webhooks* are Pro-only, but the deploys *read* API is not — the hourly `providers` task now polls `/v6/deployments?target=production` and upserts into `deploy_events` (first run ingested 40). Failed-prod-deploy alerts fire only on NEW failures within 90 min (no first-run backfill spam). Trade-off vs webhooks: ~hourly latency instead of instant. |
| `VERCEL_WEBHOOK_SECRET` | ⏸️ **Not set / not needed.** Only required if Vercel is upgraded to Pro and you want instant push-based deploys. `techkit-webhook` stays deployed + dormant for that day. |
| Railway deploy events | ⏸️ Optional — Railway webhooks are **free**: each project → Settings → Webhooks → `…/techkit-webhook?provider=railway` (optional `&token=` if `RAILWAY_WEBHOOK_TOKEN` set). Not wired yet. |

**Edge secrets now set (Session B):** `SB_MGMT_API_KEY`, `RAILWAY_API_TOKEN`, `VERCEL_ACCESS_TOKEN`, `CRUX_API_KEY`
(plus Session A's `CRON_SECRET`, `TELEGRAM_*`, `RESEND_API_KEY`, `ALERT_EMAIL_TO`).

**Deferred (documented, not blocking):** Railway per-service CPU/mem (plan-dependent usage API) and
Vercel Web Analytics (no stable public fetch API on current plan) — CrUX covers vitals, the deploy
feed covers activity. Revisit if the Vercel plan changes (brief §15 Q2).
