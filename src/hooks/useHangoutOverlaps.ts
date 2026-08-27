import { useMemo } from 'react'
import type { AvailabilitySlot } from '../lib/api/availability'
import { DAYS, type Day } from '../utils/days'
import { minutesToTime, parseHHMMToMinutes } from '../utils/time'

export interface HangoutSlot {
  day: Day
  start: string
  end: string
  people: number
  members: number[]
}

interface RawHangout {
  day: Day
  start: number
  end: number
  people: number
  members: number[]
}

// Ported from app.js's getHangouts(), unchanged in logic: for each day, mark
// every 30-minute slot with the members available then, and merge
// consecutive slots into a range for as long as the exact same headcount
// stays available — a headcount *change* (even between two values that are
// both >=2) starts a new range rather than extending the current one.
export function computeHangoutOverlaps(availability: AvailabilitySlot[]): HangoutSlot[] {
  const hangouts: RawHangout[] = []

  DAYS.forEach((day) => {
    const dayAvailability = availability.filter((slot) => slot.day === day)
    const timeSlots: Record<number, number[]> = {}

    dayAvailability.forEach((slot) => {
      const start = parseHHMMToMinutes(slot.start_time)
      const end = parseHHMMToMinutes(slot.end_time)

      for (let minute = start; minute < end; minute += 30) {
        ;(timeSlots[minute] ??= []).push(slot.member_id)
      }
    })

    let current: RawHangout | null = null

    Object.keys(timeSlots)
      .map(Number)
      .sort((a, b) => a - b)
      .forEach((time) => {
        const members = [...new Set(timeSlots[time])]

        if (members.length >= 2) {
          if (current && current.people === members.length && current.end === time) {
            current.end = time + 30
          } else {
            if (current) {
              hangouts.push(current)
            }

            current = { day, start: time, end: time + 30, people: members.length, members }
          }
        } else if (current) {
          hangouts.push(current)
          current = null
        }
      })

    if (current) {
      hangouts.push(current)
    }
  })

  return hangouts.map((slot) => ({
    ...slot,
    start: minutesToTime(slot.start),
    end: minutesToTime(slot.end),
  }))
}

export function useHangoutOverlaps(availability: AvailabilitySlot[] | undefined): HangoutSlot[] {
  return useMemo(() => computeHangoutOverlaps(availability ?? []), [availability])
}
