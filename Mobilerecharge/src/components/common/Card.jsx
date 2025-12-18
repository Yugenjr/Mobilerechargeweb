import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  glow = false,
  onClick 
}) => {
  const cardClass = hover ? 'glass-card-hover cursor-pointer' : 'glass-card';
  const glowClass = glow ? 'card-glow' : '';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -5 } : {}}
      onClick={onClick}
      className={`${cardClass} ${glowClass} ${className} p-6`}
    >
      {children}
    </motion.div>
  );
};

export default Card;
