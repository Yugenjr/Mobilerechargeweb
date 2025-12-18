import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Users, Phone, Smartphone } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RechargeNew = () => {
  const navigate = useNavigate();
  const [rechargeType, setRechargeType] = useState('self');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [operator, setOperator] = useState('');
  const [primarySim, setPrimarySim] = useState(null);
  const [loading, setLoading] = useState(false);

  const operators = ['Jio', 'Airtel', 'Vi', 'BSNL'];

  useEffect(() => {
    if (rechargeType === 'self') {
      fetchPrimarySim();
    } else {
      setPhoneNumber('');
      setOperator('');
    }
  }, [rechargeType]);

  const fetchPrimarySim = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';
      const response = await axios.get(`${API_URL}/api/sims/primary`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success && response.data.data) {
        const sim = response.data.data;
        setPrimarySim(sim);
        setPhoneNumber(sim.mobileNumber);
        setOperator(sim.operator);
      }
    } catch (err) {
      console.error('Failed to fetch primary SIM:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (phoneNumber && operator) {
      navigate('/plans', {
        state: {
          phoneNumber,
          operator,
          rechargeType,
          simId: rechargeType === 'self' ? primarySim?._id : null
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        <Card glow>
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold gradient-text mb-2">Quick Recharge</h2>
              <p className="text-gray-400">Recharge for yourself or a friend</p>
            </div>

            {/* Recharge Type Selector */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setRechargeType('self')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  rechargeType === 'self'
                    ? 'border-cyan-500 bg-cyan-500/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <User className={`w-8 h-8 mx-auto mb-3 ${
                  rechargeType === 'self' ? 'text-cyan-400' : 'text-gray-400'
                }`} />
                <span className="text-white font-semibold block">Self Recharge</span>
                <span className="text-xs text-gray-400">Use your number</span>
              </button>

              <button
                onClick={() => setRechargeType('friend')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  rechargeType === 'friend'
                    ? 'border-cyan-500 bg-cyan-500/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <Users className={`w-8 h-8 mx-auto mb-3 ${
                  rechargeType === 'friend' ? 'text-cyan-400' : 'text-gray-400'
                }`} />
                <span className="text-white font-semibold block">For Friend</span>
                <span className="text-xs text-gray-400">Enter their number</span>
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader />
              </div>
            ) : rechargeType === 'self' && primarySim ? (
              <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">Recharging for</p>
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-xl font-semibold text-white">{primarySim.mobileNumber}</p>
                    <p className="text-sm text-cyan-400">{primarySim.operator}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {rechargeType === 'self' ? 'Your Mobile Number' : "Friend's Mobile Number"}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter 10-digit mobile number"
                      className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                      maxLength="10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Operator
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {operators.map((op) => (
                      <button
                        key={op}
                        onClick={() => setOperator(op)}
                        className={`p-3 rounded-xl border-2 font-medium transition-all ${
                          operator === op
                            ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                            : 'border-gray-700 text-gray-300 hover:border-gray-600'
                        }`}
                      >
                        {op}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleContinue}
              disabled={!phoneNumber || !operator || loading}
              className="w-full"
            >
              Continue to Plans
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default RechargeNew;
