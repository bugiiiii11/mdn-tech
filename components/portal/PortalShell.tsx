import { createClient } from '@/lib/supabase/server'
import { PortalTopBar } from './PortalTopBar'
import { PortalBackground } from './PortalBackground'

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

  const surface =
    variant === 'marketing'
      ? 'bg-[#030014] text-white'
      : 'bg-[#0a0a1a] text-white'

  return (
    <div className={`relative min-h-screen flex flex-col ${surface}`}>
      {variant === 'marketing' && <PortalBackground />}
      <PortalTopBar user={userInfo} />
      <main className="flex-1 relative z-20 pt-[65px]">{children}</main>
    </div>
  )
}
