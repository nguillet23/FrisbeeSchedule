import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useSiteGate } from './SiteGateContext'

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { role } = useSiteGate()

  if (role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}
