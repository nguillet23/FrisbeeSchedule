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
