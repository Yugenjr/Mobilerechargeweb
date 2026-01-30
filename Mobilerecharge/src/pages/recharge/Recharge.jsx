import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone, Search, Zap, Infinity, Calendar, Star } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const Recharge = () => {
  const [mobile, setMobile] = useState('');
  const [operator, setOperator] = useState('');
  const [activeTab, setActiveTab] = useState('popular');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState({
    popular: [],
    data: [],
    unlimited: [],
    validity: []
  });

  const operators = ['Jio', 'Airtel', 'Vi', 'BSNL'];

  const tabs = [
    { id: 'popular', label: 'Popular', icon: Star },
    { id: 'data', label: 'Data', icon: Zap },
    { id: 'unlimited', label: 'Unlimited', icon: Infinity },
    { id: 'validity', label: 'Validity', icon: Calendar },
  ];

  useEffect(() => {
    if (operator) {
      fetchPlans(operator);
    }
  }, [operator]);

  const fetchPlans = async (selectedOperator) => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';
      const token = localStorage.getItem('authToken');

      const response = await axios.get(`${API_URL}/api/plans/${selectedOperator}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const fetchedPlans = response.data.data;

        // Categorize plans
        const categorized = {
          popular: fetchedPlans.filter(p => p.category === 'Popular'),
          data: fetchedPlans.filter(p => p.category === 'Data'),
          unlimited: fetchedPlans.filter(p => p.category === 'Unlimited'),
          validity: fetchedPlans.filter(p => p.category === 'Validity')
        };

        setPlans(categorized);
      }
    } catch (error) {
      console.error('❌ Failed to fetch plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setPaymentStep('summary');
    setShowModal(true);
  };

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const token = localStorage.getItem('authToken');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

      const payload = {
        planId: selectedPlan._id,
        amount: selectedPlan.price,
        rechargeType: mobile ? 'friend' : 'self',
        friendMobile: mobile || null
      };

      const response = await axios.post(`${API_URL}/api/payments/recharge`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setShowModal(false);
        navigate('/payments', {
          state: {
            success: true,
            payment: response.data.payment,
            planName: selectedPlan.name
          }
        });
      }
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card glow>
        <h2 className="text-2xl font-bold gradient-text mb-6">Mobile Recharge</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mobile Number
            </label>
            <div className="relative">
              <input
                type="tel"
                maxLength="10"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter mobile number"
                className="input-field pl-12"
              />
              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Operator
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {operators.map((op) => (
                <button
                  key={op}
                  onClick={() => setOperator(op)}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all ${operator === op
                    ? 'bg-gradient-neon text-white shadow-neon-blue'
                    : 'glass-card text-gray-400 hover:text-white'
                    }`}
                >
                  {op}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Plans Section */}
      {operator && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${activeTab === tab.id
                    ? 'bg-gradient-neon text-white shadow-neon-blue'
                    : 'glass-card text-gray-400 hover:text-white'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full py-10 text-center text-gray-400 animate-pulse">
                Loading plans...
              </div>
            ) : plans[activeTab]?.length > 0 ? (
              plans[activeTab].map((plan) => (
                <motion.div
                  key={plan._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 }}
                >
                  <Card hover onClick={() => handlePlanSelect(plan)}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">₹{plan.price}</h3>
                        <p className="text-sm text-gray-400">Validity: {plan.validity}</p>
                      </div>
                      {plan.popular && (
                        <div className="px-3 py-1 bg-neon-blue/20 text-neon-blue rounded-full text-xs font-bold">
                          BEST
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-neon-cyan" />
                        <span className="text-sm text-gray-300">{plan.benefits?.data || 'NA'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-neon-pink" />
                        <span className="text-sm text-gray-300">{plan.benefits?.calls || 'NA'} Calls</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-neon-purple" />
                        <span className="text-sm text-gray-300">{plan.benefits?.sms || 'NA'} SMS</span>
                      </div>
                    </div>

                    <Button fullWidth variant="secondary">
                      Select Plan
                    </Button>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-10 text-center text-gray-500">
                No plans available in this category.
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Payment Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={paymentStep === 'summary' ? "Confirm Recharge" : "Payment Details"}
        size="small"
      >
        {selectedPlan && (
          <div className="space-y-6">

            {/* Step 1: Summary */}
            {paymentStep === 'summary' && (
              <>
                <div className="glass-card p-4 rounded-xl space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mobile Number</span>
                    <span className="text-white font-semibold">+91 {mobile || 'Self'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Operator</span>
                    <span className="text-white font-semibold">{operator}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-3">
                    <span className="text-gray-400">Amount</span>
                    <span className="text-2xl font-bold gradient-text">₹{selectedPlan.price}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <Button fullWidth onClick={() => setPaymentStep('payment')}>
                    Proceed to Payment
                  </Button>
                  <Button fullWidth variant="secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                </div>
              </>
            )}

            {/* Step 2: Payment Form */}
            {paymentStep === 'payment' && (
              <div className="space-y-4">
                {/* Payment Method Tabs */}
                <div className="grid grid-cols-2 gap-2 bg-dark-bg p-1 rounded-xl">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 rounded-lg text-sm font-semibold transition-all ${paymentMethod === 'card' ? 'bg-primary text-white shadow-sm' : 'text-gray-400 hover:text-white'
                      }`}
                  >
                    Card
                  </button>
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-2 rounded-lg text-sm font-semibold transition-all ${paymentMethod === 'upi' ? 'bg-primary text-white shadow-sm' : 'text-gray-400 hover:text-white'
                      }`}
                  >
                    UPI
                  </button>
                </div>

                {paymentMethod === 'card' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Card Number</label>
                      <input type="text" placeholder="0000 0000 0000 0000" className="input-field w-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Expiry</label>
                        <input type="text" placeholder="MM/YY" className="input-field w-full" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">CVV</label>
                        <input type="text" placeholder="123" className="input-field w-full" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Name on Card</label>
                      <input type="text" placeholder="John Doe" className="input-field w-full" />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">UPI ID</label>
                    <input type="text" placeholder="username@upi" className="input-field w-full" />
                    <p className="text-xs text-gray-500 mt-2">Open your UPI app to approve the request.</p>
                  </div>
                )}

                <div className="pt-2">
                  <Button fullWidth onClick={handlePayment} disabled={processing}>
                    {processing ? 'Processing...' : `Pay ₹${selectedPlan.price}`}
                  </Button>
                </div>
              </div>
            )}

          </div>
        )}
      </Modal>
    </div>
  );
};

export default Recharge;
