import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { useSiteGate } from '../auth/SiteGateContext'
import { getPasswords } from '../lib/api/settings'
import styles from './PasswordPage.module.css'

export function PasswordPage() {
  const { unlocked, unlock } = useSiteGate()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')

  if (unlocked) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const entered = password.trim()

    // Unreachable via the UI today — the input's `required` attribute blocks
    // an empty submit before this handler runs (true in the original
    // vanilla-JS version too). Kept as a guard in case that ever changes.
    if (!entered) {
      setMessage('Please enter the password.')
      return
    }

    const passwords = await getPasswords()

    if (!passwords) {
      setMessage('Password system is not configured.')
      return
    }

    if (entered === passwords.website) {
      unlock('viewer')
      return
    }

    if (entered === passwords.admin) {
      unlock('admin')
      return
    }

    setMessage('Wrong password.')
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.card}>
          <h1>Weekly Schedule</h1>
          <p className={styles.subtitle}>Enter the shared password to access the schedule.</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <input
                id="sitePassword"
                type={showPassword ? 'text' : 'password'}
                placeholder=" "
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <label htmlFor="sitePassword">Password</label>
              <button
                type="button"
                className={styles.toggleButton}
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <button type="submit">Enter Website</button>
            <p>{message}</p>
          </form>
        </div>
      </div>
    </div>
  )
}
