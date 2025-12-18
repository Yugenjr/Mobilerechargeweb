import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Smartphone, BarChart3, CreditCard, User, LogOut } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/recharge', icon: Smartphone, label: 'Recharge' },
    { path: '/usage', icon: BarChart3, label: 'Usage' },
    { path: '/payments', icon: CreditCard, label: 'Payments' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 glass-card rounded-none border-r border-white/10">
      <div className="flex-1 flex flex-col min-h-0 pt-5 pb-4">
        <div className="flex items-center flex-shrink-0 px-6 mb-8">
          <Smartphone className="w-8 h-8 text-neon-blue" />
          <span className="ml-3 text-2xl font-bold gradient-text">RechargeX</span>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ x: 5 }}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-neon text-white shadow-neon-blue'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="ml-3 font-medium">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>
        <div className="px-4">
          <Link to="/login">
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-3 font-medium">Logout</span>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
