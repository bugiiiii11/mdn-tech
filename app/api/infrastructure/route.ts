import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { fetchSupabaseHealth } from '@/lib/infrastructure/supabase-mgmt'
import { fetchRailwayHealth } from '@/lib/infrastructure/railway'
import { fetchVercelHealth } from '@/lib/infrastructure/vercel'
import type { InfrastructureOverview } from '@/lib/infrastructure/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  // Auth check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
