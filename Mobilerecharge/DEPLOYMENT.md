# 🚀 Deployment Configuration Guide

## 📋 **Production URLs**
- **Frontend:** `https://recharge-frontend-c525.onrender.com`
- **Backend:** `https://mobilerechargeweb.onrender.com`

---

## ⚙️ **BACKEND Environment Variables**

### Required in Render Dashboard (mobilerechargeweb):

```env
NODE_ENV=production
PORT=5002

# MongoDB Configuration (REQUIRED)
MONGODB_URI=mongodb+srv://yugenjr847:yugen842007@yugen.zbssgmq.mongodb.net/mobilerecharge

# JWT Secret (REQUIRED - Generate strong secret!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345

# Firebase Configuration (REQUIRED)
FIREBASE_PROJECT_ID=event-horizon-9sr6w

# CORS Configuration (REQUIRED)
ALLOWED_ORIGINS=http://localhost:3004,http://localhost:5173,https://recharge-frontend-c525.onrender.com
```

### Generate Strong JWT Secret:
```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🎨 **FRONTEND Environment Variables**

### Required in Render Dashboard (recharge-frontend-c525):

```env
NODE_ENV=production

# Backend API (REQUIRED)
VITE_API_URL=https://mobilerechargeweb.onrender.com

# Firebase Configuration (REQUIRED)
VITE_FIREBASE_API_KEY=AIzaSyCMDooo-DQY4VeukK49nn0N6hFCTQvqBtY
VITE_FIREBASE_AUTH_DOMAIN=event-horizon-9sr6w.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=event-horizon-9sr6w
VITE_FIREBASE_STORAGE_BUCKET=event-horizon-9sr6w.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=149097918186
VITE_FIREBASE_APP_ID=1:149097918186:web:bb3d7f410cea389e677193
```

---

## 🔧 **How to Add Environment Variables in Render**

### For Backend (mobilerechargeweb):
1. Go to https://dashboard.render.com
2. Click on **mobilerechargeweb** service
3. Go to **Environment** tab
4. Click **Add Environment Variable**
5. Add each variable from the backend section above
6. Click **Save Changes**
7. Service will auto-redeploy

### For Frontend (recharge-frontend-c525):
1. Go to https://dashboard.render.com
2. Click on **recharge-frontend-c525** service
3. Go to **Environment** tab
4. Click **Add Environment Variable**
5. Add each variable from the frontend section above
6. Click **Save Changes**
7. Service will auto-redeploy

---

## ✅ **Verification Checklist**

### Backend:
- [ ] MONGODB_URI is set (connection string)
- [ ] JWT_SECRET is set (strong random value)
- [ ] FIREBASE_PROJECT_ID is set
- [ ] ALLOWED_ORIGINS includes frontend URL
- [ ] PORT=5002
- [ ] NODE_ENV=production

### Frontend:
- [ ] VITE_API_URL points to backend
- [ ] All 7 Firebase variables are set
- [ ] NODE_ENV=production

---

## 🧪 **Testing After Deployment**

### 1. Test Backend:
```
https://mobilerechargeweb.onrender.com/health
```
Should return:
```json
{"success": true, "message": "Server is running"}
```

### 2. Test Frontend:
- Visit: `https://recharge-frontend-c525.onrender.com`
- Sign in with Google
- Complete onboarding
- Access dashboard
- No CORS errors in console

---

## 🚨 **Security Notes**

## Deployment Checklist

### Backend Deployment
- [ ] Set all required environment variables in hosting platform
- [ ] Generate secure JWT_SECRET (use: openssl rand -base64 32)
- [ ] Configure MongoDB Atlas IP whitelist
- [ ] Set NODE_ENV=production
- [ ] Update ALLOWED_ORIGINS with production domains
- [ ] Verify Firebase Admin SDK permissions

### Frontend Deployment
- [ ] Set all VITE_ prefixed environment variables
- [ ] Update VITE_API_URL to production backend
- [ ] Build with: npm run build
- [ ] Test Firebase authentication
- [ ] Verify API connectivity

## Environment Variable Validation

The application validates required environment variables on startup:
- Backend: Checks for MONGODB_URI, JWT_SECRET, FIREBASE_PROJECT_ID
- Frontend: Checks for Firebase config in firebase.js

Missing variables will cause startup failure with clear error messages.

## Local Development

Use `.env.example` files as templates:
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials

# Frontend
cp .env.example .env
# Edit .env with your Firebase config
```
