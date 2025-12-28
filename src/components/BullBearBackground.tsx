import React from 'react';
import { motion } from 'framer-motion';
import { useThemeMode } from '../theme/ThemeContext';

interface BullBearBackgroundProps {
  scrollY?: number;
}

export const BullBearBackground: React.FC<BullBearBackgroundProps> = ({ scrollY = 0 }) => {
  const { isDark } = useThemeMode();

  // Calculate parallax effect based on scroll
  const bullOffset = scrollY * 0.1;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Base gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isDark
            ? 'radial-gradient(ellipse at 30% 40%, rgba(0, 40, 20, 0.4) 0%, transparent 60%)'
            : 'linear-gradient(135deg, rgba(236, 253, 245, 0.95) 0%, rgba(255, 255, 255, 0.9) 50%, rgba(240, 253, 250, 0.95) 100%)',
          zIndex: 1,
        }}
      />

      {/* Massive Bull - Covers entire background */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          left: '-10%',
          top: '-5%',
          width: '120%',
          height: '110%',
          transform: `translateY(${bullOffset}px)`,
          zIndex: 2,
        }}
      >
        {/* Bull silhouette - Massive and prominent */}
        <svg
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          style={{
            width: '100%',
            height: '100%',
            opacity: isDark ? 0.12 : 0.08,
          }}
        >
          <defs>
            {/* Gradient for bull in light mode - more visible */}
            <linearGradient id="bullGradientMain" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDark ? '#00ff88' : '#047857'} stopOpacity={isDark ? 0.8 : 1} />
              <stop offset="40%" stopColor={isDark ? '#00cc6a' : '#059669'} stopOpacity={isDark ? 0.6 : 0.8} />
              <stop offset="100%" stopColor={isDark ? '#009952' : '#10b981'} stopOpacity={isDark ? 0.3 : 0.5} />
            </linearGradient>

            {/* Glow filter */}
            <filter id="bullGlowMain" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={isDark ? 15 : 8} result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Chart line pattern */}
            <pattern id="chartPattern" x="0" y="0" width="100" height="50" patternUnits="userSpaceOnUse">
              <path
                d="M0 40 Q25 30 50 35 T100 25"
                stroke={isDark ? '#00ff8840' : '#05966930'}
                strokeWidth="2"
                fill="none"
              />
            </pattern>
          </defs>

          {/* Background chart lines */}
          <rect x="0" y="0" width="100%" height="100%" fill="url(#chartPattern)" opacity="0.3" />

          {/* Main Bull - Charging powerful pose */}
          <g fill="url(#bullGradientMain)" filter="url(#bullGlowMain)">
            {/* Massive body */}
            <ellipse cx="550" cy="450" rx="350" ry="220" />

            {/* Powerful shoulder hump */}
            <ellipse cx="350" cy="380" rx="200" ry="180" />

            {/* Muscular neck */}
            <ellipse cx="200" cy="350" rx="120" ry="140" />

            {/* Head - aggressive forward position */}
            <ellipse cx="80" cy="320" rx="100" ry="85" />

            {/* Snout - breathing steam */}
            <ellipse cx="-20" cy="360" rx="70" ry="50" />

            {/* Powerful horns - curved upward aggressively */}
            <path d="M60 260 Q-20 150 -60 80 Q-80 40 -40 30 Q0 40 30 100 Q60 180 80 250" />
            <path d="M120 240 Q80 120 60 40 Q50 -10 90 -20 Q130 -10 140 50 Q160 140 150 230" />

            {/* Front legs - charging stance */}
            <path d="M280 580 L240 720 L200 800 L260 810 L320 750 L340 600" />
            <path d="M400 620 L420 750 L400 830 L460 840 L500 770 L480 640" />

            {/* Back legs - powerful push */}
            <path d="M680 600 L660 740 L640 820 L700 830 L740 760 L720 620" />
            <path d="M820 580 L860 720 L880 810 L940 800 L920 700 L860 580" />

            {/* Tail - raised with power */}
            <path d="M880 420 Q980 380 1050 300 Q1100 250 1140 280 Q1120 340 1060 400 Q980 480 900 480" />

            {/* Eye - fierce and determined */}
            <circle cx="50" cy="300" r="15" fill={isDark ? '#00ff88' : '#059669'} opacity="0.8" />

            {/* Nostril steam effect */}
            <ellipse cx="-50" cy="380" rx="30" ry="15" opacity="0.4" />
            <ellipse cx="-70" cy="370" rx="20" ry="10" opacity="0.3" />
          </g>

          {/* Secondary bull silhouette for depth */}
          <g fill="url(#bullGradientMain)" opacity="0.3" transform="translate(100, 50) scale(0.8)">
            <ellipse cx="550" cy="450" rx="350" ry="220" />
            <ellipse cx="350" cy="380" rx="200" ry="180" />
            <ellipse cx="200" cy="350" rx="120" ry="140" />
            <ellipse cx="80" cy="320" rx="100" ry="85" />
          </g>

          {/* Trading chart candlesticks scattered */}
          <g opacity={isDark ? 0.4 : 0.25}>
            {/* Green candles (bullish) */}
            <rect x="950" y="200" width="15" height="80" fill={isDark ? '#00ff88' : '#059669'} rx="2" />
            <rect x="980" y="180" width="15" height="120" fill={isDark ? '#00ff88' : '#059669'} rx="2" />
            <rect x="1010" y="150" width="15" height="100" fill={isDark ? '#00ff88' : '#059669'} rx="2" />
            <rect x="1040" y="130" width="15" height="140" fill={isDark ? '#00ff88' : '#059669'} rx="2" />
            <rect x="1070" y="100" width="15" height="120" fill={isDark ? '#00ff88' : '#059669'} rx="2" />

            {/* Wicks */}
            <line x1="957" y1="190" x2="957" y2="200" stroke={isDark ? '#00ff88' : '#059669'} strokeWidth="2" />
            <line x1="987" y1="160" x2="987" y2="180" stroke={isDark ? '#00ff88' : '#059669'} strokeWidth="2" />
            <line x1="1017" y1="130" x2="1017" y2="150" stroke={isDark ? '#00ff88' : '#059669'} strokeWidth="2" />
            <line x1="1047" y1="100" x2="1047" y2="130" stroke={isDark ? '#00ff88' : '#059669'} strokeWidth="2" />
            <line x1="1077" y1="70" x2="1077" y2="100" stroke={isDark ? '#00ff88' : '#059669'} strokeWidth="2" />

            {/* Chart line going up */}
            <path
              d="M900 350 Q950 320 980 280 Q1010 250 1050 200 Q1080 160 1120 100"
              stroke={isDark ? '#00ff88' : '#059669'}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </motion.div>

      {/* Animated energy particles */}
      <motion.div
        animate={{
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          left: '10%',
          top: '30%',
          width: '300px',
          height: '300px',
          background: isDark
            ? 'radial-gradient(circle, rgba(0, 255, 136, 0.2) 0%, transparent 60%)'
            : 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 60%)',
          filter: 'blur(40px)',
          borderRadius: '50%',
          zIndex: 3,
        }}
      />

      {/* Secondary glow near horn */}
      <motion.div
        animate={{
          opacity: [0.1, 0.3, 0.1],
          x: [-10, 10, -10],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          left: '5%',
          top: '15%',
          width: '200px',
          height: '200px',
          background: isDark
            ? 'radial-gradient(circle, rgba(0, 255, 200, 0.25) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(5, 150, 105, 0.12) 0%, transparent 70%)',
          filter: 'blur(30px)',
          borderRadius: '50%',
          zIndex: 3,
        }}
      />

      {/* Bottom fade gradient */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: isDark
            ? 'linear-gradient(to top, rgba(11, 14, 17, 0.9) 0%, transparent 100%)'
            : 'linear-gradient(to top, rgba(255, 255, 255, 0.8) 0%, transparent 100%)',
          zIndex: 4,
        }}
      />

      {/* Top right corner accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '50%',
          background: isDark
            ? 'radial-gradient(ellipse at 100% 0%, rgba(0, 255, 136, 0.05) 0%, transparent 50%)'
            : 'radial-gradient(ellipse at 100% 0%, rgba(16, 185, 129, 0.08) 0%, transparent 50%)',
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default BullBearBackground;
