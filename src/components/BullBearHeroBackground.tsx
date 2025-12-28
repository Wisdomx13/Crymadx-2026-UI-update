import React from 'react';
import { motion } from 'framer-motion';

// Crypto Chart Line - Animated trading chart pattern
const CryptoChartLine: React.FC<{
  position: { top?: string; bottom?: string; left?: string; right?: string };
  width: number;
  height: number;
  color: string;
  delay?: number;
}> = ({ position, width, height, color, delay = 0 }) => {
  // Generate random chart path
  const generatePath = () => {
    const points = [];
    const segments = 12;
    let y = height * 0.5;
    points.push(`M 0 ${y}`);

    for (let i = 1; i <= segments; i++) {
      const x = (width / segments) * i;
      // Random walk with trend
      y = Math.max(height * 0.2, Math.min(height * 0.8, y + (Math.random() - 0.45) * height * 0.3));
      points.push(`L ${x} ${y}`);
    }
    return points.join(' ');
  };

  const path = generatePath();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        position: 'absolute',
        ...position,
        width,
        height,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={`chartGrad-${delay}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0" />
            <stop offset="20%" stopColor={color} stopOpacity="0.8" />
            <stop offset="80%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <filter id={`chartGlow-${delay}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <motion.path
          d={path}
          fill="none"
          stroke={`url(#chartGrad-${delay})`}
          strokeWidth="2"
          filter={`url(#chartGlow-${delay})`}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 3,
            delay,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
        />
      </svg>
    </motion.div>
  );
};

// Bull Silhouette - Charging stance facing right
const BullSilhouette: React.FC<{
  size: number;
  position: { top?: string; bottom?: string; left?: string; right?: string };
}> = ({ size, position }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{
        opacity: [0.15, 0.25, 0.15],
        x: [0, 15, 0],
        scale: [1, 1.02, 1],
      }}
      transition={{
        opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        x: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        scale: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
      }}
      style={{
        position: 'absolute',
        ...position,
        width: size,
        height: size * 0.7,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <svg viewBox="0 0 200 140" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="bullGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#059669" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0.5" />
          </linearGradient>
          <filter id="bullGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Bull body - charging stance facing right */}
        <path
          d="M30,85
             C20,80 15,70 20,60
             L25,55 C30,45 40,40 55,42
             L70,40 L85,35
             C95,30 110,28 120,32
             L135,30 L150,25
             C160,22 170,25 175,35
             L178,45 C185,55 180,70 175,80
             L170,90 C165,100 155,110 140,115
             L120,118 L100,120
             C80,122 60,118 45,110
             L35,100 L30,85 Z
             M175,35 L185,30 C190,28 195,32 192,38 L185,45 L178,45
             M170,25 L178,18 C183,15 188,18 186,24 L180,32 L175,35
             M45,110 L42,125 L48,128 L55,115
             M70,118 L68,130 L75,132 L80,120
             M120,118 L118,132 L125,134 L130,120
             M140,115 L142,128 L148,126 L145,112"
          fill="url(#bullGradient)"
          filter="url(#bullGlow)"
        />
        {/* Bull eye */}
        <circle cx="180" cy="40" r="3" fill="#10b981" />
        {/* Nostril steam effect */}
        <motion.ellipse
          cx="195"
          cy="50"
          rx="8"
          ry="4"
          fill="#10b981"
          opacity="0.4"
          animate={{
            opacity: [0, 0.6, 0],
            cx: [195, 205, 215],
            rx: [4, 8, 12],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      </svg>
    </motion.div>
  );
};

// Bear Silhouette - Aggressive stance facing left
const BearSilhouette: React.FC<{
  size: number;
  position: { top?: string; bottom?: string; left?: string; right?: string };
}> = ({ size, position }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{
        opacity: [0.15, 0.25, 0.15],
        x: [0, -15, 0],
        scale: [1, 1.02, 1],
      }}
      transition={{
        opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
        x: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
        scale: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
      }}
      style={{
        position: 'absolute',
        ...position,
        width: size,
        height: size * 0.8,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <svg viewBox="0 0 200 160" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="bearGradient" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#dc2626" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.5" />
          </linearGradient>
          <filter id="bearGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Bear body - aggressive stance facing left, rearing up */}
        <path
          d="M170,120
             C180,115 185,105 180,90
             L175,75 C172,60 165,50 155,45
             L145,40 L130,35
             C115,30 100,28 85,32
             L65,38 L45,45
             C30,50 20,60 18,75
             L15,90 C12,105 18,120 30,130
             L50,138 L75,142
             C100,145 130,142 155,135
             L170,120 Z
             M18,75 L8,68 C3,65 2,58 8,55 L18,60 L22,70
             M25,60 L15,50 C10,45 12,38 20,38 L30,48 L28,58
             M50,138 L45,155 L55,158 L62,142
             M85,142 L82,158 L92,160 L98,145
             M130,140 L135,155 L145,152 L140,135
             M155,135 L162,148 L170,142 L160,130"
          fill="url(#bearGradient)"
          filter="url(#bearGlow)"
        />
        {/* Bear eye */}
        <circle cx="22" cy="65" r="3" fill="#ef4444" />
        {/* Bear claws/swipe effect */}
        <motion.g
          animate={{
            opacity: [0, 0.8, 0],
            x: [-5, 0, 5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 2,
            ease: 'easeOut',
          }}
        >
          <line x1="5" y1="55" x2="-15" y2="45" stroke="#ef4444" strokeWidth="2" opacity="0.6" />
          <line x1="5" y1="60" x2="-18" y2="55" stroke="#ef4444" strokeWidth="2" opacity="0.6" />
          <line x1="5" y1="65" x2="-15" y2="65" stroke="#ef4444" strokeWidth="2" opacity="0.6" />
        </motion.g>
      </svg>
    </motion.div>
  );
};

// Clash Effect - Energy between bull and bear
const ClashEffect: React.FC = () => {
  return (
    <motion.div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 150,
        height: 150,
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      {/* Energy burst */}
      <motion.div
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, rgba(245, 158, 11, 0.2) 40%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(8px)',
        }}
      />
      {/* Lightning sparks */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0.5],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.2,
            repeat: Infinity,
            repeatDelay: 1,
            ease: 'easeOut',
          }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 4,
            height: 20 + Math.random() * 10,
            background: 'linear-gradient(to bottom, #fbbf24, #f59e0b, transparent)',
            borderRadius: 2,
            transform: `translate(-50%, -50%) rotate(${i * 60}deg)`,
            transformOrigin: 'center bottom',
          }}
        />
      ))}
    </motion.div>
  );
};

// Green Sparkle Particle
const GreenSparkle: React.FC<{
  size: number;
  position: { top: string; left: string };
  delay: number;
}> = ({ size, position, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 0.9, 0.5, 0.9, 0],
      scale: [0.5, 1.2, 1, 1.2, 0.5],
      y: [0, -25, -15, -35, 0],
    }}
    transition={{
      duration: 4 + Math.random() * 2,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
    style={{
      position: 'absolute',
      ...position,
      width: size,
      height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle, #10b981 0%, #10b98160 50%, transparent 100%)`,
      boxShadow: `0 0 ${size * 3}px #10b981, 0 0 ${size * 6}px #10b98180, 0 0 ${size * 9}px #10b98140`,
      filter: 'blur(0.5px)',
      pointerEvents: 'none',
      zIndex: 3,
    }}
  />
);

// Candlestick Pattern
const CandlestickPattern: React.FC<{
  position: { top?: string; bottom?: string; left?: string; right?: string };
  width: number;
  height: number;
}> = ({ position, width, height }) => {
  const candles = Array.from({ length: 8 }, (_, i) => ({
    x: (width / 8) * i + 10,
    isGreen: Math.random() > 0.4,
    bodyHeight: 15 + Math.random() * 25,
    wickTop: 5 + Math.random() * 10,
    wickBottom: 5 + Math.random() * 10,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.15, 0.3, 0.15] }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        position: 'absolute',
        ...position,
        width,
        height,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <svg width={width} height={height}>
        {candles.map((candle, i) => {
          const bodyTop = height * 0.3 + Math.random() * height * 0.2;
          const color = candle.isGreen ? '#10b981' : '#ef4444';

          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              {/* Wick */}
              <line
                x1={candle.x + 5}
                y1={bodyTop - candle.wickTop}
                x2={candle.x + 5}
                y2={bodyTop + candle.bodyHeight + candle.wickBottom}
                stroke={color}
                strokeWidth="1.5"
                opacity="0.6"
              />
              {/* Body */}
              <rect
                x={candle.x}
                y={bodyTop}
                width={10}
                height={candle.bodyHeight}
                fill={color}
                opacity="0.7"
                rx="1"
              />
            </motion.g>
          );
        })}
      </svg>
    </motion.div>
  );
};

// Main Bull vs Bear Hero Background Component
export const BullBearHeroBackground: React.FC = () => {
  // Generate green sparkles
  const sparkles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: 3 + Math.random() * 5,
    top: `${5 + Math.random() * 90}%`,
    left: `${5 + Math.random() * 90}%`,
    delay: Math.random() * 5,
  }));

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Gradient backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 50%, rgba(239, 68, 68, 0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 30%, rgba(251, 191, 36, 0.05) 0%, transparent 40%)
          `,
        }}
      />

      {/* Bull on the left - charging right */}
      <BullSilhouette
        size={400}
        position={{ bottom: '5%', left: '-5%' }}
      />

      {/* Bear on the right - facing left */}
      <BearSilhouette
        size={380}
        position={{ bottom: '8%', right: '-5%' }}
      />

      {/* Clash effect in the middle */}
      <ClashEffect />

      {/* Crypto chart lines */}
      <CryptoChartLine
        position={{ top: '15%', left: '10%' }}
        width={200}
        height={60}
        color="#10b981"
        delay={0}
      />
      <CryptoChartLine
        position={{ top: '25%', right: '15%' }}
        width={180}
        height={50}
        color="#ef4444"
        delay={1}
      />
      <CryptoChartLine
        position={{ bottom: '30%', left: '20%' }}
        width={160}
        height={45}
        color="#10b981"
        delay={2}
      />
      <CryptoChartLine
        position={{ bottom: '20%', right: '25%' }}
        width={140}
        height={40}
        color="#fbbf24"
        delay={3}
      />

      {/* Candlestick patterns */}
      <CandlestickPattern
        position={{ top: '10%', left: '5%' }}
        width={120}
        height={80}
      />
      <CandlestickPattern
        position={{ top: '20%', right: '8%' }}
        width={100}
        height={70}
      />
      <CandlestickPattern
        position={{ bottom: '25%', left: '15%' }}
        width={90}
        height={60}
      />

      {/* Green sparkles throughout */}
      {sparkles.map((sparkle) => (
        <GreenSparkle
          key={sparkle.id}
          size={sparkle.size}
          position={{ top: sparkle.top, left: sparkle.left }}
          delay={sparkle.delay}
        />
      ))}

      {/* Subtle grid pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(16, 185, 129, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      {/* VS Text in center */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          top: '45%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '80px',
          fontWeight: 900,
          fontFamily: "'Inter', sans-serif",
          background: 'linear-gradient(135deg, #10b981 0%, #fbbf24 50%, #ef4444 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: 'none',
          letterSpacing: '-5px',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.15,
        }}
      >
        VS
      </motion.div>
    </div>
  );
};

export default BullBearHeroBackground;
