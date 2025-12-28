import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Wallet,
  Download,
  Globe,
  Sun,
  Moon,
  Bell,
  Shield,
  AlertTriangle,
  Check,
  ChevronRight,
  ChevronDown,
  LogOut,
  Settings,
  Gift,
  QrCode,
  X,
} from 'lucide-react';
import { useThemeMode } from '../theme/ThemeContext';
import { usePresentationMode } from './PresentationMode';
import { useAuth } from '../context/AuthContext';

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  message: string;
  action?: string;
  href?: string;
  read: boolean;
}

interface TopHeaderProps {
  userName?: string;
  userEmail?: string;
}

// Country code to flag image URL mapping
const getFlagUrl = (countryCode: string) =>
  `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`;

const languages = [
  { code: 'en', name: 'English', countryCode: 'us' },
  { code: 'es', name: 'Español', countryCode: 'es' },
  { code: 'fr', name: 'Français', countryCode: 'fr' },
  { code: 'de', name: 'Deutsch', countryCode: 'de' },
  { code: 'zh', name: '中文', countryCode: 'cn' },
  { code: 'ja', name: '日本語', countryCode: 'jp' },
  { code: 'ko', name: '한국어', countryCode: 'kr' },
  { code: 'pt', name: 'Português', countryCode: 'br' },
  { code: 'ru', name: 'Русский', countryCode: 'ru' },
  { code: 'ar', name: 'العربية', countryCode: 'sa' },
];

export const TopHeader: React.FC<TopHeaderProps> = ({
  userName = 'User',
  userEmail = 'user@email.com',
}) => {
  const navigate = useNavigate();
  const { colors, isDark, toggleTheme } = useThemeMode();
  const { isMobile: _isMobile } = usePresentationMode();
  const { userAvatar } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '2fa',
      type: 'warning',
      title: 'Enable Two-Factor Authentication',
      message: 'Secure your account with 2FA for enhanced protection',
      action: 'Setup Now',
      href: '/settings/security',
      read: false,
    },
    {
      id: 'kyc',
      type: 'warning',
      title: 'Complete KYC Verification',
      message: 'Required to unlock full trading features and withdrawals',
      action: 'Verify Now',
      href: '/kyc',
      read: false,
    },
    {
      id: 'welcome',
      type: 'info',
      title: 'Welcome to CrymadX!',
      message: 'Start trading crypto with ultra-low fees',
      read: true,
    },
  ]);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Header text colors - BRIGHT WHITE with STRONG shadows for light mode visibility
  const headerTextPrimary = isDark ? '#ffffff' : '#ffffff';
  const headerTextSecondary = isDark ? 'rgba(255,255,255,0.75)' : '#ffffff';
  const headerTextTertiary = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.9)';
  // STRONG text shadow for navigation visibility in light mode
  const headerTextShadow = isDark ? 'none' : '0 0 10px rgba(255,255,255,0.9), 0 0 20px rgba(255,255,255,0.5), 0 2px 8px rgba(0,0,0,0.9), 0 4px 16px rgba(0,0,0,0.6)';

  const iconButtonStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: isDark ? 'transparent' : 'rgba(255,255,255,0.2)',
    border: isDark ? 'none' : '1px solid rgba(255,255,255,0.3)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: headerTextSecondary,
    position: 'relative' as const,
    transition: 'all 0.2s ease',
    filter: isDark ? 'none' : 'drop-shadow(0 2px 4px rgba(0,50,100,0.2))',
  };

  const menuStyle = {
    position: 'absolute' as const,
    top: 'calc(100% + 8px)',
    right: 0,
    background: isDark
      ? 'linear-gradient(145deg, rgba(30, 35, 41, 0.98), rgba(22, 24, 28, 0.98))'
      : '#ffffff', // Solid white dropdown in light mode
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderRadius: '14px',
    border: `1px solid ${isDark ? colors.glass.border : 'rgba(0, 0, 0, 0.1)'}`,
    boxShadow: isDark
      ? '0 16px 48px rgba(0, 0, 0, 0.5)'
      : '0 8px 30px rgba(0, 0, 0, 0.15)', // Clean shadow in light mode
    overflow: 'hidden',
    zIndex: 9999,
  };

  const currentLanguage = languages.find(l => l.code === currentLang);

  // Premium header background - DARKER glass for light mode for better text visibility
  const headerBg = isDark
    ? 'linear-gradient(90deg, rgba(11, 14, 17, 0.9), rgba(15, 20, 25, 0.85))'
    : 'linear-gradient(145deg, rgba(10,40,70,0.7) 0%, rgba(5,30,60,0.65) 50%, rgba(0,25,50,0.7) 100%)';

  const headerBorder = isDark ? colors.glass.border : 'rgba(255,255,255,0.4)';

  const headerShadow = isDark
    ? 'none'
    : '0 4px 24px rgba(0,50,100,0.15), inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,50,100,0.08)';

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 24px',
      borderBottom: `1px solid ${headerBorder}`,
      background: headerBg,
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      boxShadow: headerShadow,
      position: 'relative',
      zIndex: 100,
    }}>
      {/* Navigation Links - Left Side */}
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
              whileHover={{ color: '#ffffff', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.25)' }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '10px 16px',
                fontSize: '15px',
                fontWeight: 700,
                color: headerTextSecondary,
                background: 'none',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textShadow: headerTextShadow,
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
                  background: isDark ? 'rgba(20, 25, 30, 0.98)' : 'rgba(15, 45, 80, 0.98)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)'}`,
                  borderRadius: '12px',
                  padding: '8px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                  zIndex: 200,
                }}
              >
                {link.subLinks.map((subLink) => (
                  <motion.button
                    key={subLink.label}
                    onClick={() => { navigate(subLink.href); setActiveDropdown(null); }}
                    whileHover={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.15)' }}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '10px 16px',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'rgba(255,255,255,0.9)',
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

      {/* Utility Buttons - Right Side */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}>
        {/* Download App */}
        <div style={{ position: 'relative' }}>
          <motion.button
            whileHover={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(16, 185, 129, 0.1)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowDownloadMenu(!showDownloadMenu);
              setShowNotifications(false);
              setShowLanguageMenu(false);
              setShowWalletMenu(false);
              setShowProfileMenu(false);
            }}
            style={iconButtonStyle}
            title="Download App"
          >
            <Download size={18} />
          </motion.button>

          <AnimatePresence>
            {showDownloadMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                style={{ ...menuStyle, width: '200px' }}
              >
                <div style={{ padding: '14px' }}>
                  <p style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: headerTextPrimary,
                    marginBottom: '10px',
                  }}>
                    Download CrymadX App
                  </p>
                  <div style={{
                    width: '100px',
                    height: '100px',
                    margin: '0 auto 12px',
                    background: '#fff',
                    borderRadius: '8px',
                    padding: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <QrCode size={70} color="#1a1d21" />
                  </div>
                  <p style={{
                    fontSize: '10px',
                    color: headerTextTertiary,
                    textAlign: 'center',
                  }}>
                    Scan to download
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Language Selector */}
        <div style={{ position: 'relative' }}>
          <motion.button
            whileHover={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(16, 185, 129, 0.1)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowLanguageMenu(!showLanguageMenu);
              setShowDownloadMenu(false);
              setShowNotifications(false);
              setShowWalletMenu(false);
              setShowProfileMenu(false);
            }}
            style={{
              ...iconButtonStyle,
              gap: '4px',
              width: 'auto',
              padding: '0 10px',
            }}
            title="Language"
          >
            <Globe size={18} />
            <img
              src={getFlagUrl(currentLanguage?.countryCode || 'us')}
              alt={currentLanguage?.name || 'English'}
              style={{ width: '20px', height: '15px', objectFit: 'cover', borderRadius: '2px' }}
            />
          </motion.button>

          <AnimatePresence>
            {showLanguageMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                style={{ ...menuStyle, width: '180px', maxHeight: '300px', overflowY: 'auto' }}
              >
                <div style={{ padding: '8px 0' }}>
                  {languages.map((lang) => (
                    <motion.button
                      key={lang.code}
                      whileHover={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(16, 185, 129, 0.08)' }}
                      onClick={() => {
                        setCurrentLang(lang.code);
                        setShowLanguageMenu(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        padding: '10px 14px',
                        background: currentLang === lang.code
                          ? (isDark ? 'rgba(0, 255, 136, 0.1)' : 'rgba(16, 185, 129, 0.12)')
                          : 'transparent',
                        border: 'none',
                        color: isDark
                          ? (currentLang === lang.code ? colors.primary[400] : headerTextSecondary)
                          : (currentLang === lang.code ? colors.primary[400] : '#374151'),
                        fontSize: '13px',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <img
                        src={getFlagUrl(lang.countryCode)}
                        alt={lang.name}
                        style={{ width: '24px', height: '18px', objectFit: 'cover', borderRadius: '2px' }}
                      />
                      <span>{lang.name}</span>
                      {currentLang === lang.code && (
                        <Check size={14} style={{ marginLeft: 'auto' }} />
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(16, 185, 129, 0.1)' }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          style={{
            ...iconButtonStyle,
            color: isDark ? '#fbbf24' : '#0f766e',
          }}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isDark ? 'sun' : 'moon'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex' }}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </motion.div>
          </AnimatePresence>
        </motion.button>

        {/* Notifications Bell */}
        <div style={{ position: 'relative' }}>
          <motion.button
            whileHover={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(16, 185, 129, 0.1)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowDownloadMenu(false);
              setShowLanguageMenu(false);
              setShowWalletMenu(false);
              setShowProfileMenu(false);
            }}
            style={iconButtonStyle}
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: colors.status.error,
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {unreadCount}
              </motion.span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                style={{ ...menuStyle, width: '320px' }}
              >
                {/* Header */}
                <div style={{
                  padding: '12px 14px',
                  borderBottom: `1px solid ${colors.glass.border}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: headerTextPrimary,
                  }}>
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span style={{
                      padding: '2px 8px',
                      background: colors.status.errorBg,
                      borderRadius: '10px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: colors.status.error,
                    }}>
                      {unreadCount} new
                    </span>
                  )}
                </div>

                {/* Notifications List */}
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{
                      padding: '32px 16px',
                      textAlign: 'center',
                      color: headerTextTertiary,
                    }}>
                      <Bell size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
                      <p style={{ fontSize: '13px' }}>No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        style={{
                          padding: '12px 14px',
                          borderBottom: `1px solid ${colors.glass.border}`,
                          background: !notification.read
                            ? (isDark ? 'rgba(0, 255, 136, 0.03)' : 'rgba(0, 229, 255, 0.08)')
                            : 'transparent',
                          position: 'relative',
                        }}
                      >
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: notification.type === 'warning'
                              ? colors.status.warningBg
                              : notification.type === 'success'
                              ? colors.status.successBg
                              : colors.status.infoBg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            {notification.type === 'warning' ? (
                              <AlertTriangle size={16} color={colors.status.warning} />
                            ) : notification.id === '2fa' ? (
                              <Shield size={16} color={colors.status.warning} />
                            ) : (
                              <Bell size={16} color={colors.status.info} />
                            )}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{
                              fontSize: '12px',
                              fontWeight: 600,
                              color: headerTextPrimary,
                              marginBottom: '2px',
                            }}>
                              {notification.title}
                            </p>
                            <p style={{
                              fontSize: '11px',
                              color: headerTextTertiary,
                              lineHeight: 1.4,
                            }}>
                              {notification.message}
                            </p>
                            {notification.action && notification.href && (
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                  markAsRead(notification.id);
                                  navigate(notification.href!);
                                  setShowNotifications(false);
                                }}
                                style={{
                                  marginTop: '8px',
                                  padding: '6px 12px',
                                  background: colors.gradients.primarySolid,
                                  border: 'none',
                                  borderRadius: '6px',
                                  color: isDark ? colors.background.primary : '#fff',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                {notification.action}
                                <ChevronRight size={12} />
                              </motion.button>
                            )}
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => dismissNotification(notification.id)}
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              background: 'transparent',
                              border: 'none',
                              color: headerTextTertiary,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <X size={12} />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Wallet */}
        <div style={{ position: 'relative' }}>
          <motion.button
            whileHover={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(16, 185, 129, 0.1)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowWalletMenu(!showWalletMenu);
              setShowDownloadMenu(false);
              setShowNotifications(false);
              setShowLanguageMenu(false);
              setShowProfileMenu(false);
            }}
            style={iconButtonStyle}
            title="Wallet"
          >
            <Wallet size={18} />
          </motion.button>

          <AnimatePresence>
            {showWalletMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                style={{ ...menuStyle, width: '180px' }}
              >
                {[
                  { label: 'Overview', icon: <Wallet size={15} />, href: '/wallet' },
                  { label: 'Spot', icon: <Wallet size={15} />, href: '/wallet' },
                  { label: 'Funding', icon: <Gift size={15} />, href: '/wallet' },
                  { label: 'Earn', icon: <Gift size={15} />, href: '/rewards' },
                ].map((item, i, arr) => (
                  <motion.button
                    key={item.label}
                    whileHover={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(16, 185, 129, 0.08)' }}
                    onClick={() => { navigate(item.href); setShowWalletMenu(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '10px 14px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: i < arr.length - 1 ? `1px solid ${isDark ? colors.glass.border : 'rgba(0,0,0,0.06)'}` : 'none',
                      color: isDark ? headerTextSecondary : '#374151',
                      fontSize: '12px',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div style={{ position: 'relative' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowDownloadMenu(false);
              setShowNotifications(false);
              setShowLanguageMenu(false);
              setShowWalletMenu(false);
            }}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: colors.gradients.primarySolid,
              border: `2px solid ${colors.primary[400]}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isDark ? colors.background.primary : '#fff',
              fontWeight: 700,
              fontSize: '14px',
              marginLeft: '4px',
              padding: 0,
              overflow: 'hidden',
            }}
            title="Account"
          >
            <img
              src={userAvatar}
              alt="Profile"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '50%',
              }}
              onError={(e) => {
                // Fallback to letter if image fails
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </motion.button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                style={{ ...menuStyle, width: '220px' }}
              >
                {/* User Info Header */}
                <div style={{
                  padding: '14px',
                  borderBottom: `1px solid ${isDark ? colors.glass.border : 'rgba(0,0,0,0.06)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: colors.gradients.primarySolid,
                    border: `2px solid ${colors.primary[400]}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}>
                    <img
                      src={userAvatar}
                      alt="Profile"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '50%',
                      }}
                    />
                  </div>
                  <div>
                    <p style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: isDark ? headerTextPrimary : '#111827',
                    }}>
                      {userEmail.replace(/(.{3}).*(@.*)/, '$1***$2')}
                    </p>
                    <span style={{
                      padding: '2px 6px',
                      background: colors.trading.buyBg,
                      borderRadius: '4px',
                      fontSize: '9px',
                      fontWeight: 600,
                      color: colors.trading.buy,
                    }}>
                      Verified
                    </span>
                  </div>
                </div>

                {/* Menu Items */}
                {[
                  { label: 'Dashboard', icon: <Wallet size={15} />, href: '/dashboard' },
                  { label: 'Profile', icon: <User size={15} />, href: '/profile' },
                  { label: 'Security', icon: <Shield size={15} />, href: '/settings' },
                  { label: 'Settings', icon: <Settings size={15} />, href: '/settings' },
                ].map((item) => (
                  <motion.button
                    key={item.label}
                    whileHover={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(16, 185, 129, 0.08)' }}
                    onClick={() => { navigate(item.href); setShowProfileMenu(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '10px 14px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: `1px solid ${isDark ? colors.glass.border : 'rgba(0,0,0,0.06)'}`,
                      color: isDark ? headerTextSecondary : '#374151',
                      fontSize: '12px',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </motion.button>
                ))}

                {/* Logout */}
                <motion.button
                  whileHover={{ background: 'rgba(255, 71, 87, 0.15)' }}
                  onClick={() => navigate('/login')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '10px 14px',
                    background: 'transparent',
                    border: 'none',
                    color: colors.status.error,
                    fontSize: '12px',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <LogOut size={15} />
                  Log Out
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
