import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ChevronDown,
  Bell,
  User,
  Settings,
  LogOut,
  Wallet,
  History,
  Shield,
  HelpCircle,
  Globe,
  Moon,
} from 'lucide-react';
import { colors } from '../theme';
import { Button, IconButton } from './Button';

interface NavItem {
  label: string;
  href?: string;
  children?: { label: string; href: string; icon?: React.ReactNode }[];
}

const navItems: NavItem[] = [
  {
    label: 'Trade',
    children: [
      { label: 'Spot Trading', href: '/trade/spot' },
      { label: 'Margin Trading', href: '/trade/margin' },
      { label: 'Futures', href: '/trade/futures' },
      { label: 'P2P Trading', href: '/trade/p2p' },
    ],
  },
  {
    label: 'Markets',
    href: '/markets',
  },
  {
    label: 'Earn',
    children: [
      { label: 'Staking', href: '/earn/staking' },
      { label: 'Savings', href: '/earn/savings' },
      { label: 'Launchpad', href: '/earn/launchpad' },
    ],
  },
  {
    label: 'NFT',
    href: '/nft',
  },
  {
    label: 'More',
    children: [
      { label: 'API', href: '/api' },
      { label: 'Referral', href: '/referral' },
      { label: 'Support', href: '/support' },
    ],
  },
];

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const isLoggedIn = true; // Mock state

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '72px',
      background: 'rgba(5, 10, 5, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${colors.glass.border}`,
      zIndex: 1000,
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
      }}>
        {/* Logo - New combined logo with text */}
        <motion.a
          href="/"
          whileHover={{ scale: 1.02 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
          }}
        >
          <img
            src="/crymadx-logo.png"
            alt="CrymadX"
            style={{
              height: '51px',
              width: 'auto',
              objectFit: 'contain',
            }}
          />
        </motion.a>

        {/* Desktop Navigation */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
          className="desktop-nav"
        >
          {navItems.map((item) => (
            <div
              key={item.label}
              style={{ position: 'relative' }}
              onMouseEnter={() => setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <motion.a
                href={item.href || '#'}
                whileHover={{ color: colors.primary[400] }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: colors.text.secondary,
                  textDecoration: 'none',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                }}
              >
                {item.label}
                {item.children && (
                  <motion.span
                    animate={{ rotate: activeDropdown === item.label ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={14} />
                  </motion.span>
                )}
              </motion.a>

              {/* Dropdown */}
              <AnimatePresence>
                {item.children && activeDropdown === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      minWidth: '200px',
                      padding: '8px',
                      background: 'rgba(10, 18, 10, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: `1px solid ${colors.glass.border}`,
                      borderRadius: '12px',
                      boxShadow: colors.shadows.lg,
                    }}
                  >
                    {item.children.map((child) => (
                      <motion.a
                        key={child.label}
                        href={child.href}
                        whileHover={{ background: 'rgba(0, 255, 136, 0.08)' }}
                        style={{
                          display: 'block',
                          padding: '10px 14px',
                          fontSize: '14px',
                          color: colors.text.secondary,
                          textDecoration: 'none',
                          borderRadius: '8px',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {child.label}
                      </motion.a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Right Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          {/* Theme Toggle */}
          <IconButton
            icon={<Moon size={18} />}
            variant="ghost"
            size="sm"
          />

          {/* Language */}
          <IconButton
            icon={<Globe size={18} />}
            variant="ghost"
            size="sm"
          />

          {isLoggedIn ? (
            <>
              {/* Notifications */}
              <div style={{ position: 'relative' }}>
                <IconButton
                  icon={<Bell size={18} />}
                  variant="ghost"
                  size="sm"
                />
                <div style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: colors.primary[400],
                  border: `2px solid ${colors.background.primary}`,
                }} />
              </div>

              {/* User Menu */}
              <div
                style={{ position: 'relative' }}
                onMouseEnter={() => setUserMenuOpen(true)}
                onMouseLeave={() => setUserMenuOpen(false)}
              >
                <motion.button
                  whileHover={{ background: 'rgba(0, 255, 136, 0.08)' }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    background: 'transparent',
                    border: `1px solid ${colors.glass.border}`,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    color: colors.text.primary,
                  }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: colors.gradients.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <User size={16} color={colors.background.primary} />
                  </div>
                  <ChevronDown size={14} />
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        width: '220px',
                        marginTop: '8px',
                        padding: '8px',
                        background: 'rgba(10, 18, 10, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${colors.glass.border}`,
                        borderRadius: '12px',
                        boxShadow: colors.shadows.lg,
                      }}
                    >
                      {[
                        { icon: <Wallet size={16} />, label: 'Wallet', href: '/wallet' },
                        { icon: <History size={16} />, label: 'Orders', href: '/orders' },
                        { icon: <Shield size={16} />, label: 'Security', href: '/security' },
                        { icon: <Settings size={16} />, label: 'Settings', href: '/settings' },
                        { icon: <HelpCircle size={16} />, label: 'Help Center', href: '/help' },
                      ].map((item) => (
                        <motion.a
                          key={item.label}
                          href={item.href}
                          whileHover={{ background: 'rgba(0, 255, 136, 0.08)' }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 12px',
                            fontSize: '14px',
                            color: colors.text.secondary,
                            textDecoration: 'none',
                            borderRadius: '8px',
                          }}
                        >
                          {item.icon}
                          {item.label}
                        </motion.a>
                      ))}
                      <div style={{
                        height: '1px',
                        background: colors.glass.border,
                        margin: '8px 0',
                      }} />
                      <motion.button
                        whileHover={{ background: 'rgba(255, 71, 87, 0.1)' }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          width: '100%',
                          padding: '10px 12px',
                          fontSize: '14px',
                          color: colors.status.error,
                          background: 'transparent',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                        }}
                      >
                        <LogOut size={16} />
                        Logout
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm">Log In</Button>
              <Button variant="primary" size="sm">Sign Up</Button>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <IconButton
            icon={mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            variant="ghost"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none' }}
            className="mobile-menu-btn"
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              position: 'absolute',
              top: '72px',
              left: 0,
              right: 0,
              background: 'rgba(5, 10, 5, 0.98)',
              backdropFilter: 'blur(20px)',
              borderBottom: `1px solid ${colors.glass.border}`,
              padding: '16px',
            }}
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href || '#'}
                style={{
                  display: 'block',
                  padding: '14px 16px',
                  fontSize: '16px',
                  fontWeight: 500,
                  color: colors.text.secondary,
                  textDecoration: 'none',
                  borderRadius: '8px',
                }}
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
