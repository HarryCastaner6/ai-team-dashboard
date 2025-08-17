const { PrismaClient } = require('@prisma/client')
const { createClient } = require('@supabase/supabase-js')

const prisma = new PrismaClient()

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Supabase not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file')
  console.log('📖 See SUPABASE_SETUP.md for instructions')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function syncTeamToSupabase() {
  try {
    console.log('🔄 Syncing team data to Supabase...')
    
    // Get all users from PostgreSQL
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        department: true,
        position: true,
        location: true,
        overallRating: true,
        skills: true,
        createdAt: true,
        updatedAt: true
      }
    })

    console.log(`📊 Found ${users.length} users in PostgreSQL`)

    if (users.length === 0) {
      console.log('⚠️  No users found to sync')
      return
    }

    // Transform data for Supabase
    const supabaseUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
      position: user.position,
      location: user.location,
      overall_rating: user.overallRating,
      skills: user.skills,
      created_at: user.createdAt.toISOString(),
      updated_at: user.updatedAt.toISOString()
    }))

    // Sync to Supabase
    const { data, error } = await supabase
      .from('users')
      .upsert(supabaseUsers, { 
        onConflict: 'email',
        ignoreDuplicates: false 
      })
      .select()

    if (error) {
      console.error('❌ Error syncing to Supabase:', error)
      
      if (error.message.includes('relation "public.users" does not exist')) {
        console.log('📝 It looks like you need to create the users table in Supabase.')
        console.log('📖 See SUPABASE_SETUP.md for the SQL commands to create the table.')
      }
      
      return
    }

    console.log(`✅ Successfully synced ${data?.length || 0} users to Supabase`)
    
    // Verify the sync
    const { data: verifyData, error: verifyError } = await supabase
      .from('users')
      .select('id, name, email')
      .limit(5)

    if (!verifyError && verifyData) {
      console.log('🔍 Sample data in Supabase:')
      verifyData.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name} (${user.email})`)
      })
    }

    console.log('🎉 Sync complete! You can now use the debug panel to monitor real-time changes.')

  } catch (error) {
    console.error('❌ Sync failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Test Supabase connection first
async function testConnection() {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1)
    
    if (error) {
      console.log('⚠️  Supabase connection test failed:', error.message)
      
      if (error.message.includes('relation "public.users" does not exist')) {
        console.log('📝 Please create the users table in Supabase first.')
        console.log('📖 See SUPABASE_SETUP.md for instructions.')
        return false
      }
      
      if (error.message.includes('Invalid API key')) {
        console.log('🔑 Please check your Supabase API key in .env.local')
        return false
      }
      
      return false
    }
    
    console.log('✅ Supabase connection successful')
    return true
  } catch (error) {
    console.log('❌ Failed to connect to Supabase:', error)
    return false
  }
}

async function main() {
  console.log('🚀 Team Data Sync to Supabase')
  console.log('================================')
  
  // Test connection first
  const connected = await testConnection()
  
  if (!connected) {
    console.log('📖 Please check SUPABASE_SETUP.md for setup instructions')
    process.exit(1)
  }
  
  // Sync data
  await syncTeamToSupabase()
}

main()