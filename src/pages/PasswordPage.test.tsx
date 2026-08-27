import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SiteGateProvider } from '../auth/SiteGateContext'
import { getPasswords } from '../lib/api/settings'
import { PasswordPage } from './PasswordPage'

vi.mock('../lib/api/settings', () => ({
  getPasswords: vi.fn(),
}))

function renderPasswordPage() {
  render(
    <SiteGateProvider>
      <MemoryRouter initialEntries={['/password']}>
        <PasswordPage />
      </MemoryRouter>
    </SiteGateProvider>,
  )
}

beforeEach(() => {
  sessionStorage.clear()
  vi.mocked(getPasswords).mockReset()
})

describe('PasswordPage', () => {
  // Empty-submission is blocked by the input's `required` attribute at the
  // native HTML5 validation layer before the submit handler ever runs (true
  // in the original vanilla-JS version too) — nothing to test there.

  it('shows an error for a wrong password', async () => {
    vi.mocked(getPasswords).mockResolvedValue({ website: 'letmein', admin: 'adminpass' })
    const user = userEvent.setup()
    renderPasswordPage()

    await user.type(screen.getByLabelText('Password'), 'nope')
    await user.click(screen.getByRole('button', { name: 'Enter Website' }))

    expect(screen.getByText('Wrong password.')).toBeInTheDocument()
    expect(sessionStorage.getItem('frisbeeScheduleUnlocked')).toBeNull()
  })

  it('unlocks as viewer for the website password', async () => {
    vi.mocked(getPasswords).mockResolvedValue({ website: 'letmein', admin: 'adminpass' })
    const user = userEvent.setup()
    renderPasswordPage()

    await user.type(screen.getByLabelText('Password'), 'letmein')
    await user.click(screen.getByRole('button', { name: 'Enter Website' }))

    expect(sessionStorage.getItem('frisbeeScheduleUnlocked')).toBe('true')
    expect(sessionStorage.getItem('role')).toBe('viewer')
  })

  it('unlocks as admin for the admin password', async () => {
    vi.mocked(getPasswords).mockResolvedValue({ website: 'letmein', admin: 'adminpass' })
    const user = userEvent.setup()
    renderPasswordPage()

    await user.type(screen.getByLabelText('Password'), 'adminpass')
    await user.click(screen.getByRole('button', { name: 'Enter Website' }))

    expect(sessionStorage.getItem('frisbeeScheduleUnlocked')).toBe('true')
    expect(sessionStorage.getItem('role')).toBe('admin')
  })

  it('toggles the password field between hidden and visible text', async () => {
    const user = userEvent.setup()
    renderPasswordPage()

    const input = screen.getByLabelText('Password')
    expect(input).toHaveAttribute('type', 'password')

    await user.click(screen.getByRole('button', { name: 'Show' }))
    expect(input).toHaveAttribute('type', 'text')

    await user.click(screen.getByRole('button', { name: 'Hide' }))
    expect(input).toHaveAttribute('type', 'password')
  })
})
