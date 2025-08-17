const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

async function testSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log('🔌 Testing Supabase Connection...')
  console.log(`URL: ${supabaseUrl}`)
  console.log(`Key: ${supabaseKey.substring(0, 20)}...`)
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  try {
    // Test if users table exists
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      if (error.message.includes('relation "public.users" does not exist')) {
        console.log('✅ Connection successful!')
        console.log('⚠️  Users table not found - you need to create it')
        console.log('📝 Go to Supabase SQL Editor and run:')
        console.log('')
        console.log('CREATE TABLE public.users (')
        console.log('  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,')
        console.log('  email text UNIQUE NOT NULL,')
        console.log('  name text NOT NULL,')
        console.log('  role text DEFAULT \'USER\',')
        console.log('  department text,')
        console.log('  position text,')
        console.log('  location text,')
        console.log('  overall_rating integer DEFAULT 70,')
        console.log('  skills jsonb,')
        console.log('  created_at timestamp with time zone DEFAULT timezone(\'utc\'::text, now()) NOT NULL,')
        console.log('  updated_at timestamp with time zone DEFAULT timezone(\'utc\'::text, now()) NOT NULL')
        console.log(');')
        console.log('')
        console.log('ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;')
        console.log('CREATE POLICY "Allow all operations" ON public.users FOR ALL USING (true);')
        console.log('ALTER PUBLICATION supabase_realtime ADD TABLE public.users;')
      } else {
        console.log(`❌ Error: ${error.message}`)
      }
    } else {
      console.log('✅ Connection and users table both working!')
    }
  } catch (error) {
    console.log(`❌ Connection failed: ${error.message}`)
  }
}

testSupabase()