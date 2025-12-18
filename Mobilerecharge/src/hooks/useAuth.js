import { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { validateSession, saveSession, clearSession, getCurrentUser } from '../utils/sessionManager';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    // Use session manager for validation
    const session = validateSession();
    
    if (session.isValid) {
      setIsAuthenticated(true);
      setUser(session.user);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  };

  const login = (userData, token) => {
    // Use session manager to save
    saveSession(token, userData);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      console.log('✅ Firebase sign-out successful');
    } catch (error) {
      console.error('❌ Firebase sign-out error:', error);
    }
    
    // Clear session using session manager
    clearSession();
    setIsAuthenticated(false);
    setUser(null);
    console.log('✅ Logout complete - session cleared');
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    checkAuth
  };
};

export default useAuth;
