-- =====================================================
-- 014_techkit_costs.sql — TechKit Session C (costs)
-- infra_costs upsert fix + default cost alert rules +
-- pg_cron schedule for the `costs` poller task
-- (TECHKIT-BRIEF §9 / §13 Session C).
--
-- Apply manually AFTER the techkit-poller redeploy (with
-- task=costs) is ACTIVE. The Anthropic collector also needs
-- the ANTHROPIC_ADMIN_API_KEY Edge Function secret (an Admin
-- key from the Anthropic Console — the standard key is NOT
-- accepted by the cost endpoints); until it is set the task
-- degrades to static-config rows only.
-- =====================================================

-- 1. Upsert fix: the 009 inline UNIQUE treats NULLs as distinct, so account-level
-- rows (project_id null — all Anthropic + static-config rows) would duplicate on
-- every daily run instead of conflicting. Recreate as NULLS NOT DISTINCT (PG15+).
alter table infra_costs
  drop constraint if exists infra_costs_provider_project_id_period_start_period_end_key;
alter table infra_costs
  add constraint infra_costs_provider_project_id_period_start_period_end_key
  unique nulls not distinct (provider, project_id, period_start, period_end);

-- 2. Default cost alert rules (§13 C3 — thresholds are Martin-tunable in the DB;
-- both warning severity → Telegram only per §6.2). scope='cost' rules use
-- metric_name as the aggregation selector: 'daily_cost' (per-day rows for
-- yesterday UTC) or 'mtd_cost' (all rows starting this month). provider null =
-- across all providers. Insert-where-not-exists guards keep this idempotent.
insert into alert_rules (name, scope, provider, metric_name, condition, threshold, severity, cooldown_minutes, is_active)
select 'Anthropic daily cost > $5', 'cost', 'anthropic', 'daily_cost', 'gt', 5, 'warning', 720, true
where not exists (select 1 from alert_rules where name = 'Anthropic daily cost > $5');

insert into alert_rules (name, scope, provider, metric_name, condition, threshold, severity, cooldown_minutes, is_active)
select 'Total MTD cost > $100', 'cost', null, 'mtd_cost', 'gt', 100, 'warning', 1440, true
where not exists (select 1 from alert_rules where name = 'Total MTD cost > $100');

-- 3. pg_cron schedule (§5.1: costs daily at 06:15 UTC). Same net.http_post
-- pattern as 010/011, reusing the Vault secret. Idempotent.
do $$
begin
  perform cron.unschedule('techkit-costs');
exception when others then null;
end $$;

select cron.schedule('techkit-costs', '15 6 * * *', $$
  select net.http_post(
    url    := 'https://ijfgwzacaabzeknlpaff.supabase.co/functions/v1/techkit-poller',
    headers:= jsonb_build_object(
                'Content-Type','application/json',
                'Authorization','Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name='techkit_cron_secret')),
    body   := '{"task":"costs"}'::jsonb,
    timeout_milliseconds := 60000
  );
$$);

-- Session D adds: techkit-digest (0 6 * * 1)

-- Useful ops queries:
--   select jobname, schedule, active from cron.job order by jobname;
--   select provider, cost_amount, period_start, period_end, source
--     from infra_costs order by period_start desc limit 40;
--   select name, threshold, last_fired_at from alert_rules where scope = 'cost';
