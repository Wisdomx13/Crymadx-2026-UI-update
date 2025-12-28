import React, { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Search, X } from 'lucide-react';
import { useThemeMode } from '../theme/ThemeContext';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'flushed';
  fullWidth?: boolean;
}

const sizeStyles = {
  sm: { height: '40px', fontSize: '13px', padding: '8px 12px', borderRadius: '8px' },
  md: { height: '48px', fontSize: '14px', padding: '12px 16px', borderRadius: '10px' },
  lg: { height: '56px', fontSize: '15px', padding: '14px 20px', borderRadius: '12px' },
};

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  size = 'md',
  variant = 'default',
  fullWidth = true,
  type,
  style,
  ...props
}, ref) => {
  const { colors, isDark } = useThemeMode();
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const sizeStyle = sizeStyles[size];
  const isPassword = type === 'password';

  // Theme-aware backgrounds
  const inputBg = isDark
    ? 'rgba(10, 14, 20, 0.7)'
    : 'rgba(255, 255, 255, 0.95)';

  const focusShadow = isDark
    ? `0 0 0 3px rgba(2, 192, 118, 0.1), ${colors.shadows.glow}`
    : `0 0 0 3px rgba(16, 185, 129, 0.15), ${colors.shadows.glow}`;

  return (
    <div style={{ width: fullWidth ? '100%' : 'auto', ...style }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 600,
          color: error ? colors.status.error : colors.text.secondary,
          marginBottom: '8px',
          letterSpacing: '0.02em',
        }}>
          {label}
        </label>
      )}

      <motion.div
        animate={{
          borderColor: error
            ? colors.status.error
            : focused
              ? colors.primary[400]
              : colors.glass.border,
          boxShadow: focused ? focusShadow : isDark ? 'none' : colors.shadows.card,
        }}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          background: inputBg,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: `1px solid ${colors.glass.border}`,
          borderRadius: sizeStyle.borderRadius,
          transition: 'all 0.2s ease',
        }}
      >
        {leftIcon && (
          <span style={{
            position: 'absolute',
            left: '14px',
            color: focused ? colors.primary[400] : colors.text.tertiary,
            display: 'flex',
            transition: 'color 0.2s ease',
          }}>
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          type={isPassword && showPassword ? 'text' : type}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            height: sizeStyle.height,
            padding: sizeStyle.padding,
            paddingLeft: leftIcon ? '44px' : sizeStyle.padding,
            paddingRight: (rightIcon || isPassword) ? '44px' : sizeStyle.padding,
            fontSize: sizeStyle.fontSize,
            fontFamily: "'Inter', sans-serif",
            color: colors.text.primary,
            background: 'transparent',
            border: 'none',
            outline: 'none',
          }}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '14px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: focused ? colors.primary[400] : colors.text.tertiary,
              display: 'flex',
              padding: 0,
              transition: 'color 0.2s ease',
            }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        {rightIcon && !isPassword && (
          <span style={{
            position: 'absolute',
            right: '14px',
            color: colors.text.tertiary,
            display: 'flex',
          }}>
            {rightIcon}
          </span>
        )}
      </motion.div>

      {(error || hint) && (
        <p style={{
          fontSize: '12px',
          marginTop: '6px',
          color: error ? colors.status.error : colors.text.tertiary,
        }}>
          {error || hint}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Search Input
interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'rightIcon'> {
  onClear?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onClear,
  ...props
}) => {
  const { colors } = useThemeMode();

  return (
    <Input
      leftIcon={<Search size={18} />}
      rightIcon={
        value ? (
          <button
            onClick={onClear}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: colors.text.tertiary,
              display: 'flex',
              padding: 0,
            }}
          >
            <X size={16} />
          </button>
        ) : undefined
      }
      placeholder="Search..."
      value={value}
      {...props}
    />
  );
};

// Number Input for trading
interface NumberInputProps extends Omit<InputProps, 'type'> {
  currency?: string;
  showControls?: boolean;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  currency,
  showControls,
  onIncrement,
  onDecrement,
  ...props
}) => {
  const { colors, isDark } = useThemeMode();
  const controlBg = isDark ? 'rgba(2, 192, 118, 0.1)' : 'rgba(16, 185, 129, 0.1)';

  return (
    <div style={{ position: 'relative' }}>
      <Input
        type="number"
        rightIcon={currency ? (
          <span style={{
            fontSize: '13px',
            fontWeight: 600,
            color: colors.primary[400],
          }}>
            {currency}
          </span>
        ) : undefined}
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
        {...props}
      />
      {showControls && (
        <div style={{
          position: 'absolute',
          right: currency ? '60px' : '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}>
          <button
            onClick={onIncrement}
            style={{
              width: '20px',
              height: '14px',
              background: controlBg,
              border: `1px solid ${colors.glass.border}`,
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '10px',
              color: colors.text.secondary,
            }}
          >
            +
          </button>
          <button
            onClick={onDecrement}
            style={{
              width: '20px',
              height: '14px',
              background: controlBg,
              border: `1px solid ${colors.glass.border}`,
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '10px',
              color: colors.text.secondary,
            }}
          >
            -
          </button>
        </div>
      )}
    </div>
  );
};

// Select Input
interface SelectInputProps {
  label?: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select...',
  size = 'md',
  fullWidth = true,
}) => {
  const { colors, isDark } = useThemeMode();
  const sizeStyle = sizeStyles[size];
  const selectBg = isDark ? 'rgba(10, 14, 20, 0.7)' : 'rgba(255, 255, 255, 0.95)';

  return (
    <div style={{ width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 600,
          color: colors.text.secondary,
          marginBottom: '8px',
          letterSpacing: '0.02em',
        }}>
          {label}
        </label>
      )}
      <div style={{
        position: 'relative',
        background: selectBg,
        backdropFilter: 'blur(12px)',
        border: `1px solid ${colors.glass.border}`,
        borderRadius: sizeStyle.borderRadius,
        boxShadow: isDark ? 'none' : colors.shadows.card,
      }}>
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          style={{
            width: '100%',
            height: sizeStyle.height,
            padding: sizeStyle.padding,
            paddingRight: '40px',
            fontSize: sizeStyle.fontSize,
            fontFamily: "'Inter', sans-serif",
            color: value ? colors.text.primary : colors.text.tertiary,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            appearance: 'none',
          }}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: colors.background.secondary }}>
              {opt.label}
            </option>
          ))}
        </select>
        <span style={{
          position: 'absolute',
          right: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: colors.text.tertiary,
          pointerEvents: 'none',
        }}>
          ▼
        </span>
      </div>
    </div>
  );
};

export default Input;
