import type { CSSProperties } from 'react'
import { timeToMinutes } from '../../utils/time'

export const CALENDAR_START_HOUR = 10
export const CALENDAR_END_HOUR = 22
export const HOUR_HEIGHT_PX = 60

export function getHourLabels(): string[] {
  const labels: string[] = []

  for (let hour = CALENDAR_START_HOUR; hour <= CALENDAR_END_HOUR; hour++) {
    const displayHour = hour > 12 ? hour - 12 : hour
    const period = hour >= 12 ? 'PM' : 'AM'
    labels.push(`${displayHour}:00 ${period}`)
  }

  return labels
}

// Ported from renderSchedule()'s inline top/height math.
export function getEntryStyle(start: string, end: string): CSSProperties {
  const startMinutes = timeToMinutes(start)
  const endMinutes = timeToMinutes(end)

  return {
    top: `${((startMinutes - CALENDAR_START_HOUR * 60) / 60) * HOUR_HEIGHT_PX}px`,
    height: `${Math.max(((endMinutes - startMinutes) / 60) * HOUR_HEIGHT_PX, 30)}px`,
  }
}
