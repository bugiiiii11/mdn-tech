import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Sidebar } from '@/components/command-center/layout/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Command Center | M.D.N Tech',
  description: 'M.D.N Tech internal operations dashboard',
  robots: { index: false, follow: false },
}

export default function CommandCenterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${inter.className} bg-[#0a0a1a] text-white antialiased min-h-screen flex`}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
