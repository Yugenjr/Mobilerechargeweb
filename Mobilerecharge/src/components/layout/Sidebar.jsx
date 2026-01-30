import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Smartphone, BarChart3, CreditCard, User, LogOut } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/recharge', icon: Smartphone, label: 'Recharge' },
    { path: '/usage', icon: BarChart3, label: 'Usage' },
    { path: '/payments', icon: CreditCard, label: 'Payments' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-dark-bg border-r border-dark-border">
      <div className="flex-1 flex flex-col min-h-0 pt-5 pb-4">
        {/* Brand */}
        <div className="flex items-center flex-shrink-0 px-6 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center mr-3 shadow-glow-sm">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold gradient-text-primary tracking-tight">RechargeX</span>
        </div>

        {/* SIM Switcher */}
        <div className="px-6 mb-8">
          <div className="relative">
            <select className="w-full bg-dark-elevated border border-dark-border rounded-xl px-3 py-2 text-sm text-dark-text-primary focus:outline-none focus:border-primary appearance-none cursor-pointer">
              <option>Jio - 9025...</option>
              <option>Airtel - 8870...</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                      ? 'bg-gradient-primary text-white shadow-glow-sm'
                      : 'text-dark-text-secondary hover:bg-dark-elevated hover:text-dark-text-primary'
                    }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-dark-text-muted group-hover:text-primary transition-colors'}`} />
                  <span className="ml-3 font-medium tracking-wide">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 pb-6">
          <motion.div
            whileHover={{ x: 4 }}
            onClick={async () => {
              await logout();
              navigate('/login', { replace: true });
            }}
            className="flex items-center px-4 py-3 rounded-xl text-critical-red hover:bg-critical-red/10 transition-all cursor-pointer group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="ml-3 font-medium">Logout</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
