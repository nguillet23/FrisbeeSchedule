import { useMutation, useQueryClient } from '@tanstack/react-query'
import { trackFormSubmit } from '../lib/api/analytics'
import { updateAvailability, type AvailabilityInput } from '../lib/api/availability'

export function useSubmitAvailability() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      memberId,
      availability,
    }: {
      memberId: number
      availability: AvailabilityInput[]
    }) => {
      await updateAvailability(memberId, availability)
      await trackFormSubmit(memberId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] })
    },
  })
}
