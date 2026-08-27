// Hand-written row types matching the existing Supabase schema exactly.
// No schema changes — these describe tables/columns as they already exist.

export interface ScheduleRow {
  id: number
  day: string
  category: string
  start_time: string
  end_time: string
  location: string
  what_to_bring: string | null
}

export interface MemberRow {
  id: number
  name: string
}

export interface AvailabilityRow {
  id: number
  member_id: number
  day: string
  start_time: string
  end_time: string
}

export interface SiteSettingRow {
  key: string
  value: string
}

export interface WebsiteVisitRow {
  id: number
  member_id: number
}

// IMPORTANT: Row/Insert/Update below are fully inlined literal object types,
// duplicating the interfaces above, on purpose. This @supabase/supabase-js
// version's type-level select() parser silently resolves to `never` for a
// table whenever its Row/Insert/Update reference a *named* type (an
// interface, or a computed type like Omit<>/Partial<>) instead of being
// written as a literal object type — verified in isolation against a scratch
// repro. Inlining is the workaround; don't "clean this up" by swapping back
// to `Row: ScheduleRow` etc. without re-checking that bug first.
export type Database = {
  public: {
    Tables: {
      schedule: {
        Row: {
          id: number
          day: string
          category: string
          start_time: string
          end_time: string
          location: string
          what_to_bring: string | null
        }
        Insert: {
          id?: number
          day: string
          category: string
          start_time: string
          end_time: string
          location: string
          what_to_bring?: string | null
        }
        Update: {
          id?: number
          day?: string
          category?: string
          start_time?: string
          end_time?: string
          location?: string
          what_to_bring?: string | null
        }
        Relationships: []
      }
      members: {
        Row: { id: number; name: string }
        Insert: { id?: number; name: string }
        Update: { id?: number; name?: string }
        Relationships: []
      }
      availability: {
        Row: {
          id: number
          member_id: number
          day: string
          start_time: string
          end_time: string
        }
        Insert: {
          id?: number
          member_id: number
          day: string
          start_time: string
          end_time: string
        }
        Update: {
          id?: number
          member_id?: number
          day?: string
          start_time?: string
          end_time?: string
        }
        Relationships: [
          {
            foreignKeyName: 'availability_member_id_fkey'
            columns: ['member_id']
            referencedRelation: 'members'
            referencedColumns: ['id']
          },
        ]
      }
      site_settings: {
        Row: { key: string; value: string }
        Insert: { key: string; value: string }
        Update: { key?: string; value?: string }
        Relationships: []
      }
      website_visits: {
        Row: { id: number; member_id: number }
        Insert: { id?: number; member_id: number }
        Update: { id?: number; member_id?: number }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}
