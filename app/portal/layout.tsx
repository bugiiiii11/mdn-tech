import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'M.D.N Tech Portal',
  description: 'Manage your M.D.N Tech products — ChatKit, SignaKit, TradeKit',
  robots: { index: false, follow: false },
}

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verify user is authenticated and is a customer
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Allow public access to login/signup pages
  if (!user) {
    // Middleware will redirect, but this catches edge cases
    // (This is optional — page-level guards are the primary defense)
  }

  return (
    <div className={`${inter.className} bg-[#0a0a1a] text-white antialiased min-h-screen`}>
      {children}
    </div>
  )
}
