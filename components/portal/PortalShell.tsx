import { createClient } from '@/lib/supabase/server'
import { PortalTopBar } from './PortalTopBar'
import { PortalBackground } from './PortalBackground'
import { hasMarketkitAccess } from '@/lib/marketkit/enrollment'

interface Props {
  children: React.ReactNode
  variant?: 'marketing' | 'app'
}

export async function PortalShell({ children, variant = 'app' }: Props) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const userInfo = user ? { id: user.id, email: user.email } : null
  // MarketKit is gated: the nav item shows only for customers with an active
  // marketkit enrolment (BRIEF §2.2). ChatKit-only customers never see it.
  const showMarketkit = user ? await hasMarketkitAccess(supabase, user.id) : false

  const surface =
    variant === 'marketing'
      ? 'bg-[#030014] text-white'
      : 'bg-[#0a0a1a] text-white'

  return (
    <div className={`relative min-h-screen flex flex-col ${surface}`}>
      {variant === 'marketing' && <PortalBackground />}
      <PortalTopBar user={userInfo} showMarketkit={showMarketkit} />
      <main className="flex-1 relative z-20 pt-[65px]">{children}</main>
    </div>
  )
}
