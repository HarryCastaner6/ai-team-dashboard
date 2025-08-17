const { PrismaClient } = require('@prisma/client')
const { createClient } = require('@supabase/supabase-js')

const prisma = new PrismaClient()

// This script quickly syncs your current team data to Supabase
async function quickSync() {
  // Load environment variables
  require('dotenv').config({ path: '.env.local' })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey || 
      supabaseUrl.includes('your-project-id') || 
      supabaseKey.includes('your-key-here')) {
    console.log('⚠️  Supabase not configured yet.')
    console.log('💡 Go to Settings → Supabase in your dashboard to set it up!')
    process.exit(0)
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    console.log('🔄 Quick sync to Supabase...')
    
    // Get team count from PostgreSQL
    const teamCount = await prisma.user.count()
    console.log(`📊 Found ${teamCount} team members in PostgreSQL`)

    if (teamCount === 0) {
      console.log('⚠️  No team members found. Add some first!')
      return
    }

    // Get first 5 members for sync
    const sampleMembers = await prisma.user.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
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

    // Transform for Supabase
    const supabaseData = sampleMembers.map(member => ({
      id: member.id,
      email: member.email,
      name: member.name,
      role: member.role,
      department: member.department,
      position: member.position,
      location: member.location,
      overall_rating: member.overallRating,
      skills: member.skills,
      created_at: member.createdAt.toISOString(),
      updated_at: member.updatedAt.toISOString()
    }))

    // Sync to Supabase
    const { data, error } = await supabase
      .from('users')
      .upsert(supabaseData, { onConflict: 'email' })
      .select()

    if (error) {
      if (error.message.includes('relation "public.users" does not exist')) {
        console.log('❌ Users table not found in Supabase.')
        console.log('📝 Please create the table first (see Settings → Supabase)')
      } else {
        console.log('❌ Sync error:', error.message)
      }
      return
    }

    console.log(`✅ Synced ${data?.length || 0} members to Supabase`)
    console.log('🎉 Quick sync complete! Check your Supabase dashboard.')

  } catch (error) {
    console.log('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

quickSync()