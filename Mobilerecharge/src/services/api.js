import axios from 'axios';

// Base API configuration using environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000, // Increased to 30 seconds for cold starts on Render
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const verifyFirebaseToken = async (firebaseToken, mobile) => {
  try {
    const response = await api.post('/auth/verify-firebase-token', { 
      firebaseToken,
      mobile 
    });
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const verifyGoogleAuth = async (firebaseToken, email, name, uid) => {
  try {
    console.log('🌐 API Call: /auth/google-signin');
    console.log('📍 Backend URL:', API_BASE_URL);
    const response = await api.post('/auth/google-signin', { 
      firebaseToken,
      email,
      name,
      uid
    });
    console.log('✅ API Response received:', response);
    return response;
  } catch (error) {
    console.error('❌ API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      code: error.code
    });
    if (error.code === 'ECONNABORTED') {
      throw new Error('Backend server is starting up. Please wait a moment and try again.');
    }
    throw error.response?.data || error;
  }
};

// Dashboard APIs
export const fetchDashboardData = async () => {
  try {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            name: 'John Doe',
            mobile: '9876543210',
            balance: 150
          },
          currentPlan: {
            name: 'Unlimited 5G',
            dataUsed: 45,
            dataTotal: 100,
            validity: '15 Days'
          },
          offers: []
        });
      }, 500);
    });
    // Real implementation:
    // return await api.get('/dashboard');
  } catch (error) {
    throw error;
  }
};

// Plans APIs
export const fetchPlans = async (operator = 'all') => {
  try {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          plans: [
            { id: 1, amount: 239, data: '1.5 GB/day', validity: '28 Days' },
            { id: 2, amount: 299, data: '2 GB/day', validity: '28 Days' },
          ]
        });
      }, 500);
    });
    // Real implementation:
    // return await api.get('/plans', { params: { operator } });
  } catch (error) {
    throw error;
  }
};

// Usage APIs
export const fetchUsage = async (period = 'week') => {
  try {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          dataUsage: [
            { day: 'Mon', usage: 2.5 },
            { day: 'Tue', usage: 3.2 },
          ],
          callStats: {
            totalCalls: 256,
            duration: 458
          }
        });
      }, 500);
    });
    // Real implementation:
    // return await api.get('/usage', { params: { period } });
  } catch (error) {
    throw error;
  }
};

// Recharge History APIs
export const fetchRechargeHistory = async () => {
  try {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          transactions: [
            {
              id: 'TXN1234567890',
              date: '2025-12-15',
              amount: 299,
              status: 'success'
            }
          ]
        });
      }, 500);
    });
    // Real implementation:
    // return await api.get('/history');
  } catch (error) {
    throw error;
  }
};

// Recharge APIs
export const initiateRecharge = async (mobile, operator, planId, amount) => {
  try {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: 'TXN' + Date.now(),
          paymentUrl: 'https://payment.mock.com'
        });
      }, 1000);
    });
    // Real implementation:
    // return await api.post('/recharge', { mobile, operator, planId, amount });
  } catch (error) {
    throw error;
  }
};

export default api;
