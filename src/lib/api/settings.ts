import { supabase } from '../supabase'
import type { SiteSettingRow } from '../../types/database'

export interface SitePasswords {
  website: string | undefined
  admin: string | undefined
}

export async function getPasswords(): Promise<SitePasswords | null> {
  // NOTE: .select() must be given explicit generics here. A column literally
  // named `key` trips up this postgrest-js version's type-level select
  // parser (verified in isolation — renaming the column to something else
  // fixes the inference, but the column can't be renamed: no schema changes
  // allowed). Passing explicit <Query, Result> generics bypasses the broken
  // inference entirely instead of relying on it.
  const { data, error } = await supabase
    .from('site_settings')
    .select<'key, value', Pick<SiteSettingRow, 'key' | 'value'>>('key, value')
    .in('key', ['website_password', 'admin_password'])

  if (error) {
    console.error('Error loading passwords:', error)
    return null
  }

  return {
    website: data.find((row) => row.key === 'website_password')?.value,
    admin: data.find((row) => row.key === 'admin_password')?.value,
  }
}
