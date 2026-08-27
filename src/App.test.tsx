import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('App routing', () => {
  it('renders the schedule page at /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Weekly Schedule' })).toBeInTheDocument()
  })

  it('renders the survey page at /survey', () => {
    render(
      <MemoryRouter initialEntries={['/survey']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Availability Survey' })).toBeInTheDocument()
  })
})
