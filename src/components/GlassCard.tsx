import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useThemeMode } from '../theme/ThemeContext';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'elevated' | 'prominent' | 'subtle' | 'premium' | 'liquid' | 'dark' | 'ultraGlass';
  glow?: boolean;
  glowColor?: 'green' | 'gold' | 'cyan';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  shimmer?: boolean;
  breathing?: boolean; // Enable breathing animation (auto-enabled in dark mode)
  children: React.ReactNode;
}

const paddings = {
  none: '0',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
};

export const GlassCard: React.FC<GlassCardProps> = ({
  variant = 'default',
  glow = false,
  glowColor = 'green',
  hover = true,
  padding = 'md',
  shimmer = false,
  breathing, // Default undefined - will auto-enable in dark mode
  children,
  style,
  ...props
}) => {
  const { colors, isDark } = useThemeMode();

  // Auto-enable breathing in dark mode unless explicitly disabled
  const enableBreathing = breathing !== undefined ? breathing : isDark;

  // Breathing animation variants for dark mode "alive" feel
  const breathingAnimation = enableBreathing ? {
    scale: [1, 1.005, 1],
    boxShadow: isDark ? [
      `0 4px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 255, 136, 0.05)`,
      `0 6px 35px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 255, 136, 0.12)`,
      `0 4px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 255, 136, 0.05)`,
    ] : undefined,
  } : {};

  // Theme-aware variants - Light mode: Pure white with black border
  const variants = {
    default: {
      background: isDark
        ? colors.background.card
        : '#ffffff',
      border: isDark ? colors.glass.border : '#000000',
      hoverBorder: isDark ? colors.glass.borderHover : '#000000',
      gradient: isDark ? colors.gradients.glassSurface : 'none',
    },
    elevated: {
      background: isDark
        ? colors.background.tertiary
        : '#ffffff',
      border: isDark ? colors.glass.border : '#000000',
      hoverBorder: isDark ? colors.glass.borderHover : '#000000',
      gradient: isDark ? colors.gradients.liquidGlass : 'none',
    },
    prominent: {
      background: isDark
        ? colors.background.elevated
        : '#ffffff',
      border: isDark ? colors.glass.borderHover : '#000000',
      hoverBorder: isDark ? colors.glass.borderActive : '#000000',
      gradient: isDark ? colors.gradients.liquidGlassPremium : 'none',
    },
    subtle: {
      background: isDark
        ? colors.background.secondary
        : '#ffffff',
      border: isDark ? 'rgba(255, 255, 255, 0.04)' : '#000000',
      hoverBorder: isDark ? colors.glass.border : '#000000',
      gradient: 'none',
    },
    premium: {
      background: isDark
        ? `linear-gradient(145deg, ${colors.background.elevated} 0%, ${colors.background.card} 100%)`
        : '#ffffff',
      border: isDark ? colors.glass.borderHover : '#000000',
      hoverBorder: isDark ? colors.glass.borderActive : '#000000',
      gradient: isDark ? colors.gradients.liquidGlassPremium : 'none',
    },
    liquid: {
      background: isDark
        ? colors.gradients.cardGlass
        : '#ffffff',
      border: isDark ? colors.glass.border : '#000000',
      hoverBorder: isDark ? colors.glass.borderHover : '#000000',
      gradient: isDark ? colors.gradients.liquid3D : 'none',
    },
    dark: {
      background: isDark
        ? colors.background.primary
        : '#ffffff',
      border: isDark ? colors.glass.border : '#000000',
      hoverBorder: isDark ? colors.glass.borderHover : '#000000',
      gradient: 'none',
    },
    ultraGlass: {
      background: isDark
        ? 'rgba(24, 26, 32, 0.6)'
        : '#ffffff',
      border: isDark ? 'rgba(255, 255, 255, 0.1)' : '#000000',
      hoverBorder: isDark ? 'rgba(0, 210, 106, 0.3)' : '#000000',
      gradient: isDark ? colors.gradients.liquid3D : 'none',
    },
  };

  // Theme-aware glow colors
  const glowColors = {
    green: isDark ? 'rgba(0, 210, 106, 0.15)' : 'rgba(16, 185, 129, 0.15)',
    gold: isDark ? 'rgba(240, 185, 11, 0.12)' : 'rgba(217, 119, 6, 0.12)',
    cyan: isDark ? 'rgba(0, 210, 106, 0.12)' : 'rgba(6, 182, 212, 0.12)',
  };

  const variantStyles = variants[variant];
  const selectedGlow = glowColors[glowColor];

  // Light mode: simple clean shadows, Dark mode: deep shadows
  const get3DShadow = () => {
    if (isDark) {
      return glow
        ? `0 4px 30px rgba(0, 0, 0, 0.4), 0 0 30px ${selectedGlow}`
        : '0 4px 20px rgba(0, 0, 0, 0.35)';
    }
    // Light mode: simple clean shadow
    return '0 1px 3px rgba(0, 0, 0, 0.08)';
  };

  const getHoverShadow = () => {
    if (isDark) {
      return glow
        ? `0 8px 40px rgba(0, 0, 0, 0.5), 0 0 40px ${selectedGlow}`
        : '0 8px 40px rgba(0, 0, 0, 0.5)';
    }
    // Light mode: slightly elevated shadow on hover
    return '0 4px 12px rgba(0, 0, 0, 0.1)';
  };

  // Breathing transition settings
  const breathingTransition = enableBreathing ? {
    scale: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    },
    boxShadow: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  } : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        ...breathingAnimation,
      }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
        ...breathingTransition,
      }}
      whileHover={hover ? {
        scale: 1.01,
        y: -2,
        borderColor: variantStyles.hoverBorder,
        boxShadow: getHoverShadow(),
      } : undefined}
      style={{
        position: 'relative',
        background: variantStyles.background,
        border: `1px solid ${variantStyles.border}`,
        borderRadius: '14px',
        padding: paddings[padding],
        boxShadow: get3DShadow(),
        // Remove blur effects in light mode for crystal clear look
        backdropFilter: isDark
          ? (variant === 'ultraGlass' ? 'blur(20px) saturate(180%)' : 'blur(12px)')
          : 'none',
        WebkitBackdropFilter: isDark
          ? (variant === 'ultraGlass' ? 'blur(20px) saturate(180%)' : 'blur(12px)')
          : 'none',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        overflow: 'hidden',
        willChange: enableBreathing ? 'transform, box-shadow' : undefined,
        ...style,
      }}
      {...props}
    >
      {/* Glass gradient overlay - creates depth (dark mode only) */}
      {isDark && variantStyles.gradient !== 'none' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: variantStyles.gradient,
            borderRadius: 'inherit',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Top reflection highlight - dark mode only */}
      {isDark && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: colors.glass.reflection,
            borderRadius: '16px 16px 0 0',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Top edge highlight line - dark mode only */}
      {isDark && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '15%',
            right: '15%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Left edge highlight - dark mode only */}
      {isDark && (
        <div
          style={{
            position: 'absolute',
            top: '15%',
            bottom: '15%',
            left: 0,
            width: '1px',
            background: 'linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.06), transparent)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Shimmer animation overlay - dark mode only */}
      {isDark && shimmer && (
        <motion.div
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: '200%', opacity: [0, 0.5, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 4,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Water drop reflection highlight - dark mode only */}
      {isDark && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '12px',
            width: '40%',
            height: '25%',
            background: colors.glass.waterDropSmall,
            borderRadius: '50%',
            pointerEvents: 'none',
            opacity: 0.6,
          }}
        />
      )}

      {/* Light mode - no decorative elements, keep it clean */}

      {/* Content - uses theme text colors (dark on light, light on dark) */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        color: colors.text.onCard,
      }}>
        {children}
      </div>
    </motion.div>
  );
};

// Specialized card for stats/metrics
interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  icon,
  trend = 'neutral',
}) => {
  const { colors, isDark } = useThemeMode();

  const trendColor = trend === 'up'
    ? colors.trading.buy
    : trend === 'down'
      ? colors.trading.sell
      : colors.text.secondary;

  return (
    <GlassCard
      padding="md"
      hover
      glow={trend === 'up'}
      glowColor={trend === 'up' ? 'green' : 'cyan'}
      variant={trend === 'up' ? 'prominent' : 'elevated'}
      shimmer={trend === 'up'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{
            fontSize: '11px',
            color: colors.text.tertiary,
            marginBottom: '6px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            {label}
          </p>
          <p style={{
            fontSize: '20px',
            fontWeight: 700,
            color: colors.text.primary,
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {value}
          </p>
          {change !== undefined && (
            <p style={{
              fontSize: '12px',
              color: trendColor,
              marginTop: '6px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
            }}>
              <span style={{ fontSize: '9px' }}>{trend === 'up' ? '▲' : trend === 'down' ? '▼' : '●'}</span>
              {change >= 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
        {icon && (
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: colors.trading.buyBg,
            border: `1px solid ${colors.glass.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.primary[400],
          }}>
            {icon}
          </div>
        )}
      </div>
    </GlassCard>
  );
};

// Premium Feature Card
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  const { colors, isDark } = useThemeMode();

  return (
    <GlassCard padding="md" hover variant="elevated" shimmer>
      <div style={{
        width: '42px',
        height: '42px',
        borderRadius: '12px',
        background: colors.trading.buyBg,
        border: `1px solid ${colors.glass.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: colors.primary[400],
        marginBottom: '12px',
      }}>
        {icon}
      </div>
      <h3 style={{
        fontSize: '15px',
        fontWeight: 700,
        color: colors.text.primary,
        marginBottom: '6px',
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: '13px',
        color: colors.text.tertiary,
        lineHeight: 1.5,
      }}>
        {description}
      </p>
    </GlassCard>
  );
};

// Price Card - Ultra glass style
interface PriceCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export const PriceCard: React.FC<PriceCardProps> = ({
  symbol,
  name: _name,
  price,
  change,
  icon,
  onClick,
}) => {
  const { colors, isDark } = useThemeMode();
  const isPositive = change >= 0;

  // Light mode: pure white, Dark mode: glass effect
  const cardBg = isDark
    ? colors.gradients.cardGlass
    : '#ffffff';

  // Light mode: simple shadow, Dark mode: dark shadow
  const get3DShadow = () => {
    if (isDark) {
      return `0 4px 25px rgba(0, 0, 0, 0.35)`;
    }
    return '0 1px 3px rgba(0, 0, 0, 0.08)';
  };

  const getHoverShadow = () => {
    if (isDark) {
      return '0 12px 40px rgba(0, 0, 0, 0.5)';
    }
    return '0 4px 12px rgba(0, 0, 0, 0.1)';
  };

  // Breathing animation for dark mode only
  const breathingAnimation = isDark ? {
    scale: [1, 1.004, 1],
    boxShadow: [
      `0 4px 25px rgba(0, 0, 0, 0.35)`,
      `0 5px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 255, 136, 0.08)`,
      `0 4px 25px rgba(0, 0, 0, 0.35)`,
    ],
  } : {};

  return (
    <motion.div
      animate={breathingAnimation}
      transition={isDark ? {
        scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" },
      } : {}}
      whileHover={{
        scale: 1.015,
        y: -2,
        boxShadow: getHoverShadow(),
        borderColor: isDark ? colors.glass.borderHover : '#000000',
      }}
      onClick={onClick}
      style={{
        background: cardBg,
        borderRadius: '14px',
        padding: '16px',
        cursor: 'pointer',
        border: `1px solid ${isDark ? colors.glass.border : '#000000'}`,
        transition: 'border-color 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: isDark ? 'blur(12px)' : 'none',
        boxShadow: get3DShadow(),
        willChange: isDark ? 'transform, box-shadow' : undefined,
      }}
    >
      {/* Glass overlay - dark mode only */}
      {isDark && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: colors.gradients.liquidGlass,
          pointerEvents: 'none',
        }} />
      )}

      {/* Top accent line - dark mode only */}
      {isDark && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: '15%',
          right: '15%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
          borderRadius: '2px',
          pointerEvents: 'none',
        }} />
      )}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Icon */}
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: isDark ? colors.background.elevated : '#f3f4f6',
          border: `1px solid ${isDark ? colors.glass.border : '#000000'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '10px',
        }}>
          {icon}
        </div>

        {/* Pair */}
        <p style={{
          fontSize: '13px',
          fontWeight: 700,
          color: colors.text.primary,
          marginBottom: '3px',
        }}>
          {symbol}/USDT
        </p>

        {/* Price */}
        <p style={{
          fontSize: '15px',
          fontWeight: 700,
          fontFamily: "'JetBrains Mono', monospace",
          color: colors.text.primary,
          marginBottom: '6px',
        }}>
          {price < 1 ? price.toFixed(4) : price.toLocaleString()}
        </p>

        {/* Change */}
        <p style={{
          fontSize: '12px',
          fontWeight: 600,
          color: isPositive ? colors.trading.buy : colors.trading.sell,
        }}>
          {isPositive ? '+' : ''}{change}%
        </p>
      </div>
    </motion.div>
  );
};

export default GlassCard;
