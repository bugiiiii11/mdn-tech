-- M.D.N Tech Command Center -- Core Tables
-- Run this in the Supabase SQL editor (Dashboard > SQL Editor > New query)

-- ============================================================
-- PROJECTS
-- ============================================================
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  client_name text,
  status text not null default 'discovery'
    check (status in ('discovery','design','development','testing','deployed','maintenance','paused','completed')),
  priority text not null default 'medium'
    check (priority in ('critical','high','medium','low')),
  start_date date,
  target_end_date date,
  actual_end_date date,
  budget_total decimal(12,2),
  budget_spent decimal(12,2) default 0,
  description text,
  tech_stack text[] default '{}',
  repository_url text,
  staging_url text,
  production_url text,
  supabase_project_ref text,
  railway_project_id text,
  vercel_project_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger projects_updated_at
  before update on projects
  for each row execute function update_updated_at();

-- ============================================================
-- TEAM MEMBERS
-- ============================================================
create table if not exists team_members (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'engineer'
    check (role in ('admin','engineer','viewer')),
  avatar_url text,
  max_concurrent_projects int default 3,
  skills text[] default '{}',
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ============================================================
-- PROJECT ASSIGNMENTS
-- ============================================================
create table if not exists project_assignments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  member_id uuid not null references team_members(id) on delete cascade,
  assigned_at timestamptz default now(),
  unassigned_at timestamptz,
  unique(project_id, member_id)
);

-- ============================================================
-- MILESTONES
-- ============================================================
create table if not exists milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  name text not null,
  description text,
  due_date date,
  status text default 'pending'
    check (status in ('pending','in_progress','completed','overdue')),
  assigned_to uuid references team_members(id),
  sort_order int default 0,
  completed_at timestamptz,
  created_at timestamptz default now()
);

-- ============================================================
-- COMMUNICATIONS
-- ============================================================
create table if not exists communications (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  author_id uuid references team_members(id),
  channel text not null default 'other'
    check (channel in ('email','call','slack','whatsapp','meeting','other')),
  direction text not null default 'outbound'
    check (direction in ('inbound','outbound')),
  subject text,
  summary text,
  action_items text,
  contact_name text,
  occurred_at timestamptz not null default now(),
  attachments jsonb default '[]',
  created_at timestamptz default now()
);

-- ============================================================
-- ACTIVITY LOG
-- ============================================================
create table if not exists activity_log (
  id bigint generated always as identity primary key,
  user_id uuid references team_members(id),
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table projects enable row level security;
alter table team_members enable row level security;
alter table project_assignments enable row level security;
alter table milestones enable row level security;
alter table communications enable row level security;
alter table activity_log enable row level security;

-- team_members: users can see all members, manage their own profile
create policy "Authenticated users can view team members"
  on team_members for select to authenticated using (true);

create policy "Users can update their own profile"
  on team_members for update to authenticated using (auth.uid() = id);

create policy "Admins can manage team members"
  on team_members for all to authenticated
  using (exists (select 1 from team_members where id = auth.uid() and role = 'admin'));

-- projects: all authenticated users can read, admins + assigned engineers can write
create policy "Authenticated users can view projects"
  on projects for select to authenticated using (true);

create policy "Admins can manage projects"
  on projects for all to authenticated
  using (exists (select 1 from team_members where id = auth.uid() and role = 'admin'));

create policy "Assigned engineers can update projects"
  on projects for update to authenticated
  using (
    exists (
      select 1 from project_assignments
      where project_id = projects.id
        and member_id = auth.uid()
        and unassigned_at is null
    )
  );

-- project_assignments: readable by all, writable by admins
create policy "Authenticated users can view assignments"
  on project_assignments for select to authenticated using (true);

create policy "Admins can manage assignments"
  on project_assignments for all to authenticated
  using (exists (select 1 from team_members where id = auth.uid() and role = 'admin'));

-- milestones: readable by all, writable by assigned engineers and admins
create policy "Authenticated users can view milestones"
  on milestones for select to authenticated using (true);

create policy "Engineers can manage milestones on their projects"
  on milestones for all to authenticated
  using (
    exists (
      select 1 from project_assignments
      where project_id = milestones.project_id
        and member_id = auth.uid()
        and unassigned_at is null
    )
    or
    exists (select 1 from team_members where id = auth.uid() and role = 'admin')
  );

-- communications: readable by all authenticated, writable by all authenticated
create policy "Authenticated users can view communications"
  on communications for select to authenticated using (true);

create policy "Authenticated users can manage communications"
  on communications for all to authenticated using (true);

-- activity_log: readable by all, insertable by all
create policy "Authenticated users can view activity"
  on activity_log for select to authenticated using (true);

create policy "Authenticated users can log activity"
  on activity_log for insert to authenticated with check (true);

-- ============================================================
-- HELPER: auto-insert team_member on user signup
-- ============================================================
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.team_members (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'engineer')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
