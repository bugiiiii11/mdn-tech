-- Migration 012: MarketKit portal module (MARKETKIT-BRIEF.md §4)
-- All tables mk_-prefixed (shared DB with CC/ChatKit/TechKit — M11).
-- RLS admin-or-owner (via project join), mirroring the migration 006 pattern.
-- Numbered 012: TechKit Session B (parallel) took 011 (BRIEF §5.1). Apply after 011.

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists mk_projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references customers(id) on delete cascade,
  name text not null,
  url text,
  category text not null check (category in ('saas','consumer_app','game','local_business')),
  status text not null default 'active' check (status in ('active','paused','archived')),
  budget_tier int not null default 0 check (budget_tier in (0, 500, 2000)),
  language text not null default 'en',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger mk_projects_updated_at
  before update on mk_projects
  for each row execute function update_updated_at();

create table if not exists mk_project_assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references mk_projects(id) on delete cascade,
  kind text not null check (kind in ('doc','screenshot','logo','data')),
  storage_path text not null,
  filename text,
  notes text,
  created_at timestamptz default now()
);

create index idx_mk_project_assets_project on mk_project_assets (project_id);

create table if not exists mk_project_profiles (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references mk_projects(id) on delete cascade,
  version int not null default 1,
  profile jsonb not null,                        -- structured scan output
  created_at timestamptz default now(),
  unique (project_id, version)
);

create table if not exists mk_founder_questions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references mk_projects(id) on delete cascade,
  question text not null,
  why_needed text,
  answer text,
  answered_at timestamptz,
  status text not null default 'open' check (status in ('open','answered','dismissed')),
  created_at timestamptz default now()
);

create index idx_mk_founder_questions_project on mk_founder_questions (project_id);

create table if not exists mk_strategies (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references mk_projects(id) on delete cascade,
  version int not null default 1,
  budget_tier int not null,
  positioning text,
  icp jsonb,
  channel_plan jsonb,                            -- ranked, with cost/effort/expected
  launch_checklist jsonb,
  calendar jsonb,                                -- 30-day content calendar
  created_at timestamptz default now(),
  unique (project_id, version)
);

create table if not exists mk_links (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references mk_projects(id) on delete cascade,
  dub_id text,
  url text not null,
  utm jsonb default '{}',
  clicks int default 0,
  conversions int default 0,
  updated_at timestamptz default now()
);

create table if not exists mk_actions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references mk_projects(id) on delete cascade,
  strategy_id uuid references mk_strategies(id) on delete set null,
  week date,                                     -- Monday of the sprint week
  title text not null,
  channel text,
  effort text,                                   -- S | M | L
  cost_eur numeric(8,2) default 0,
  expected_outcome text,
  tracking_link_id uuid references mk_links(id) on delete set null,
  status text not null default 'proposed' check (status in ('proposed','approved','done','skipped')),
  actual_outcome text,
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

create index idx_mk_actions_project on mk_actions (project_id);

create table if not exists mk_content_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references mk_projects(id) on delete cascade,
  action_id uuid references mk_actions(id) on delete set null,
  platform text,                                 -- x | linkedin | reddit | blog | ...
  format text,                                   -- post | thread | article | image | ...
  draft text,
  final text,
  voice_edited boolean not null default false,   -- M8 gate: cannot be 'approved' without it
  status text not null default 'draft' check (status in ('draft','approved','published')),
  published_at timestamptz,
  tracking_link_id uuid references mk_links(id) on delete set null,
  created_at timestamptz default now()
);

create index idx_mk_content_items_project on mk_content_items (project_id);

create table if not exists mk_metrics_snapshots (
  id bigint generated always as identity primary key,
  project_id uuid not null references mk_projects(id) on delete cascade,
  source text not null check (source in ('ga4','gsc','dub','screenshot','manual')),
  platform text,
  metric text not null,
  value numeric(18,4) not null,
  period_start date,
  period_end date,
  ingested_at timestamptz default now(),
  raw jsonb default '{}'
);

create index idx_mk_metrics_lookup on mk_metrics_snapshots (project_id, source, metric, period_end desc);

-- Async AI jobs (scan / launch-kit generation / sprint proposals run out-of-band)
create table if not exists mk_jobs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references mk_projects(id) on delete cascade,
  kind text not null,                            -- scan | launch_kit | sprint_propose | sprint_review
  status text not null default 'queued' check (status in ('queued','running','done','error')),
  input jsonb default '{}',
  result jsonb,
  error text,
  created_at timestamptz default now(),
  started_at timestamptz,
  finished_at timestamptz
);

create index idx_mk_jobs_project on mk_jobs (project_id, created_at desc);

-- ============================================================
-- ENUM EXTENSIONS (BRIEF §2.3) — add 'marketkit' product + 'internal' plan
-- ============================================================
alter table customer_products drop constraint if exists customer_products_product_check;
alter table customer_products add constraint customer_products_product_check
  check (product in ('signakit','chatkit','tradekit','marketkit'));

alter table customer_products drop constraint if exists customer_products_plan_check;
alter table customer_products add constraint customer_products_plan_check
  check (plan in ('free','starter','pro','enterprise','internal'));

alter table customers drop constraint if exists customers_signup_source_check;
alter table customers add constraint customers_signup_source_check
  check (signup_source in ('signakit','chatkit','tradekit','marketkit','direct'));

-- ============================================================
-- RLS — every mk_ table: owner (via project join) OR public.is_admin()
-- Edge Functions / job workers use the service role (bypass RLS).
-- ============================================================
alter table mk_projects          enable row level security;
alter table mk_project_assets    enable row level security;
alter table mk_project_profiles  enable row level security;
alter table mk_founder_questions enable row level security;
alter table mk_strategies        enable row level security;
alter table mk_links             enable row level security;
alter table mk_actions           enable row level security;
alter table mk_content_items     enable row level security;
alter table mk_metrics_snapshots enable row level security;
alter table mk_jobs              enable row level security;

-- mk_projects: owner sees/manages own rows; admins see all
create policy "mk_projects owner select"
  on mk_projects for select to authenticated
  using (owner_id = auth.uid() or public.is_admin());
create policy "mk_projects owner all"
  on mk_projects for all to authenticated
  using (owner_id = auth.uid() or public.is_admin())
  with check (owner_id = auth.uid() or public.is_admin());

-- Child tables: access follows project ownership. One helper predicate, applied per table.
-- (Written out per table because a shared function would still need SECURITY DEFINER;
--  the exists() subquery is the migration-006 pattern and RLS-safe.)
create policy "mk_project_assets owner all"
  on mk_project_assets for all to authenticated
  using (exists (select 1 from mk_projects p where p.id = project_id and (p.owner_id = auth.uid() or public.is_admin())))
  with check (exists (select 1 from mk_projects p where p.id = project_id and (p.owner_id = auth.uid() or public.is_admin())));

create policy "mk_project_profiles owner all"
  on mk_project_profiles for all to authenticated
  using (exists (select 1 from mk_projects p where p.id = project_id and (p.owner_id = auth.uid() or public.is_admin())))
  with check (exists (select 1 from mk_projects p where p.id = project_id and (p.owner_id = auth.uid() or public.is_admin())));

create policy "mk_founder_questions owner all"
  on mk_founder_questions for all to authenticated
  using (exists (select 1 from mk_projects p where p.id = project_id and (p.owner_id = auth.uid() or public.is_admin())))
  with check (exists (select 1 from mk_projects p where p.id = project_id and (p.owner_id = auth.uid() or public.is_admin())));

create policy "mk_strategies owner all"
  on mk_strategies for all to authenticated
  using (exists (select 1 from mk_projects p where p.id = project_id and (p.owner_id = auth.uid() or public.is_admin())))
  with check (exists (select 1 from mk_projects p where p.id = project_id and (p.owner_id = auth.uid() or public.is_admin())));

create policy "mk_links owner all"
  on mk_links for all to authenticated
  using (exists (select 1 from mk_projects p where p.id = project_id and (p.owner_id = auth.uid() or public.is_admin())))
  with check (exists (select 1 from mk_projects p where p.id = project_id and (p.owner_id = auth.uid() or public.is_admin())));

create policy "mk_actions owner all"
  on mk_actions for all to authenticated
  using (exists (select 1 from mk_projects p where p.id = project_id and (p.owner_id = auth.uid() or public.is_admin())))
  with check (exists (select 1 from mk_projects p where p.id = project_id and (p.owner_id = auth.uid() or public.is_admin())));

create policy "mk_content_items owner all"
  on mk_content_items for all to authenticated
  using (exists (select 1 from mk_projects p where p.id = project_id and (p.owner_id = auth.uid() or public.is_admin())))
  with check (exists (select 1 from mk_projects p where p.id = project_id and (p.owner_id = auth.uid() or public.is_admin())));

create policy "mk_metrics_snapshots owner all"
  on mk_metrics_snapshots for all to authenticated
  using (exists (select 1 from mk_projects p where p.id = project_id and (p.owner_id = auth.uid() or public.is_admin())))
  with check (exists (select 1 from mk_projects p where p.id = project_id and (p.owner_id = auth.uid() or public.is_admin())));

-- mk_jobs: project_id may be null (account-level jobs) → allow admins always,
-- owners when the job is tied to a project they own.
create policy "mk_jobs owner all"
  on mk_jobs for all to authenticated
  using (
    public.is_admin()
    or (project_id is not null and exists (select 1 from mk_projects p where p.id = project_id and p.owner_id = auth.uid()))
  )
  with check (
    public.is_admin()
    or (project_id is not null and exists (select 1 from mk_projects p where p.id = project_id and p.owner_id = auth.uid()))
  );

-- ============================================================
-- STORAGE — private bucket for uploaded assets (BRIEF §2.4)
-- Path convention: mk/{project_id}/{asset_id}-{filename}
-- ============================================================
insert into storage.buckets (id, name, public)
values ('marketkit-assets', 'marketkit-assets', false)
on conflict (id) do nothing;

-- Object access follows project ownership. foldername(name) = ['mk', '{project_id}'].
create policy "mk assets owner select"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'marketkit-assets'
    and exists (
      select 1 from mk_projects p
      where p.id = ((storage.foldername(name))[2])::uuid
        and (p.owner_id = auth.uid() or public.is_admin())
    )
  );

create policy "mk assets owner insert"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'marketkit-assets'
    and exists (
      select 1 from mk_projects p
      where p.id = ((storage.foldername(name))[2])::uuid
        and (p.owner_id = auth.uid() or public.is_admin())
    )
  );

create policy "mk assets owner delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'marketkit-assets'
    and exists (
      select 1 from mk_projects p
      where p.id = ((storage.foldername(name))[2])::uuid
        and (p.owner_id = auth.uid() or public.is_admin())
    )
  );

-- ============================================================
-- DOGFOOD ENROLMENT (BRIEF §2.2) — run AFTER Martin signs up as a customer.
-- Replace <MARTIN_CUSTOMER_UUID> with his customers.id (open question 5: which email).
-- Left commented so the migration is safe to apply before the account exists.
-- ============================================================
-- insert into customer_products (customer_id, product, plan, status)
-- values ('<MARTIN_CUSTOMER_UUID>', 'marketkit', 'internal', 'active')
-- on conflict (customer_id, product) do nothing;
