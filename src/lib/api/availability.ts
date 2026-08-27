import type { AvailabilityRow, MemberRow } from '../../types/database'
import type { Day } from '../../utils/days'
import { supabase } from '../supabase'

export interface AvailabilitySlot extends AvailabilityRow {
  members: { name: string } | null
}

export interface AvailabilityInput {
  member_id: number
  day: Day
  start_time: string
  end_time: string
}

export async function getAvailability(): Promise<AvailabilitySlot[]> {
  const { data, error } = await supabase
    .from('availability')
    .select('id, member_id, day, start_time, end_time, members ( name )')

  if (error) {
    console.error('Error loading availability:', error)
    return []
  }

  return data
}

export async function getMemberNames(memberIds: number[]): Promise<string[]> {
  const { data, error } = await supabase.from('members').select('name').in('id', memberIds)

  if (error) {
    console.error('Error loading member names:', error)
    return []
  }

  return data.map((row) => row.name)
}

export async function getMembers(): Promise<MemberRow[]> {
  const { data, error } = await supabase.from('members').select('*').order('name')

  if (error) {
    console.error('Error loading members:', error)
    return []
  }

  return data
}

export async function updateAvailability(
  memberId: number,
  availability: AvailabilityInput[],
): Promise<void> {
  const { error: deleteError } = await supabase.from('availability').delete().eq('member_id', memberId)

  if (deleteError) {
    console.error('Error deleting availability:', deleteError)
    return
  }

  const { error: insertError } = await supabase.from('availability').insert(availability)

  if (insertError) {
    console.error('Error inserting availability:', insertError)
  }
}
