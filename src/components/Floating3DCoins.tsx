import React from 'react';
import { motion } from 'framer-motion';
import { useThemeMode } from '../theme/ThemeContext';

// Crypto coin data with colors and icons
const coins = [
  {
    symbol: 'BTC',
    color: '#F7931A',
    secondaryColor: '#FFB84D',
    icon: '₿',
    size: 75,
    position: { top: '8%', right: '18%' },
    orbitRadius: 15,
    orbitDuration: 8,
    floatAmplitude: 20,
  },
  {
    symbol: 'ETH',
    color: '#627EEA',
    secondaryColor: '#8C9EFF',
    icon: '⟠',
    size: 65,
    position: { top: '25%', right: '5%' },
    orbitRadius: 12,
    orbitDuration: 10,
    floatAmplitude: 25,
  },
  {
    symbol: 'USDT',
    color: '#26A17B',
    secondaryColor: '#4ECBA0',
    icon: '₮',
    size: 55,
    position: { top: '50%', right: '3%' },
    orbitRadius: 10,
    orbitDuration: 7,
    floatAmplitude: 18,
  },
  {
    symbol: 'SOL',
    color: '#9945FF',
    secondaryColor: '#14F195',
    icon: '◎',
    size: 50,
    position: { top: '70%', right: '15%' },
    orbitRadius: 8,
    orbitDuration: 9,
    floatAmplitude: 22,
  },
  {
    symbol: 'BNB',
    color: '#F0B90B',
    secondaryColor: '#FFD54F',
    icon: 'Ⓑ',
    size: 58,
    position: { top: '38%', right: '12%' },
    orbitRadius: 14,
    orbitDuration: 11,
    floatAmplitude: 16,
  },
  {
    symbol: 'LTC',
    color: '#345D9D',
    secondaryColor: '#88ACF8',
    icon: 'Ł',
    size: 45,
    position: { top: '85%', right: '8%' },
    orbitRadius: 6,
    orbitDuration: 6,
    floatAmplitude: 12,
  },
];

interface Coin3DProps {
  symbol: string;
  color: string;
  secondaryColor: string;
  icon: string;
  size: number;
  orbitRadius: number;
  orbitDuration: number;
  floatAmplitude: number;
  isDark: boolean;
  index: number;
}

const Coin3D: React.FC<Coin3DProps> = ({
  symbol, color, secondaryColor, icon, size,
  orbitRadius, orbitDuration, floatAmplitude, isDark, index
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: 0,
      }}
      transition={{
        delay: index * 0.15,
        duration: 0.8,
        type: 'spring',
        stiffness: 120,
      }}
      style={{
        width: size,
        height: size,
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      {/* Complex orbital animation wrapper */}
      <motion.div
        animate={{
          // Orbital movement - circular path
          x: [0, orbitRadius, 0, -orbitRadius, 0],
          y: [-floatAmplitude, 0, floatAmplitude, 0, -floatAmplitude],
          // 3D rotation effects
          rotateY: [0, 360],
          rotateX: [0, 15, 0, -15, 0],
          rotateZ: [0, 5, 0, -5, 0],
        }}
        transition={{
          x: {
            duration: orbitDuration,
            repeat: Infinity,
            ease: 'easeInOut',
          },
          y: {
            duration: orbitDuration * 0.75,
            repeat: Infinity,
            ease: 'easeInOut',
          },
          rotateY: {
            duration: orbitDuration * 2,
            repeat: Infinity,
            ease: 'linear',
          },
          rotateX: {
            duration: orbitDuration * 1.2,
            repeat: Infinity,
            ease: 'easeInOut',
          },
          rotateZ: {
            duration: orbitDuration * 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
        whileHover={{
          scale: 1.2,
          rotateY: 720,
          transition: { duration: 0.8 },
        }}
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          perspective: '800px',
        }}
      >
        {/* Main coin body - 3D disc effect */}
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: `
              radial-gradient(ellipse at 30% 30%, ${secondaryColor} 0%, transparent 50%),
              radial-gradient(ellipse at 70% 70%, ${color}88 0%, transparent 50%),
              linear-gradient(145deg, ${secondaryColor} 0%, ${color} 40%, ${color}cc 100%)
            `,
            boxShadow: isDark
              ? `
                0 ${size * 0.15}px ${size * 0.4}px ${color}50,
                0 ${size * 0.05}px ${size * 0.15}px rgba(0,0,0,0.4),
                inset 0 -${size * 0.08}px ${size * 0.15}px ${color}80,
                inset 0 ${size * 0.05}px ${size * 0.1}px ${secondaryColor}90
              `
              : `
                0 ${size * 0.1}px ${size * 0.3}px ${color}40,
                0 ${size * 0.03}px ${size * 0.1}px rgba(0,0,0,0.2),
                inset 0 -${size * 0.06}px ${size * 0.12}px ${color}70,
                inset 0 ${size * 0.04}px ${size * 0.08}px ${secondaryColor}80
              `,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            transform: 'rotateX(10deg)',
          }}
        >
          {/* Coin shine effect - animated */}
          <motion.div
            animate={{
              rotate: [0, 360],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
              opacity: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            }}
            style={{
              position: 'absolute',
              top: '5%',
              left: '5%',
              width: '50%',
              height: '40%',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
              borderRadius: '50%',
              filter: 'blur(3px)',
            }}
          />

          {/* Coin edge ring - outer */}
          <div
            style={{
              position: 'absolute',
              inset: '2px',
              borderRadius: '50%',
              border: `2px solid ${secondaryColor}70`,
              pointerEvents: 'none',
            }}
          />

          {/* Coin edge ring - inner */}
          <div
            style={{
              position: 'absolute',
              inset: '8%',
              borderRadius: '50%',
              border: `1.5px solid ${secondaryColor}50`,
              pointerEvents: 'none',
            }}
          />

          {/* Symbol */}
          <span
            style={{
              fontSize: size * 0.38,
              fontWeight: 800,
              color: '#ffffff',
              textShadow: `0 2px 6px ${color}aa, 0 0 20px ${color}40`,
              zIndex: 1,
              fontFamily: "'Inter', 'Arial', sans-serif",
            }}
          >
            {icon}
          </span>
        </div>

        {/* Pulsing glow effect behind coin */}
        <motion.div
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [0.9, 1.2, 0.9],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '140%',
            height: '140%',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color}40 0%, ${color}20 40%, transparent 70%)`,
            zIndex: -1,
            filter: 'blur(15px)',
          }}
        />
      </motion.div>

      {/* Symbol label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.15 + 0.5 }}
        style={{
          position: 'absolute',
          bottom: '-22px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '11px',
          fontWeight: 700,
          color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          whiteSpace: 'nowrap',
        }}
      >
        {symbol}
      </motion.div>
    </motion.div>
  );
};

interface Floating3DCoinsProps {
  className?: string;
  style?: React.CSSProperties;
}

export const Floating3DCoins: React.FC<Floating3DCoinsProps> = ({ className, style }) => {
  const { isDark } = useThemeMode();

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '45%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
        ...style,
      }}
    >
      {coins.map((coin, index) => (
        <div
          key={coin.symbol}
          style={{
            position: 'absolute',
            ...coin.position,
            pointerEvents: 'auto',
          }}
        >
          <Coin3D
            symbol={coin.symbol}
            color={coin.color}
            secondaryColor={coin.secondaryColor}
            icon={coin.icon}
            size={coin.size}
            orbitRadius={coin.orbitRadius}
            orbitDuration={coin.orbitDuration}
            floatAmplitude={coin.floatAmplitude}
            isDark={isDark}
            index={index}
          />
        </div>
      ))}

      {/* Particle trails connecting coins */}
      <motion.svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: isDark ? 0.15 : 0.1,
        }}
      >
        <motion.circle
          cx="70%"
          cy="20%"
          r="3"
          fill={isDark ? '#00ff88' : '#10B981'}
          animate={{
            cx: ['70%', '85%', '75%', '70%'],
            cy: ['20%', '40%', '60%', '20%'],
            opacity: [0, 1, 1, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        <motion.circle
          cx="80%"
          cy="50%"
          r="2"
          fill={isDark ? '#00ffd5' : '#059669'}
          animate={{
            cx: ['80%', '70%', '90%', '80%'],
            cy: ['50%', '70%', '30%', '50%'],
            opacity: [0, 1, 1, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear', delay: 2 }}
        />
      </motion.svg>
    </div>
  );
};

export default Floating3DCoins;
