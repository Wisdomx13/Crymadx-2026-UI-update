// ChangeNow Widget Configuration
// Configuration constants for the ChangeNow whitelabel widget integration

export const CHANGENOW_CONFIG = {
  // Widget base URL
  widgetUrl: 'https://changenow.io/embeds/exchange-widget/v2/widget.html',

  // Default currencies for the widget
  defaultFromCurrency: 'btc',
  defaultToCurrency: 'eth',
  defaultAmount: '0.1',

  // Widget dimensions
  defaultHeight: 520,
  mobileHeight: 600,

  // Feature toggles
  showFaq: false,
  showLanguageSelector: false,
  showLogo: false,

  // Popular trading pairs for quick selection
  popularPairs: [
    { from: 'btc', to: 'eth', label: 'BTC → ETH' },
    { from: 'eth', to: 'usdt', label: 'ETH → USDT' },
    { from: 'btc', to: 'usdt', label: 'BTC → USDT' },
    { from: 'sol', to: 'eth', label: 'SOL → ETH' },
    { from: 'bnb', to: 'eth', label: 'BNB → ETH' },
  ],

  // Supported flow types
  flowTypes: {
    standard: 'standard', // Floating rate
    fixed: 'fixed',       // Fixed rate (locked for 20 mins)
  },
} as const;

// CrymadX Partner Link ID
export const CHANGENOW_LINK_ID = '56b30c395ede1d';

// Environment variable helper (falls back to hardcoded ID)
export const getChangeNowLinkId = (): string => {
  return import.meta.env.VITE_CHANGENOW_LINK_ID || CHANGENOW_LINK_ID;
};

// Check if partner link ID is configured (always true now with default)
export const isPartnerConfigured = (): boolean => {
  return true;
};
