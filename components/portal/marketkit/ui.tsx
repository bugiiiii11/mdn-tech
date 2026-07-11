import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

// Shared MarketKit chrome — reuses the portal design language (cyan eyebrow,
// gradient headline, translucent cards) so it sits alongside ChatKit cleanly.

export function MarketKitEyebrow({ children = 'MarketKit' }: { children?: React.ReactNode }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400/80 mb-2">{children}</p>
  )
}

export function BackChip({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-300 border border-white/10 hover:border-white/20 hover:text-white rounded-lg transition-colors w-fit"
    >
      <ChevronLeft className="w-3.5 h-3.5" />
      {label}
    </Link>
  )
}

export function Card({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`bg-[#0d0d20]/80 border border-white/[0.08] rounded-2xl backdrop-blur-sm ${className}`}>
      {children}
    </div>
  )
}

export function Pill({ children, tone = 'gray' }: { children: React.ReactNode; tone?: 'gray' | 'green' | 'yellow' | 'purple' }) {
  const tones: Record<string, string> = {
    gray: 'bg-gray-500/10 text-gray-400',
    green: 'bg-green-500/10 text-green-400',
    yellow: 'bg-yellow-500/10 text-yellow-400',
    purple: 'bg-purple-500/10 text-purple-300',
  }
  return (
    <span className={`text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full ${tones[tone]}`}>
      {children}
    </span>
  )
}
