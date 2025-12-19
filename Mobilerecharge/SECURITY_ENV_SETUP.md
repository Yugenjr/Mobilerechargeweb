# 🔐 SECURE Environment Variables Setup

## ⚠️ SECURITY WARNING
**NEVER commit sensitive credentials to Git!**

This file explains how to securely manage environment variables using Render's dashboard.

---

## 🎯 **Render Dashboard Setup (SECURE METHOD)**

### **Step 1: Access Render Dashboard**
1. Go to https://dashboard.render.com
2. Sign in to your account

---

## 🎨 **FRONTEND SERVICE (recharge-frontend-c525)**

### Navigate to:
Dashboard → Services → **recharge-frontend-c525** → **Environment** tab

### Add These Variables (Click "Add Environment Variable" for each):

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Already in YAML |
| `VITE_API_URL` | `https://mobilerechargeweb.onrender.com` | Backend URL |
| `VITE_FIREBASE_API_KEY` | `[YOUR_FIREBASE_API_KEY]` | From Firebase Console |
| `VITE_FIREBASE_AUTH_DOMAIN` | `[YOUR_PROJECT].firebaseapp.com` | From Firebase Console |
| `VITE_FIREBASE_PROJECT_ID` | `[YOUR_PROJECT_ID]` | From Firebase Console |
| `VITE_FIREBASE_STORAGE_BUCKET` | `[YOUR_PROJECT].firebasestorage.app` | From Firebase Console |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `[YOUR_SENDER_ID]` | From Firebase Console |
| `VITE_FIREBASE_APP_ID` | `[YOUR_APP_ID]` | From Firebase Console |

### How to Get Firebase Values:
1. Go to https://console.firebase.google.com
2. Select your project: **event-horizon-9sr6w**
3. Go to Project Settings (gear icon) → General
4. Scroll to "Your apps" section
5. Click on your web app
6. Copy each value from the Firebase config object

---

## ⚙️ **BACKEND SERVICE (mobilerechargeweb)**

### Navigate to:
Dashboard → Services → **mobilerechargeweb** → **Environment** tab

### Add These Variables (Click "Add Environment Variable" for each):

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Already in YAML |
| `PORT` | `5002` | Already in YAML |
| `ALLOWED_ORIGINS` | (See YAML) | Already in YAML |
| `MONGODB_URI` | `mongodb+srv://[USER]:[PASSWORD]@[HOST]/[DB]` | ⚠️ SECRET |
| `JWT_SECRET` | `[64-char random hex]` | ⚠️ SECRET |
| `FIREBASE_PROJECT_ID` | `[YOUR_PROJECT_ID]` | From Firebase Console |

### ⚠️ CRITICAL SECRETS - Handle With Care:

#### **MONGODB_URI:**
1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Navigate to: Database → Connect → Connect your application
3. Copy connection string
4. Replace `<username>` with your DB user
5. Replace `<password>` with your DB password
6. Replace `<dbname>` with: `mobilerecharge`
7. Format: `mongodb+srv://USER:PASSWORD@cluster.mongodb.net/mobilerecharge`

#### **JWT_SECRET:**
Generate a secure random secret:

**PowerShell:**
```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**CMD:**
```cmd
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Output Example:**
```
a7f3c9e2b8d4f1a6c5e9b2d7f4a1c8e6b3d9f2a5c8e1b4d7f3a6c9e2b5d8f1a4c7e3b6d9f2a5c8e1b4d7f3a6
```

Copy this and paste as `JWT_SECRET` value in Render.

#### **FIREBASE_PROJECT_ID:**
Get from Firebase Console (same as frontend instructions)

---

## ✅ **After Adding All Variables**

### For Frontend:
1. Click **"Save Changes"** button
2. Service will auto-redeploy
3. Wait 2-3 minutes for build
4. Check logs for successful deployment

### For Backend:
1. Click **"Save Changes"** button  
2. Service will auto-redeploy
3. Wait 1-2 minutes
4. Check logs for:
   ```
   ✅ Server is listening on http://localhost:5002
   💾 MongoDB: Connected
   🌐 CORS enabled for origins: [...]
   ```

---

## 🧪 **Verification**

### Test Backend:
```
https://mobilerechargeweb.onrender.com/health
```
Should return:
```json
{
  "success": true,
  "message": "Server is running"
}
```

### Test Frontend:
1. Visit: `https://recharge-frontend-c525.onrender.com`
2. Open Console (F12)
3. No errors about missing Firebase config
4. Sign in with Google works
5. No CORS errors

---

## 🔒 **Security Best Practices**

### ✅ DO:
- ✅ Add secrets only in Render Dashboard (Environment tab)
- ✅ Use strong, random JWT_SECRET (64+ characters)
- ✅ Rotate secrets regularly (monthly recommended)
- ✅ Limit MongoDB IP whitelist (not 0.0.0.0/0 if possible)
- ✅ Use different secrets for dev/staging/prod
- ✅ Keep .env files in .gitignore
- ✅ Review Git history for accidentally committed secrets

### ❌ DON'T:
- ❌ Never commit .env files to Git
- ❌ Never put secrets in render.yaml
- ❌ Never share secrets in chat/email/Slack
- ❌ Never use weak or guessable secrets
- ❌ Never reuse secrets across projects
- ❌ Never log secrets in application code

---

## 🚨 **If Secrets Were Exposed in Git**

### Immediate Actions:

1. **MongoDB Password:**
   - Go to MongoDB Atlas → Database Access
   - Change the database user password
   - Update MONGODB_URI in Render with new password
   - Redeploy backend

2. **JWT_SECRET:**
   - Generate new secret (command above)
   - Update in Render Dashboard
   - Redeploy backend
   - All users will need to re-login

3. **Firebase API Key:**
   - Go to Firebase Console → Project Settings
   - Can restrict API key to specific domains
   - Go to Google Cloud Console for more restrictions
   - Firebase client keys are meant to be public but restrict usage

4. **Clean Git History:**
   ```powershell
   # WARNING: This rewrites history - coordinate with team
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env" \
     --prune-empty --tag-name-filter cat -- --all
   
   git push origin --force --all
   ```

---

## 📝 **Local Development (.env files)**

### Frontend: `Mobilerecharge/.env`
```dotenv
# Get values from Firebase Console
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# Backend URL (production or local)
VITE_API_URL=https://mobilerechargeweb.onrender.com
# Or for local backend:
# VITE_API_URL=http://localhost:5002
```

### Backend: `Mobilerecharge/backend/.env`
```dotenv
PORT=5002
NODE_ENV=development

# Get from MongoDB Atlas
MONGODB_URI=mongodb+srv://...

# Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=...

# Get from Firebase Console
FIREBASE_PROJECT_ID=...

# Allow frontend origins
ALLOWED_ORIGINS=http://localhost:3004,http://localhost:5173,https://recharge-frontend-c525.onrender.com
```

### ⚠️ NEVER commit these .env files!

---

## 🔍 **Verify .gitignore**

Make sure `.gitignore` includes:
```gitignore
.env
.env.local
.env.*.local
.env.production
backend/.env
backend/.env.local
```

Check with:
```powershell
git status
```

If `.env` appears in untracked files, it's NOT ignored!

---

## 📞 **Support**

If you need help:
1. Check Render logs for specific errors
2. Verify all required variables are set
3. Ensure no typos in variable names
4. Test backend health endpoint first
5. Then test frontend

---

## 🎯 **Checklist Before Deployment**

- [ ] All .env files are in .gitignore
- [ ] No secrets in render.yaml
- [ ] All secrets added in Render Dashboard
- [ ] Strong JWT_SECRET generated (64+ chars)
- [ ] MongoDB password is secure
- [ ] ALLOWED_ORIGINS includes frontend URL
- [ ] VITE_API_URL points to backend
- [ ] All Firebase variables are set
- [ ] Both services deployed successfully
- [ ] Backend health endpoint works
- [ ] Frontend loads without errors
- [ ] Authentication flow works end-to-end

---

🔐 **Security is paramount. When in doubt, rotate your secrets!**
