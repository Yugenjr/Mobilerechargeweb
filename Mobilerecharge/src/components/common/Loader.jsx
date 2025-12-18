import { motion } from 'framer-motion';

const Loader = ({ size = 'medium', fullScreen = false }) => {
  const sizeClass = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  }[size];

  const loader = (
    <div className="flex items-center justify-center">
      <motion.div
        className={`${sizeClass} border-4 border-neon-blue/30 border-t-neon-blue rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-dark-bg/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">
          {loader}
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return loader;
};

export default Loader;
