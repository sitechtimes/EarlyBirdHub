#!/bin/bash

echo "🧪 Testing EarlyBirdHub Setup..."
echo ""

# Test 1: Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in the app directory. Run: cd app"
    exit 1
fi
echo "✅ In app directory"

# Test 2: Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file missing"
    echo "   Run: cp .env.example .env"
    exit 1
fi
echo "✅ .env file exists"

# Test 3: Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules not found"
    echo "   Installing dependencies..."
    npm install
else
    echo "✅ Dependencies installed"
fi

# Test 4: Check environment variables
echo ""
echo "📋 Environment Variables:"
echo "   Supabase URL: ${NUXT_PUBLIC_SUPABASE_URL:-❌ NOT SET}"
echo "   Supabase Key: ${NUXT_PUBLIC_SUPABASE_ANON_KEY:0:20}...${NUXT_PUBLIC_SUPABASE_ANON_KEY:(-10)}"
echo "   YouTube Key: ${NUXT_PUBLIC_YOUTUBE_API_KEY:0:15}...${NUXT_PUBLIC_YOUTUBE_API_KEY:(-5)}"
echo "   Playlist ID: ${NUXT_PUBLIC_YOUTUBE_PLAYLIST_ID:-❌ NOT SET}"

echo ""
echo "🎯 Next Steps:"
echo "1. Start dev server: npm run dev"
echo "2. Visit: http://localhost:3000"
echo "3. Test login at: http://localhost:3000/login"
echo "4. Test admin at: http://localhost:3000/admin (after login)"
echo ""
echo "📚 For deployment: See QUICKSTART.md"
