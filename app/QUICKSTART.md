# Quick Start Guide

This is a streamlined setup guide to get your EarlyBirdHub up and running quickly.

## 1. Install Dependencies

```bash
cd app
npm install
```

## 2. Set Up Supabase (5 minutes)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Copy the SQL below and run it in the SQL Editor:

```sql
-- Create daily_links table
CREATE TABLE daily_links (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  old_id TEXT,
  action_type TEXT DEFAULT 'create',
  url TEXT,
  img TEXT,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE daily_links ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view approved" ON daily_links FOR SELECT USING (approved = true);
CREATE POLICY "Auth users can insert" ON daily_links FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update" ON daily_links FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete" ON daily_links FOR DELETE TO authenticated USING (true);

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('daily-links-images', 'daily-links-images', true);

-- Storage policies
CREATE POLICY "Anyone can view images" ON storage.objects FOR SELECT USING (bucket_id = 'daily-links-images');
CREATE POLICY "Auth can upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'daily-links-images');
CREATE POLICY "Auth can delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'daily-links-images');
```

4. Go to Project Settings > API and copy:

   - Project URL
   - `anon` `public` key

5. Go to Authentication > Users and create your admin/staff accounts

## 3. Get YouTube API Key (3 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable "YouTube Data API v3"
4. Create Credentials > API Key
5. Copy your API key
6. Find your YouTube playlist ID (from the playlist URL)

## 4. Create .env File

```bash
cd app
cp .env.example .env
```

Edit `.env`:

```env
NUXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-key
NUXT_PUBLIC_YOUTUBE_API_KEY=AIzaSy...your-key
NUXT_PUBLIC_YOUTUBE_PLAYLIST_ID=PLXdw...your-playlist-id
NUXT_API_SECRET=any-random-string-here
```

## 5. Update Admin Emails

Edit `app/stores/auth.ts` and change the email addresses to yours:

```typescript
const isAdmin = computed(
  () =>
    user.value?.email === "your-admin@email.com" ||
    user.value?.email === "another-admin@email.com"
);
```

## 6. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` - you should see your app!

## 7. Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Set environment variables
netlify env:set NUXT_PUBLIC_SUPABASE_URL "your-url"
netlify env:set NUXT_PUBLIC_SUPABASE_ANON_KEY "your-key"
netlify env:set NUXT_PUBLIC_YOUTUBE_API_KEY "your-key"
netlify env:set NUXT_PUBLIC_YOUTUBE_PLAYLIST_ID "your-playlist-id"
netlify env:set NUXT_API_SECRET "your-secret"

# Deploy
netlify deploy --prod
```

## That's It!

Your app should now be live and working. Check the full README.md for more detailed information.

## Common Issues

**Images not loading?**

- Make sure the storage bucket is set to public in Supabase

**YouTube video not showing?**

- Check your API key is enabled for YouTube Data API v3
- Make sure the playlist is public

**Can't login?**

- Create users in Supabase Authentication dashboard
- Make sure emails match those in `stores/auth.ts`
