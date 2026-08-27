import type { MemberRow } from '../../types/database'

export function MemberPicker({
  members,
  isLoading,
  selectedId,
  onChange,
}: {
  members: MemberRow[]
  isLoading: boolean
  selectedId: number | null
  onChange: (id: number) => void
}) {
  return (
    <>
      <label htmlFor="name">Name:</label>
      <select id="name" value={selectedId ?? ''} onChange={(event) => onChange(Number(event.target.value))}>
        {isLoading ? (
          <option value="">Loading...</option>
        ) : (
          members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))
        )}
      </select>
    </>
  )
}
