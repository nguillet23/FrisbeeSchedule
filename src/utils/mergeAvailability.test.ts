import { describe, expect, it } from 'vitest'
import { mergeAvailabilitySlots } from './mergeAvailability'

describe('mergeAvailabilitySlots', () => {
  it('merges overlapping ranges on the same day', () => {
    const result = mergeAvailabilitySlots([
      { day: 'Monday', start_time: '10:00', end_time: '11:00' },
      { day: 'Monday', start_time: '10:30', end_time: '12:00' },
    ])

    expect(result.Monday).toEqual([{ start: 600, end: 720 }])
  })

  it('merges touching ranges (end === next start)', () => {
    const result = mergeAvailabilitySlots([
      { day: 'Monday', start_time: '10:00', end_time: '11:00' },
      { day: 'Monday', start_time: '11:00', end_time: '12:00' },
    ])

    expect(result.Monday).toEqual([{ start: 600, end: 720 }])
  })

  it('keeps a gap as two separate ranges', () => {
    const result = mergeAvailabilitySlots([
      { day: 'Monday', start_time: '10:00', end_time: '11:00' },
      { day: 'Monday', start_time: '11:30', end_time: '12:00' },
    ])

    expect(result.Monday).toEqual([
      { start: 600, end: 660 },
      { start: 690, end: 720 },
    ])
  })

  it('sorts out-of-order input before merging', () => {
    const result = mergeAvailabilitySlots([
      { day: 'Monday', start_time: '14:00', end_time: '15:00' },
      { day: 'Monday', start_time: '10:00', end_time: '11:00' },
    ])

    expect(result.Monday).toEqual([
      { start: 600, end: 660 },
      { start: 840, end: 900 },
    ])
  })

  it('returns an empty array for every day with no slots', () => {
    const result = mergeAvailabilitySlots([])
    expect(result.Monday).toEqual([])
    expect(result.Sunday).toEqual([])
  })

  it('ignores a slot for an unrecognized day value', () => {
    const result = mergeAvailabilitySlots([{ day: 'Someday', start_time: '10:00', end_time: '11:00' }])
    expect(result.Monday).toEqual([])
  })
})
