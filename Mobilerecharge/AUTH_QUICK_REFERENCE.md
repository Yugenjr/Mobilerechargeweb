# 🎯 Authentication & User Journey - Quick Reference

## 📊 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER VISITS APP                              │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
                        ┌───────────────┐
                        │  LOGIN PAGE   │
                        │   /login      │
                        └───────┬───────┘
                                │
                ┌───────────────┴───────────────┐
                │   Check Session on Mount      │
                │   validateSession()            │
                └───────────────┬───────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│ NO SESSION    │      │ HAS SESSION   │      │ HAS SESSION   │
│               │      │ NO MOBILE     │      │ WITH MOBILE   │
└───────┬───────┘      └───────┬───────┘      └───────┬───────┘
        │                      │                       │
        ▼                      ▼                       ▼
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│ Show Login    │      │ → ONBOARDING  │      │ → DASHBOARD   │
│ Options       │      │   /onboarding │      │   /dashboard  │
└───────┬───────┘      └───────────────┘      └───────────────┘
        │
        ▼
┌───────────────────────────────┐
│  User Chooses Auth Method:    │
│  1. Google Sign-In            │
│  2. Phone OTP                 │
└───────────────┬───────────────┘
                │
                ▼
        ┌───────────────┐
        │  FIREBASE     │
        │  AUTH         │
        └───────┬───────┘
                │
                ▼
        ┌───────────────────┐
        │  BACKEND API      │
        │  /api/auth/google │
        └───────┬───────────┘
                │
        ┌───────┴────────┐
        │  Check User:   │
        │  - Find by UID │
        │  - Or Create   │
        └───────┬────────┘
                │
        ┌───────┴────────────────────┐
        │  Return JWT + User Data    │
        │  saveSession(token, user)  │
        └───────┬────────────────────┘
                │
        ┌───────┴────────┐
        │                │
        ▼                ▼
┌───────────────┐  ┌───────────────┐
│ NEW USER      │  │ EXISTING USER │
│ (no mobile)   │  │ (has mobile)  │
└───────┬───────┘  └───────┬───────┘
        │                  │
        ▼                  ▼
┌───────────────┐  ┌───────────────┐
│ ONBOARDING    │  │ DASHBOARD     │
│ /onboarding   │  │ /dashboard    │
└───────┬───────┘  └───────────────┘
        │
        ▼
┌───────────────────────────┐
│  Enter Mobile Number      │
└───────┬───────────────────┘
        │
        ▼
┌───────────────────────────┐
│  POST /api/users/         │
│      update-mobile        │
└───────┬───────────────────┘
        │
        ▼
┌───────────────────────────┐
│  Backend:                 │
│  - Save mobile            │
│  - Detect operator        │
│  - Create SIM             │
└───────┬───────────────────┘
        │
        ▼
┌───────────────────────────┐
│  updateSessionUser()      │
│  { mobile: "9876543210" } │
└───────┬───────────────────┘
        │
        ▼
┌───────────────┐
│ DASHBOARD     │
│ /dashboard    │
└───────────────┘
```

---

## 🔐 Session Validation Logic

```javascript
// On every route/page load:

validateSession() {
  ✓ Check localStorage.authToken exists
  ✓ Check localStorage.user exists
  ✓ Parse user JSON
  ✓ Check user.mobile
  
  → Return: { isValid, user, needsOnboarding }
}

// Routing decision:
if (!isValid) → /login
if (needsOnboarding) → /onboarding
else → /dashboard
```

---

## 🛡️ Route Protection Matrix

| Route          | Auth Required | Mobile Required | Action if Not Met        |
|----------------|---------------|-----------------|--------------------------|
| `/login`       | ❌ No         | ❌ No           | Show login options       |
| `/onboarding`  | ✅ Yes        | ❌ No           | → `/login` if no auth    |
| `/dashboard`   | ✅ Yes        | ✅ Yes          | → `/login` or `/onboarding` |
| `/recharge`    | ✅ Yes        | ✅ Yes          | → `/login` or `/onboarding` |
| `/profile`     | ✅ Yes        | ✅ Yes          | → `/login` or `/onboarding` |
| `/usage`       | ✅ Yes        | ✅ Yes          | → `/login` or `/onboarding` |
| `/history`     | ✅ Yes        | ✅ Yes          | → `/login` or `/onboarding` |

---

## 🔄 State Transitions

### User States
```
┌──────────────┐
│ ANONYMOUS    │ → No token, no user data
└──────┬───────┘
       │ Google/Phone Sign-In
       ▼
┌──────────────┐
│ AUTHENTICATED│ → Has token, has email, NO mobile
│ (Incomplete) │
└──────┬───────┘
       │ Enter Mobile in Onboarding
       ▼
┌──────────────┐
│ AUTHENTICATED│ → Has token, has email, HAS mobile
│ (Complete)   │
└──────┬───────┘
       │ Logout
       ▼
┌──────────────┐
│ ANONYMOUS    │
└──────────────┘
```

---

## 🎨 User Journey Examples

### 🆕 **First-Time User (Google)**
```
1. Visit app
   └─→ Login page (no session)

2. Click "Sign in with Google"
   └─→ Firebase popup

3. Select account
   └─→ Backend verifies & creates user

4. Backend checks user.mobile
   └─→ null (new user)

5. Frontend saves session
   └─→ saveSession(token, { email, name, uid, mobile: null })

6. Navigate to /onboarding
   └─→ "Welcome! Let's set up your account"

7. Enter mobile: 9876543210
   └─→ POST /api/users/update-mobile

8. Backend:
   ├─→ Save mobile to User
   ├─→ Detect operator: "Jio"
   └─→ Create SIM document

9. Frontend updates session
   └─→ updateSessionUser({ mobile: "9876543210" })

10. Navigate to /dashboard
    └─→ "Hello, +91 9876543210"
```

---

### 👤 **Returning User**
```
1. Visit app
   └─→ Login page

2. Page mounts
   └─→ validateSession() runs

3. Session found:
   ├─→ authToken: "eyJhbG..."
   └─→ user: { email, mobile: "9876543210" }

4. isValid: true, needsOnboarding: false
   └─→ Navigate to /dashboard

5. Dashboard loads
   └─→ GET /api/dashboard
   └─→ Shows all user data
```

---

### 🔄 **Partial Signup (Edge Case)**
```
1. User signs in with Google
   └─→ Session saved with token

2. User closes browser before entering mobile
   └─→ Session persists in localStorage

3. User returns next day
   └─→ Login page mounts

4. validateSession() runs
   └─→ Has token, has email, NO mobile

5. needsOnboarding: true
   └─→ Redirect to /onboarding

6. User completes onboarding
   └─→ Mobile saved, SIM created

7. Navigate to /dashboard
   └─→ Full access granted
```

---

### 🚪 **Logout Flow**
```
1. User clicks logout (Sidebar or Profile)
   └─→ handleLogout() called

2. Firebase sign-out
   └─→ await signOut(auth)

3. Clear session
   └─→ clearSession()
   ├─→ Remove authToken
   └─→ Remove user

4. Reset state
   ├─→ isAuthenticated = false
   └─→ user = null

5. Navigate to login
   └─→ navigate('/login', { replace: true })

6. History cleared
   └─→ Can't go back to dashboard
```

---

## ⚠️ Error Handling

### Network Timeout (Onboarding)
```javascript
// User enters mobile, clicks submit
POST /api/users/update-mobile → TIMEOUT

// Frontend catches:
if (err.code === 'ECONNABORTED') {
  setError('Request timed out. Please try again.');
  // Session preserved, user can retry
}
```

---

### Session Expiry (401)
```javascript
// User tries to access API
GET /api/dashboard → 401 Unauthorized

// Frontend catches:
if (err.response?.status === 401) {
  setError('Session expired. Please login again.');
  clearSession();
  setTimeout(() => navigate('/login'), 2000);
}
```

---

### Corrupted Session Data
```javascript
// validateSession() tries to parse user
JSON.parse(localStorage.getItem('user'))

// Parse fails (corrupted JSON)
catch (error) {
  console.error('Session validation error');
  clearSession(); // Auto-clear bad data
  return { isValid: false };
}
```

---

## 📱 Session Storage Structure

### localStorage Keys
```javascript
{
  "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  
  "user": JSON.stringify({
    "email": "user@gmail.com",
    "name": "John Doe",
    "photo": "https://lh3.googleusercontent.com/...",
    "uid": "firebase-uid-12345",
    "mobile": "9876543210"  // null for new users
  })
}
```

---

## 🔍 Debugging Quick Reference

### Console Logs
```
🔓 No session found
🔄 Session validation in progress
✅ Success
❌ Error
🚪 Logout action
📱 Mobile number
👤 User data
🎫 Token operation
🌐 API call
🎯 Navigation
💾 Data storage
🆕 New user flow
⚠️ Warning
🔒 Protected route check
```

### Check Session Status
```javascript
// Run in browser console:
console.log({
  token: localStorage.getItem('authToken'),
  user: JSON.parse(localStorage.getItem('user') || '{}')
});
```

### Test Session Validation
```javascript
// Run in browser console:
import { validateSession } from './src/utils/sessionManager';
console.log(validateSession());
```

---

## ✅ Testing Checklist

### Authentication
- [ ] Google sign-in creates user
- [ ] Phone OTP works
- [ ] Backend returns JWT token
- [ ] Session saves to localStorage

### New User Flow
- [ ] Redirects to onboarding
- [ ] Mobile saves successfully
- [ ] SIM created with operator
- [ ] Redirects to dashboard

### Existing User Flow
- [ ] Skips onboarding
- [ ] Goes directly to dashboard
- [ ] Loads user-specific data

### Session Persistence
- [ ] Page refresh maintains session
- [ ] Direct URL navigation works
- [ ] Onboarding state persists

### Logout
- [ ] Clears Firebase session
- [ ] Clears localStorage
- [ ] Redirects to login
- [ ] Blocks dashboard access

### Edge Cases
- [ ] Partial signup → onboarding
- [ ] 401 error → clear + login
- [ ] Timeout → show retry
- [ ] Corrupted data → auto-clear

---

## 🚀 Quick Fix Commands

### Clear Session (Browser Console)
```javascript
localStorage.removeItem('authToken');
localStorage.removeItem('user');
location.reload();
```

### Check Auth State
```javascript
console.log('Auth:', !!localStorage.getItem('authToken'));
console.log('User:', localStorage.getItem('user'));
```

### Force Onboarding State
```javascript
const user = JSON.parse(localStorage.getItem('user'));
delete user.mobile;
localStorage.setItem('user', JSON.stringify(user));
location.reload();
```

---

## 📚 Related Files

| File | Purpose |
|------|---------|
| `src/utils/sessionManager.js` | Session validation & management utilities |
| `src/routes/AppRoutes.jsx` | Route protection logic |
| `src/hooks/useAuth.js` | Authentication hook |
| `src/pages/auth/Login.jsx` | Login page with session check |
| `src/pages/auth/Onboarding.jsx` | Mobile collection for new users |
| `src/pages/dashboard/Dashboard.jsx` | Protected dashboard |
| `src/pages/profile/Profile.jsx` | User profile with logout |
| `backend/src/controllers/authController.js` | Auth endpoints |
| `backend/src/controllers/dashboardController.js` | User-specific data |
| `backend/src/middleware/auth.js` | JWT verification |

---

## 🎯 Key Takeaways

✅ **Session always validated on mount** - No invalid states  
✅ **Deterministic routing** - User always lands in correct place  
✅ **Onboarding enforced** - Can't access dashboard without mobile  
✅ **Clean logout** - Firebase + localStorage cleared  
✅ **Error recovery** - Network failures, expired sessions handled  
✅ **State persistence** - Session survives page refresh  
✅ **Security** - JWT tokens, route protection, backend validation  

---

🎉 **Your authentication system is now production-ready!**
