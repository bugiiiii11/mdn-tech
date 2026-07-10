-- =====================================================
-- 010_techkit_cron.sql — pg_cron wiring for techkit-poller
-- (TECHKIT-BRIEF §5.3). Apply manually in the SQL editor
-- AFTER 009 is applied, the Edge Function is deployed, and
-- the Vault secret is created (see prerequisite below).
-- =====================================================

create extension if not exists pg_cron;
create extension if not exists pg_net;

-- PREREQUISITE (run once, replace the placeholder — do NOT commit the real value):
--   select vault.create_secret('<CRON_SECRET value>', 'techkit_cron_secret');
-- The same value must be set as the Edge Function secret CRON_SECRET:
--   supabase secrets set CRON_SECRET=<value>

-- Helper: all schedules call the same function with a different task body.
-- pg_net posts are fire-and-forget; responses land in net._http_response.

select cron.schedule('techkit-uptime', '*/5 * * * *', $$
  select net.http_post(
    url    := 'https://ijfgwzacaabzeknlpaff.supabase.co/functions/v1/techkit-poller',
    headers:= jsonb_build_object(
                'Content-Type','application/json',
                'Authorization','Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name='techkit_cron_secret')),
    body   := '{"task":"uptime"}'::jsonb,
    timeout_milliseconds := 60000
  );
$$);

select cron.schedule('techkit-rollup', '5 * * * *', $$
  select net.http_post(
    url    := 'https://ijfgwzacaabzeknlpaff.supabase.co/functions/v1/techkit-poller',
    headers:= jsonb_build_object(
                'Content-Type','application/json',
                'Authorization','Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name='techkit_cron_secret')),
    body   := '{"task":"rollup"}'::jsonb,
    timeout_milliseconds := 60000
  );
$$);

select cron.schedule('techkit-retention', '45 3 * * *', $$
  select net.http_post(
    url    := 'https://ijfgwzacaabzeknlpaff.supabase.co/functions/v1/techkit-poller',
    headers:= jsonb_build_object(
                'Content-Type','application/json',
                'Authorization','Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name='techkit_cron_secret')),
    body   := '{"task":"retention"}'::jsonb,
    timeout_milliseconds := 60000
  );
$$);

-- Session B adds: techkit-providers (0 * * * *), techkit-stats (30 */6 * * *)
-- Session C adds: techkit-costs (15 6 * * *)
-- Session D adds: techkit-digest (0 6 * * 1)

-- Useful ops queries:
--   select jobname, schedule, active from cron.job;
--   select * from cron.job_run_details order by start_time desc limit 20;
--   select cron.unschedule('techkit-uptime');  -- to pause
