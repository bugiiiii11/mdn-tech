'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/portal/toolkit', label: 'ToolKit' },
  { href: '/portal/chatkit', label: 'ChatKit' },
  { href: '/portal/settings', label: 'Settings' },
]

const MARKETING_HOME = 'https://mdntech.org'

interface Props {
  user: { id: string; email?: string | null } | null
}

export function PortalTopBar({ user }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const supabase = createClient()
  const isLoggedIn = !!user

  async function handleSignOut() {
    await supabase.auth.signOut()
    setIsAccountOpen(false)
    setIsMobileMenuOpen(false)
    router.push('/portal/login')
    router.refresh()
  }

  return (
    <header className="w-full h-[65px] fixed top-0 left-0 right-0 z-50 bg-[#03001480] backdrop-blur-md border-b border-white/5 shadow-lg shadow-[#2A0E61]/30">
      <div className="w-full h-full flex items-center justify-between px-3 md:px-10">
        {/* Logo */}
        <Link
          href="/portal/toolkit"
          className="flex items-center gap-1.5 md:gap-2 flex-shrink-0 min-w-0"
        >
          <Image
            src="/logo.png"
            alt="M.D.N Tech"
            width={32}
            height={32}
            className="w-7 h-7 md:w-8 md:h-8 flex-shrink-0"
          />
          <div className="font-bold text-gray-300 text-sm md:text-base whitespace-nowrap">
            M.D.N Tech
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 border border-[rgba(112,66,248,0.38)] bg-[rgba(3,0,20,0.37)] px-2 py-1.5 rounded-full text-gray-200">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  active
                    ? 'text-white bg-white/10'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
          <a
            href={MARKETING_HOME}
            className="px-3 py-1 rounded-full text-sm text-gray-300 hover:text-white transition-colors"
          >
            Home
          </a>
        </nav>

        {/* Right action (desktop) */}
        <div className="hidden md:flex items-center">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsAccountOpen((v) => !v)}
                className="flex items-center gap-2 py-2 px-4 button-primary text-white text-sm rounded-lg"
                aria-haspopup="menu"
                aria-expanded={isAccountOpen}
              >
                Account
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isAccountOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsAccountOpen(false)}
                  />
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-56 bg-[#0d0d20] border border-white/10 rounded-lg shadow-xl py-1 z-50"
                  >
                    {user?.email && (
                      <p className="px-3 py-2 text-xs text-gray-500 border-b border-white/5 truncate">
                        {user.email}
                      </p>
                    )}
                    <a
                      href={MARKETING_HOME}
                      className="block px-3 py-2 text-sm text-gray-300 hover:bg-white/5"
                    >
                      Marketing site
                    </a>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/5"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/portal/login"
              className="py-2 px-4 button-primary text-white text-sm rounded-lg"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white text-xl flex-shrink-0 w-10 h-10 flex items-center justify-center -mr-2"
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileMenuOpen}
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-[65px] left-0 right-0 bg-gradient-to-b from-[#030014] to-[#0a0118] backdrop-blur-lg border-t border-[#7042f861] shadow-2xl md:hidden z-40">
            <div className="p-6 flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={MARKETING_HOME}
                className="px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 transition-colors"
              >
                Home
              </a>

              <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent my-2" />

              {isLoggedIn ? (
                <button
                  onClick={handleSignOut}
                  className="w-full py-3 px-4 button-primary text-white rounded-lg text-left"
                >
                  Sign out
                </button>
              ) : (
                <Link
                  href="/portal/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full block py-3 px-4 button-primary text-white text-center rounded-lg"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  )
}
