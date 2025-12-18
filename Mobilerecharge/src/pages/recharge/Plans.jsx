import { motion } from 'framer-motion';
import { Star, Zap, Infinity } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const Plans = () => {
  const featuredPlans = [
    {
      id: 1,
      name: 'Starter Pack',
      price: 239,
      data: '1.5 GB/day',
      validity: '28 Days',
      features: ['Unlimited Calls', '100 SMS/day', '4G Data'],
      badge: 'Popular',
      color: 'neon-blue'
    },
    {
      id: 2,
      name: 'Power User',
      price: 299,
      data: '2 GB/day',
      validity: '28 Days',
      features: ['Unlimited Calls', '100 SMS/day', 'Premium Support'],
      badge: 'Recommended',
      color: 'neon-pink'
    },
    {
      id: 3,
      name: 'Unlimited Pro',
      price: 599,
      data: 'Unlimited 5G',
      validity: '56 Days',
      features: ['Unlimited Everything', 'Premium Apps', 'Priority Support'],
      badge: 'Best Value',
      color: 'neon-purple'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">Choose Your Plan</h1>
        <p className="text-gray-400">Select the perfect plan for your needs</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {featuredPlans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover glow className="relative h-full">
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 bg-${plan.color}/20 text-${plan.color} rounded-full text-xs font-bold`}>
                  {plan.badge}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold gradient-text">₹{plan.price}</span>
                  <span className="text-gray-400">/{plan.validity}</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-neon-cyan" />
                  <span className="text-lg font-semibold text-white">{plan.data}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-300">
                    <div className="w-1.5 h-1.5 bg-neon-blue rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button fullWidth>
                Select Plan
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Plans;
