import { useQuery } from '@tanstack/react-query'
import { getMembers } from '../lib/api/availability'

export function useMembers() {
  return useQuery({ queryKey: ['members'], queryFn: getMembers })
}
