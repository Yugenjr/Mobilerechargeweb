import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Wifi, DollarSign, Zap, TrendingUp, Calendar } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const uid = storedUser.uid;

      if (!uid) {
        console.error('❌ No UID found, redirecting to login');
        navigate('/login', { replace: true });
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

      console.log('🔍 Fetching dashboard data for UID:', uid);
      console.log('📍 API URL:', API_URL);

      const response = await axios.get(`${API_URL}/api/dashboard/${uid}`, {
        timeout: 30000
      });

      console.log('✅ Dashboard response:', response.data);

      if (response.data.success) {
        const { user, currentPlan, usage, sims } = response.data.data;
        const mobileNumber = user.mobile || (sims && sims.length > 0 ? sims[0].mobileNumber : '');
        console.log('📱 User mobile:', mobileNumber);
        setUserData({
          name: user.name || 'User',
          mobile: mobileNumber,
          plan: currentPlan?.name || 'No Active Plan',
          dataUsed: usage?.dataUsed || 0,
          dataTotal: usage?.dataTotal || 100,
          validity: currentPlan?.validity || 'N/A',
          balance: 0
        });
      }
    } catch (err) {
      console.error('❌ Dashboard fetch error:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });

      setError(err.response?.data?.message || 'Failed to load dashboard data. Please try logging in again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6">
          <p className="text-red-400">{error || 'No data available'}</p>
          <Button onClick={fetchDashboardData} className="mt-4">Retry</Button>
        </Card>
      </div>
    );
  }

  const quickActions = [
    { icon: Smartphone, label: 'Recharge', color: 'primary', path: '/recharge' },
    { icon: Wifi, label: 'Plans', color: 'primary-dark', path: '/recharge' },
    { icon: DollarSign, label: 'Pay Bills', color: 'critical-red', path: '/payments' },
    { icon: Zap, label: 'Usage', color: 'accent-teal', path: '/usage' },
  ];

  const offers = [
    { title: 'Get ₹50 Cashback', desc: 'On recharge above ₹599', badge: 'NEW' },
    { title: 'Unlimited 5G Data', desc: 'Available now in your city', badge: 'HOT' },
    { title: 'Double Data Offer', desc: 'Valid for next 3 days', badge: 'LIMITED' },
  ];

  const dataPercentage = (userData.dataUsed / userData.dataTotal) * 100;

  return (
    <div className="space-y-8 pb-10">

      {/* 1. Header / Greeting Card */}
      <div className="relative overflow-hidden rounded-card premium-card p-6 md:p-8">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-dark-surface via-transparent to-transparent"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1 tracking-tight">
              Hello, {userData.name.split(' ')[0]}! <span className="animate-pulse inline-block">👋</span>
            </h2>
            <p className="text-dark-text-secondary text-base font-medium flex items-center gap-2">
              {userData.mobile ? `+91 ${userData.mobile}` : 'Welcome to RechargeX'}
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            </p>
          </div>

          <div className="bg-dark-elevated/50 backdrop-blur-sm px-5 py-3 rounded-full border border-dark-border flex items-center gap-3 shadow-sm">
            <span className="text-dark-text-secondary text-sm font-medium uppercase tracking-wider">Balance</span>
            <span className="text-xl font-bold text-white">₹{userData.balance}</span>
          </div>
        </div>
      </div>

      {/* 2. Quick Actions - 2 Row Grid */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 pl-1">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div
                onClick={() => navigate(action.path)}
                className="premium-card premium-card-hover p-4 flex flex-col items-center justify-center text-center cursor-pointer h-full group"
              >
                <div className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center bg-dark-elevated transition-colors group-hover:bg-${action.color}/10`}>
                  <action.icon className={`w-6 h-6 text-${action.color}`} />
                  {/* Note: Adjusting colors to match new theme if possible, fallback to style prop if needed */}
                </div>
                <span className="text-dark-text-primary font-medium text-sm group-hover:text-white transition-colors">
                  {action.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 3. Current Plan Section - 2/3 width */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4 pl-1">Current Plan</h3>
          <div className="premium-card p-6 h-full flex flex-col justify-between">
            {userData.plan !== 'No Active Plan' ? (
              <>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">ACTIVE</span>
                        <span className="text-dark-text-muted text-sm">Valid till 24 Oct 2026</span>
                      </div>
                      <h4 className="text-2xl font-bold text-white mb-1">{userData.plan}</h4>
                      <p className="text-dark-text-secondary text-sm max-w-sm">
                        {userData.validity} Validity • Unlimited Calls • 100 SMS/day
                      </p>
                    </div>
                  </div>

                  {/* Circular Graph */}
                  <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path className="text-dark-elevated" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                      <path
                        className="text-primary"
                        strokeDasharray={`${dataPercentage}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-xs text-dark-text-muted">Data Left</span>
                      <span className="text-sm font-bold text-white">{(userData.dataTotal - userData.dataUsed).toFixed(1)} GB</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-auto">
                  <Button fullWidth onClick={() => navigate('/recharge')}>Recharge</Button>
                  <button className="flex-1 btn-secondary text-sm">Change Plan</button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center h-full">
                <div className="w-16 h-16 bg-dark-elevated rounded-full flex items-center justify-center mb-4">
                  <Wifi className="w-8 h-8 text-dark-text-muted" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">No Active Plan</h4>
                <p className="text-dark-text-secondary text-sm mb-6 max-w-xs mx-auto">
                  You don't have any active plan currently. Recharge now to enjoy uninterrupted services.
                </p>
                <Button onClick={() => navigate('/recharge')}>View Popular Plans</Button>
              </div>
            )}
          </div>
        </div>

        {/* 4. Detailed Usage Cards - 1/3 width */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-white mb-4 pl-1">Usage Details</h3>
          <div className="space-y-4">
            {/* Data Usage */}
            <div className="premium-card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-accent-teal/10">
                    <Wifi className="w-4 h-4 text-accent-teal" />
                  </div>
                  <span className="font-medium text-dark-text-primary">Data</span>
                </div>
                <span className="text-xs text-accent-teal font-semibold">{dataPercentage.toFixed(0)}% Used</span>
              </div>
              <div className="w-full h-2 bg-dark-elevated rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${dataPercentage}%` }}
                  className="h-full bg-accent-teal rounded-full"
                />
              </div>
              <p className="text-xs text-dark-text-muted text-right">
                {userData.dataUsed} GB of {userData.dataTotal} GB
              </p>
            </div>

            {/* Validity Usage */}
            <div className="premium-card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary-dark/10">
                    <Calendar className="w-4 h-4 text-primary-dark" />
                  </div>
                  <span className="font-medium text-dark-text-primary">Validity</span>
                </div>
                <span className="text-xs text-primary-dark font-semibold is-animated">24 Days Left</span>
              </div>
              <div className="w-full h-2 bg-dark-elevated rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '40%' }}
                  className="h-full bg-primary-dark rounded-full"
                />
              </div>
              <p className="text-xs text-dark-text-muted text-right">
                Expires on 24 Oct
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Offers - Carousel */}
      <div>
        <div className="flex items-center justify-between mb-4 pl-1">
          <h3 className="text-lg font-semibold text-white">Exclusive Offers</h3>
          <button className="text-primary text-sm font-medium hover:text-primary-light transition-colors">View All</button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
          {offers.map((offer, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="min-w-[280px] md:min-w-[320px] snap-start"
            >
              <div className="premium-card premium-card-hover p-0 overflow-hidden relative group cursor-pointer h-full">
                {/* Dark Overlay with Image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 z-10"></div>
                <div className="h-32 bg-dark-elevated relative">
                  <div className="absolute top-3 left-3 z-20">
                    <span className="px-2 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold rounded uppercase tracking-wider">
                      {offer.badge}
                    </span>
                  </div>
                </div>

                <div className="p-5 relative z-20 -mt-12">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${index === 0 ? 'bg-accent-teal' : index === 1 ? 'bg-primary' : 'bg-critical-amber'} shadow-lg`}>
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold text-white mb-1 group-hover:text-primary-light transition-colors">{offer.title}</h4>
                  <p className="text-sm text-gray-300 line-clamp-1">{offer.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
