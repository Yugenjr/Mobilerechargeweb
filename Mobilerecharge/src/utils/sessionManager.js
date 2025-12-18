/**
 * Session Manager Utility
 * Handles authentication session validation and management
 */

/**
 * Check if user session is valid
 * @returns {Object} { isValid: boolean, user: object|null, needsOnboarding: boolean }
 */
export const validateSession = () => {
  try {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      console.log('🔒 No session found');
      return { isValid: false, user: null, needsOnboarding: false };
    }
    
    const user = JSON.parse(userStr);
    
    // Check if user has completed onboarding (has mobile number)
    const needsOnboarding = !user.mobile;
    
    console.log('✅ Session validated:', {
      hasToken: !!token,
      hasUser: !!user,
      userEmail: user.email,
      userMobile: user.mobile,
      needsOnboarding
    });
    
    return {
      isValid: true,
      user,
      needsOnboarding
    };
  } catch (error) {
    console.error('❌ Session validation error:', error);
    // Clear corrupted session data
    clearSession();
    return { isValid: false, user: null, needsOnboarding: false };
  }
};

/**
 * Save authentication session
 * @param {string} token - JWT token
 * @param {Object} user - User object
 */
export const saveSession = (token, user) => {
  try {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    console.log('💾 Session saved:', {
      email: user.email,
      mobile: user.mobile,
      hasToken: !!token
    });
  } catch (error) {
    console.error('❌ Failed to save session:', error);
  }
};

/**
 * Update user data in session
 * @param {Object} userData - Updated user data
 */
export const updateSessionUser = (userData) => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    console.log('🔄 Session user updated:', userData);
  } catch (error) {
    console.error('❌ Failed to update session user:', error);
  }
};

/**
 * Clear authentication session
 */
export const clearSession = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  console.log('🧹 Session cleared');
};

/**
 * Get current auth token
 * @returns {string|null}
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Get current user
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('❌ Failed to get current user:', error);
    return null;
  }
};

/**
 * Check if user needs onboarding
 * @returns {boolean}
 */
export const needsOnboarding = () => {
  const user = getCurrentUser();
  return user ? !user.mobile : false;
};
