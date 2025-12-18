import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import axios from 'axios';

const Onboarding = () => {
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get user data from navigation state
  const { user, token } = location.state || {};

  const handleSubmit = async () => {
    if (mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Update user with mobile number
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';
      const response = await axios.post(
        `${API_URL}/api/users/update-mobile`,
        { mobile },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        // Update stored user info
        const updatedUser = { ...user, mobile };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Failed to update mobile number');
      }
    } catch (err) {
      console.error('Onboarding error:', err);
      setError(err.response?.data?.message || 'Failed to update mobile number. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || !token) {
    navigate('/login');
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
