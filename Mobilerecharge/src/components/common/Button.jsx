import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = '', 
  icon: Icon,
  disabled = false,
  fullWidth = false,
  type = 'button'
}) => {
  const baseClass = fullWidth ? 'w-full' : '';
  const variantClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  
  return (
    <motion.button
      type={type}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`${variantClass} ${baseClass} ${className} flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </motion.button>
  );
};

export default Button;
