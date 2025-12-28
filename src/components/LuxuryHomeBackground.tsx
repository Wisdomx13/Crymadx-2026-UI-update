import React from 'react';
import { motion } from 'framer-motion';

interface LuxuryHomeBackgroundProps {
  section?: 'hero' | 'features' | 'full';
}

// 3D Crystal Component
const Crystal3D: React.FC<{
  size: number;
  color: string;
  secondaryColor: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  delay?: number;
  rotation?: number;
}> = ({ size, color, secondaryColor, position, delay = 0, rotation = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0, rotate: rotation - 20 }}
    animate={{
      opacity: [0.6, 0.9, 0.6],
      scale: [1, 1.05, 1],
      rotate: [rotation, rotation + 5, rotation],
      y: [0, -15, 0],
    }}
    transition={{
      opacity: { duration: 4, repeat: Infinity, delay },
      scale: { duration: 5, repeat: Infinity, delay },
      rotate: { duration: 8, repeat: Infinity, delay },
      y: { duration: 6, repeat: Infinity, delay, ease: 'easeInOut' },
    }}
    style={{
      position: 'absolute',
      ...position,
      width: size,
      height: size * 1.4,
      pointerEvents: 'none',
      zIndex: 1,
    }}
  >
    <svg viewBox="0 0 100 140" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id={`crystal-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="50%" stopColor={secondaryColor} stopOpacity="0.7" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
        <filter id="crystalGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Main crystal body */}
      <polygon
        points="50,0 85,35 75,100 50,140 25,100 15,35"
        fill={`url(#crystal-${color})`}
        filter="url(#crystalGlow)"
      />
      {/* Crystal facet highlights */}
      <polygon
        points="50,0 85,35 50,50"
        fill="rgba(255,255,255,0.4)"
      />
      <polygon
        points="50,0 15,35 50,50"
        fill="rgba(255,255,255,0.2)"
      />
      {/* Inner glow */}
      <polygon
        points="50,50 75,100 50,130 25,100"
        fill="rgba(255,255,255,0.15)"
      />
    </svg>
  </motion.div>
);

// Floating Cloud/Blob Component
const FloatingCloud: React.FC<{
  size: number;
  color: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  delay?: number;
  blur?: number;
}> = ({ size, color, position, delay = 0, blur = 40 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{
      opacity: [0.3, 0.5, 0.3],
      scale: [1, 1.1, 1],
      x: [0, 20, 0],
    }}
    transition={{
      opacity: { duration: 6, repeat: Infinity, delay },
      scale: { duration: 8, repeat: Infinity, delay },
      x: { duration: 10, repeat: Infinity, delay, ease: 'easeInOut' },
    }}
    style={{
      position: 'absolute',
      ...position,
      width: size,
      height: size * 0.6,
      background: `radial-gradient(ellipse at center, ${color} 0%, transparent 70%)`,
      filter: `blur(${blur}px)`,
      borderRadius: '50%',
      pointerEvents: 'none',
      zIndex: 0,
    }}
  />
);

// 3D Geometric Sphere
const GeometricSphere: React.FC<{
  size: number;
  color: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  delay?: number;
}> = ({ size, color, position, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0.5, 0.8, 0.5],
      scale: [1, 1.08, 1],
      rotateY: [0, 360],
    }}
    transition={{
      opacity: { duration: 4, repeat: Infinity, delay },
      scale: { duration: 5, repeat: Infinity, delay },
      rotateY: { duration: 20, repeat: Infinity, ease: 'linear' },
    }}
    style={{
      position: 'absolute',
      ...position,
      width: size,
      height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, ${color} 40%, rgba(0,0,0,0.1) 100%)`,
      boxShadow: `
        inset -10px -10px 30px rgba(0,0,0,0.15),
        inset 5px 5px 20px rgba(255,255,255,0.5),
        0 20px 40px ${color}40
      `,
      pointerEvents: 'none',
      zIndex: 1,
    }}
  />
);

// Hexagonal Platform (like in reference)
const HexPlatform: React.FC<{
  size: number;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  delay?: number;
}> = ({ size, position, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{
      opacity: [0.6, 0.9, 0.6],
      y: [0, -10, 0],
    }}
    transition={{
      opacity: { duration: 5, repeat: Infinity, delay },
      y: { duration: 4, repeat: Infinity, delay, ease: 'easeInOut' },
    }}
    style={{
      position: 'absolute',
      ...position,
      width: size,
      height: size * 0.6,
      pointerEvents: 'none',
      zIndex: 1,
    }}
  >
    <svg viewBox="0 0 200 120" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="platformGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e8f5f3" />
          <stop offset="50%" stopColor="#d1ebe6" />
          <stop offset="100%" stopColor="#b8e0d9" />
        </linearGradient>
        <linearGradient id="platformSide" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a8d5cd" />
          <stop offset="100%" stopColor="#8ec5bb" />
        </linearGradient>
      </defs>
      {/* Top face */}
      <polygon
        points="100,10 180,40 180,60 100,90 20,60 20,40"
        fill="url(#platformGrad)"
      />
      {/* Left side */}
      <polygon
        points="20,40 20,60 100,90 100,110 20,80"
        fill="url(#platformSide)"
        opacity="0.8"
      />
      {/* Right side */}
      <polygon
        points="180,40 180,60 100,90 100,110 180,80"
        fill="url(#platformSide)"
        opacity="0.6"
      />
    </svg>
  </motion.div>
);

// Water Wave Effect
const WaterWave: React.FC<{
  position: { bottom: string };
}> = ({ position }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      ...position,
      height: '200px',
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden',
    }}
  >
    <svg
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <linearGradient id="waveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(16, 185, 129, 0.08)" />
          <stop offset="100%" stopColor="rgba(6, 182, 212, 0.05)" />
        </linearGradient>
      </defs>
      <motion.path
        d="M0,100 C150,150 350,50 500,100 C650,150 850,50 1000,100 C1150,150 1350,50 1440,100 L1440,200 L0,200 Z"
        fill="url(#waveGrad)"
        animate={{
          d: [
            "M0,100 C150,150 350,50 500,100 C650,150 850,50 1000,100 C1150,150 1350,50 1440,100 L1440,200 L0,200 Z",
            "M0,100 C150,50 350,150 500,100 C650,50 850,150 1000,100 C1150,50 1350,150 1440,100 L1440,200 L0,200 Z",
            "M0,100 C150,150 350,50 500,100 C650,150 850,50 1000,100 C1150,150 1350,50 1440,100 L1440,200 L0,200 Z",
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  </motion.div>
);

// Floating Particles
const FloatingParticle: React.FC<{
  size: number;
  color: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  delay?: number;
}> = ({ size, color, position, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{
      opacity: [0, 0.6, 0],
      y: [0, -100],
      x: [0, Math.random() * 40 - 20],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      delay,
      ease: 'easeOut',
    }}
    style={{
      position: 'absolute',
      ...position,
      width: size,
      height: size,
      borderRadius: '50%',
      background: color,
      boxShadow: `0 0 ${size * 2}px ${color}`,
      pointerEvents: 'none',
      zIndex: 2,
    }}
  />
);

// Diamond Shape
const Diamond3D: React.FC<{
  size: number;
  color: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  delay?: number;
}> = ({ size, color, position, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, rotate: 45 }}
    animate={{
      opacity: [0.5, 0.8, 0.5],
      rotate: [45, 55, 45],
      y: [0, -20, 0],
    }}
    transition={{
      opacity: { duration: 4, repeat: Infinity, delay },
      rotate: { duration: 6, repeat: Infinity, delay },
      y: { duration: 5, repeat: Infinity, delay, ease: 'easeInOut' },
    }}
    style={{
      position: 'absolute',
      ...position,
      width: size,
      height: size,
      background: `linear-gradient(135deg, ${color}90 0%, ${color}40 50%, ${color}20 100%)`,
      boxShadow: `0 10px 30px ${color}30`,
      pointerEvents: 'none',
      zIndex: 1,
    }}
  />
);

export const LuxuryHomeBackground: React.FC<LuxuryHomeBackgroundProps> = ({ section = 'full' }) => {
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
      {/* Ambient gradient clouds */}
      <FloatingCloud
        size={400}
        color="rgba(16, 185, 129, 0.15)"
        position={{ top: '5%', right: '10%' }}
        delay={0}
      />
      <FloatingCloud
        size={350}
        color="rgba(6, 182, 212, 0.12)"
        position={{ top: '20%', left: '5%' }}
        delay={2}
      />
      <FloatingCloud
        size={300}
        color="rgba(52, 211, 153, 0.1)"
        position={{ bottom: '30%', right: '5%' }}
        delay={4}
      />

      {/* 3D Crystals */}
      <Crystal3D
        size={80}
        color="#10b981"
        secondaryColor="#34d399"
        position={{ top: '15%', right: '15%' }}
        delay={0}
        rotation={-10}
      />
      <Crystal3D
        size={60}
        color="#06b6d4"
        secondaryColor="#22d3ee"
        position={{ top: '35%', right: '8%' }}
        delay={1}
        rotation={15}
      />
      <Crystal3D
        size={50}
        color="#14b8a6"
        secondaryColor="#2dd4bf"
        position={{ bottom: '25%', left: '12%' }}
        delay={2}
        rotation={-5}
      />

      {/* Geometric Spheres */}
      <GeometricSphere
        size={100}
        color="rgba(16, 185, 129, 0.4)"
        position={{ top: '10%', left: '20%' }}
        delay={0.5}
      />
      <GeometricSphere
        size={70}
        color="rgba(6, 182, 212, 0.35)"
        position={{ bottom: '20%', right: '18%' }}
        delay={1.5}
      />
      <GeometricSphere
        size={50}
        color="rgba(52, 211, 153, 0.3)"
        position={{ top: '45%', left: '8%' }}
        delay={2.5}
      />

      {/* Hexagonal Platforms */}
      <HexPlatform
        size={180}
        position={{ bottom: '15%', right: '25%' }}
        delay={0}
      />
      <HexPlatform
        size={140}
        position={{ top: '60%', left: '15%' }}
        delay={1}
      />
      <HexPlatform
        size={120}
        position={{ top: '25%', right: '30%' }}
        delay={2}
      />

      {/* Diamonds */}
      <Diamond3D
        size={40}
        color="#10b981"
        position={{ top: '30%', left: '25%' }}
        delay={0.5}
      />
      <Diamond3D
        size={30}
        color="#06b6d4"
        position={{ bottom: '35%', right: '12%' }}
        delay={1.5}
      />
      <Diamond3D
        size={25}
        color="#14b8a6"
        position={{ top: '55%', right: '22%' }}
        delay={2.5}
      />

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <FloatingParticle
          key={i}
          size={4 + Math.random() * 6}
          color={['#10b981', '#06b6d4', '#14b8a6', '#34d399'][Math.floor(Math.random() * 4)]}
          position={{
            bottom: `${10 + Math.random() * 30}%`,
            left: `${10 + Math.random() * 80}%`,
          }}
          delay={i * 0.5}
        />
      ))}

      {/* Water wave at bottom */}
      <WaterWave position={{ bottom: '0' }} />

      {/* Subtle grid pattern overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default LuxuryHomeBackground;
