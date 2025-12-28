import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { colors } from '../theme';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'buy' | 'sell' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const variantStyles = {
  primary: {
    background: colors.gradients.primary,
    color: colors.background.primary,
    border: 'none',
    hoverBg: colors.gradients.primaryDark,
    shadow: colors.shadows.button,
  },
  secondary: {
    background: 'rgba(0, 255, 136, 0.1)',
    color: colors.primary[400],
    border: `1px solid ${colors.glass.border}`,
    hoverBg: 'rgba(0, 255, 136, 0.15)',
    shadow: 'none',
  },
  ghost: {
    background: 'transparent',
    color: colors.text.secondary,
    border: 'none',
    hoverBg: 'rgba(0, 255, 136, 0.06)',
    shadow: 'none',
  },
  outline: {
    background: 'transparent',
    color: colors.primary[400],
    border: `1px solid ${colors.primary[400]}`,
    hoverBg: 'rgba(0, 255, 136, 0.08)',
    shadow: 'none',
  },
  danger: {
    background: colors.status.error,
    color: colors.text.primary,
    border: 'none',
    hoverBg: '#e63e4c',
    shadow: '0 0 20px rgba(255, 51, 102, 0.3)',
  },
  buy: {
    background: colors.trading.buyGradient,
    color: colors.background.primary,
    border: 'none',
    hoverBg: '#00e67a',
    shadow: colors.trading.buyGlow,
  },
  sell: {
    background: colors.trading.sellGradient,
    color: colors.text.primary,
    border: 'none',
    hoverBg: '#e63e4c',
    shadow: colors.trading.sellGlow,
  },
  glass: {
    background: 'linear-gradient(145deg, rgba(0, 255, 136, 0.08) 0%, rgba(0, 0, 0, 0.35) 100%)',
    color: colors.text.primary,
    border: `1px solid ${colors.glass.border}`,
    hoverBg: 'linear-gradient(145deg, rgba(0, 255, 136, 0.12) 0%, rgba(0, 0, 0, 0.4) 100%)',
    shadow: 'none',
  },
};

const sizeStyles = {
  sm: {
    padding: '8px 16px',
    fontSize: '13px',
    borderRadius: '8px',
    height: '36px',
  },
  md: {
    padding: '10px 20px',
    fontSize: '14px',
    borderRadius: '10px',
    height: '44px',
  },
  lg: {
    padding: '14px 28px',
    fontSize: '15px',
    borderRadius: '12px',
    height: '52px',
  },
  xl: {
    padding: '18px 36px',
    fontSize: '16px',
    borderRadius: '14px',
    height: '60px',
  },
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  style,
  ...props
}) => {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <motion.button
      whileHover={{
        scale: disabled ? 1 : 1.02,
        boxShadow: disabled ? 'none' : colors.shadows.buttonHover,
      }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontWeight: 600,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        width: fullWidth ? '100%' : 'auto',
        background: variantStyle.background,
        color: variantStyle.color,
        border: variantStyle.border,
        boxShadow: variantStyle.shadow,
        transition: 'all 0.2s ease',
        fontFamily: "'Inter', sans-serif",
        letterSpacing: '0.02em',
        backdropFilter: variant === 'glass' ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: variant === 'glass' ? 'blur(12px)' : 'none',
        ...sizeStyle,
        ...style,
      }}
      {...props}
    >
      {loading ? (
        <LoadingSpinner size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} />
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </motion.button>
  );
};

// Loading spinner component
const LoadingSpinner: React.FC<{ size: number }> = ({ size }) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    style={{
      width: size,
      height: size,
      border: '2px solid transparent',
      borderTopColor: 'currentColor',
      borderRadius: '50%',
    }}
  />
);

// Icon Button variant
interface IconButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  icon: React.ReactNode;
  variant?: 'ghost' | 'outline' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  tooltip?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = 'ghost',
  size = 'md',
  style,
  ...props
}) => {
  const sizes = {
    sm: { size: '32px', iconSize: '16px' },
    md: { size: '40px', iconSize: '20px' },
    lg: { size: '48px', iconSize: '24px' },
  };

  const variants = {
    ghost: {
      background: 'transparent',
      border: 'none',
    },
    outline: {
      background: 'transparent',
      border: `1px solid ${colors.glass.border}`,
    },
    filled: {
      background: 'linear-gradient(145deg, rgba(0, 255, 136, 0.06) 0%, rgba(0, 0, 0, 0.3) 100%)',
      border: `1px solid ${colors.glass.border}`,
    },
  };

  return (
    <motion.button
      whileHover={{
        scale: 1.05,
        background: 'linear-gradient(145deg, rgba(0, 255, 136, 0.08) 0%, rgba(0, 0, 0, 0.25) 100%)',
        boxShadow: '0 0 15px rgba(0, 255, 136, 0.1)',
      }}
      whileTap={{ scale: 0.95 }}
      style={{
        width: sizes[size].size,
        height: sizes[size].size,
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: colors.text.secondary,
        transition: 'all 0.2s ease',
        ...variants[variant],
        ...style,
      }}
      {...props}
    >
      {icon}
    </motion.button>
  );
};

// Floating Action Button
interface FABProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  icon: React.ReactNode;
  label?: string;
  variant?: 'primary' | 'secondary';
}

export const FAB: React.FC<FABProps> = ({
  icon,
  label,
  variant = 'primary',
  style,
  ...props
}) => {
  const isPrimary = variant === 'primary';

  return (
    <motion.button
      whileHover={{
        scale: 1.05,
        boxShadow: isPrimary ? colors.shadows.glowLg : colors.shadows.glowCyan,
      }}
      whileTap={{ scale: 0.95 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: label ? '10px' : '0',
        padding: label ? '14px 24px' : '16px',
        borderRadius: label ? '100px' : '16px',
        background: isPrimary ? colors.gradients.primary : colors.gradients.buttonGlass,
        color: colors.background.primary,
        border: 'none',
        fontWeight: 600,
        fontSize: '14px',
        cursor: 'pointer',
        boxShadow: colors.shadows.button,
        transition: 'all 0.2s ease',
        ...style,
      }}
      {...props}
    >
      {icon}
      {label && <span>{label}</span>}
    </motion.button>
  );
};

export default Button;
