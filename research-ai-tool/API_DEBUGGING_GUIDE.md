# 🔧 API Debugging Guide

## Browser Console Tools

### Quick Test Commands

**Test 1: Check API URL**
```javascript
console.log(window.apiDebug.baseUrl)
```
Should output: `https://ai-research.onrender.com`

**Test 2: Test Connection (Recommended)**
```javascript
window.apiDebug.testHealth()
```
Automatically performs:
- Sends GET request to `/` endpoint
- Logs response in console
- Shows connection status
- Displays error diagnosis if fails

**Test 3: Using Native Fetch API**
```javascript
// Replace with your actual backend URL
const API_URL = 'https://ai-research.onrender.com';

fetch(`${API_URL}/`, { 
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
})
  .then(res => res.json())
  .then(data => console.log('✅ Success:', data))
  .catch(err => console.error('❌ Failed:', err));
```

**Test 4: With Timeout Handling**
```javascript
const testWithTimeout = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  
  try {
    const res = await fetch('https://ai-research.onrender.com/', {
      signal: controller.signal,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    console.log('✅ Response:', data);
  } catch (err) {
    if (err.name === 'AbortError') {
      console.error('⏱️ Request timeout (10 seconds)');
    } else {
      console.error('❌ Error:', err.message);
    }
  } finally {
    clearTimeout(timeout);
  }
};

testWithTimeout();
```

**Test 5: Test PDF Upload Endpoint**
```javascript
const testUpload = async () => {
  const formData = new FormData();
  const dummyFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
  formData.append('file', dummyFile);
  
  try {
    const res = await fetch('https://ai-research.onrender.com/analyze', {
      method: 'POST',
      body: formData, // Don't set Content-Type for FormData
    });
    const data = await res.json();
    console.log('✅ Response:', data);
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
};

testUpload();
```

---

## Console Log Types

### ✅ Success Logs
```
🔌 API Service Initialized
📍 API Base URL: https://ai-research.onrender.com
🚀 [GET] /
✅ [200] https://ai-research.onrender.com/
✅ Health Check Passed: {...}
```

### ❌ Error Logs

**Network Error:**
```
❌ Response Error: Error: Network Error
🌐 Network Error Details: {...}
🔍 Error Diagnosis:
  type: NETWORK_ERROR
  message: No server response - Backend may be offline
  serverReachable: false
```

**Timeout Error:**
```
⏱️ Request timeout (60 seconds) - Server took too long
🔍 Error Diagnosis:
  type: NETWORK_ERROR
  timeoutIssue: true
  message: Request timeout
```

**CORS Error:**
```
🚫 CORS Error: Backend not allowing this origin
🔍 Error Diagnosis:
  corsIssue: true
  type: SERVER_ERROR
  message: CORS Error - check backend ALLOWED_ORIGINS
```

---

## CORS Configuration Requirements

### Backend Must Allow Frontend Origin

Edit `backend/.env`:
```env
# Allow specific frontend domain (production)
ALLOWED_ORIGINS=https://earnings-analyzer-frontend.onrender.com

# OR allow all origins (development only)
ALLOWED_ORIGINS=*
```

### Backend Code (Already configured in main.py)
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS.split(","),
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Test CORS Headers
In browser console:
```javascript
// Check what the backend is returning
fetch('https://ai-research.onrender.com/', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
})
  .then(res => {
    console.log('CORS Headers:');
    console.log('Access-Control-Allow-Origin:', res.headers.get('access-control-allow-origin'));
    console.log('Access-Control-Allow-Methods:', res.headers.get('access-control-allow-methods'));
    return res.json();
  })
  .then(data => console.log('✅ Data:', data))
  .catch(err => console.error('❌ Error:', err));
```

---

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=https://ai-research.onrender.com
```

### Backend (.env)
```env
OPENAI_API_KEY=sk-...
ALLOWED_ORIGINS=https://earnings-analyzer-frontend.onrender.com
```

---

## Common Issues & Solutions

### Issue 1: "No server response"
**Symptoms:** Network error, timeout, 0 response

**Checks:**
1. Is backend running? → Visit `https://ai-research.onrender.com/` in browser
2. Check connection: `window.apiDebug.testHealth()`
3. Is frontend URL in CORS_ALLOWED_ORIGINS?
4. Firewall/proxy blocking?

**Solution:**
```bash
# Restart backend on Render
# In Render Dashboard → Backend service → Manual Deploy

# Or test locally
curl https://ai-research.onrender.com/
```

### Issue 2: "CORS error"
**Symptoms:** 403/405 error, "no 'access-control-allow-origin' header"

**Checks:**
```javascript
// See error details
window.apiDebug.testHealth()
// Look for: corsIssue: true
```

**Solution:**
1. Edit `backend/.env`:
   ```env
   ALLOWED_ORIGINS=https://earnings-analyzer-frontend.onrender.com
   ```
2. Redeploy backend on Render
3. Test: `window.apiDebug.testHealth()`

### Issue 3: Timeout (60 seconds)
**Symptoms:** Request takes > 60 seconds

**Cause:** Large PDF, slow AI processing, or backend overload

**Solution:**
```javascript
// Check if backend is alive
window.apiDebug.testHealth()

// If timeout on /analyze, PDF might be too big
// Max size: 50MB
```

### Issue 4: 500 Server Error
**Symptoms:** `{"detail": "Internal error"}`

**Checks:**
1. Check backend logs: Render Dashboard → Logs → Filter for errors
2. Is OpenAI API key set?
3. Is file valid PDF?

**Solution:**
```bash
# Check Render backend logs
# Look for OpenAI error: "API key not set"
# Look for PDF error: "Invalid PDF"
```

---

## Real-Time Monitoring

### See All API Calls
Everything is logged to browser console:
```
🔌 API Service Initialized
📍 API Base URL: https://ai-research.onrender.com
🚀 [GET] /health
✅ [200] /health
📊 Upload progress: 25%
📊 Upload progress: 50%
✅ [200] /analyze
```

### Filter Logs
```javascript
// Show only errors
console.log(
  '%cErrors only', 
  'color: red; font-weight: bold;'
);
// Then in console: Right-click → Filter → type "❌"
```

---

## API Health Status Component

Bottom-right corner shows:
- 🟢 **Green**: Connected
- 🔴 **Red**: Offline  
- 🟡 **Yellow**: Checking...

Rechecks every 30 seconds automatically.

---

## Debug Checklist

- [ ] Frontend loads without errors: `window.apiDebug` exists
- [ ] API base URL correct: `window.apiDebug.baseUrl`
- [ ] Health check passes: `window.apiDebug.testHealth()`
- [ ] Response headers include CORS headers
- [ ] Backend ALLOWED_ORIGINS includes frontend URL
- [ ] OpenAI API key set in backend
- [ ] No 50MB+ PDF test (size limit)
- [ ] No network errors in console (F12 → Network tab)

---

## Support

If connection still fails:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Run: `window.apiDebug.testHealth()`
4. Share the error diagnosis
5. Check backend logs on Render

