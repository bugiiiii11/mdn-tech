'use client'

import dynamic from 'next/dynamic'

const StarsCanvas = dynamic(
  () => import('@/components/main/star-background').then((m) => ({ default: m.StarsCanvas })),
  { ssr: false }
)

export function PortalBackground() {
  return <StarsCanvas />
}
