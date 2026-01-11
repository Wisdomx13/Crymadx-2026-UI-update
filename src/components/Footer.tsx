import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Globe,
  Check,
  ChevronDown,
} from 'lucide-react';
import { useThemeMode } from '../theme/ThemeContext';

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

// Real Social Media Icons as SVG
const TwitterXIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const TelegramIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const DiscordIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
  </svg>
);

const InstagramIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const YouTubeIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const LinkedInIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

// Social links with brand colors and real icons
const socialLinks = [
  { icon: TwitterXIcon, label: 'Twitter / X', href: 'https://twitter.com/crymadx', color: '#000000', lightColor: '#ffffff' },
  { icon: TelegramIcon, label: 'Telegram', href: 'https://t.me/crymadx', color: '#0088cc', lightColor: '#0088cc' },
  { icon: DiscordIcon, label: 'Discord', href: 'https://discord.gg/crymadx', color: '#5865F2', lightColor: '#5865F2' },
  { icon: InstagramIcon, label: 'Instagram', href: 'https://instagram.com/crymadx', color: '#E4405F', lightColor: '#E4405F' },
  { icon: YouTubeIcon, label: 'YouTube', href: 'https://youtube.com/@crymadx', color: '#FF0000', lightColor: '#FF0000' },
  { icon: LinkedInIcon, label: 'LinkedIn', href: 'https://linkedin.com/company/crymadx', color: '#0A66C2', lightColor: '#0A66C2' },
];

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { colors, isDark } = useThemeMode();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');

  const currentLanguage = languages.find(l => l.code === currentLang);

  const footerLinks = {
    products: {
      title: 'PRODUCTS',
      links: [
        { label: 'Spot Trading', href: '/trade' },
        { label: 'Futures', href: '/futures' },
        { label: 'Earn', href: '/rewards' },
        { label: 'NFT', href: '/nft' },
      ],
    },
    company: {
      title: 'COMPANY',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Press', href: '/press' },
        { label: 'Blog', href: '/blog' },
      ],
    },
    support: {
      title: 'SUPPORT',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'API Docs', href: '/api' },
        { label: 'Status', href: '/status' },
        { label: 'Contact', href: '/contact' },
      ],
    },
  };

  // Pure white background for light mode
  const footerBg = isDark
    ? 'linear-gradient(180deg, rgba(11, 14, 17, 0.98) 0%, rgba(8, 10, 12, 1) 100%)'
    : '#ffffff';

  const footerBorder = isDark
    ? colors.glass.border
    : '#000000';

  // Text colors - black text for light mode
  const textPrimary = isDark ? '#ffffff' : '#000000';
  const textSecondary = isDark ? 'rgba(255,255,255,0.7)' : '#000000';
  const textMuted = isDark ? 'rgba(255,255,255,0.5)' : '#374151';
  const accentColor = isDark ? '#10b981' : '#000000';

  return (
    <footer style={{
      background: footerBg,
      borderTop: `1px solid ${footerBorder}`,
      marginTop: '40px',
      backdropFilter: isDark ? 'blur(20px)' : 'none',
      WebkitBackdropFilter: isDark ? 'blur(20px)' : 'none',
      position: 'relative',
      boxShadow: isDark ? 'inset 0 1px 0 rgba(255,255,255,0.05)' : 'none',
    }}>
      {/* Main Footer Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '48px 32px 32px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '40px',
          marginBottom: '40px',
        }}>
          {/* Logo & Description Column */}
          <div style={{ gridColumn: 'span 1' }}>
            <img
              src="/crymadx-logo.png"
              alt="CrymadX"
              style={{
                height: '48px',
                width: 'auto',
                objectFit: 'contain',
                marginBottom: '16px',
              }}
            />
            <p style={{
              fontSize: '14px',
              fontWeight: 500,
              color: textSecondary,
              lineHeight: 1.6,
              marginBottom: '24px',
            }}>
              The next generation cryptocurrency exchange built for traders who demand excellence.
            </p>

            {/* Social Links with Brand Colors */}
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
                      boxShadow: isDark ? `0 6px 20px ${social.color}50` : 'none',
                    }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: isDark ? 'rgba(255,255,255,0.1)' : '#ffffff',
                      border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #000000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isDark ? social.color : '#000000',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                    title={social.label}
                  >
                    <IconComponent size={20} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 style={{
              fontSize: '13px',
              fontWeight: 700,
              color: accentColor,
              marginBottom: '20px',
              letterSpacing: '0.1em',
            }}>
              {footerLinks.products.title}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {footerLinks.products.links.map((link) => (
                <li key={link.label} style={{ marginBottom: '12px' }}>
                  <motion.a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); navigate(link.href); }}
                    whileHover={{ color: colors.primary[400], x: 4 }}
                    style={{
                      color: textSecondary,
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: 500,
                      transition: 'all 0.2s ease',
                      display: 'inline-block',
                    }}
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 style={{
              fontSize: '13px',
              fontWeight: 700,
              color: accentColor,
              marginBottom: '20px',
              letterSpacing: '0.1em',
            }}>
              {footerLinks.company.title}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {footerLinks.company.links.map((link) => (
                <li key={link.label} style={{ marginBottom: '12px' }}>
                  <motion.a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); navigate(link.href); }}
                    whileHover={{ color: colors.primary[400], x: 4 }}
                    style={{
                      color: textSecondary,
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: 500,
                      transition: 'all 0.2s ease',
                      display: 'inline-block',
                    }}
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 style={{
              fontSize: '13px',
              fontWeight: 700,
              color: accentColor,
              marginBottom: '20px',
              letterSpacing: '0.1em',
            }}>
              {footerLinks.support.title}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {footerLinks.support.links.map((link) => (
                <li key={link.label} style={{ marginBottom: '12px' }}>
                  <motion.a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); navigate(link.href); }}
                    whileHover={{ color: colors.primary[400], x: 4 }}
                    style={{
                      color: textSecondary,
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: 500,
                      transition: 'all 0.2s ease',
                      display: 'inline-block',
                    }}
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
        }}>
          {/* Copyright */}
          <span style={{
            fontSize: '13px',
            fontWeight: 500,
            color: textMuted,
          }}>
            © {new Date().getFullYear()} CrymadX. All rights reserved.
          </span>

          {/* Language & Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* Language Selector */}
            <div style={{ position: 'relative' }}>
              <motion.button
                whileHover={{
                  background: isDark ? 'rgba(255,255,255,0.15)' : '#f3f4f6',
                }}
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  background: isDark ? 'rgba(255,255,255,0.08)' : '#ffffff',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : '#000000'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: textSecondary,
                  fontSize: '13px',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                }}
              >
                <img
                  src={getFlagUrl(currentLanguage?.countryCode || 'us')}
                  alt={currentLanguage?.name || 'English'}
                  style={{ width: '20px', height: '15px', objectFit: 'cover', borderRadius: '2px' }}
                />
                <span>{currentLanguage?.name}</span>
                <ChevronDown size={14} style={{
                  transform: showLanguageMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }} />
              </motion.button>

              <AnimatePresence>
                {showLanguageMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    style={{
                      position: 'absolute',
                      bottom: 'calc(100% + 8px)',
                      right: 0,
                      width: '180px',
                      maxHeight: '280px',
                      overflowY: 'auto',
                      background: isDark ? 'rgba(20, 30, 45, 0.98)' : '#ffffff',
                      backdropFilter: isDark ? 'blur(24px)' : 'none',
                      WebkitBackdropFilter: isDark ? 'blur(24px)' : 'none',
                      borderRadius: '12px',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : '#000000'}`,
                      boxShadow: isDark ? '0 -16px 48px rgba(0, 0, 0, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
                      zIndex: 100,
                    }}
                  >
                    <div style={{ padding: '8px 0' }}>
                      {languages.map((lang) => (
                        <motion.button
                          key={lang.code}
                          whileHover={{ background: isDark ? 'rgba(255,255,255,0.1)' : '#f3f4f6' }}
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
                            background: currentLang === lang.code ? (isDark ? 'rgba(16, 185, 129, 0.15)' : '#f3f4f6') : 'transparent',
                            border: 'none',
                            color: currentLang === lang.code ? (isDark ? colors.primary[400] : '#000000') : (isDark ? 'rgba(255,255,255,0.8)' : '#000000'),
                            fontSize: '13px',
                            fontWeight: currentLang === lang.code ? 600 : 400,
                            cursor: 'pointer',
                            textAlign: 'left',
                          }}
                        >
                          <img
                            src={getFlagUrl(lang.countryCode)}
                            alt={lang.name}
                            style={{ width: '20px', height: '15px', objectFit: 'cover', borderRadius: '2px' }}
                          />
                          <span style={{ flex: 1 }}>{lang.name}</span>
                          {currentLang === lang.code && (
                            <Check size={14} color={isDark ? colors.primary[400] : '#000000'} />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Privacy, Terms, Cookies */}
            {['Privacy', 'Terms', 'Cookies'].map((link) => (
              <motion.a
                key={link}
                href={`/${link.toLowerCase()}`}
                onClick={(e) => { e.preventDefault(); navigate(`/${link.toLowerCase()}`); }}
                whileHover={{ color: colors.primary[400] }}
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: textMuted,
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
              >
                {link}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
