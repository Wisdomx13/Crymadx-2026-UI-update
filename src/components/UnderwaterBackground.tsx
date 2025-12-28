import React, { useMemo, useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import { useThemeMode } from '../theme/ThemeContext';

// Get window dimensions safely
const getWindowDimensions = () => {
  if (typeof window !== 'undefined') {
    return { width: window.innerWidth, height: window.innerHeight };
  }
  return { width: 1920, height: 1080 };
};

// ============================================
// 3D COIN COMPONENT (Three.js)
// ============================================

const cryptoColors: Record<string, { primary: string; secondary: string }> = {
  BTC: { primary: '#F7931A', secondary: '#FF9500' },
  ETH: { primary: '#627EEA', secondary: '#8B9FFF' },
  SOL: { primary: '#9945FF', secondary: '#14F195' },
  BNB: { primary: '#F0B90B', secondary: '#FFD93D' },
};

interface Coin3DProps {
  symbol: 'BTC' | 'ETH' | 'SOL' | 'BNB';
  position: [number, number, number];
  scale?: number;
  rotationSpeed?: number;
}

const Coin3D: React.FC<Coin3DProps> = ({
  symbol,
  position,
  scale = 1,
  rotationSpeed = 0.01
}) => {
  const meshRef = React.useRef<any>(null);
  const colors = cryptoColors[symbol];

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
      <group position={position} scale={scale}>
        {/* Main coin body */}
        <mesh ref={meshRef}>
          <cylinderGeometry args={[1, 1, 0.15, 64]} />
          <meshStandardMaterial
            color={colors.primary}
            metalness={0.95}
            roughness={0.05}
            envMapIntensity={1.5}
          />
        </mesh>

        {/* Coin rim glow */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[1, 0.06, 16, 64]} />
          <meshStandardMaterial
            color={colors.secondary}
            metalness={1}
            roughness={0}
            emissive={colors.secondary}
            emissiveIntensity={0.8}
          />
        </mesh>

        {/* Symbol face */}
        <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.65, 32]} />
          <meshStandardMaterial
            color={colors.secondary}
            metalness={0.8}
            roughness={0.15}
          />
        </mesh>
      </group>
    </Float>
  );
};

// 3D Particle for ambient effect
const Particle3D: React.FC<{ position: [number, number, number]; size: number; color: string }> = ({
  position,
  size,
  color
}) => {
  const ref = React.useRef<any>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y += 0.005;
      if (ref.current.position.y > 5) {
        ref.current.position.y = -5;
      }
      ref.current.material.opacity = 0.4 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 12, 12]} />
      <meshBasicMaterial color={color} transparent opacity={0.5} />
    </mesh>
  );
};

// 3D Glow Orb
const GlowOrb3D: React.FC<{ position: [number, number, number]; color: string; size: number }> = ({
  position,
  color,
  size
}) => {
  const meshRef = React.useRef<any>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
      meshRef.current.scale.setScalar(scale * size);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.25}
      />
    </mesh>
  );
};

// ============================================
// 3D SCENE FOR DARK MODE
// ============================================

const DarkMode3DScene: React.FC = () => {
  // Coin positions scattered across the scene
  const coinConfigs = useMemo(() => [
    { symbol: 'BTC' as const, position: [-3.5, 0, -2] as [number, number, number], scale: 0.9, rotationSpeed: 0.008 },
    { symbol: 'ETH' as const, position: [3.5, 1, -3] as [number, number, number], scale: 0.75, rotationSpeed: 0.012 },
    { symbol: 'SOL' as const, position: [-1.5, -1.5, -1.5] as [number, number, number], scale: 0.65, rotationSpeed: 0.015 },
    { symbol: 'BNB' as const, position: [2, -0.5, -4] as [number, number, number], scale: 0.7, rotationSpeed: 0.01 },
    { symbol: 'BTC' as const, position: [0, 2, -5] as [number, number, number], scale: 0.55, rotationSpeed: 0.007 },
    { symbol: 'ETH' as const, position: [-4, 1.5, -4] as [number, number, number], scale: 0.5, rotationSpeed: 0.009 },
  ], []);

  // Particles
  const particles = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8 - 3,
      ] as [number, number, number],
      size: 0.02 + Math.random() * 0.04,
      color: ['#02c076', '#00d4aa', '#f0b90b'][i % 3],
    }))
  , []);

  // Glow orbs
  const orbs = useMemo(() => [
    { position: [-5, 2, -6] as [number, number, number], color: '#02c076', size: 1.5 },
    { position: [5, -1, -7] as [number, number, number], color: '#00d4aa', size: 1.2 },
    { position: [0, 3, -8] as [number, number, number], color: '#f0b90b', size: 1 },
  ], []);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 5]} intensity={1.2} color="#02c076" />
      <pointLight position={[-10, -5, 5]} intensity={0.6} color="#00d4aa" />
      <pointLight position={[0, 5, 10]} intensity={0.4} color="#f0b90b" />
      <spotLight
        position={[0, 10, 5]}
        angle={0.4}
        penumbra={1}
        intensity={0.6}
        color="#ffffff"
      />

      {/* Environment for reflections */}
      <Environment preset="night" />

      {/* 3D Coins */}
      {coinConfigs.map((config, i) => (
        <Coin3D key={i} {...config} />
      ))}

      {/* Floating Particles */}
      {particles.map((p) => (
        <Particle3D key={p.id} {...p} />
      ))}

      {/* Glow Orbs */}
      {orbs.map((orb, i) => (
        <GlowOrb3D key={i} {...orb} />
      ))}
    </>
  );
};

// ============================================
// 2D AMBIENT OVERLAY (for dark mode)
// ============================================

const GlowingOrb2D: React.FC<{
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
}> = ({ x, y, size, color, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: [0.2, 0.6, 0.3, 0.5, 0.2],
        scale: [0.8, 1.2, 1, 1.1, 0.8],
        y: [y, y - 30, y + 20, y - 10, y],
        x: [x, x + 20, x - 15, x + 10, x],
      }}
      transition={{
        duration: 12,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, ${color}60 40%, transparent 70%)`,
        boxShadow: `0 0 ${size * 2}px ${color}, 0 0 ${size * 3}px ${color}50`,
        zIndex: 2,
      }}
    />
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export const UnderwaterBackground: React.FC = () => {
  const { isDark } = useThemeMode();
  const [dimensions, setDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    const handleResize = () => setDimensions(getWindowDimensions());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2D orbs data for dark mode (used alongside 3D)
  const darkOrbs2D = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      size: 6 + Math.random() * 10,
      color: ['#02c076', '#00d4aa', '#f0b90b', '#627EEA', '#9945FF'][i % 5],
      delay: Math.random() * 6,
    }))
  , [dimensions.width, dimensions.height]);

  // ============================================
  // LIGHT MODE - Return null for clean white background
  // ============================================
  if (!isDark) {
    return null;
  }

  // ============================================
  // DARK MODE - 3D Coins + 2D Ambient Effects
  // ============================================
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        background: '#0c0d0f',
      }}
    >
      {/* Ambient gradient mesh */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 80% 60% at 20% 20%, rgba(2, 192, 118, 0.06) 0%, transparent 50%),
            radial-gradient(ellipse 60% 50% at 80% 80%, rgba(0, 212, 170, 0.05) 0%, transparent 50%),
            radial-gradient(ellipse 70% 40% at 50% 50%, rgba(240, 185, 11, 0.03) 0%, transparent 60%)
          `,
          zIndex: 1,
        }}
      />

      {/* 3D Three.js Canvas - Floating Coins */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 5 }}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          style={{ background: 'transparent' }}
          gl={{ alpha: true, antialias: true }}
        >
          <Suspense fallback={null}>
            <DarkMode3DScene />
          </Suspense>
        </Canvas>
      </div>

      {/* 2D Glowing orbs for ambient effect */}
      {darkOrbs2D.map((orb) => (
        <GlowingOrb2D key={orb.id} {...orb} />
      ))}

      {/* Top ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          height: '350px',
          background: 'radial-gradient(ellipse at center top, rgba(2, 192, 118, 0.08) 0%, transparent 70%)',
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default UnderwaterBackground;
