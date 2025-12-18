// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

export const API_ENDPOINTS = {
  // Auth endpoints
  VERIFY_FIREBASE_TOKEN: `${API_URL}/api/auth/verify-firebase-token`,
  GOOGLE_SIGNIN: `${API_URL}/api/auth/google-signin`,
  
  // User endpoints
  UPDATE_MOBILE: `${API_URL}/api/users/update-mobile`,
  
  // Dashboard endpoints
  DASHBOARD: `${API_URL}/api/dashboard`,
  PLANS: (simId) => `${API_URL}/api/plans/${simId}`,
  PRIMARY_SIM: `${API_URL}/api/sims/primary`,
  RECHARGE: `${API_URL}/api/payments/recharge`,
  
  // Health check
  HEALTH: `${API_URL}/health`
};

export default API_URL;
