# DevConnect - Free Deployment Guide

Deploy your full-stack social media app for **completely free** using Render, Vercel, and Cloudinary.

---

## 📋 Prerequisites
- GitHub account (to connect your repo)
- Cloudinary account (free tier)
- Render account
- Vercel account

---

## 🚀 Step 1: Deploy Backend + Database on Render

### 1.1 Push code to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/devconnect.git
git push -u origin main
```

### 1.2 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click **"New +"** → **"Web Service"**
4. Select your GitHub repository
5. Fill in the form:
   - **Name:** `devconnect-backend`
   - **Runtime:** Python 3.11
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free

### 1.3 Set Environment Variables on Render
Click **"Environment"** and add:

```
FRONTEND_URL=https://devconnect.vercel.app
SECRET_KEY=generate-a-random-string-here
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
ENVIRONMENT=production
```

### 1.4 Create PostgreSQL Database
1. In Render, click **"New +"** → **"PostgreSQL"**
2. Name: `devconnect-db`
3. Plan: Free
4. Copy the **Internal Database URL** and add as `DATABASE_URL` in web service environment

---

## 📦 Step 2: Setup Cloudinary (Free Media Storage)

### 2.1 Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up free
3. Go to Dashboard → Settings
4. Copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 2.2 Update Backend for Cloudinary
Update `app/utils/file_upload.py` to use Cloudinary:

```python
import cloudinary
import cloudinary.uploader

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

def upload_file(file):
    result = cloudinary.uploader.upload(file)
    return result['secure_url']
```

---

## 🎨 Step 3: Deploy Frontend on Vercel

### 3.1 Create `.env.local` in frontend root
```
VITE_API_URL=https://devconnect-backend.onrender.com
```

### 3.2 Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"Add New"** → **"Project"**
4. Import your repository
5. Set **Framework Preset:** React
6. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://devconnect-backend.onrender.com`
7. Click **"Deploy"** ✅

---

## 🔒 Step 4: Update CORS in Backend

Update `app/main.py`:

```python
import os
from fastapi.middleware.cors import CORSMiddleware

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📝 Step 5: Update Frontend API Calls

Update `src/api/axios.js`:

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;
```

---

## ✅ Step 6: Update Database Connection

Update `app/database.py` to use environment variable:

```python
import os
from sqlalchemy import create_engine

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

if DATABASE_URL.startswith("postgresql"):
    engine = create_engine(DATABASE_URL)
else:
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
```

---

## 🎯 Final Steps

1. **Add `python-dotenv` to requirements.txt:**
   ```
   python-dotenv==1.0.0
   ```

2. **Load environment variables in `app/main.py`:**
   ```python
   from dotenv import load_dotenv
   load_dotenv()
   ```

3. **Commit and push:**
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push
   ```

4. Vercel and Render will auto-deploy on push ✅

---

## 📊 Cost Breakdown (All FREE)

| Service | Free Tier | Cost |
|---------|-----------|------|
| Render (Backend + DB) | Shared CPU, 0.5GB RAM, PostgreSQL | **$0** |
| Vercel (Frontend) | 100GB bandwidth/month | **$0** |
| Cloudinary (Media) | 25GB storage, 25GB bandwidth | **$0** |
| **Total** | **Full-stack app** | **$0/month** |

---

## 🚨 Free Tier Limitations & Solutions

| Issue | Limit | Solution |
|-------|-------|----------|
| Render backend spins down | No activity = 15 min sleep | Add monitoring service (cron-job.org) |
| Vercel cold starts | First request slow | Auto-redeploy weekly |
| Cloudinary storage | 25GB free | Implement cleanup of old media |

---

## 💡 Pro Tips

1. **Keep backend awake:** Use [UptimeRobot](https://uptimerobot.com) (free) to ping your backend every 30 minutes
2. **Monitor errors:** Enable Render & Vercel notifications
3. **Database backups:** Render auto-backs up (free tier has basic backups)
4. **Custom domain:** Add custom domain in Vercel (free) or Render

---

## 🆘 Troubleshooting

**Backend won't start:**
- Check Render logs: Dashboard → Service → Logs
- Verify `DATABASE_URL` is set
- Run locally: `python -m uvicorn app.main:app`

**Frontend can't connect to backend:**
- Check CORS: Ensure `FRONTEND_URL` matches Vercel URL
- Check `VITE_API_URL`: Should be your Render backend URL
- Open DevTools → Network tab to see API calls

**Database connection fails:**
- Verify `DATABASE_URL` format (must be PostgreSQL connection string)
- Check Render PostgreSQL service is running
- Allow internal connections in Render

---

## 🎉 You're Live!

Your app is now live at: **https://devconnect.vercel.app** 🚀

Good luck! 🚀
