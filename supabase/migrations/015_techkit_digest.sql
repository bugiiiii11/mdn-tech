-- =====================================================
-- 015_techkit_digest.sql — TechKit Session D (AI digest)
-- Weekly digest SQL aggregate + unacked-incident nag
-- column + Monday pg_cron schedule
-- (TECHKIT-BRIEF §10 / §13 Session D).
--
-- Apply manually BEFORE the techkit-poller redeploy (with
-- task=digest) — the rollup task's nag pass reads the new
-- alert_events.last_nagged_at column.
-- =====================================================

-- 1. D2 — unacked-incident nagging state. The hourly rollup task re-pings
-- Telegram for open incidents older than 24h, at most once per 24h each.
alter table alert_events
  add column if not exists last_nagged_at timestamptz;

-- 2. D1 — the digest input aggregate (§10.1), computed server-side so the
-- poller gets exact numbers in one RPC instead of paging time-series rows
-- through PostgREST's max-rows cap. Windows: this week = [p_since, p_until),
-- previous week = [p_prev_since, p_since). open_unacked is current state.
create or replace function techkit_digest_aggregate(
  p_since timestamptz,
  p_prev_since timestamptz,
  p_until timestamptz
)
returns jsonb
language sql
security definer
set search_path = public
as $$
select jsonb_build_object(
  'uptime', (
    select coalesce(jsonb_agg(jsonb_build_object(
      'endpoint', u.name,
      'checks_total', u.checks_total,
      'checks_up', u.checks_up,
      'checks_down', u.checks_down,
      'uptime_pct', case when u.checks_total > 0
        then round(u.checks_up::numeric / u.checks_total * 100, 2) end,
      'p95_ms', u.p95_ms,
      'p95_prev_ms', u.p95_prev_ms
    ) order by u.name), '[]'::jsonb)
    from (
      select e.name,
        coalesce(sum(r.checks_total)    filter (where r.hour_start >= p_since), 0) as checks_total,
        coalesce(sum(r.checks_up)       filter (where r.hour_start >= p_since), 0) as checks_up,
        coalesce(sum(r.checks_down + r.checks_degraded) filter (where r.hour_start >= p_since), 0) as checks_down,
        round(avg(r.p95_latency_ms)     filter (where r.hour_start >= p_since)) as p95_ms,
        round(avg(r.p95_latency_ms)     filter (where r.hour_start <  p_since)) as p95_prev_ms
      from uptime_rollups_hourly r
      join monitored_endpoints e on e.id = r.endpoint_id
      where r.hour_start >= p_prev_since and r.hour_start < p_until
      group by e.name
    ) u
  ),
  'incidents', (
    select coalesce(jsonb_agg(jsonb_build_object(
      'title', title,
      'severity', severity,
      'status', status,
      'opened_at', opened_at,
      'duration_min', case when resolved_at is not null
        then round(extract(epoch from resolved_at - opened_at) / 60) end
    ) order by opened_at desc), '[]'::jsonb)
    from alert_events
    where opened_at >= p_since and opened_at < p_until
  ),
  'incidents_prev_count', (
    select count(*) from alert_events
    where opened_at >= p_prev_since and opened_at < p_since
  ),
  'open_unacked', (
    select coalesce(jsonb_agg(jsonb_build_object(
      'title', title,
      'severity', severity,
      'age_hours', round(extract(epoch from now() - opened_at) / 3600)
    ) order by opened_at), '[]'::jsonb)
    from alert_events where status = 'open'
  ),
  'deploys', (
    select jsonb_build_object(
      'total',       count(distinct deployment_id) filter (where occurred_at >= p_since),
      'failed',      count(distinct deployment_id) filter (where occurred_at >= p_since and status = 'failed'),
      'prev_total',  count(distinct deployment_id) filter (where occurred_at < p_since),
      'prev_failed', count(distinct deployment_id) filter (where occurred_at < p_since and status = 'failed')
    )
    from deploy_events
    where occurred_at >= p_prev_since and occurred_at < p_until and environment = 'production'
  ),
  -- WoW cost comparison uses daily rows only (period_start = period_end);
  -- monthly static/manual rows would double-count inside a weekly window.
  'costs', (
    select coalesce(jsonb_agg(jsonb_build_object(
      'provider', c.provider,
      'week_usd', c.week_usd,
      'prev_week_usd', c.prev_week_usd
    ) order by c.provider), '[]'::jsonb)
    from (
      select provider,
        coalesce(round(sum(cost_amount) filter (where period_start >= p_since::date), 2), 0) as week_usd,
        coalesce(round(sum(cost_amount) filter (where period_start <  p_since::date), 2), 0) as prev_week_usd
      from infra_costs
      where period_start >= p_prev_since::date and period_start < p_until::date
        and period_start = period_end
      group by provider
    ) c
  ),
  'mtd_total_usd', (
    select coalesce(round(sum(cost_amount), 2), 0) from infra_costs
    where period_start >= date_trunc('month', now())::date
  ),
  -- D2 anomaly flags: >30% week-over-week swing in any provider metric,
  -- with a minimum sample count on both sides so sparse series don't flag.
  'metric_anomalies', (
    select coalesce(jsonb_agg(jsonb_build_object(
      'provider', m.provider,
      'metric', m.metric_name,
      'week_avg', m.week_avg,
      'prev_avg', m.prev_avg,
      'change_pct', round((m.week_avg - m.prev_avg) / abs(m.prev_avg) * 100)
    ) order by abs((m.week_avg - m.prev_avg) / abs(m.prev_avg)) desc), '[]'::jsonb)
    from (
      select provider, metric_name,
        round(avg(metric_value) filter (where recorded_at >= p_since), 2) as week_avg,
        round(avg(metric_value) filter (where recorded_at <  p_since), 2) as prev_avg,
        count(*) filter (where recorded_at >= p_since) as n_week,
        count(*) filter (where recorded_at <  p_since) as n_prev
      from infra_metrics
      where recorded_at >= p_prev_since and recorded_at < p_until
      group by provider, metric_name
    ) m
    where m.n_week >= 4 and m.n_prev >= 4
      and m.prev_avg is not null and m.prev_avg <> 0 and m.week_avg is not null
      and abs(m.week_avg - m.prev_avg) / abs(m.prev_avg) > 0.30
  )
)
$$;

-- Service-role only — the poller is the sole caller (RLS on the underlying
-- tables is admin-only; this function is security definer, so lock it down).
revoke execute on function techkit_digest_aggregate(timestamptz, timestamptz, timestamptz) from public, anon, authenticated;
grant execute on function techkit_digest_aggregate(timestamptz, timestamptz, timestamptz) to service_role;

-- 3. pg_cron schedule — Monday 06:30 UTC, after the daily costs run (06:15)
-- so the digested week includes fresh cost rows. Same net.http_post pattern
-- as 010/011/013/014, reusing the Vault secret. Idempotent.
do $$
begin
  perform cron.unschedule('techkit-digest');
exception when others then null;
end $$;

select cron.schedule('techkit-digest', '30 6 * * 1', $$
  select net.http_post(
    url    := 'https://ijfgwzacaabzeknlpaff.supabase.co/functions/v1/techkit-poller',
    headers:= jsonb_build_object(
                'Content-Type','application/json',
                'Authorization','Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name='techkit_cron_secret')),
    body   := '{"task":"digest"}'::jsonb,
    timeout_milliseconds := 120000
  );
$$);

-- Useful ops queries:
--   select jobname, schedule, active from cron.job order by jobname;
--   select week_start, model, sent_email, sent_telegram, created_at from techkit_digests order by week_start desc;
--   select techkit_digest_aggregate(now() - interval '7 days', now() - interval '14 days', now());
