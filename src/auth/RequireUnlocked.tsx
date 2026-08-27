import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useSiteGate } from './SiteGateContext'

export function RequireUnlocked({ children }: { children: ReactNode }) {
  const { unlocked } = useSiteGate()

  if (!unlocked) {
    return <Navigate to="/password" replace />
  }

  return children
}
