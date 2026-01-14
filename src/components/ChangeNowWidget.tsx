// ChangeNow Whitelabel Exchange Widget
// Embeds the ChangeNow exchange widget with CrymadX theming

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useThemeMode } from '../theme/ThemeContext';

export interface ChangeNowWidgetProps {
  /** Default source currency (e.g., 'btc', 'eth') */
  fromCurrency?: string;
  /** Default destination currency (e.g., 'eth', 'usdt') */
  toCurrency?: string;
  /** Default amount to exchange */
  amount?: string;
  /** Widget height in pixels */
  height?: number;
  /** Show FAQ section */
  showFaq?: boolean;
  /** Show language selector */
  showLanguageSelector?: boolean;
  /** Enable fiat mode (Buy/Sell tabs) - requires approval from ChangeNow */
  enableFiat?: boolean;
  /** Default fiat currency for buy/sell */
  fiatCurrency?: string;
  /** Fiat amount for buy mode */
  fiatAmount?: string;
  /** Show enhanced animations */
  enhanced?: boolean;
}

const ChangeNowWidget: React.FC<ChangeNowWidgetProps> = ({
  fromCurrency = 'btc',
  toCurrency = 'eth',
  amount = '0.1',
  height = 356,
  showFaq = false,
  showLanguageSelector = true,
  enableFiat = false,
  fiatCurrency = 'usd',
  fiatAmount = '500',
  enhanced = true,
}) => {
  const { colors, isDark } = useThemeMode();
  const [isLoading, setIsLoading] = useState(true);
  const [widgetKey, setWidgetKey] = useState(0);

  // Get partner link ID from environment variable or use default
  const linkId = import.meta.env.VITE_CHANGENOW_LINK_ID || '56b30c395ede1d';

  // Reload widget when theme changes
  useEffect(() => {
    setIsLoading(true);
    setWidgetKey(prev => prev + 1);
  }, [isDark]);

  // Memoize widget URL to prevent unnecessary re-renders causing flickering
  const widgetUrl = useMemo(() => {
    const primaryColor = colors.primary[400].replace('#', '');
    const bgColor = isDark ? '0a0a0a' : 'ffffff';

    const url = new URL('https://changenow.io/embeds/exchange-widget/v2/widget.html');
    url.searchParams.set('from', fromCurrency.toLowerCase());
    url.searchParams.set('to', toCurrency.toLowerCase());
    url.searchParams.set('amount', amount);
    url.searchParams.set('darkMode', isDark ? 'true' : 'false');
    url.searchParams.set('primaryColor', primaryColor);
    url.searchParams.set('backgroundColor', bgColor);
    url.searchParams.set('FAQ', showFaq ? 'true' : 'false');
    url.searchParams.set('logo', 'false'); // Hide ChangeNow logo
    url.searchParams.set('lang', 'en-US');
    url.searchParams.set('locales', showLanguageSelector ? 'true' : 'false');
    url.searchParams.set('horizontal', 'false');

    // Enhanced mode with animations
    if (enhanced) {
      url.searchParams.set('toTheMoon', 'true');
    }

    // Fiat on/off-ramp parameters (requires ChangeNow approval)
    if (enableFiat) {
      url.searchParams.set('isFiat', 'true');
      url.searchParams.set('fromFiat', fiatCurrency.toLowerCase());
      url.searchParams.set('toFiat', toCurrency.toLowerCase());
      url.searchParams.set('amountFiat', fiatAmount);
    }

    // Add partner link ID
    if (linkId) {
      url.searchParams.set('link_id', linkId);
    }

    return url.toString();
  }, [fromCurrency, toCurrency, amount, isDark, showFaq, showLanguageSelector, enhanced, enableFiat, fiatCurrency, fiatAmount, linkId, colors.primary]);

  return (
    <div style={{ position: 'relative', minHeight: height }}>
      {/* Loading overlay */}
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: colors.background.secondary,
            borderRadius: '20px',
            zIndex: 10,
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={{ marginBottom: '16px' }}
          >
            <Loader2 size={40} color={colors.primary[400]} />
          </motion.div>
          <p style={{ color: colors.text.secondary, fontSize: '14px' }}>
            Loading exchange widget...
          </p>
        </div>
      )}

      {/* ChangeNow Widget iframe */}
      <iframe
        key={widgetKey}
        id="iframe-widget"
        src={widgetUrl}
        title="ChangeNow Exchange Widget"
        width="100%"
        height={height}
        frameBorder="0"
        onLoad={() => setIsLoading(false)}
        style={{
          border: 'none',
          borderRadius: '16px',
          background: 'transparent',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; payment"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
};

export default ChangeNowWidget;
