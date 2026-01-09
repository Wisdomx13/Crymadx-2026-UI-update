import React from 'react';
import { useThemeMode } from '../theme/ThemeContext';

// ============================================
// SIMPLIFIED BACKGROUND COMPONENT
// Pure black for dark mode, clean for performance
// ============================================

export const UnderwaterBackground: React.FC = () => {
  const { isDark } = useThemeMode();

  // Light mode - Return null for clean background
  if (!isDark) {
    return null;
  }

  // Dark mode - Simple pure black background
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        background: '#000000',
      }}
    >
      {/* Subtle ambient gradient for depth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 60% 40% at 20% 20%, rgba(0, 210, 106, 0.03) 0%, transparent 50%),
            radial-gradient(ellipse 50% 35% at 80% 80%, rgba(0, 210, 106, 0.02) 0%, transparent 50%)
          `,
        }}
      />
    </div>
  );
};

export default UnderwaterBackground;
