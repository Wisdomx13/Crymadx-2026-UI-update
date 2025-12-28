// CrymadX Premium Theme System - Dark & Light Mode
// Ultra-premium crypto exchange aesthetic with LIQUID GLASSMORPHISM
// Inspired by Binance but MORE glassy, sleek, and liquid

// ============================================
// DARK MODE - Ultra Liquid Glass Premium
// ============================================
export const darkColors = {
  mode: 'dark' as const,

  // Primary - Neon Emerald spectrum (Binance-inspired green)
  primary: {
    50: '#e8fff0',
    100: '#b8ffd6',
    200: '#88ffbc',
    300: '#58ffa2',
    400: '#02c076', // Binance green - more professional
    500: '#00a867',
    600: '#008f58',
    700: '#007649',
    800: '#005d3a',
    900: '#00442b',
  },

  // Secondary - Cyan/Teal accents
  secondary: {
    50: '#e0fffc',
    100: '#b3fff7',
    200: '#80fff2',
    300: '#4dffed',
    400: '#00d4aa',
    500: '#00bfa5',
    600: '#00a896',
    700: '#009187',
    800: '#007a78',
    900: '#006369',
  },

  // Gold/Yellow accents for premium highlights (Binance style)
  gold: {
    400: '#f0b90b', // Binance yellow
    500: '#d4a309',
    600: '#b88d07',
  },

  // Backgrounds - Deep obsidian with subtle warmth
  background: {
    primary: '#0c0d0f',      // Deepest black
    secondary: '#12141a',     // Elevated surfaces
    tertiary: '#181a20',      // Cards base
    elevated: '#1e2026',      // Hover states
    hover: '#262930',         // Active hover
    card: '#181a20',          // Card background
    input: '#0e1013',         // Input fields
    spotlight: '#1a1c22',     // Spotlight areas
  },

  // Glass effects - ULTRA LIQUID GLASS
  glass: {
    // Base glass layers
    light: 'rgba(255, 255, 255, 0.02)',
    medium: 'rgba(255, 255, 255, 0.04)',
    heavy: 'rgba(255, 255, 255, 0.07)',
    // Borders - subtle but visible
    border: 'rgba(255, 255, 255, 0.08)',
    borderHover: 'rgba(255, 255, 255, 0.15)',
    borderActive: 'rgba(2, 192, 118, 0.5)',
    borderGlow: 'rgba(2, 192, 118, 0.3)',
    // Reflections
    reflection: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 40%)',
    reflectionStrong: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 30%)',
    reflectionLeft: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, transparent 30%)',
    // Frosted glass
    frosted: 'rgba(12, 13, 15, 0.92)',
    frostedLight: 'rgba(12, 13, 15, 0.85)',
    frostedMedium: 'rgba(18, 20, 26, 0.9)',
    // Glow effects
    glow: 'rgba(2, 192, 118, 0.4)',
    glowSoft: 'rgba(2, 192, 118, 0.15)',
    glowIntense: 'rgba(2, 192, 118, 0.6)',
    // Liquid glass surfaces
    surface: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 50%, transparent 100%)',
    surfaceHover: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 50%, transparent 100%)',
    // Premium liquid effects
    liquid: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(2,192,118,0.02) 50%, rgba(255,255,255,0.02) 100%)',
    liquidHover: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(2,192,118,0.04) 50%, rgba(255,255,255,0.03) 100%)',
    liquidActive: 'linear-gradient(135deg, rgba(2,192,118,0.15) 0%, rgba(2,192,118,0.05) 50%, rgba(255,255,255,0.03) 100%)',
    // Water drop highlight
    waterDrop: 'radial-gradient(ellipse 80% 50% at 20% 20%, rgba(255,255,255,0.08) 0%, transparent 50%)',
    waterDropSmall: 'radial-gradient(ellipse 60% 40% at 15% 15%, rgba(255,255,255,0.06) 0%, transparent 40%)',
    // Shimmer effect
    shimmer: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
    shimmerVertical: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.03), transparent)',
  },

  // Text Colors - Clean and readable
  text: {
    primary: '#eaecef',             // Slightly off-white for less strain
    secondary: 'rgba(234, 236, 239, 0.75)',
    tertiary: 'rgba(234, 236, 239, 0.5)',
    muted: 'rgba(234, 236, 239, 0.3)',
    glow: '#02c076',
    inverse: '#0c0d0f',
    accent: '#f0b90b',              // Gold accent text
    dark: '#0c0d0f',
    black: '#000000',
    // For consistency with light mode - same as primary in dark mode
    onCard: '#eaecef',
    onCardSecondary: 'rgba(234, 236, 239, 0.75)',
    onCardTertiary: 'rgba(234, 236, 239, 0.5)',
  },

  // Trading colors - Binance style
  trading: {
    buy: '#02c076',                 // Binance green
    buyBg: 'rgba(2, 192, 118, 0.12)',
    buyBgHover: 'rgba(2, 192, 118, 0.2)',
    buyGlow: '0 0 30px rgba(2, 192, 118, 0.4)',
    buyGradient: 'linear-gradient(135deg, #02c076 0%, #00a867 100%)',
    sell: '#f6465d',                // Binance red
    sellBg: 'rgba(246, 70, 93, 0.12)',
    sellBgHover: 'rgba(246, 70, 93, 0.2)',
    sellGlow: '0 0 30px rgba(246, 70, 93, 0.4)',
    sellGradient: 'linear-gradient(135deg, #f6465d 0%, #e53950 100%)',
  },

  // Status colors
  status: {
    success: '#02c076',
    successBg: 'rgba(2, 192, 118, 0.12)',
    warning: '#f0b90b',
    warningBg: 'rgba(240, 185, 11, 0.12)',
    error: '#f6465d',
    errorBg: 'rgba(246, 70, 93, 0.12)',
    info: '#00d4aa',
    infoBg: 'rgba(0, 212, 170, 0.12)',
  },

  // Premium gradients - ULTRA LIQUID GLASS
  gradients: {
    // Primary gradients
    primary: 'linear-gradient(135deg, #02c076 0%, #00d4aa 100%)',
    primaryDark: 'linear-gradient(135deg, #00a867 0%, #00bfa5 100%)',
    primarySolid: 'linear-gradient(135deg, #02c076 0%, #00a867 100%)',
    // Liquid glass gradients - THE KEY TO PREMIUM LOOK
    liquidGlass: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, transparent 100%)',
    liquidGlassHover: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
    liquidGlassPremium: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(2,192,118,0.03) 50%, transparent 100%)',
    // Card gradients
    card: 'linear-gradient(145deg, rgba(24,26,32,0.98) 0%, rgba(18,20,26,0.95) 100%)',
    cardPremium: 'linear-gradient(145deg, rgba(30,32,38,0.98) 0%, rgba(24,26,32,0.95) 100%)',
    cardHover: 'linear-gradient(145deg, rgba(38,41,48,0.98) 0%, rgba(30,32,38,0.95) 100%)',
    cardDark: 'linear-gradient(145deg, #181a20 0%, #12141a 100%)',
    cardGlass: 'linear-gradient(145deg, rgba(24,26,32,0.9) 0%, rgba(18,20,26,0.85) 100%)',
    // Glass surface with highlight
    glassSurface: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
    glassSurfaceHover: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
    glassTeal: 'linear-gradient(135deg, #00d4aa 0%, #02c076 100%)',
    // Ambient mesh backgrounds
    mesh: `radial-gradient(ellipse 60% 40% at 20% 20%, rgba(2, 192, 118, 0.04) 0%, transparent 50%),
           radial-gradient(ellipse 50% 35% at 80% 15%, rgba(0, 212, 170, 0.03) 0%, transparent 50%)`,
    meshIntense: `radial-gradient(ellipse 60% 40% at 20% 20%, rgba(2, 192, 118, 0.08) 0%, transparent 50%),
                  radial-gradient(ellipse 50% 35% at 80% 15%, rgba(0, 212, 170, 0.06) 0%, transparent 50%)`,
    hero: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(2, 192, 118, 0.06) 0%, transparent 60%)',
    heroIntense: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(2, 192, 118, 0.12) 0%, transparent 60%)',
    wave: `radial-gradient(ellipse 100% 60% at 50% 100%, rgba(240, 185, 11, 0.04) 0%, transparent 50%),
           radial-gradient(ellipse 80% 40% at 30% 80%, rgba(2, 192, 118, 0.03) 0%, transparent 40%)`,
    // Glow gradients
    glow: 'radial-gradient(circle, rgba(2, 192, 118, 0.5) 0%, transparent 70%)',
    glowSoft: 'radial-gradient(circle, rgba(2, 192, 118, 0.2) 0%, transparent 70%)',
    glowCyan: 'radial-gradient(circle, rgba(0, 212, 170, 0.4) 0%, transparent 70%)',
    glowGold: 'radial-gradient(circle, rgba(240, 185, 11, 0.3) 0%, transparent 70%)',
    // Button gradients
    buttonGlass: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
    buttonGlassHover: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)',
    buttonPrimary: 'linear-gradient(135deg, #02c076 0%, #00a867 100%)',
    buttonSecondary: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, transparent 100%)',
    // Text effects
    textGlow: 'linear-gradient(135deg, #eaecef 0%, #02c076 50%, #00d4aa 100%)',
    // Line gradients
    neonLine: 'linear-gradient(90deg, transparent, #02c076, transparent)',
    neonLineVertical: 'linear-gradient(180deg, transparent, #02c076, transparent)',
    neonLineGold: 'linear-gradient(90deg, transparent, #f0b90b, transparent)',
    // Accent gradients
    orangeAccent: 'linear-gradient(135deg, #f0b90b 0%, #d4a309 100%)',
    goldAccent: 'linear-gradient(135deg, #f0b90b 0%, #b88d07 100%)',
    // Ambient lighting
    ambient: 'radial-gradient(ellipse at 20% 0%, rgba(2, 192, 118, 0.1) 0%, transparent 50%)',
    ambientSecondary: 'radial-gradient(ellipse at 80% 100%, rgba(0, 212, 170, 0.06) 0%, transparent 50%)',
    ambientGold: 'radial-gradient(ellipse at 50% 50%, rgba(240, 185, 11, 0.05) 0%, transparent 50%)',
    // 3D liquid effects
    liquid3D: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 30%, transparent 60%, rgba(0,0,0,0.1) 100%)',
    liquid3DHover: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 30%, transparent 60%, rgba(0,0,0,0.15) 100%)',
    // Sphere/orb effect for 3D objects
    sphere: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 20%, transparent 50%, rgba(0,0,0,0.2) 100%)',
    sphereGreen: 'radial-gradient(circle at 30% 30%, rgba(2,192,118,0.3) 0%, rgba(2,192,118,0.1) 30%, transparent 60%)',
  },

  // Shadows - Premium liquid glass shadows
  shadows: {
    // Basic shadows
    sm: '0 2px 4px rgba(0, 0, 0, 0.3)',
    md: '0 4px 12px rgba(0, 0, 0, 0.4)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.5)',
    xl: '0 16px 48px rgba(0, 0, 0, 0.6)',
    // Glass shadows with depth
    glass: '0 4px 24px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0, 0, 0, 0.3)',
    glassHover: '0 8px 32px rgba(0, 0, 0, 0.5), 0 2px 6px rgba(0, 0, 0, 0.35)',
    glassIntense: '0 12px 40px rgba(0, 0, 0, 0.6), 0 4px 12px rgba(0, 0, 0, 0.4)',
    // Float shadows
    float: '0 12px 40px rgba(0, 0, 0, 0.5)',
    floatHover: '0 20px 60px rgba(0, 0, 0, 0.6)',
    // Glow shadows
    glow: '0 0 20px rgba(2, 192, 118, 0.2)',
    glowMd: '0 0 30px rgba(2, 192, 118, 0.3)',
    glowLg: '0 0 50px rgba(2, 192, 118, 0.4)',
    glowXl: '0 0 80px rgba(2, 192, 118, 0.5)',
    glowSoft: '0 0 40px rgba(2, 192, 118, 0.15)',
    glowCyan: '0 0 30px rgba(0, 212, 170, 0.25)',
    glowTeal: '0 0 30px rgba(0, 212, 170, 0.25)',
    glowGold: '0 0 30px rgba(240, 185, 11, 0.2)',
    // Card shadows with subtle glow
    card: '0 4px 24px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
    cardHover: '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 0 0 1px rgba(255,255,255,0.05)',
    cardFloat: '0 24px 64px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
    cardGlow: '0 4px 24px rgba(0, 0, 0, 0.5), 0 0 30px rgba(2, 192, 118, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
    // Inner shadows
    inner: 'inset 0 2px 12px rgba(0, 0, 0, 0.3)',
    innerStrong: 'inset 0 4px 20px rgba(0, 0, 0, 0.5)',
    innerGlass: 'inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.2)',
    // Button shadows
    button: '0 4px 20px rgba(2, 192, 118, 0.3)',
    buttonHover: '0 6px 30px rgba(2, 192, 118, 0.45)',
    buttonPressed: '0 2px 10px rgba(2, 192, 118, 0.2)',
    // Neon/text effects
    neonText: '0 0 10px rgba(2, 192, 118, 0.8), 0 0 20px rgba(2, 192, 118, 0.4)',
    neonTextSoft: '0 0 8px rgba(2, 192, 118, 0.5)',
    // Ambient
    ambient: '0 0 120px rgba(2, 192, 118, 0.1)',
    ambientGold: '0 0 80px rgba(240, 185, 11, 0.08)',
    // 3D depth shadows
    depth3D: '0 20px 40px rgba(0, 0, 0, 0.5), 0 8px 16px rgba(0, 0, 0, 0.3)',
    depth3DHover: '0 30px 60px rgba(0, 0, 0, 0.6), 0 12px 24px rgba(0, 0, 0, 0.4)',
  },

  // Crypto brand colors
  crypto: {
    btc: '#F7931A',
    eth: '#627EEA',
    bnb: '#F0B90B',
    sol: '#9945FF',
    xrp: '#00AAE4',
    ada: '#0033AD',
    usdt: '#26A17B',
    doge: '#C2A633',
  },
};

// ============================================
// LIGHT MODE - Premium 3D Glassmorphism Design
// Inspired by modern SaaS designs with decorative backgrounds
// 50% of dark mode's premium aesthetic
// ============================================
export const lightColors = {
  mode: 'light' as const,

  // Primary - Rich Emerald Green with depth
  primary: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#10b981', // Main vibrant green
    500: '#059669',
    600: '#047857',
    700: '#065f46',
    800: '#064e3b',
    900: '#022c22',
  },

  // Secondary - Teal/Cyan for accents
  secondary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#14b8a6', // Teal accent
    500: '#0d9488',
    600: '#0f766e',
    700: '#115e59',
    800: '#134e4a',
    900: '#042f2e',
  },

  // Gold accents for premium highlights
  gold: {
    400: '#f59e0b',
    500: '#d97706',
    600: '#b45309',
  },

  // Backgrounds - Transparent for glassmorphism
  background: {
    primary: 'transparent',        // Transparent to show background image
    secondary: 'rgba(255, 255, 255, 0.1)',  // Very transparent
    tertiary: 'rgba(255, 255, 255, 0.15)', // Subtle
    elevated: 'rgba(255, 255, 255, 0.2)',  // Slightly more visible
    hover: 'rgba(255, 255, 255, 0.25)',    // Hover state
    card: 'rgba(255, 255, 255, 0.15)',     // Transparent glass cards
    input: 'rgba(255, 255, 255, 0.2)',     // Input fields
    spotlight: 'rgba(255, 255, 255, 0.1)', // Soft spotlight
  },

  // Glass effects - Premium 3D Glassmorphism with transparency
  glass: {
    // Base glass layers - MORE TRANSPARENT
    light: 'rgba(255, 255, 255, 0.08)',
    medium: 'rgba(255, 255, 255, 0.15)',
    heavy: 'rgba(255, 255, 255, 0.25)',
    // Borders - visible for definition
    border: 'rgba(255, 255, 255, 0.3)',
    borderHover: 'rgba(255, 255, 255, 0.5)',
    borderActive: 'rgba(16, 185, 129, 0.6)',
    borderGlow: 'rgba(16, 185, 129, 0.4)',
    // Premium reflections
    reflection: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
    reflectionStrong: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 30%, transparent 60%)',
    reflectionLeft: 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, transparent 40%)',
    // Frosted glass - transparent
    frosted: 'rgba(255, 255, 255, 0.15)',
    frostedLight: 'rgba(255, 255, 255, 0.1)',
    frostedMedium: 'rgba(255, 255, 255, 0.2)',
    // Glow effects - soft green glows
    glow: 'rgba(16, 185, 129, 0.3)',
    glowSoft: 'rgba(16, 185, 129, 0.15)',
    glowIntense: 'rgba(16, 185, 129, 0.45)',
    // Liquid glass surfaces - transparent
    surface: 'linear-gradient(145deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
    surfaceHover: 'linear-gradient(145deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.15) 100%)',
    liquid: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.15) 100%)',
    liquidHover: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.2) 100%)',
    liquidActive: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(255,255,255,0.2) 50%, rgba(16,185,129,0.1) 100%)',
    // Water drop highlight for 3D effect
    waterDrop: 'radial-gradient(ellipse 80% 50% at 20% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)',
    waterDropSmall: 'radial-gradient(ellipse 60% 40% at 15% 15%, rgba(255,255,255,0.25) 0%, transparent 40%)',
    // Shimmer effects
    shimmer: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
    shimmerVertical: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.2), transparent)',
  },

  // Text Colors - DARK with text shadows for readability
  text: {
    primary: '#1a1a2e',           // Very dark blue-black - maximum readability
    secondary: '#2d2d44',         // Dark secondary
    tertiary: '#3d3d5c',          // Dark tertiary
    muted: '#4a4a6a',             // Muted but still readable
    glow: '#047857',              // Dark green for emphasis
    inverse: '#ffffff',           // White on dark
    accent: '#047857',            // Dark green accent
    dark: '#0a0a1a',              // Deepest dark
    black: '#000000',             // Pure black
    // Card text - Dark with shadow support
    onCard: '#1a1a2e',
    onCardSecondary: '#2d2d44',
    onCardTertiary: '#3d3d5c',
  },

  // Trading colors - Vibrant and clear
  trading: {
    buy: '#059669',
    buyBg: 'rgba(5, 150, 105, 0.08)',
    buyBgHover: 'rgba(5, 150, 105, 0.15)',
    buyGlow: '0 0 20px rgba(5, 150, 105, 0.25)',
    buyGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    sell: '#dc2626',
    sellBg: 'rgba(220, 38, 38, 0.08)',
    sellBgHover: 'rgba(220, 38, 38, 0.15)',
    sellGlow: '0 0 20px rgba(220, 38, 38, 0.25)',
    sellGradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  },

  // Status colors
  status: {
    success: '#059669',
    successBg: 'rgba(5, 150, 105, 0.1)',
    warning: '#d97706',
    warningBg: 'rgba(217, 119, 6, 0.1)',
    error: '#dc2626',
    errorBg: 'rgba(220, 38, 38, 0.1)',
    info: '#0ea5e9',
    infoBg: 'rgba(14, 165, 233, 0.1)',
  },

  // Premium Gradients - Transparent glassmorphism
  gradients: {
    // Primary gradients
    primary: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    primaryDark: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    primarySolid: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
    // Liquid glass gradients - TRANSPARENT 3D effect
    liquidGlass: 'linear-gradient(145deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.15) 100%)',
    liquidGlassHover: 'linear-gradient(145deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.2) 100%)',
    liquidGlassPremium: 'linear-gradient(145deg, rgba(255,255,255,0.25) 0%, rgba(16,185,129,0.08) 50%, rgba(255,255,255,0.2) 100%)',
    // Card gradients - TRANSPARENT glass
    card: 'linear-gradient(145deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
    cardPremium: 'linear-gradient(145deg, rgba(255,255,255,0.25) 0%, rgba(16,185,129,0.05) 50%, rgba(255,255,255,0.15) 100%)',
    cardHover: 'linear-gradient(145deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.15) 100%)',
    cardDark: 'linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)',
    cardGlass: 'linear-gradient(145deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
    glassSurface: 'linear-gradient(145deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
    glassSurfaceHover: 'linear-gradient(145deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.15) 100%)',
    glassTeal: 'linear-gradient(135deg, #14b8a6 0%, #10b981 100%)',
    // Decorative mesh backgrounds - Key for premium look
    mesh: `radial-gradient(ellipse 60% 40% at 10% 10%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
           radial-gradient(ellipse 50% 35% at 90% 20%, rgba(14, 165, 233, 0.06) 0%, transparent 50%),
           radial-gradient(ellipse 40% 30% at 50% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)`,
    meshIntense: `radial-gradient(ellipse 60% 40% at 10% 10%, rgba(16, 185, 129, 0.12) 0%, transparent 50%),
                  radial-gradient(ellipse 50% 35% at 90% 20%, rgba(14, 165, 233, 0.1) 0%, transparent 50%),
                  radial-gradient(ellipse 40% 30% at 50% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)`,
    // Hero section gradients
    hero: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(16, 185, 129, 0.1) 0%, transparent 60%)',
    heroIntense: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(16, 185, 129, 0.15) 0%, transparent 60%)',
    wave: `radial-gradient(ellipse 100% 60% at 50% 100%, rgba(14, 165, 233, 0.06) 0%, transparent 50%),
           radial-gradient(ellipse 80% 40% at 30% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 40%)`,
    // Glow gradients - soft and elegant
    glow: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
    glowSoft: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
    glowCyan: 'radial-gradient(circle, rgba(14, 165, 233, 0.12) 0%, transparent 70%)',
    glowGold: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)',
    // Button gradients - transparent glass
    buttonGlass: 'linear-gradient(145deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
    buttonGlassHover: 'linear-gradient(145deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.15) 100%)',
    buttonPrimary: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    buttonSecondary: 'linear-gradient(145deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
    // Text effects
    textGlow: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
    // Neon line gradients
    neonLine: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.6), transparent)',
    neonLineVertical: 'linear-gradient(180deg, transparent, rgba(16,185,129,0.6), transparent)',
    neonLineGold: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.5), transparent)',
    // Accent gradients
    orangeAccent: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    goldAccent: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    // Ambient lighting - decorative blobs
    ambient: 'radial-gradient(ellipse at 20% 0%, rgba(16, 185, 129, 0.08) 0%, transparent 50%)',
    ambientSecondary: 'radial-gradient(ellipse at 80% 100%, rgba(14, 165, 233, 0.06) 0%, transparent 50%)',
    ambientGold: 'radial-gradient(ellipse at 50% 50%, rgba(245, 158, 11, 0.05) 0%, transparent 50%)',
    // 3D liquid effects - transparent
    liquid3D: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.1) 60%, rgba(255,255,255,0.2) 100%)',
    liquid3DHover: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 30%, rgba(255,255,255,0.15) 60%, rgba(255,255,255,0.25) 100%)',
    // Sphere/orb effects for 3D objects - transparent
    sphere: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 20%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.1) 100%)',
    sphereGreen: 'radial-gradient(circle at 30% 30%, rgba(16,185,129,0.2) 0%, rgba(16,185,129,0.1) 30%, transparent 60%)',
    // Widget background decorations - transparent glass with colored accents
    widgetGreen: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(255,255,255,0.1) 50%, rgba(16,185,129,0.08) 100%)',
    widgetBlue: 'linear-gradient(135deg, rgba(14,165,233,0.15) 0%, rgba(255,255,255,0.1) 50%, rgba(14,165,233,0.08) 100%)',
    widgetPurple: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(255,255,255,0.1) 50%, rgba(139,92,246,0.08) 100%)',
    widgetGold: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(255,255,255,0.1) 50%, rgba(245,158,11,0.08) 100%)',
    widgetPink: 'linear-gradient(135deg, rgba(236,72,153,0.15) 0%, rgba(255,255,255,0.1) 50%, rgba(236,72,153,0.08) 100%)',
    widgetTeal: 'linear-gradient(135deg, rgba(20,184,166,0.15) 0%, rgba(255,255,255,0.1) 50%, rgba(20,184,166,0.08) 100%)',
  },

  // Premium Shadows - Rich depth with subtle color tints
  shadows: {
    // Basic shadows with depth
    sm: '0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02)',
    md: '0 4px 6px rgba(15, 23, 42, 0.05), 0 2px 4px rgba(15, 23, 42, 0.03)',
    lg: '0 10px 15px rgba(15, 23, 42, 0.06), 0 4px 6px rgba(15, 23, 42, 0.04)',
    xl: '0 20px 25px rgba(15, 23, 42, 0.08), 0 8px 10px rgba(15, 23, 42, 0.05)',
    // Glass shadows - multi-layered for depth
    glass: '0 4px 20px rgba(15, 23, 42, 0.05), 0 1px 3px rgba(15, 23, 42, 0.03), inset 0 1px 0 rgba(255,255,255,0.8)',
    glassHover: '0 8px 30px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255,255,255,0.9)',
    glassIntense: '0 12px 40px rgba(15, 23, 42, 0.1), 0 4px 12px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255,255,255,1)',
    // Float shadows - premium elevation
    float: '0 12px 35px rgba(15, 23, 42, 0.08), 0 4px 15px rgba(15, 23, 42, 0.05)',
    floatHover: '0 20px 50px rgba(15, 23, 42, 0.1), 0 8px 25px rgba(15, 23, 42, 0.06)',
    // Glow shadows - colored glows
    glow: '0 0 25px rgba(16, 185, 129, 0.12)',
    glowMd: '0 0 35px rgba(16, 185, 129, 0.15)',
    glowLg: '0 0 50px rgba(16, 185, 129, 0.18)',
    glowXl: '0 0 70px rgba(16, 185, 129, 0.2)',
    glowSoft: '0 0 30px rgba(16, 185, 129, 0.08)',
    glowCyan: '0 0 30px rgba(14, 165, 233, 0.12)',
    glowTeal: '0 0 30px rgba(20, 184, 166, 0.12)',
    glowGold: '0 0 30px rgba(245, 158, 11, 0.12)',
    // Card shadows - 3D depth effect
    card: '0 2px 8px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.02), inset 0 1px 0 rgba(255,255,255,0.9)',
    cardHover: '0 8px 25px rgba(15, 23, 42, 0.08), 0 3px 10px rgba(15, 23, 42, 0.04), 0 0 0 1px rgba(16,185,129,0.1), inset 0 1px 0 rgba(255,255,255,1)',
    cardFloat: '0 15px 40px rgba(15, 23, 42, 0.1), 0 5px 15px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255,255,255,1)',
    cardGlow: '0 4px 20px rgba(15, 23, 42, 0.05), 0 0 30px rgba(16, 185, 129, 0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
    // Inner shadows for depth
    inner: 'inset 0 2px 4px rgba(15, 23, 42, 0.03)',
    innerStrong: 'inset 0 3px 8px rgba(15, 23, 42, 0.06)',
    innerGlass: 'inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(15,23,42,0.03)',
    // Button shadows - vibrant green glow
    button: '0 4px 15px rgba(16, 185, 129, 0.25), 0 2px 6px rgba(16, 185, 129, 0.15)',
    buttonHover: '0 6px 25px rgba(16, 185, 129, 0.35), 0 3px 10px rgba(16, 185, 129, 0.2)',
    buttonPressed: '0 2px 8px rgba(16, 185, 129, 0.2)',
    // Neon text effects
    neonText: '0 0 12px rgba(16, 185, 129, 0.3)',
    neonTextSoft: '0 0 8px rgba(16, 185, 129, 0.2)',
    // Ambient glow
    ambient: '0 0 100px rgba(16, 185, 129, 0.06)',
    ambientGold: '0 0 80px rgba(245, 158, 11, 0.05)',
    // 3D depth shadows
    depth3D: '0 10px 30px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255,255,255,0.9)',
    depth3DHover: '0 15px 40px rgba(15, 23, 42, 0.1), 0 6px 16px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255,255,255,1)',
  },

  // Crypto brand colors
  crypto: {
    btc: '#F7931A',
    eth: '#627EEA',
    bnb: '#F0B90B',
    sol: '#9945FF',
    xrp: '#00AAE4',
    ada: '#0033AD',
    usdt: '#26A17B',
    doge: '#C2A633',
  },
};

// Default export is dark colors for backwards compatibility
export const colors = darkColors;

export type ThemeMode = 'dark' | 'light';
// Colors type that works with both dark and light modes
export type Colors = Omit<typeof darkColors, 'mode'> & { mode: ThemeMode };
