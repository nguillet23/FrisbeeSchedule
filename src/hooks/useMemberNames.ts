import { useQuery } from '@tanstack/react-query'
import { getMemberNames } from '../lib/api/availability'

export function useMemberNames(memberIds: number[] | undefined) {
  return useQuery({
    queryKey: ['memberNames', memberIds],
    queryFn: () => getMemberNames(memberIds ?? []),
    enabled: !!memberIds && memberIds.length > 0,
  })
}
