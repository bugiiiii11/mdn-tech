import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'M.D.N Tech Portal',
  description: 'Manage your M.D.N Tech products — ChatKit, SignaKit, ToolKit',
  robots: { index: false, follow: false },
}

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className={`${inter.className} antialiased`}>{children}</div>
}
