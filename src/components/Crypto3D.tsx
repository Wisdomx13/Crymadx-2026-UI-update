import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment, OrbitControls } from '@react-three/drei';

// Crypto coin colors
const cryptoColors = {
  BTC: { primary: '#F7931A', secondary: '#FF9500' },
  ETH: { primary: '#627EEA', secondary: '#8B9FFF' },
  SOL: { primary: '#14F195', secondary: '#9945FF' },
  BNB: { primary: '#F3BA2F', secondary: '#FFD93D' },
  USDT: { primary: '#26A17B', secondary: '#50E3A4' },
  XRP: { primary: '#23292F', secondary: '#00AAE4' },
};

type CryptoSymbol = keyof typeof cryptoColors;

// 3D Coin Component
interface CoinProps {
  symbol: CryptoSymbol;
  position?: [number, number, number];
  scale?: number;
  rotationSpeed?: number;
}

const Coin: React.FC<CoinProps> = ({
  symbol,
  position = [0, 0, 0],
  scale = 1,
  rotationSpeed = 0.005
}) => {
  const meshRef = useRef<any>(null);
  const colors = cryptoColors[symbol];

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={position} scale={scale}>
        {/* Main coin body */}
        <mesh ref={meshRef}>
          <cylinderGeometry args={[1, 1, 0.15, 64]} />
          <meshStandardMaterial
            color={colors.primary}
            metalness={0.9}
            roughness={0.1}
            envMapIntensity={1}
          />
        </mesh>

        {/* Coin rim glow */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[1, 0.05, 16, 64]} />
          <meshStandardMaterial
            color={colors.secondary}
            metalness={1}
            roughness={0}
            emissive={colors.secondary}
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Symbol text on front */}
        <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.6, 32]} />
          <meshStandardMaterial
            color={colors.secondary}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
      </group>
    </Float>
  );
};

// Floating Particles
const Particles: React.FC<{ count?: number }> = ({ count = 50 }) => {
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
        ] as [number, number, number],
        size: Math.random() * 0.03 + 0.01,
        speed: Math.random() * 0.02 + 0.01,
      });
    }
    return temp;
  }, [count]);

  return (
    <group>
      {particles.map((particle, i) => (
        <ParticlePoint key={i} {...particle} />
      ))}
    </group>
  );
};

const ParticlePoint: React.FC<{
  position: [number, number, number];
  size: number;
  speed: number;
}> = ({ position, size, speed }) => {
  const ref = useRef<any>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y += speed;
      if (ref.current.position.y > 5) {
        ref.current.position.y = -5;
      }
      ref.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial color="#00ff88" transparent opacity={0.5} />
    </mesh>
  );
};

// Ambient Glow Orb
interface GlowOrbProps {
  position?: [number, number, number];
  color?: string;
  intensity?: number;
  size?: number;
}

const GlowOrb: React.FC<GlowOrbProps> = ({
  position = [0, 0, 0],
  color = '#00ff88',
  intensity = 1,
  size = 1
}) => {
  const meshRef = useRef<any>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.scale.setScalar(scale * size);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <MeshDistortMaterial
        color={color}
        transparent
        opacity={0.15 * intensity}
        distort={0.3}
        speed={2}
      />
    </mesh>
  );
};

// Main 3D Scene Component
interface Crypto3DSceneProps {
  coins?: CryptoSymbol[];
  showParticles?: boolean;
  showOrbs?: boolean;
  autoRotate?: boolean;
  height?: string | number;
}

export const Crypto3DScene: React.FC<Crypto3DSceneProps> = ({
  coins = ['BTC', 'ETH', 'SOL'],
  showParticles = true,
  showOrbs = true,
  autoRotate = true,
  height = '400px',
}) => {
  const coinPositions: [number, number, number][] = useMemo(() => {
    const positions: [number, number, number][] = [];
    const angleStep = (2 * Math.PI) / coins.length;
    const radius = 2.5;

    coins.forEach((_, i) => {
      const angle = i * angleStep;
      positions.push([
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius,
      ]);
    });

    return positions;
  }, [coins]);

  return (
    <div style={{ width: '100%', height, position: 'relative', pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 2, 6], fov: 50 }}
        style={{ background: 'transparent', pointerEvents: 'none' }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          {/* Lighting - Emerald theme */}
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#00ff88" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ffd5" />
          <spotLight
            position={[0, 10, 0]}
            angle={0.3}
            penumbra={1}
            intensity={0.8}
            color="#ffffff"
          />

          {/* Environment for reflections */}
          <Environment preset="night" />

          {/* Coins */}
          {coins.map((symbol, i) => (
            <Coin
              key={symbol}
              symbol={symbol}
              position={coinPositions[i]}
              scale={0.8}
              rotationSpeed={0.01 + i * 0.002}
            />
          ))}

          {/* Particles */}
          {showParticles && <Particles count={30} />}

          {/* Ambient Orbs - Emerald colors */}
          {showOrbs && (
            <>
              <GlowOrb position={[-3, -1, -2]} color="#00ff88" size={2} intensity={0.5} />
              <GlowOrb position={[3, 1, -3]} color="#00ffd5" size={1.5} intensity={0.4} />
            </>
          )}

          {/* Controls */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={autoRotate}
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

// Single Floating Coin (for smaller displays)
interface FloatingCoinProps {
  symbol: CryptoSymbol;
  size?: number;
}

export const FloatingCoin: React.FC<FloatingCoinProps> = ({ symbol, size = 150 }) => {
  return (
    <div style={{ width: size, height: size, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        style={{ background: 'transparent', pointerEvents: 'none' }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} intensity={1} color="#00ff88" />
          <Environment preset="night" />
          <Coin symbol={symbol} scale={0.7} rotationSpeed={0.02} />
        </Suspense>
      </Canvas>
    </div>
  );
};

// Hero Section 3D Background
export const Hero3DBackground: React.FC = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        opacity: 0.6,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        style={{ background: 'transparent', pointerEvents: 'none' }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#00ff88" />
          <pointLight position={[-10, -10, 5]} intensity={0.3} color="#00ffd5" />

          {/* Floating coins in background */}
          <Coin symbol="BTC" position={[-4, 2, -5]} scale={0.5} rotationSpeed={0.003} />
          <Coin symbol="ETH" position={[4, -1, -6]} scale={0.4} rotationSpeed={0.004} />
          <Coin symbol="SOL" position={[-2, -2, -4]} scale={0.3} rotationSpeed={0.005} />
          <Coin symbol="BNB" position={[3, 1.5, -7]} scale={0.35} rotationSpeed={0.0035} />

          {/* Ambient orbs - Emerald colors */}
          <GlowOrb position={[-5, 3, -8]} color="#00ff88" size={3} intensity={0.3} />
          <GlowOrb position={[5, -2, -10]} color="#00ffd5" size={2.5} intensity={0.25} />

          {/* Particles */}
          <Particles count={40} />
        </Suspense>
      </Canvas>
    </div>
  );
};

// Animated Crypto Icon (CSS-based for performance)
interface AnimatedCryptoIconProps {
  symbol: CryptoSymbol;
  size?: number;
  className?: string;
}

export const AnimatedCryptoIcon: React.FC<AnimatedCryptoIconProps> = ({
  symbol,
  size = 48,
  className,
}) => {
  const colors = cryptoColors[symbol];

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 0 20px ${colors.primary}40, 0 0 40px ${colors.primary}20`,
        animation: 'floatCrypto 3s ease-in-out infinite',
        fontSize: size * 0.35,
        fontWeight: 800,
        color: symbol === 'XRP' ? '#fff' : '#0a0e14',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {symbol === 'BTC' && '₿'}
      {symbol === 'ETH' && 'Ξ'}
      {symbol === 'SOL' && 'S'}
      {symbol === 'BNB' && 'B'}
      {symbol === 'USDT' && '₮'}
      {symbol === 'XRP' && 'X'}
    </div>
  );
};

export default Crypto3DScene;
