#!/bin/bash

echo "🚀 Supabase Environment Setup Helper"
echo "===================================="
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found!"
    echo "Please make sure you're in the project root directory."
    exit 1
fi

echo "This script will help you add Supabase credentials to .env.local"
echo ""

# Get current values
current_url=$(grep "NEXT_PUBLIC_SUPABASE_URL" .env.local | cut -d'=' -f2)
current_key=$(grep "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local | cut -d'=' -f2)

echo "Current configuration:"
echo "  URL: $current_url"
echo "  Key: ${current_key:0:20}..."
echo ""

# Check if already configured
if [[ "$current_url" != *"your-project-id"* ]] && [[ "$current_key" != *"your-key-here"* ]]; then
    echo "✅ Supabase appears to be already configured!"
    echo ""
    read -p "Do you want to update the configuration? (y/N): " update_config
    if [[ $update_config != [Yy]* ]]; then
        echo "Configuration unchanged."
        exit 0
    fi
fi

echo "📝 Enter your Supabase credentials:"
echo "   (Get these from: https://supabase.com → Your Project → Settings → API)"
echo ""

# Get Project URL
read -p "🔗 Project URL (https://your-project.supabase.co): " supabase_url
if [ -z "$supabase_url" ]; then
    echo "❌ Project URL is required!"
    exit 1
fi

# Get Anon Key
read -p "🔑 Anon/Public Key (starts with eyJhbGciOiJIUzI1NiIs...): " anon_key
if [ -z "$anon_key" ]; then
    echo "❌ Anon key is required!"
    exit 1
fi

# Get Service Role Key (optional)
read -p "🔐 Service Role Key (optional, for advanced features): " service_key

echo ""
echo "🔄 Updating .env.local..."

# Create backup
cp .env.local .env.local.backup
echo "📋 Created backup: .env.local.backup"

# Update the file
if [ -n "$service_key" ]; then
    # Update all three values
    sed -i '' "s|NEXT_PUBLIC_SUPABASE_URL=.*|NEXT_PUBLIC_SUPABASE_URL=$supabase_url|" .env.local
    sed -i '' "s|NEXT_PUBLIC_SUPABASE_ANON_KEY=.*|NEXT_PUBLIC_SUPABASE_ANON_KEY=$anon_key|" .env.local
    sed -i '' "s|SUPABASE_SERVICE_ROLE_KEY=.*|SUPABASE_SERVICE_ROLE_KEY=$service_key|" .env.local
else
    # Update URL and anon key only
    sed -i '' "s|NEXT_PUBLIC_SUPABASE_URL=.*|NEXT_PUBLIC_SUPABASE_URL=$supabase_url|" .env.local
    sed -i '' "s|NEXT_PUBLIC_SUPABASE_ANON_KEY=.*|NEXT_PUBLIC_SUPABASE_ANON_KEY=$anon_key|" .env.local
fi

echo "✅ .env.local updated successfully!"
echo ""

echo "🎯 Next steps:"
echo "1. Restart your development server: npm run dev"
echo "2. Go to Settings → Supabase in your dashboard"
echo "3. Create the database tables using the SQL provided"
echo "4. Test the connection"
echo "5. Run: node scripts/quick-sync.js"
echo ""

echo "🤝 Ready for Claude collaboration!"
echo "You can now share your Supabase project for real-time debugging."