import { useQuery } from '@tanstack/react-query'
import { getSchedule } from '../lib/api/schedule'

export function useSchedule() {
  return useQuery({ queryKey: ['schedule'], queryFn: getSchedule })
}
