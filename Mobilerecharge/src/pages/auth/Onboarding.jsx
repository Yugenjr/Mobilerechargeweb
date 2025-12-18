import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import axios from 'axios';
import { validateSession, updateSessionUser } from '../../utils/sessionManager';

const Onboarding = () => {
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get user data from navigation state or localStorage
  const stateData = location.state || {};
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const storedToken = localStorage.getItem('authToken');
  
  const user = stateData.user || storedUser;
  const token = stateData.token || storedToken;

  console.log('🎬 Onboarding component mounted');
  console.log('📍 Location state:', location.state);
  console.log('👤 User from state:', stateData.user);
  console.log('👤 User from localStorage:', storedUser);
  console.log('🎫 Token from state:', stateData.token ? 'Present' : 'Missing');
  console.log('🎫 Token from localStorage:', storedToken ? 'Present' : 'Missing');
  console.log('✅ Final user:', user);
  console.log('✅ Final token:', token ? 'Present' : 'Missing');

  const handleSubmit = async () => {
    if (mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      console.log('📱 Onboarding: Updating mobile number:', mobile);
      console.log('👤 User:', user?.email);
      console.log('🎫 Token:', token ? 'Present' : 'Missing');
      console.log('🎫 Token value (first 20 chars):', token?.substring(0, 20));
      
      // Update user with mobile number
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';
      console.log('🌐 API URL:', API_URL);
      console.log('🌐 Full endpoint:', `${API_URL}/api/users/update-mobile`);
      console.log('📦 Request payload:', { mobile });
      console.log('📋 Request headers:', { Authorization: `Bearer ${token?.substring(0, 20)}...` });
      
      const response = await axios.post(
        `${API_URL}/api/users/update-mobile`,
        { mobile },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          timeout: 30000
        }
      );
      
      console.log('✅ Update mobile response status:', response.status);
      console.log('✅ Update mobile response data:', response.data);
      
      if (response.data.success) {
        // Update session with new mobile info using session manager
        updateSessionUser({ mobile });
        console.log('💾 User info updated in session');
        console.log('✅ Onboarding complete!');
        console.log('🎯 Navigating to dashboard...');
        
        // Navigate to dashboard
        navigate('/dashboard', { replace: true });
      } else {
        console.error('❌ API returned success:false');
        setError(response.data.message || 'Failed to update mobile number');
      }
    } catch (err) {
      console.error('❌ Onboarding error:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      // Handle network errors
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        setError('Request timed out. Please check your connection and try again.');
      } else if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        // Clear stale auth
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setTimeout(() => navigate('/login', { replace: true }), 2000);
      } else {
        setError(err.response?.data?.message || 'Failed to update mobile number. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // If user already has mobile, redirect to dashboard
  if (user?.mobile) {
    console.log('✅ User already has mobile number, redirecting to dashboard');
    navigate('/dashboard', { replace: true });
    return null;
  }

  // If no user email or token, redirect to login
  if (!user?.email || !token) {
    console.log('⚠️ Onboarding: Missing auth data, redirecting to login');
    console.log('Missing user email:', !user?.email);
    console.log('Missing token:', !token);
    navigate('/login', { replace: true });
    return null;
  }
  
  // If user already has mobile, skip onboarding
  if (user.mobile) {
    console.log('✅ User already has mobile, redirecting to dashboard');
    navigate('/dashboard', { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-4"
          >
            <div className="w-20 h-20 bg-gradient-neon rounded-full flex items-center justify-center">
              <Smartphone className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Welcome!</h1>
          <p className="text-gray-400">Let's complete your profile</p>
        </div>

        <Card glow>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700">
                {user.photo ? (
                  <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl font-bold">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <div>
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-4">Add Mobile Number</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  maxLength="10"
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value.replace(/\D/g, ''));
                    setError('');
                  }}
                  placeholder="Enter 10 digit mobile number"
                  className="input-field pl-12"
                  disabled={loading}
                  autoFocus
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  +91
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                This will be used for recharge services and notifications
              </p>
            </div>

            <Button
              fullWidth
              onClick={handleSubmit}
              disabled={mobile.length !== 10 || loading}
              icon={loading ? null : ArrowRight}
            >
              {loading ? 'Setting up...' : 'Continue to Dashboard'}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Onboarding;
