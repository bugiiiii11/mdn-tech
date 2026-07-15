-- =====================================================
-- 016_marketkit_dub.sql — MarketKit Session B (B3: Dub tracked links)
-- Daily pg_cron schedule for the Dub sync worker task + a lookup index.
--
-- The mk_links table (dub_id / clicks / conversions columns) already exists
-- from 012 — no schema change to it here. This migration only:
--   1. adds an index for the per-project link scan the sync does, and
--   2. schedules the daily {"task":"dub_sync_all"} batch on the worker.
--
-- Apply AFTER the marketkit-worker redeploy that adds the dub_sync /
-- dub_sync_all entrypoints, and AFTER DUB_API_KEY is set as an edge secret
-- (the worker degrades cleanly — skips — until the key exists, so ordering
-- is not strict, but the cron does nothing useful before the key lands).
--
-- Reuses the Vault secret `techkit_cron_secret` from 010 (= the shared
-- CRON_SECRET the worker authenticates with).
--
-- 05:30 UTC daily: refresh click/conversion counts on every active project's
-- tracked links, and backfill Dub short links for any link created before the
-- key existed. 05:30 is before the Monday sprint-review (06:00) so that
-- review reads fresh click data.
-- =====================================================

create index if not exists idx_mk_links_project on mk_links (project_id);

do $$
begin
  perform cron.unschedule('marketkit-dub-sync');
exception when others then null;
end $$;

select cron.schedule('marketkit-dub-sync', '30 5 * * *', $$
  select net.http_post(
    url    := 'https://ijfgwzacaabzeknlpaff.supabase.co/functions/v1/marketkit-worker',
    headers:= jsonb_build_object(
                'Content-Type','application/json',
                'Authorization','Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name='techkit_cron_secret')),
    body   := '{"task":"dub_sync_all"}'::jsonb,
    timeout_milliseconds := 60000
  );
$$);

-- Useful ops queries:
--   select jobname, schedule, active from cron.job where jobname like 'marketkit%';
--   select project_id, dub_id, url, clicks, conversions, updated_at from mk_links order by updated_at desc limit 20;
--   select project_id, source, metric, value, period_end from mk_metrics_snapshots where source='dub' order by ingested_at desc limit 20;
