import { useState } from 'react';
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

  const operators = ['Jio', 'Airtel', 'Vi', 'BSNL'];
  
  const tabs = [
    { id: 'popular', label: 'Popular', icon: Star },
    { id: 'data', label: 'Data', icon: Zap },
    { id: 'unlimited', label: 'Unlimited', icon: Infinity },
    { id: 'validity', label: 'Validity', icon: Calendar },
  ];

  const plans = {
    popular: [
      { id: 1, amount: 239, data: '1.5 GB/day', validity: '28 Days', calls: 'Unlimited', sms: '100/day' },
      { id: 2, amount: 299, data: '2 GB/day', validity: '28 Days', calls: 'Unlimited', sms: '100/day' },
      { id: 3, amount: 479, data: '1.5 GB/day', validity: '56 Days', calls: 'Unlimited', sms: '100/day' },
      { id: 4, amount: 666, data: '2 GB/day', validity: '84 Days', calls: 'Unlimited', sms: '100/day' },
    ],
    data: [
      { id: 5, amount: 155, data: '1 GB/day', validity: '24 Days', calls: 'Unlimited', sms: '100/day' },
      { id: 6, amount: 299, data: '2 GB/day', validity: '28 Days', calls: 'Unlimited', sms: '100/day' },
      { id: 7, amount: 719, data: '2 GB/day', validity: '84 Days', calls: 'Unlimited', sms: '100/day' },
    ],
    unlimited: [
      { id: 8, amount: 299, data: 'Unlimited 5G', validity: '28 Days', calls: 'Unlimited', sms: 'Unlimited' },
      { id: 9, amount: 599, data: 'Unlimited 5G', validity: '56 Days', calls: 'Unlimited', sms: 'Unlimited' },
    ],
    validity: [
      { id: 10, amount: 1559, data: '2 GB/day', validity: '365 Days', calls: 'Unlimited', sms: '100/day' },
      { id: 11, amount: 2999, data: 'Unlimited 5G', validity: '365 Days', calls: 'Unlimited', sms: 'Unlimited' },
    ],
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
                  className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                    operator === op
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
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                    activeTab === tab.id
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
            {plans[activeTab].map((plan) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: plan.id * 0.05 }}
              >
                <Card hover onClick={() => handlePlanSelect(plan)}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">₹{plan.amount}</h3>
                      <p className="text-sm text-gray-400">Validity: {plan.validity}</p>
                    </div>
                    <div className="px-3 py-1 bg-neon-blue/20 text-neon-blue rounded-full text-xs font-bold">
                      BEST
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-neon-cyan" />
                      <span className="text-sm text-gray-300">{plan.data}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-neon-pink" />
                      <span className="text-sm text-gray-300">{plan.calls} Calls</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-neon-purple" />
                      <span className="text-sm text-gray-300">{plan.sms} SMS</span>
                    </div>
                  </div>

                  <Button fullWidth variant="secondary">
                    Select Plan
                  </Button>
                </Card>
              </motion.div>
            ))}
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
                <span className="text-2xl font-bold gradient-text">₹{selectedPlan.amount}</span>
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
