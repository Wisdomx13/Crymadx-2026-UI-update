import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Gift,
  Users,
  TrendingUp,
  Ticket,
  ArrowLeftRight,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Wallet,
  BarChart2,
  Crown,
  PiggyBank,
  Lock,
} from 'lucide-react';
import { useThemeMode } from '../theme/ThemeContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: string | number;
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} />, href: '/dashboard' },
  { id: 'wallet', label: 'Wallet', icon: <Wallet size={20} />, href: '/wallet' },
  { id: 'markets', label: 'Markets', icon: <BarChart2 size={20} />, href: '/markets' },
  { id: 'spot', label: 'Spot Trading', icon: <TrendingUp size={20} />, href: '/trade' },
  { id: 'p2p', label: 'P2P Trading', icon: <ArrowLeftRight size={20} />, href: '/p2p' },
  { id: 'rewards', label: 'Rewards Hub', icon: <Gift size={20} />, href: '/rewards' },
  { id: 'referral', label: 'Referral Program', icon: <Users size={20} />, href: '/referral' },
  { id: 'tickets', label: 'Support', icon: <Ticket size={20} />, href: '/tickets' },
];

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeItem,
  onItemClick,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, colors } = useThemeMode();
  const isDark = mode === 'dark';
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Determine active item from location if not provided
  const currentActiveItem = activeItem || navItems.find(item => item.href === location.pathname)?.id || 'overview';

  // Theme-aware sidebar background - Crystal clear glass effect
  const sidebarBg = isDark
    ? 'linear-gradient(180deg, rgba(2, 10, 4, 0.98), rgba(4, 18, 8, 0.98))'
    : 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.22) 100%)';

  // Text colors - DARK text for light mode glass to stand out clearly
  const sidebarTextPrimary = isDark ? '#ffffff' : '#1f2937';
  const sidebarTextSecondary = isDark ? 'rgba(255,255,255,0.75)' : '#374151';
  const sidebarTextTertiary = isDark ? 'rgba(255,255,255,0.55)' : '#6b7280';

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{
        height: '100%',
        position: 'sticky',
        left: 0,
        top: 0,
        background: sidebarBg,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRight: isDark ? `1px solid ${colors.glass.border}` : '1px solid rgba(255,255,255,0.4)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        overflow: 'hidden',
        flexShrink: 0,
        boxShadow: isDark
          ? 'none'
          : 'inset -1px 0 0 rgba(255,255,255,0.3), 4px 0 20px rgba(0,0,0,0.08)',
      }}
    >
      {/* Logo - New combined logo with text */}
      <div
        style={{
          padding: collapsed ? '20px 12px' : '20px 20px',
          borderBottom: `1px solid ${colors.glass.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          minHeight: '72px',
        }}
      >
        <img
          src="/crymadx-logo.png"
          alt="CrymadX"
          style={{
            height: collapsed ? '46px' : '51px',
            width: 'auto',
            objectFit: 'contain',
            maxWidth: collapsed ? '51px' : '184px',
          }}
        />
      </div>

      {/* Navigation */}
      <nav style={{
        flex: 1,
        padding: '16px 12px',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const isActive = currentActiveItem === item.id;
            const isHovered = hoveredItem === item.id;

            return (
              <motion.a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.href);
                  onItemClick?.(item.id);
                }}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: collapsed ? '14px 16px' : '14px 16px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
              >
                {/* Active/Hover background */}
                <motion.div
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : isHovered ? 0.5 : 0,
                    scale: isActive || isHovered ? 1 : 0.9,
                  }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: isActive
                      ? isDark
                        ? 'linear-gradient(135deg, rgba(0, 255, 136, 0.12), rgba(0, 255, 213, 0.08))'
                        : 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(16, 185, 129, 0.04))'
                      : isDark
                        ? 'rgba(0, 255, 136, 0.06)'
                        : 'rgba(16, 185, 129, 0.05)',
                    borderRadius: '12px',
                    border: isActive
                      ? isDark
                        ? '1px solid rgba(0, 255, 136, 0.2)'
                        : '1px solid rgba(16, 185, 129, 0.15)'
                      : 'none',
                  }}
                />

                {/* Active indicator line */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '20%',
                      bottom: '20%',
                      width: '3px',
                      borderRadius: '0 2px 2px 0',
                      background: colors.gradients.primary,
                      boxShadow: `0 0 10px ${colors.primary[400]}`,
                    }}
                  />
                )}

                {/* Icon */}
                <motion.span
                  animate={{
                    color: isActive
                      ? (isDark ? colors.primary[400] : '#059669')
                      : sidebarTextSecondary,
                    filter: isActive && isDark ? `drop-shadow(0 0 6px ${colors.primary[400]})` : 'none',
                  }}
                  style={{
                    position: 'relative',
                    transition: 'color 0.2s ease',
                    display: 'flex',
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </motion.span>

                {/* Label */}
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      style={{
                        position: 'relative',
                        fontSize: '15px',
                        fontWeight: isActive ? 700 : 600,
                        color: isActive ? (isDark ? colors.primary[400] : '#059669') : sidebarTextSecondary,
                        whiteSpace: 'nowrap',
                        flex: 1,
                      }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Badge */}
                {item.badge && !collapsed && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      position: 'relative',
                      padding: '3px 8px',
                      fontSize: '10px',
                      fontWeight: 600,
                      color: colors.background.primary,
                      background: colors.gradients.primary,
                      borderRadius: '20px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {item.badge}
                  </motion.span>
                )}
              </motion.a>
            );
          })}
        </div>
      </nav>

      {/* VIP Promo Card */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              margin: '0 12px 16px',
              padding: '20px',
              background: isDark
                ? 'linear-gradient(135deg, rgba(0, 255, 136, 0.08), rgba(0, 255, 213, 0.05))'
                : 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(16, 185, 129, 0.04))',
              border: `1px solid ${isDark ? 'rgba(0, 255, 136, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
              borderRadius: '16px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '10px',
              }}>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Crown size={16} color={isDark ? colors.gold[400] : '#d97706'} />
                </motion.div>
                <span style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: isDark ? colors.gold[400] : '#d97706',
                }}>
                  VIP Rewards
                </span>
              </div>
              <p style={{
                fontSize: '12px',
                color: sidebarTextTertiary,
                marginBottom: '14px',
                lineHeight: 1.5,
              }}>
                Trade more to unlock exclusive benefits and lower fees
              </p>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: isDark ? '0 2px 12px rgba(0, 255, 136, 0.2)' : '0 2px 12px rgba(16, 185, 129, 0.2)' }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(0, 255, 136, 0.15), rgba(0, 255, 213, 0.1))'
                    : 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.1))',
                  border: `1px solid ${isDark ? 'rgba(0, 255, 136, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                  borderRadius: '8px',
                  color: isDark ? '#ffffff' : '#059669',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sign Out */}
      <div style={{
        padding: '16px 12px',
        borderTop: `1px solid ${isDark ? colors.glass.border : 'rgba(0,0,0,0.08)'}`,
      }}>
        <motion.button
          whileHover={{
            background: isDark ? 'rgba(255, 51, 102, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          }}
          whileTap={{ scale: 0.98 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            width: '100%',
            padding: '14px 16px',
            background: 'transparent',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            color: isDark ? sidebarTextSecondary : '#6b7280',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'all 0.2s ease',
          }}
        >
          <LogOut size={20} />
          {!collapsed && <span>Sign Out</span>}
        </motion.button>
      </div>

      {/* Collapse Toggle */}
      <motion.button
        whileHover={{ scale: 1.1, background: 'rgba(0, 255, 136, 0.15)' }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: 'absolute',
          top: '50%',
          right: '-14px',
          transform: 'translateY(-50%)',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: colors.background.secondary,
          border: `1px solid ${colors.glass.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: colors.primary[400],
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </motion.button>
    </motion.aside>
  );
};

export default Sidebar;
