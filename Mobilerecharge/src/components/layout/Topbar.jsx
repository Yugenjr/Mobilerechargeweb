import { Bell, Menu } from 'lucide-react';
import { useState } from 'react';

const Topbar = () => {
  const [notifications] = useState(3);

  return (
    <div className="lg:pl-64 flex flex-col">
      <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 items-center gap-x-4 border-b border-dark-border bg-dark-bg/80 px-4 shadow-sm backdrop-blur-md sm:gap-x-6 sm:px-6 lg:px-8">
        <button className="lg:hidden -m-2.5 p-2.5 text-dark-text-secondary hover:text-dark-text-primary">
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
            {/* Notifications */}
            <button className="relative -m-2.5 p-2.5 text-dark-text-secondary hover:text-dark-text-primary transition-colors">
              <span className="sr-only">View notifications</span>
              <Bell className="w-6 h-6" />
              {notifications > 0 && (
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-critical-red ring-2 ring-dark-bg" />
              )}
            </button>

            {/* Separator */}
            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-dark-border" aria-hidden="true" />

            {/* Profile */}
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="flex items-center gap-x-3">
                <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-bold text-white shadow-glow-sm">
                  JD
                </div>
                <span className="hidden lg:flex lg:items-center">
                  <span className="text-sm font-semibold leading-6 text-dark-text-primary" aria-hidden="true">John Doe</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
