const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

async function debugSupabase() {
  console.log('🔍 Supabase Connection Diagnostics')
  console.log('=================================')
  
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log('\n📋 Environment Check:')
  console.log(`   URL: ${supabaseUrl ? '✅ Found' : '❌ Missing'}`)
  console.log(`   Key: ${supabaseKey ? '✅ Found' : '❌ Missing'}`)
  
  if (supabaseUrl) {
    console.log(`   URL Value: ${supabaseUrl}`)
  }
  if (supabaseKey) {
    console.log(`   Key Value: ${supabaseKey.substring(0, 20)}...`)
  }
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('\n❌ Environment variables not found or incorrect')
    console.log('   Check your .env.local file')
    return
  }
  
  // Check URL format
  if (!supabaseUrl.includes('.supabase.co')) {
    console.log('\n⚠️  URL format seems incorrect')
    console.log('   Should be: https://your-project.supabase.co')
    return
  }
  
  // Check key format
  if (!supabaseKey.startsWith('eyJ')) {
    console.log('\n⚠️  Key format seems incorrect')
    console.log('   Should start with: eyJ...')
    return
  }
  
  console.log('\n✅ Environment variables look correct')
  
  // Test basic connection
  console.log('\n🔌 Testing Connection...')
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Test 1: Basic health check
    console.log('   Test 1: Basic health check...')
    const { data: healthData, error: healthError } = await supabase
      .from('_health')
      .select('*')
      .limit(1)
    
    if (healthError && !healthError.message.includes('relation "_health" does not exist')) {
      console.log(`   ❌ Health check failed: ${healthError.message}`)
      return
    } else {
      console.log('   ✅ Basic connection successful')
    }
    
    // Test 2: Check if users table exists
    console.log('   Test 2: Checking users table...')
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (usersError) {
      if (usersError.message.includes('relation "public.users" does not exist')) {
        console.log('   ⚠️  Users table does not exist')
        console.log('   📝 You need to create the users table in Supabase')
        console.log('   💡 Go to Settings → Supabase and run the SQL setup')
        showTableSetup()
      } else if (usersError.message.includes('JWT')) {
        console.log('   ❌ Authentication error - check your anon key')
      } else {
        console.log(`   ❌ Users table error: ${usersError.message}`)
      }
    } else {
      console.log('   ✅ Users table exists and accessible')
    }
    
    // Test 3: Test insert permission (if table exists)
    if (!usersError) {
      console.log('   Test 3: Testing permissions...')
      const testUser = {
        id: 'test-' + Date.now(),
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER'
      }
      
      const { error: insertError } = await supabase
        .from('users')
        .insert(testUser)
      
      if (insertError) {
        console.log(`   ⚠️  Insert test failed: ${insertError.message}`)
        if (insertError.message.includes('RLS')) {
          console.log('   💡 You may need to adjust Row Level Security policies')
        }
      } else {
        console.log('   ✅ Insert permissions working')
        // Clean up test user
        await supabase.from('users').delete().eq('id', testUser.id)
      }
    }
    
  } catch (error) {
    console.log(`\n❌ Connection failed: ${error.message}`)
    
    if (error.message.includes('fetch')) {
      console.log('\n🔍 Possible causes:')
      console.log('   • Internet connection issue')
      console.log('   • Supabase project is paused (free tier)')
      console.log('   • Incorrect project URL')
      console.log('   • Firewall blocking connection')
    }
  }
}

function showTableSetup() {
  console.log('\n📝 SQL to create users table:')
  console.log('   Copy this into Supabase SQL Editor:')
  console.log('')
  console.log('   CREATE TABLE public.users (')
  console.log('     id uuid DEFAULT gen_random_uuid() PRIMARY KEY,')
  console.log('     email text UNIQUE NOT NULL,')
  console.log('     name text NOT NULL,')
  console.log('     role text DEFAULT \'USER\',')
  console.log('     department text,')
  console.log('     position text,')
  console.log('     location text,')
  console.log('     overall_rating integer DEFAULT 70,')
  console.log('     skills jsonb,')
  console.log('     created_at timestamp with time zone DEFAULT timezone(\'utc\'::text, now()) NOT NULL,')
  console.log('     updated_at timestamp with time zone DEFAULT timezone(\'utc\'::text, now()) NOT NULL')
  console.log('   );')
  console.log('')
  console.log('   ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;')
  console.log('   CREATE POLICY "Allow all operations" ON public.users FOR ALL USING (true);')
  console.log('   ALTER PUBLICATION supabase_realtime ADD TABLE public.users;')
}

debugSupabase()