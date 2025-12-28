import React from 'react';
import { motion } from 'framer-motion';

interface GlowingSnowBackgroundProps {
  /** Whether to show this background - typically only shown in light mode */
  show?: boolean;
  /** Background image URL - defaults to /main-bg.jpg */
  backgroundImage?: string;
  /** Intensity of snow and glow effects - 'low', 'medium', 'high' */
  intensity?: 'low' | 'medium' | 'high';
  /** Whether to show the top fade gradient */
  showTopFade?: boolean;
  /** Custom overlay color */
  overlayColor?: string;
}

export const GlowingSnowBackground: React.FC<GlowingSnowBackgroundProps> = ({
  show = true,
  backgroundImage = '/main-bg.jpg',
  intensity = 'high',
  showTopFade = false,
  overlayColor,
}) => {
  if (!show) return null;

  // Determine particle counts based on intensity - reduced for cleaner look
  const snowParticleCount = intensity === 'high' ? 40 : intensity === 'medium' ? 25 : 15;

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Main Background Image with subtle parallax */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{
          scale: [1.1, 1.15, 1.1],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          right: '-10%',
          height: '130%',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(1.0) saturate(1.1)',
        }}
      />

      {/* Very subtle dark overlay for better contrast - NO WHITE */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: overlayColor || 'linear-gradient(180deg, rgba(0,20,40,0.15) 0%, rgba(0,30,60,0.1) 50%, rgba(0,20,50,0.12) 100%)',
      }} />

      {/* Animated Snow Particles - Smaller, cleaner */}
      {[...Array(snowParticleCount)].map((_, i) => {
        const size = 2 + Math.random() * 4;
        return (
          <motion.div
            key={`snow-${i}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: [0, 0.8, 0.6, 0.8, 0],
              y: [0, 600 + Math.random() * 400],
              x: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 100],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              delay: i * 0.3,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${-5 + Math.random() * 15}%`,
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 60%, transparent 100%)',
              boxShadow: `0 0 ${size * 2}px rgba(255,255,255,0.6)`,
            }}
          />
        );
      })}

      {/* Subtle sparkle particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          animate={{
            opacity: [0, 0.7, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            width: '3px',
            height: '3px',
            borderRadius: '50%',
            background: 'white',
            boxShadow: '0 0 8px rgba(255,255,255,0.8)',
          }}
        />
      ))}

      {/* Top fade transition - darker for contrast */}
      {showTopFade && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '200px',
          background: 'linear-gradient(180deg, rgba(10,30,50,0.6) 0%, rgba(20,40,70,0.3) 50%, transparent 100%)',
          pointerEvents: 'none',
        }} />
      )}
    </motion.div>
  );
};

export default GlowingSnowBackground;
