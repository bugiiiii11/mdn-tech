-- =====================================================
-- 011_techkit_sessionb.sql — TechKit Session B
-- ChatKit rollup RPC + a default metric alert rule +
-- pg_cron schedules for the `providers` and `stats`
-- poller tasks (TECHKIT-BRIEF §5.1 / §13 Session B).
--
-- Apply manually in the SQL editor AFTER 009+010 are live,
-- the techkit-poller redeploy (with providers/stats) is
-- ACTIVE, and the provider-token Edge Function secrets are
-- set. The Vault secret `techkit_cron_secret` already exists
-- from 010 — these schedules reuse it.
-- =====================================================

-- 0. Optional per-metric dimension label (additive, safe on the live 009 schema).
-- Used by the `stats` task to tag CrUX rows with their origin, since several
-- monitored origins can map to one CC project (project_id alone can't separate
-- e.g. mdntech.org vs admin.mdntech.org vitals).
alter table infra_metrics add column if not exists label text;

-- 1. ChatKit cross-project rollup (task=stats).
-- Aggregates assistant turns in [p_since, now) so the poller can snapshot
-- messages/tokens/latency into infra_metrics. Returns one row; the poller
-- writes the infra_metrics rows (keeps all metric writes in one place).
create or replace function techkit_chatkit_rollup(p_since timestamptz)
returns table (
  messages bigint,
  tokens_in bigint,
  tokens_out bigint,
  avg_latency_ms int,
  p95_latency_ms int
)
language sql
security definer
set search_path = public
as $$
  select
    count(*)                                                        as messages,
    coalesce(sum(input_tokens), 0)                                 as tokens_in,
    coalesce(sum(output_tokens), 0)                                as tokens_out,
    avg(latency_ms)::int                                           as avg_latency_ms,
    (percentile_cont(0.95) within group (order by latency_ms))::int as p95_latency_ms
  from chat_messages
  where role = 'assistant'
    and created_at >= p_since;
$$;

revoke execute on function techkit_chatkit_rollup(timestamptz) from public, anon, authenticated;
grant execute on function techkit_chatkit_rollup(timestamptz) to service_role;

-- 2. Default metric alert rule (§6.2). Supabase free tier caps at 500 MB;
-- warn at 400 MB so we act before hitting the ceiling. Tune/disable in CC.
-- `on conflict do nothing`-style guard: only insert if no rule with this name exists.
insert into alert_rules (name, scope, provider, metric_name, condition, threshold, severity, cooldown_minutes, is_active)
select 'Supabase DB > 400 MB', 'metric', 'supabase', 'db_size_bytes', 'gt', 419430400, 'warning', 720, true
where not exists (select 1 from alert_rules where name = 'Supabase DB > 400 MB');

-- 3. pg_cron schedules for Session B tasks. Same net.http_post pattern as 010,
-- reusing the Vault secret. Idempotent: unschedule-if-exists then reschedule.
do $$
begin
  perform cron.unschedule('techkit-providers');
exception when others then null;
end $$;

do $$
begin
  perform cron.unschedule('techkit-stats');
exception when others then null;
end $$;

select cron.schedule('techkit-providers', '0 * * * *', $$
  select net.http_post(
    url    := 'https://ijfgwzacaabzeknlpaff.supabase.co/functions/v1/techkit-poller',
    headers:= jsonb_build_object(
                'Content-Type','application/json',
                'Authorization','Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name='techkit_cron_secret')),
    body   := '{"task":"providers"}'::jsonb,
    timeout_milliseconds := 60000
  );
$$);

select cron.schedule('techkit-stats', '30 */6 * * *', $$
  select net.http_post(
    url    := 'https://ijfgwzacaabzeknlpaff.supabase.co/functions/v1/techkit-poller',
    headers:= jsonb_build_object(
                'Content-Type','application/json',
                'Authorization','Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name='techkit_cron_secret')),
    body   := '{"task":"stats"}'::jsonb,
    timeout_milliseconds := 60000
  );
$$);

-- Session C adds: techkit-costs (15 6 * * *)
-- Session D adds: techkit-digest (0 6 * * 1)

-- Useful ops queries:
--   select jobname, schedule, active from cron.job order by jobname;
--   select provider, metric_name, project_id, metric_value, unit, recorded_at
--     from infra_metrics order by recorded_at desc limit 40;
--   select provider, status, environment, occurred_at from deploy_events order by occurred_at desc limit 20;
