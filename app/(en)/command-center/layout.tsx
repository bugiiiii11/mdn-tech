import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { ShieldAlert } from 'lucide-react'
import { Sidebar } from '@/components/command-center/layout/Sidebar'
import { getTeamIdentity } from '@/lib/auth/team'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Command Center | M.D.N Tech',
  description: 'M.D.N Tech internal operations dashboard',
  robots: { index: false, follow: false },
}

export default async function CommandCenterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Staff gate. The middleware only inspects user_metadata.account_type, which
  // the user can rewrite themself, so a customer could reach these routes; RLS
  // left the pages empty but they still rendered. This checks team_members.
  //
  // Signed-out users fall through on purpose: this layout also wraps
  // /command-center/login, and the middleware already bounces them there.
  const { userId, member } = await getTeamIdentity()
  const denied = userId !== null && member === null

  if (denied) {
    return (
      <div className={`${inter.className} bg-[#0a0a1a] text-white antialiased min-h-screen flex items-center justify-center px-6`}>
        <div className="max-w-md w-full bg-[#0d0d20]/80 border border-red-500/20 rounded-xl p-6 space-y-3 backdrop-blur-sm text-center">
          <div className="inline-flex w-11 h-11 rounded-full bg-red-500/10 border border-red-500/30 items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-red-400" />
          </div>
          <h1 className="text-lg font-semibold text-white">Access denied</h1>
          <p className="text-sm text-gray-400">
            This account is not a member of the M.D.N Tech team. If you are looking
            for your chatbots, they live in the customer portal.
          </p>
          <Link
            href="https://app.mdntech.org/"
            className="inline-block button-primary text-white text-sm px-4 py-2 rounded-lg"
          >
            Go to the portal
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`${inter.className} bg-[#0a0a1a] text-white antialiased min-h-screen flex`}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
