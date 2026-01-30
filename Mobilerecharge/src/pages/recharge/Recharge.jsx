import { useState, useEffect } from 'react';
import axios from 'axios';
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
    setShowModal(true);
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
      {mobile.length === 10 && operator && (
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
        title="Confirm Recharge"
        size="small"
      >
        {selectedPlan && (
          <div className="space-y-6">
            <div className="glass-card p-4 rounded-xl">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Mobile Number</span>
                <span className="text-white font-semibold">+91 {mobile}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Operator</span>
                <span className="text-white font-semibold">{operator}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Amount</span>
                <span className="text-2xl font-bold gradient-text">₹{selectedPlan.price}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button fullWidth>
                Proceed to Payment
              </Button>
              <Button fullWidth variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Recharge;
