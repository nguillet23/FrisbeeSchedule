import { NavLink } from 'react-router-dom'
import { useSiteGate } from '../../auth/SiteGateContext'

function navLinkClassName({ isActive }: { isActive: boolean }) {
  return isActive ? 'active' : undefined
}

export function Navbar() {
  const { role } = useSiteGate()

  return (
    <nav className="navbar">
      <NavLink to="/" end className={navLinkClassName}>
        Schedule
      </NavLink>
      <NavLink to="/survey" className={navLinkClassName}>
        Availability Survey
      </NavLink>
      {role === 'admin' && (
        <NavLink to="/admin" className={navLinkClassName}>
          Admin
        </NavLink>
      )}
    </nav>
  )
}
