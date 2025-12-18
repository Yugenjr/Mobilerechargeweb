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
      const token = localStorage.getItem('authToken');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';
      
      console.log('🔍 Fetching dashboard data...');
      console.log('📍 API URL:', API_URL);
      console.log('🎫 Token:', token ? 'Present' : 'Missing');
      
      const response = await axios.get(`${API_URL}/api/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
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
          balance: 150
        });
      }
    } catch (err) {
      console.error('❌ Dashboard fetch error:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      // Use fallback data from localStorage
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (storedUser.name || storedUser.email) {
        console.log('📦 Using fallback data from localStorage');
        setUserData({
          name: storedUser.name || storedUser.email || 'User',
          mobile: storedUser.mobile || 'Not set',
          plan: 'No Active Plan',
          dataUsed: 0,
          dataTotal: 100,
          validity: 'N/A',
          balance: 0
        });
      } else {
        setError('Failed to load dashboard data. Please try logging in again.');
      }
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
    { icon: Smartphone, label: 'Recharge', color: 'neon-blue', path: '/recharge' },
    { icon: Wifi, label: 'Plans', color: 'neon-purple', path: '/recharge' },
    { icon: DollarSign, label: 'Pay Bills', color: 'neon-pink', path: '/payments' },
    { icon: Zap, label: 'Usage', color: 'neon-cyan', path: '/usage' },
  ];

  const offers = [
    { title: 'Get ₹50 Cashback', desc: 'On recharge above ₹599', badge: 'NEW' },
    { title: 'Unlimited 5G Data', desc: 'Available now in your city', badge: 'HOT' },
    { title: 'Double Data Offer', desc: 'Valid for next 3 days', badge: 'LIMITED' },
  ];

  const dataPercentage = (userData.dataUsed / userData.dataTotal) * 100;

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card glow className="bg-gradient-neon">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Hello, {userData.name}! 👋
            </h2>
            <p className="text-white/80">
              {userData.mobile ? `+91 ${userData.mobile}` : 'Welcome to RechargeX'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/80">Balance</p>
            <p className="text-2xl font-bold text-white">₹{userData.balance}</p>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              hover
              onClick={() => navigate(action.path)}
              className="text-center"
            >
              <div className={`w-14 h-14 mx-auto mb-3 bg-${action.color}/10 rounded-xl flex items-center justify-center`}>
                <action.icon className={`w-7 h-7 text-${action.color}`} />
              </div>
              <p className="font-semibold text-white">{action.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Current Plan Card */}
      <Card glow>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Current Plan</h3>
          <span className="px-3 py-1 bg-neon-blue/20 text-neon-blue rounded-full text-sm font-semibold">
            Active
          </span>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Plan Name</span>
              <span className="font-semibold text-white">{userData.plan}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Validity</span>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-neon-pink" />
                <span className="font-semibold text-white">{userData.validity}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Data Used</span>
              <span className="text-white font-semibold">
                {userData.dataUsed} GB / {userData.dataTotal} GB
              </span>
            </div>
            <div className="w-full h-3 bg-dark-hover rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${dataPercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-neon rounded-full"
              />
            </div>
          </div>

          <Button fullWidth onClick={() => navigate('/recharge')}>
            Recharge Now
          </Button>
        </div>
      </Card>

      {/* Offers Carousel */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Exclusive Offers</h3>
          <button className="text-neon-blue text-sm font-semibold">View All</button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {offers.map((offer, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="relative overflow-hidden">
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 bg-neon-pink text-white text-xs font-bold rounded">
                    {offer.badge}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-neon rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{offer.title}</h4>
                    <p className="text-sm text-gray-400">{offer.desc}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
