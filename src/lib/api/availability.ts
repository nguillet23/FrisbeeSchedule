import type { AvailabilityRow } from '../../types/database'
import { supabase } from '../supabase'

export interface AvailabilitySlot extends AvailabilityRow {
  members: { name: string } | null
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
