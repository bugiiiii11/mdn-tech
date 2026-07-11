-- =====================================================
-- 013_marketkit_sprint_cron.sql — MarketKit Session B
-- pg_cron schedules for the weekly sprint loop (BRIEF §3.4 / backlog B4).
--
-- Apply AFTER the marketkit-worker redeploy that adds the
-- sprint_propose_all / sprint_review_all batch entrypoints.
-- Reuses the Vault secret `techkit_cron_secret` from 010
-- (= the shared CRON_SECRET the worker authenticates with).
--
-- Monday 06:00 UTC: review LAST week's committed actions against metrics.
-- Monday 07:00 UTC: propose THIS week's 3 actions per active project —
-- an hour later so proposals can build on fresh review outcomes.
-- =====================================================

do $$
begin
  perform cron.unschedule('marketkit-sprint-review');
exception when others then null;
end $$;

do $$
begin
  perform cron.unschedule('marketkit-sprint-propose');
exception when others then null;
end $$;

select cron.schedule('marketkit-sprint-review', '0 6 * * 1', $$
  select net.http_post(
    url    := 'https://ijfgwzacaabzeknlpaff.supabase.co/functions/v1/marketkit-worker',
    headers:= jsonb_build_object(
                'Content-Type','application/json',
                'Authorization','Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name='techkit_cron_secret')),
    body   := '{"task":"sprint_review_all"}'::jsonb,
    timeout_milliseconds := 60000
  );
$$);

select cron.schedule('marketkit-sprint-propose', '0 7 * * 1', $$
  select net.http_post(
    url    := 'https://ijfgwzacaabzeknlpaff.supabase.co/functions/v1/marketkit-worker',
    headers:= jsonb_build_object(
                'Content-Type','application/json',
                'Authorization','Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name='techkit_cron_secret')),
    body   := '{"task":"sprint_propose_all"}'::jsonb,
    timeout_milliseconds := 60000
  );
$$);

-- Useful ops queries:
--   select jobname, schedule, active from cron.job where jobname like 'marketkit%';
--   select kind, status, project_id, error, created_at from mk_jobs order by created_at desc limit 20;
--   select week, title, channel, status, expected_outcome, actual_outcome from mk_actions order by created_at desc limit 20;
