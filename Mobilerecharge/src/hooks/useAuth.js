import { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  };

  const login = (userData, token) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
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
    
    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    console.log('✅ Logout complete - localStorage cleared');
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
