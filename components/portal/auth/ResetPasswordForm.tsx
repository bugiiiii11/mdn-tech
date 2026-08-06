'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

type Mode = 'loading' | 'request' | 'request-sent' | 'update' | 'update-done'

export function ResetPasswordForm() {
  const [mode, setMode] = useState<Mode>('loading')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Arriving via the email link routes through /auth/callback, which exchanges
  // the recovery code for a session. If a session is present we're in
  // "set a new password" mode; otherwise the user is here to request a link.
  useEffect(() => {
    let active = true
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return
      setMode(session ? 'update' : 'request')
    })
    return () => {
      active = false
    }
  }, [supabase])

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })

    if (resetError) {
      setError(resetError.message)
      setLoading(false)
      return
    }

    setMode('request-sent')
    setLoading(false)
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    setMode('update-done')
    setLoading(false)
  }

  const eyebrow = (text: string) => (
    <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400/80 mb-3 text-center">
      {text}
    </p>
  )

  const heading = (text: string) => (
    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight text-center">
      {text}
    </h1>
  )

  if (mode === 'loading') {
    return (
      <div className="py-8 text-center text-sm text-gray-400">Loading…</div>
    )
  }

  if (mode === 'request-sent') {
    return (
      <div className="text-center space-y-3">
        <div className="inline-flex w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 items-center justify-center mb-2">
          <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-cyan-300 font-medium">Check your email</p>
        <p className="text-sm text-gray-400">
          If an account exists for{' '}
          <span className="text-white font-medium">{email}</span>, we sent a link to
          reset your password. It expires in 1 hour.
        </p>
        <Link
          href="/portal/login"
          className="inline-block text-sm text-purple-300 hover:text-purple-200 transition-colors font-medium pt-2"
        >
          Back to sign in
        </Link>
      </div>
    )
  }

  if (mode === 'update-done') {
    return (
      <div className="text-center space-y-3">
        <div className="inline-flex w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 items-center justify-center mb-2">
          <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-green-400 font-medium">Password updated</p>
        <p className="text-sm text-gray-400">You&apos;re all set. Head to your portal to continue.</p>
        <button
          type="button"
          onClick={() => {
            router.push('/portal/chatkit')
            router.refresh()
          }}
          className="w-full button-primary rounded-lg py-2.5 text-sm font-medium text-white transition-colors mt-2"
        >
          Go to ChatKit
        </button>
      </div>
    )
  }

  if (mode === 'update') {
    return (
      <form onSubmit={handleUpdate} className="space-y-5">
        <div className="mb-6">
          {eyebrow('Almost there')}
          {heading('Set a new password')}
          <p className="mt-3 text-sm text-gray-400 text-center">
            Choose a password you don&apos;t use anywhere else.
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            New password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full bg-[#0a0a14] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition"
            placeholder="Min. 8 characters"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            Confirm password
          </label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full bg-[#0a0a14] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition"
            placeholder="Re-enter password"
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
          {loading ? 'Updating…' : 'Update password'}
        </button>
      </form>
    )
  }

  // mode === 'request'
  return (
    <form onSubmit={handleRequest} className="space-y-5">
      <div className="mb-6">
        {eyebrow('Password reset')}
        {heading('Reset your password')}
        <p className="mt-3 text-sm text-gray-400 text-center">
          Enter your email and we&apos;ll send a link to set a new one.
        </p>
      </div>

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
        {loading ? 'Sending link…' : 'Send reset link'}
      </button>

      <p className="text-center text-sm text-gray-400 pt-2 border-t border-white/5">
        Remembered it?{' '}
        <Link
          href="/portal/login"
          className="text-purple-300 hover:text-purple-200 transition-colors font-medium"
        >
          Back to sign in
        </Link>
      </p>
    </form>
  )
}
