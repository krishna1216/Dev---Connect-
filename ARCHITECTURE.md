# 🏗️ DevConnect Architecture

## Deployed Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Users / Internet                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓ ↑
              ┌───────────────────────────────┐
              │       Vercel (Frontend)       │
              │                               │
              │  - React/Vite SPA             │
              │  - Hosted globally via CDN    │
              │  - Free 100GB bandwidth       │
              │  - Auto-deploy from GitHub    │
              └───────────────────────────────┘
                              ↓ ↑
                         HTTPS API Calls
                              ↓ ↑
              ┌───────────────────────────────┐
              │   Render (Backend API)        │
              │                               │
              │  - FastAPI (Python)           │
              │  - Shared CPU, 0.5GB RAM      │
              │  - auto-deploy from GitHub    │
              │  - REST API endpoints         │
              └───────────────────────────────┘
                              ↓ ↑
                    SQL Queries & Results
                              ↓ ↑
              ┌───────────────────────────────┐
              │  Render PostgreSQL Database   │
              │                               │
              │  - 256MB storage (free)       │
              │  - Tables: users, posts, etc  │
              │  - Auto-backups               │
              └───────────────────────────────┘

              ┌───────────────────────────────┐
              │  Cloudinary (File Storage)    │
              │                               │
              │  - 25GB storage (free)        │
              │  - 25GB bandwidth (free)      │
              │  - Profile pics, post images  │
              │  - Auto-optimization          │
              └───────────────────────────────┘
```

---

## Data Flow Example: Creating a Post with Image

```
1. User uploads image + text in browser
   ↓
2. Frontend compresses image
   ↓
3. POST request to backend: /posts with FormData
   - Backend URL: https://devconnect-backend.onrender.com
   ↓
4. Backend receives request
   - Validates user is authenticated (JWT token)
   - Saves post metadata to PostgreSQL
   - Uploads image to Cloudinary
   ↓
5. Backend returns response
   - Post ID
   - Image URL (from Cloudinary)
   ↓
6. Frontend updates feed with new post
   - Displays image from Cloudinary URL
   ↓
7. Other users see post when they refresh feed
```

---

## Environment Variables

### Backend (.env)
```env
# Database connection
DATABASE_URL=postgresql://user:pass@hostname:5432/devconnect

# API Configuration
FRONTEND_URL=https://devconnect.vercel.app
SECRET_KEY=random-string-here
ENVIRONMENT=production

# File Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

### Frontend (.env.local)
```env
VITE_API_URL=https://devconnect-backend.onrender.com
```

---

## Key Technologies

| Component | Technology | Why? |
|-----------|-----------|------|
| Backend | FastAPI | Fast, modern, built-in validation |
| Database | PostgreSQL | Reliable, free tier available |
| Frontend | React + Vite | Fast build, best UX framework |
| File Storage | Cloudinary | Free tier, auto-optimization |
| Deployment | Render + Vercel | Free tiers, GitHub auto-deploy |

---

## Deployment Flow

### Automatic Deployment (Every Git Push)

```
1. Developer pushes to main branch
   ↓
2. GitHub webhook triggers Render & Vercel
   ↓
3. Render:
   - Pulls latest code
   - Installs dependencies (pip install)
   - Runs start command (uvicorn)
   - New backend live in 2-3 minutes
   ↓
4. Vercel:
   - Pulls latest code
   - Builds React app (npm run build)
   - Deploys to CDN globally
   - New frontend live in 1-2 minutes
   ↓
5. Users see updated app (no manual deployment needed)
```

---

## Scaling Path

### Current (Free)
- Backend: 1 instance, 0.5GB RAM
- Database: 256MB
- Can handle: ~500 concurrent users

### Phase 1 (Small startup - $7/month)
- Backend: Render Pro, 2GB RAM
- Database: Same 256MB (often sufficient)
- Can handle: ~5,000 concurrent users

### Phase 2 (Growing - $50-100/month)
- Backend: Multiple instances (load balancing)
- Database: 1GB+ RDS
- CDN: CloudFlare
- Can handle: 50,000+ concurrent users

### Phase 3 (Enterprise - $500+/month)
- Multiple services, auto-scaling
- Dedicated database server
- Redis caching
- Professional monitoring

---

## Security

### Already Implemented
- ✅ CORS: Only allows requests from frontend URL
- ✅ JWT: Token-based authentication
- ✅ Password hashing: bcrypt + salt
- ✅ HTTPS: All traffic encrypted

### Should Add Later
- Rate limiting (prevent spam/DDoS)
- Input validation (SQLi prevention)
- CSRF protection
- WAF (Web Application Firewall)

---

## Monitoring & Troubleshooting

### Check Backend Status
```bash
# Visit your backend URL
https://devconnect-backend.onrender.com/

# Should see JSON response with message
```

### View Logs

**Render Logs:**
- Dashboard → Service → Logs tab
- Shows deployment logs, errors, warnings

**Vercel Logs:**
- Dashboard → Deployments → Click deployment → Logs
- Shows build errors, runtime errors

### Common Issues

| Issue | Check |
|-------|-------|
| Backend 502 error | PostgreSQL service running? Database URL correct? |
| Frontend shows "Cannot connect" | VITE_API_URL set correctly? CORS enabled? |
| Images not loading | Cloudinary credentials correct? File uploaded? |
| Slow first request | Render spinning up (normal, takes 30-60s) |

---

## Cost Breakdown

| Service | Cost | Why Free |
|---------|------|---------|
| Vercel Frontend | $0 | Free tier ample for most apps |
| Render Backend | $0 | Free tier with 750 hrs/month |
| PostgreSQL | $0 | Free tier included with Render |
| Cloudinary | $0 | 25GB free tier |
| **Total** | **$0** | Truly free to start! |

---

## Next Steps

1. Push code to GitHub
2. Deploy to Render (backend)
3. Deploy to Vercel (frontend)
4. Test live app
5. Monitor usage via dashboards
6. Scale when needed

Good luck! 🚀
