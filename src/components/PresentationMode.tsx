import React, { useState, createContext, useContext, useEffect } from 'react';

// Simple responsive context - auto-detects device based on actual window size
interface ResponsiveContextType {
  isMobile: boolean;
  isDesktop: boolean;
  windowWidth: number;
}

const ResponsiveContext = createContext<ResponsiveContextType>({
  isMobile: false,
  isDesktop: true,
  windowWidth: 1440,
});

export const usePresentationMode = () => useContext(ResponsiveContext);

// Also export as useResponsive for clarity
export const useResponsive = () => useContext(ResponsiveContext);

interface ResponsiveProviderProps {
  children: React.ReactNode;
  mobileBreakpoint?: number;
}

// The provider now simply detects actual screen size - no device frames
export const PresentationMode: React.FC<ResponsiveProviderProps> = ({
  children,
  mobileBreakpoint = 768
}) => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial width
    handleResize();

    // Listen for resize events
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < mobileBreakpoint;
  const isDesktop = !isMobile;

  return (
    <ResponsiveContext.Provider value={{ isMobile, isDesktop, windowWidth }}>
      {children}
    </ResponsiveContext.Provider>
  );
};

// Also export as ResponsiveProvider for clarity
export const ResponsiveProvider = PresentationMode;

export default PresentationMode;
