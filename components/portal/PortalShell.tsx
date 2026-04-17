'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  Bot,
  Shield,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react'

const navItems = [
  { href: '/portal/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/portal/chatkit', label: 'ChatKit', icon: Bot },
  { href: '/portal/signakit', label: 'SignaKit', icon: Shield, badge: 'Soon' },
  { href: '/portal/tradekit', label: 'TradeKit', icon: BarChart3, badge: 'Soon' },
  { href: '/portal/settings', label: 'Settings', icon: Settings },
]

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/portal/login')
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 flex-shrink-0 bg-[#0d0d20] border-r border-white/5 flex flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/5">
          <span className="text-sm font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            M.D.N Tech
          </span>
          <p className="text-[10px] text-gray-500 mt-0.5">Customer Portal</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon, badge }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-purple-500/10 text-purple-300'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
                {badge && (
                  <span className="ml-auto text-[10px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">
                    {badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Sign out */}
        <div className="px-3 py-4 border-t border-white/5">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
