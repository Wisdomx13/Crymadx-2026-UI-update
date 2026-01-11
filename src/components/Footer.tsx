import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
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

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { colors, isDark } = useThemeMode();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');

  const currentLanguage = languages.find(l => l.code === currentLang);

  // Pure white background for light mode
  const footerBg = isDark
    ? 'linear-gradient(180deg, rgba(11, 14, 17, 0.98) 0%, rgba(8, 10, 12, 1) 100%)'
    : '#ffffff';

  const footerBorder = isDark
    ? colors.glass.border
    : '#000000';

  // Text colors - black text for light mode
  const textMuted = isDark ? 'rgba(255,255,255,0.6)' : '#000000';

  return (
    <footer style={{
      background: footerBg,
      borderTop: `1px solid ${footerBorder}`,
      marginTop: '24px',
      backdropFilter: isDark ? 'blur(20px)' : 'none',
      WebkitBackdropFilter: isDark ? 'blur(20px)' : 'none',
      position: 'relative',
      zIndex: 100,
      flexShrink: 0,
    }}>
      {/* Single Line Footer */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        {/* Left: Logo + Copyright */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img
            src="/crymadx-logo.png"
            alt="CrymadX"
            style={{
              height: '28px',
              width: 'auto',
              objectFit: 'contain',
            }}
          />
          <span style={{
            fontSize: '13px',
            fontWeight: 500,
            color: textMuted,
          }}>
            © {new Date().getFullYear()} CrymadX. All rights reserved.
          </span>
        </div>

        {/* Right: Links + Language */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Quick Links */}
          {['Privacy', 'Terms', 'Help', 'Contact'].map((link) => (
            <motion.a
              key={link}
              href={`/${link.toLowerCase()}`}
              onClick={(e) => { e.preventDefault(); navigate(`/${link.toLowerCase()}`); }}
              whileHover={{ color: isDark ? colors.primary[400] : '#374151' }}
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
                gap: '6px',
                padding: '6px 12px',
                background: isDark ? 'rgba(255,255,255,0.08)' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : '#d1d5db'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                color: textMuted,
                fontSize: '12px',
                fontWeight: 500,
                transition: 'all 0.2s ease',
              }}
            >
              <img
                src={getFlagUrl(currentLanguage?.countryCode || 'us')}
                alt={currentLanguage?.name || 'English'}
                style={{ width: '16px', height: '12px', objectFit: 'cover', borderRadius: '2px' }}
              />
              <span>{currentLanguage?.name}</span>
              <ChevronDown size={12} style={{
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
                    width: '160px',
                    maxHeight: '240px',
                    overflowY: 'auto',
                    background: isDark ? 'rgba(20, 30, 45, 0.98)' : '#ffffff',
                    backdropFilter: isDark ? 'blur(24px)' : 'none',
                    WebkitBackdropFilter: isDark ? 'blur(24px)' : 'none',
                    borderRadius: '8px',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : '#d1d5db'}`,
                    boxShadow: isDark ? '0 -16px 48px rgba(0, 0, 0, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
                    zIndex: 100,
                  }}
                >
                  <div style={{ padding: '4px 0' }}>
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
                          gap: '8px',
                          width: '100%',
                          padding: '8px 12px',
                          background: currentLang === lang.code ? (isDark ? 'rgba(16, 185, 129, 0.15)' : '#f3f4f6') : 'transparent',
                          border: 'none',
                          color: currentLang === lang.code ? (isDark ? colors.primary[400] : '#000000') : (isDark ? 'rgba(255,255,255,0.8)' : '#374151'),
                          fontSize: '12px',
                          fontWeight: currentLang === lang.code ? 600 : 400,
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <img
                          src={getFlagUrl(lang.countryCode)}
                          alt={lang.name}
                          style={{ width: '16px', height: '12px', objectFit: 'cover', borderRadius: '2px' }}
                        />
                        <span style={{ flex: 1 }}>{lang.name}</span>
                        {currentLang === lang.code && (
                          <Check size={12} color={isDark ? colors.primary[400] : '#000000'} />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
