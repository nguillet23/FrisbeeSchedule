import { supabase } from '../supabase'

// Ported from analytics.js. The original spun up its own separate
// createClient(...) instance rather than reusing the shared one from
// supabase.js — consolidated to the shared client here, no behavior change.
export async function trackFormSubmit(memberId: number): Promise<void> {
  const { error } = await supabase.from('website_visits').insert({ member_id: memberId })

  if (error) {
    console.error('Submit tracking error:', error)
  }
}
