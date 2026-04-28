export const dynamic = 'force-dynamic'

import { PortalShell } from '@/components/portal/PortalShell'
import { LoginForm } from '@/components/portal/auth/LoginForm'

export default function PortalLoginPage() {
  return (
    <PortalShell variant="marketing">
      <div className="min-h-[calc(100vh-65px)] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400/80 mb-3">
              Welcome back
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Sign in to your portal
            </h1>
            <p className="mt-3 text-sm text-gray-400">
              Manage ChatKit chatbots, billing, and account settings.
            </p>
          </div>

          <div className="bg-[#0d0d20]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
            <LoginForm />
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            Looking for free tools?{' '}
            <a href="/portal/toolkit" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2">
              Browse ToolKit
            </a>{' '}
            — no signup required.
          </p>
        </div>
      </div>
    </PortalShell>
  )
}
