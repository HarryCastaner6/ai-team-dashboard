const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

async function createUsersTable() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.log('❌ Missing Supabase credentials')
    console.log('Please check your .env.local file')
    return
  }
  
  console.log('🔧 Creating users table in Supabase...')
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  try {
    // Create the users table
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.users (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          email text UNIQUE NOT NULL,
          name text NOT NULL,
          role text DEFAULT 'USER',
          department text,
          position text,
          location text,
          overall_rating integer DEFAULT 70,
          skills jsonb,
          created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
          updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
        );
        
        ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
        CREATE POLICY IF NOT EXISTS "Allow all operations" ON public.users FOR ALL USING (true);
        ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
      `
    })
    
    if (createError) {
      console.log('❌ Error creating table:', createError.message)
      
      // Try alternative method
      console.log('🔄 Trying alternative approach...')
      
      const { error: altError } = await supabase
        .from('_dummy')
        .select('*')
        .limit(1)
      
      console.log('Alternative method result:', altError ? altError.message : 'Success')
      
      console.log('\n📝 Manual Setup Required:')
      console.log('Go to your Supabase project → SQL Editor → New Query')
      console.log('Copy and paste this SQL:')
      console.log('\n' + '='.repeat(50))
      console.log(`CREATE TABLE public.users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text DEFAULT 'USER',
  department text,
  position text,
  location text,
  overall_rating integer DEFAULT 70,
  skills jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations" ON public.users FOR ALL USING (true);
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;`)
      console.log('='.repeat(50))
      console.log('\nThen click "Run" to execute the SQL.')
      
    } else {
      console.log('✅ Users table created successfully!')
      
      // Test the table
      const { data, error: testError } = await supabase
        .from('users')
        .select('count')
        .limit(1)
      
      if (testError) {
        console.log('⚠️ Table created but test failed:', testError.message)
      } else {
        console.log('✅ Table is working correctly!')
        
        // Now sync some data
        console.log('🔄 Syncing team data...')
        
        const { PrismaClient } = require('@prisma/client')
        const prisma = new PrismaClient()
        
        try {
          const teamMembers = await prisma.user.findMany({
            select: {
              email: true,
              name: true,
              role: true,
              department: true,
              position: true,
              location: true,
              overall_rating: true,
              skills: true
            }
          })
          
          if (teamMembers.length > 0) {
            const { error: insertError } = await supabase
              .from('users')
              .upsert(teamMembers, { 
                onConflict: 'email',
                ignoreDuplicates: false 
              })
            
            if (insertError) {
              console.log('⚠️ Sync error:', insertError.message)
            } else {
              console.log(`✅ Synced ${teamMembers.length} team members to Supabase!`)
            }
          }
          
        } catch (syncError) {
          console.log('⚠️ Sync failed:', syncError.message)
        } finally {
          await prisma.$disconnect()
        }
      }
    }
    
  } catch (error) {
    console.log('❌ Connection failed:', error.message)
    console.log('\n🔍 Troubleshooting:')
    console.log('1. Check your internet connection')
    console.log('2. Verify Supabase project is active (not paused)')
    console.log('3. Confirm service role key is correct')
  }
}

createUsersTable()