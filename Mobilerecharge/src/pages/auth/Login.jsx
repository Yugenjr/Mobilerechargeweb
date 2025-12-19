import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { signInWithGoogle, sendOTP, initRecaptcha, clearRecaptcha } from '../../services/authHandlers';
import { verifyGoogleAuth } from '../../services/api';
import { validateSession, saveSession } from '../../utils/sessionManager';

const Login = () => {
  const [mobile, setMobile] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('✅ Login component mounted');
    console.log('otpLoading:', otpLoading, 'googleLoading:', googleLoading);
    
    // Check if already authenticated using session manager
    const session = validateSession();
    
    if (session.isValid) {
      console.log('🔄 Valid session found');
      if (session.needsOnboarding) {
        console.log('⚠️ User needs onboarding, redirecting...');
        navigate('/onboarding', { replace: true });
        return;
      } else {
        console.log('✅ Session complete, redirecting to dashboard');
        navigate('/dashboard', { replace: true });
        return;
      }
    }
    
    console.log('🔓 No valid session, initializing login...');
    // Initialize reCAPTCHA on mount
    initRecaptcha('recaptcha-container');
    
    return () => {
      // Cleanup on unmount
      clearRecaptcha();
    };
  }, [navigate]);

  const handleSendOTP = async () => {
    if (mobile.length !== 10) return;
    
    setOtpLoading(true);
    setError('');
    
    try {
      const phoneNumber = `+91${mobile}`;
      const confirmationResult = await sendOTP(phoneNumber);
      
      // Store confirmation result and navigate to OTP page
      window.confirmationResult = confirmationResult;
      navigate('/otp', { state: { mobile } });
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    console.log('🚀 === GOOGLE SIGN-IN HANDLER CALLED ===');
    setGoogleLoading(true);
    setError('');
    
    try {
      console.log('📞 Step 1: Calling signInWithGoogle()...');
      // Step 1: Google Sign-In
      const user = await signInWithGoogle();
      console.log('✅ Step 1 SUCCESS: Got user from Google:', user.email);
      console.log('User UID:', user.uid);
      console.log('User Display Name:', user.displayName);
      
      console.log('🎫 Step 2: Getting Firebase ID token...');
      // Step 2: Get Firebase token
      const firebaseToken = await user.getIdToken();
      console.log('✅ Step 2 SUCCESS: Got Firebase token (length:', firebaseToken.length, ')');
      
      console.log('� Step 3: Checking if user exists in database...');
      // Step 3: Check if user exists
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';
      
      const checkResponse = await fetch(`${API_URL}/api/auth/check-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: user.displayName
        })
      });

      const checkData = await checkResponse.json();
      console.log('✅ Step 3 SUCCESS: Check user response:', checkData);

      if (!checkData.success) {
        console.error('❌ Check user failed:', checkData.message);
        setError(checkData.message || 'Failed to verify user');
        return;
      }

      // Save user data in session
      const userData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photo: user.photoURL,
        mobile: checkData.user?.mobile || null
      };
      
      console.log('💾 Saving user session...');
      saveSession(firebaseToken, userData);

      if (checkData.isNewUser) {
        console.log('🆕 New user detected - redirecting to onboarding...');
        navigate('/onboarding', { 
          state: { 
            uid: user.uid,
            email: user.email,
            name: user.displayName
          },
          replace: true
        });
      } else {
        console.log('✅ Existing user found - navigating to dashboard...');
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      console.error('❌ GOOGLE SIGN-IN ERROR:');
      console.error('  Error object:', err);
      console.error('  Error code:', err.code);
      console.error('  Error message:', err.message);
      console.error('  Stack trace:', err.stack);
      setError(err.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setGoogleLoading(false);
      console.log('🏁 === GOOGLE SIGN-IN HANDLER ENDED ===');
    }
  };

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
          <h1 className="text-4xl font-bold gradient-text mb-2">RechargeX</h1>
          <p className="text-gray-400">Your Digital Recharge Partner</p>
        </div>

        <Card glow>
          <h2 className="text-2xl font-bold text-white mb-6">Login</h2>
          
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
                  disabled={otpLoading || googleLoading}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  +91
                </div>
              </div>
            </div>

            <Button
              fullWidth
              onClick={handleSendOTP}
              disabled={mobile.length !== 10 || otpLoading || googleLoading}
              icon={otpLoading ? null : ArrowRight}
            >
              {otpLoading ? 'Sending OTP...' : 'Send OTP'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center pointer-events-none">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">OR</span>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🖱️ Google button clicked!');
                handleGoogleSignIn();
              }}
              disabled={googleLoading}
              style={{ pointerEvents: 'auto', zIndex: 10, position: 'relative' }}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!googleLoading && (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {googleLoading ? 'Signing in...' : 'Continue with Google'}
            </button>

            <p className="text-xs text-gray-400 text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </Card>

        {/* reCAPTCHA container */}
        <div id="recaptcha-container"></div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Powered by cutting-edge technology
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
