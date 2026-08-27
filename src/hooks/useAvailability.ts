import { useQuery } from '@tanstack/react-query'
import { getAvailability } from '../lib/api/availability'

export function useAvailability() {
  return useQuery({ queryKey: ['availability'], queryFn: getAvailability })
}
