import { Bell, Menu } from 'lucide-react';
import { useState } from 'react';

const Topbar = () => {
  const [notifications] = useState(3);

  return (
    <div className="lg:pl-64">
      <div className="glass-card rounded-none border-b border-white/10 px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <button className="lg:hidden text-gray-400 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex-1 px-4">
            <h1 className="text-xl font-semibold text-white">Welcome Back!</h1>
            <p className="text-sm text-gray-400">Manage your recharges & plans</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="w-6 h-6" />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-neon-pink text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-neon flex items-center justify-center font-bold">
                JD
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
