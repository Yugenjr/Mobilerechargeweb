import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Smartphone, BarChart3, CreditCard, User } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/recharge', icon: Smartphone, label: 'Recharge' },
    { path: '/usage', icon: BarChart3, label: 'Usage' },
    { path: '/payments', icon: CreditCard, label: 'Payments' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 glass-card border-t border-white/10 rounded-none z-40">
      <div className="flex items-center justify-around h-16 px-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link key={item.path} to={item.path} className="flex-1">
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center justify-center py-2"
              >
                <div className={`relative ${isActive ? 'text-neon-blue' : 'text-gray-400'}`}>
                  <Icon className="w-6 h-6" />
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-neon-blue rounded-full"
                    />
                  )}
                </div>
                <span className={`text-xs mt-1 ${isActive ? 'text-neon-blue font-medium' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
