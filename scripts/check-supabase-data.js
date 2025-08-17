const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function checkSupabaseData() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log('🔍 Checking Supabase Data...\n')
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  try {
    // Check users table
    const { data: users, error: usersError, count } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
    
    if (usersError) {
      console.log('❌ Error reading users:', usersError.message)
      return
    }
    
    console.log('📊 Users Table Status:')
    console.log(`   Total Users: ${count || 0}`)
    
    if (users && users.length > 0) {
      console.log('\n👥 Sample Users:')
      users.slice(0, 3).forEach(user => {
        console.log(`   - ${user.name} (${user.email})`)
        console.log(`     Department: ${user.department || 'N/A'}`)
        console.log(`     Location: ${user.location || 'N/A'}`)
        console.log(`     Rating: ${user.overall_rating || 'N/A'}`)
        console.log('')
      })
    } else {
      console.log('\n⚠️  No users found in Supabase')
      console.log('   Run: node scripts/sync-after-table-creation.js')
      console.log('   to sync your local data to Supabase')
    }
    
    // Check for other tables
    console.log('\n📋 Checking for other tables...')
    
    // Try tasks table
    const { error: tasksError } = await supabase
      .from('tasks')
      .select('count')
      .limit(1)
    
    if (tasksError) {
      if (tasksError.message.includes('relation "public.tasks" does not exist')) {
        console.log('   ⚠️  Tasks table not found')
      }
    } else {
      console.log('   ✅ Tasks table exists')
    }
    
    // Try boards table
    const { error: boardsError } = await supabase
      .from('boards')
      .select('count')
      .limit(1)
    
    if (boardsError) {
      if (boardsError.message.includes('relation "public.boards" does not exist')) {
        console.log('   ⚠️  Boards table not found')
      }
    } else {
      console.log('   ✅ Boards table exists')
    }
    
    console.log('\n✅ Supabase Status Check Complete!')
    console.log('\n📝 Next Steps:')
    console.log('1. Your Supabase is connected and working')
    console.log('2. You have ' + (count || 0) + ' users in the database')
    console.log('3. To debug with Claude, share these credentials:')
    console.log('   - URL: ' + supabaseUrl)
    console.log('   - Anon Key: ' + supabaseKey.substring(0, 20) + '...')
    console.log('\n4. Claude can then:')
    console.log('   - Query your data directly')
    console.log('   - Help debug issues with live data')
    console.log('   - Monitor changes in real-time')
    console.log('   - Suggest optimizations')
    
  } catch (error) {
    console.log('❌ Error:', error.message)
  }
}

checkSupabaseData()