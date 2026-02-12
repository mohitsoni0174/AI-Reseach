# 🚀 Render Deployment Guide

Complete guide to deploying the Earnings Call Analyzer to Render.

---

## 📋 Prerequisites

1. **GitHub Account** - Your code must be in a GitHub repository
2. **Render Account** - Sign up at https://render.com (free tier available)
3. **OpenAI API Key** - Get from https://platform.openai.com/api-keys

---

## 🎯 Deployment Options

### Option A: One-Click Deploy (Recommended)

Use the `render.yaml` blueprint for automated setup.

### Option B: Manual Setup

Deploy backend and frontend separately through Render Dashboard.

---

## 🚀 Option A: One-Click Deploy with Blueprint

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - Ready for deployment"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Render

1. Go to https://render.com/
2. Sign up or log in
3. Click **"New" → "Blueprint"**
4. Connect your GitHub repository
5. Select your repository: `YOUR_USERNAME/YOUR_REPO`

### Step 3: Configure Environment Variables

Render will detect the `render.yaml` file. You'll need to set:

#### Backend Environment Variables:
- `OPENAI_API_KEY` - Your OpenAI API key (keep secret!)

#### Frontend Environment Variables:
- `VITE_API_URL` - Auto-configured from backend service

### Step 4: Deploy

1. Click **"Apply"**
2. Render will create both services automatically
3. Wait 5-10 minutes for build and deployment

### Step 5: Get Your URLs

After deployment:
- **Backend API**: `https://earnings-analyzer-api.onrender.com`
- **Frontend**: `https://earnings-analyzer-frontend.onrender.com`

---

## 🛠️ Option B: Manual Deployment

### Deploy Backend

1. Go to https://dashboard.render.com/
2. Click **"New" → "Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `earnings-analyzer-api`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: `backend`
   - **Plan**: `Free`

5. **Environment Variables**:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   PYTHON_VERSION=3.11.0
   ALLOWED_ORIGINS=https://earnings-analyzer-frontend.onrender.com
   ```

6. Click **"Create Web Service"**

### Deploy Frontend

1. Click **"New" → "Static Site"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `earnings-analyzer-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Root Directory**: `frontend`

4. **Environment Variables**:
   ```
   NODE_VERSION=18.17.0
   VITE_API_URL=https://earnings-analyzer-api.onrender.com
   ```

5. Click **"Create Static Site"**

---

## 🔐 Security Configuration

### Update CORS for Production

After deployment, update backend `.env`:

```env
ALLOWED_ORIGINS=https://earnings-analyzer-frontend.onrender.com
```

Then redeploy the backend.

---

## ✅ Verify Deployment

### Test Backend

```bash
curl https://earnings-analyzer-api.onrender.com/
```

Expected response:
```json
{
  "status": "healthy",
  "service": "Earnings Call Analyzer",
  "version": "1.0.0"
}
```

### Test Frontend

1. Open `https://earnings-analyzer-frontend.onrender.com`
2. Upload a test PDF
3. Verify analysis works end-to-end

---

## 🔄 Continuous Deployment

Render auto-deploys on git push:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Render automatically rebuilds and deploys
```

---

## 🐛 Troubleshooting

### Backend Build Fails

**Issue**: Missing dependencies

**Solution**: Ensure `requirements.txt` includes all packages:
```bash
cd backend
pip freeze > requirements.txt
git add requirements.txt
git commit -m "Update dependencies"
git push
```

### Frontend Build Fails

**Issue**: Node version mismatch

**Solution**: Set `NODE_VERSION=18.17.0` in environment variables

### CORS Errors

**Issue**: Frontend can't connect to backend

**Solution**: 
1. Check `VITE_API_URL` in frontend env vars
2. Update `ALLOWED_ORIGINS` in backend env vars
3. Ensure no trailing slashes in URLs

### 404 on Frontend Routes

**Issue**: React Router not working

**Solution**: Render already configured with rewrite rules in `render.yaml`

### OpenAI API Errors

**Issue**: "API key not set"

**Solution**: 
1. Go to Render Dashboard
2. Select backend service
3. Environment → Add `OPENAI_API_KEY`
4. Trigger manual deploy

---

## 💰 Free Tier Limits

Render Free Tier includes:
- ✅ 750 hours/month (enough for 1 service running 24/7)
- ✅ Automatic HTTPS
- ✅ Custom domains
- ⚠️ Services spin down after 15 min of inactivity
- ⚠️ First request after spin-down takes ~30s

### Avoiding Spin-Down

Use a service like UptimeRobot (free) to ping your backend every 10 minutes:
```
https://uptimerobot.com/
Ping URL: https://earnings-analyzer-api.onrender.com/
```

---

## 🔧 Advanced Configuration

### Custom Domain

1. Go to Settings → Custom Domain
2. Add your domain (e.g., `analyzer.yourdomain.com`)
3. Update DNS records as shown
4. Render provides free SSL certificate

### Environment-Specific Builds

Create multiple environments:
- `main` branch → Production
- `dev` branch → Staging

Configure in Render:
1. Settings → Branch
2. Set to `main` or `dev`

### Database Integration

If you add PostgreSQL later:

1. Render Dashboard → New → PostgreSQL
2. Copy connection string
3. Add to backend env: `DATABASE_URL=postgresql://...`

---

## 📊 Monitoring

### View Logs

```bash
# Render Dashboard → Your Service → Logs
```

### Monitor Health

Set up health check endpoint (already configured):
- Path: `/`
- Interval: 60 seconds

---

## 🚀 Performance Optimization

### Backend

1. **Enable Caching**: Add Redis for frequent requests
2. **Use CDN**: Render automatically uses CloudFlare CDN
3. **Optimize Images**: Compress PDFs before upload

### Frontend

1. **Code Splitting**: Vite already does this
2. **Lazy Loading**: Add React.lazy() for routes
3. **Asset Optimization**: Already handled by Vite build

---

## 📝 Post-Deployment Checklist

- [ ] Backend health check returns 200 OK
- [ ] Frontend loads without errors
- [ ] PDF upload works end-to-end
- [ ] Analysis results display correctly
- [ ] Error handling shows toast notifications
- [ ] CORS configured for production domain
- [ ] OpenAI API key set in Render dashboard
- [ ] Custom domain configured (optional)
- [ ] Uptime monitoring set up (optional)
- [ ] Analytics integrated (optional)

---

## 🎉 You're Live!

Share your app:
- **Frontend**: `https://earnings-analyzer-frontend.onrender.com`
- **API Docs**: `https://earnings-analyzer-api.onrender.com/docs`

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Vite Production Build](https://vitejs.dev/guide/build.html)
- [React Deployment](https://react.dev/learn/start-a-new-react-project#deploying-to-production)

---

## 💡 Next Steps

1. **Analytics**: Integrate Google Analytics or Plausible
2. **Authentication**: Add user login with Auth0 or Clerk
3. **Database**: Store analysis history in PostgreSQL
4. **Rate Limiting**: Prevent API abuse
5. **Caching**: Speed up repeated analyses
6. **Webhooks**: Notify on analysis completion
7. **Stripe**: Add payment for premium features

---

**Need help?** Check Render's community forum or documentation.
