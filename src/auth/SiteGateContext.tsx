import { createContext, useContext, useState, type ReactNode } from 'react'

export type Role = 'viewer' | 'admin'

interface SiteGateValue {
  unlocked: boolean
  role: Role | null
  unlock: (role: Role) => void
}

const UNLOCKED_KEY = 'frisbeeScheduleUnlocked'
const ROLE_KEY = 'role'

const SiteGateContext = createContext<SiteGateValue | null>(null)

function readRole(): Role | null {
  const stored = sessionStorage.getItem(ROLE_KEY)
  return stored === 'admin' || stored === 'viewer' ? stored : null
}

export function SiteGateProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(UNLOCKED_KEY) === 'true')
  const [role, setRole] = useState<Role | null>(readRole)

  function unlock(nextRole: Role) {
    sessionStorage.setItem(UNLOCKED_KEY, 'true')
    sessionStorage.setItem(ROLE_KEY, nextRole)
    setUnlocked(true)
    setRole(nextRole)
  }

  return (
    <SiteGateContext.Provider value={{ unlocked, role, unlock }}>
      {children}
    </SiteGateContext.Provider>
  )
}

export function useSiteGate(): SiteGateValue {
  const context = useContext(SiteGateContext)

  if (!context) {
    throw new Error('useSiteGate must be used within a SiteGateProvider')
  }

  return context
}
