import { createClient } from '@supabase/supabase-js'

// Supabase configuration
// These will be your actual Supabase project credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Database sync utilities
export const syncToSupabase = {
  async syncUser(userData: any) {
    if (!isSupabaseConfigured()) return null
    
    try {
      const { data, error } = await supabase
        .from('users')
        .upsert(userData, { 
          onConflict: 'email',
          ignoreDuplicates: false 
        })
        .select()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error syncing user to Supabase:', error)
      return null
    }
  },

  async syncTeam(teamData: any[]) {
    if (!isSupabaseConfigured()) return null
    
    try {
      const { data, error } = await supabase
        .from('users')
        .upsert(teamData, { 
          onConflict: 'email',
          ignoreDuplicates: false 
        })
        .select()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error syncing team to Supabase:', error)
      return null
    }
  },

  async getTeamFromSupabase() {
    if (!isSupabaseConfigured()) return null
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching team from Supabase:', error)
      return null
    }
  }
}

// Real-time subscriptions for debugging
export const subscribeToChanges = (table: string, callback: (payload: any) => void) => {
  if (!isSupabaseConfigured()) return null
  
  return supabase
    .channel(`public:${table}`)
    .on('postgres_changes', 
      { event: '*', schema: 'public', table },
      callback
    )
    .subscribe()
}