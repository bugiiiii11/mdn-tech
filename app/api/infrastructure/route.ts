import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/team'
import { fetchSupabaseHealth } from '@/lib/infrastructure/supabase-mgmt'
import { fetchRailwayHealth } from '@/lib/infrastructure/railway'
import { fetchVercelHealth } from '@/lib/infrastructure/vercel'
import type { InfrastructureOverview } from '@/lib/infrastructure/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  // Admin only -- this returns provider health for the whole estate (Supabase,
  // Railway, Vercel). Any signed-in account used to be enough, so a portal
  // customer could read it.
  const denied = await requireAdmin()
  if (denied) return denied

  // Fetch all providers in parallel
  const [supabaseHealth, railwayHealth, vercelHealth] = await Promise.all([
    fetchSupabaseHealth(),
    fetchRailwayHealth(),
    fetchVercelHealth(),
  ])

  const overview: InfrastructureOverview = {
    supabase: supabaseHealth,
    railway: railwayHealth,
    vercel: vercelHealth,
    fetchedAt: new Date().toISOString(),
  }

  return NextResponse.json(overview)
}
