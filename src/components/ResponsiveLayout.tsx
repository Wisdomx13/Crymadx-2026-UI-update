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
        minHeight: '100%',
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
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
            flex: 1,
            paddingTop: isMobile ? '16px' : '24px',
            paddingBottom: isMobile ? '80px' : '24px',
            paddingLeft: isMobile ? '12px' : '32px',
            paddingRight: isMobile ? '12px' : '32px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Content Container with border - TRANSPARENT GLASS */}
          <div
            style={{
              maxWidth: '1400px',
              margin: '0 auto',
              padding: isMobile ? '16px' : '28px',
              background: isDark
                ? 'rgba(10, 20, 15, 0.4)'
                : 'linear-gradient(145deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.12) 50%, rgba(240,250,255,0.15) 100%)',
              border: isDark
                ? `1px solid ${colors.glass.border}`
                : '2px solid rgba(255,255,255,0.4)',
              borderRadius: isMobile ? '16px' : '24px',
              minHeight: isMobile ? 'auto' : 'calc(100vh - 180px)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: isDark
                ? 'none'
                : '0 8px 40px rgba(0,50,100,0.2), inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,50,100,0.1)',
            }}
          >
            {children}
          </div>
        </main>

        {/* Footer - Desktop only */}
        {!isMobile && <Footer />}

        {/* Mobile Bottom Navigation */}
        {isMobile && <MobileNav />}
      </div>
    </div>
  );
};

export default ResponsiveLayout;
