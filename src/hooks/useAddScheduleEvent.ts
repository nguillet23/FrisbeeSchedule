import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addScheduleEvent } from '../lib/api/schedule'

export function useAddScheduleEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addScheduleEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] })
      queryClient.invalidateQueries({ queryKey: ['scheduleEvents'] })
    },
  })
}
