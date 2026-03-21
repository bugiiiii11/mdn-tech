'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [magicSent, setMagicSent] = useState(false)
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
      router.push('/command-center/dashboard')
    }
  }

  async function handleMagicLink() {
    if (!email) {
      setError('Enter your email first')
      return
    }
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/command-center/dashboard` },
    })
    if (error) {
      setError(error.message)
    } else {
      setMagicSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a]">
      <div className="w-full max-w-sm">
        {/* Logo / Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            M.D.N Tech
          </h1>
          <p className="text-gray-400 text-sm mt-1">Command Center</p>
        </div>

        {magicSent ? (
          <div className="bg-[#12122a] border border-purple-500/20 rounded-xl p-6 text-center">
            <p className="text-green-400 font-medium">Magic link sent!</p>
            <p className="text-gray-400 text-sm mt-2">Check your inbox at <span className="text-white">{email}</span></p>
          </div>
        ) : (
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
                  placeholder="you@mdntech.org"
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

            <div className="mt-4 pt-4 border-t border-white/5">
              <button
                onClick={handleMagicLink}
                disabled={loading}
                className="w-full text-sm text-gray-400 hover:text-white transition-colors py-1"
              >
                Send magic link instead
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
