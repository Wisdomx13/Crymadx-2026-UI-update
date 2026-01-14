// CrymadX Convert Screen - ChangeNow Whitelabel Integration
// Provides crypto-to-crypto swaps via ChangeNow's embedded exchange widget

import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Zap,
  ExternalLink,
  Shield,
  Clock,
  Coins,
  History,
  ArrowRightLeft,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { ResponsiveLayout, CryptoIcon } from '../../components';
import ChangeNowWidget from '../../components/ChangeNowWidget';
import { CHANGENOW_CONFIG } from '../../config/changenow';
import { swapService } from '../../services';
import type { SwapOrder } from '../../types/api';

// Feature flag for fiat on/off-ramp (enable when ChangeNow approves your documents)
const FIAT_ENABLED = false;

// Memoized Widget Container - completely isolated from history state
const WidgetContainer = memo(({
  fromCurrency,
  toCurrency,
  height
}: {
  fromCurrency: string;
  toCurrency: string;
  height: number;
}) => {
  const { colors } = useThemeMode();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        background: colors.background.secondary,
        border: `1px solid ${colors.glass.border}`,
      }}
    >
      <ChangeNowWidget
        fromCurrency={fromCurrency}
        toCurrency={toCurrency}
        amount={CHANGENOW_CONFIG.defaultAmount}
        height={height}
        showFaq={false}
        showLanguageSelector={true}
        enableFiat={FIAT_ENABLED}
        enhanced={true}
      />
    </motion.div>
  );
});

WidgetContainer.displayName = 'WidgetContainer';

// Separate Swap History Component with its own state
const SwapHistorySection: React.FC = () => {
  const { colors } = useThemeMode();
  const [swapHistory, setSwapHistory] = useState<SwapOrder[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false); // Prevent infinite fetch loop

  const fetchSwapHistory = useCallback(async () => {
    if (isLoadingHistory) return; // Prevent concurrent fetches
    setIsLoadingHistory(true);
    setHistoryError(null);
    try {
      const response = await swapService.getSwapHistory({ limit: 10 });
      setSwapHistory(response.orders || []);
    } catch (err: any) {
      console.error('Failed to fetch swap history:', err);
      setHistoryError('Unable to load swap history');
    } finally {
      setIsLoadingHistory(false);
      setHasFetched(true);
    }
  }, [isLoadingHistory]);

  // Fetch history only once when expanded for the first time
  useEffect(() => {
    if (showHistory && !hasFetched && !isLoadingHistory) {
      fetchSwapHistory();
    }
  }, [showHistory, hasFetched, isLoadingHistory, fetchSwapHistory]);

  const getStatusInfo = (status: SwapOrder['status']) => {
    const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; text: string }> = {
      finished: { icon: CheckCircle, color: colors.status.success, text: 'Completed' },
      failed: { icon: XCircle, color: colors.status.error, text: 'Failed' },
      refunded: { icon: RefreshCw, color: colors.text.tertiary, text: 'Refunded' },
      pending: { icon: Clock, color: colors.status.warning, text: 'Pending' },
      waiting: { icon: Clock, color: colors.status.warning, text: 'Waiting' },
      confirming: { icon: Loader2, color: colors.primary[400], text: 'Confirming' },
      exchanging: { icon: ArrowRightLeft, color: colors.primary[400], text: 'Exchanging' },
      sending: { icon: ArrowRightLeft, color: colors.primary[400], text: 'Sending' },
    };
    return statusConfig[status] || { icon: Clock, color: colors.text.tertiary, text: status };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      style={{
        marginTop: '16px',
        background: colors.background.secondary,
        borderRadius: '12px',
        border: `1px solid ${colors.glass.border}`,
        overflow: 'hidden',
      }}
    >
      {/* History Header - Clickable to expand */}
      <button
        onClick={() => setShowHistory(!showHistory)}
        style={{
          width: '100%',
          padding: '14px 16px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <History size={18} color={colors.primary[400]} />
          <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary }}>
            Swap History
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isLoadingHistory && (
            <Loader2
              size={16}
              color={colors.primary[400]}
              style={{ animation: 'spin 1s linear infinite' }}
            />
          )}
          {showHistory ? (
            <ChevronUp size={18} color={colors.text.tertiary} />
          ) : (
            <ChevronDown size={18} color={colors.text.tertiary} />
          )}
        </div>
      </button>

      {/* History Content - Simple conditional render without AnimatePresence */}
      {showHistory && (
        <div
          style={{
            borderTop: `1px solid ${colors.glass.border}`,
            maxHeight: '300px',
            overflowY: 'auto',
          }}
        >
          {/* Error State */}
          {historyError && (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: colors.text.tertiary }}>
                {historyError}
              </p>
              <button
                onClick={() => {
                  setHasFetched(false);
                  fetchSwapHistory();
                }}
                style={{
                  marginTop: '8px',
                  padding: '6px 12px',
                  background: `${colors.primary[400]}20`,
                  border: `1px solid ${colors.primary[400]}`,
                  borderRadius: '6px',
                  color: colors.primary[400],
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoadingHistory && !historyError && swapHistory.length === 0 && (
            <div style={{ padding: '30px 20px', textAlign: 'center' }}>
              <ArrowRightLeft
                size={32}
                color={colors.text.tertiary}
                style={{ marginBottom: '12px', opacity: 0.5 }}
              />
              <p style={{ fontSize: '13px', color: colors.text.tertiary }}>
                No swap history yet
              </p>
              <p style={{ fontSize: '11px', color: colors.text.tertiary, marginTop: '4px' }}>
                Your completed swaps will appear here
              </p>
            </div>
          )}

          {/* History Items */}
          {swapHistory.map((swap, index) => {
            const statusInfo = getStatusInfo(swap.status);
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={swap.id || index}
                style={{
                  padding: '12px 16px',
                  borderBottom:
                    index < swapHistory.length - 1
                      ? `1px solid ${colors.glass.border}`
                      : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {/* Left: Swap pair info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ position: 'relative' }}>
                    <CryptoIcon symbol={swap.fromToken} size={28} />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: -2,
                        right: -8,
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: colors.background.primary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CryptoIcon symbol={swap.toToken} size={14} />
                    </div>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: colors.text.primary,
                      }}
                    >
                      {swap.fromAmount} {swap.fromToken} → {swap.toAmount || '...'}{' '}
                      {swap.toToken}
                    </p>
                    <p style={{ fontSize: '11px', color: colors.text.tertiary }}>
                      {swap.createdAt ? formatDate(swap.createdAt) : 'Processing'}
                    </p>
                  </div>
                </div>

                {/* Right: Status */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 8px',
                    background: `${statusInfo.color}15`,
                    borderRadius: '6px',
                  }}
                >
                  <StatusIcon size={12} color={statusInfo.color} />
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 500,
                      color: statusInfo.color,
                    }}
                  >
                    {statusInfo.text}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Track on ChangeNow link */}
          {swapHistory.length > 0 && (
            <div
              style={{
                padding: '12px 16px',
                borderTop: `1px solid ${colors.glass.border}`,
                textAlign: 'center',
              }}
            >
              <a
                href="https://changenow.io/exchange/txs"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  color: colors.primary[400],
                  textDecoration: 'none',
                }}
              >
                <ExternalLink size={12} />
                Track all transactions
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const ConvertScreen: React.FC = () => {
  const navigate = useNavigate();
  const { colors } = useThemeMode();
  const [isMobile, setIsMobile] = useState(false);
  const [selectedPair, setSelectedPair] = useState({
    from: CHANGENOW_CONFIG.defaultFromCurrency,
    to: CHANGENOW_CONFIG.defaultToCurrency,
  });

  // Check screen size
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Load ChangeNow stepper connector script for enhanced widget functionality
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://changenow.io/embeds/exchange-widget/v2/stepper-connector.js';
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Responsive widget height
  const widgetHeight = isMobile ? 420 : 380;

  return (
    <ResponsiveLayout activeNav="wallet" title="Convert">
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px',
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '12px',
              background: 'rgba(0, 255, 136, 0.1)',
              border: `1px solid ${colors.glass.border}`,
              borderRadius: '12px',
              color: colors.text.primary,
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <ArrowLeft size={20} />
          </motion.button>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: colors.text.primary }}>
              Convert
            </h1>
            <p style={{ fontSize: '13px', color: colors.text.tertiary }}>
              Swap between 900+ cryptocurrencies
            </p>
          </div>
        </motion.div>

        {/* Quick Pair Selection */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '16px',
            flexWrap: 'wrap',
          }}
        >
          {CHANGENOW_CONFIG.popularPairs.map((pair) => (
            <motion.button
              key={`${pair.from}-${pair.to}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPair({ from: pair.from, to: pair.to })}
              style={{
                padding: '6px 12px',
                background:
                  selectedPair.from === pair.from && selectedPair.to === pair.to
                    ? `${colors.primary[400]}20`
                    : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${
                  selectedPair.from === pair.from && selectedPair.to === pair.to
                    ? colors.primary[400]
                    : colors.glass.border
                }`,
                borderRadius: '8px',
                color:
                  selectedPair.from === pair.from && selectedPair.to === pair.to
                    ? colors.primary[400]
                    : colors.text.secondary,
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Zap size={10} />
              {pair.label}
            </motion.button>
          ))}
        </div>

        {/* ChangeNow Widget - Isolated in its own memoized component */}
        <WidgetContainer
          fromCurrency={selectedPair.from}
          toCurrency={selectedPair.to}
          height={widgetHeight}
        />

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginTop: '16px',
          }}
        >
          {[
            { icon: Coins, label: '900+ Coins', desc: 'Wide selection' },
            { icon: Shield, label: 'Non-Custodial', desc: 'You control keys' },
            { icon: Clock, label: 'Fast Swaps', desc: '~15 minutes' },
          ].map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              style={{
                padding: '12px',
                background: colors.background.secondary,
                borderRadius: '12px',
                border: `1px solid ${colors.glass.border}`,
                textAlign: 'center',
              }}
            >
              <Icon size={18} color={colors.primary[400]} style={{ marginBottom: '6px' }} />
              <p style={{ fontSize: '12px', fontWeight: 600, color: colors.text.primary }}>
                {label}
              </p>
              <p style={{ fontSize: '10px', color: colors.text.tertiary }}>
                {desc}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Swap History Section - Completely isolated component */}
        <SwapHistorySection />
      </div>
    </ResponsiveLayout>
  );
};

export default ConvertScreen;
