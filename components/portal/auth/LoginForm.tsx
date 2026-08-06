'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

type Mode = 'password' | 'magic'

export function LoginForm() {
  const [mode, setMode] = useState<Mode>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [magicSent, setMagicSent] = useState(false)
  const router = useRouter()
  const params = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const err = params.get('error')
    if (err === 'unauthorized') {
      setError('Admins use admin.mdntech.org. This portal is for customers only.')
    } else if (err === 'auth_callback_failed') {
      setError('That sign-in link is invalid or has expired. Request a new one below.')
    } else if (err === 'missing_code') {
      setError('That link is incomplete. Request a new one below.')
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

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Sign-in only — don't create junk accounts that lack the customer
        // role. New users must go through /portal/signup.
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/chatkit`,
      },
    })

    if (otpError) {
      const notFound = /signups? not allowed|not allowed for otp|user not found/i.test(otpError.message)
      setError(
        notFound
          ? "We couldn't find an account for that email. Create one first."
          : otpError.message
      )
      setLoading(false)
      return
    }

    setMagicSent(true)
    setLoading(false)
  }

  function switchMode(next: Mode) {
    setMode(next)
    setError(null)
    setMagicSent(false)
  }

  if (magicSent) {
    return (
      <div className="text-center space-y-3">
        <div className="inline-flex w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 items-center justify-center mb-2">
          <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-cyan-300 font-medium">Check your email</p>
        <p className="text-sm text-gray-400">
          We sent a one-click sign-in link to{' '}
          <span className="text-white font-medium">{email}</span>. It expires in 1 hour.
        </p>
        <button
          type="button"
          onClick={() => switchMode('password')}
          className="text-sm text-purple-300 hover:text-purple-200 transition-colors font-medium pt-2"
        >
          Use a password instead
        </button>
      </div>
    )
  }

  const isMagic = mode === 'magic'

  return (
    <form onSubmit={isMagic ? handleMagicLink : handleLogin} className="space-y-5">
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

      {!isMagic && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
              Password
            </label>
            <Link
              href="/portal/reset-password"
              className="text-xs text-purple-300 hover:text-purple-200 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
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
      )}

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
        {loading
          ? isMagic ? 'Sending link…' : 'Signing in…'
          : isMagic ? 'Email me a sign-in link' : 'Sign in'}
      </button>

      <button
        type="button"
        onClick={() => switchMode(isMagic ? 'password' : 'magic')}
        className="w-full text-center text-xs text-gray-400 hover:text-gray-300 transition-colors"
      >
        {isMagic ? 'Sign in with a password instead' : 'Email me a sign-in link instead'}
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
