import { Route, Routes } from 'react-router-dom'
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
    </Routes>
  )
}
