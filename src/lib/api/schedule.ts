import type { ScheduleRow } from '../../types/database'
import { DAYS, type Day } from '../../utils/days'
import { convertTime } from '../../utils/time'
import { supabase } from '../supabase'

export interface ScheduleEntry {
  day: Day
  category: string
  start: string
  end: string
  location: string
  what_to_bring: string
}

export interface NewScheduleEvent {
  day: Day
  category: string
  start_time: string
  end_time: string
  location: string
  what_to_bring: string
}

export async function getSchedule(): Promise<Record<Day, ScheduleEntry[]>> {
  const schedule = DAYS.reduce(
    (acc, day) => {
      acc[day] = []
      return acc
    },
    {} as Record<Day, ScheduleEntry[]>,
  )

  const { data, error } = await supabase.from('schedule').select('*').order('id')

  if (error) {
    console.error(error)
    return schedule
  }

  data.forEach((event) => {
    schedule[event.day as Day]?.push({
      day: event.day as Day,
      category: event.category,
      start: convertTime(event.start_time),
      end: convertTime(event.end_time),
      location: event.location,
      what_to_bring: event.what_to_bring || 'N/A',
    })
  })

  return schedule
}

// Raw rows, unconverted (admin.js showed times as-entered, e.g. "17:00",
// not the 12h "5:00 PM" the public calendar formats them as — preserved
// as-is, not obviously a bug so not "fixed" to match the calendar view).
export async function getScheduleEvents(): Promise<ScheduleRow[]> {
  const { data, error } = await supabase.from('schedule').select('*').order('id')

  if (error) {
    console.error(error)
    return []
  }

  return data
}

export async function addScheduleEvent(event: NewScheduleEvent): Promise<void> {
  const { error } = await supabase.from('schedule').insert(event)

  if (error) {
    console.error(error)
  }
}

export async function updateScheduleEvent(id: number, event: NewScheduleEvent): Promise<void> {
  const { error } = await supabase.from('schedule').update(event).eq('id', id)

  if (error) {
    console.error(error)
  }
}

export async function deleteScheduleEvent(id: number): Promise<void> {
  const { error } = await supabase.from('schedule').delete().eq('id', id)

  if (error) {
    console.error(error)
  }
}
