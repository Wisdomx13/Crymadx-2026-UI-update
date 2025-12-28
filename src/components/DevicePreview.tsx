import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

type DeviceType = 'desktop' | 'tablet' | 'mobile';
type Orientation = 'portrait' | 'landscape';

interface DeviceConfig {
  id: DeviceType;
  name: string;
  icon: React.ReactNode;
  width: number;
  height: number;
  scale: number;
  bezelRadius: number;
  notch?: boolean;
  dynamicIsland?: boolean;
}

const devices: Record<DeviceType, DeviceConfig> = {
  desktop: {
    id: 'desktop',
    name: 'Desktop',
    icon: <Monitor size={20} />,
    width: 1440,
    height: 900,
    scale: 0.55,
    bezelRadius: 12,
  },
  tablet: {
    id: 'tablet',
    name: 'iPad Pro',
    icon: <Tablet size={20} />,
    width: 1024,
    height: 1366,
    scale: 0.48,
    bezelRadius: 40,
  },
  mobile: {
    id: 'mobile',
    name: 'iPhone 15 Pro',
    icon: <Smartphone size={20} />,
    width: 393,
    height: 852,
    scale: 0.7,
    bezelRadius: 50,
    dynamicIsland: true,
  },
};

interface DevicePreviewProps {
  children?: React.ReactNode;
  previewUrl?: string;
}

export const DevicePreview: React.FC<DevicePreviewProps> = ({
  previewUrl = '/',
}) => {
  const [activeDevice, setActiveDevice] = useState<DeviceType>('desktop');
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [zoom, setZoom] = useState(1);
  const [_isDarkMode, _setIsDarkMode] = useState(true);
  const [currentPath, setCurrentPath] = useState(previewUrl);
  const [_isFullscreen, _setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  // Build full URL for iframe
  const baseUrl = window.location.origin;
  const currentUrl = `${baseUrl}${currentPath}`;

  // Force iframe refresh when path changes
  const handlePageChange = (path: string) => {
    setCurrentPath(path);
    setIframeKey(prev => prev + 1);
  };

  const device = devices[activeDevice];

  // Calculate dimensions based on orientation
  const isLandscape = orientation === 'landscape' && activeDevice !== 'desktop';
  const frameWidth = isLandscape ? device.height : device.width;
  const frameHeight = isLandscape ? device.width : device.height;

  // Adjust scale based on zoom
  const effectiveScale = device.scale * zoom;

  const pages = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/profile', label: 'Profile' },
    { path: '/rewards', label: 'Rewards' },
    { path: '/referral', label: 'Referral' },
    { path: '/p2p', label: 'P2P Trading' },
    { path: '/tickets', label: 'Tickets' },
    { path: '/trade', label: 'Trading' },
    { path: '/wallet', label: 'Wallet' },
    { path: '/markets', label: 'Markets' },
    { path: '/', label: 'Home' },
    { path: '/login', label: 'Login' },
    { path: '/register', label: 'Register' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0f',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Toolbar */}
      <motion.div
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        style={{
          height: '60px',
          background: 'linear-gradient(180deg, rgba(20, 20, 30, 0.98) 0%, rgba(15, 15, 22, 0.95) 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Left - Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #00ffaa 0%, #00ffd9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '18px',
              color: '#0a0a0f',
            }}
          >
            C
          </div>
          <div>
            <h1
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#fff',
                margin: 0,
              }}
            >
              CrymadX UI Preview
            </h1>
            <p
              style={{
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.5)',
                margin: 0,
              }}
            >
              Responsive Design Presentation
            </p>
          </div>
        </div>

        {/* Center - Device Switcher */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
          }}
        >
          {Object.values(devices).map((d) => (
            <motion.button
              key={d.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveDevice(d.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: activeDevice === d.id
                  ? 'linear-gradient(135deg, #00ffaa 0%, #00ffd9 100%)'
                  : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: activeDevice === d.id ? '#0a0a0f' : 'rgba(255, 255, 255, 0.6)',
                fontSize: '13px',
                fontWeight: activeDevice === d.id ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {d.icon}
              {d.name}
            </motion.button>
          ))}
        </div>

        {/* Right - Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Orientation Toggle (for mobile/tablet) */}
          {activeDevice !== 'desktop' && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setOrientation(o => o === 'portrait' ? 'landscape' : 'portrait')}
              style={{
                padding: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                display: 'flex',
              }}
              title="Toggle Orientation"
            >
              <RotateCcw size={18} />
            </motion.button>
          )}

          {/* Zoom Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '10px',
            }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
              style={{
                padding: '6px',
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                display: 'flex',
              }}
            >
              <ZoomOut size={16} />
            </motion.button>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.8)',
                minWidth: '45px',
                textAlign: 'center',
              }}
            >
              {Math.round(zoom * 100)}%
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}
              style={{
                padding: '6px',
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                display: 'flex',
              }}
            >
              <ZoomIn size={16} />
            </motion.button>
          </div>

          {/* Open in New Tab */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.open(currentUrl, '_blank')}
            style={{
              padding: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              color: 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              display: 'flex',
            }}
            title="Open in New Tab"
          >
            <ExternalLink size={18} />
          </motion.button>
        </div>
      </motion.div>

      {/* Main Preview Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Page Selector Sidebar */}
        <motion.div
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          style={{
            width: '240px',
            background: 'rgba(15, 15, 22, 0.9)',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '20px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.4)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              padding: '0 12px',
              marginBottom: '8px',
            }}
          >
            Pages
          </div>
          {pages.map((page) => (
            <motion.button
              key={page.path}
              whileHover={{ x: 4, background: 'rgba(0, 255, 170, 0.08)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePageChange(page.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                background: currentPath === page.path
                  ? 'rgba(0, 255, 170, 0.12)'
                  : 'transparent',
                border: currentPath === page.path
                  ? '1px solid rgba(0, 255, 170, 0.3)'
                  : '1px solid transparent',
                borderRadius: '10px',
                color: currentPath === page.path
                  ? '#00ffaa'
                  : 'rgba(255, 255, 255, 0.6)',
                fontSize: '13px',
                fontWeight: currentPath === page.path ? 600 : 500,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {page.label}
            </motion.button>
          ))}

          {/* Device Info */}
          <div
            style={{
              marginTop: 'auto',
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.4)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '12px',
              }}
            >
              Device Info
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                  Device
                </span>
                <span style={{ fontSize: '12px', color: '#00ffaa', fontWeight: 600 }}>
                  {device.name}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                  Resolution
                </span>
                <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', fontFamily: "'JetBrains Mono', monospace" }}>
                  {frameWidth} x {frameHeight}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                  Orientation
                </span>
                <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', textTransform: 'capitalize' }}>
                  {activeDevice === 'desktop' ? 'Landscape' : orientation}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Preview Canvas */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            background: 'radial-gradient(circle at 50% 50%, rgba(0, 255, 170, 0.03) 0%, transparent 60%)',
            overflow: 'auto',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeDevice}-${orientation}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                transform: `scale(${effectiveScale})`,
                transformOrigin: 'center center',
              }}
            >
              {/* Device Frame */}
              <div
                style={{
                  position: 'relative',
                  padding: activeDevice === 'mobile' ? '14px' : activeDevice === 'tablet' ? '20px' : '24px 24px 40px 24px',
                  background: activeDevice === 'desktop'
                    ? 'linear-gradient(180deg, #2a2a35 0%, #1a1a22 100%)'
                    : 'linear-gradient(180deg, #1a1a22 0%, #0f0f15 100%)',
                  borderRadius: `${device.bezelRadius}px`,
                  boxShadow: `
                    0 50px 100px rgba(0, 0, 0, 0.5),
                    0 0 0 1px rgba(255, 255, 255, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1),
                    0 0 60px rgba(0, 255, 170, 0.1)
                  `,
                }}
              >
                {/* Dynamic Island (iPhone) */}
                {device.dynamicIsland && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '20px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '126px',
                      height: '37px',
                      background: '#000',
                      borderRadius: '20px',
                      zIndex: 10,
                    }}
                  />
                )}

                {/* Desktop Stand */}
                {activeDevice === 'desktop' && (
                  <>
                    {/* Webcam */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '8px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '8px',
                        height: '8px',
                        background: '#333',
                        borderRadius: '50%',
                        border: '1px solid #444',
                      }}
                    />
                    {/* Stand */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-60px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '120px',
                        height: '60px',
                        background: 'linear-gradient(180deg, #2a2a35 0%, #1a1a22 100%)',
                        borderRadius: '0 0 8px 8px',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-80px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '200px',
                        height: '20px',
                        background: 'linear-gradient(180deg, #2a2a35 0%, #1a1a22 100%)',
                        borderRadius: '10px',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                      }}
                    />
                  </>
                )}

                {/* Home Indicator (iPhone) */}
                {activeDevice === 'mobile' && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '134px',
                      height: '5px',
                      background: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: '3px',
                      zIndex: 10,
                    }}
                  />
                )}

                {/* Screen */}
                <div
                  style={{
                    width: `${frameWidth}px`,
                    height: `${frameHeight}px`,
                    borderRadius: activeDevice === 'mobile'
                      ? '44px'
                      : activeDevice === 'tablet'
                        ? '20px'
                        : '8px',
                    overflow: 'hidden',
                    background: '#000',
                    position: 'relative',
                  }}
                >
                  {/* Browser Chrome (Desktop only) */}
                  {activeDevice === 'desktop' && (
                    <div
                      style={{
                        height: '40px',
                        background: 'linear-gradient(180deg, #252530 0%, #1e1e28 100%)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 16px',
                        gap: '12px',
                      }}
                    >
                      {/* Traffic Lights */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f57' }} />
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#febc2e' }} />
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#28c840' }} />
                      </div>

                      {/* Navigation */}
                      <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                        <ChevronLeft size={16} color="rgba(255,255,255,0.4)" />
                        <ChevronRight size={16} color="rgba(255,255,255,0.4)" />
                        <RefreshCw size={14} color="rgba(255,255,255,0.4)" />
                      </div>

                      {/* URL Bar */}
                      <div
                        style={{
                          flex: 1,
                          marginLeft: '16px',
                          padding: '6px 16px',
                          background: 'rgba(0, 0, 0, 0.3)',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <div
                          style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #00ffaa 0%, #00ffd9 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '8px',
                            fontWeight: 800,
                            color: '#0a0a0f',
                          }}
                        >
                          C
                        </div>
                        <span
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                        >
                          crymadx.io{currentPath}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Status Bar (Mobile) */}
                  {activeDevice === 'mobile' && (
                    <div
                      style={{
                        height: '54px',
                        background: 'transparent',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        padding: '0 28px 8px',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 5,
                      }}
                    >
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
                        9:41
                      </span>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <div style={{ fontSize: '12px', color: '#fff' }}>5G</div>
                        <div style={{ width: '24px', height: '11px', border: '1px solid #fff', borderRadius: '3px', position: 'relative' }}>
                          <div style={{ position: 'absolute', top: '2px', left: '2px', right: '4px', bottom: '2px', background: '#fff', borderRadius: '1px' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Iframe Content */}
                  <iframe
                    key={iframeKey}
                    src={currentUrl}
                    style={{
                      width: '100%',
                      height: activeDevice === 'desktop' ? 'calc(100% - 40px)' : '100%',
                      border: 'none',
                      background: '#020a06',
                    }}
                    title="Preview"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DevicePreview;
