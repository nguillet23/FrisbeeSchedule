import { Navigate, Route, Routes } from 'react-router-dom'
import { RequireAdmin } from './auth/RequireAdmin'
import { RequireUnlocked } from './auth/RequireUnlocked'
import { AdminPage } from './pages/AdminPage'
import { PasswordPage } from './pages/PasswordPage'
import { SchedulePage } from './pages/SchedulePage'
import { SurveyPage } from './pages/SurveyPage'

export function App() {
  return (
    <Routes>
      <Route path="/password" element={<PasswordPage />} />
      <Route
        path="/"
        element={
          <RequireUnlocked>
            <SchedulePage />
          </RequireUnlocked>
        }
      />
      <Route
        path="/survey"
        element={
          <RequireUnlocked>
            <SurveyPage />
          </RequireUnlocked>
        }
      />
      <Route
        path="/admin"
        element={
          <RequireUnlocked>
            <RequireAdmin>
              <AdminPage />
            </RequireAdmin>
          </RequireUnlocked>
        }
      />
      {/* Catches stale bookmarks/home-screen icons from the old multi-page
          site (index.html, password.html, admin.html, survey.html) and any
          other unmatched path — without this, an unknown path renders
          nothing (just the body background, no UI). */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
