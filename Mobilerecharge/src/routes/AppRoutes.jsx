import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import BottomNav from '../components/layout/BottomNav';

// Auth Pages
import Login from '../pages/auth/Login';
import Otp from '../pages/auth/Otp';
import Onboarding from '../pages/auth/Onboarding';

// Main Pages
import Dashboard from '../pages/dashboard/Dashboard';
import Recharge from '../pages/recharge/RechargeNew';
import Plans from '../pages/recharge/PlansNew';
import Usage from '../pages/usage/Usage';
import History from '../pages/payments/History';
import Profile from '../pages/profile/Profile';

const AppRoutes = () => {
  // Check authentication with token and user data
  const isAuthenticated = () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      console.log('🔒 Protected route: Not authenticated, redirecting to login');
      // Clear any stale data
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return <Navigate to="/login" replace />;
    }
    
    // Check if user has completed onboarding
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.mobile && window.location.pathname !== '/onboarding') {
      console.log('⚠️ User has no mobile, redirecting to onboarding');
      return <Navigate to="/onboarding" replace />;
    }
    
    return (
      <>
        <Sidebar />
        <div className="lg:pl-64">
          <Topbar />
          <main className="p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
            {children}
          </main>
        </div>
        <BottomNav />
      </>
    );
  };

  const AuthRoute = ({ children }) => {
    if (isAuthenticated()) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      // If user doesn't have mobile, send to onboarding
      if (!user.mobile) {
        console.log('✅ Authenticated but no mobile, redirecting to onboarding');
        return <Navigate to="/onboarding" replace />;
      }
      console.log('✅ Already authenticated, redirecting to dashboard');
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  };

  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            }
          />
          <Route
            path="/otp"
            element={
              <AuthRoute>
                <Otp />
              </AuthRoute>
            }
          />
          <Route
            path="/onboarding"
            element={<Onboarding />}
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recharge"
            element={
              <ProtectedRoute>
                <Recharge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plans"
            element={
              <ProtectedRoute>
                <Plans />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usage"
            element={
              <ProtectedRoute>
                <Usage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
};

export default AppRoutes;
