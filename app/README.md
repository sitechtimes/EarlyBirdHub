# EarlyBirdHub - School Morning Broadcast & Announcements

A comprehensive web application for Staten Island Tech to manage daily morning broadcasts and school announcements. Built with Nuxt 3, Supabase, and Vue.js.

## Features

- 🎥 **Daily Morning Broadcasts**: Automatically displays the latest YouTube video from your school's playlist
- 📢 **Daily Announcements**: Staff can create and manage announcement cards with images and links
- 👥 **Role-Based Access**: Three user roles (Admin, Staff, Public)
  - **Admins**: Full control - approve/reject submissions, create/edit/delete announcements
  - **Staff**: Create announcements and submit edit/delete requests for admin approval
  - **Public**: View approved broadcasts and announcements
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🖼️ **Image Management**: Upload and manage images for announcements
- 🔐 **Authentication**: Secure login system with Supabase Auth

## Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works great)
- A YouTube Data API v3 key
- A YouTube playlist for your daily broadcasts

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd app
npm install
```

### 2. Configure Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to get your credentials
3. Set up the database schema:

Run this SQL in your Supabase SQL Editor:

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

-- Enable Row Level Security
ALTER TABLE daily_links ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view approved links
CREATE POLICY "Anyone can view approved links"
  ON daily_links FOR SELECT
  USING (approved = true);

-- Policy: Authenticated users can insert
CREATE POLICY "Authenticated users can insert"
  ON daily_links FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update their own
CREATE POLICY "Authenticated users can update"
  ON daily_links FOR UPDATE
  TO authenticated
  USING (true);

-- Policy: Authenticated users can delete
CREATE POLICY "Authenticated users can delete"
  ON daily_links FOR DELETE
  TO authenticated
  USING (true);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('daily-links-images', 'daily-links-images', true);

-- Policy: Anyone can view images
CREATE POLICY "Anyone can view images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'daily-links-images');

-- Policy: Authenticated users can upload
CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'daily-links-images');

-- Policy: Authenticated users can delete
CREATE POLICY "Authenticated users can delete images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'daily-links-images');
```

4. Create user accounts in Supabase Authentication
   - Go to Authentication > Users
   - Add admin users (must use emails specified in `stores/auth.ts`)
   - Default admin emails: `mvanburen@schools.nyc.gov`, `admin@siths.com`
   - Default staff emails: `earlybird@siths.com`, `staff@siths.com`

### 3. Get YouTube API Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Restrict the key to YouTube Data API v3 (recommended)
6. Get your playlist ID from your YouTube playlist URL

### 4. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and fill in your credentials:

```env
# Supabase
NUXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# YouTube
NUXT_PUBLIC_YOUTUBE_API_KEY=your-youtube-api-key
NUXT_PUBLIC_YOUTUBE_PLAYLIST_ID=your-playlist-id

# API Secret (generate a random string)
NUXT_API_SECRET=your-random-secret
```

### 5. Customize Admin/Staff Emails

Edit `stores/auth.ts` to add your school's admin and staff email addresses:

```typescript
const isAdmin = computed(
  () =>
    user.value?.email === "your-admin@school.com" ||
    user.value?.email === "another-admin@school.com"
);

const isStaff = computed(
  () =>
    user.value?.email === "staff1@school.com" ||
    user.value?.email === "staff2@school.com"
);
```

## Development

Start the development server:

```bash
npm run dev
```

Visit `http://localhost:3000`

## Production Build

Build the application for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Deployment to Netlify

### Method 1: Netlify CLI (Recommended)

1. Install Netlify CLI:

```bash
npm install -g netlify-cli
```

2. Login to Netlify:

```bash
netlify login
```

3. Initialize the site:

```bash
netlify init
```

4. Set environment variables in Netlify:

```bash
netlify env:set NUXT_PUBLIC_SUPABASE_URL "https://your-project.supabase.co"
netlify env:set NUXT_PUBLIC_SUPABASE_ANON_KEY "your-anon-key"
netlify env:set NUXT_PUBLIC_YOUTUBE_API_KEY "your-api-key"
netlify env:set NUXT_PUBLIC_YOUTUBE_PLAYLIST_ID "your-playlist-id"
netlify env:set NUXT_API_SECRET "your-secret"
```

5. Deploy:

```bash
netlify deploy --prod
```

### Method 2: Netlify Dashboard

1. Connect your repository to Netlify
2. Set build command: `npm run generate`
3. Set publish directory: `.output/public`
4. Add environment variables in Site Settings > Environment Variables
5. Deploy!

## Application Structure

```
app/
├── assets/           # CSS and global styles
├── components/       # Vue components
│   ├── CardTemplate.vue    # Announcement card display
│   ├── DailyForm.vue       # Form for creating announcements
│   ├── Edit.vue            # Edit modal
│   ├── Input.vue           # Form input component
│   ├── NavBar.vue          # Navigation bar
│   └── Seagull.vue         # Animated decoration
├── composables/      # Reusable composition functions
│   ├── useDailyLinks.ts    # Main data fetching/CRUD logic
│   └── useWindowSize.ts    # Responsive utilities
├── middleware/       # Route protection
│   ├── admin.ts            # Admin-only routes
│   ├── auth.ts             # Authenticated routes
│   └── guest.ts            # Guest-only routes
├── pages/            # Application routes
│   ├── index.vue           # Home (daily broadcast)
│   ├── dailylinks.vue      # Public announcements
│   ├── dailymanagement.vue # Staff dashboard
│   ├── admin.vue           # Admin dashboard
│   └── login.vue           # Login page
├── plugins/          # Nuxt plugins
│   └── supabase.client.ts  # Supabase initialization
├── server/           # Server API routes
│   └── api/
│       ├── dailylinks.ts   # Fetch announcements
│       └── playlist.ts     # Fetch YouTube playlist
├── stores/           # Pinia state management
│   ├── auth.ts             # Authentication state
│   └── navbarStore.ts      # UI state
└── utils/            # Utility functions
    ├── dateUtils.ts        # Date formatting
    ├── imageTransform.ts   # Image URL handling
    └── interfaces.ts       # TypeScript interfaces
```

## User Roles & Permissions

### Public Users

- View daily broadcast video
- View approved announcements
- No login required

### Staff Users

- Everything public users can do
- Create new announcements (requires approval)
- Submit edit requests for existing announcements
- Submit delete requests for announcements
- Access: `/dailymanagement`

### Admin Users

- Everything staff users can do
- Approve/reject pending submissions
- Direct edit/delete without approval
- Create announcements that are immediately approved
- Access: `/admin`

## Daily Workflow

### For Staff:

1. Login at `/login`
2. Go to `/dailymanagement`
3. Create announcements using the form
4. View pending submissions
5. Edit/delete existing announcements (requires admin approval)

### For Admins:

1. Login at `/login`
2. Go to `/admin`
3. Review pending submissions in "Pending" tab
4. Approve or reject submissions
5. Manage all approved announcements in "Approved" tab
6. Create new announcements directly in "Create" tab

## Troubleshooting

### Images not showing

- Check that your Supabase storage bucket is public
- Verify storage policies are correctly set
- Check browser console for CORS errors

### YouTube videos not loading

- Verify your YouTube API key is valid
- Check that the API key has YouTube Data API v3 enabled
- Verify the playlist ID is correct and the playlist is public

### Authentication issues

- Ensure users are created in Supabase Authentication
- Check that email addresses match those in `stores/auth.ts`
- Verify environment variables are set correctly

### Build errors

- Clear `.nuxt` and `.output` folders: `rm -rf .nuxt .output`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check that all environment variables are set

## Technologies Used

- **Nuxt 3**: Vue.js framework with SSR/SSG
- **Vue 3**: Progressive JavaScript framework
- **Supabase**: Backend as a Service (database, auth, storage)
- **Tailwind CSS**: Utility-first CSS framework
- **DaisyUI**: Tailwind CSS component library
- **Pinia**: State management
- **YouTube Data API v3**: Video playlist integration
- **Netlify**: Hosting and deployment

## License

This project is for educational use at Staten Island Tech.

## Support

For issues or questions, contact your school's IT department.
