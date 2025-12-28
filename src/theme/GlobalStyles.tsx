import React, { createContext, useContext } from 'react';
import { theme } from './index';
import { useThemeMode } from './ThemeContext';

// Dynamic global CSS styles based on theme
const createGlobalStyles = (colors: any) => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${theme.typography.fontFamily.sans};
    background: ${colors.background.primary};
    color: ${colors.text.primary};
    line-height: ${theme.typography.lineHeight.normal};
    min-height: 100vh;
    overflow-x: hidden;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: ${colors.background.primary};
  }

  ::-webkit-scrollbar-thumb {
    background: ${colors.background.elevated};
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${colors.background.hover};
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: ${colors.background.elevated} ${colors.background.primary};
  }

  ::selection {
    background: ${colors.mode === 'dark' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(0, 204, 108, 0.2)'};
    color: ${colors.text.primary};
  }

  :focus-visible {
    outline: 2px solid ${colors.primary[400]};
    outline-offset: 2px;
  }

  a {
    color: ${colors.primary[400]};
    text-decoration: none;
    transition: color 0.2s ease;
  }

  a:hover {
    color: ${colors.primary[300]};
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    background: transparent;
    border: none;
    outline: none;
  }

  input::placeholder,
  textarea::placeholder {
    color: ${colors.text.muted};
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px ${colors.background.input} inset !important;
    -webkit-text-fill-color: ${colors.text.primary} !important;
    caret-color: ${colors.text.primary};
  }

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }

  .mono {
    font-family: ${theme.typography.fontFamily.mono};
  }

  .gradient-text {
    background: ${colors.gradients.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .glow { box-shadow: ${colors.shadows.glow}; }
  .glow-md { box-shadow: ${colors.shadows.glowMd}; }
  .glow-lg { box-shadow: ${colors.shadows.glowLg}; }

  .glass {
    background: ${colors.glass.frosted};
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid ${colors.glass.border};
  }

  .glass-card {
    background: ${colors.background.card};
    border: 1px solid ${colors.glass.border};
    border-radius: 16px;
    box-shadow: ${colors.shadows.card};
  }

  .buy { color: ${colors.trading.buy}; }
  .sell { color: ${colors.trading.sell}; }
  .buy-bg { background: ${colors.trading.buyBg}; }
  .sell-bg { background: ${colors.trading.sellBg}; }

  /* Animation Keyframes */
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px ${colors.mode === 'dark' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(0, 204, 108, 0.15)'}; }
    50% { box-shadow: 0 0 40px ${colors.mode === 'dark' ? 'rgba(0, 255, 136, 0.4)' : 'rgba(0, 204, 108, 0.3)'}; }
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @keyframes breathe {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.05); opacity: 0.8; }
  }

  @keyframes orbit {
    from { transform: rotate(0deg) translateX(100px) rotate(0deg); }
    to { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
  }

  @keyframes glowPulse {
    0%, 100% { text-shadow: 0 0 10px ${colors.mode === 'dark' ? 'rgba(0, 255, 136, 0.5)' : 'rgba(0, 204, 108, 0.4)'}; }
    50% { text-shadow: 0 0 20px ${colors.mode === 'dark' ? 'rgba(0, 255, 136, 0.8)' : 'rgba(0, 204, 108, 0.6)'}, 0 0 30px ${colors.mode === 'dark' ? 'rgba(0, 255, 136, 0.4)' : 'rgba(0, 204, 108, 0.3)'}; }
  }

  @keyframes tickerScroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

  .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
  .animate-shimmer { animation: shimmer 2s linear infinite; background-size: 200% 100%; }
  .animate-float { animation: float 3s ease-in-out infinite; }
  .animate-breathe { animation: breathe 4s ease-in-out infinite; }
  .animate-glow-pulse { animation: glowPulse 2s ease-in-out infinite; }
  .animate-ticker { animation: tickerScroll 30s linear infinite; }
  .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
  .animate-slide-up { animation: slideUp 0.4s ease-out forwards; }
  .animate-scale-in { animation: scaleIn 0.2s ease-out forwards; }

  .delay-100 { animation-delay: 100ms; }
  .delay-200 { animation-delay: 200ms; }
  .delay-300 { animation-delay: 300ms; }
  .delay-400 { animation-delay: 400ms; }
  .delay-500 { animation-delay: 500ms; }

  .transition-all { transition: all 0.3s ease; }
  .transition-colors { transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease; }
  .transition-transform { transition: transform 0.3s ease; }

  .hover-lift:hover { transform: translateY(-4px); box-shadow: ${colors.shadows.floatHover}; }
  .hover-glow:hover { box-shadow: ${colors.shadows.glowMd}; }
  .hover-scale:hover { transform: scale(1.02); }

  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  .no-scrollbar::-webkit-scrollbar { display: none; }

  .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
  .safe-top { padding-top: env(safe-area-inset-top); }

  @media (max-width: 768px) {
    html { font-size: 14px; }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

// Static global styles (non-theme dependent)
export const globalStyles = createGlobalStyles(theme.colors);

// Theme Context for the theme object
const ThemeContext = createContext(theme);
export const useTheme = () => useContext(ThemeContext);

// Theme Provider that injects dynamic styles
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeContext.Provider value={theme}>
      <DynamicStyles />
      {children}
    </ThemeContext.Provider>
  );
};

// Component to inject dynamic styles based on current theme
const DynamicStyles: React.FC = () => {
  const { colors } = useThemeMode();
  const styles = createGlobalStyles(colors);

  return <style dangerouslySetInnerHTML={{ __html: styles }} />;
};
