'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function PortalLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/portal/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            M.D.N Tech
          </h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="bg-[#12122a] border border-white/5 rounded-xl p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-[#0a0a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-[#0a0a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-lg py-2 text-sm font-medium text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-white/5 text-center">
            <p className="text-sm text-gray-400">
              Don&apos;t have an account?{' '}
              <Link href="/portal/signup" className="text-purple-400 hover:text-purple-300 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
