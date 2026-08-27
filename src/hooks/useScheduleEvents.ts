import { useQuery } from '@tanstack/react-query'
import { getScheduleEvents } from '../lib/api/schedule'

export function useScheduleEvents() {
  return useQuery({ queryKey: ['scheduleEvents'], queryFn: getScheduleEvents })
}
