import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useThemeMode } from '../theme/ThemeContext';

// ============================================
// LIQUID GLASS 3D FLOATING OBJECTS
// Premium animated elements for visual luxury
// ============================================

// Floating liquid glass orb
interface LiquidOrbProps {
  size?: number;
  color?: 'green' | 'cyan' | 'gold' | 'white';
  delay?: number;
  duration?: number;
  style?: React.CSSProperties;
  blur?: number;
}

export const LiquidOrb: React.FC<LiquidOrbProps> = ({
  size = 80,
  color = 'green',
  delay = 0,
  duration = 8,
  style,
  blur = 0,
}) => {
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  // Dark mode: glowing neon orbs | Light mode: frosted water droplets
  const darkColorMap = {
    green: {
      gradient: 'radial-gradient(circle at 30% 30%, rgba(0, 210, 106, 0.4) 0%, rgba(0, 210, 106, 0.15) 40%, rgba(0, 210, 106, 0.05) 70%, transparent 100%)',
      glow: 'rgba(0, 210, 106, 0.3)',
      highlight: 'rgba(255, 255, 255, 0.3)',
    },
    cyan: {
      gradient: 'radial-gradient(circle at 30% 30%, rgba(0, 210, 106, 0.35) 0%, rgba(0, 210, 106, 0.12) 40%, rgba(0, 210, 106, 0.04) 70%, transparent 100%)',
      glow: 'rgba(0, 210, 106, 0.25)',
      highlight: 'rgba(255, 255, 255, 0.25)',
    },
    gold: {
      gradient: 'radial-gradient(circle at 30% 30%, rgba(240, 185, 11, 0.35) 0%, rgba(240, 185, 11, 0.12) 40%, rgba(240, 185, 11, 0.04) 70%, transparent 100%)',
      glow: 'rgba(240, 185, 11, 0.2)',
      highlight: 'rgba(255, 255, 255, 0.2)',
    },
    white: {
      gradient: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.06) 40%, rgba(255, 255, 255, 0.02) 70%, transparent 100%)',
      glow: 'rgba(255, 255, 255, 0.1)',
      highlight: 'rgba(255, 255, 255, 0.2)',
    },
  };

  // Light mode: subtle frosted glass water droplets with soft teal tints
  const lightColorMap = {
    green: {
      gradient: 'radial-gradient(circle at 30% 30%, rgba(5, 150, 105, 0.18) 0%, rgba(6, 182, 212, 0.08) 40%, rgba(5, 150, 105, 0.03) 70%, transparent 100%)',
      glow: 'rgba(5, 150, 105, 0.12)',
      highlight: 'rgba(255, 255, 255, 0.8)',
    },
    cyan: {
      gradient: 'radial-gradient(circle at 30% 30%, rgba(6, 182, 212, 0.2) 0%, rgba(14, 165, 233, 0.1) 40%, rgba(6, 182, 212, 0.04) 70%, transparent 100%)',
      glow: 'rgba(6, 182, 212, 0.15)',
      highlight: 'rgba(255, 255, 255, 0.85)',
    },
    gold: {
      gradient: 'radial-gradient(circle at 30% 30%, rgba(217, 119, 6, 0.15) 0%, rgba(245, 158, 11, 0.08) 40%, rgba(217, 119, 6, 0.03) 70%, transparent 100%)',
      glow: 'rgba(217, 119, 6, 0.1)',
      highlight: 'rgba(255, 255, 255, 0.7)',
    },
    white: {
      gradient: 'radial-gradient(circle at 30% 30%, rgba(15, 23, 42, 0.06) 0%, rgba(100, 116, 139, 0.03) 40%, rgba(15, 23, 42, 0.01) 70%, transparent 100%)',
      glow: 'rgba(15, 23, 42, 0.05)',
      highlight: 'rgba(255, 255, 255, 0.9)',
    },
  };

  const colorMap = isDark ? darkColorMap : lightColorMap;
  const currentColor = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: [0.4, 0.7, 0.4],
        scale: [0.95, 1.05, 0.95],
        y: [0, -20, 0],
        x: [0, 10, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: currentColor.gradient,
        boxShadow: `0 0 ${size / 2}px ${currentColor.glow}, inset 0 0 ${size / 4}px ${currentColor.highlight}`,
        filter: blur ? `blur(${blur}px)` : undefined,
        pointerEvents: 'none',
        ...style,
      }}
    >
      {/* Inner highlight */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '20%',
          width: '30%',
          height: '20%',
          borderRadius: '50%',
          background: `radial-gradient(ellipse at center, ${currentColor.highlight}, transparent)`,
        }}
      />
    </motion.div>
  );
};

// Floating liquid glass cube/box
interface LiquidCubeProps {
  size?: number;
  color?: 'green' | 'cyan' | 'gold';
  delay?: number;
  style?: React.CSSProperties;
}

export const LiquidCube: React.FC<LiquidCubeProps> = ({
  size = 60,
  color = 'green',
  delay = 0,
  style,
}) => {
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  const darkColorMap = {
    green: 'rgba(0, 210, 106, 0.15)',
    cyan: 'rgba(0, 210, 106, 0.12)',
    gold: 'rgba(240, 185, 11, 0.12)',
  };

  // Light mode: softer, frosted glass cubes
  const lightColorMap = {
    green: 'rgba(5, 150, 105, 0.1)',
    cyan: 'rgba(6, 182, 212, 0.12)',
    gold: 'rgba(217, 119, 6, 0.08)',
  };

  const colorMap = isDark ? darkColorMap : lightColorMap;
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(5, 150, 105, 0.15)';

  return (
    <motion.div
      initial={{ opacity: 0, rotateX: 0, rotateY: 0 }}
      animate={{
        opacity: [0.3, 0.6, 0.3],
        rotateX: [0, 180, 360],
        rotateY: [0, 180, 360],
      }}
      transition={{
        duration: 20,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${colorMap[color]}, transparent)`,
        border: `1px solid ${borderColor}`,
        borderRadius: size / 6,
        transformStyle: 'preserve-3d',
        pointerEvents: 'none',
        boxShadow: isDark ? 'none' : '0 4px 16px rgba(5, 150, 105, 0.06)',
        ...style,
      }}
    />
  );
};

// Liquid glass ring/torus
interface LiquidRingProps {
  size?: number;
  color?: 'green' | 'cyan' | 'gold';
  delay?: number;
  duration?: number;
  thickness?: number;
  clockwise?: boolean;
  style?: React.CSSProperties;
}

export const LiquidRing: React.FC<LiquidRingProps> = ({
  size = 100,
  color = 'green',
  delay = 0,
  duration = 15,
  thickness = 3,
  clockwise = true,
  style,
}) => {
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  const darkColorMap = {
    green: 'rgba(0, 210, 106, 0.4)',
    cyan: 'rgba(0, 210, 106, 0.35)',
    gold: 'rgba(240, 185, 11, 0.3)',
  };

  // Light mode: subtle frosted water rings
  const lightColorMap = {
    green: 'rgba(5, 150, 105, 0.2)',
    cyan: 'rgba(6, 182, 212, 0.22)',
    gold: 'rgba(217, 119, 6, 0.15)',
  };

  const colorMap = isDark ? darkColorMap : lightColorMap;
  const glowIntensity = isDark ? 20 : 12;

  return (
    <motion.div
      initial={{ opacity: 0, rotate: 0 }}
      animate={{
        opacity: isDark ? [0.3, 0.6, 0.3] : [0.4, 0.7, 0.4],
        rotate: clockwise ? [0, 360] : [360, 0],
        scale: [0.95, 1.05, 0.95],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `${thickness}px solid ${colorMap[color]}`,
        boxShadow: `0 0 ${glowIntensity}px ${colorMap[color]}, inset 0 0 ${glowIntensity}px ${colorMap[color]}`,
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
};

// Ambient liquid glass background with multiple floating elements
interface LiquidGlassBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
  showOrbs?: boolean;
  showRings?: boolean;
  showCubes?: boolean;
}

export const LiquidGlassBackground: React.FC<LiquidGlassBackgroundProps> = ({
  intensity = 'medium',
  showOrbs = true,
  showRings = true,
  showCubes = false,
}) => {
  const { mode, colors: themeColors } = useThemeMode();
  const isDark = mode === 'dark';

  // Don't render complex backgrounds - keep it clean for both modes
  // Light mode: pure white luxury background without floating orbs
  // Dark mode: clean dark background
  return null;

  const config = {
    low: { orbCount: 3, ringCount: 1, cubeCount: 1 },
    medium: { orbCount: 5, ringCount: 2, cubeCount: 2 },
    high: { orbCount: 8, ringCount: 3, cubeCount: 3 },
  };

  const { orbCount, ringCount, cubeCount } = config[intensity];

  const orbPositions = [
    { top: '10%', left: '5%', size: 120, color: 'green' as const, delay: 0, blur: 2 },
    { top: '60%', left: '8%', size: 80, color: 'cyan' as const, delay: 2, blur: 1 },
    { top: '20%', right: '10%', size: 100, color: 'gold' as const, delay: 1, blur: 2 },
    { top: '70%', right: '5%', size: 60, color: 'green' as const, delay: 3, blur: 0 },
    { top: '40%', left: '15%', size: 40, color: 'white' as const, delay: 4, blur: 0 },
    { bottom: '20%', left: '20%', size: 90, color: 'cyan' as const, delay: 2.5, blur: 1 },
    { bottom: '30%', right: '15%', size: 50, color: 'gold' as const, delay: 1.5, blur: 0 },
    { top: '50%', right: '25%', size: 70, color: 'white' as const, delay: 3.5, blur: 1 },
  ];

  const ringPositions = [
    { top: '15%', left: '10%', size: 150, color: 'green' as const, delay: 0 },
    { bottom: '25%', right: '8%', size: 120, color: 'cyan' as const, delay: 2 },
    { top: '45%', right: '20%', size: 80, color: 'gold' as const, delay: 4 },
  ];

  const cubePositions = [
    { top: '30%', left: '12%', size: 50, color: 'green' as const, delay: 0 },
    { bottom: '35%', right: '18%', size: 40, color: 'cyan' as const, delay: 3 },
    { top: '55%', left: '25%', size: 35, color: 'gold' as const, delay: 5 },
  ];

  // Theme-aware background gradients
  const meshGradient = isDark
    ? themeColors.gradients.mesh
    : 'radial-gradient(ellipse at 20% 20%, rgba(6, 182, 212, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(5, 150, 105, 0.05) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(14, 165, 233, 0.04) 0%, transparent 70%)';

  const heroGradient = isDark
    ? themeColors.gradients.hero
    : 'radial-gradient(ellipse at center top, rgba(6, 182, 212, 0.08) 0%, rgba(5, 150, 105, 0.04) 30%, transparent 70%)';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {/* Ambient gradient mesh */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: meshGradient,
          opacity: isDark ? 0.8 : 1,
        }}
      />

      {/* Floating orbs */}
      {showOrbs && orbPositions.slice(0, orbCount).map((orb, i) => (
        <LiquidOrb
          key={`orb-${i}`}
          size={orb.size}
          color={orb.color}
          delay={orb.delay}
          blur={orb.blur}
          style={{
            position: 'absolute',
            ...orb,
          }}
        />
      ))}

      {/* Floating rings */}
      {showRings && ringPositions.slice(0, ringCount).map((ring, i) => (
        <LiquidRing
          key={`ring-${i}`}
          size={ring.size}
          color={ring.color}
          delay={ring.delay}
          style={{
            position: 'absolute',
            ...ring,
          }}
        />
      ))}

      {/* Floating cubes */}
      {showCubes && cubePositions.slice(0, cubeCount).map((cube, i) => (
        <LiquidCube
          key={`cube-${i}`}
          size={cube.size}
          color={cube.color}
          delay={cube.delay}
          style={{
            position: 'absolute',
            ...cube,
          }}
        />
      ))}

      {/* Top ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: '300px',
          background: heroGradient,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

// 3D Floating Glass Card with parallax effect
interface Glass3DCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  depth?: 1 | 2 | 3;
  glow?: boolean;
  hover3D?: boolean;
  onClick?: () => void;
}

export const Glass3DCard: React.FC<Glass3DCardProps> = ({
  children,
  style,
  depth = 2,
  glow = true,
  hover3D = true,
  onClick,
}) => {
  const { mode, colors: themeColors } = useThemeMode();
  const isDark = mode === 'dark';

  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 50 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 50 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-8deg', '8deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !hover3D) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Dark mode: neon glass | Light mode: frosted water glass
  const darkDepthStyles = {
    1: {
      background: `linear-gradient(135deg, rgba(26, 143, 255, 0.04) 0%, rgba(0, 210, 106, 0.02) 100%)`,
      blur: '12px',
      shadow: themeColors.shadows.sm,
    },
    2: {
      background: `linear-gradient(135deg, rgba(26, 143, 255, 0.06) 0%, rgba(0, 210, 106, 0.03) 100%)`,
      blur: '16px',
      shadow: themeColors.shadows.float,
    },
    3: {
      background: `linear-gradient(135deg, rgba(26, 143, 255, 0.1) 0%, rgba(0, 210, 106, 0.05) 100%)`,
      blur: '24px',
      shadow: themeColors.shadows.floatHover,
    },
  };

  const lightDepthStyles = {
    1: {
      background: '#ffffff',
      blur: '0px',
      shadow: 'none',
    },
    2: {
      background: '#ffffff',
      blur: '0px',
      shadow: 'none',
    },
    3: {
      background: '#ffffff',
      blur: '0px',
      shadow: 'none',
    },
  };

  const depthStyles = isDark ? darkDepthStyles : lightDepthStyles;
  const currentDepth = depthStyles[depth];

  const glowGradient = isDark
    ? themeColors.gradients.glow
    : 'none';

  const highlightLine = isDark
    ? themeColors.gradients.neonLine
    : 'none';

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        position: 'relative',
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        rotateX: hover3D ? rotateX : 0,
        rotateY: hover3D ? rotateY : 0,
        ...style,
      }}
      whileHover={{
        scale: 1.02,
        z: 20,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      {/* Glow layer - Dark mode only */}
      {glow && isDark && (
        <motion.div
          style={{
            position: 'absolute',
            inset: '-2px',
            borderRadius: '20px',
            background: glowGradient,
            opacity: 0.5,
            filter: 'blur(20px)',
            zIndex: -1,
          }}
          whileHover={{ opacity: 0.8, scale: 1.05 }}
        />
      )}

      {/* Main card */}
      <div
        style={{
          background: currentDepth.background,
          backdropFilter: isDark ? `blur(${currentDepth.blur})` : 'none',
          WebkitBackdropFilter: isDark ? `blur(${currentDepth.blur})` : 'none',
          border: `1px solid ${isDark ? themeColors.glass.border : '#000000'}`,
          borderRadius: '20px',
          boxShadow: currentDepth.shadow,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Top highlight */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: '1px',
            background: highlightLine,
            opacity: isDark ? 0.6 : 0.8,
          }}
        />

        {/* Content */}
        {children}

        {/* Inner glow effect - Dark mode only */}
        {isDark && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '40%',
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    </motion.div>
  );
};

// Alert/Warning Banner with 3D effect
interface Glass3DAlertProps {
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const Glass3DAlert: React.FC<Glass3DAlertProps> = ({
  type,
  title,
  description,
  action,
}) => {
  const { mode, colors: themeColors } = useThemeMode();
  const isDark = mode === 'dark';

  const typeStyles = {
    warning: {
      bg: isDark ? 'rgba(255, 170, 0, 0.08)' : 'rgba(245, 158, 11, 0.08)',
      border: isDark ? 'rgba(255, 170, 0, 0.3)' : 'rgba(245, 158, 11, 0.25)',
      iconColor: themeColors.status.warning,
      glow: isDark ? 'rgba(255, 170, 0, 0.2)' : 'rgba(245, 158, 11, 0.12)',
    },
    error: {
      bg: isDark ? 'rgba(255, 51, 102, 0.08)' : 'rgba(239, 68, 68, 0.08)',
      border: isDark ? 'rgba(255, 51, 102, 0.3)' : 'rgba(239, 68, 68, 0.25)',
      iconColor: themeColors.status.error,
      glow: isDark ? 'rgba(255, 51, 102, 0.2)' : 'rgba(239, 68, 68, 0.12)',
    },
    info: {
      bg: isDark ? 'rgba(0, 204, 255, 0.08)' : 'rgba(6, 182, 212, 0.08)',
      border: isDark ? 'rgba(0, 204, 255, 0.3)' : 'rgba(6, 182, 212, 0.25)',
      iconColor: themeColors.status.info,
      glow: isDark ? 'rgba(0, 204, 255, 0.2)' : 'rgba(6, 182, 212, 0.12)',
    },
    success: {
      bg: isDark ? 'rgba(0, 200, 83, 0.08)' : 'rgba(5, 150, 105, 0.08)',
      border: isDark ? 'rgba(0, 200, 83, 0.3)' : 'rgba(5, 150, 105, 0.25)',
      iconColor: themeColors.status.success,
      glow: isDark ? 'rgba(0, 200, 83, 0.2)' : 'rgba(5, 150, 105, 0.12)',
    },
  };

  const currentStyle = typeStyles[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        background: currentStyle.bg,
        backdropFilter: 'blur(12px)',
        border: `1px solid ${currentStyle.border}`,
        borderRadius: '14px',
        boxShadow: `0 4px 20px ${currentStyle.glow}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Animated icon */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            border: `2px solid ${currentStyle.iconColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: currentStyle.iconColor,
            fontSize: '14px',
            fontWeight: 700,
          }}
        >
          !
        </motion.div>
        <div>
          <p style={{
            fontSize: '15px',
            fontWeight: 600,
            color: currentStyle.iconColor,
            marginBottom: description ? '4px' : 0,
          }}>
            {title}
          </p>
          {description && (
            <p style={{
              fontSize: '13px',
              color: themeColors.text.secondary,
            }}>
              {description}
            </p>
          )}
        </div>
      </div>

      {action && (
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${currentStyle.glow}` }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          style={{
            padding: '10px 20px',
            background: 'transparent',
            border: `1px solid ${currentStyle.iconColor}`,
            borderRadius: '10px',
            color: currentStyle.iconColor,
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
};

// 3D Stat Display
interface Glass3DStatProps {
  label: string;
  value: string;
  subValue?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

export const Glass3DStat: React.FC<Glass3DStatProps> = ({
  label,
  value,
  subValue,
  icon,
}) => {
  const { mode, colors: themeColors } = useThemeMode();
  const isDark = mode === 'dark';

  const cardBg = isDark
    ? themeColors.gradients.glassSurface
    : '#ffffff';

  const glowBg = isDark
    ? themeColors.gradients.glow
    : 'none';

  const hoverShadow = isDark
    ? themeColors.shadows.glassHover
    : 'none';

  return (
    <motion.div
      whileHover={{ y: isDark ? -4 : -2, boxShadow: hoverShadow }}
      style={{
        padding: '20px 24px',
        background: cardBg,
        backdropFilter: isDark ? 'blur(16px)' : 'none',
        border: `1px solid ${isDark ? themeColors.glass.border : '#000000'}`,
        borderRadius: '16px',
        boxShadow: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow - Dark mode only */}
      {isDark && (
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '100%',
            height: '100%',
            background: glowBg,
            opacity: 0.3,
            pointerEvents: 'none',
          }}
        />
      )}

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}>
          <span style={{
            fontSize: '13px',
            color: isDark ? themeColors.text.tertiary : '#374151',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            {label}
          </span>
          {icon && (
            <span style={{ color: isDark ? themeColors.primary[400] : '#000000', opacity: 0.7 }}>
              {icon}
            </span>
          )}
        </div>
        <div style={{
          fontSize: '28px',
          fontWeight: 700,
          fontFamily: "'JetBrains Mono', monospace",
          color: isDark ? themeColors.text.primary : '#000000',
          textShadow: isDark ? themeColors.shadows.neonText : 'none',
        }}>
          {value}
        </div>
        {subValue && (
          <div style={{
            fontSize: '13px',
            color: themeColors.text.tertiary,
            marginTop: '4px',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {subValue}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Floating Action Button with 3D effect
interface Glass3DFABProps {
  icon: React.ReactNode;
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
  onClick?: () => void;
}

export const Glass3DFAB: React.FC<Glass3DFABProps> = ({
  icon,
  label,
  variant = 'primary',
  onClick,
}) => {
  const { mode, colors: themeColors } = useThemeMode();
  const isDark = mode === 'dark';

  // Dark mode variants
  const darkVariants = {
    primary: {
      bg: themeColors.gradients.primary,
      color: themeColors.background.primary,
      border: 'none',
      shadow: themeColors.shadows.glow,
      hoverGlow: 'rgba(26, 143, 255, 0.3)',
    },
    secondary: {
      bg: 'rgba(26, 143, 255, 0.1)',
      color: themeColors.primary[400],
      border: `1px solid ${themeColors.glass.border}`,
      shadow: themeColors.shadows.glass,
      hoverGlow: 'rgba(26, 143, 255, 0.2)',
    },
    outline: {
      bg: 'transparent',
      color: themeColors.primary[400],
      border: `1px solid ${themeColors.primary[400]}`,
      shadow: 'none',
      hoverGlow: 'rgba(26, 143, 255, 0.15)',
    },
  };

  // Light mode variants - frosted glass with teal accents
  const lightVariants = {
    primary: {
      bg: 'linear-gradient(135deg, #059669 0%, #0891b2 100%)',
      color: '#ffffff',
      border: 'none',
      shadow: '0 4px 16px rgba(5, 150, 105, 0.25)',
      hoverGlow: 'rgba(5, 150, 105, 0.3)',
    },
    secondary: {
      bg: 'rgba(255, 255, 255, 0.9)',
      color: themeColors.primary[400],
      border: `1px solid rgba(5, 150, 105, 0.2)`,
      shadow: '0 4px 16px rgba(5, 150, 105, 0.08)',
      hoverGlow: 'rgba(5, 150, 105, 0.15)',
    },
    outline: {
      bg: 'transparent',
      color: themeColors.primary[400],
      border: `1px solid ${themeColors.primary[400]}`,
      shadow: 'none',
      hoverGlow: 'rgba(5, 150, 105, 0.1)',
    },
  };

  const variants = isDark ? darkVariants : lightVariants;
  const currentVariant = variants[variant];

  return (
    <motion.button
      whileHover={{
        scale: 1.05,
        boxShadow: `${currentVariant.shadow}, 0 0 30px ${currentVariant.hoverGlow}`,
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 24px',
        background: currentVariant.bg,
        color: currentVariant.color,
        border: currentVariant.border,
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: currentVariant.shadow,
        transition: 'all 0.3s ease',
      }}
    >
      {icon}
      {label}
    </motion.button>
  );
};

export default Glass3DCard;
