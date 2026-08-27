import { supabase } from '../supabase'

export interface SitePasswords {
  website: string | undefined
  admin: string | undefined
}

export async function getPasswords(): Promise<SitePasswords | null> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value')
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
