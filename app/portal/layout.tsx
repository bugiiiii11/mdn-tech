import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { PortalShell } from '@/components/portal/PortalShell'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'M.D.N Tech Portal',
  description: 'Manage your M.D.N Tech products — ChatKit, SignaKit, TradeKit',
  robots: { index: false, follow: false },
}

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${inter.className} bg-[#0a0a1a] text-white antialiased min-h-screen`}>
      {children}
    </div>
  )
}
