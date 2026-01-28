# ✅ Setup & Testing Guide

## Quick Setup (5 minutes)

### Step 1: Navigate to the app folder

```bash
cd /Users/benjaminbernadskiy/Documents/GitHub/EarlyBirdHub/app
```

### Step 2: Install dependencies (if not done already)

```bash
npm install
```

### Step 3: Verify .env file

Your `.env` file has been created with your existing credentials. Check it:

```bash
cat .env
```

Should show:

- ✅ NUXT_PUBLIC_SUPABASE_URL
- ✅ NUXT_PUBLIC_SUPABASE_ANON_KEY
- ✅ NUXT_PUBLIC_YOUTUBE_API_KEY
- ✅ NUXT_PUBLIC_YOUTUBE_PLAYLIST_ID

### Step 4: Start development server

```bash
npm run dev
```

You should see:

```
Nuxt 3.x.x with Nitro x.x.x
Local:    http://localhost:3000/
```

## Testing Checklist

### ✅ Test 1: Home Page (Public)

1. Open: http://localhost:3000
2. Should see:
   - "Today's Early Bird" header
   - YouTube video player
   - No errors in browser console (F12)

**If it fails:**

- Check YouTube API key is valid
- Check playlist ID is correct
- Check browser console for errors

---

### ✅ Test 2: Daily Announcements (Public)

1. Open: http://localhost:3000/dailylinks
2. Should see:
   - "Daily Announcements" header
   - Approved announcement cards (if any exist)
   - No login required

**If it fails:**

- Check Supabase connection (URL and key)
- Check `daily_links` table exists in Supabase
- Verify RLS policies allow public SELECT on approved=true

---

### ✅ Test 3: Login Page

1. Open: http://localhost:3000/login
2. Should see:
   - Email and password fields
   - Login button
   - No errors

**If it fails:**

- Check Supabase auth is enabled
- Check browser console for errors

---

### ✅ Test 4: Staff Login & Dashboard

1. Go to: http://localhost:3000/login
2. Login with a staff account (created in Supabase Auth)
3. Navigate to: http://localhost:3000/dailymanagement
4. Should see:
   - Two tabs: "Manage Daily Links" and "Pending Links"
   - Form to create announcements
   - Your existing announcements

**If it fails:**

- Verify user exists in Supabase Authentication
- Check if email matches staff email in `stores/auth.ts`
- Check browser console for auth errors

---

### ✅ Test 5: Admin Login & Dashboard

1. Go to: http://localhost:3000/login
2. Login with admin account
3. Navigate to: http://localhost:3000/admin
4. Should see:
   - Three tabs: "Pending", "Approved", "Create"
   - Full CRUD controls
   - Approve/Reject buttons

**If it fails:**

- Verify email matches admin email in `stores/auth.ts`
- Default admin emails:
  - mvanburen@schools.nyc.gov
  - admin@siths.com
- Update these in `stores/auth.ts` to match your accounts

---

### ✅ Test 6: Create Announcement

As staff or admin:

1. Go to respective dashboard
2. Fill in form:
   - Title
   - URL
   - Description
   - Upload image (optional)
3. Submit
4. Should see success message

**If it fails:**

- Check Supabase storage bucket exists: `daily-links-images`
- Verify bucket is public
- Check storage policies allow authenticated users to upload
- Check browser console for errors

---

### ✅ Test 7: Approve/Reject (Admin only)

As admin:

1. Go to: http://localhost:3000/admin
2. Click "Pending" tab
3. Should see pending submissions
4. Click Approve or Reject
5. Should see success message

**If it fails:**

- Check database policies allow UPDATE
- Verify admin is properly authenticated
- Check browser console

---

## Common Issues & Solutions

### Issue: "Supabase client not available"

**Solution:**

- Check your Supabase URL and key in `.env`
- If using local Supabase (192.168.x.x), make sure it's running
- If migrating to cloud, update URL to https://yourproject.supabase.co

### Issue: YouTube video not loading

**Solution:**

- Verify YouTube API key: https://console.cloud.google.com/apis/credentials
- Check API is enabled: YouTube Data API v3
- Verify playlist ID is correct (from YouTube URL)
- Check API quotas haven't been exceeded

### Issue: Can't login

**Solution:**

- Create user in Supabase > Authentication > Users
- Check email/password is correct
- Verify Supabase Auth is enabled in your project

### Issue: Not redirected to admin/staff dashboard

**Solution:**

- Edit `app/stores/auth.ts` lines 6-16
- Add your email to `isAdmin` or `isStaff` computed properties

### Issue: Images not uploading

**Solution:**

- Go to Supabase > Storage
- Verify bucket `daily-links-images` exists
- Set bucket to public
- Check storage policies (see README.md for SQL)

### Issue: Build errors

**Solution:**

```bash
# Clear cache and rebuild
cd app
rm -rf .nuxt .output node_modules
npm install
npm run dev
```

## Can I Delete applocal and express-app?

### ⚠️ Before Deleting - Verify These Work:

- [ ] Home page loads at http://localhost:3000
- [ ] Can login at http://localhost:3000/login
- [ ] Admin dashboard works at http://localhost:3000/admin
- [ ] Staff dashboard works at http://localhost:3000/dailymanagement
- [ ] Can create announcements
- [ ] Images upload successfully
- [ ] Can approve/reject as admin

### ✅ Once All Tests Pass:

**YES, you can safely delete them!**

```bash
cd /Users/benjaminbernadskiy/Documents/GitHub/EarlyBirdHub

# Backup first (optional)
tar -czf backup-old-apps.tar.gz applocal express-app

# Delete
rm -rf applocal
rm -rf express-app
```

The `app` folder now has everything you need:

- ✅ All middleware (admin, auth, guest)
- ✅ Full admin dashboard functionality
- ✅ Full staff dashboard functionality
- ✅ All components and composables
- ✅ Complete authentication system
- ✅ No dependencies on express-app or applocal

## Migration to Cloud Supabase

When you're ready to move from local (192.168.1.185:8000) to cloud Supabase:

1. Create project at https://supabase.com
2. Run the SQL from README.md to create tables
3. Update `.env`:
   ```bash
   NUXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
   NUXT_PUBLIC_SUPABASE_ANON_KEY=your-new-anon-key
   ```
4. Restart dev server
5. Deploy to Netlify!

## Deployment to Production

Once local testing works:

```bash
# Build for production
npm run generate

# Test production build locally
npm run preview

# Deploy to Netlify (see QUICKSTART.md for details)
netlify deploy --prod
```

## Getting Help

If something doesn't work:

1. Check browser console (F12)
2. Check terminal for build errors
3. Refer to README.md troubleshooting section
4. Check Supabase logs in dashboard
5. Verify all environment variables are set correctly

## Success Indicators

You'll know it's working when:

- ✅ No errors in browser console
- ✅ YouTube video appears on home page
- ✅ Can login with test account
- ✅ Announcements display correctly
- ✅ Images upload and display
- ✅ Role-based access works (admin/staff/public)

Good luck! 🚀
