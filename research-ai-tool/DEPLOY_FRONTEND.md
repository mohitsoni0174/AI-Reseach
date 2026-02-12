# 🚀 Quick Deploy Instructions

Your backend is already live at: **https://ai-research.onrender.com**

Now let's deploy the frontend!

---

## Option 1: Deploy via Render Dashboard (Easiest)

### Step 1: Go to Render Dashboard
Visit: https://dashboard.render.com/

### Step 2: Create New Static Site
1. Click **"New +"** → **"Static Site"**
2. Connect your GitHub repository (if not already connected)
3. Select your repo: `research-ai-tool` or whatever you named it

### Step 3: Configure Frontend
Fill in these settings:

| Field | Value |
|-------|-------|
| **Name** | `earnings-analyzer-frontend` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |
| **Auto-Deploy** | Yes |

### Step 4: Add Environment Variable
Click **"Advanced"** and add:

```
VITE_API_URL = https://ai-research.onrender.com
```

### Step 5: Deploy
1. Click **"Create Static Site"**
2. Wait 3-5 minutes for build
3. Your frontend will be live!

---

## Option 2: Push to GitHub (If using render.yaml)

If you want to use the Blueprint approach:

```powershell
# Commit all changes
git add .
git commit -m "feat: Configure frontend for production deployment"

# Push to GitHub
git push origin main

# Then in Render Dashboard:
# 1. New → Blueprint
# 2. Select your repo
# 3. It will create both services
```

---

## ✅ After Deployment

Your URLs will be:
- **Frontend**: `https://earnings-analyzer-frontend.onrender.com`
- **Backend**: `https://ai-research.onrender.com` ✅ (already live)
- **API Docs**: `https://ai-research.onrender.com/docs` ✅ (already live)

---

## 🔧 Update Backend CORS

For security, update your backend environment variable:

1. Go to backend service on Render
2. Environment → Edit `ALLOWED_ORIGINS`
3. Set to: `https://earnings-analyzer-frontend.onrender.com`
4. Save and redeploy

---

## 🧪 Test Everything

1. Open your frontend URL
2. Upload a PDF
3. Verify it connects to backend
4. Check analysis works!

---

**Ready to deploy?** Follow Option 1 above - it's the quickest! 🚀
