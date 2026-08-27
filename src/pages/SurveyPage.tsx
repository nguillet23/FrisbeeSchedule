import { useState, type FormEvent } from 'react'
import { AvailabilityBlockList } from '../components/survey/AvailabilityBlockList'
import type { AvailabilityBlockState } from '../components/survey/AvailabilityBlockRow'
import { MemberPicker } from '../components/survey/MemberPicker'
import { MemberSchedulePreview } from '../components/survey/MemberSchedulePreview'
import styles from '../components/survey/Survey.module.css'
import { Navbar } from '../components/layout/Navbar'
import { useAvailability } from '../hooks/useAvailability'
import { useMembers } from '../hooks/useMembers'
import { useSubmitAvailability } from '../hooks/useSubmitAvailability'
import type { AvailabilityInput } from '../lib/api/availability'
import { mergeAvailabilitySlots } from '../utils/mergeAvailability'
import { validTime } from '../utils/time'

let nextBlockId = 0
function createBlock(): AvailabilityBlockState {
  nextBlockId += 1
  return { id: nextBlockId, day: 'Monday', startTime: '', endTime: '' }
}

export function SurveyPage() {
  const membersQuery = useMembers()
  const availabilityQuery = useAvailability()
  const submitAvailability = useSubmitAvailability()

  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null)
  const [blocks, setBlocks] = useState<AvailabilityBlockState[]>(() => [createBlock()])

  // Matches the original's `nameDropdown.selectedIndex = 0` — default to the
  // first member once the list loads, without needing an effect to sync it.
  const members = membersQuery.data ?? []
  const effectiveMemberId = selectedMemberId ?? members[0]?.id ?? null

  const selectedMember = members.find((member) => member.id === effectiveMemberId) ?? null

  const memberSlots =
    effectiveMemberId == null
      ? []
      : (availabilityQuery.data ?? []).filter((slot) => Number(slot.member_id) === effectiveMemberId)

  const merged = effectiveMemberId == null ? null : mergeAvailabilitySlots(memberSlots)

  function handleAddBlock() {
    setBlocks((current) => [...current, createBlock()])
  }

  function handleRemoveBlock(id: number) {
    setBlocks((current) => current.filter((block) => block.id !== id))
  }

  function handleChangeBlock(id: number, patch: Partial<Omit<AvailabilityBlockState, 'id'>>) {
    setBlocks((current) => current.map((block) => (block.id === id ? { ...block, ...patch } : block)))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (effectiveMemberId == null) {
      return
    }

    const availability: AvailabilityInput[] = blocks.map((block) => ({
      member_id: effectiveMemberId,
      day: block.day,
      start_time: block.startTime,
      end_time: block.endTime,
    }))

    for (const slot of availability) {
      if (!validTime(slot.start_time) || !validTime(slot.end_time)) {
        alert('Times must be between 10:00 AM and 10:00 PM.')
        return
      }

      if (slot.start_time >= slot.end_time) {
        alert('End time must be after start time.')
        return
      }
    }

    await submitAvailability.mutateAsync({ memberId: effectiveMemberId, availability })
    alert('Availability saved!')
  }

  return (
    <div className="container">
      <Navbar />

      <h1>Availability Survey</h1>

      <div className={styles.surveyLayout}>
        <form className={styles.surveyForm} onSubmit={handleSubmit}>
          <MemberPicker
            members={members}
            isLoading={membersQuery.isLoading}
            selectedId={effectiveMemberId}
            onChange={setSelectedMemberId}
          />

          <br />
          <h2>Add the days you are available</h2>
          <br />

          <AvailabilityBlockList
            blocks={blocks}
            onChangeBlock={handleChangeBlock}
            onRemoveBlock={handleRemoveBlock}
            onAddBlock={handleAddBlock}
          />

          <br />

          <button type="submit">Submit</button>
        </form>

        <MemberSchedulePreview memberName={selectedMember?.name ?? null} merged={merged} />
      </div>
    </div>
  )
}
