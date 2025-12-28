import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Lock,
  Smartphone,
  BarChart3,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Menu,
  X,
  Award,
  Users,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Repeat,
  CreditCard,
  Gift,
  Star,
  Search,
  Coins,
  Banknote,
  UserPlus,
  PieChart,
  ShieldCheck,
  ArrowRightLeft,
  Vault,
  Bot,
  Sun,
  Moon,
} from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button, CryptoIcon, LuxuryHomeBackground, GlowingSnowBackground } from '../../components';
import { usePresentationMode } from '../../components/PresentationMode';
import { LiquidGlassBackground, LiquidOrb, LiquidRing } from '../../components/Glass3D';

// Real Social Media Icons as SVG with Brand Colors
const TwitterXIcon = ({ size = 20, color }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color || 'currentColor'}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const TelegramIcon = ({ size = 20, color }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color || 'currentColor'}>
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const DiscordIcon = ({ size = 20, color }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color || 'currentColor'}>
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
  </svg>
);

const InstagramIcon = ({ size = 20, color }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color || 'currentColor'}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const YouTubeIcon = ({ size = 20, color }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color || 'currentColor'}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const LinkedInIcon = ({ size = 20, color }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color || 'currentColor'}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

// Social links with brand colors
const socialLinks = [
  { icon: TwitterXIcon, label: 'Twitter / X', href: 'https://twitter.com/crymadx', color: '#000000' },
  { icon: TelegramIcon, label: 'Telegram', href: 'https://t.me/crymadx', color: '#0088cc' },
  { icon: DiscordIcon, label: 'Discord', href: 'https://discord.gg/crymadx', color: '#5865F2' },
  { icon: InstagramIcon, label: 'Instagram', href: 'https://instagram.com/crymadx', color: '#E4405F' },
  { icon: YouTubeIcon, label: 'YouTube', href: 'https://youtube.com/@crymadx', color: '#FF0000' },
  { icon: LinkedInIcon, label: 'LinkedIn', href: 'https://linkedin.com/company/crymadx', color: '#0A66C2' },
];

// Counting Users Animation Component
const CountingUsersStat: React.FC<{ colors: any; isDark?: boolean }> = ({ colors, isDark = true }) => {
  const [count, setCount] = useState(0);
  const targetCount = 50000;

  useEffect(() => {
    const duration = 2500; // 2.5 seconds
    const steps = 60;
    const increment = targetCount / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetCount) {
        setCount(targetCount);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: isDark ? colors.text.tertiary : '#ffffff',
      fontSize: '14px',
      fontWeight: 600,
      textShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.5)',
    }}>
      <span style={{ color: '#00ff88', filter: isDark ? 'none' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }}><Users size={16} /></span>
      <span>{count.toLocaleString()}+ Users</span>
    </div>
  );
};

// Market data for crypto cards
const cryptoPrices = [
  { symbol: 'BTC', name: 'Bitcoin', price: 88345.50, change: 0.67 },
  { symbol: 'ETH', name: 'Ethereum', price: 2987.40, change: 1.60 },
  { symbol: 'SOL', name: 'Solana', price: 126.66, change: 2.19 },
  { symbol: 'XRP', name: 'Ripple', price: 1.9291, change: 3.57 },
  { symbol: 'BNB', name: 'BNB', price: 612.45, change: 1.89 },
  { symbol: 'DOGE', name: 'Dogecoin', price: 0.3245, change: -1.25 },
];

// Core features for "Why Choose CrymadX"
const coreFeatures = [
  { icon: <Shield size={24} />, title: 'Bank-Grade Security', description: 'Multi-signature wallets with 98% cold storage protection.' },
  { icon: <Zap size={24} />, title: 'Lightning Fast', description: 'Execute trades in under 10ms with our matching engine.' },
  { icon: <Globe size={24} />, title: 'Global Access', description: 'Trade 24/7 from 150+ countries with local support.' },
  { icon: <BarChart3 size={24} />, title: 'Pro Trading Tools', description: 'TradingView charts with 100+ indicators & signals.' },
  { icon: <Lock size={24} />, title: 'Multi-Layer Auth', description: '2FA, biometrics, and hardware key support.' },
  { icon: <Smartphone size={24} />, title: 'Mobile First', description: 'Full-featured iOS and Android trading apps.' },
];

// Platform features - Curated list (removed NFT, Institutional API, Debit Cards)
const platformFeatures = [
  { icon: <Coins size={28} />, title: 'Spot Trading Engine', description: 'Ultra-fast matching engine supporting 100,000+ TPS with instant execution and deep liquidity pools.', color: '#00ff88', lightBg: 'green' },
  { icon: <Layers size={28} />, title: 'Staking Expansion', description: 'Stake 50+ assets with flexible terms. Earn up to 25% APY with our advanced staking protocols.', color: '#00ffd5', lightBg: 'teal' },
  { icon: <Banknote size={28} />, title: 'Fiat On/Off Ramp', description: 'Seamless fiat integration with 50+ currencies. Buy crypto with cards, bank transfers, and more.', color: '#ffd700', lightBg: 'gold' },
  { icon: <UserPlus size={28} />, title: 'Referral System Upgrade', description: 'Earn up to 40% commission on referred trades. Multi-tier rewards with lifetime tracking.', color: '#ff6b6b', lightBg: 'pink' },
  { icon: <PieChart size={28} />, title: 'Advanced Portfolio Analytics', description: 'Real-time P&L tracking, risk assessment, and AI-powered insights to optimize your holdings.', color: '#4dabf7', lightBg: 'blue' },
  { icon: <ShieldCheck size={28} />, title: 'KYC Compliance Upgrade', description: 'Enhanced verification with instant ID check. Compliant with global regulatory standards.', color: '#20c997', lightBg: 'teal' },
  { icon: <ArrowRightLeft size={28} />, title: 'Instant Cross-Chain Transfers', description: 'Bridge assets across 20+ networks instantly. No wrapping required, minimal fees.', color: '#f783ac', lightBg: 'pink' },
  { icon: <Vault size={28} />, title: 'Savings Vault & Auto-Invest', description: 'Automated DCA strategies and high-yield savings vaults. Set and forget wealth building.', color: '#ffa94d', lightBg: 'gold' },
  { icon: <Bot size={28} />, title: 'P2P System', description: 'Peer-to-peer trading with smart matching. Enhanced liquidity and competitive rates 24/7.', color: '#69db7c', lightBg: 'green' },
];

// Breathing Orb Component - Ambient 3D Effect (kept for potential use)
const _BreathingOrb: React.FC<{
  size: number;
  color: string;
  style: React.CSSProperties;
  delay?: number;
  duration?: number;
}> = ({ size, color, style, delay = 0, duration = 4 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: [0.4, 0.7, 0.4],
        scale: [1, 1.15, 1],
      }}
      transition={{
        opacity: { delay, duration, repeat: Infinity, ease: 'easeInOut' },
        scale: { delay, duration, repeat: Infinity, ease: 'easeInOut' },
      }}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle at 30% 30%, ${color}30 0%, ${color}10 40%, transparent 70%)`,
        filter: `blur(${size * 0.15}px)`,
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
};

// Floating Particle Component - Small glowing dots (kept for potential use)
const _FloatingParticle: React.FC<{
  size: number;
  color: string;
  style: React.CSSProperties;
  delay?: number;
}> = ({ size, color, style, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0.3, 0.8, 0.3],
        y: [0, -30, 0],
        x: [0, 10, 0],
      }}
      transition={{
        duration: 6,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color}80`,
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
};

// Animated Ring Component - Orbital effect (kept for potential use)
const _AnimatedRing: React.FC<{
  size: number;
  color: string;
  style: React.CSSProperties;
  clockwise?: boolean;
}> = ({ size, color, style, clockwise = true }) => {
  return (
    <motion.div
      animate={{ rotate: clockwise ? 360 : -360 }}
      transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        border: `1px solid ${color}20`,
        pointerEvents: 'none',
        ...style,
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          top: -3,
          left: '50%',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 12px ${color}`,
        }}
      />
    </motion.div>
  );
};

// Green Sparkles Component - Glowing particles for both light and dark modes
const GreenSparkles: React.FC<{ isDark: boolean; count?: number }> = ({ isDark, count = 35 }) => {
  // Create sparkles with varied sizes - some big glowing ones, some small twinkling ones
  const sparkles = Array.from({ length: count }, (_, i) => {
    const isBigSparkle = i < count * 0.3; // 30% are big prominent sparkles
    const isMedium = i < count * 0.6 && !isBigSparkle; // 30% medium
    return {
      id: i,
      size: isBigSparkle ? (Math.random() * 10 + 8) : isMedium ? (Math.random() * 6 + 4) : (Math.random() * 4 + 2),
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 4,
      duration: isBigSparkle ? (Math.random() * 3 + 5) : (Math.random() * 2 + 3),
      opacity: isDark
        ? (isBigSparkle ? 1 : Math.random() * 0.7 + 0.5)
        : (isBigSparkle ? 0.9 : Math.random() * 0.6 + 0.4),
      isBig: isBigSparkle,
    };
  });

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 4,
    }}>
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, sparkle.opacity, sparkle.opacity * 0.6, sparkle.opacity, 0],
            scale: sparkle.isBig
              ? [0.3, 1.4, 1.1, 1.4, 0.3]
              : [0.5, 1.3, 1, 1.3, 0.5],
            y: sparkle.isBig ? [0, -35, -20, -45, 0] : [0, -20, -10, -30, 0],
            x: [0, sparkle.isBig ? 8 : 3, 0, sparkle.isBig ? -8 : -3, 0],
          }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            width: sparkle.size,
            height: sparkle.size,
            borderRadius: '50%',
            background: isDark
              ? sparkle.isBig
                ? `radial-gradient(circle, #00ff88 0%, #00ff88aa 30%, #00ff8850 60%, transparent 100%)`
                : `radial-gradient(circle, #00ff88 0%, #00ff8860 50%, transparent 100%)`
              : sparkle.isBig
                ? `radial-gradient(circle, #10b981 0%, #10b981cc 30%, #10b98170 60%, transparent 100%)`
                : `radial-gradient(circle, #10b981 0%, #10b98180 50%, transparent 100%)`,
            boxShadow: isDark
              ? sparkle.isBig
                ? `0 0 ${sparkle.size * 4}px #00ff88, 0 0 ${sparkle.size * 8}px #00ff88aa, 0 0 ${sparkle.size * 12}px #00ff8860, 0 0 ${sparkle.size * 16}px #00ff8830`
                : `0 0 ${sparkle.size * 3}px #00ff88, 0 0 ${sparkle.size * 6}px #00ff8880, 0 0 ${sparkle.size * 9}px #00ff8840`
              : sparkle.isBig
                ? `0 0 ${sparkle.size * 3}px #10b981, 0 0 ${sparkle.size * 6}px #10b981aa, 0 0 ${sparkle.size * 9}px #10b98170`
                : `0 0 ${sparkle.size * 2}px #10b981, 0 0 ${sparkle.size * 4}px #10b98180`,
            filter: sparkle.isBig ? 'blur(0.3px)' : 'blur(0.5px)',
          }}
        />
      ))}
    </div>
  );
};

// Speed Train Border Animation Component - Extremely Slow & Subtle
const SpeedTrainBorder: React.FC<{ color: string; duration?: number; delay?: number }> = ({
  color,
  duration = 8,
  delay = 0
}) => {
  return (
    <>
      {/* Top border animation */}
      <motion.div
        initial={{ left: '-30%', opacity: 0 }}
        animate={{
          left: ['-30%', '100%'],
          opacity: [0, 0.8, 0.8, 0],
        }}
        transition={{
          duration,
          delay,
          repeat: Infinity,
          repeatDelay: 15,
          ease: 'linear',
        }}
        style={{
          position: 'absolute',
          top: 0,
          width: '25%',
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${color}90, ${color}90, transparent)`,
          borderRadius: '2px',
          boxShadow: `0 0 8px ${color}60, 0 0 15px ${color}40`,
          zIndex: 10,
        }}
      />
      {/* Right border animation */}
      <motion.div
        initial={{ top: '-30%', opacity: 0 }}
        animate={{
          top: ['-30%', '100%'],
          opacity: [0, 0.8, 0.8, 0],
        }}
        transition={{
          duration,
          delay: delay + duration * 0.25,
          repeat: Infinity,
          repeatDelay: 15,
          ease: 'linear',
        }}
        style={{
          position: 'absolute',
          right: 0,
          width: '2px',
          height: '25%',
          background: `linear-gradient(180deg, transparent, ${color}90, ${color}90, transparent)`,
          borderRadius: '2px',
          boxShadow: `0 0 8px ${color}60, 0 0 15px ${color}40`,
          zIndex: 10,
        }}
      />
      {/* Bottom border animation */}
      <motion.div
        initial={{ right: '-30%', opacity: 0 }}
        animate={{
          right: ['-30%', '100%'],
          opacity: [0, 0.8, 0.8, 0],
        }}
        transition={{
          duration,
          delay: delay + duration * 0.5,
          repeat: Infinity,
          repeatDelay: 15,
          ease: 'linear',
        }}
        style={{
          position: 'absolute',
          bottom: 0,
          width: '25%',
          height: '2px',
          background: `linear-gradient(270deg, transparent, ${color}90, ${color}90, transparent)`,
          borderRadius: '2px',
          boxShadow: `0 0 8px ${color}60, 0 0 15px ${color}40`,
          zIndex: 10,
        }}
      />
      {/* Left border animation */}
      <motion.div
        initial={{ bottom: '-30%', opacity: 0 }}
        animate={{
          bottom: ['-30%', '100%'],
          opacity: [0, 0.8, 0.8, 0],
        }}
        transition={{
          duration,
          delay: delay + duration * 0.75,
          repeat: Infinity,
          repeatDelay: 15,
          ease: 'linear',
        }}
        style={{
          position: 'absolute',
          left: 0,
          width: '2px',
          height: '25%',
          background: `linear-gradient(0deg, transparent, ${color}90, ${color}90, transparent)`,
          borderRadius: '2px',
          boxShadow: `0 0 8px ${color}60, 0 0 15px ${color}40`,
          zIndex: 10,
        }}
      />
    </>
  );
};

// Feature Carousel Spotlight Component - Interactive 3D Glass Carousel
interface FeatureCarouselProps {
  features: typeof platformFeatures;
  isDark: boolean;
  colors: any;
  isMobile: boolean;
}

const FeatureCarousel: React.FC<FeatureCarouselProps> = ({ features, isDark, colors, isMobile }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  // Map colors for light mode - convert greens to blues/purples for better visibility
  const getLightModeColor = (color: string): string => {
    const colorMap: Record<string, string> = {
      '#00ff88': '#0284c7', // green -> sky blue
      '#00ffd5': '#7c3aed', // teal -> purple
      '#ffd700': '#ea580c', // gold -> orange
      '#ff6b6b': '#dc2626', // pink/red -> red
      '#4dabf7': '#2563eb', // blue -> blue
      '#20c997': '#0891b2', // teal -> cyan
      '#f783ac': '#db2777', // pink -> pink
      '#ffa94d': '#d97706', // orange -> amber
      '#69db7c': '#059669', // green -> emerald
    };
    return colorMap[color] || color;
  };

  // Get the display color based on mode
  const getDisplayColor = (color: string): string => {
    return isDark ? color : getLightModeColor(color);
  };

  // Auto-advance carousel
  React.useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, features.length]);

  const goToSlide = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const goNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % features.length);
  };

  const goPrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  const activeFeature = features[activeIndex];
  const displayColor = getDisplayColor(activeFeature.color);
  const lightBg = 'linear-gradient(145deg, rgba(20,40,60,0.85) 0%, rgba(30,50,80,0.75) 50%, rgba(15,35,55,0.8) 100%)';

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ position: 'relative' }}
    >
      {/* Main Spotlight Panel */}
      <div style={{
        position: 'relative',
        minHeight: isMobile ? '320px' : '280px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '32px',
      }}>
        {/* Navigation Arrows - Desktop Only */}
        {!isMobile && (
          <>
            <motion.button
              whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.15)' }}
              whileTap={{ scale: 0.95 }}
              onClick={goPrev}
              style={{
                position: 'absolute',
                left: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.25)',
                border: isDark ? '1px solid rgba(255,255,255,0.15)' : '2px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#ffffff',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                zIndex: 10,
              }}
            >
              <ChevronLeft size={24} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.15)' }}
              whileTap={{ scale: 0.95 }}
              onClick={goNext}
              style={{
                position: 'absolute',
                right: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.25)',
                border: isDark ? '1px solid rgba(255,255,255,0.15)' : '2px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#ffffff',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                zIndex: 10,
              }}
            >
              <ChevronRight size={24} />
            </motion.button>
          </>
        )}

        {/* Spotlight Card */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            style={{
              width: isMobile ? '100%' : '85%',
              maxWidth: '900px',
              background: isDark
                ? 'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 50%, rgba(0,0,0,0.2) 100%)'
                : lightBg,
              borderRadius: '28px',
              padding: isMobile ? '28px' : '40px 48px',
              border: isDark
                ? '2px solid rgba(255,255,255,0.15)'
                : `2px solid ${displayColor}50`,
              boxShadow: isDark
                ? `0 25px 50px rgba(0,0,0,0.5), 0 15px 30px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.15)`
                : `0 30px 60px rgba(0,20,40,0.5), 0 15px 35px rgba(0,30,60,0.4), inset 0 2px 0 rgba(255,255,255,0.2), 0 0 50px ${displayColor}20`,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'center',
              gap: isMobile ? '24px' : '40px',
            }}
          >
            {/* Decorative Glow */}
            <div style={{
              position: 'absolute',
              top: '-40%',
              right: '-10%',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${displayColor}30 0%, transparent 70%)`,
              filter: 'blur(40px)',
              pointerEvents: 'none',
            }} />

            {/* Top Accent Line */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, transparent, ${displayColor}, transparent)`,
              borderRadius: '28px 28px 0 0',
            }} />

            {/* Glass Shine */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '40%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)',
              borderRadius: '26px 26px 0 0',
              pointerEvents: 'none',
            }} />

            {/* Icon Container */}
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              style={{
                width: isMobile ? '90px' : '120px',
                height: isMobile ? '90px' : '120px',
                borderRadius: '24px',
                background: isDark
                  ? `linear-gradient(145deg, ${displayColor}30, ${displayColor}15)`
                  : `linear-gradient(145deg, ${displayColor}45, ${displayColor}25)`,
                border: `3px solid ${displayColor}60`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: displayColor,
                boxShadow: `0 15px 40px ${displayColor}40, inset 0 2px 0 rgba(255,255,255,0.3), 0 0 35px ${displayColor}25`,
                position: 'relative',
                zIndex: 1,
                flexShrink: 0,
              }}
            >
              {React.cloneElement(activeFeature.icon, { size: isMobile ? 42 : 56 })}
            </motion.div>

            {/* Content */}
            <div style={{ flex: 1, position: 'relative', zIndex: 1, textAlign: isMobile ? 'center' : 'left' }}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                style={{
                  display: 'inline-block',
                  padding: '6px 14px',
                  background: `${displayColor}25`,
                  borderRadius: '20px',
                  marginBottom: '14px',
                  border: `1px solid ${displayColor}40`,
                }}
              >
                <span style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: displayColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}>
                  Feature {activeIndex + 1} of {features.length}
                </span>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                style={{
                  fontSize: isMobile ? '24px' : '32px',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginBottom: '14px',
                  textShadow: '0 3px 12px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.4)',
                  letterSpacing: '-0.3px',
                }}
              >
                {activeFeature.title}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
                style={{
                  fontSize: isMobile ? '15px' : '17px',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.95)',
                  lineHeight: 1.7,
                  textShadow: '0 2px 6px rgba(0,0,0,0.5)',
                  maxWidth: '500px',
                }}
              >
                {activeFeature.description}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Feature Thumbnails - Mini Cards Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: isMobile ? '8px' : '12px',
        flexWrap: 'wrap',
        padding: '0 16px',
      }}>
        {features.map((feature, index) => {
          const isActive = index === activeIndex;
          const thumbColor = getDisplayColor(feature.color);
          return (
            <motion.button
              key={feature.title}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => goToSlide(index)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: isMobile ? '10px 14px' : '12px 18px',
                background: isActive
                  ? isDark
                    ? `linear-gradient(135deg, ${thumbColor}25, ${thumbColor}10)`
                    : `linear-gradient(135deg, ${thumbColor}35, ${thumbColor}20)`
                  : isDark
                    ? 'rgba(255,255,255,0.06)'
                    : 'rgba(0,0,0,0.25)',
                border: isActive
                  ? `2px solid ${thumbColor}60`
                  : isDark
                    ? '1px solid rgba(255,255,255,0.1)'
                    : '1px solid rgba(255,255,255,0.2)',
                borderRadius: '14px',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                boxShadow: isActive
                  ? `0 8px 24px ${thumbColor}30, inset 0 1px 0 rgba(255,255,255,0.15)`
                  : '0 4px 12px rgba(0,0,0,0.2)',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{
                color: isActive ? thumbColor : 'rgba(255,255,255,0.7)',
                display: 'flex',
                filter: isActive ? `drop-shadow(0 0 6px ${thumbColor})` : 'none',
              }}>
                {React.cloneElement(feature.icon, { size: isMobile ? 16 : 18 })}
              </span>
              {!isMobile && (
                <span style={{
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? '#ffffff' : 'rgba(255,255,255,0.8)',
                  textShadow: isActive ? '0 2px 6px rgba(0,0,0,0.5)' : 'none',
                  whiteSpace: 'nowrap',
                }}>
                  {feature.title.split(' ').slice(0, 2).join(' ')}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Progress Dots - Mobile */}
      {isMobile && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '20px',
        }}>
          {features.map((feature, index) => {
            const dotColor = getDisplayColor(feature.color);
            return (
              <motion.button
                key={index}
                whileTap={{ scale: 0.9 }}
                onClick={() => goToSlide(index)}
                style={{
                  width: index === activeIndex ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: index === activeIndex ? dotColor : 'rgba(255,255,255,0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: index === activeIndex ? `0 0 10px ${dotColor}` : 'none',
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

// Animated Icon Components for Quick Actions
const BuyCryptoIcon: React.FC<{ size: number; color: string; animationDelay: number }> = ({ size, color, animationDelay }) => (
  <motion.div
    initial={{ x: -20, opacity: 0 }}
    animate={{
      x: [0, 5, 0],
      opacity: 1,
      rotateY: [0, 360, 360],
    }}
    transition={{
      x: { delay: animationDelay + 0.5, duration: 0.8, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' },
      opacity: { delay: animationDelay, duration: 0.5 },
      rotateY: { delay: animationDelay + 1, duration: 1.2, repeat: Infinity, repeatDelay: 4 },
    }}
    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', transformStyle: 'preserve-3d' }}
  >
    <CreditCard size={size} color={color} />
  </motion.div>
);

const SwapIcon: React.FC<{ size: number; color: string; animationDelay: number }> = ({ size, color, animationDelay }) => (
  <motion.div
    initial={{ rotate: 0 }}
    animate={{
      rotate: [0, 0, 360, 360],
    }}
    transition={{
      delay: animationDelay + 0.8,
      duration: 2,
      repeat: Infinity,
      repeatDelay: 3,
      ease: 'easeInOut',
      times: [0, 0.3, 0.7, 1],
    }}
    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
  >
    <Repeat size={size} color={color} />
  </motion.div>
);

const EarnIcon: React.FC<{ size: number; color: string; animationDelay: number }> = ({ size, color, animationDelay }) => (
  <motion.div
    initial={{ scale: 1 }}
    animate={{
      scale: [1, 1.3, 1.1, 1.2, 1],
      rotate: [0, -10, 10, -5, 0],
    }}
    transition={{
      delay: animationDelay + 1.2,
      duration: 1.5,
      repeat: Infinity,
      repeatDelay: 3,
      ease: 'easeInOut',
    }}
    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
  >
    <Gift size={size} color={color} />
  </motion.div>
);

const StakeIcon: React.FC<{ size: number; color: string; animationDelay: number }> = ({ size, color, animationDelay }) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{
      y: [0, -8, 0, -4, 0],
      scaleY: [1, 0.9, 1, 0.95, 1],
    }}
    transition={{
      delay: animationDelay + 1.6,
      duration: 1.2,
      repeat: Infinity,
      repeatDelay: 3,
      ease: 'easeOut',
    }}
    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
  >
    <Layers size={size} color={color} />
  </motion.div>
);

// Glass Panel Component with Theme Support - BOLD 3D Glass Effect
const GlassPanel: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  hover?: boolean;
  glow?: boolean;
  isDark?: boolean;
  glowColor?: string;
}> = ({ children, style, hover = false, glow = false, isDark = true, glowColor = '#00ff88' }) => {
  // Bold 3D Glass - Deep depth with strong shadows
  const glassBg = isDark
    ? 'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 50%, rgba(0,0,0,0.15) 100%)'
    : 'linear-gradient(145deg, rgba(20,40,60,0.75) 0%, rgba(30,50,80,0.65) 50%, rgba(15,35,55,0.7) 100%)';

  const borderColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(100,180,255,0.4)';

  return (
    <motion.div
      whileHover={hover ? {
        scale: 1.03,
        y: -8,
        boxShadow: isDark
          ? `0 30px 80px rgba(0,0,0,0.6), 0 0 60px ${glowColor}25, inset 0 2px 0 rgba(255,255,255,0.15), inset 0 -2px 0 rgba(0,0,0,0.3)`
          : `0 25px 60px rgba(0,30,60,0.5), 0 0 40px rgba(0,180,255,0.15), inset 0 2px 0 rgba(255,255,255,0.25)`,
      } : undefined}
      style={{
        background: glassBg,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '20px',
        border: `2px solid ${borderColor}`,
        boxShadow: glow
          ? isDark
            ? `0 20px 60px rgba(0,0,0,0.5), 0 0 80px ${glowColor}20, inset 0 2px 0 rgba(255,255,255,0.12), inset 0 -2px 0 rgba(0,0,0,0.25)`
            : `0 20px 50px rgba(0,30,60,0.45), 0 0 50px rgba(0,180,255,0.12), inset 0 2px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,40,80,0.3)`
          : isDark
            ? `0 15px 50px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.1), inset 0 -2px 0 rgba(0,0,0,0.25)`
            : `0 15px 40px rgba(0,30,60,0.4), inset 0 2px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,40,80,0.25)`,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        position: 'relative',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
};

// Crypto Price Card Component - Glass 3D Style with Controlled Rotation
const CryptoPriceCard: React.FC<{
  symbol: string;
  name: string;
  price: number;
  change: number;
  delay?: number;
  isMobile?: boolean;
  colors: any;
  isDark: boolean;
  isRotating?: boolean; // Control when coin rotates
}> = ({ symbol, name: _name, price, change, delay = 0, isMobile, colors, isDark, isRotating = false }) => {
  const navigate = useNavigate();
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      whileHover={{
        scale: 1.05,
        y: -6,
        transition: { duration: 0.3 },
      }}
      onClick={() => navigate(`/trade/${symbol.toLowerCase()}`)}
      style={{
        // Crystal clear glass for snowy background
        background: isDark
          ? 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 100%)'
          : 'linear-gradient(145deg, rgba(10, 40, 70, 0.85) 0%, rgba(15, 50, 85, 0.75) 50%, rgba(20, 60, 95, 0.7) 100%)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: '16px',
        padding: isMobile ? '16px' : '18px',
        cursor: 'pointer',
        // Cool blue-tinted glass border
        border: isDark
          ? '1px solid rgba(255,255,255,0.2)'
          : '2px solid rgba(100, 180, 255, 0.4)',
        // Shadow with depth
        boxShadow: isDark
          ? `
            0 20px 40px -12px rgba(0,0,0,0.5),
            0 8px 20px -8px rgba(0,0,0,0.3),
            inset 0 1px 1px rgba(255,255,255,0.1)
          `
          : `
            0 20px 50px -12px rgba(0,30,60,0.6),
            0 8px 25px -8px rgba(0,20,40,0.4),
            inset 0 1px 0 rgba(255,255,255,0.25),
            0 0 40px rgba(100,180,255,0.15)
          `,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        transformStyle: 'preserve-3d',
        perspective: '1200px',
      }}
    >
      {/* Glass shine/reflection overlay - cool blue tint */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
        background: isDark
          ? 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)'
          : 'linear-gradient(180deg, rgba(200,230,255,0.2) 0%, transparent 100%)',
        borderRadius: '14px 14px 0 0',
        pointerEvents: 'none',
      }} />

      {/* Top edge highlight for glass depth - cool blue */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '10%',
        right: '10%',
        height: '2px',
        background: isDark
          ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
          : 'linear-gradient(90deg, transparent, rgba(150,200,255,0.6), transparent)',
      }} />

      {/* Left edge glass refraction - cool tint */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: 0,
        bottom: '10%',
        width: '1px',
        background: isDark
          ? 'linear-gradient(180deg, transparent, rgba(255,255,255,0.2), transparent)'
          : 'linear-gradient(180deg, transparent, rgba(150,200,255,0.35), transparent)',
      }} />

      {/* 3D Coin with controlled rotation - Only rotates when isRotating is true */}
      {(() => {
        // Determine rotation direction based on symbol
        const symbolHash = symbol.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        const rotationDirection = symbolHash % 2 === 0 ? 1 : -1;

        return (
          <motion.div
            animate={isRotating ? {
              scale: [1, 1.05, 1],
              rotateY: [0, 360 * rotationDirection],
            } : {
              scale: 1,
              rotateY: 0,
            }}
            transition={{
              scale: {
                duration: 5,
                ease: 'easeInOut',
              },
              rotateY: {
                duration: 5, // Very slow rotation - 5 seconds for full rotation
                ease: 'easeInOut',
              },
            }}
            style={{
              width: isMobile ? '52px' : '60px',
              height: isMobile ? '52px' : '60px',
              marginBottom: '14px',
              position: 'relative',
              transformStyle: 'preserve-3d',
              perspective: '1000px',
            }}
          >
            {/* Glow ring behind coin - only glows when rotating */}
            <motion.div
              animate={isRotating ? {
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.15, 1],
              } : {
                opacity: 0.15,
                scale: 1,
              }}
              transition={{
                duration: 5,
                ease: 'easeInOut',
              }}
              style={{
                position: 'absolute',
                inset: -6,
                borderRadius: '50%',
                background: isDark
                  ? 'radial-gradient(circle, rgba(0,255,136,0.25) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(16,185,129,0.35) 0%, transparent 70%)',
                filter: 'blur(4px)',
                zIndex: -1,
              }}
            />

            {/* Front face of coin */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: isDark
                  ? 'linear-gradient(145deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 50%, rgba(0,0,0,0.2) 100%)'
                  : 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(16, 185, 129, 0.1) 50%, rgba(16, 185, 129, 0.2) 100%)',
                border: isDark
                  ? '2px solid rgba(255,255,255,0.3)'
                  : '2px solid rgba(16, 185, 129, 0.4)',
                boxShadow: isDark
                  ? `0 8px 25px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)`
                  : `0 8px 25px rgba(16, 185, 129, 0.25), inset 0 3px 6px rgba(255,255,255,1), inset 0 -2px 4px rgba(16, 185, 129, 0.15)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backfaceVisibility: 'hidden',
                transformStyle: 'preserve-3d',
              }}
            >
              <CryptoIcon symbol={symbol} size={isMobile ? 32 : 40} />
            </div>

            {/* Back face of coin - same logo, rotated 180deg */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: isDark
                  ? 'linear-gradient(145deg, rgba(0,0,0,0.2) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.2) 100%)'
                  : 'linear-gradient(145deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 50%, rgba(255,255,255,0.95) 100%)',
                border: isDark
                  ? '2px solid rgba(255,255,255,0.3)'
                  : '2px solid rgba(16, 185, 129, 0.4)',
                boxShadow: isDark
                  ? `0 8px 25px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)`
                  : `0 8px 25px rgba(16, 185, 129, 0.25), inset 0 3px 6px rgba(255,255,255,1), inset 0 -2px 4px rgba(16, 185, 129, 0.15)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                transformStyle: 'preserve-3d',
              }}
            >
              <CryptoIcon symbol={symbol} size={isMobile ? 32 : 40} />
            </div>
          </motion.div>
        );
      })()}

      {/* Pair */}
      <p style={{
        fontSize: isMobile ? '13px' : '14px',
        fontWeight: 800,
        color: '#ffffff',
        marginBottom: '6px',
        letterSpacing: '0.5px',
        position: 'relative',
        textShadow: '0 2px 6px rgba(0,0,0,0.8), 0 1px 2px rgba(0,0,0,0.6)',
      }}>
        {symbol}/USDT
      </p>

      {/* Price */}
      <p style={{
        fontSize: isMobile ? '18px' : '22px',
        fontWeight: 800,
        fontFamily: "'JetBrains Mono', monospace",
        color: '#ffffff',
        marginBottom: '10px',
        letterSpacing: '-0.5px',
        position: 'relative',
        textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.6)',
      }}>
        ${price < 1 ? price.toFixed(4) : price.toLocaleString()}
      </p>

      {/* Change badge with SOLID colored background for visibility */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '8px 14px',
        borderRadius: '12px',
        background: isPositive
          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
          : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        border: 'none',
        boxShadow: isPositive
          ? '0 4px 16px rgba(16, 185, 129, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)'
          : '0 4px 16px rgba(239, 68, 68, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
        position: 'relative',
      }}>
        {isPositive ? <ArrowUpRight size={14} color="#ffffff" strokeWidth={3} /> : <ArrowDownRight size={14} color="#ffffff" strokeWidth={3} />}
        <span style={{
          fontSize: '13px',
          fontWeight: 800,
          color: '#ffffff',
          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
        }}>
          {isPositive ? '+' : ''}{change}%
        </span>
      </div>
    </motion.div>
  );
};

// Live Ticker Component - VISIBLE Glass Style with Theme Support
const LiveTicker: React.FC<{ colors: any; isDark: boolean }> = ({ colors, isDark }) => {
  const tickerItems = [...cryptoPrices, ...cryptoPrices, ...cryptoPrices];

  // Strong text shadow for visibility in light mode
  const tickerTextShadow = isDark ? 'none' : '0 0 8px rgba(255,255,255,0.9), 0 0 15px rgba(255,255,255,0.5), 0 2px 6px rgba(0,0,0,0.9), 0 4px 12px rgba(0,0,0,0.6)';
  const priceTextShadow = isDark ? 'none' : '0 0 10px rgba(255,255,255,1), 0 0 20px rgba(255,255,255,0.6), 0 2px 8px rgba(0,0,0,1)';

  return (
    <div style={{
      background: isDark
        ? 'linear-gradient(180deg, rgba(5, 10, 18, 0.6) 0%, rgba(5, 10, 18, 0.4) 100%)'
        : 'linear-gradient(180deg, rgba(10, 35, 65, 0.85) 0%, rgba(5, 25, 50, 0.8) 100%)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${isDark ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 255, 255, 0.3)'}`,
      borderTop: isDark ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
      overflow: 'hidden',
      padding: '14px 0',
      boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.3)',
    }}>
      <motion.div
        animate={{ x: ['0%', '-33.33%'] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', gap: '48px', width: 'fit-content' }}
      >
        {tickerItems.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', whiteSpace: 'nowrap' }}>
            <CryptoIcon symbol={item.symbol} size={22} />
            <span style={{
              fontWeight: 700,
              color: '#ffffff',
              fontSize: '14px',
              textShadow: tickerTextShadow,
            }}>{item.symbol}</span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              color: '#ffffff',
              fontSize: '14px',
              textShadow: priceTextShadow,
            }}>
              ${item.price < 1 ? item.price.toFixed(4) : item.price.toLocaleString()}
            </span>
            <span style={{
              fontSize: '13px',
              fontWeight: 700,
              color: item.change >= 0 ? '#00ff88' : '#ff4757',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              textShadow: item.change >= 0
                ? '0 0 8px rgba(0,255,136,0.8), 0 2px 6px rgba(0,0,0,0.8)'
                : '0 0 8px rgba(255,71,87,0.8), 0 2px 6px rgba(0,0,0,0.8)',
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
            }}>
              {item.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {Math.abs(item.change)}%
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// Quick Actions data
const quickActions = [
  { icon: <CreditCard size={20} />, label: 'Buy Crypto', description: 'Instant purchase', color: '#00ff88', path: '/trade', action: 'buy crypto', lightBg: 'green' },
  { icon: <Repeat size={20} />, label: 'Swap', description: 'Zero fees', color: '#00ffd5', path: '/trade', action: 'swap tokens', lightBg: 'teal' },
  { icon: <Gift size={20} />, label: 'Earn', description: 'Up to 12% APY', color: '#ffd700', path: '/rewards', action: 'earn rewards', lightBg: 'gold' },
  { icon: <Layers size={20} />, label: 'Stake', description: 'Flexible terms', color: '#9945FF', path: '/rewards', action: 'stake crypto', lightBg: 'purple' },
];

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = usePresentationMode();
  const { colors, isDark, toggleTheme } = useThemeMode();
  const { requireAuth } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState('');

  // State to control which crypto cards are rotating (only 2 at a time)
  const [rotatingIndices, setRotatingIndices] = useState<number[]>([]);

  // Effect to cycle through rotating cards - 2 at a time with pause between rotations
  React.useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const startRotation = () => {
      // Pick 2 random indices
      const allIndices = [0, 1, 2, 3, 4, 5];
      const shuffled = [...allIndices].sort(() => Math.random() - 0.5);
      const selectedIndices = [shuffled[0], shuffled[1]];

      // Start rotating the 2 selected coins
      setRotatingIndices(selectedIndices);

      // After rotation completes (5 seconds), stop rotation
      timeoutId = setTimeout(() => {
        setRotatingIndices([]); // Stop all rotations

        // After 2.5 second pause, start next pair
        timeoutId = setTimeout(() => {
          startRotation();
        }, 2500);
      }, 5000); // Rotation duration
    };

    // Start first rotation after 1 second delay
    timeoutId = setTimeout(startRotation, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  // Handler for navigation actions (no auth required)
  const handleProtectedAction = (action: string, path: string) => {
    navigate(path);
  };

  const navLinks = [
    { label: 'Buy Crypto', href: '/p2p' },
    { label: 'Markets', href: '/markets' },
    { label: 'Trade', href: '/trade', hasDropdown: true, subLinks: [
      { label: 'Spot', href: '/trade' },
      { label: 'Convert', href: '/wallet/convert' },
    ]},
    { label: 'Earn', href: '/earn' },
    { label: 'Vault', href: '/vault' },
  ];

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark ? colors.background.primary : 'transparent',
      overflow: 'auto',
      position: 'relative',
      zIndex: 5,
      transition: 'background-color 0.3s ease',
    }}>
      {/* Bull/Bear background moved to hero section for light mode - see hero section below */}

      {/* GLOWING SNOWY Background - ENTIRE PAGE behind content (Light Mode Only) */}
      <GlowingSnowBackground
        show={!isDark}
        backgroundImage="/main-bg.jpg"
        intensity="high"
        showTopFade={true}
      />

      {/* Premium Liquid Glass 3D Background - Dark mode only */}
      {isDark && (
        <LiquidGlassBackground
          intensity={isMobile ? 'low' : 'high'}
          showOrbs={true}
          showRings={!isMobile}
          showCubes={!isMobile}
        />
      )}

      {/* Navigation - Glass Style - TRANSPARENT to show hero image */}
      <nav style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        height: isMobile ? '56px' : '68px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '0 16px' : '0 32px',
        background: isDark
          ? 'linear-gradient(180deg, rgba(5, 10, 18, 0.85) 0%, rgba(5, 10, 18, 0.7) 100%)'
          : 'linear-gradient(180deg, rgba(20, 60, 100, 0.5) 0%, rgba(20, 60, 100, 0.35) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${isDark ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255, 255, 255, 0.25)'}`,
        boxShadow: isDark
          ? '0 4px 30px rgba(0, 255, 136, 0.1)'
          : '0 4px 30px rgba(0, 50, 100, 0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
        zIndex: 100,
        transition: 'all 0.3s ease',
      }}>
        {/* Logo - with visibility filter for light mode */}
        <motion.div
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.02 }}
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <img
            src="/crymadx-logo.png"
            alt="CrymadX"
            style={{
              height: isMobile ? '41px' : '51px',
              width: 'auto',
              objectFit: 'contain',
              filter: isDark ? 'none' : 'drop-shadow(0 0 8px rgba(0,0,0,0.6)) drop-shadow(0 2px 4px rgba(0,0,0,0.4)) brightness(1.1) contrast(1.1)',
            }}
          />
        </motion.div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: '4px' }}>
            {navLinks.map((link) => (
              <div
                key={link.label}
                style={{ position: 'relative' }}
                onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <motion.button
                  onClick={() => !link.hasDropdown && navigate(link.href)}
                  whileHover={{ color: '#00ff88', background: 'rgba(255,255,255,0.1)' }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: isDark ? 'rgba(255,255,255,0.85)' : '#ffffff',
                    textShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.5)',
                    background: 'none',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown size={14} style={{ transform: activeDropdown === link.label ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />}
                </motion.button>
                {/* Dropdown Menu */}
                {link.hasDropdown && link.subLinks && activeDropdown === link.label && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      marginTop: '4px',
                      minWidth: '160px',
                      background: isDark ? 'rgba(20, 25, 30, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                      backdropFilter: 'blur(20px)',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(16, 185, 129, 0.12)'}`,
                      borderRadius: '12px',
                      padding: '8px',
                      boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.3)' : '0 10px 40px rgba(16, 185, 129, 0.1)',
                      zIndex: 200,
                    }}
                  >
                    {link.subLinks.map((subLink) => (
                      <motion.button
                        key={subLink.label}
                        onClick={() => { navigate(subLink.href); setActiveDropdown(null); }}
                        whileHover={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(16, 185, 129, 0.08)' }}
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '10px 16px',
                          fontSize: '14px',
                          fontWeight: 500,
                          color: isDark ? 'rgba(255,255,255,0.9)' : '#374151',
                          background: 'none',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {subLink.label}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Right Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!isMobile && (
            <>
              <motion.button
                whileHover={{ background: 'rgba(255,255,255,0.15)' }}
                style={{
                  padding: '10px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  color: isDark ? 'rgba(255,255,255,0.85)' : '#ffffff',
                  display: 'flex',
                  filter: isDark ? 'none' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                }}
              >
                <Search size={18} />
              </motion.button>
              {/* Theme Toggle Button */}
              <motion.button
                whileHover={{ background: 'rgba(255,255,255,0.15)' }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                style={{
                  padding: '10px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  color: isDark ? '#ffd700' : '#ffd700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  filter: isDark ? 'none' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isDark ? 'sun' : 'moon'}
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex' }}
                  >
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/login')}
                style={{
                  background: isDark ? 'transparent' : 'rgba(255,255,255,0.15)',
                  color: isDark ? colors.text.secondary : '#ffffff',
                  border: isDark ? 'none' : '1px solid rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(10px)',
                  textShadow: isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
                }}
              >
                Log In
              </Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
                Sign Up
              </Button>
            </>
          )}

          {/* Mobile Menu Toggle */}
          {isMobile && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMenuOpen(true)}
              style={{
                padding: '10px',
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.15)',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.25)',
                borderRadius: '10px',
                color: isDark ? '#ffffff' : '#ffffff',
                cursor: 'pointer',
                display: 'flex',
              }}
            >
              <Menu size={20} />
            </motion.button>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(8px)',
                zIndex: 200,
              }}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '280px',
                maxWidth: '85vw',
                background: 'linear-gradient(180deg, rgba(18, 20, 23, 0.98) 0%, rgba(11, 14, 17, 0.98) 100%)',
                backdropFilter: 'blur(20px)',
                borderLeft: '1px solid rgba(255,255,255,0.08)',
                zIndex: 300,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Menu Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
                <span style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary }}>Menu</span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {/* Theme Toggle in Mobile Menu */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTheme}
                    title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    style={{
                      padding: '8px',
                      background: isDark ? 'rgba(255, 215, 0, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                      border: `1px solid ${isDark ? 'rgba(255, 215, 0, 0.2)' : 'rgba(99, 102, 241, 0.2)'}`,
                      borderRadius: '8px',
                      color: isDark ? '#ffd700' : '#6366f1',
                      cursor: 'pointer',
                      display: 'flex',
                    }}
                  >
                    {isDark ? <Sun size={16} /> : <Moon size={16} />}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      padding: '8px',
                      background: 'rgba(255,255,255,0.05)',
                      border: 'none',
                      borderRadius: '8px',
                      color: colors.text.secondary,
                      cursor: 'pointer',
                      display: 'flex',
                    }}
                  >
                    <X size={18} />
                  </motion.button>
                </div>
              </div>

              {/* Menu Links */}
              <nav style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {[
                    { label: 'Buy Crypto', icon: <CreditCard size={18} />, href: '/p2p', protected: true, action: 'buy crypto' },
                    { label: 'Markets', icon: <TrendingUp size={18} />, href: '/markets', protected: false },
                    { label: 'Spot Trading', icon: <Zap size={18} />, href: '/trade', protected: true, action: 'start trading' },
                    { label: 'Convert', icon: <ArrowRightLeft size={18} />, href: '/wallet/convert', protected: true, action: 'convert assets' },
                    { label: 'Earn', icon: <Award size={18} />, href: '/earn', protected: true, action: 'earn rewards' },
                    { label: 'Vault', icon: <Lock size={18} />, href: '/vault', protected: true, action: 'access vault' },
                    { label: 'Dashboard', icon: <BarChart3 size={18} />, href: '/dashboard', protected: true, action: 'access dashboard' },
                    { label: 'Wallet', icon: <Wallet size={18} />, href: '/wallet', protected: true, action: 'access wallet' },
                  ].map((item) => (
                    <motion.button
                      key={item.label}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setMenuOpen(false);
                        if (item.protected) {
                          handleProtectedAction(item.action || item.label.toLowerCase(), item.href);
                        } else {
                          navigate(item.href);
                        }
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '14px 16px',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: '12px',
                        color: colors.text.secondary,
                        fontSize: '15px',
                        fontWeight: 500,
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                    >
                      <span style={{
                        color: colors.primary[400],
                        padding: '10px',
                        background: 'rgba(0, 255, 136, 0.1)',
                        borderRadius: '10px',
                        display: 'flex',
                      }}>
                        {item.icon}
                      </span>
                      {item.label}
                    </motion.button>
                  ))}
                </div>
              </nav>

              {/* Menu Footer */}
              <div style={{
                padding: '16px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}>
                <Button variant="outline" onClick={() => { navigate('/login'); setMenuOpen(false); }}>
                  Log In
                </Button>
                <Button variant="primary" onClick={() => { navigate('/register'); setMenuOpen(false); }}>
                  Sign Up
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Live Ticker */}
      <LiveTicker colors={colors} isDark={isDark} />

      {/* Luxury 3D Background Elements - Disabled for light mode (bull/bear is the background) */}
      {/* {!isDark && <LuxuryHomeBackground />} */}

      {/* Hero Section - Premium Cinematic Bull vs Bear Integration */}
      <section style={{
        minHeight: isMobile ? 'auto' : '560px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        paddingTop: isMobile ? '24px' : '40px',
        paddingBottom: isMobile ? '32px' : '48px',
        overflow: 'hidden',
      }}>
        {/* Dark mode: Snow background with dark treatment and green glow */}
        {isDark && (
          <>
            {/* Base dark gradient for dark mode */}
            <div style={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              background: 'linear-gradient(180deg, #050a12 0%, #0a1525 50%, #050a12 100%)',
            }} />
            {/* Snow background - darker treatment */}
            <div style={{
              position: 'absolute',
              inset: '-10%',
              zIndex: 1,
              backgroundImage: 'url(/hero-snow-bg.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              opacity: 0.25,
              filter: 'brightness(0.3) saturate(0.6) contrast(1.2) hue-rotate(180deg)',
            }} />
            {/* Green glow overlay for dark mode */}
            <div style={{
              position: 'absolute',
              inset: 0,
              zIndex: 2,
              background: `
                radial-gradient(ellipse 60% 50% at 30% 40%, rgba(0, 255, 136, 0.08) 0%, transparent 60%),
                radial-gradient(ellipse 50% 40% at 70% 60%, rgba(16, 185, 129, 0.06) 0%, transparent 60%)
              `,
              pointerEvents: 'none',
            }} />
          </>
        )}

        {/* LIGHT MODE: Snowy Background - Contained within hero section */}
        {!isDark && (
          <>
            {/* Base cool blue gradient */}
            <div style={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              background: 'linear-gradient(180deg, #c8dff5 0%, #e8f4fc 30%, #f0f8ff 100%)',
            }} />

            {/* The Snowy Background Image */}
            <div style={{
              position: 'absolute',
              inset: '-5%',
              zIndex: 1,
              backgroundImage: 'url(/hero-snow-bg.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              filter: 'brightness(1.05) saturate(1.1) contrast(1.02)',
            }} />

            {/* Soft blue vignette for depth */}
            <div style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              background: `
                radial-gradient(ellipse 100% 80% at 0% 30%,
                  rgba(30, 80, 150, 0.25) 0%,
                  rgba(30, 80, 150, 0.1) 40%,
                  transparent 70%
                )
              `,
            }} />

            {/* Ambient cool color effects */}
            <div style={{
              position: 'absolute',
              top: '5%',
              left: '-10%',
              width: '50%',
              height: '60%',
              zIndex: 1,
              background: 'radial-gradient(ellipse at center, rgba(100, 180, 255, 0.15) 0%, transparent 60%)',
              filter: 'blur(40px)',
            }} />
            <div style={{
              position: 'absolute',
              top: '10%',
              right: '-5%',
              width: '45%',
              height: '50%',
              zIndex: 1,
              background: 'radial-gradient(ellipse at center, rgba(180, 220, 255, 0.2) 0%, transparent 60%)',
              filter: 'blur(50px)',
            }} />
          </>
        )}

        {/* Light mode: Subtle overlay for text readability - Snowy theme */}
        {!isDark && (
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            pointerEvents: 'none',
          }}>
            {/* Left side - Soft blue frost for text readability */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: '55%',
              background: `
                radial-gradient(ellipse 120% 100% at 0% 50%,
                  rgba(20, 60, 120, 0.35) 0%,
                  rgba(30, 80, 150, 0.15) 40%,
                  transparent 70%
                )
              `,
            }} />

            {/* Right side - Cool white glow enhancement */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: '40%',
              background: `
                radial-gradient(ellipse 100% 120% at 100% 50%,
                  rgba(200, 230, 255, 0.15) 0%,
                  transparent 60%
                )
              `,
            }} />
          </div>
        )}

        {/* LAYER 2 Dark Mode: Elegant dark integration */}
        {isDark && (
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            pointerEvents: 'none',
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `
                radial-gradient(ellipse 100% 80% at 0% 50%,
                  rgba(10, 14, 20, 0.9) 0%,
                  rgba(10, 14, 20, 0.6) 40%,
                  transparent 70%
                )
              `,
            }} />
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '60px',
              background: 'linear-gradient(180deg, rgba(10, 14, 20, 0.95) 0%, transparent 100%)',
            }} />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '80px',
              background: 'linear-gradient(0deg, rgba(10, 14, 20, 0.98) 0%, transparent 100%)',
            }} />
          </div>
        )}

        {/* LAYER 3: Ambient lighting effects - Snowy theme glow */}
        {!isDark && (
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            pointerEvents: 'none',
          }}>
            {/* Cool blue ambient left */}
            <div style={{
              position: 'absolute',
              top: '10%',
              left: '-10%',
              width: '50%',
              height: '80%',
              background: 'radial-gradient(ellipse at center, rgba(100, 160, 230, 0.15) 0%, transparent 60%)',
              filter: 'blur(40px)',
            }} />
            {/* Soft white ambient right */}
            <div style={{
              position: 'absolute',
              top: '20%',
              right: '-5%',
              width: '45%',
              height: '70%',
              background: 'radial-gradient(ellipse at center, rgba(220, 240, 255, 0.2) 0%, transparent 60%)',
              filter: 'blur(50px)',
            }} />
            {/* Central energy - green accent for brand color */}
            <div style={{
              position: 'absolute',
              top: '30%',
              left: '40%',
              width: '30%',
              height: '40%',
              background: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.12) 0%, transparent 70%)',
              filter: 'blur(30px)',
            }} />
          </div>
        )}

        {/* Green Sparkles - Glowing particles for both modes */}
        <GreenSparkles isDark={isDark} count={isMobile ? 25 : 45} />

        <div style={{
          width: '100%',
          maxWidth: '1100px',
          margin: '0 auto',
          padding: isMobile ? '0 16px' : '0 32px',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr',
          gap: isMobile ? '32px' : '40px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}>
          {/* Left Content */}
          <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
            {/* Badge - Glass style visible on image */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0, duration: 0.25 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                background: isDark
                  ? `linear-gradient(135deg, ${colors.primary[400]}30 0%, ${colors.primary[400]}15 100%)`
                  : 'linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.85) 100%)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: isDark
                  ? `1px solid ${colors.primary[400]}50`
                  : '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50px',
                marginBottom: '16px',
                boxShadow: isDark
                  ? '0 4px 15px rgba(0,0,0,0.3)'
                  : '0 4px 20px rgba(0,0,0,0.3), 0 0 30px rgba(16, 185, 129, 0.4)',
              }}
            >
              <Star size={12} color={isDark ? colors.primary[400] : '#ffffff'} fill={isDark ? colors.primary[400] : '#ffffff'} />
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: isDark ? colors.primary[400] : '#ffffff',
                textShadow: isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
              }}>
                #1 Rated Exchange 2024
              </span>
            </motion.div>

            {/* Headline - SUPER VISIBLE with strong contrast */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.3 }}
              style={{
                fontSize: isMobile ? '32px' : '52px',
                fontWeight: 900,
                lineHeight: 1.1,
                marginBottom: '16px',
                color: isDark ? '#ffffff' : '#0a2540',
                textShadow: isDark
                  ? '0 2px 15px rgba(0,0,0,0.8), 0 0 30px rgba(0, 255, 136, 0.3)'
                  : '0 2px 8px rgba(255,255,255,1), 0 4px 16px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.5)',
                letterSpacing: '-1px',
              }}
            >
              Your Gateway to{' '}
              <span style={{
                color: isDark ? '#00ff88' : '#eab308',
                fontWeight: 900,
                textShadow: isDark
                  ? '0 0 20px rgba(0, 255, 136, 0.8), 0 2px 4px rgba(0,0,0,0.5)'
                  : '0 2px 8px rgba(0,0,0,0.4)',
              }}>
                Digital Wealth
              </span>
            </motion.h1>

            {/* Subtitle - Clear and readable */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              style={{
                fontSize: isMobile ? '15px' : '18px',
                fontWeight: 800,
                color: isDark ? 'rgba(255,255,255,0.95)' : '#0a1628',
                lineHeight: 1.6,
                marginBottom: '24px',
                maxWidth: isMobile ? '100%' : '450px',
                textShadow: isDark
                  ? '0 1px 4px rgba(0,0,0,0.6)'
                  : '0 1px 3px rgba(255,255,255,0.9), 0 2px 6px rgba(255,255,255,0.7), 0 0 20px rgba(255,255,255,0.5)',
              }}
            >
              Trade 500+ cryptocurrencies with ultra-low fees. Sign up today and claim up to{' '}
              <span style={{
                color: isDark ? '#00ff88' : '#eab308',
                fontWeight: 900,
                textShadow: isDark
                  ? '0 0 10px rgba(0, 255, 136, 0.5)'
                  : '0 1px 3px rgba(0,0,0,0.3)',
              }}>
                5,100 USDT
              </span>{' '}
              in welcome bonuses.
            </motion.p>

            {/* Sign Up Form - Clean Minimal Design */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              style={{
                marginBottom: '24px',
                maxWidth: isMobile ? '100%' : '420px',
              }}
            >
              <div style={{
                display: 'flex',
                gap: '10px',
                flexDirection: isMobile ? 'column' : 'row',
                padding: '6px',
                background: isDark
                  ? 'rgba(0, 0, 0, 0.5)'
                  : 'rgba(255, 255, 255, 0.95)',
                borderRadius: '14px',
                border: isDark
                  ? '1px solid rgba(255,255,255,0.12)'
                  : '1px solid rgba(0,0,0,0.08)',
                boxShadow: isDark
                  ? '0 4px 20px rgba(0,0,0,0.4)'
                  : '0 4px 20px rgba(0,0,0,0.12)',
              }}>
                <input
                  type="text"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '14px 18px',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: 500,
                    color: isDark ? '#ffffff' : '#1a1a2e',
                    outline: 'none',
                  }}
                />
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/register')}
                  style={{
                    whiteSpace: 'nowrap',
                    padding: '14px 28px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '15px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)',
                  }}
                >
                  Get Started
                </Button>
              </div>
            </motion.div>

            {/* Trust Indicators - Cool Blue Glass Pills matching Bear Side */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                justifyContent: isMobile ? 'center' : 'flex-start',
                flexWrap: 'wrap',
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                background: isDark
                  ? 'rgba(16, 185, 129, 0.2)'
                  : 'linear-gradient(135deg, rgba(10, 25, 50, 0.55) 0%, rgba(15, 30, 55, 0.45) 100%)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderRadius: '50px',
                border: isDark
                  ? '1px solid rgba(16, 185, 129, 0.3)'
                  : '1px solid rgba(100, 160, 220, 0.3)',
                boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.4), 0 0 20px rgba(59,130,246,0.08)',
              }}>
                <CountingUsersStat colors={colors} isDark={isDark} />
              </div>
              {[
                { icon: <Shield size={16} />, text: '100% Secure' },
                { icon: <Zap size={16} />, text: '24/7 Support' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(0, 255, 136, 0.2) 0%, rgba(16, 185, 129, 0.15) 100%)'
                    : 'linear-gradient(135deg, rgba(5, 20, 40, 0.75) 0%, rgba(10, 30, 55, 0.65) 100%)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  borderRadius: '50px',
                  border: isDark
                    ? '1px solid rgba(0, 255, 136, 0.25)'
                    : '2px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: isDark
                    ? '0 4px 20px rgba(0, 255, 136, 0.15)'
                    : '0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 700,
                  textShadow: isDark
                    ? '0 1px 3px rgba(0,0,0,0.5)'
                    : '0 2px 4px rgba(0,0,0,0.6)',
                }}>
                  <span style={{ color: '#00ff88', filter: 'drop-shadow(0 0 4px rgba(0, 255, 136, 0.5))' }}>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Crypto Price Cards Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
              gap: isMobile ? '10px' : '12px',
            }}
          >
            {cryptoPrices.map((crypto, index) => (
              <CryptoPriceCard
                key={crypto.symbol}
                symbol={crypto.symbol}
                name={crypto.name}
                price={crypto.price}
                change={crypto.change}
                delay={0.05 + index * 0.03}
                isMobile={isMobile}
                colors={colors}
                isDark={isDark}
                isRotating={rotatingIndices.includes(index)}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Quick Actions Section - Glass Cards with Sequential Animations */}
      <section style={{
        padding: isMobile ? '32px 16px' : '48px 32px',
        position: 'relative',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: isMobile ? '10px' : '16px',
          }}>
            {quickActions.map((action, i) => {
              // Get the appropriate animated icon based on index - BIGGER ICONS
              const getAnimatedIcon = () => {
                const iconSize = isMobile ? 26 : 32; // Bigger icons
                const animationDelay = i * 0.1; // Faster sequential delay
                switch (i) {
                  case 0: return <BuyCryptoIcon size={iconSize} color={action.color} animationDelay={animationDelay} />;
                  case 1: return <SwapIcon size={iconSize} color={action.color} animationDelay={animationDelay} />;
                  case 2: return <EarnIcon size={iconSize} color={action.color} animationDelay={animationDelay} />;
                  case 3: return <StakeIcon size={iconSize} color={action.color} animationDelay={animationDelay} />;
                  default: return React.cloneElement(action.icon, { size: iconSize });
                }
              };

              // Bold 3D Glass - Deep blue-tinted glass for light mode
              const lightBg = 'linear-gradient(145deg, rgba(20,40,60,0.8) 0%, rgba(30,50,80,0.7) 50%, rgba(15,35,55,0.75) 100%)';

              return (
                <div
                  key={action.label}
                  onClick={() => handleProtectedAction(action.action, action.path)}
                  style={{
                    background: isDark
                      ? 'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 50%, rgba(0,0,0,0.2) 100%)'
                      : lightBg,
                    borderRadius: '18px',
                    padding: isMobile ? '20px' : '28px',
                    cursor: 'pointer',
                    border: isDark
                      ? '2px solid rgba(255,255,255,0.15)'
                      : `2px solid ${action.color}50`,
                    boxShadow: isDark
                      ? `0 20px 40px rgba(0,0,0,0.4), 0 8px 16px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.15), inset 0 -2px 0 rgba(0,0,0,0.2)`
                      : `0 20px 50px rgba(0,20,40,0.5), 0 8px 20px rgba(0,30,60,0.35), inset 0 2px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,40,80,0.3), 0 0 30px ${action.color}20`,
                    transformStyle: 'preserve-3d',
                    perspective: '1000px',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                  }}
                >
                  {/* Speed Train Border Animation - Very slow, one at a time */}
                  <SpeedTrainBorder color={action.color} duration={10} delay={i * 12} />

                  {/* Decorative background glow */}
                  <div style={{
                    position: 'absolute',
                    top: '-40%',
                    right: '-30%',
                    width: '140px',
                    height: '140px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${action.color}30 0%, transparent 70%)`,
                    filter: 'blur(20px)',
                    pointerEvents: 'none',
                  }} />

                  {/* Top accent line - THICKER */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, transparent, ${action.color}, transparent)`,
                    borderRadius: '18px 18px 0 0',
                  }} />

                  {/* Glass shine effect */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '50%',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
                    borderRadius: '16px 16px 0 0',
                    pointerEvents: 'none',
                  }} />

                  {/* BIGGER Icon container */}
                  <div style={{
                    width: isMobile ? '56px' : '68px',
                    height: isMobile ? '56px' : '68px',
                    borderRadius: '16px',
                    background: isDark
                      ? `linear-gradient(145deg, ${action.color}25, ${action.color}12)`
                      : `linear-gradient(145deg, ${action.color}35, ${action.color}18)`,
                    border: `2px solid ${action.color}50`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: action.color,
                    marginBottom: '18px',
                    boxShadow: `0 8px 25px ${action.color}30, inset 0 2px 0 rgba(255,255,255,0.2), 0 0 20px ${action.color}15`,
                    position: 'relative',
                    zIndex: 1,
                  }}>
                    {getAnimatedIcon()}
                  </div>
                  {/* BIGGER, BOLDER Text */}
                  <h3 style={{
                    fontSize: isMobile ? '18px' : '20px',
                    fontWeight: 800,
                    color: '#ffffff',
                    marginBottom: '6px',
                    position: 'relative',
                    zIndex: 1,
                    textShadow: '0 2px 8px rgba(0,0,0,0.6), 0 1px 2px rgba(0,0,0,0.4)',
                    letterSpacing: '0.3px',
                  }}>
                    {action.label}
                  </h3>
                  <p style={{
                    fontSize: isMobile ? '14px' : '15px',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.95)',
                    position: 'relative',
                    zIndex: 1,
                    textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                  }}>
                    {action.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Platform Features Section - New Features Grid - BOLD 3D GLASS */}
      <section style={{
        padding: isMobile ? '40px 16px' : '60px 32px',
        position: 'relative',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: isMobile ? '36px' : '48px' }}
          >
            <h2 style={{
              fontSize: isMobile ? '26px' : '38px',
              fontWeight: 800,
              color: isDark ? '#ffffff' : '#0a1628',
              marginBottom: '14px',
              display: 'block',
              textShadow: isDark
                ? '0 3px 12px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.4)'
                : '0 2px 8px rgba(255,255,255,0.8), 0 4px 16px rgba(255,255,255,0.5)',
              letterSpacing: '-0.5px',
            }}>
              Powerful{' '}
              <span style={{
                color: isDark ? colors.primary[400] : '#0284c7',
                background: 'transparent',
                display: 'inline',
                textShadow: isDark
                  ? `0 0 30px ${colors.primary[400]}50`
                  : '0 0 25px rgba(2, 132, 199, 0.6), 0 2px 8px rgba(255,255,255,0.8)',
              }}>
                Platform Features
              </span>
            </h2>
            <p style={{
              fontSize: isMobile ? '15px' : '17px',
              fontWeight: 700,
              color: isDark ? 'rgba(255,255,255,0.95)' : '#1e3a5f',
              maxWidth: '550px',
              margin: '0 auto',
              textShadow: isDark
                ? '0 2px 6px rgba(0,0,0,0.5)'
                : '0 1px 4px rgba(255,255,255,0.7), 0 2px 8px rgba(255,255,255,0.4)',
            }}>
              Everything you need to trade, earn, and grow your digital asset portfolio
            </p>
          </motion.div>

          {/* Feature Carousel Spotlight */}
          <FeatureCarousel features={platformFeatures} isDark={isDark} colors={colors} isMobile={isMobile} />
        </div>
      </section>

      {/* Markets Overview Section - Glass Table */}
      <section style={{
        padding: isMobile ? '48px 20px' : '80px 48px',
        position: 'relative',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '32px',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <h2 style={{
                fontSize: isMobile ? '26px' : '36px',
                fontWeight: 700,
                color: isDark ? colors.text.primary : '#ffffff',
                marginBottom: '8px',
                textShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.5)',
              }}>
                Popular Cryptocurrencies
              </h2>
              <p style={{
                fontSize: '15px',
                color: isDark ? colors.text.tertiary : 'rgba(255,255,255,0.9)',
                textShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.4)',
              }}>
                Trade the most popular digital assets with zero fees
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/markets')}>
              View All Markets <ChevronRight size={16} />
            </Button>
          </motion.div>

          {/* Market Table - Glass Style */}
          <GlassPanel style={{ overflow: 'hidden' }} isDark={isDark}>
            {/* Table Header */}
            {!isMobile && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 140px',
                padding: '16px 28px',
                borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.15)'}`,
                fontSize: '12px',
                fontWeight: 700,
                color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.9)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                textShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.4)',
              }}>
                <span>Name</span>
                <span style={{ textAlign: 'right' }}>Price</span>
                <span style={{ textAlign: 'right' }}>24h Change</span>
                <span style={{ textAlign: 'right' }}>Market Cap</span>
                <span style={{ textAlign: 'center' }}>Action</span>
              </div>
            )}

            {/* Table Rows */}
            {cryptoPrices.map((crypto, i) => (
              <motion.div
                key={crypto.symbol}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.1)' }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1fr 140px',
                  padding: isMobile ? '18px 20px' : '18px 28px',
                  borderBottom: i < cryptoPrices.length - 1 ? `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.1)'}` : 'none',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => navigate(`/trade/${crypto.symbol.toLowerCase()}`)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <CryptoIcon symbol={crypto.symbol} size={28} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                        {crypto.name}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.9)',
                        padding: '3px 8px',
                        background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.15)',
                        borderRadius: '6px',
                        fontWeight: 600,
                        textShadow: isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
                      }}>
                        {crypto.symbol}
                      </span>
                    </div>
                    {isMobile && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '8px' }}>
                        <span style={{
                          fontSize: '15px',
                          fontWeight: 700,
                          fontFamily: "'JetBrains Mono', monospace",
                          color: '#ffffff',
                          textShadow: '0 1px 4px rgba(0,0,0,0.4)',
                        }}>
                          ${crypto.price < 1 ? crypto.price.toFixed(4) : crypto.price.toLocaleString()}
                        </span>
                        <span style={{
                          fontSize: '13px',
                          fontWeight: 600,
                          color: crypto.change >= 0 ? colors.trading.buy : colors.trading.sell,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}>
                          {crypto.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {!isMobile && (
                  <>
                    <span style={{
                      textAlign: 'right',
                      fontSize: '15px',
                      fontWeight: 700,
                      fontFamily: "'JetBrains Mono', monospace",
                      color: '#ffffff',
                      textShadow: '0 1px 4px rgba(0,0,0,0.4)',
                    }}>
                      ${crypto.price < 1 ? crypto.price.toFixed(4) : crypto.price.toLocaleString()}
                    </span>
                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      {crypto.change >= 0 ? <ArrowUpRight size={14} color={colors.trading.buy} /> : <ArrowDownRight size={14} color={colors.trading.sell} />}
                      <span style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: crypto.change >= 0 ? colors.trading.buy : colors.trading.sell,
                      }}>
                        {Math.abs(crypto.change)}%
                      </span>
                    </div>
                    <span style={{
                      textAlign: 'right',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.85)',
                      textShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.3)',
                    }}>
                      ${(crypto.price * 1000000).toLocaleString().slice(0, -3)}M
                    </span>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <motion.button
                        whileHover={{ scale: 1.05, boxShadow: '0 4px 20px rgba(0, 255, 136, 0.4)' }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          padding: '10px 20px',
                          background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: '#0b0e11',
                          cursor: 'pointer',
                        }}
                      >
                        Trade
                      </motion.button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </GlassPanel>
        </div>
      </section>

      {/* Features Section - Glass Cards */}
      <section style={{
        padding: isMobile ? '48px 20px' : '100px 48px',
        position: 'relative',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: isMobile ? '48px' : '64px' }}
          >
            <h2 style={{
              fontSize: isMobile ? '28px' : '44px',
              fontWeight: 800,
              color: isDark ? colors.text.primary : '#ffffff',
              marginBottom: '16px',
              textShadow: isDark ? 'none' : '0 3px 12px rgba(0,0,0,0.9), 0 6px 24px rgba(0,0,0,0.6)',
            }}>
              Why Traders Choose{' '}
              <span style={{
                color: '#00ff88',
                textShadow: '0 0 20px rgba(0,255,136,0.5), 0 2px 4px rgba(0,0,0,0.3)',
              }}>
                CrymadX
              </span>
            </h2>
            <p style={{
              fontSize: isMobile ? '15px' : '17px',
              color: isDark ? colors.text.secondary : '#ffffff',
              maxWidth: '600px',
              margin: '0 auto',
              fontWeight: 700,
              textShadow: isDark ? 'none' : '0 3px 12px rgba(0,0,0,0.9), 0 6px 24px rgba(0,0,0,0.6), 0 1px 2px rgba(0,0,0,0.8)',
            }}>
              Built for serious traders who demand speed, security, and reliability.
            </p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? '16px' : '24px',
          }}>
            {coreFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassPanel style={{ padding: isMobile ? '24px' : '32px' }} hover isDark={isDark}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: 'rgba(0, 255, 136, 0.1)',
                    border: '1px solid rgba(0, 255, 136, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.primary[400],
                    marginBottom: '20px',
                    boxShadow: '0 0 30px rgba(0, 255, 136, 0.15)',
                  }}>
                    {feature.icon}
                  </div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: '12px',
                    textShadow: '0 2px 6px rgba(0,0,0,0.5)',
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.9)',
                    lineHeight: 1.7,
                    textShadow: '0 1px 4px rgba(0,0,0,0.4)',
                  }}>
                    {feature.description}
                  </p>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App Download Section - Glassmorphism */}
      <section style={{
        padding: isMobile ? '60px 20px' : '100px 48px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassPanel
              style={{
                padding: isMobile ? '32px 24px' : '48px 64px',
                position: 'relative',
                overflow: 'hidden',
              }}
              glow
              isDark={isDark}
              glowColor={colors.primary[400]}
            >
              {/* Background gradient orbs - ONLY in dark mode */}
              {isDark && (
                <>
                  <div style={{
                    position: 'absolute',
                    top: '-30%',
                    right: '-10%',
                    width: '400px',
                    height: '400px',
                    background: `radial-gradient(circle, ${colors.primary[400]}20 0%, transparent 70%)`,
                    filter: 'blur(60px)',
                    pointerEvents: 'none',
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: '-20%',
                    left: '10%',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(0, 255, 213, 0.15) 0%, transparent 70%)',
                    filter: 'blur(50px)',
                    pointerEvents: 'none',
                  }} />
                </>
              )}

              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: isMobile ? '40px' : '64px',
                alignItems: 'center',
                position: 'relative',
                zIndex: 1,
              }}>
                {/* Left Content */}
                <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 14px',
                      background: `${colors.primary[400]}15`,
                      border: `1px solid ${colors.primary[400]}30`,
                      borderRadius: '50px',
                      marginBottom: '20px',
                    }}
                  >
                    <Smartphone size={14} color={colors.primary[400]} />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: colors.primary[400] }}>
                      Mobile App Available
                    </span>
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    style={{
                      fontSize: isMobile ? '28px' : '40px',
                      fontWeight: 800,
                      color: '#ffffff',
                      marginBottom: '16px',
                      lineHeight: 1.2,
                      textShadow: isDark ? 'none' : '0 2px 4px rgba(0,0,0,0.4)',
                    }}
                  >
                    Trade Anywhere,{' '}
                    <span style={{
                      background: 'linear-gradient(135deg, #00ff88 0%, #00ffd5 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      Anytime
                    </span>
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    style={{
                      fontSize: isMobile ? '14px' : '16px',
                      color: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.9)',
                      lineHeight: 1.7,
                      marginBottom: '28px',
                      maxWidth: isMobile ? '100%' : '420px',
                      textShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.3)',
                    }}
                  >
                    Download the CrymadX app for a seamless trading experience.
                    Real-time price alerts, instant deposits, biometric security,
                    and full trading capabilities in your pocket.
                  </motion.p>

                  {/* App Features */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '12px',
                      marginBottom: '32px',
                      justifyContent: isMobile ? 'center' : 'flex-start',
                    }}
                  >
                    {['Real-time Alerts', 'Face ID/Touch ID', 'Instant Deposits', 'P2P Trading'].map((feature) => (
                      <div
                        key={feature}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          background: 'rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.25)',
                          backdropFilter: 'blur(8px)',
                        }}
                      >
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: colors.primary[400],
                          boxShadow: `0 0 8px ${colors.primary[400]}`,
                        }} />
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </motion.div>

                  {/* Google Play Button Only - App Store Coming Soon */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    style={{
                      display: 'flex',
                      gap: '14px',
                      flexWrap: 'wrap',
                      justifyContent: isMobile ? 'center' : 'flex-start',
                    }}
                  >
                    {/* Google Play Button */}
                    <motion.button
                      whileHover={{ scale: 1.03, boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.4)' : '0 8px 30px rgba(0,0,0,0.15)' }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '14px 24px',
                        background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.85)',
                        borderRadius: '14px',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
                        cursor: 'pointer',
                      }}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill={isDark ? '#fff' : '#fff'}>
                        <path d="M3.609 1.814a2.21 2.21 0 0 0-.8 1.776v16.82c0 .717.277 1.35.8 1.776l.093.076 9.433-9.428v-.223L3.702 1.738l-.093.076z"/>
                        <path d="M16.278 15.977l-3.143-3.14v-.223l3.143-3.14.071.04 3.723 2.114c1.063.604 1.063 1.594 0 2.199l-3.723 2.114-.071.036z"/>
                        <path d="M16.349 15.941l-3.214-3.213L3.609 22.186c.35.372.928.395 1.584.04l11.156-6.285"/>
                        <path d="M16.349 8.514L5.193 2.229c-.656-.355-1.234-.332-1.584.04l9.526 9.459 3.214-3.214z"/>
                      </svg>
                      <div style={{ textAlign: 'left' }}>
                        <p style={{ fontSize: '10px', color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.7)', marginBottom: '2px' }}>
                          Get it on
                        </p>
                        <p style={{ fontSize: '16px', fontWeight: 600, color: '#fff' }}>
                          Google Play
                        </p>
                      </div>
                    </motion.button>
                  </motion.div>

                  {/* QR Code hint - White text for visibility */}
                  {!isMobile && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 }}
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#ffffff',
                        marginTop: '20px',
                        textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                      }}
                    >
                      Scan QR code with your phone camera to download
                    </motion.p>
                  )}
                </div>

                {/* Right Content - Phone Mockup */}
                {!isMobile && (
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'relative',
                    }}
                  >
                    {/* Phone Frame */}
                    <div style={{
                      position: 'relative',
                      width: '280px',
                      height: '560px',
                      background: isDark
                        ? 'linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%)'
                        : 'linear-gradient(145deg, #f5f5f5 0%, #e0e0e0 100%)',
                      borderRadius: '44px',
                      padding: '12px',
                      boxShadow: isDark
                        ? '0 40px 80px rgba(0,0,0,0.5), 0 0 60px rgba(0, 255, 136, 0.1), inset 0 1px 0 rgba(255,255,255,0.1)'
                        : '0 40px 80px rgba(0,0,0,0.2), 0 0 60px rgba(0, 255, 136, 0.05)',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    }}>
                      {/* Notch */}
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '120px',
                        height: '28px',
                        background: isDark ? '#1a1a1a' : '#2a2a2a',
                        borderRadius: '20px',
                        zIndex: 10,
                      }} />

                      {/* Screen */}
                      <div style={{
                        width: '100%',
                        height: '100%',
                        background: isDark
                          ? 'linear-gradient(180deg, #0a0e14 0%, #0d1117 100%)'
                          : 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
                        borderRadius: '36px',
                        overflow: 'hidden',
                        position: 'relative',
                      }}>
                        {/* App Header */}
                        <div style={{
                          padding: '48px 20px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img
                              src="/crymadx-logo.png"
                              alt="CrymadX"
                              style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
                            />
                          </div>
                        </div>

                        {/* Portfolio Balance */}
                        <div style={{ padding: '8px 20px 20px' }}>
                          <p style={{ fontSize: '11px', color: colors.text.tertiary, marginBottom: '4px' }}>
                            Total Balance
                          </p>
                          <p style={{
                            fontSize: '28px',
                            fontWeight: 700,
                            fontFamily: "'JetBrains Mono', monospace",
                            color: colors.text.primary,
                            marginBottom: '4px',
                          }}>
                            $24,856.42
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <TrendingUp size={12} color={colors.trading.buy} />
                            <span style={{ fontSize: '12px', fontWeight: 600, color: colors.trading.buy }}>
                              +12.4%
                            </span>
                          </div>
                        </div>

                        {/* Mini Chart */}
                        <div style={{
                          margin: '0 20px 16px',
                          height: '80px',
                          background: isDark ? 'rgba(0, 255, 136, 0.05)' : 'rgba(0, 204, 108, 0.05)',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'flex-end',
                          padding: '12px',
                        }}>
                          {[40, 55, 45, 60, 50, 75, 65, 80, 70, 85].map((h, i) => (
                            <div
                              key={i}
                              style={{
                                flex: 1,
                                height: `${h}%`,
                                background: `linear-gradient(to top, ${colors.primary[400]} 0%, ${colors.primary[400]}40 100%)`,
                                borderRadius: '2px',
                                marginRight: i < 9 ? '4px' : 0,
                              }}
                            />
                          ))}
                        </div>

                        {/* Quick Actions */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-around',
                          padding: '0 20px 20px',
                        }}>
                          {[
                            { icon: <ArrowUpRight size={16} />, label: 'Send' },
                            { icon: <ArrowDownRight size={16} />, label: 'Receive' },
                            { icon: <Repeat size={14} />, label: 'Swap' },
                          ].map((action) => (
                            <div
                              key={action.label}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '6px',
                              }}
                            >
                              <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '12px',
                                background: `${colors.primary[400]}15`,
                                border: `1px solid ${colors.primary[400]}25`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: colors.primary[400],
                              }}>
                                {action.icon}
                              </div>
                              <span style={{ fontSize: '10px', color: colors.text.tertiary }}>
                                {action.label}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Asset List */}
                        <div style={{ padding: '0 20px' }}>
                          {[
                            { symbol: 'BTC', name: 'Bitcoin', amount: '0.5234', value: '$23,456', change: 2.4 },
                            { symbol: 'ETH', name: 'Ethereum', amount: '4.2145', value: '$8,234', change: -1.2 },
                          ].map((asset) => (
                            <div
                              key={asset.symbol}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '12px 0',
                                borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <CryptoIcon symbol={asset.symbol} size={28} />
                                <div>
                                  <p style={{ fontSize: '13px', fontWeight: 600, color: colors.text.primary }}>
                                    {asset.symbol}
                                  </p>
                                  <p style={{ fontSize: '10px', color: colors.text.tertiary }}>
                                    {asset.amount}
                                  </p>
                                </div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '13px', fontWeight: 600, color: colors.text.primary }}>
                                  {asset.value}
                                </p>
                                <p style={{
                                  fontSize: '10px',
                                  fontWeight: 500,
                                  color: asset.change >= 0 ? colors.trading.buy : colors.trading.sell,
                                }}>
                                  {asset.change >= 0 ? '+' : ''}{asset.change}%
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Bottom Nav */}
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          display: 'flex',
                          justifyContent: 'space-around',
                          padding: '14px 20px 24px',
                          background: isDark
                            ? 'linear-gradient(to top, rgba(10,14,20,1) 0%, transparent 100%)'
                            : 'linear-gradient(to top, rgba(248,250,252,1) 0%, transparent 100%)',
                        }}>
                          {['Home', 'Markets', 'Trade', 'Wallet'].map((tab, i) => (
                            <div
                              key={tab}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '4px',
                                color: i === 0 ? colors.primary[400] : colors.text.tertiary,
                              }}
                            >
                              <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '4px',
                                background: i === 0 ? `${colors.primary[400]}20` : 'transparent',
                              }} />
                              <span style={{ fontSize: '9px', fontWeight: 500 }}>{tab}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                  </motion.div>
                )}
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Premium Glass */}
      <section style={{
        padding: isMobile ? '60px 20px' : '120px 48px',
        position: 'relative',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ maxWidth: '800px', margin: '0 auto' }}
        >
          <GlassPanel style={{
            padding: isMobile ? '40px 24px' : '64px 48px',
            textAlign: 'center',
          }} glow isDark={isDark} glowColor={colors.primary[400]}>
            <h2 style={{
              fontSize: isMobile ? '28px' : '44px',
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '20px',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            }}>
              Start Trading Today
            </h2>
            <p style={{
              fontSize: isMobile ? '15px' : '18px',
              color: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.9)',
              marginBottom: '36px',
              maxWidth: '500px',
              margin: '0 auto 36px',
              textShadow: '0 1px 4px rgba(0,0,0,0.4)',
            }}>
              Join millions of traders worldwide. Get{' '}
              <span style={{ color: colors.trading.buy, fontWeight: 600 }}>0% trading fees</span>{' '}
              for your first 30 days.
            </p>
            <div style={{
              display: 'flex',
              gap: '14px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
              <Button
                variant="primary"
                size={isMobile ? 'md' : 'lg'}
                rightIcon={<ArrowRight size={18} />}
                onClick={() => navigate('/register')}
                style={{ boxShadow: '0 4px 25px rgba(0, 255, 136, 0.5)' }}
              >
                Create Free Account
              </Button>
              <motion.button
                whileHover={{ scale: 1.02, background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(16, 185, 129, 0.1)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/login')}
                style={{
                  padding: isMobile ? '12px 24px' : '14px 32px',
                  fontSize: isMobile ? '14px' : '16px',
                  fontWeight: 600,
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(16, 185, 129, 0.08)',
                  border: `2px solid ${isDark ? 'rgba(255,255,255,0.3)' : '#059669'}`,
                  borderRadius: '12px',
                  color: isDark ? '#ffffff' : '#059669',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Log In
              </motion.button>
            </div>
          </GlassPanel>
        </motion.div>
      </section>

      {/* Footer - Transparent Glass 3D for light mode */}
      <footer style={{
        padding: isMobile ? '40px 20px 28px' : '72px 48px 40px',
        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.3)'}`,
        background: isDark
          ? 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%)'
          : 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.2) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: isDark ? 'none' : 'inset 0 1px 0 rgba(255,255,255,0.4), 0 -4px 20px rgba(0,0,0,0.1)',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {!isMobile && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr',
              gap: '48px',
              marginBottom: '56px',
            }}>
              {/* Brand */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <img
                    src="/crymadx-logo.png"
                    alt="CrymadX"
                    style={{
                      height: '46px',
                      width: 'auto',
                      objectFit: 'contain',
                      filter: isDark ? 'none' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                    }}
                  />
                </div>
                <p style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: isDark ? 'rgba(255,255,255,0.7)' : '#1f2937',
                  lineHeight: 1.7,
                  maxWidth: '300px',
                  marginBottom: '20px',
                }}>
                  The next generation cryptocurrency exchange built for traders who demand excellence.
                </p>

                {/* Social Icons with Brand Colors */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {socialLinks.map((social) => {
                    const IconComponent = social.icon;
                    return (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{
                          scale: 1.1,
                          boxShadow: `0 6px 20px ${social.color}50`,
                        }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.4)',
                          border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease',
                        }}
                        title={social.label}
                      >
                        <IconComponent size={20} color={social.color} />
                      </motion.a>
                    );
                  })}
                </div>
              </div>

              {/* Links */}
              {[
                { title: 'Products', links: ['Spot Trading', 'Futures', 'Earn', 'NFT'] },
                { title: 'Company', links: ['About', 'Careers', 'Press', 'Blog'] },
                { title: 'Support', links: ['Help Center', 'API Docs', 'Status', 'Contact'] },
              ].map((section) => (
                <div key={section.title}>
                  <h4 style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: isDark ? '#10b981' : '#059669',
                    marginBottom: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}>
                    {section.title}
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {section.links.map((link) => (
                      <li key={link} style={{ marginBottom: '12px' }}>
                        <a
                          href="#"
                          style={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: isDark ? 'rgba(255,255,255,0.7)' : '#374151',
                            textDecoration: 'none',
                            transition: 'color 0.2s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = colors.primary[400])}
                          onMouseLeave={(e) => (e.currentTarget.style.color = isDark ? 'rgba(255,255,255,0.7)' : '#374151')}
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isMobile ? 'center' : 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            paddingTop: isMobile ? '0' : '28px',
            borderTop: isMobile ? 'none' : `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.1)'}`,
            flexDirection: isMobile ? 'column' : 'row',
          }}>
            {isMobile && (
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <img
                  src="/crymadx-logo.png"
                  alt="CrymadX"
                  style={{
                    height: '37px',
                    width: 'auto',
                    objectFit: 'contain',
                  }}
                />
              </div>
            )}
            <p style={{ fontSize: '13px', fontWeight: 500, color: isDark ? 'rgba(255,255,255,0.5)' : '#6b7280' }}>
              © 2025 CrymadX. All rights reserved.
            </p>
            {!isMobile && (
              <div style={{ display: 'flex', gap: '24px' }}>
                {['Privacy', 'Terms', 'Cookies'].map((link) => (
                  <a
                    key={link}
                    href="#"
                    style={{ fontSize: '13px', fontWeight: 500, color: isDark ? 'rgba(255,255,255,0.5)' : '#6b7280', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = colors.primary[400])}
                    onMouseLeave={(e) => (e.currentTarget.style.color = isDark ? 'rgba(255,255,255,0.5)' : '#6b7280')}
                  >
                    {link}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeScreen;
