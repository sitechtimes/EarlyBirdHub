# Deployment Checklist ✅

Use this checklist to ensure everything is configured correctly before deploying.

## Pre-Deployment Setup

### ☐ Supabase Configuration

- [ ] Created Supabase account at supabase.com
- [ ] Created new project
- [ ] Ran database schema SQL (from README.md)
- [ ] Verified `daily_links` table exists
- [ ] Verified `daily-links-images` storage bucket exists and is public
- [ ] Copied Project URL
- [ ] Copied Anon/Public API key

### ☐ Supabase Authentication

- [ ] Created admin user account(s)
- [ ] Created staff user account(s) (optional)
- [ ] Email addresses match those in `stores/auth.ts`

### ☐ YouTube API

- [ ] Created Google Cloud project
- [ ] Enabled YouTube Data API v3
- [ ] Created API key
- [ ] Restricted API key to YouTube Data API v3 (recommended)
- [ ] Found YouTube playlist ID
- [ ] Verified playlist is public

### ☐ Local Configuration

- [ ] Copied `.env.example` to `.env`
- [ ] Filled in all environment variables in `.env`
- [ ] Updated admin emails in `stores/auth.ts`
- [ ] Updated staff emails in `stores/auth.ts` (if needed)

### ☐ Local Testing

- [ ] Ran `npm install` successfully
- [ ] Ran `npm run dev` successfully
- [ ] Tested home page loads (/)
- [ ] Tested YouTube video displays correctly
- [ ] Tested daily announcements page (/dailylinks)
- [ ] Tested login functionality (/login)
- [ ] Tested staff dashboard (/dailymanagement) - after login
- [ ] Tested admin dashboard (/admin) - admin login required
- [ ] Tested creating announcement
- [ ] Tested approving announcement (admin)
- [ ] Tested images upload correctly

## Netlify Deployment

### ☐ Netlify Account Setup

- [ ] Created Netlify account at netlify.com
- [ ] Installed Netlify CLI: `npm install -g netlify-cli`
- [ ] Logged in: `netlify login`

### ☐ Netlify Configuration

- [ ] Ran `netlify init` in the `app` folder
- [ ] Selected correct team/account
- [ ] Chose site name or used auto-generated one

### ☐ Environment Variables in Netlify

Set all environment variables in Netlify (via CLI or dashboard):

```bash
netlify env:set NUXT_PUBLIC_SUPABASE_URL "https://your-project.supabase.co"
netlify env:set NUXT_PUBLIC_SUPABASE_ANON_KEY "your-anon-key-here"
netlify env:set NUXT_PUBLIC_YOUTUBE_API_KEY "your-youtube-api-key"
netlify env:set NUXT_PUBLIC_YOUTUBE_PLAYLIST_ID "PLXdwySAEBRBWocKBDaEE7HCw3rb3EvpeU"
netlify env:set NUXT_API_SECRET "F3cYgEH5WKlbFmGpxfQ9TOAh5OXoEof2"
```

Checklist:

- [ ] `NUXT_PUBLIC_SUPABASE_URL` set
- [ ] `NUXT_PUBLIC_SUPABASE_ANON_KEY` set
- [ ] `NUXT_PUBLIC_YOUTUBE_API_KEY` set
- [ ] `NUXT_PUBLIC_YOUTUBE_PLAYLIST_ID` set
- [ ] `NUXT_API_SECRET` set

### ☐ Deploy

- [ ] Ran `npm run build` locally to test build (optional)
- [ ] Ran `netlify deploy --prod`
- [ ] Deployment completed successfully
- [ ] Received deployment URL

## Post-Deployment Testing

### ☐ Production Site Testing

Visit your Netlify URL and test:

- [ ] Home page loads (/)
- [ ] YouTube video displays
- [ ] Daily announcements page loads (/dailylinks)
- [ ] Login page loads (/login)
- [ ] Can login with admin account
- [ ] Admin dashboard loads and works (/admin)
- [ ] Can create announcement as admin
- [ ] Can approve/reject pending announcements
- [ ] Images upload and display correctly
- [ ] Can login with staff account
- [ ] Staff dashboard works (/dailymanagement)
- [ ] Staff can create announcements
- [ ] Staff submissions show as "pending"
- [ ] Public can view approved announcements (without login)
- [ ] Logout works correctly

### ☐ Cross-Browser Testing

Test on multiple browsers:

- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (if on Mac)
- [ ] Mobile browser

### ☐ Mobile Testing

- [ ] Test on actual mobile device
- [ ] Responsive design works
- [ ] Touch interactions work
- [ ] Images load correctly

## Final Steps

### ☐ Domain Setup (Optional)

- [ ] Configured custom domain in Netlify
- [ ] DNS records updated
- [ ] SSL certificate active
- [ ] Site accessible via custom domain

### ☐ Documentation

- [ ] Shared login credentials with authorized staff
- [ ] Documented process for adding new users
- [ ] Saved all environment variables securely
- [ ] Noted Netlify site URL

### ☐ Monitoring

- [ ] Set up Netlify notifications for build failures
- [ ] Bookmarked Netlify dashboard
- [ ] Checked Supabase usage/quotas

## Troubleshooting

If something doesn't work:

1. **Check Netlify deploy logs** for build errors
2. **Check browser console** for JavaScript errors
3. **Verify environment variables** are set correctly in Netlify
4. **Check Supabase logs** for API/auth errors
5. **Verify Supabase RLS policies** are set correctly
6. **Check YouTube API quotas** haven't been exceeded

## Success! 🎉

Once all items are checked, your EarlyBirdHub is live and ready to use!

Share the URL with your school community and start broadcasting!
