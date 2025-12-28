import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { darkColors, lightColors, Colors, ThemeMode } from './colors';

// Theme Context Type
interface ThemeContextType {
  theme: ThemeMode;
  mode: ThemeMode; // Alias for theme
  colors: Colors;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  isDark: boolean;
  isLight: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  mode: 'dark',
  colors: darkColors,
  toggleTheme: () => {},
  setTheme: () => {},
  isDark: true,
  isLight: false,
});

// Custom hook to use theme
export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return context;
};

// Theme Provider Component
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeMode;
}

export const ThemeModeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme: _defaultTheme = 'dark'
}) => {
  // Always start with dark mode as the default
  // User can switch to light mode during their session
  const [theme, setThemeState] = useState<ThemeMode>('dark');

  const colors = theme === 'dark' ? darkColors : lightColors;

  // Save to localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('crymadx-theme', theme);
    // Update document body for global styles
    document.documentElement.setAttribute('data-theme', theme);
    document.body.style.background = colors.background.primary;
    document.body.style.color = colors.text.primary;
  }, [theme, colors]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        mode: theme,
        colors,
        toggleTheme,
        setTheme,
        isDark: theme === 'dark',
        isLight: theme === 'light',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Floating Theme Toggle Button (Bottom Right) - kept for potential future use
const _ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme, colors: _colors } = useThemeMode();
  const isDark = theme === 'dark';

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.4 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        background: isDark
          ? 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
          : 'linear-gradient(145deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.1) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        boxShadow: isDark
          ? '0 8px 32px rgba(0,0,0,0.4), 0 0 40px rgba(0, 255, 136, 0.1)'
          : '0 8px 32px rgba(0,0,0,0.15), 0 0 40px rgba(0, 204, 108, 0.08)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        overflow: 'hidden',
      }}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {/* Glow effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: isDark
          ? 'radial-gradient(circle at center, rgba(0, 255, 136, 0.15) 0%, transparent 70%)'
          : 'radial-gradient(circle at center, rgba(255, 200, 50, 0.2) 0%, transparent 70%)',
        opacity: 0.8,
      }} />

      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {isDark ? (
            <Sun
              size={24}
              color="#ffd700"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))',
              }}
            />
          ) : (
            <Moon
              size={24}
              color="#6366f1"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.6))',
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Ripple effect on hover */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '16px',
          border: `2px solid ${isDark ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 200, 50, 0.3)'}`,
          opacity: 0,
        }}
        whileHover={{ opacity: 1, scale: 1.1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  );
};

export default ThemeModeProvider;
