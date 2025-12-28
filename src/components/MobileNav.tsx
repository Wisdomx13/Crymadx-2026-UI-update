import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  PiggyBank,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { useThemeMode } from '../theme/ThemeContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Home', icon: <LayoutDashboard size={20} />, href: '/dashboard' },
  { id: 'trade', label: 'Trade', icon: <TrendingUp size={20} />, href: '/trade' },
  { id: 'wallet', label: 'Wallet', icon: <Wallet size={20} />, href: '/wallet' },
  { id: 'earn', label: 'Earn', icon: <PiggyBank size={20} />, href: '/earn' },
  { id: 'profile', label: 'Profile', icon: <User size={20} />, href: '/profile' },
];

export const MobileNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { colors, isDark } = useThemeMode();

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  // Theme-aware mobile nav background - dark teal for light mode
  const navBg = isDark
    ? 'rgba(2, 10, 4, 0.95)'
    : 'rgba(15, 70, 90, 0.98)';

  // Nav has dark background in both modes - use white/light text
  const navTextTertiary = 'rgba(255,255,255,0.55)';

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        background: navBg,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderTop: `1px solid ${isDark ? colors.glass.border : 'rgba(0,200,230,0.3)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 8px',
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 1000,
      }}
    >
      {/* Center glow effect */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200px',
          height: '40px',
          background: `radial-gradient(ellipse, rgba(0, 255, 136, 0.1) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(item.href)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 12px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              minWidth: '56px',
            }}
          >
            {/* Active indicator - Top line */}
            {active && (
              <motion.div
                layoutId="mobileActiveTab"
                style={{
                  position: 'absolute',
                  top: '-1px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '40px',
                  height: '3px',
                  background: colors.gradients.primary,
                  borderRadius: '0 0 4px 4px',
                  boxShadow: `0 0 12px ${colors.primary[400]}`,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}

            {/* Icon with glow effect when active */}
            <motion.span
              animate={{
                color: active ? colors.primary[400] : navTextTertiary,
                scale: active ? 1.1 : 1,
              }}
              style={{
                display: 'flex',
                filter: active ? `drop-shadow(0 0 8px ${colors.primary[400]})` : 'none',
              }}
              transition={{ duration: 0.2 }}
            >
              {item.icon}
            </motion.span>

            {/* Label */}
            <motion.span
              animate={{
                color: active ? colors.primary[400] : navTextTertiary,
              }}
              style={{
                fontSize: '10px',
                fontWeight: active ? 600 : 500,
                letterSpacing: '0.02em',
              }}
              transition={{ duration: 0.2 }}
            >
              {item.label}
            </motion.span>
          </motion.button>
        );
      })}
    </motion.nav>
  );
};

export default MobileNav;
