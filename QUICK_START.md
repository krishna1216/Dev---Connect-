# 🚀 DevConnect - Quick Deployment Checklist

## ✅ Pre-Deployment Setup

- [ ] **GitHub Setup**
  - [ ] Create GitHub repository
  - [ ] Push all code to GitHub
  - [ ] Ensure `.env` files are in `.gitignore`

- [ ] **Cloudinary Setup**
  - [ ] Create free account at [cloudinary.com](https://cloudinary.com)
  - [ ] Copy Cloud Name, API Key, and API Secret
  - [ ] Store these for later

## 🎯 Backend Deployment (Render)

**Time: ~10 minutes**

1. [ ] Go to [render.com](https://render.com) and sign up with GitHub
2. [ ] Create PostgreSQL database:
   - Click **"New +"** → **"PostgreSQL"**
   - Name: `devconnect-db`
   - Plan: **Free**
   - Copy the **Internal Database URL** (you'll need this next)
3. [ ] Create Web Service:
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository
   - Name: `devconnect-backend`
   - Runtime: **Python 3.11**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Plan: **Free**

4. [ ] Add Environment Variables (in service settings):
   ```
   DATABASE_URL=<paste-the-internal-database-url-here>
   FRONTEND_URL=https://devconnect.vercel.app
   SECRET_KEY=<generate-random-string>
   CLOUDINARY_CLOUD_NAME=<your-cloud-name>
   CLOUDINARY_API_KEY=<your-api-key>
   CLOUDINARY_API_SECRET=<your-api-secret>
   ENVIRONMENT=production
   ```

5. [ ] Wait for deployment to complete (check logs)
6. [ ] Test backend: Visit `https://devconnect-backend.onrender.com/` (you should see JSON response)
7. [ ] Copy the backend URL (you'll need it for frontend)

## 🎨 Frontend Deployment (Vercel)

**Time: ~5 minutes**

1. [ ] Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. [ ] Create new project:
   - Click **"Add New"** → **"Project"**
   - Import your repository
   - Framework Preset: **React**
3. [ ] Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://devconnect-backend.onrender.com` (your backend URL from above)
4. [ ] Click **"Deploy"**
5. [ ] Wait for deployment to complete
6. [ ] Visit your frontend URL (Vercel will give you the link)

## ✨ Testing Your Live App

- [ ] Frontend loads without errors
- [ ] Can login/register (check browser console for errors)
- [ ] Can create posts
- [ ] Can upload media (should use Cloudinary)
- [ ] Can view feed

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend won't start | Check Render logs. Verify DATABASE_URL is set correctly |
| Frontend can't connect | Check browser console. Verify VITE_API_URL matches your Render backend |
| Media uploads fail | Verify Cloudinary credentials are correct |
| Database errors | Make sure PostgreSQL service on Render is running |

## 📞 Support

- **Render docs:** https://render.com/docs
- **Vercel docs:** https://vercel.com/docs
- **Cloudinary docs:** https://cloudinary.com/documentation

## 🎉 Congratulations!

Your app is now live for FREE! Share it with the world! 🚀
