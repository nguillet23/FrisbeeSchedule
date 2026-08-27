import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteScheduleEvent } from '../lib/api/schedule'

export function useDeleteScheduleEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteScheduleEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] })
      queryClient.invalidateQueries({ queryKey: ['scheduleEvents'] })
    },
  })
}
