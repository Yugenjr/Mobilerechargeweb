import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Zap, Calendar, Wifi, Phone } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import axios from 'axios';

const PlansNew = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { phoneNumber, operator, rechargeType, simId } = location.state || {};
  
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlans();
  }, [simId]);

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (simId) {
        // Fetch SIM-specific plans
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';
        const response = await axios.get(`${API_URL}/api/plans/${simId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setPlans(response.data.data);
        }
      } else {
        // Use default plans for friend recharge
        setPlans([
          {
            _id: 'default-1',
            name: 'Basic',
            price: 199,
            validity: '28 Days',
            benefits: { data: '1.5GB/Day', calls: 'Unlimited', sms: '100/Day' },
            popular: false,
          },
          {
            _id: 'default-2',
            name: 'Popular',
            price: 299,
            validity: '28 Days',
            benefits: { data: '2GB/Day', calls: 'Unlimited', sms: '100/Day' },
            popular: true,
          },
          {
            _id: 'default-3',
            name: 'Premium',
            price: 599,
            validity: '84 Days',
            benefits: { data: '2GB/Day', calls: 'Unlimited', sms: '100/Day' },
            popular: false,
          },
        ]);
      }
    } catch (err) {
      console.error('Failed to fetch plans:', err);
      setError('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const handleRecharge = async () => {
    if (!selectedPlan) return;

    setSubmitting(true);
    setError('');
    
    try {
      const token = localStorage.getItem('authToken');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';
      const response = await axios.post(`${API_URL}/api/payments/recharge`, {
        simId: rechargeType === 'self' ? simId : null,
        planId: selectedPlan._id,
        amount: selectedPlan.price,
        rechargeType,
        friendMobile: rechargeType === 'friend' ? phoneNumber : null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        navigate('/payment-history', {
          state: {
            success: true,
            payment: response.data.data,
            phoneNumber,
            operator
          }
        });
      }
    } catch (err) {
      console.error('Recharge failed:', err);
      setError(err.response?.data?.message || 'Recharge failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <Card glow>
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold gradient-text mb-2">Select a Plan</h2>
              <div className="flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>{phoneNumber} • {operator}</span>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <motion.div
                  key={plan._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setSelectedPlan(plan)}
                  className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPlan?._id === plan._id
                      ? 'border-cyan-500 bg-cyan-500/10 scale-105'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 right-4 px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-xs font-bold">
                      POPULAR
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                      <p className="text-3xl font-bold text-cyan-400">₹{plan.price}</p>
                    </div>
                    {selectedPlan?._id === plan._id && (
                      <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      <span>{plan.validity}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <Wifi className="w-4 h-4 text-cyan-400" />
                      <span>{plan.benefits?.data || 'Data included'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      <span>{plan.benefits?.calls || 'Unlimited'} Calls</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <Check className="w-4 h-4 text-cyan-400" />
                      <span>{plan.benefits?.sms || '100/Day'} SMS</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button
              onClick={handleRecharge}
              disabled={!selectedPlan || submitting}
              className="w-full"
            >
              {submitting ? 'Processing...' : `Proceed to Pay ₹${selectedPlan?.price || 0}`}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default PlansNew;
