import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Staff identity, resolved from the DATABASE rather than from JWT metadata.
//
// `user_metadata.account_type` -- what the middleware routes on -- is writable
// by the user themself (supabase.auth.updateUser({ data: ... })), so it is a
// routing hint, never an authorization decision. The authority is a row in
// public.team_members, which since migration 020 can only be created by an
// invite the service role wrote first.

export type TeamRole = 'admin' | 'engineer' | 'viewer'

export type TeamMember = {
  id: string
  role: TeamRole
  full_name: string | null
}

export type TeamIdentity = {
  /** null when nobody is signed in. */
  userId: string | null
  /** null when the signed-in user is not staff (e.g. a portal customer). */
  member: TeamMember | null
}

export async function getTeamIdentity(): Promise<TeamIdentity> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { userId: null, member: null }

  // Readable under the "Members can view own team row" policy (migration 020).
  const { data } = await supabase
    .from('team_members')
    .select('id, role, full_name')
    .eq('id', user.id)
    .maybeSingle<TeamMember>()

  return { userId: user.id, member: data ?? null }
}

/**
 * Guard for admin-only API routes. Returns a response to send back when the
 * caller is not an admin, or null when they are and the route may proceed.
 *
 *   const denied = await requireAdmin()
 *   if (denied) return denied
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const { userId, member } = await getTeamIdentity()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (member?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return null
}
