'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const params = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    if (params.get('error') === 'unauthorized') {
      setError('Admins use admin.mdntech.org. This portal is for customers only.')
    }
  }, [params])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    const accountType = user?.user_metadata?.account_type

    if (accountType !== 'customer') {
      await supabase.auth.signOut()
      setError('This login is for customers only. Admins use admin.mdntech.org.')
      setLoading(false)
      return
    }

    router.push('/portal/chatkit')
    router.refresh()
  }

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full bg-[#0a0a14] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition"
          placeholder="you@company.com"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full bg-[#0a0a14] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full button-primary rounded-lg py-2.5 text-sm font-medium text-white disabled:opacity-50 transition-colors"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="text-center text-sm text-gray-400 pt-2 border-t border-white/5">
        Don&apos;t have an account?{' '}
        <Link
          href="/portal/signup"
          className="text-purple-300 hover:text-purple-200 transition-colors font-medium"
        >
          Sign up
        </Link>
      </p>
    </form>
  )
}
