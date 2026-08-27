import { describe, expect, it } from 'vitest'
import type { AvailabilitySlot } from '../lib/api/availability'
import { computeHangoutOverlaps } from './useHangoutOverlaps'

function slot(
  day: AvailabilitySlot['day'],
  memberId: number,
  start: string,
  end: string,
): AvailabilitySlot {
  return {
    id: memberId * 1000 + start.length,
    member_id: memberId,
    day,
    start_time: start,
    end_time: end,
    members: null,
  }
}

describe('computeHangoutOverlaps', () => {
  it('returns nothing when fewer than 2 people overlap', () => {
    const result = computeHangoutOverlaps([slot('Monday', 1, '10:00', '11:00')])
    expect(result).toEqual([])
  })

  it('merges a contiguous 2-person overlap into a single range', () => {
    const result = computeHangoutOverlaps([
      slot('Monday', 1, '10:00', '11:00'),
      slot('Monday', 2, '10:00', '11:00'),
    ])

    expect(result).toEqual([
      { day: 'Monday', start: '10:00 AM', end: '11:00 AM', people: 2, members: [1, 2] },
    ])
  })

  it('splits into separate ranges when the headcount changes mid-block', () => {
    // 10:00-10:30 -> members 1,2 (2 people); 10:30-11:00 -> members 1,2,3 (3 people).
    // Contiguous in time, but headcount differs, so this must NOT merge into one range.
    const result = computeHangoutOverlaps([
      slot('Monday', 1, '10:00', '11:00'),
      slot('Monday', 2, '10:00', '11:00'),
      slot('Monday', 3, '10:30', '11:00'),
    ])

    expect(result).toEqual([
      { day: 'Monday', start: '10:00 AM', end: '10:30 AM', people: 2, members: [1, 2] },
      { day: 'Monday', start: '10:30 AM', end: '11:00 AM', people: 3, members: [1, 2, 3] },
    ])
  })

  it('splits into separate ranges across a gap where headcount drops below 2', () => {
    const result = computeHangoutOverlaps([
      slot('Monday', 1, '10:00', '10:30'),
      slot('Monday', 2, '10:00', '10:30'),
      // 10:30-11:00: only member 1 available (gap, <2 people)
      slot('Monday', 1, '10:30', '11:30'),
      slot('Monday', 2, '11:00', '11:30'),
    ])

    expect(result).toEqual([
      { day: 'Monday', start: '10:00 AM', end: '10:30 AM', people: 2, members: [1, 2] },
      { day: 'Monday', start: '11:00 AM', end: '11:30 AM', people: 2, members: [1, 2] },
    ])
  })

  it('keeps overlaps scoped to their own day', () => {
    const result = computeHangoutOverlaps([
      slot('Monday', 1, '10:00', '11:00'),
      slot('Monday', 2, '10:00', '11:00'),
      slot('Tuesday', 3, '10:00', '11:00'),
      slot('Tuesday', 4, '10:00', '11:00'),
    ])

    expect(result).toEqual([
      { day: 'Monday', start: '10:00 AM', end: '11:00 AM', people: 2, members: [1, 2] },
      { day: 'Tuesday', start: '10:00 AM', end: '11:00 AM', people: 2, members: [3, 4] },
    ])
  })

  it('dedupes a member counted twice in the same slot from overlapping availability rows', () => {
    const result = computeHangoutOverlaps([
      slot('Monday', 1, '10:00', '11:00'),
      slot('Monday', 1, '10:30', '11:30'), // same member, second row overlapping the first
      slot('Monday', 2, '10:00', '11:30'),
    ])

    // 10:00-10:30: members {1,2} -> 2 people. 10:30-11:00: members {1,1,2} deduped -> {1,2} -> still 2 people, same headcount, contiguous -> merges.
    expect(result).toEqual([
      { day: 'Monday', start: '10:00 AM', end: '11:30 AM', people: 2, members: [1, 2] },
    ])
  })
})
