const { createClient } = require('@supabase/supabase-js')
const { PrismaClient } = require('@prisma/client')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

async function syncToSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log('🔄 Syncing team data to Supabase...')
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  const prisma = new PrismaClient()
  
  try {
    // Check if table exists
    const { error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.log('❌ Users table not found in Supabase')
      console.log('Please create the table first using the SQL provided')
      return
    }
    
    // Get team members from local database
    const teamMembers = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        role: true,
        department: true,
        position: true,
        location: true,
        overallRating: true,
        skills: true
      }
    })
    
    console.log(`📊 Found ${teamMembers.length} team members in local database`)
    
    if (teamMembers.length === 0) {
      console.log('⚠️ No team members to sync')
      return
    }
    
    // Map field names for Supabase (overall_rating vs overallRating)
    const supabaseData = teamMembers.map(member => {
      const { overallRating, ...rest } = member
      return {
        ...rest,
        overall_rating: overallRating
      }
    })
    
    // Sync to Supabase
    const { data, error } = await supabase
      .from('users')
      .upsert(supabaseData, { 
        onConflict: 'email',
        ignoreDuplicates: false 
      })
      .select()
    
    if (error) {
      console.log('❌ Sync failed:', error.message)
    } else {
      console.log(`✅ Successfully synced ${teamMembers.length} team members to Supabase!`)
      
      // Verify sync
      const { count } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
      
      console.log(`📈 Total users in Supabase: ${count}`)
    }
    
  } catch (error) {
    console.log('❌ Sync failed:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

syncToSupabase()