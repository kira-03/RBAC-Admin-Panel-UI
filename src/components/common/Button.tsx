import React from 'react';
import { clsx } from 'clsx';
import { motion, MotionProps } from 'framer-motion';

// Define button styles dynamically based on the variant and size props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) => {
  return (
    //custom button components
    <motion.button
      className={clsx(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        {
          'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
          'bg-gray-100 text-gray-700 hover:bg-gray-200': variant === 'secondary',
          'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
          'px-2.5 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-sm': size === 'md',
          'px-6 py-3 text-base': size === 'lg',
        },
        className
      )}
      whileHover={{ scale: 1.1, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}
      whileTap={{ scale: 0.95, rotate: 15 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      {...(props as MotionProps)} // Type cast here to allow passing of all props
    >
      {children}
    </motion.button>
  );
};

export default Button;
