-- Migration 006: Auth Hardening
-- Phase 2 finalization: source-control is_admin(), fix handle_new_user() role default, restrict team_members visibility
-- Run in Supabase SQL Editor after 001-005

-- ============================================================
-- 1. SOURCE-CONTROL is_admin() function
-- ============================================================
-- This function is referenced by 10+ RLS policies in migrations 003-004
-- but was never defined in any migration file. This defines it source-controlled.
-- CREATE OR REPLACE is idempotent — safe to run even if function already exists.

create or replace function public.is_admin()
  returns boolean
  language sql
  security definer
  stable
  as $$
    select exists (select 1 from public.team_members where id = auth.uid() and role = 'admin')
  $$;

grant execute on function public.is_admin() to authenticated, anon;

-- ============================================================
-- 2. FIX handle_new_user() TRIGGER
-- ============================================================
-- Previous version (004) hardcoded role='admin' for all non-customer signups.
-- This respects explicit role metadata while keeping 'admin' as the safe default for manual invites.

create or replace function public.handle_new_user()
  returns trigger
  language plpgsql
  security definer
  as $$
  begin
    if coalesce(new.raw_user_meta_data->>'account_type', 'team') = 'customer' then
      insert into public.customers (id, email, full_name, signup_source)
      values (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'signup_source'
      )
      on conflict (id) do nothing;
    else
      insert into public.team_members (id, full_name, role)
      values (
        new.id,
        coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        coalesce(new.raw_user_meta_data->>'role', 'admin')
      )
      on conflict (id) do nothing;
    end if;
    return new;
  end;
  $$;

-- ============================================================
-- 3. FIX team_members RLS -- RESTRICT SELECT TO ADMINS ONLY
-- ============================================================
-- Current: "Authenticated users can view team members" (true) — allows customers to enumerate staff
-- New: admins only can view team member list
-- This prevents customers from querying all team_members rows.

drop policy if exists "Authenticated users can view team members" on team_members;

create policy "Admins can view team members"
  on team_members
  for select
  to authenticated
  using (public.is_admin());

-- ============================================================
-- 4. OPTIONAL: UPDATE OTHER RLS POLICIES TO USE is_admin() FUNCTION
-- ============================================================
-- Migrations 003-004 use inline `exists (select ... where role = 'admin')` instead of calling is_admin().
-- For consistency and maintainability, optionally replace them.
-- Commented out for this release — can be done in Phase 3 as a refactoring task.

-- drop policy "Admins can manage projects" on projects;
-- create policy "Admins can manage projects"
--   on projects for all to authenticated
--   using (public.is_admin());
--
-- drop policy "Admins can manage assignments" on project_assignments;
-- create policy "Admins can manage assignments"
--   on project_assignments for all to authenticated
--   using (public.is_admin());
-- ... etc for other policies
