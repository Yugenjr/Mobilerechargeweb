import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { sendOTP, verifyOTP } from '../../services/authHandlers';
import { verifyFirebaseToken } from '../../services/api';

const Otp = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);
  const mobile = location.state?.mobile;

  useEffect(() => {
    if (!mobile || !window.confirmationResult) {
      navigate('/login');
    }
  }, [mobile, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    setError('');
    
    try {
      const phoneNumber = `+91${mobile}`;
      const confirmationResult = await sendOTP(phoneNumber);
      window.confirmationResult = confirmationResult;
      
      setTimer(30);
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Verify OTP with Firebase
      const result = await verifyOTP(window.confirmationResult, otpValue);
      
      // Get Firebase ID token
      const firebaseToken = await result.user.getIdToken();
      
      // Send Firebase token to backend for verification and get JWT
      const response = await verifyFirebaseToken(firebaseToken, mobile);
      
      if (response.success && response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
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
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <div className="w-20 h-20 bg-gradient-neon rounded-full flex items-center justify-center">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Verify OTP</h1>
          <p className="text-gray-400">
            Enter the code sent to +91 {mobile}
          </p>
        </div>

        <Card glow>
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-6">
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 input-field text-center text-2xl font-bold"
                  disabled={loading}
                />
              ))}
            </div>

            <Button
              fullWidth
              onClick={handleVerify}
              disabled={otp.join('').length !== 6 || loading}
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </Button>

            <div className="text-center">
              {timer > 0 ? (
                <p className="text-gray-400 text-sm">
                  Resend OTP in <span className="text-neon-blue font-semibold">{timer}s</span>
                </p>
              ) : (
                <button
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="text-neon-blue text-sm font-semibold hover:underline disabled:opacity-50"
                >
                  {resending ? 'Resending...' : 'Resend OTP'}
                </button>
              )}
            </div>
          </div>
        </Card>

        {/* reCAPTCHA container for resend */}
        <div id="recaptcha-container-otp"></div>
      </motion.div>
    </div>
  );
};

export default Otp;
