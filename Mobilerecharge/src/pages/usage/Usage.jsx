import { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Smartphone, Wifi, Clock, TrendingUp } from 'lucide-react';
import Card from '../../components/common/Card';

const Usage = () => {
  const [period, setPeriod] = useState('week');

  const dataUsage = [
    { day: 'Mon', usage: 2.5 },
    { day: 'Tue', usage: 3.2 },
    { day: 'Wed', usage: 2.8 },
    { day: 'Thu', usage: 4.1 },
    { day: 'Fri', usage: 3.5 },
    { day: 'Sat', usage: 5.2 },
    { day: 'Sun', usage: 4.8 },
  ];

  const callStats = [
    { label: 'Total Calls', value: '256', unit: 'calls', icon: Smartphone, color: 'neon-blue' },
    { label: 'Call Duration', value: '458', unit: 'mins', icon: Clock, color: 'neon-pink' },
    { label: 'Data Used', value: '45.2', unit: 'GB', icon: Wifi, color: 'neon-cyan' },
    { label: 'Avg Daily', value: '6.5', unit: 'GB/day', icon: TrendingUp, color: 'neon-purple' },
  ];

  const dailyBreakdown = [
    { app: 'YouTube', data: 12.5, color: 'bg-red-500' },
    { app: 'Instagram', data: 8.3, color: 'bg-pink-500' },
    { app: 'WhatsApp', data: 5.7, color: 'bg-green-500' },
    { app: 'Netflix', data: 10.2, color: 'bg-red-600' },
    { app: 'Others', data: 8.5, color: 'bg-gray-500' },
  ];

  const totalData = dailyBreakdown.reduce((acc, item) => acc + item.data, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold gradient-text">Usage Analytics</h1>
        <div className="flex gap-2">
          {['week', 'month', 'year'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg font-semibold capitalize transition-all ${
                period === p
                  ? 'bg-gradient-neon text-white shadow-neon-blue'
                  : 'glass-card text-gray-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {callStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover>
              <div className={`w-12 h-12 bg-${stat.color}/10 rounded-xl flex items-center justify-center mb-3`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}`} />
              </div>
              <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">{stat.value}</span>
                <span className="text-sm text-gray-400">{stat.unit}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Data Usage Chart */}
      <Card glow>
        <h3 className="text-xl font-bold text-white mb-4">Daily Data Usage</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dataUsage}>
              <defs>
                <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a2e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
              />
              <Area
                type="monotone"
                dataKey="usage"
                stroke="#00d4ff"
                fillOpacity={1}
                fill="url(#colorUsage)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* App-wise Breakdown */}
      <Card glow>
        <h3 className="text-xl font-bold text-white mb-4">App-wise Data Usage</h3>
        <div className="space-y-4">
          {dailyBreakdown.map((app, index) => {
            const percentage = (app.data / totalData) * 100;
            return (
              <motion.div
                key={app.app}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 ${app.color} rounded-full`} />
                    <span className="text-white font-medium">{app.app}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-semibold">{app.data} GB</span>
                    <span className="text-gray-400 text-sm ml-2">{percentage.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-dark-hover rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-full ${app.color}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default Usage;
