export const dynamic = 'force-dynamic'

import { PortalShell } from '@/components/portal/PortalShell'
import { ResetPasswordForm } from '@/components/portal/auth/ResetPasswordForm'

export default function PortalResetPasswordPage() {
  return (
    <PortalShell variant="marketing">
      <div className="min-h-[calc(100vh-65px)] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-[#0d0d20]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
            <ResetPasswordForm />
          </div>
        </div>
      </div>
    </PortalShell>
  )
}
