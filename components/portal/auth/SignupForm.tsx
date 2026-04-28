'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export function SignupForm() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [company, setCompany] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          account_type: 'customer',
          full_name: fullName,
          company,
          signup_source: 'direct',
        },
        emailRedirectTo: `${window.location.origin}/toolkit`,
      },
    })

    if (signupError) {
      setError(signupError.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="text-center space-y-3">
        <div className="inline-flex w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 items-center justify-center mb-2">
          <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-green-400 font-medium">Check your email</p>
        <p className="text-sm text-gray-400">
          We sent a confirmation link to{' '}
          <span className="text-white font-medium">{email}</span>.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
          Full name
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          autoComplete="name"
          className="w-full bg-[#0a0a14] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition"
          placeholder="Jane Smith"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
          Company <span className="text-gray-600 normal-case">(optional)</span>
        </label>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          autoComplete="organization"
          className="w-full bg-[#0a0a14] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition"
          placeholder="Acme Inc."
        />
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

      <div>
        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
          Password
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

      {error && (
        <p className="text-red-400 text-sm bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-lg py-2.5 text-sm font-medium text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>

      <p className="text-center text-sm text-gray-400 pt-2 border-t border-white/5">
        Already have an account?{' '}
        <Link
          href="/portal/login"
          className="text-purple-300 hover:text-purple-200 transition-colors font-medium"
        >
          Sign in
        </Link>
      </p>
    </form>
  )
}
