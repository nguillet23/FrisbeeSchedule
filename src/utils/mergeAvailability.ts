import { DAYS, type Day } from './days'
import { parseHHMMToMinutes } from './time'

export interface MinuteRange {
  start: number
  end: number
}

export interface AvailabilitySlotInput {
  day: Day | string
  start_time: string
  end_time: string
}

// Ported from survey.js's mergeAvailabilitySlots(), unchanged in logic:
// group a member's raw availability rows by day, then merge overlapping or
// touching ranges (slot.start <= previous.end) within each day. Returns raw
// minute ranges — formatting to display strings happens at render time.
export function mergeAvailabilitySlots(slots: AvailabilitySlotInput[]): Record<Day, MinuteRange[]> {
  const grouped = DAYS.reduce(
    (acc, day) => {
      acc[day] = []
      return acc
    },
    {} as Record<Day, MinuteRange[]>,
  )

  slots.forEach((slot) => {
    const day = slot.day as Day
    if (!grouped[day]) {
      return
    }

    grouped[day].push({
      start: parseHHMMToMinutes(slot.start_time),
      end: parseHHMMToMinutes(slot.end_time),
    })
  })

  DAYS.forEach((day) => {
    const merged: MinuteRange[] = []

    grouped[day]
      .sort((a, b) => a.start - b.start)
      .forEach((slot) => {
        const previous = merged[merged.length - 1]

        if (!previous) {
          merged.push({ ...slot })
          return
        }

        if (slot.start <= previous.end) {
          previous.end = Math.max(previous.end, slot.end)
          return
        }

        merged.push({ ...slot })
      })

    grouped[day] = merged
  })

  return grouped
}
