# 🚀 Deploy to Render - Step by Step

Follow these exact steps to deploy your app to Render.

---

## Step 1: Prepare Your Code ✅

All configuration files are ready:
- ✅ `render.yaml` - Deployment blueprint
- ✅ `backend/requirements.txt` - Python dependencies
- ✅ `frontend/package.json` - Node dependencies
- ✅ `.gitignore` - Excludes sensitive files
- ✅ Environment variable templates

---

## Step 2: Push to GitHub

### Option A: New Repository

```powershell
# Initialize git (if not done)
cd C:\Users\MOHIT\Desktop\as\research-ai-tool
git init

# Add all files
git add .

# Commit
git commit -m "feat: Complete app ready for deployment"

# Create new repo on GitHub:
# Go to https://github.com/new
# Name it: earnings-call-analyzer
# Don't initialize with README
# Click "Create repository"

# Connect and push
git remote add origin https://github.com/YOUR_USERNAME/earnings-call-analyzer.git
git branch -M main
git push -u origin main
```

### Option B: Existing Repository

```powershell
# Check current status
git status

# Add and commit all new files
git add .
git commit -m "feat: Add Render deployment configuration"

# Push to GitHub
git push origin main
```

---

## Step 3: Deploy on Render

### 3.1 Sign Up / Log In

1. Go to https://render.com
2. Click "Get Started" or "Log In"
3. Sign up with GitHub (recommended) or email

### 3.2 Create New Blueprint

1. Click **"New +"** button (top right)
2. Select **"Blueprint"**
3. Click **"Connect GitHub"** if not already connected
4. Select your repository: `earnings-call-analyzer`
5. Click **"Connect"**

### 3.3 Configure Services

Render will detect `render.yaml` and show:

**✅ Backend Service**
- Name: `earnings-analyzer-api`
- Type: Web Service
- Plan: Free

**✅ Frontend Service**
- Name: `earnings-analyzer-frontend`  
- Type: Static Site
- Plan: Free

### 3.4 Set Environment Variables

Click on **Backend Service** settings:

**Required:**
```
OPENAI_API_KEY = sk-proj-YOUR_ACTUAL_KEY_HERE
```

**Optional:**
```
PYTHON_VERSION = 3.11.0
ALLOWED_ORIGINS = *
```

> ⚠️ **IMPORTANT**: Use your REAL OpenAI API key from https://platform.openai.com/api-keys

The frontend `VITE_API_URL` will be auto-configured from the backend service.

### 3.5 Deploy!

1. Click **"Apply"** or **"Create Services"**
2. Wait for deployment (usually 5-10 minutes)
3. Watch the build logs in real-time

---

## Step 4: Monitor Deployment

### Backend Build Progress

Watch for these log messages:
```
==> Installing dependencies
==> Building with pip
==> Starting service
INFO: Application startup complete
```

### Frontend Build Progress

Watch for:
```
==> Installing dependencies  
==> Running npm install
==> Running npm run build
==> Build succeeded
```

---

## Step 5: Get Your URLs

After successful deployment:

**🌐 Frontend URL:**
```
https://earnings-analyzer-frontend.onrender.com
```

**🔌 Backend API URL:**
```
https://earnings-analyzer-api.onrender.com
```

**📚 API Documentation:**
```
https://earnings-analyzer-api.onrender.com/docs
```

---

## Step 6: Test Your Deployment

### Test Backend

```powershell
curl https://earnings-analyzer-api.onrender.com/
```

Should return:
```json
{
  "status": "healthy",
  "service": "Earnings Call Analyzer",
  "version": "1.0.0"
}
```

### Test Frontend

1. Open `https://earnings-analyzer-frontend.onrender.com`
2. You should see the premium UI
3. Try uploading a PDF
4. Verify analysis works

---

## Step 7: Update Frontend to Use Production API

The frontend should automatically connect to the backend, but verify:

1. Go to Render Dashboard
2. Click on `earnings-analyzer-frontend`
3. Go to **Environment**
4. Check `VITE_API_URL` is set to:
   ```
   https://earnings-analyzer-api.onrender.com
   ```

If not, add it and trigger a redeploy.

---

## Step 8: Configure Production CORS (Optional)

For better security:

1. Go to backend service settings
2. Update environment variable:
   ```
   ALLOWED_ORIGINS=https://earnings-analyzer-frontend.onrender.com
   ```
3. Click **"Save Changes"**
4. Service will auto-redeploy

---

## 🎉 You're Live!

Your app is now deployed and accessible worldwide!

**Share these links:**
- Frontend: `https://earnings-analyzer-frontend.onrender.com`
- API Docs: `https://earnings-analyzer-api.onrender.com/docs`

---

## ⚡ Important Notes

### Free Tier Limitations

- Services **spin down** after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- 750 hours/month per service (enough for 24/7 uptime)

### Keeping Services Active

Use **UptimeRobot** (free) to ping your backend every 10 minutes:

1. Sign up at https://uptimerobot.com
2. Add new monitor:
   - Type: HTTP(S)
   - URL: `https://earnings-analyzer-api.onrender.com/`
   - Interval: 10 minutes
3. This prevents spin-down during business hours

---

## 🔄 Continuous Deployment

Every time you push to GitHub, Render auto-deploys:

```powershell
# Make changes locally
git add .
git commit -m "feat: Add new feature"
git push origin main

# Render automatically:
# 1. Detects the push
# 2. Rebuilds your app
# 3. Deploys new version
# (Takes about 3-5 minutes)
```

---

## 🐛 Troubleshooting

### Build Failed

**Check logs:**
1. Render Dashboard → Service → Logs
2. Look for error messages
3. Common issues:
   - Missing dependencies
   - Wrong Python/Node version
   - Environment variables not set

**Solution:**
```powershell
# Update dependencies locally
cd backend
pip freeze > requirements.txt

cd ../frontend
npm install

# Commit and push
git add .
git commit -m "fix: Update dependencies"
git push
```

### "OpenAI API key not set"

1. Go to backend service → Environment
2. Add `OPENAI_API_KEY` with your actual key
3. Click "Save Changes"

### Frontend Can't Connect to Backend

1. Check frontend env vars
2. Verify `VITE_API_URL` is correct
3. Check backend CORS settings
4. Look at browser console for errors

### 404 Errors on Frontend Routes

Already configured in `render.yaml`:
```yaml
routes:
  - type: rewrite
    source: /*
    destination: /index.html
```

If still issues, check Static Site settings.

---

## 📊 Monitoring

### View Logs

**Backend:**
```
Dashboard → earnings-analyzer-api → Logs
```

**Frontend:**
```
Dashboard → earnings-analyzer-frontend → Logs  
```

### Set Up Alerts

1. Render Dashboard → Service → Settings
2. Enable email/Slack notifications for:
   - Build failures
   - Deploy failures
   - Service health issues

---

## 🎯 Next Steps After Deployment

1. **Custom Domain** - Add your own domain (free SSL included)
2. **Analytics** - Integrate Google Analytics
3. **Monitoring** - Set up UptimeRobot
4. **Backups** - Regular git commits
5. **Testing** - Test with real PDFs
6. **Sharing** - Share with users and get feedback!

---

## 📞 Need Help?

- **Render Docs**: https://render.com/docs
- **Render Support**: https://render.com/support
- **Community**: https://community.render.com

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Connected repository to Render
- [ ] Set OPENAI_API_KEY in backend
- [ ] Both services deployed successfully
- [ ] Backend health check returns 200
- [ ] Frontend loads and displays correctly
- [ ] PDF upload works end-to-end
- [ ] UptimeRobot configured (optional)
- [ ] Custom domain added (optional)

---

**🚀 Ready to deploy? Let's go!**

Start with Step 2 above and push your code to GitHub.
