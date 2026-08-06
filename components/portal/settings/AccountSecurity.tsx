'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Mail, KeyRound, ShieldCheck } from 'lucide-react'

const inputClass =
  'w-full bg-[#0a0a14] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition'
const labelClass = 'block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2'
const errClass = 'text-red-400 text-sm bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2'
const okClass = 'text-green-400 text-sm bg-green-500/5 border border-green-500/20 rounded-lg px-3 py-2'

function needsReauth(err: { code?: string; message: string }): boolean {
  return err.code === 'reauthentication_needed' || /reauthenticat/i.test(err.message)
}

export function AccountSecurity({ currentEmail }: { currentEmail: string }) {
  const supabase = createClient()

  // --- Change email ---
  const [newEmail, setNewEmail] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)

  async function handleEmailChange(e: React.FormEvent) {
    e.preventDefault()
    setEmailError(null)
    setEmailSent(false)

    if (newEmail.trim().toLowerCase() === currentEmail.toLowerCase()) {
      setEmailError('That is already your email address.')
      return
    }

    setEmailLoading(true)
    const { error } = await supabase.auth.updateUser(
      { email: newEmail.trim() },
      { emailRedirectTo: `${window.location.origin}/auth/callback?next=/settings` }
    )
    setEmailLoading(false)

    if (error) {
      setEmailError(error.message)
      return
    }
    setEmailSent(true)
    setNewEmail('')
  }

  // --- Change password (with reauthentication fallback) ---
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [otp, setOtp] = useState('')
  const [reauthMode, setReauthMode] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState<string | null>(null)
  const [pwDone, setPwDone] = useState(false)

  function resetPwState() {
    setPassword('')
    setConfirm('')
    setOtp('')
    setReauthMode(false)
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    setPwError(null)
    setPwDone(false)

    if (password !== confirm) {
      setPwError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setPwError('Password must be at least 8 characters.')
      return
    }
    if (reauthMode && otp.trim().length === 0) {
      setPwError('Enter the 6-digit code we emailed you.')
      return
    }

    setPwLoading(true)
    const { error } = await supabase.auth.updateUser(
      reauthMode ? { password, nonce: otp.trim() } : { password }
    )
    setPwLoading(false)

    if (error) {
      // Supabase's "secure password change" setting requires a fresh identity
      // check. Send the reauthentication OTP and reveal the code field.
      if (!reauthMode && needsReauth(error)) {
        const { error: reauthError } = await supabase.auth.reauthenticate()
        if (reauthError) {
          setPwError(reauthError.message)
          return
        }
        setReauthMode(true)
        setPwError('For your security, enter the 6-digit code we just emailed you to confirm this change.')
        return
      }
      setPwError(error.message)
      return
    }

    setPwDone(true)
    resetPwState()
  }

  return (
    <section className="bg-[#0d0d20]/80 border border-white/[0.06] rounded-xl p-5 space-y-6 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-purple-300" />
        <h2 className="text-sm font-medium text-white">Security</h2>
      </div>

      {/* Change email */}
      <form onSubmit={handleEmailChange} className="space-y-3 bg-[#0a0a14] border border-white/5 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Mail className="w-3.5 h-3.5 text-gray-500" />
          <h3 className="text-xs font-medium text-gray-200 uppercase tracking-wider">Change email</h3>
        </div>
        <p className="text-xs text-gray-500">
          Current: <span className="text-gray-300">{currentEmail}</span>. We&apos;ll email both
          addresses a confirmation link — the change completes once you confirm.
        </p>
        <div>
          <label className={labelClass}>New email</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
            autoComplete="email"
            className={inputClass}
            placeholder="new@company.com"
          />
        </div>
        {emailError && <p className={errClass}>{emailError}</p>}
        {emailSent && (
          <p className={okClass}>
            Confirmation links sent. Check both inboxes to finish the change.
          </p>
        )}
        <button
          type="submit"
          disabled={emailLoading}
          className="button-primary rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 transition-colors"
        >
          {emailLoading ? 'Sending…' : 'Update email'}
        </button>
      </form>

      {/* Change password */}
      <form onSubmit={handlePasswordChange} className="space-y-3 bg-[#0a0a14] border border-white/5 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <KeyRound className="w-3.5 h-3.5 text-gray-500" />
          <h3 className="text-xs font-medium text-gray-200 uppercase tracking-wider">Change password</h3>
        </div>
        <div>
          <label className={labelClass}>New password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className={inputClass}
            placeholder="Min. 8 characters"
          />
        </div>
        <div>
          <label className={labelClass}>Confirm password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className={inputClass}
            placeholder="Re-enter password"
          />
        </div>
        {reauthMode && (
          <div>
            <label className={labelClass}>Verification code</label>
            <input
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              autoComplete="one-time-code"
              className={`${inputClass} tracking-[0.3em] font-mono`}
              placeholder="000000"
            />
          </div>
        )}
        {pwError && <p className={errClass}>{pwError}</p>}
        {pwDone && <p className={okClass}>Password updated.</p>}
        <button
          type="submit"
          disabled={pwLoading}
          className="button-primary rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 transition-colors"
        >
          {pwLoading ? 'Updating…' : reauthMode ? 'Confirm & update' : 'Update password'}
        </button>
      </form>
    </section>
  )
}
