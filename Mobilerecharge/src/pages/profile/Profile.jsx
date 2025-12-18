import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, MapPin, Bell, Moon, LogOut, Edit, Shield } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [linkedNumbers, setLinkedNumbers] = useState([]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';
      
      const response = await axios.get(`${API_URL}/api/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 30000
      });

      if (response.data.success) {
        const { user: apiUser, sims } = response.data.data;
        setUser({
          name: apiUser.name || storedUser.name || 'User',
          mobile: apiUser.mobile || sims[0]?.mobileNumber || '',
          email: apiUser.email || storedUser.email || '',
          address: 'India',
          memberSince: 'Dec 2024',
          avatar: (apiUser.name || 'U').substring(0, 2).toUpperCase()
        });
        setLinkedNumbers(sims.map(sim => ({
          number: sim.mobileNumber,
          operator: sim.operator,
          primary: sim.isPrimary
        })));
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      // Fallback to localStorage
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      setUser({
        name: storedUser.name || 'User',
        mobile: storedUser.mobile || '',
        email: storedUser.email || '',
        address: 'India',
        memberSince: 'Dec 2024',
        avatar: (storedUser.name || 'U').substring(0, 2).toUpperCase()
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return <div className="text-white">Unable to load profile</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold gradient-text">Profile & Settings</h1>

      {/* Profile Card */}
      <Card glow>
        <div className="flex items-center gap-6 flex-wrap">
          <div className="w-24 h-24 bg-gradient-neon rounded-full flex items-center justify-center text-3xl font-bold text-white">
            {user.avatar}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
            <p className="text-gray-400 mb-2">Member since {user.memberSince}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+91 {user.mobile}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{user.address}</span>
              </div>
            </div>
          </div>
          <Button icon={Edit}>
            Edit Profile
          </Button>
        </div>
      </Card>

      {/* Linked Numbers */}
      <Card>
        <h3 className="text-xl font-bold text-white mb-4">Linked Mobile Numbers</h3>
        <div className="space-y-3">
          {linkedNumbers.map((num, index) => (
            <motion.div
              key={num.number}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-4 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neon-blue/10 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-neon-blue" />
                </div>
                <div>
                  <p className="text-white font-semibold">+91 {num.number}</p>
                  <p className="text-sm text-gray-400">{num.operator}</p>
                </div>
              </div>
              {num.primary && (
                <span className="px-3 py-1 bg-neon-blue/20 text-neon-blue rounded-full text-xs font-bold">
                  PRIMARY
                </span>
              )}
            </motion.div>
          ))}
          <Button fullWidth variant="secondary">
            + Add New Number
          </Button>
        </div>
      </Card>

      {/* Settings */}
      <Card>
        <h3 className="text-xl font-bold text-white mb-4">Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 glass-card rounded-xl">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-neon-cyan" />
              <div>
                <p className="text-white font-semibold">Notifications</p>
                <p className="text-sm text-gray-400">Receive updates & offers</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-14 h-8 rounded-full transition-all ${
                notifications ? 'bg-neon-blue' : 'bg-gray-600'
              }`}
            >
              <motion.div
                animate={{ x: notifications ? 24 : 4 }}
                className="w-6 h-6 bg-white rounded-full shadow-lg"
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 glass-card rounded-xl">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-neon-purple" />
              <div>
                <p className="text-white font-semibold">Dark Mode</p>
                <p className="text-sm text-gray-400">Currently enabled</p>
              </div>
            </div>
            <div className="px-3 py-1 bg-neon-purple/20 text-neon-purple rounded-full text-xs font-bold">
              ON
            </div>
          </div>

          <div className="flex items-center justify-between p-4 glass-card rounded-xl">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-neon-pink" />
              <div>
                <p className="text-white font-semibold">Security</p>
                <p className="text-sm text-gray-400">Manage security settings</p>
              </div>
            </div>
            <Button variant="secondary">
              Configure
            </Button>
          </div>
        </div>
      </Card>

      {/* Logout */}
      <Card hover onClick={handleLogout} className="cursor-pointer bg-red-500/10 border-red-500/30 hover:border-red-500/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-red-500 font-semibold">Logout</p>
              <p className="text-sm text-gray-400">Sign out from your account</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
