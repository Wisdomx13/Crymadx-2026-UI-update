import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Bell,
  Menu,
  X,
  LayoutDashboard,
  User,
  Gift,
  Users,
  Settings,
  TrendingUp,
  Ticket,
  ArrowLeftRight,
  Wallet,
  BarChart2,
  Home,
  PiggyBank,
  Lock,
} from 'lucide-react';
import { useThemeMode } from '../theme/ThemeContext';

interface MobileHeaderProps {
  title?: string;
  showBackButton?: boolean;
}

const menuItems = [
  { id: 'home', label: 'Home', icon: <Home size={20} />, href: '/' },
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/dashboard' },
  { id: 'markets', label: 'Markets', icon: <BarChart2 size={20} />, href: '/markets' },
  { id: 'trade', label: 'Spot Trading', icon: <TrendingUp size={20} />, href: '/trade' },
  { id: 'p2p', label: 'Buy Crypto (P2P)', icon: <ArrowLeftRight size={20} />, href: '/p2p' },
  { id: 'wallet', label: 'Wallet', icon: <Wallet size={20} />, href: '/wallet' },
  { id: 'earn', label: 'Earn', icon: <PiggyBank size={20} />, href: '/earn' },
  { id: 'vault', label: 'Vault', icon: <Lock size={20} />, href: '/vault' },
  { id: 'rewards', label: 'Rewards Hub', icon: <Gift size={20} />, href: '/rewards' },
  { id: 'referral', label: 'Referral', icon: <Users size={20} />, href: '/referral' },
  { id: 'profile', label: 'Profile', icon: <User size={20} />, href: '/profile' },
  { id: 'tickets', label: 'Support', icon: <Ticket size={20} />, href: '/tickets' },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} />, href: '/settings' },
];

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  showBackButton = false,
}) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { colors, isDark } = useThemeMode();

  // Theme-aware header background - dark teal for light mode
  const headerBg = isDark
    ? 'rgba(2, 10, 4, 0.95)'
    : 'rgba(15, 70, 90, 0.98)';

  // Header has dark background in both modes - use white text
  const headerTextPrimary = '#ffffff';
  const headerTextSecondary = 'rgba(255,255,255,0.75)';

  return (
    <>
      <motion.header
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          height: '56px',
          background: headerBg,
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: `1px solid ${isDark ? colors.glass.border : 'rgba(0,200,230,0.3)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          zIndex: 1000,
        }}
      >
        {/* Left - Back button or Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {showBackButton ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              style={{
                padding: '8px',
                background: 'rgba(26, 143, 255, 0.1)',
                border: `1px solid ${colors.glass.border}`,
                borderRadius: '10px',
                color: headerTextPrimary,
                cursor: 'pointer',
                display: 'flex',
              }}
            >
              <ChevronLeft size={20} />
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMenuOpen(true)}
              style={{
                padding: '8px',
                background: 'rgba(26, 143, 255, 0.1)',
                border: `1px solid ${colors.glass.border}`,
                borderRadius: '10px',
                color: headerTextPrimary,
                cursor: 'pointer',
                display: 'flex',
              }}
            >
              <Menu size={20} />
            </motion.button>
          )}

          {/* Logo - New combined logo with text */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {title ? (
              <>
                <img
                  src="/crymadx-logo.png"
                  alt="CrymadX"
                  style={{
                    height: '32px',
                    width: 'auto',
                    objectFit: 'contain',
                    marginRight: '8px',
                  }}
                />
                <span style={{ fontSize: '14px', fontWeight: 600, color: headerTextPrimary }}>
                  {title}
                </span>
              </>
            ) : (
              <img
                src="/crymadx-logo.png"
                alt="CrymadX"
                style={{
                  height: '37px',
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
            )}
          </div>
        </div>

        {/* Right - Notifications */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          style={{
            padding: '8px',
            background: 'rgba(0, 255, 136, 0.1)',
            border: `1px solid ${colors.glass.border}`,
            borderRadius: '10px',
            color: headerTextPrimary,
            cursor: 'pointer',
            display: 'flex',
            position: 'relative',
          }}
        >
          <Bell size={18} />
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '8px',
              height: '8px',
              background: colors.status.error,
              borderRadius: '50%',
              border: '2px solid rgba(10, 14, 20, 0.95)',
            }}
          />
        </motion.button>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                zIndex: 1100,
              }}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                width: '300px',
                maxWidth: '85vw',
                background: colors.background.secondary,
                borderRight: `1px solid ${colors.glass.border}`,
                zIndex: 1200,
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
              }}
            >
              {/* Menu Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px 24px',
                  borderBottom: `1px solid ${colors.glass.border}`,
                  paddingTop: 'calc(20px + env(safe-area-inset-top))',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src="/crymadx-logo.png"
                    alt="CrymadX"
                    style={{
                      height: '48px',
                      width: 'auto',
                      objectFit: 'contain',
                    }}
                  />
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    padding: '10px',
                    background: 'rgba(255, 71, 87, 0.1)',
                    border: `1px solid rgba(255, 71, 87, 0.2)`,
                    borderRadius: '10px',
                    color: colors.status.error,
                    cursor: 'pointer',
                    display: 'flex',
                  }}
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Menu Items */}
              <nav style={{ flex: 1, padding: '20px 16px', overflowY: 'auto' }}>
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{
                      x: 6,
                      background: 'rgba(0, 255, 136, 0.08)',
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      navigate(item.href);
                      setMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      width: '100%',
                      padding: '14px 18px',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '12px',
                      color: headerTextSecondary,
                      fontSize: '15px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      marginBottom: '4px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span
                      style={{
                        color: colors.primary[400],
                        display: 'flex',
                        padding: '8px',
                        background: 'rgba(0, 255, 136, 0.1)',
                        borderRadius: '10px',
                      }}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </motion.button>
                ))}
              </nav>

              {/* Auth Buttons */}
              <div
                style={{
                  padding: '20px 24px',
                  paddingBottom: 'calc(20px + env(safe-area-inset-bottom))',
                  borderTop: `1px solid ${colors.glass.border}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigate('/login');
                    setMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'rgba(0, 255, 136, 0.1)',
                    border: `1px solid ${colors.primary[400]}`,
                    borderRadius: '12px',
                    color: colors.primary[400],
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Login
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigate('/register');
                    setMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: colors.gradients.primary,
                    border: 'none',
                    borderRadius: '12px',
                    color: colors.background.primary,
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: colors.shadows.button,
                  }}
                >
                  Register
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileHeader;
