# Authentication & Session Management Documentation

## Overview
This document details the complete end-to-end authentication and session management flow for the Mobile Recharge application.

## Authentication Flow

### 1. **Login Page (`/login`)**

#### Entry Points:
- User navigates to the app
- User is logged out
- Session is invalid

#### Behavior on Mount:
```javascript
// Checks for existing session
const session = validateSession();

if (session.isValid) {
  if (session.needsOnboarding) {
    // User authenticated but no mobile → Onboarding
    navigate('/onboarding', { replace: true });
  } else {
    // User fully authenticated → Dashboard
    navigate('/dashboard', { replace: true });
  }
}
```

#### Authentication Methods:

**Google Sign-In:**
1. User clicks "Sign in with Google"
2. Firebase popup appears
3. User selects Google account
4. Frontend receives Firebase user object
5. Frontend sends Firebase token to backend `/api/auth/google`
6. Backend verifies token, creates/finds user in MongoDB
7. Backend returns JWT token + user data
8. Session is saved using `saveSession(token, userData)`
9. Route based on user state:
   - **New User (no mobile):** → `/onboarding` 
   - **Existing User:** → `/dashboard`

**Phone OTP:**
1. User enters mobile number
2. Frontend validates format (10 digits)
3. Firebase sends OTP via SMS
4. User enters OTP
5. Firebase verifies OTP
6. Backend creates/finds user
7. JWT token + user data returned
8. Route based on state

---

### 2. **Onboarding Page (`/onboarding`)**

#### Entry Condition:
- User is authenticated (has JWT token)
- User does NOT have mobile number in database

#### Protection:
```javascript
// In AppRoutes.jsx ProtectedRoute
if (!user.mobile && pathname !== '/onboarding') {
  navigate('/onboarding', { replace: true });
}
```

#### Flow:
1. Page receives user + token from Login navigation state OR localStorage
2. User enters 10-digit mobile number
3. Frontend validates format
4. POST request to `/api/users/update-mobile` with Authorization header
5. Backend:
   - Validates JWT token
   - Saves mobile to User document
   - Auto-detects operator (Jio/Airtel/Vi/BSNL)
   - Creates SIM document linked to user
6. Frontend updates session: `updateSessionUser({ mobile })`
7. Navigate to `/dashboard`

#### Error Handling:
- **Network timeout:** "Request timed out. Please check your connection and try again."
- **401 Unauthorized:** Clear session, redirect to login after 2 seconds
- **Other errors:** Display error message, allow retry

---

### 3. **Dashboard Page (`/dashboard`)**

#### Entry Condition:
- User is authenticated (has JWT token)
- User has completed onboarding (has mobile)

#### Protection:
```javascript
// In AppRoutes.jsx ProtectedRoute
if (!isAuthenticated()) {
  clearSession(); // Clear stale data
  navigate('/login', { replace: true });
}

if (!user.mobile && pathname !== '/onboarding') {
  navigate('/onboarding', { replace: true });
}
```

#### Data Loading:
1. Page mounts
2. GET request to `/api/dashboard` with Authorization header
3. Backend filters all data by `userId` from JWT:
   - User profile
   - Linked SIMs
   - Current plan
   - Usage statistics
   - Recent payments
4. Display personalized greeting: `"Hello, +91 ${mobile}"`

#### Features:
- View current plan
- Recharge SIM
- View usage statistics
- View payment history
- Navigate to profile

---

### 4. **Profile Page (`/profile`)**

#### Data Display:
Fetches from `/api/dashboard`:
- User name
- User email
- User mobile number
- Linked SIM cards

#### Logout:
```javascript
const handleLogout = async () => {
  await logout(); // Clears Firebase + localStorage
  navigate('/login', { replace: true });
};
```

---

## Session Management

### Session Storage
**Location:** `localStorage`

**Keys:**
- `authToken`: JWT token (30-day expiration)
- `user`: JSON string with user data

**Structure:**
```json
{
  "email": "user@example.com",
  "name": "User Name",
  "photo": "photoURL",
  "uid": "firebase-uid",
  "mobile": "9876543210"
}
```

### Session Validation

**Utility:** `src/utils/sessionManager.js`

**Functions:**

#### `validateSession()`
```javascript
Returns: {
  isValid: boolean,
  user: object | null,
  needsOnboarding: boolean
}

Logic:
- Check if authToken and user exist
- Parse user data
- Check if user.mobile exists
- Return validation result
```

#### `saveSession(token, user)`
```javascript
- Save token to localStorage.authToken
- Save user to localStorage.user (JSON string)
- Log save confirmation
```

#### `updateSessionUser(userData)`
```javascript
- Merge new data with existing user object
- Update localStorage.user
- Used after onboarding to add mobile
```

#### `clearSession()`
```javascript
- Remove authToken
- Remove user
- Log clear confirmation
```

#### `getCurrentUser()`
```javascript
Returns: User object | null
- Safely parse and return user from localStorage
```

#### `needsOnboarding()`
```javascript
Returns: boolean
- Check if current user lacks mobile number
```

---

## Route Protection

### Protected Routes
**File:** `src/routes/AppRoutes.jsx`

**Implementation:**
```javascript
const ProtectedRoute = ({ children }) => {
  // 1. Validate authentication
  if (!isAuthenticated()) {
    clearSession(); // Clear any stale data
    return <Navigate to="/login" replace />;
  }
  
  // 2. Check onboarding status
  const user = getCurrentUser();
  if (!user.mobile && pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  
  // 3. Render protected content with layout
  return (
    <>
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main>{children}</main>
      </div>
      <BottomNav />
    </>
  );
};
```

### Auth Route (Login/Register)
```javascript
const AuthRoute = ({ children }) => {
  if (isAuthenticated()) {
    const user = getCurrentUser();
    if (!user.mobile) {
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};
```

---

## Edge Cases & Error Handling

### 1. **Partial Signup (User authenticated but no mobile)**
**Detection:** User has JWT token but `user.mobile` is null/undefined

**Handling:**
- Login page redirects to onboarding
- Protected routes redirect to onboarding
- Dashboard blocked until onboarding complete

---

### 2. **Session Expiry**
**Backend Returns 401:**
```javascript
if (err.response?.status === 401) {
  setError('Session expired. Please login again.');
  clearSession();
  setTimeout(() => navigate('/login', { replace: true }), 2000);
}
```

---

### 3. **Network Failure**
**Onboarding Request Timeout:**
```javascript
if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
  setError('Request timed out. Please check your connection and try again.');
  // Allow user to retry - don't clear session
}
```

---

### 4. **Corrupted Session Data**
**SessionManager Protection:**
```javascript
try {
  const user = JSON.parse(localStorage.getItem('user'));
  // ... validation
} catch (error) {
  console.error('Session validation error:', error);
  clearSession(); // Clear corrupted data
  return { isValid: false };
}
```

---

### 5. **Direct URL Navigation**
**SPA Routing Configuration:**
- `_redirects`: `/*  /index.html  200`
- `render.yaml`: `type: static` for frontend
- All routes fallback to index.html
- AppRoutes handles routing logic

---

### 6. **Page Refresh**
**Behavior:**
1. App remounts
2. Login page checks `validateSession()`
3. If valid session exists:
   - User with mobile → Dashboard
   - User without mobile → Onboarding
4. If no session → Stay on login

---

### 7. **Backend Cold Start (30s timeout)**
**API Configuration:**
```javascript
// src/services/api.js
axios.create({
  timeout: 30000, // 30 seconds
  // ... other config
});
```

**Keep-Alive Service:**
- Pings backend every 10 minutes
- Prevents cold starts
- Located in `src/services/keepAlive.js`

---

## User Journey Examples

### **New User (First Time)**
1. Visit app → Login page
2. Click "Sign in with Google"
3. Select Google account
4. Backend creates user (no mobile)
5. → Redirect to Onboarding
6. Enter mobile number
7. Backend creates SIM + operator detection
8. → Redirect to Dashboard
9. See personalized greeting with mobile number

---

### **Existing User**
1. Visit app → Login page
2. Session validation finds existing session
3. User has mobile → Dashboard
4. See all their data (SIMs, payments, usage)

---

### **Returning User (Logged Out)**
1. Visit app → Login page
2. No session found
3. Click "Sign in with Google"
4. Backend finds existing user with mobile
5. → Directly to Dashboard (skip onboarding)

---

### **User Refreshes Page**
1. Page reloads
2. Login component mounts
3. `validateSession()` called
4. Valid session found
5. Auto-redirect based on state:
   - Has mobile → Dashboard
   - No mobile → Onboarding

---

### **User Logs Out**
1. Click logout button (Sidebar or Profile)
2. Firebase sign-out executed
3. `clearSession()` removes localStorage data
4. State reset: `isAuthenticated = false`
5. → Redirect to Login
6. All user data cleared from memory

---

## API Endpoints

### **Authentication**

#### `POST /api/auth/google`
**Request:**
```json
{
  "token": "firebase-id-token"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token",
  "user": {
    "email": "user@example.com",
    "name": "User Name",
    "mobile": "9876543210" // null for new users
  }
}
```

---

#### `POST /api/users/update-mobile`
**Headers:** `Authorization: Bearer <jwt-token>`

**Request:**
```json
{
  "mobile": "9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mobile number updated successfully",
  "user": {
    "mobile": "9876543210",
    "operator": "Jio"
  }
}
```

---

#### `GET /api/dashboard`
**Headers:** `Authorization: Bearer <jwt-token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "name": "...", "email": "...", "mobile": "..." },
    "primarySim": { "mobile": "...", "operator": "...", "status": "..." },
    "currentPlan": { "name": "...", "data": "...", "validity": "..." },
    "usageStats": { "dataUsed": "...", "callMinutes": "..." },
    "recentPayments": [ /* last 5 payments */ ]
  }
}
```

---

## Security Features

### 1. **JWT Token Authentication**
- 30-day expiration
- Signed with secret key
- Required for all protected endpoints
- Sent in Authorization header

### 2. **Firebase Authentication**
- Google OAuth verified by Firebase
- Phone OTP verified by Firebase
- Secure token exchange

### 3. **Route Protection**
- Client-side guards prevent UI access
- Backend validates JWT on every request
- User ID extracted from JWT payload

### 4. **Session Clearing on Logout**
- Firebase sign-out
- localStorage cleared
- State reset in memory
- Navigate with `replace: true` (no history)

### 5. **Error Handling**
- 401 errors trigger re-login
- Network failures allow retry
- Corrupted data auto-cleared

---

## Logging & Debugging

### Console Emoji Guide
- 🔓 No session (login initialization)
- 🔄 Session validation in progress
- ✅ Success (authentication, API calls)
- ❌ Error (failures)
- 🚪 Logout action
- 📱 Mobile number related
- 👤 User data
- 🎫 Token operations
- 🌐 API calls
- 🎯 Navigation
- 💾 Data storage
- 🆕 New user flow
- ⚠️ Warning/needs attention
- 🔒 Protected route check
- 🏁 Operation complete

### Key Logging Points
- Login component mount
- Session validation results
- API request/response
- Navigation decisions
- Onboarding steps
- Logout execution
- Error occurrences

---

## Testing Checklist

### New User Flow
- [ ] Google sign-in creates new user
- [ ] User redirected to onboarding
- [ ] Mobile number saves successfully
- [ ] SIM created with correct operator
- [ ] User redirected to dashboard
- [ ] Dashboard shows user's mobile number

### Existing User Flow
- [ ] Login detects existing user
- [ ] User goes directly to dashboard
- [ ] User data loads correctly
- [ ] SIM and plan info displayed

### Session Persistence
- [ ] Page refresh maintains session
- [ ] User stays logged in after refresh
- [ ] Direct URL navigation works
- [ ] Onboarding state persists

### Logout
- [ ] Firebase sign-out successful
- [ ] localStorage cleared
- [ ] Redirect to login
- [ ] Cannot access dashboard after logout

### Edge Cases
- [ ] Partial signup redirects to onboarding
- [ ] Session expiry redirects to login
- [ ] Network timeout shows retry option
- [ ] Corrupted data auto-clears
- [ ] 404 routes fallback to index.html

### Route Protection
- [ ] Unauthenticated users → Login
- [ ] Authenticated without mobile → Onboarding
- [ ] Authenticated with mobile → Dashboard
- [ ] Can't bypass onboarding

---

## Configuration

### Frontend Environment
**Base URL:** Configured in `src/config/api.js`
```javascript
const API_URL = 'https://mobilerechargeweb.onrender.com';
```

### Backend Environment
**Port:** 5002
**MongoDB:** Connection string in `backend/src/config/database.js`
**JWT Secret:** In environment variables
**Firebase:** Project config in `backend/src/config/firebase.js`

### Deployment
**Frontend:** Render (Static Site)
- URL: https://recharge-frontend-c525.onrender.com
- Type: Static
- Build: `npm run build`
- Publish: `dist`

**Backend:** Render (Web Service)
- URL: https://mobilerechargeweb.onrender.com
- Type: Web Service
- Start: `node src/server.js`

---

## Troubleshooting

### "Continue to Dashboard" not working
**Check:**
1. Console logs for errors
2. API response from `/api/users/update-mobile`
3. localStorage has updated user object
4. Session manager properly updating mobile

### User stuck in login loop
**Check:**
1. JWT token present in localStorage
2. Token not expired
3. Backend returning valid user object
4. Session validation logic correct

### Dashboard showing only "+91"
**Check:**
1. User object in localStorage has mobile field
2. Dashboard fetching correct API
3. API returning user.mobile in response

### Onboarding redirect not working
**Check:**
1. ProtectedRoute checking user.mobile
2. Session validation detecting needsOnboarding
3. Navigation using `replace: true`

---

## Future Enhancements

1. **Token Refresh Mechanism**
   - Auto-refresh before expiration
   - Seamless session extension

2. **Backend Session Validation Endpoint**
   - `/api/auth/validate-session`
   - Real-time token validation
   - Check database for user state

3. **Multi-Device Logout**
   - Server-side session tracking
   - Logout from all devices

4. **Remember Me Feature**
   - Extended token expiration
   - Persistent sessions

5. **Email Verification**
   - Verify email after signup
   - Send verification link

6. **Two-Factor Authentication**
   - OTP for sensitive operations
   - Enhanced security

---

## Conclusion

The authentication system is designed to provide a **deterministic, secure, and user-friendly experience** with comprehensive error handling and session management. All edge cases are covered, and the flow ensures users always land in the correct state based on their authentication and onboarding status.
