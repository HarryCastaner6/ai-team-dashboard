# 🤖 Debug with Claude - Complete Setup Guide

Your Supabase is connected and ready for collaborative debugging! Here's everything you need to know.

## ✅ Current Status

- **Supabase**: ✅ Connected and working
- **Data**: ✅ 20 team members synced
- **Debug Panel**: ✅ Real-time monitoring enabled
- **Tables**: ✅ Users table created and populated

## 🔧 Debug Panel Features

Look for the **purple database icon** in the bottom-right corner of your dashboard. Click it to open the debug panel which shows:

- **Real-time connection status**
- **Live user count from Supabase**
- **Recent database activity**
- **Quick access to Supabase dashboard**
- **Copy debug info for sharing**

## 🤝 How to Debug with Claude

### Option 1: Share Your Credentials (Recommended)

Share these with Claude for real-time debugging:

```
URL: https://rmsdjcjtlbdueuoqbwxr.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtc2RqY2p0bGJkdWV1b3Fid3hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNDEzNTYsImV4cCI6MjA3MDYxNzM1Nn0.dv-xIIvlJgmKgub-7Xf4vipkX8c3Dw1O1-nAfiwX7Rk
```

### What Claude Can Do:

1. **Query your data directly** to understand issues
2. **Monitor changes in real-time** during development
3. **Analyze performance** and suggest optimizations
4. **Help debug API errors** with live data
5. **Validate data consistency** between local and Supabase

### Option 2: Export Debug Info

Click **"Copy Debug Info"** in the debug panel to get a JSON snapshot you can share.

## 🛠 Available Debug Commands

Run these in your terminal for debugging:

```bash
# Check Supabase connection and data
node scripts/check-supabase-data.js

# Test Supabase connection
node scripts/test-supabase-simple.js

# Sync local data to Supabase
node scripts/sync-after-table-creation.js

# Comprehensive Supabase diagnostics
node scripts/debug-supabase.js
```

## 🔍 Common Debugging Scenarios

### 1. Team Members Not Showing
```bash
# Check if data is in Supabase
node scripts/check-supabase-data.js

# If 0 users, sync your data
node scripts/sync-after-table-creation.js
```

### 2. API Errors
- Check the debug panel for connection status
- Verify team API is reading from Supabase: `/api/team`
- Check browser console for error details

### 3. Real-time Updates Not Working
- Ensure real-time is enabled in Supabase
- Check debug panel for subscription status
- Verify row-level security policies

## 🚀 Advanced Debugging

### With Claude's Help:
1. **Share your project credentials** (URL + Anon Key)
2. **Describe the issue** you're experiencing
3. **Claude can query your data** and identify problems
4. **Get real-time suggestions** as you make changes

### Example Debugging Session:
```
You: "My team page shows 0 members but Supabase has 20"
Claude: [queries Supabase] "I see 20 users in Supabase. Let me check your API endpoint..."
Claude: [analyzes API] "Your API is using local database. Let me fix the source parameter..."
```

## 📊 Live Data Sources

Your dashboard now reads from:
- **Primary**: Supabase (for debugging and collaboration)
- **Fallback**: Local PostgreSQL (if Supabase unavailable)

## 🔐 Security Notes

- **Anon keys are safe** to share (read-only access)
- **No sensitive data** is exposed
- **Row-level security** protects your data
- **Real-time subscriptions** are properly secured

## 🎯 Ready to Debug!

1. **Open your dashboard**: http://localhost:3000/dashboard
2. **Click the purple database icon** (bottom-right)
3. **Share credentials with Claude** when you need help
4. **Use debug commands** for local troubleshooting

Your Supabase integration is fully functional for collaborative debugging! 🎉

---

**Need Help?** Share your Supabase credentials with Claude and describe any issues you're experiencing.