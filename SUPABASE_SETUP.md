# Supabase Integration Setup Guide

This guide will help you set up Supabase integration for real-time debugging and better database management.

## Why Supabase?

1. **Real-time Monitoring**: See database changes in real-time
2. **Better Debugging**: Visual database explorer and query tools
3. **Collaboration**: Share database access for debugging sessions
4. **Backup & Sync**: Keep data synchronized across environments
5. **Performance Insights**: Monitor query performance and usage

## Setup Steps

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" → "Sign up"
3. Create a new organization and project
4. Choose a region close to your location
5. Wait for the project to be ready (2-3 minutes)

### 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://your-project.supabase.co`)
   - **Anon/Public Key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`)

### 3. Add Environment Variables

Add these to your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Create Database Tables (Optional)

If you want to sync data to Supabase, create these tables in the SQL Editor:

```sql
-- Users table
CREATE TABLE public.users (
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

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (adjust as needed)
CREATE POLICY "Allow all operations" ON public.users FOR ALL USING (true);

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
```

### 5. Test the Integration

1. Restart your development server: `npm run dev`
2. Look for the **Debug Panel** (purple database icon) in the bottom-right corner
3. Click it to open the debug panel
4. You should see:
   - ✅ Connected & Monitoring (if Supabase is configured)
   - Current database stats
   - Real-time activity feed

## Debug Panel Features

The debug panel provides:

### Database Stats
- Live count of users, tasks, and projects
- Auto-refreshing every time you open it

### Supabase Status
- Shows if Supabase is properly configured
- Indicates if real-time monitoring is active

### Live Activity Feed
- Real-time updates when team members are added/modified
- Timestamps for all database changes
- Last 10 activities shown

### Controls
- **Refresh** button to manually update all data
- **Close/Open** toggle for the panel

## Benefits for Debugging

1. **Real-time Visibility**: See exactly when data changes
2. **Team Collaboration**: Share your Supabase project for joint debugging
3. **Query Analysis**: Use Supabase's SQL editor to run custom queries
4. **Data Backup**: Your data is automatically backed up in Supabase
5. **Performance Monitoring**: Track database performance

## Using with Claude

When debugging with Claude, you can:

1. **Share Supabase credentials** temporarily for direct database access
2. **Export data** from Supabase for analysis
3. **Monitor real-time changes** during development
4. **Use SQL queries** to investigate issues

## Security Notes

- The anon key is safe to use in frontend code
- Enable Row Level Security for production
- Use environment variables for credentials
- Never commit credentials to git

## Troubleshooting

### Debug Panel shows "Not Configured"
- Check your `.env.local` file has the correct variables
- Restart your development server
- Verify the Supabase URL and key are correct

### No real-time updates
- Ensure you've enabled real-time on your tables
- Check your Supabase project's real-time settings
- Verify your internet connection

### Can't connect to Supabase
- Check if your Supabase project is paused (free tier limitation)
- Verify the project URL is correct
- Ensure your API key hasn't expired

## Next Steps

Once set up, you can:
- Use the debug panel for real-time monitoring
- Share database access for collaborative debugging
- Export/import data between environments
- Set up automated backups and sync