# EarlyBirdHub Architecture

## New Simplified Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      INTERNET / ANYWHERE                        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Netlify (CDN)                          │  │
│  │              https://your-site.netlify.app                │  │
│  │                                                            │  │
│  │  ┌──────────────────────────────────────────────────┐    │  │
│  │  │         EarlyBirdHub Nuxt App                    │    │  │
│  │  │                                                   │    │  │
│  │  │  Pages:                                           │    │  │
│  │  │  • / (home - YouTube broadcast)                   │    │  │
│  │  │  • /dailylinks (public announcements)            │    │  │
│  │  │  • /login (authentication)                        │    │  │
│  │  │  • /dailymanagement (staff dashboard)            │    │  │
│  │  │  • /admin (admin dashboard)                       │    │  │
│  │  │                                                   │    │  │
│  │  │  Middleware:                                      │    │  │
│  │  │  • admin.ts (protects admin routes)              │    │  │
│  │  │  • auth.ts (protects authenticated routes)       │    │  │
│  │  │  • guest.ts (redirects if already logged in)     │    │  │
│  │  └──────────────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              │ API Calls                        │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                  Cloud Services                          │  │
│  │                                                           │  │
│  │  ┌──────────────────┐         ┌──────────────────┐      │  │
│  │  │    Supabase      │         │   YouTube API    │      │  │
│  │  │   (Cloud BaaS)   │         │    (Google)      │      │  │
│  │  │                  │         │                  │      │  │
│  │  │ • PostgreSQL DB  │         │ • Playlist fetch │      │  │
│  │  │ • Authentication │         │ • Video data     │      │  │
│  │  │ • File Storage   │         └──────────────────┘      │  │
│  │  │ • RLS Policies   │                                   │  │
│  │  └──────────────────┘                                   │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

                     ▼ Users Access From Anywhere ▼

           ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
           │   Public     │  │    Staff     │  │    Admin     │
           │   Users      │  │   Users      │  │    Users     │
           │              │  │              │  │              │
           │ • View video │  │ • Create     │  │ • Approve    │
           │ • View links │  │ • Edit req   │  │ • Direct     │
           │              │  │ • Delete req │  │   CRUD       │
           └──────────────┘  └──────────────┘  └──────────────┘
```

## Data Flow

### 1. Public Viewing (No Authentication)

```
User Browser → Netlify CDN → Nuxt App
                              ├─→ YouTube API (get latest video)
                              └─→ Supabase (get approved announcements)
```

### 2. Staff Creating Announcement

```
Staff User → Login → /dailymanagement
                        ↓
                     Upload form with image
                        ↓
                     Supabase Storage (image)
                        ↓
                     Supabase DB (pending, approved=false)
                        ↓
                     Awaits admin approval
```

### 3. Admin Approval

```
Admin User → Login → /admin
                       ↓
                   View pending submissions
                       ↓
                   Approve/Reject
                       ↓
                   Supabase DB (update approved=true)
                       ↓
                   Automatically visible to public
```

## Authentication Flow

```
User visits /login
        ↓
    Enter credentials
        ↓
    Supabase Auth validates
        ↓
    ┌───────────────────────────┐
    │ Check email in auth.ts    │
    └───────────────────────────┘
        ↓
    ┌──────────┬─────────┬──────────┐
    │          │         │          │
  Admin    Staff    Regular    Guest
  Role      Role      User     (public)
    │          │         │          │
    ├─→ /admin │         │          │
               ├─→ /dailymanagement │
                         ├─→ /      │
                                    └─→ /dailylinks
```

## Key Improvements

### Before (3 Apps)

- ❌ Complex setup with 3 separate applications
- ❌ Self-hosted Supabase on school network
- ❌ Express server needed for builds
- ❌ applocal only worked on school network
- ❌ Manual deployment triggers
- ❌ Network-dependent admin access

### After (1 App)

- ✅ Single unified application
- ✅ Cloud-hosted Supabase (accessible anywhere)
- ✅ No build server needed
- ✅ Admin/staff access from anywhere
- ✅ Automatic deployments via Netlify
- ✅ Simpler maintenance

## Security

- 🔒 Row Level Security (RLS) on Supabase
- 🔒 Authentication via Supabase Auth
- 🔒 Middleware route protection
- 🔒 Role-based access control
- 🔒 Environment variables for secrets
- 🔒 HTTPS everywhere (Netlify SSL)

## Automatic Updates

The app automatically stays current:

- ✨ YouTube playlist updates → immediate display
- ✨ Approved announcements → immediate visibility
- ✨ No manual rebuilds required
- ✨ No deployment pipeline needed for content

## Scalability

This architecture scales effortlessly:

- 📈 Netlify CDN handles traffic spikes
- 📈 Supabase scales automatically
- 📈 YouTube API has high quotas
- 📈 Static generation for fast page loads
