import React from 'react';
import { motion } from 'framer-motion';

interface Circuit3DCubeProps {
  size?: number;
}

// 3D Isometric Hexagonal Platform - Thicker and more prominent
const IsometricPlatform: React.FC<{
  x: number;
  y: number;
  scale?: number;
  delay?: number;
  layers?: number;
}> = ({ x, y, scale = 1, delay = 0, layers = 3 }) => {
  const baseWidth = 140 * scale;
  const baseHeight = 80 * scale;
  const layerHeight = 28 * scale;

  return (
    <motion.g
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
    >
      {/* Drop shadow */}
      <ellipse
        cx={x}
        cy={y + layers * layerHeight + 15}
        rx={baseWidth * 0.4}
        ry={baseHeight * 0.25}
        fill="rgba(0, 80, 60, 0.15)"
        filter="url(#platformShadow)"
      />

      {/* Stack of hexagonal layers */}
      {Array.from({ length: layers }).map((_, i) => {
        const layerY = y - i * layerHeight;
        const layerOpacity = 1 - i * 0.08;
        return (
          <g key={i}>
            {/* Platform top face - brighter */}
            <polygon
              points={`
                ${x},${layerY - baseHeight / 2}
                ${x + baseWidth / 2},${layerY - baseHeight / 4}
                ${x + baseWidth / 2},${layerY + baseHeight / 4}
                ${x},${layerY + baseHeight / 2}
                ${x - baseWidth / 2},${layerY + baseHeight / 4}
                ${x - baseWidth / 2},${layerY - baseHeight / 4}
              `}
              fill={`rgba(220, 245, 240, ${layerOpacity})`}
              stroke="rgba(150, 210, 195, 0.6)"
              strokeWidth="1.5"
            />
            {/* Top face highlight */}
            <polygon
              points={`
                ${x},${layerY - baseHeight / 2}
                ${x + baseWidth / 2},${layerY - baseHeight / 4}
                ${x},${layerY}
                ${x - baseWidth / 2},${layerY - baseHeight / 4}
              `}
              fill={`rgba(255, 255, 255, ${layerOpacity * 0.4})`}
            />
            {/* Left side - darker */}
            <polygon
              points={`
                ${x - baseWidth / 2},${layerY - baseHeight / 4}
                ${x},${layerY + baseHeight / 2}
                ${x},${layerY + baseHeight / 2 + layerHeight}
                ${x - baseWidth / 2},${layerY - baseHeight / 4 + layerHeight}
              `}
              fill={`rgba(120, 190, 175, ${layerOpacity * 0.95})`}
              stroke="rgba(100, 170, 155, 0.4)"
              strokeWidth="0.5"
            />
            {/* Right side - medium */}
            <polygon
              points={`
                ${x + baseWidth / 2},${layerY - baseHeight / 4}
                ${x},${layerY + baseHeight / 2}
                ${x},${layerY + baseHeight / 2 + layerHeight}
                ${x + baseWidth / 2},${layerY - baseHeight / 4 + layerHeight}
              `}
              fill={`rgba(100, 175, 160, ${layerOpacity * 0.9})`}
              stroke="rgba(80, 155, 140, 0.4)"
              strokeWidth="0.5"
            />
          </g>
        );
      })}
    </motion.g>
  );
};

// Crystal/Ice Shard - Thicker and more 3D
const CrystalShard: React.FC<{
  x: number;
  y: number;
  scale?: number;
  rotation?: number;
  delay?: number;
}> = ({ x, y, scale = 1, rotation = 0, delay = 0 }) => (
  <motion.g
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1, delay }}
  >
    <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}>
      {/* Crystal shadow */}
      <ellipse
        cx={5}
        cy={55}
        rx={12}
        ry={6}
        fill="rgba(0, 80, 70, 0.2)"
      />
      {/* Main crystal body - darker base */}
      <polygon
        points="0,-50 20,-15 14,35 0,55 -14,35 -20,-15"
        fill="url(#crystalGradientDark)"
        stroke="rgba(100, 200, 190, 0.5)"
        strokeWidth="1"
      />
      {/* Crystal back facet */}
      <polygon
        points="0,-50 -20,-15 -14,35 0,55"
        fill="rgba(60, 160, 150, 0.6)"
      />
      {/* Crystal front highlight */}
      <polygon
        points="0,-50 20,-15 8,-10 0,-45"
        fill="rgba(255, 255, 255, 0.7)"
      />
      {/* Crystal side highlight */}
      <polygon
        points="20,-15 14,35 8,30 12,-12"
        fill="rgba(255, 255, 255, 0.35)"
      />
      {/* Inner facet glow */}
      <polygon
        points="0,-15 10,20 0,50 -10,20"
        fill="rgba(200, 255, 250, 0.3)"
      />
      {/* Bright center line */}
      <line
        x1="0"
        y1="-45"
        x2="0"
        y2="50"
        stroke="rgba(255, 255, 255, 0.4)"
        strokeWidth="2"
      />
    </g>
  </motion.g>
);

// Water Splash Effect - More prominent
const WaterSplash: React.FC<{
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
}> = ({ x, y, scale = 1, flip = false }) => (
  <g transform={`translate(${x}, ${y}) scale(${flip ? -scale : scale}, ${scale})`}>
    {/* Main splash wave - thicker */}
    <path
      d="M0,0 Q35,-50 70,-25 Q105,-65 140,-35 Q175,-75 210,-30 Q235,-55 260,-25 Q285,-45 300,0"
      fill="none"
      stroke="url(#splashGradient)"
      strokeWidth="5"
      opacity="0.7"
      strokeLinecap="round"
    />
    {/* Secondary splash */}
    <path
      d="M25,15 Q50,-30 85,-12 Q120,-45 155,-20 Q190,-50 225,-25"
      fill="none"
      stroke="url(#splashGradient)"
      strokeWidth="3"
      opacity="0.5"
      strokeLinecap="round"
    />
    {/* Tertiary wave */}
    <path
      d="M50,25 Q75,-15 110,0 Q145,-25 180,-5"
      fill="none"
      stroke="rgba(255, 255, 255, 0.4)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Water droplets - larger */}
    <circle cx="60" cy="-40" r="6" fill="rgba(200, 255, 250, 0.8)" />
    <circle cx="120" cy="-55" r="5" fill="rgba(200, 255, 250, 0.7)" />
    <circle cx="180" cy="-45" r="7" fill="rgba(200, 255, 250, 0.6)" />
    <circle cx="220" cy="-60" r="4" fill="rgba(200, 255, 250, 0.5)" />
    <circle cx="90" cy="-35" r="3" fill="rgba(255, 255, 255, 0.7)" />
    <circle cx="150" cy="-50" r="4" fill="rgba(255, 255, 255, 0.6)" />
  </g>
);

// Floating particle/bubble - More visible
const FloatingParticle: React.FC<{
  cx: number;
  cy: number;
  r: number;
  delay?: number;
}> = ({ cx, cy, r, delay = 0 }) => (
  <motion.g
    initial={{ opacity: 0 }}
    animate={{
      opacity: [0.4, 0.9, 0.4],
      y: [0, -20, 0],
    }}
    transition={{
      duration: 5,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill="rgba(200, 255, 250, 0.7)"
      filter="url(#particleGlow)"
    />
    <circle
      cx={cx - r * 0.3}
      cy={cy - r * 0.3}
      r={r * 0.4}
      fill="rgba(255, 255, 255, 0.8)"
    />
  </motion.g>
);

export const Circuit3DCube: React.FC<Circuit3DCubeProps> = ({ size = 800 }) => {
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
      {/* Teal/Green Gradient Background - Darker and greener */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            linear-gradient(135deg,
              rgba(16, 185, 129, 0.28) 0%,
              rgba(20, 170, 140, 0.35) 25%,
              rgba(15, 160, 130, 0.32) 50%,
              rgba(34, 197, 150, 0.25) 75%,
              rgba(52, 211, 153, 0.18) 100%
            )
          `,
        }}
      />

      {/* Ambient glow spots - Clean, minimal blur */}
      <motion.div
        animate={{ opacity: [0.3, 0.45, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '5%',
          right: '15%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(16, 185, 129, 0.08) 40%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(30px)',
        }}
      />
      <motion.div
        animate={{ opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '5%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(20, 180, 140, 0.22) 0%, rgba(20, 180, 140, 0.06) 40%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(25px)',
        }}
      />
      <motion.div
        animate={{ opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{
          position: 'absolute',
          top: '40%',
          left: '30%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.05) 40%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(20px)',
        }}
      />

      {/* Main SVG with platforms and crystals */}
      <svg
        viewBox="0 0 1400 900"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <defs>
          {/* Crystal gradient - darker */}
          <linearGradient id="crystalGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b0f0e8" stopOpacity="0.95" />
            <stop offset="30%" stopColor="#70d0c8" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#40b0a8" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#309090" stopOpacity="0.65" />
          </linearGradient>

          {/* Splash gradient - more visible */}
          <linearGradient id="splashGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(200, 255, 250, 0.2)" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.9)" />
            <stop offset="100%" stopColor="rgba(200, 255, 250, 0.2)" />
          </linearGradient>

          {/* Platform shadow filter - cleaner */}
          <filter id="platformShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
          </filter>

          {/* Particle glow - subtle */}
          <filter id="particleGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Soft glow filter - reduced */}
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background crystals - left side - bigger */}
        <CrystalShard x={70} y={180} scale={1.5} rotation={-12} delay={0.2} />
        <CrystalShard x={160} y={380} scale={1.1} rotation={8} delay={0.4} />
        <CrystalShard x={40} y={550} scale={1.3} rotation={-8} delay={0.6} />
        <CrystalShard x={120} y={700} scale={0.9} rotation={15} delay={0.8} />

        {/* Background crystals - right side - bigger */}
        <CrystalShard x={1320} y={130} scale={1.7} rotation={18} delay={0.3} />
        <CrystalShard x={1360} y={320} scale={1.2} rotation={-12} delay={0.5} />
        <CrystalShard x={1300} y={520} scale={1.4} rotation={10} delay={0.7} />
        <CrystalShard x={1340} y={720} scale={1} rotation={-15} delay={0.9} />

        {/* Water splash effects - more prominent */}
        <WaterSplash x={-20} y={280} scale={1.3} />
        <WaterSplash x={1050} y={220} scale={1.1} flip={true} />
        <WaterSplash x={80} y={580} scale={1} />
        <WaterSplash x={950} y={680} scale={1.2} flip={true} />

        {/* 3D Isometric Platforms - Thicker, arranged for the crypto cards area */}
        {/* Back row */}
        <IsometricPlatform x={880} y={250} scale={1.4} delay={0.1} layers={5} />
        <IsometricPlatform x={1120} y={320} scale={1.2} delay={0.2} layers={4} />

        {/* Middle row */}
        <IsometricPlatform x={820} y={420} scale={1.6} delay={0.3} layers={6} />
        <IsometricPlatform x={1040} y={480} scale={1.4} delay={0.4} layers={5} />
        <IsometricPlatform x={1280} y={450} scale={1.1} delay={0.5} layers={4} />

        {/* Front row */}
        <IsometricPlatform x={760} y={600} scale={1.7} delay={0.6} layers={5} />
        <IsometricPlatform x={980} y={670} scale={1.5} delay={0.7} layers={4} />
        <IsometricPlatform x={1220} y={630} scale={1.3} delay={0.8} layers={5} />

        {/* Floating particles/bubbles - more visible */}
        <FloatingParticle cx={180} cy={280} r={8} delay={0} />
        <FloatingParticle cx={320} cy={420} r={6} delay={0.5} />
        <FloatingParticle cx={1220} cy={180} r={7} delay={1} />
        <FloatingParticle cx={1320} cy={380} r={6} delay={1.5} />
        <FloatingParticle cx={90} cy={580} r={7} delay={2} />
        <FloatingParticle cx={1360} cy={580} r={8} delay={2.5} />
        <FloatingParticle cx={920} cy={320} r={5} delay={0.8} />
        <FloatingParticle cx={1140} cy={530} r={6} delay={1.2} />
        <FloatingParticle cx={250} cy={650} r={5} delay={1.8} />
        <FloatingParticle cx={1280} cy={750} r={6} delay={2.2} />

        {/* Additional crystals for more coverage */}
        <CrystalShard x={280} y={120} scale={0.7} rotation={22} delay={0.9} />
        <CrystalShard x={1180} y={780} scale={0.8} rotation={-18} delay={1.1} />
        <CrystalShard x={650} y={820} scale={0.6} rotation={28} delay={1.3} />
        <CrystalShard x={350} y={480} scale={0.6} rotation={-25} delay={1.5} />
      </svg>

      {/* Subtle shimmer overlay */}
      <motion.div
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            linear-gradient(
              45deg,
              transparent 35%,
              rgba(255, 255, 255, 0.04) 42%,
              rgba(255, 255, 255, 0.08) 50%,
              rgba(255, 255, 255, 0.04) 58%,
              transparent 65%
            )
          `,
          backgroundSize: '200% 200%',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default Circuit3DCube;
