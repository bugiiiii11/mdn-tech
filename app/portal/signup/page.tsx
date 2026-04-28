export const dynamic = 'force-dynamic'

import { PortalShell } from '@/components/portal/PortalShell'
import { SignupForm } from '@/components/portal/auth/SignupForm'

export default function PortalSignupPage() {
  return (
    <PortalShell variant="marketing">
      <div className="min-h-[calc(100vh-65px)] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400/80 mb-3">
              Create account
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Build with{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                M.D.N Tech
              </span>
            </h1>
            <p className="mt-3 text-sm text-gray-400">
              Free ToolKit access · 50 free ChatKit messages · No card required.
            </p>
          </div>

          <div className="bg-[#0d0d20]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
            <SignupForm />
          </div>
        </div>
      </div>
    </PortalShell>
  )
}
