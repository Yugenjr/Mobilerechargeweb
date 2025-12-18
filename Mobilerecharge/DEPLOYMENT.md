# Deployment Environment Variables Guide

## Backend (.env)

### Required Variables
```env
# Server Configuration
PORT=5002
NODE_ENV=production

# MongoDB Configuration (REQUIRED)
MONGODB_URI=your-mongodb-connection-string

# JWT Secret (REQUIRED - Generate a secure random string)
JWT_SECRET=your-secure-jwt-secret-minimum-32-characters

# Firebase Admin (REQUIRED)
FIREBASE_PROJECT_ID=your-firebase-project-id

# CORS (Optional - defaults to localhost)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Security Notes:
- Never commit `.env` files to version control
- Use strong, randomly generated JWT_SECRET (min 32 characters)
- Keep MongoDB credentials secure
- Update ALLOWED_ORIGINS for production domains

## Frontend (.env)

### Required Variables
```env
# Firebase Configuration (REQUIRED)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Backend API URL (REQUIRED)
VITE_API_URL=https://your-backend-api.com
```

### Security Notes:
- Firebase config can be public (client-side auth)
- Update VITE_API_URL to production backend URL
- All variables must be prefixed with `VITE_` for Vite to expose them

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
