import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { App } from './App'
import { SiteGateProvider } from './auth/SiteGateContext'

// SchedulePage (rendered at "/") and AdminPage (rendered at "/admin") pull
// from Supabase via these — App-level tests only care about routing/gating,
// not page content, so stub them.
vi.mock('./lib/api/schedule', () => ({
  getSchedule: vi.fn().mockResolvedValue({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  }),
  getScheduleEvents: vi.fn().mockResolvedValue([]),
  addScheduleEvent: vi.fn(),
  updateScheduleEvent: vi.fn(),
  deleteScheduleEvent: vi.fn(),
}))
vi.mock('./lib/api/availability', () => ({
  getAvailability: vi.fn().mockResolvedValue([]),
  getMemberNames: vi.fn().mockResolvedValue([]),
}))

function renderAt(path: string) {
  const queryClient = new QueryClient()

  render(
    <QueryClientProvider client={queryClient}>
      <SiteGateProvider>
        <MemoryRouter initialEntries={[path]}>
          <App />
        </MemoryRouter>
      </SiteGateProvider>
    </QueryClientProvider>,
  )
}

function unlockAs(role: 'viewer' | 'admin') {
  sessionStorage.setItem('frisbeeScheduleUnlocked', 'true')
  sessionStorage.setItem('role', role)
}

beforeEach(() => {
  sessionStorage.clear()
})

describe('site gate', () => {
  it('sends a locked visitor to the password page regardless of route', () => {
    renderAt('/survey')
    expect(
      screen.getByText('Enter the shared password to access the schedule.'),
    ).toBeInTheDocument()
  })

  it('lets an unlocked viewer see the schedule and survey pages', () => {
    unlockAs('viewer')
    renderAt('/')
    expect(screen.getByRole('heading', { name: 'Weekly Schedule' })).toBeInTheDocument()
  })

  it('bounces a non-admin viewer away from /admin', () => {
    unlockAs('viewer')
    renderAt('/admin')
    expect(screen.queryByRole('heading', { name: 'Schedule Admin' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Weekly Schedule' })).toBeInTheDocument()
  })

  it('lets an admin reach /admin', () => {
    unlockAs('admin')
    renderAt('/admin')
    expect(screen.getByRole('heading', { name: 'Schedule Admin' })).toBeInTheDocument()
  })

  it('redirects an already-unlocked visitor away from /password', () => {
    unlockAs('viewer')
    renderAt('/password')
    expect(screen.getByRole('heading', { name: 'Weekly Schedule' })).toBeInTheDocument()
    expect(
      screen.queryByText('Enter the shared password to access the schedule.'),
    ).not.toBeInTheDocument()
  })
})
