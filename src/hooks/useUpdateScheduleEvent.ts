import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateScheduleEvent, type NewScheduleEvent } from '../lib/api/schedule'

export function useUpdateScheduleEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, event }: { id: number; event: NewScheduleEvent }) => updateScheduleEvent(id, event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] })
      queryClient.invalidateQueries({ queryKey: ['scheduleEvents'] })
    },
  })
}
