import React from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { MobileHeader } from './MobileHeader';
import { TopHeader } from './TopHeader';
import { Footer } from './Footer';
import { useThemeMode } from '../theme/ThemeContext';
import { usePresentationMode } from './PresentationMode';
import { GlowingSnowBackground } from './GlowingSnowBackground';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  activeNav?: string;
  title?: string;
  showBackButton?: boolean;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  activeNav,
  title,
  showBackButton = false,
}) => {
  const { isMobile } = usePresentationMode();
  const { colors, isDark } = useThemeMode();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: colors.background.primary,
        position: 'relative',
        zIndex: 5,
      }}
    >
      {/* Subtle ambient glow - only in dark mode */}
      {isDark && (
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '20%',
            width: '30%',
            height: '30%',
            background: 'radial-gradient(ellipse, rgba(0, 255, 136, 0.03) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
            filter: 'blur(60px)',
          }}
        />
      )}

      {/* Glowing Snow Background - Light Mode Only */}
      <GlowingSnowBackground
        show={!isDark}
        backgroundImage="/main-bg.jpg"
        intensity="high"
      />

      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar activeItem={activeNav} />
      )}

      {/* Main wrapper */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'visible' }}>
        {/* Mobile Header */}
        {isMobile && (
          <MobileHeader title={title} showBackButton={showBackButton} />
        )}

        {/* Desktop Top Header */}
        {!isMobile && (
          <div style={{ position: 'relative', zIndex: 1000 }}>
            <TopHeader />
          </div>
        )}

        {/* Main Content */}
        <main
          style={{
            flex: '1 0 auto',
            paddingTop: isMobile ? '16px' : '24px',
            paddingBottom: isMobile ? '80px' : '40px',
            paddingLeft: isMobile ? '12px' : '32px',
            paddingRight: isMobile ? '12px' : '32px',
            position: 'relative',
            zIndex: 1,
            overflow: 'visible',
          }}
        >
          {/* Content Container with border - Pure white for light mode */}
          <div
            style={{
              maxWidth: '1400px',
              margin: '0 auto',
              padding: isMobile ? '16px' : '28px',
              background: isDark
                ? 'rgba(10, 20, 15, 0.4)'
                : '#ffffff',
              border: isDark
                ? `1px solid ${colors.glass.border}`
                : '1px solid #000000',
              borderRadius: isMobile ? '16px' : '24px',
              backdropFilter: isDark ? 'blur(20px)' : 'none',
              WebkitBackdropFilter: isDark ? 'blur(20px)' : 'none',
              boxShadow: 'none',
            }}
          >
            {children}
          </div>
        </main>

        {/* Footer - Desktop only */}
        {!isMobile && (
          <div style={{ flexShrink: 0, marginTop: 'auto' }}>
            <Footer />
          </div>
        )}

        {/* Mobile Bottom Navigation */}
        {isMobile && <MobileNav />}
      </div>
    </div>
  );
};

export default ResponsiveLayout;
