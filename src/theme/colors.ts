// CrymadX Premium Theme System - Dark & Light Mode
// Ultra-premium crypto exchange aesthetic with LIQUID GLASSMORPHISM
// Inspired by Binance but MORE glassy, sleek, and liquid

// ============================================
// DARK MODE - Pure Dark Green & Shiny Black
// ============================================
export const darkColors = {
  mode: 'dark' as const,

  // Primary - Pure Authentic Dark Green (no teal/cyan tint)
  primary: {
    50: '#e6ffe6',
    100: '#b3ffb3',
    200: '#80ff80',
    300: '#4dff4d',
    400: '#00D26A', // Pure authentic dark green
    500: '#00B35A',
    600: '#00994D',
    700: '#008040',
    800: '#006633',
    900: '#004D26',
  },

  // Secondary - Pure Green variants (no cyan)
  secondary: {
    50: '#e6ffe6',
    100: '#b3ffb3',
    200: '#80ff80',
    300: '#4dff4d',
    400: '#00D26A',
    500: '#00B35A',
    600: '#00994D',
    700: '#008040',
    800: '#006633',
    900: '#004D26',
  },

  // Gold/Yellow accents for premium highlights (Binance style)
  gold: {
    400: '#f0b90b', // Binance yellow
    500: '#d4a309',
    600: '#b88d07',
  },

  // Backgrounds - Pure Shiny Black
  background: {
    primary: '#000000',      // Pure black
    secondary: '#0a0a0a',     // Slightly elevated
    tertiary: '#0f0f0f',      // Cards base
    elevated: '#141414',      // Hover states
    hover: '#1a1a1a',         // Active hover
    card: '#0a0a0a',          // Card background
    input: '#050505',         // Input fields
    spotlight: '#0f0f0f',     // Spotlight areas
  },

  // Glass effects - Pure black glass
  glass: {
    // Base glass layers
    light: 'rgba(255, 255, 255, 0.03)',
    medium: 'rgba(255, 255, 255, 0.05)',
    heavy: 'rgba(255, 255, 255, 0.08)',
    // Borders - subtle but visible
    border: 'rgba(255, 255, 255, 0.1)',
    borderHover: 'rgba(255, 255, 255, 0.18)',
    borderActive: 'rgba(0, 210, 106, 0.6)',
    borderGlow: 'rgba(0, 210, 106, 0.4)',
    // Reflections
    reflection: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 40%)',
    reflectionStrong: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 30%)',
    reflectionLeft: 'linear-gradient(90deg, rgba(255,255,255,0.06) 0%, transparent 30%)',
    // Frosted glass - pure black
    frosted: 'rgba(0, 0, 0, 0.95)',
    frostedLight: 'rgba(0, 0, 0, 0.9)',
    frostedMedium: 'rgba(10, 10, 10, 0.95)',
    // Glow effects - pure green
    glow: 'rgba(0, 210, 106, 0.5)',
    glowSoft: 'rgba(0, 210, 106, 0.2)',
    glowIntense: 'rgba(0, 210, 106, 0.7)',
    // Liquid glass surfaces
    surface: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, transparent 100%)',
    surfaceHover: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
    // Premium liquid effects - pure green
    liquid: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,210,106,0.03) 50%, rgba(255,255,255,0.02) 100%)',
    liquidHover: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(0,210,106,0.05) 50%, rgba(255,255,255,0.03) 100%)',
    liquidActive: 'linear-gradient(135deg, rgba(0,210,106,0.2) 0%, rgba(0,210,106,0.08) 50%, rgba(255,255,255,0.03) 100%)',
    // Water drop highlight
    waterDrop: 'radial-gradient(ellipse 80% 50% at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
    waterDropSmall: 'radial-gradient(ellipse 60% 40% at 15% 15%, rgba(255,255,255,0.08) 0%, transparent 40%)',
    // Shimmer effect
    shimmer: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
    shimmerVertical: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.04), transparent)',
  },

  // Text Colors - Pure white for maximum clarity
  text: {
    primary: '#ffffff',             // Pure white - sharp and clear
    secondary: 'rgba(255, 255, 255, 0.85)',
    tertiary: 'rgba(255, 255, 255, 0.65)',
    muted: 'rgba(255, 255, 255, 0.45)',
    glow: '#00D26A',
    inverse: '#000000',
    accent: '#f0b90b',              // Gold accent text
    dark: '#000000',
    black: '#000000',
    // For consistency - pure white on cards
    onCard: '#ffffff',
    onCardSecondary: 'rgba(255, 255, 255, 0.85)',
    onCardTertiary: 'rgba(255, 255, 255, 0.65)',
  },

  // Trading colors - Pure green
  trading: {
    buy: '#00D26A',                 // Pure dark green
    buyBg: 'rgba(0, 210, 106, 0.15)',
    buyBgHover: 'rgba(0, 210, 106, 0.25)',
    buyGlow: '0 0 30px rgba(0, 210, 106, 0.5)',
    buyGradient: 'linear-gradient(135deg, #00D26A 0%, #00B35A 100%)',
    sell: '#f6465d',                // Red
    sellBg: 'rgba(246, 70, 93, 0.15)',
    sellBgHover: 'rgba(246, 70, 93, 0.25)',
    sellGlow: '0 0 30px rgba(246, 70, 93, 0.5)',
    sellGradient: 'linear-gradient(135deg, #f6465d 0%, #e53950 100%)',
  },

  // Status colors - Pure green
  status: {
    success: '#00D26A',
    successBg: 'rgba(0, 210, 106, 0.15)',
    warning: '#f0b90b',
    warningBg: 'rgba(240, 185, 11, 0.15)',
    error: '#f6465d',
    errorBg: 'rgba(246, 70, 93, 0.15)',
    info: '#00D26A',
    infoBg: 'rgba(0, 210, 106, 0.15)',
  },

  // Premium gradients - Pure Green & Black
  gradients: {
    // Primary gradients - Pure solid green (no fading)
    primary: 'linear-gradient(135deg, #00D26A 0%, #00D26A 100%)',
    primaryDark: 'linear-gradient(135deg, #00B35A 0%, #00B35A 100%)',
    primarySolid: 'linear-gradient(135deg, #00D26A 0%, #00B35A 100%)',
    // Liquid glass gradients
    liquidGlass: 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 50%, transparent 100%)',
    liquidGlassHover: 'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
    liquidGlassPremium: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(0,210,106,0.04) 50%, transparent 100%)',
    // Card gradients - Pure black
    card: 'linear-gradient(145deg, rgba(15,15,15,0.98) 0%, rgba(10,10,10,0.98) 100%)',
    cardPremium: 'linear-gradient(145deg, rgba(20,20,20,0.98) 0%, rgba(15,15,15,0.98) 100%)',
    cardHover: 'linear-gradient(145deg, rgba(26,26,26,0.98) 0%, rgba(20,20,20,0.98) 100%)',
    cardDark: 'linear-gradient(145deg, #0f0f0f 0%, #0a0a0a 100%)',
    cardGlass: 'linear-gradient(145deg, rgba(15,15,15,0.95) 0%, rgba(10,10,10,0.9) 100%)',
    // Glass surface with highlight
    glassSurface: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
    glassSurfaceHover: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%)',
    glassTeal: 'linear-gradient(135deg, #00D26A 0%, #00D26A 100%)',
    // Ambient mesh backgrounds - Pure green
    mesh: `radial-gradient(ellipse 60% 40% at 20% 20%, rgba(0, 210, 106, 0.05) 0%, transparent 50%),
           radial-gradient(ellipse 50% 35% at 80% 15%, rgba(0, 210, 106, 0.04) 0%, transparent 50%)`,
    meshIntense: `radial-gradient(ellipse 60% 40% at 20% 20%, rgba(0, 210, 106, 0.1) 0%, transparent 50%),
                  radial-gradient(ellipse 50% 35% at 80% 15%, rgba(0, 210, 106, 0.08) 0%, transparent 50%)`,
    hero: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0, 210, 106, 0.08) 0%, transparent 60%)',
    heroIntense: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0, 210, 106, 0.15) 0%, transparent 60%)',
    wave: `radial-gradient(ellipse 100% 60% at 50% 100%, rgba(240, 185, 11, 0.04) 0%, transparent 50%),
           radial-gradient(ellipse 80% 40% at 30% 80%, rgba(0, 210, 106, 0.04) 0%, transparent 40%)`,
    // Glow gradients - Pure green
    glow: 'radial-gradient(circle, rgba(0, 210, 106, 0.6) 0%, transparent 70%)',
    glowSoft: 'radial-gradient(circle, rgba(0, 210, 106, 0.25) 0%, transparent 70%)',
    glowCyan: 'radial-gradient(circle, rgba(0, 210, 106, 0.5) 0%, transparent 70%)',
    glowGold: 'radial-gradient(circle, rgba(240, 185, 11, 0.35) 0%, transparent 70%)',
    // Button gradients - Pure solid green
    buttonGlass: 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)',
    buttonGlassHover: 'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)',
    buttonPrimary: 'linear-gradient(135deg, #00D26A 0%, #00B35A 100%)',
    buttonSecondary: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
    // Text effects
    textGlow: 'linear-gradient(135deg, #ffffff 0%, #00D26A 50%, #00D26A 100%)',
    // Line gradients - Pure green
    neonLine: 'linear-gradient(90deg, transparent, #00D26A, transparent)',
    neonLineVertical: 'linear-gradient(180deg, transparent, #00D26A, transparent)',
    neonLineGold: 'linear-gradient(90deg, transparent, #f0b90b, transparent)',
    // Accent gradients
    orangeAccent: 'linear-gradient(135deg, #f0b90b 0%, #d4a309 100%)',
    goldAccent: 'linear-gradient(135deg, #f0b90b 0%, #b88d07 100%)',
    // Ambient lighting - Pure green
    ambient: 'radial-gradient(ellipse at 20% 0%, rgba(0, 210, 106, 0.12) 0%, transparent 50%)',
    ambientSecondary: 'radial-gradient(ellipse at 80% 100%, rgba(0, 210, 106, 0.08) 0%, transparent 50%)',
    ambientGold: 'radial-gradient(ellipse at 50% 50%, rgba(240, 185, 11, 0.06) 0%, transparent 50%)',
    // 3D liquid effects
    liquid3D: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 30%, transparent 60%, rgba(0,0,0,0.15) 100%)',
    liquid3DHover: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 30%, transparent 60%, rgba(0,0,0,0.2) 100%)',
    // Sphere/orb effect for 3D objects - Pure green
    sphere: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 20%, transparent 50%, rgba(0,0,0,0.25) 100%)',
    sphereGreen: 'radial-gradient(circle at 30% 30%, rgba(0,210,106,0.4) 0%, rgba(0,210,106,0.15) 30%, transparent 60%)',
  },

  // Shadows - Pure black & green shadows
  shadows: {
    // Basic shadows
    sm: '0 2px 4px rgba(0, 0, 0, 0.4)',
    md: '0 4px 12px rgba(0, 0, 0, 0.5)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.6)',
    xl: '0 16px 48px rgba(0, 0, 0, 0.7)',
    // Glass shadows with depth
    glass: '0 4px 24px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.4)',
    glassHover: '0 8px 32px rgba(0, 0, 0, 0.6), 0 2px 6px rgba(0, 0, 0, 0.45)',
    glassIntense: '0 12px 40px rgba(0, 0, 0, 0.7), 0 4px 12px rgba(0, 0, 0, 0.5)',
    // Float shadows
    float: '0 12px 40px rgba(0, 0, 0, 0.6)',
    floatHover: '0 20px 60px rgba(0, 0, 0, 0.7)',
    // Glow shadows - Pure green
    glow: '0 0 20px rgba(0, 210, 106, 0.3)',
    glowMd: '0 0 30px rgba(0, 210, 106, 0.4)',
    glowLg: '0 0 50px rgba(0, 210, 106, 0.5)',
    glowXl: '0 0 80px rgba(0, 210, 106, 0.6)',
    glowSoft: '0 0 40px rgba(0, 210, 106, 0.2)',
    glowCyan: '0 0 30px rgba(0, 210, 106, 0.35)',
    glowTeal: '0 0 30px rgba(0, 210, 106, 0.35)',
    glowGold: '0 0 30px rgba(240, 185, 11, 0.25)',
    // Card shadows with subtle glow
    card: '0 4px 24px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
    cardHover: '0 8px 32px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 0 0 1px rgba(255,255,255,0.06)',
    cardFloat: '0 24px 64px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    cardGlow: '0 4px 24px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 210, 106, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
    // Inner shadows
    inner: 'inset 0 2px 12px rgba(0, 0, 0, 0.4)',
    innerStrong: 'inset 0 4px 20px rgba(0, 0, 0, 0.6)',
    innerGlass: 'inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.3)',
    // Button shadows - Pure green
    button: '0 4px 20px rgba(0, 210, 106, 0.4)',
    buttonHover: '0 6px 30px rgba(0, 210, 106, 0.55)',
    buttonPressed: '0 2px 10px rgba(0, 210, 106, 0.3)',
    // Neon/text effects - Pure green
    neonText: '0 0 10px rgba(0, 210, 106, 0.9), 0 0 20px rgba(0, 210, 106, 0.5)',
    neonTextSoft: '0 0 8px rgba(0, 210, 106, 0.6)',
    // Ambient - Pure green
    ambient: '0 0 120px rgba(0, 210, 106, 0.15)',
    ambientGold: '0 0 80px rgba(240, 185, 11, 0.1)',
    // 3D depth shadows
    depth3D: '0 20px 40px rgba(0, 0, 0, 0.6), 0 8px 16px rgba(0, 0, 0, 0.4)',
    depth3DHover: '0 30px 60px rgba(0, 0, 0, 0.7), 0 12px 24px rgba(0, 0, 0, 0.5)',
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

  // Backgrounds - Plain White for clean design
  background: {
    primary: '#ffffff',             // Pure white
    secondary: '#ffffff',           // Pure white
    tertiary: '#f9fafb',            // Very light gray
    elevated: '#f3f4f6',            // Light gray for elevation
    hover: '#f0f0f0',               // Hover state
    card: '#ffffff',                // White cards
    input: '#ffffff',               // White input fields
    spotlight: '#ffffff',           // White spotlight
  },

  // Glass effects - Clean white design
  glass: {
    // Base glass layers - white/light gray
    light: '#ffffff',
    medium: '#fafafa',
    heavy: '#f5f5f5',
    // Borders - subtle gray borders
    border: 'rgba(0, 0, 0, 0.08)',
    borderHover: 'rgba(0, 0, 0, 0.12)',
    borderActive: 'rgba(16, 185, 129, 0.5)',
    borderGlow: 'rgba(16, 185, 129, 0.3)',
    // Reflections - none for clean look
    reflection: 'none',
    reflectionStrong: 'none',
    reflectionLeft: 'none',
    // Frosted glass - white
    frosted: '#ffffff',
    frostedLight: '#fafafa',
    frostedMedium: '#f5f5f5',
    // Glow effects - soft green glows
    glow: 'rgba(16, 185, 129, 0.2)',
    glowSoft: 'rgba(16, 185, 129, 0.1)',
    glowIntense: 'rgba(16, 185, 129, 0.3)',
    // Surfaces - white
    surface: '#ffffff',
    surfaceHover: '#fafafa',
    liquid: '#ffffff',
    liquidHover: '#fafafa',
    liquidActive: 'rgba(16,185,129,0.08)',
    // No water drop effects
    waterDrop: 'none',
    waterDropSmall: 'none',
    // No shimmer
    shimmer: 'none',
    shimmerVertical: 'none',
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

  // Premium Gradients - Plain white clean design
  gradients: {
    // Primary gradients - keep green buttons
    primary: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    primaryDark: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    primarySolid: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
    // Liquid glass gradients - plain white
    liquidGlass: 'none',
    liquidGlassHover: 'none',
    liquidGlassPremium: 'none',
    // Card gradients - plain white
    card: 'none',
    cardPremium: 'none',
    cardHover: 'none',
    cardDark: 'none',
    cardGlass: 'none',
    glassSurface: 'none',
    glassSurfaceHover: 'none',
    glassTeal: 'linear-gradient(135deg, #14b8a6 0%, #10b981 100%)',
    // No decorative mesh backgrounds - plain white
    mesh: 'none',
    meshIntense: 'none',
    // Hero section gradients - none for plain white
    hero: 'none',
    heroIntense: 'none',
    wave: 'none',
    // Glow gradients - none for clean look
    glow: 'none',
    glowSoft: 'none',
    glowCyan: 'none',
    glowGold: 'none',
    // Button gradients - keep functional styles
    buttonGlass: 'none',
    buttonGlassHover: 'none',
    buttonPrimary: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    buttonSecondary: 'none',
    // Text effects - keep for buttons
    textGlow: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
    // Neon line gradients - none
    neonLine: 'none',
    neonLineVertical: 'none',
    neonLineGold: 'none',
    // Accent gradients - keep functional
    orangeAccent: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    goldAccent: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    // Ambient lighting - none for plain white
    ambient: 'none',
    ambientSecondary: 'none',
    ambientGold: 'none',
    // 3D liquid effects - none
    liquid3D: 'none',
    liquid3DHover: 'none',
    // Sphere/orb effects - none
    sphere: 'none',
    sphereGreen: 'none',
    // Widget backgrounds - plain white
    widgetGreen: 'none',
    widgetBlue: 'none',
    widgetPurple: 'none',
    widgetGold: 'none',
    widgetPink: 'none',
    widgetTeal: 'none',
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
