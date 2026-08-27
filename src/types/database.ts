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

// supabase-js's typed query builder requires each table to carry a
// `Relationships` array and the schema to declare `Views`/`Functions`
// (even when empty) to satisfy its `GenericSchema`/`GenericTable` shape.
export type Database = {
  public: {
    Tables: {
      schedule: {
        Row: ScheduleRow
        Insert: Omit<ScheduleRow, 'id'> & { id?: number }
        Update: Partial<Omit<ScheduleRow, 'id'>>
        Relationships: []
      }
      members: {
        Row: MemberRow
        Insert: Omit<MemberRow, 'id'> & { id?: number }
        Update: Partial<Omit<MemberRow, 'id'>>
        Relationships: []
      }
      availability: {
        Row: AvailabilityRow
        Insert: Omit<AvailabilityRow, 'id'> & { id?: number }
        Update: Partial<Omit<AvailabilityRow, 'id'>>
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
        Row: SiteSettingRow
        Insert: SiteSettingRow
        Update: Partial<SiteSettingRow>
        Relationships: []
      }
      website_visits: {
        Row: WebsiteVisitRow
        Insert: Omit<WebsiteVisitRow, 'id'> & { id?: number }
        Update: Partial<Omit<WebsiteVisitRow, 'id'>>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}
