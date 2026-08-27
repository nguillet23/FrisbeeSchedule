import { Route, Routes } from 'react-router-dom'
import { AdminPage } from './pages/AdminPage'
import { PasswordPage } from './pages/PasswordPage'
import { SchedulePage } from './pages/SchedulePage'
import { SurveyPage } from './pages/SurveyPage'

// Auth/route guards land in Phase 1 (RequireUnlocked/RequireAdmin) — this is
// just the routed shell for now, no gating yet.
export function App() {
  return (
    <Routes>
      <Route path="/" element={<SchedulePage />} />
      <Route path="/survey" element={<SurveyPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/password" element={<PasswordPage />} />
    </Routes>
  )
}
