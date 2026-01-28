# Deploying EarlyBirdHub to Netlify

This guide will walk you through deploying your EarlyBirdHub app to Netlify using the CLI.

## Prerequisites

- ✅ Your app is working locally (`npm run dev`)
- ✅ You have a Netlify account (free tier works)
- ✅ Your environment variables are set in `.env`

## Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

## Step 2: Login to Netlify

```bash
netlify login
```

This will open your browser to authenticate with Netlify.

## Step 3: Test Production Build Locally (Optional but Recommended)

Before deploying, test how your app will work in production:

```bash
# Build the production version
npm run generate

# Preview it locally
npm run preview
```

Visit the preview URL (usually http://localhost:3000) and test:

- Home page loads
- YouTube video displays
- Login works
- Admin/staff dashboards work
- Announcements display correctly

Press `Ctrl+C` to stop the preview when done.

## Step 4: Initialize Netlify Site

Navigate to your app directory and initialize:

```bash
cd /Users/benjaminbernadskiy/Documents/GitHub/EarlyBirdHub/app
netlify init
```

Follow the prompts:

1. **Create & configure a new site** (choose this option)
2. Select your **team** (usually your personal team)
3. **Site name**: Choose a name (like `earlybirdhub` or leave blank for auto-generated)
4. Build settings should auto-detect, but confirm:
   - **Build command**: `npm run generate`
   - **Publish directory**: `.output/public`

## Step 5: Set Environment Variables

Copy your environment variables from `.env` to Netlify:

```bash
# Supabase Configuration
netlify env:set NUXT_PUBLIC_SUPABASE_URL "https://felmjkeqekmhkxsrrrwb.supabase.co"

netlify env:set NUXT_PUBLIC_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlbG1qa2VxZWttaGt4c3JycndiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NzE4NTksImV4cCI6MjA4NDE0Nzg1OX0.cbspqjrqcdDkREd3tOlS2TcjknjIzUUeIcX_t8eNYfE"

# YouTube Configuration
netlify env:set NUXT_PUBLIC_YOUTUBE_API_KEY "AIzaSyAVQKyYxMrhgHWR8f9LJms0GVpcufhMLwc"

netlify env:set NUXT_PUBLIC_YOUTUBE_PLAYLIST_ID "PLXdwySAEBRBWocKBDaEE7HCw3rb3EvpeU"

# API Secret
netlify env:set NUXT_API_SECRET "F3cYgEH5WKlbFmGpxfQ9TOAh5OXoEof2"
```

**Important:** Replace the values above with your actual credentials from `.env`

## Step 6: Deploy!

Deploy your site to production:

```bash
netlify deploy --prod
```

This will:

1. Build your site (`npm run generate`)
2. Upload to Netlify
3. Give you a live URL

You'll see output like:

```
✔ Deployed to production site URL: https://your-site-name.netlify.app
```

## Step 7: Verify Deployment

1. Visit your Netlify URL
2. Test all functionality:
   - Home page with YouTube video
   - Daily announcements
   - Login
   - Admin dashboard (after login)
   - Staff dashboard (after login)
   - Creating/editing announcements

## Troubleshooting

### Build Failed

Check the build logs:

```bash
netlify logs
```

Common issues:

- Missing environment variables
- Node version mismatch
- Dependencies not installing

### Environment Variables Not Working

Verify they're set:

```bash
netlify env:list
```

To update a variable:

```bash
netlify env:set VARIABLE_NAME "new-value"
```

### Site Not Updating

Clear cache and redeploy:

```bash
netlify build --clear-cache
netlify deploy --prod
```

## Updating Your Site

After making changes to your code:

```bash
# 1. Test locally first
npm run dev

# 2. Test production build
npm run generate
npm run preview

# 3. Deploy
netlify deploy --prod
```

## Alternative: Connect to GitHub

For automatic deployments on every push:

1. Push your code to GitHub
2. Go to https://app.netlify.com
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select your repository
5. Set build settings:
   - **Base directory**: `app`
   - **Build command**: `npm run generate`
   - **Publish directory**: `app/.output/public`
6. Add environment variables in Site Settings
7. Every push to `main` branch will auto-deploy!

## Managing Your Site

### View Site Status

```bash
netlify status
```

### Open Site in Browser

```bash
netlify open:site
```

### Open Netlify Dashboard

```bash
netlify open
```

### View Recent Deploys

```bash
netlify deploy:list
```

## Custom Domain (Optional)

To add a custom domain:

1. Open Netlify dashboard:
   ```bash
   netlify open
   ```
2. Go to "Domain settings"
3. Click "Add custom domain"
4. Follow instructions to update DNS records

## Production Checklist

Before going live, verify:

- [ ] All environment variables are set in Netlify
- [ ] Supabase database has correct data and RLS policies
- [ ] YouTube API key has sufficient quota
- [ ] Admin emails are correctly set in `stores/auth.ts`
- [ ] Test login with admin and staff accounts
- [ ] All images load correctly
- [ ] Site works on mobile devices
- [ ] SSL certificate is active (automatic with Netlify)

## Need Help?

- **Netlify Documentation**: https://docs.netlify.com
- **Netlify Status**: https://www.netlifystatus.com
- **Check build logs**: `netlify logs`
- **Contact support**: Through Netlify dashboard

## Summary of Commands

```bash
# Setup
npm install -g netlify-cli
netlify login
netlify init

# Set environment variables (do this once)
netlify env:set VARIABLE_NAME "value"

# Deploy
netlify deploy --prod

# Useful commands
netlify status        # Check site status
netlify open:site     # Open your live site
netlify open          # Open dashboard
netlify logs          # View build logs
```

---

**You're all set!** Your EarlyBirdHub is now live on the internet! 🚀
