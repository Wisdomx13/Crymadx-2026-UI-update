import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftRight,
  Star,
  CheckCircle,
  Users,
  Clock,
  Shield,
  X,
  ArrowRight,
  CreditCard,
  Wallet,
  Check,
  AlertCircle,
  RefreshCw,
  ThumbsUp,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Landmark,
  Loader2,
  Plus,
  FileText,
  MessageCircle,
  Trash2,
  Eye,
} from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { GlassCard, CryptoIcon, ResponsiveLayout } from '../../components';
import { usePresentationMode } from '../../components/PresentationMode';
import { LiquidGlassBackground, LiquidOrb } from '../../components/Glass3D';
import { p2pService, P2POrder, P2PTrade } from '../../services/p2pService';
import { tokenManager } from '../../services';
import { PostAdModal } from './PostAdModal';
import { TradeDetailModal } from './TradeDetailModal';

// Payment method icons
const paymentIcons: { [key: string]: React.ReactNode } = {
  'Bank Transfer': <Landmark size={14} />,
  'PayPal': <Wallet size={14} />,
  'Wise': <Smartphone size={14} />,
  'Zelle': <CreditCard size={14} />,
  'Venmo': <CreditCard size={14} />,
  'Cash App': <Smartphone size={14} />,
  'Revolut': <CreditCard size={14} />,
};

// Main navigation type
type MainTab = 'market' | 'my-orders' | 'my-trades';

export const P2PScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = usePresentationMode();
  const { colors, isDark } = useThemeMode();

  // Main navigation
  const [mainTab, setMainTab] = useState<MainTab>('market');

  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [selectedCrypto, setSelectedCrypto] = useState('USDT');
  const [selectedOrder, setSelectedOrder] = useState<P2POrder | null>(null);
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeStep, setTradeStep] = useState(0);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [showPostAdModal, setShowPostAdModal] = useState(false);
  const [showTradeDetailModal, setShowTradeDetailModal] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<P2PTrade | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // API state
  const [orders, setOrders] = useState<P2POrder[]>([]);
  const [myOrders, setMyOrders] = useState<P2POrder[]>([]);
  const [myTrades, setMyTrades] = useState<P2PTrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [myOrdersLoading, setMyOrdersLoading] = useState(false);
  const [myTradesLoading, setMyTradesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [myOrdersError, setMyOrdersError] = useState<string | null>(null);
  const [myTradesError, setMyTradesError] = useState<string | null>(null);
  const [activeTrade, setActiveTrade] = useState<P2PTrade | null>(null);
  const [tradeError, setTradeError] = useState<string | null>(null);
  const [tradeLoading, setTradeLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch market orders from API
  useEffect(() => {
    if (mainTab !== 'market') return;

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await p2pService.getOrders({
          type: activeTab,
          crypto: selectedCrypto,
          page: currentPage,
          limit: ordersPerPage,
        });
        setOrders(response.orders || []);
        setTotalPages(response.totalPages || 1);
      } catch (err: any) {
        console.error('Failed to fetch P2P orders:', err);
        setError(err.message || 'Failed to load orders');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [mainTab, activeTab, selectedCrypto, currentPage]);

  // Fetch my orders when on that tab
  useEffect(() => {
    if (mainTab !== 'my-orders') return;
    if (!tokenManager.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchMyOrders = async () => {
      setMyOrdersLoading(true);
      setMyOrdersError(null);
      try {
        const response = await p2pService.getMyOrders();
        setMyOrders(response?.orders || []);
      } catch (err: any) {
        console.error('Failed to fetch my orders:', err);
        // Handle 404 as empty orders (endpoint might not exist yet)
        if (err?.status === 404 || err?.message?.includes('404') || err?.message?.includes('not found')) {
          setMyOrders([]);
          setMyOrdersError(null);
        } else {
          setMyOrdersError(err?.message || 'Failed to load your orders. Please try again.');
          setMyOrders([]);
        }
      } finally {
        setMyOrdersLoading(false);
      }
    };

    fetchMyOrders();
  }, [mainTab, navigate]);

  // Fetch my trades when on that tab
  useEffect(() => {
    if (mainTab !== 'my-trades') return;
    if (!tokenManager.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchMyTrades = async () => {
      setMyTradesLoading(true);
      setMyTradesError(null);
      try {
        const response = await p2pService.getMyTrades();
        setMyTrades(response?.trades || []);
      } catch (err: any) {
        console.error('Failed to fetch my trades:', err);
        // Handle 404 as empty trades (endpoint might not exist yet)
        if (err?.status === 404 || err?.message?.includes('404') || err?.message?.includes('not found')) {
          setMyTrades([]);
          setMyTradesError(null);
        } else {
          setMyTradesError(err?.message || 'Failed to load your trades. Please try again.');
          setMyTrades([]);
        }
      } finally {
        setMyTradesLoading(false);
      }
    };

    fetchMyTrades();
  }, [mainTab, navigate]);

  const handleStartTrade = (order: P2POrder) => {
    if (!tokenManager.isAuthenticated()) {
      navigate('/login');
      return;
    }
    setSelectedOrder(order);
    setShowTradeModal(true);
    setTradeStep(1);
    setTradeError(null);
    setActiveTrade(null);
  };

  const handleConfirmTrade = async () => {
    if (!selectedOrder || !tradeAmount) return;

    setTradeLoading(true);
    setTradeError(null);

    try {
      const response = await p2pService.createTrade({
        orderId: selectedOrder.id,
        amount: tradeAmount,
      });
      setActiveTrade(response.trade);
      setTradeStep(2); // Move to processing step

      // After a brief delay, move to payment step
      setTimeout(() => setTradeStep(3), 2000);
    } catch (err: any) {
      setTradeError(err.message || 'Failed to create trade');
    } finally {
      setTradeLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!activeTrade) return;

    setTradeLoading(true);
    setTradeError(null);

    try {
      const response = await p2pService.confirmPayment(activeTrade.id);
      setActiveTrade(response.trade);
      setTradeStep(4); // Move to waiting for release

      // Poll for completion
      pollTradeStatus(activeTrade.id);
    } catch (err: any) {
      setTradeError(err.message || 'Failed to confirm payment');
    } finally {
      setTradeLoading(false);
    }
  };

  const pollTradeStatus = async (tradeId: string) => {
    const maxAttempts = 30;
    let attempts = 0;

    const poll = async () => {
      if (attempts >= maxAttempts) return;

      try {
        const response = await p2pService.getTradeDetails(tradeId);
        if (response.trade.status === 'completed') {
          setActiveTrade(response.trade);
          setTradeStep(5); // Trade complete
          return;
        }
        attempts++;
        setTimeout(poll, 2000);
      } catch {
        attempts++;
        setTimeout(poll, 2000);
      }
    };

    poll();
  };

  const handleRateTrade = async (rating: number) => {
    if (!activeTrade) return;

    try {
      await p2pService.rateTrade(activeTrade.id, rating);
      resetTrade();
    } catch {
      // Silent fail for rating
      resetTrade();
    }
  };

  const resetTrade = () => {
    setShowTradeModal(false);
    setSelectedOrder(null);
    setTradeAmount('');
    setTradeStep(0);
    setActiveTrade(null);
    setTradeError(null);
  };

  // Handle canceling my order
  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    setMyOrdersError(null);
    try {
      await p2pService.cancelOrder(orderId);
      // Refresh my orders
      const response = await p2pService.getMyOrders();
      setMyOrders(response.orders || []);
    } catch (err: any) {
      setMyOrdersError('Failed to cancel order: ' + (err.message || 'Unknown error'));
    }
  };

  // Handle viewing trade details
  const handleViewTrade = (trade: P2PTrade) => {
    setSelectedTrade(trade);
    setShowTradeDetailModal(true);
  };

  // Handle post ad click
  const handlePostAd = () => {
    if (!tokenManager.isAuthenticated()) {
      navigate('/login');
      return;
    }
    setShowPostAdModal(true);
  };

  // Helper to transform API order to display format
  const getOrderDisplay = (order: P2POrder) => ({
    ...order,
    traderName: order.trader?.name || 'Anonymous',
    traderInitial: (order.trader?.name || 'A')[0],
    verified: order.trader?.verified || false,
    orders: order.trader?.completedOrders || 0,
    completion: order.trader?.completionRate?.toFixed(1) || '0',
    rating: order.trader?.rating?.toFixed(1) || '0',
    online: order.trader?.online || false,
    limit: {
      min: parseFloat(order.minLimit) || 0,
      max: parseFloat(order.maxLimit) || 0,
    },
  });

  return (
    <ResponsiveLayout activeNav="p2p" title="P2P Trading">
      {/* Premium Liquid Glass Background */}
      <LiquidGlassBackground
        intensity="low"
        showOrbs={true}
        showRings={false}
        showCubes={false}
      />
      {/* Accent orbs for premium P2P feel */}
      <LiquidOrb
        size={180}
        color="green"
        style={{ position: 'fixed', top: '5%', right: '-5%', zIndex: 0 }}
        delay={0}
        duration={10}
      />
      <LiquidOrb
        size={120}
        color="gold"
        style={{ position: 'fixed', bottom: '15%', left: '-3%', zIndex: 0 }}
        delay={2}
        duration={14}
      />

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          textAlign: 'center',
          marginBottom: isMobile ? '24px' : '32px',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '8px'
        }}>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: `linear-gradient(135deg, ${colors.primary[400]}20, ${colors.primary[400]}05)`,
              border: `1px solid ${colors.primary[400]}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowLeftRight size={24} color={colors.primary[400]} />
          </motion.div>
          <h1 style={{
            fontSize: isMobile ? '28px' : '32px',
            fontWeight: 700,
            color: colors.text.primary,
          }}>
            P2P Trading
          </h1>
        </div>
        <p style={{ fontSize: '15px', color: colors.text.tertiary }}>
          Buy and sell crypto directly with verified merchants
        </p>
      </motion.div>

      {/* Features Banner - Honest messaging about platform capabilities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ marginBottom: '24px' }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: '12px',
        }}>
          {[
            { label: 'Secure Escrow', value: 'Protected', icon: <Shield size={18} />, desc: 'Funds held safely' },
            { label: 'Fast Trading', value: 'Direct', icon: <ArrowLeftRight size={18} />, desc: 'Peer-to-peer' },
            { label: 'Multiple Payments', value: 'Flexible', icon: <CreditCard size={18} />, desc: 'Bank, PayPal, etc.' },
            { label: 'Dispute Support', value: '24/7', icon: <CheckCircle size={18} />, desc: 'Admin moderation' },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                padding: '16px',
                background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)',
                borderRadius: '12px',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                textAlign: 'center',
              }}
            >
              <div style={{ color: colors.primary[400], marginBottom: '8px' }}>{stat.icon}</div>
              <p style={{ fontSize: '16px', fontWeight: 700, color: colors.text.primary }}>{stat.value}</p>
              <p style={{ fontSize: '11px', color: colors.text.tertiary, marginBottom: '2px' }}>{stat.label}</p>
              <p style={{ fontSize: '10px', color: colors.text.tertiary, opacity: 0.7 }}>{stat.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Main Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '4px',
          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
          borderRadius: '12px',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
        }}>
          {[
            { key: 'market', label: 'Market', icon: <ArrowLeftRight size={16} /> },
            { key: 'my-orders', label: 'My Orders', icon: <FileText size={16} /> },
            { key: 'my-trades', label: 'My Trades', icon: <MessageCircle size={16} /> },
          ].map((tab) => (
            <motion.button
              key={tab.key}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMainTab(tab.key as MainTab)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: isMobile ? '10px 14px' : '10px 20px',
                borderRadius: '10px',
                border: 'none',
                background: mainTab === tab.key ? colors.primary[400] : 'transparent',
                color: mainTab === tab.key ? '#fff' : colors.text.tertiary,
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {tab.icon}
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Post Ad Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePostAd}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'none',
            background: `linear-gradient(135deg, ${colors.primary[400]}, ${colors.primary[500]})`,
            color: '#fff',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: `0 4px 12px ${colors.primary[400]}40`,
          }}
        >
          <Plus size={16} />
          Post Ad
        </motion.button>
      </motion.div>

      {/* Market Tab Content */}
      {mainTab === 'market' && (
        <>
          {/* Buy/Sell Tabs & Crypto Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            {/* Buy/Sell Toggle */}
            <div style={{
              display: 'flex',
              padding: '4px',
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              borderRadius: '12px',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
            }}>
              {['buy', 'sell'].map((tab) => (
                <motion.button
                  key={tab}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setActiveTab(tab as 'buy' | 'sell'); setCurrentPage(1); }}
              style={{
                padding: '12px 32px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === tab
                  ? tab === 'buy' ? colors.trading.buyBg : colors.trading.sellBg
                  : 'transparent',
                color: activeTab === tab
                  ? tab === 'buy' ? colors.trading.buy : colors.trading.sell
                  : colors.text.tertiary,
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {tab === 'buy' ? 'Buy' : 'Sell'}
            </motion.button>
          ))}
        </div>

        {/* Crypto Selector */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['USDT', 'BTC', 'ETH'].map((crypto) => (
            <motion.button
              key={crypto}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setSelectedCrypto(crypto); setCurrentPage(1); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '10px',
                border: `1px solid ${selectedCrypto === crypto ? colors.primary[400] : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                background: selectedCrypto === crypto ? `${colors.primary[400]}15` : 'transparent',
                color: selectedCrypto === crypto ? colors.primary[400] : colors.text.secondary,
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <CryptoIcon symbol={crypto} size={18} />
              {crypto}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Orders List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard padding={isMobile ? 'sm' : 'md'}>
          {/* Table Header */}
          {!isMobile && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1.2fr 1.2fr 1.5fr 1fr 120px',
              padding: '12px 20px',
              borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
              fontSize: '11px',
              fontWeight: 600,
              color: colors.text.tertiary,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              <span>Advertiser</span>
              <span style={{ textAlign: 'right' }}>Price</span>
              <span style={{ textAlign: 'right' }}>Available/Limit</span>
              <span>Payment</span>
              <span style={{ textAlign: 'center' }}>Time</span>
              <span style={{ textAlign: 'center' }}>Trade</span>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div style={{
              padding: '60px 20px',
              textAlign: 'center',
            }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'inline-block', marginBottom: '16px' }}
              >
                <Loader2 size={32} color={colors.primary[400]} />
              </motion.div>
              <p style={{ fontSize: '14px', color: colors.text.tertiary }}>
                Loading orders...
              </p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div style={{
              padding: '60px 20px',
              textAlign: 'center',
            }}>
              <AlertCircle size={48} color={colors.status.error} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary, marginBottom: '8px' }}>
                Failed to load orders
              </h3>
              <p style={{ fontSize: '13px', color: colors.text.tertiary, marginBottom: '16px' }}>
                {error}
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(1)}
                style={{
                  padding: '10px 20px',
                  background: colors.primary[400],
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Try Again
              </motion.button>
            </div>
          )}

          {/* Orders */}
          {!loading && !error && orders.length > 0 && (
            orders.map((order, index) => {
              const display = getOrderDisplay(order);
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * index }}
                  whileHover={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '2fr 1.2fr 1.2fr 1.5fr 1fr 120px',
                    padding: isMobile ? '16px' : '14px 20px',
                    borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
                    alignItems: 'center',
                    gap: isMobile ? '12px' : '0',
                  }}
                >
                  {/* Trader Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${colors.primary[400]}30, ${colors.secondary[400]}30)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      fontSize: '16px',
                      fontWeight: 700,
                      color: colors.primary[400],
                    }}>
                      {display.traderInitial}
                      {display.online && (
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: colors.trading.buy,
                          border: `2px solid ${isDark ? colors.background.primary : '#fff'}`,
                        }} />
                      )}
                    </div>
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '2px',
                      }}>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: colors.text.primary,
                        }}>
                          {display.traderName}
                        </span>
                        {display.verified && (
                          <CheckCircle size={14} color={colors.primary[400]} />
                        )}
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '11px',
                        color: colors.text.tertiary,
                      }}>
                        <span>{display.orders} orders</span>
                        <span>|</span>
                        <span>{display.completion}%</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <Star size={10} color="#fbbf24" fill="#fbbf24" />
                          {display.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
                    {isMobile && <span style={{ fontSize: '10px', color: colors.text.tertiary }}>Price </span>}
                    <span style={{
                      fontSize: '15px',
                      fontWeight: 700,
                      fontFamily: "'JetBrains Mono', monospace",
                      color: colors.text.primary,
                    }}>
                      ${Number(order.price).toLocaleString()}
                    </span>
                  </div>

                  {/* Available */}
                  <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
                    {isMobile && <span style={{ fontSize: '10px', color: colors.text.tertiary }}>Available </span>}
                    <div style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      fontFamily: "'JetBrains Mono', monospace",
                      color: colors.text.secondary,
                    }}>
                      {Number(order.available).toLocaleString()} {order.crypto}
                    </div>
                    <div style={{ fontSize: '10px', color: colors.text.tertiary }}>
                      ${display.limit.min} - ${display.limit.max.toLocaleString()}
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '4px',
                  }}>
                    {order.paymentMethods.map((method: string) => (
                      <div
                        key={method}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 8px',
                          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                          borderRadius: '4px',
                          fontSize: '10px',
                          color: colors.text.secondary,
                        }}
                      >
                        {paymentIcons[method]}
                        {method}
                      </div>
                    ))}
                  </div>

                  {/* Time Limit */}
                  <div style={{ textAlign: 'center' }}>
                    <span style={{
                      fontSize: '12px',
                      color: colors.text.tertiary,
                    }}>
                      {order.timeLimit} min
                    </span>
                  </div>

                  {/* Action Button */}
                  <div style={{ textAlign: 'center' }}>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleStartTrade(order)}
                      style={{
                        padding: '8px 20px',
                        background: activeTab === 'buy'
                          ? colors.trading.buy
                          : colors.trading.sell,
                        border: 'none',
                        borderRadius: '6px',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        width: isMobile ? '100%' : 'auto',
                      }}
                    >
                      {activeTab === 'buy' ? 'Buy' : 'Sell'}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })
          )}

          {/* Empty State */}
          {!loading && !error && orders.length === 0 && (
            <div style={{
              padding: '60px 20px',
              textAlign: 'center',
            }}>
              <Users size={48} color={colors.text.tertiary} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary, marginBottom: '8px' }}>
                No offers available
              </h3>
              <p style={{ fontSize: '13px', color: colors.text.tertiary }}>
                Try selecting a different cryptocurrency
              </p>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              padding: '20px',
              borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
            }}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                  borderRadius: '8px',
                  color: currentPage === 1 ? colors.text.tertiary : colors.text.secondary,
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  opacity: currentPage === 1 ? 0.5 : 1,
                }}
              >
                <ChevronLeft size={16} />
                Previous
              </motion.button>

              <span style={{
                padding: '8px 16px',
                fontSize: '13px',
                color: colors.text.secondary,
              }}>
                Page {currentPage} of {totalPages}
              </span>

              <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                style={{
                  padding: '8px 16px',
                  background: currentPage === totalPages ? 'transparent' : colors.primary[400],
                  border: currentPage === totalPages ? `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` : 'none',
                  borderRadius: '8px',
                  color: currentPage === totalPages ? colors.text.tertiary : (isDark ? '#0b0e11' : '#fff'),
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  opacity: currentPage === totalPages ? 0.5 : 1,
                }}
              >
                Next
                <ChevronRight size={16} />
              </motion.button>
            </div>
          )}
        </GlassCard>
      </motion.div>
        </>
      )}

      {/* My Orders Tab Content */}
      {mainTab === 'my-orders' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard padding={isMobile ? 'sm' : 'md'}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: 700,
                color: colors.text.primary,
              }}>
                My Orders
              </h2>
            </div>

            {myOrdersLoading && (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <Loader2 size={32} color={colors.primary[400]} style={{ animation: 'spin 1s linear infinite' }} />
              </div>
            )}

            {!myOrdersLoading && myOrdersError && (
              <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                <AlertCircle size={48} color={colors.status.error} style={{ opacity: 0.5, marginBottom: '16px' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary, marginBottom: '8px' }}>
                  Unable to load orders
                </h3>
                <p style={{ fontSize: '13px', color: colors.text.tertiary, marginBottom: '20px' }}>
                  {myOrdersError}
                </p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setMyOrdersError(null);
                    setMainTab('market');
                    setTimeout(() => setMainTab('my-orders'), 100);
                  }}
                  style={{
                    padding: '12px 24px',
                    background: colors.primary[400],
                    border: 'none',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Try Again
                </motion.button>
              </div>
            )}

            {!myOrdersLoading && !myOrdersError && myOrders.length === 0 && (
              <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                <FileText size={48} color={colors.text.tertiary} style={{ opacity: 0.3, marginBottom: '16px' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary, marginBottom: '8px' }}>
                  No orders yet
                </h3>
                <p style={{ fontSize: '13px', color: colors.text.tertiary, marginBottom: '20px' }}>
                  Create your first P2P order to start trading
                </p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePostAd}
                  style={{
                    padding: '12px 24px',
                    background: colors.primary[400],
                    border: 'none',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Create Order
                </motion.button>
              </div>
            )}

            {!myOrdersLoading && !myOrdersError && myOrders.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {myOrders.map((order: any) => (
                  <div
                    key={order.id}
                    style={{
                      padding: '16px',
                      background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                      borderRadius: '12px',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          background: order.type === 'buy' ? colors.trading.buyBg : colors.trading.sellBg,
                          color: order.type === 'buy' ? colors.trading.buy : colors.trading.sell,
                        }}>
                          {order.type}
                        </span>
                        <span style={{
                          marginLeft: '8px',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          background: order.status === 'active' ? `${colors.status.success}20` : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                          color: order.status === 'active' ? colors.status.success : colors.text.tertiary,
                        }}>
                          {order.status}
                        </span>
                      </div>
                      {order.status === 'active' && (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCancelOrder(order.id)}
                          style={{
                            padding: '6px 12px',
                            background: `${colors.status.error}20`,
                            border: 'none',
                            borderRadius: '6px',
                            color: colors.status.error,
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Trash2 size={12} />
                          Cancel
                        </motion.button>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '12px' }}>
                      <div>
                        <p style={{ fontSize: '11px', color: colors.text.tertiary, marginBottom: '4px' }}>Crypto</p>
                        <p style={{ fontSize: '15px', fontWeight: 600, color: colors.text.primary }}>{order.crypto}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: colors.text.tertiary, marginBottom: '4px' }}>Price</p>
                        <p style={{ fontSize: '15px', fontWeight: 600, color: colors.text.primary }}>${parseFloat(order.price).toFixed(2)}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: colors.text.tertiary, marginBottom: '4px' }}>Available</p>
                        <p style={{ fontSize: '15px', fontWeight: 600, color: colors.text.primary }}>
                          {parseFloat(order.available).toFixed(4)} / {parseFloat(order.total_amount).toFixed(4)}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: colors.text.tertiary, marginBottom: '4px' }}>Created</p>
                        <p style={{ fontSize: '13px', color: colors.text.secondary }}>
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>
      )}

      {/* My Trades Tab Content */}
      {mainTab === 'my-trades' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard padding={isMobile ? 'sm' : 'md'}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: 700,
                color: colors.text.primary,
              }}>
                My Trades
              </h2>
            </div>

            {myTradesLoading && (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <Loader2 size={32} color={colors.primary[400]} style={{ animation: 'spin 1s linear infinite' }} />
              </div>
            )}

            {!myTradesLoading && myTradesError && (
              <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                <AlertCircle size={48} color={colors.status.error} style={{ opacity: 0.5, marginBottom: '16px' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary, marginBottom: '8px' }}>
                  Unable to load trades
                </h3>
                <p style={{ fontSize: '13px', color: colors.text.tertiary, marginBottom: '20px' }}>
                  {myTradesError}
                </p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setMyTradesError(null);
                    setMainTab('market');
                    setTimeout(() => setMainTab('my-trades'), 100);
                  }}
                  style={{
                    padding: '12px 24px',
                    background: colors.primary[400],
                    border: 'none',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Try Again
                </motion.button>
              </div>
            )}

            {!myTradesLoading && !myTradesError && myTrades.length === 0 && (
              <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                <MessageCircle size={48} color={colors.text.tertiary} style={{ opacity: 0.3, marginBottom: '16px' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary, marginBottom: '8px' }}>
                  No trades yet
                </h3>
                <p style={{ fontSize: '13px', color: colors.text.tertiary, marginBottom: '20px' }}>
                  Start trading by browsing the market
                </p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMainTab('market')}
                  style={{
                    padding: '12px 24px',
                    background: colors.primary[400],
                    border: 'none',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Browse Market
                </motion.button>
              </div>
            )}

            {!myTradesLoading && !myTradesError && myTrades.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {myTrades.map((trade: any) => (
                  <motion.div
                    key={trade.id}
                    whileHover={{ scale: 1.005 }}
                    onClick={() => handleViewTrade(trade)}
                    style={{
                      padding: '16px',
                      background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                      borderRadius: '12px',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          background: trade.isBuyer ? colors.trading.buyBg : colors.trading.sellBg,
                          color: trade.isBuyer ? colors.trading.buy : colors.trading.sell,
                        }}>
                          {trade.isBuyer ? 'Buying' : 'Selling'}
                        </span>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          background:
                            trade.status === 'completed' ? `${colors.status.success}20` :
                            trade.status === 'cancelled' ? `${colors.status.error}20` :
                            trade.status === 'disputed' ? `${colors.status.warning}20` :
                            `${colors.primary[400]}20`,
                          color:
                            trade.status === 'completed' ? colors.status.success :
                            trade.status === 'cancelled' ? colors.status.error :
                            trade.status === 'disputed' ? colors.status.warning :
                            colors.primary[400],
                        }}>
                          {trade.status.replace('_', ' ')}
                        </span>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.stopPropagation(); handleViewTrade(trade); }}
                        style={{
                          padding: '6px 12px',
                          background: `${colors.primary[400]}20`,
                          border: 'none',
                          borderRadius: '6px',
                          color: colors.primary[400],
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Eye size={12} />
                        View
                      </motion.button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '12px' }}>
                      <div>
                        <p style={{ fontSize: '11px', color: colors.text.tertiary, marginBottom: '4px' }}>Crypto</p>
                        <p style={{ fontSize: '15px', fontWeight: 600, color: colors.text.primary }}>
                          {trade.crypto || trade.cryptoAmount?.split(' ')[1] || 'USDT'}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: colors.text.tertiary, marginBottom: '4px' }}>Amount</p>
                        <p style={{ fontSize: '15px', fontWeight: 600, color: colors.text.primary }}>
                          {parseFloat(trade.cryptoAmount || trade.amount || '0').toFixed(4)}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: colors.text.tertiary, marginBottom: '4px' }}>Total</p>
                        <p style={{ fontSize: '15px', fontWeight: 600, color: colors.text.primary }}>
                          ${parseFloat(trade.fiatAmount || trade.total || '0').toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: colors.text.tertiary, marginBottom: '4px' }}>Date</p>
                        <p style={{ fontSize: '13px', color: colors.text.secondary }}>
                          {new Date(trade.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>
      )}

      {/* Trade Modal */}
      <AnimatePresence>
        {showTradeModal && selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={resetTrade}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                zIndex: 9998,
              }}
            />

            {/* Modal Container - Centered using Flexbox */}
            <div
              style={{
                position: 'fixed',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                padding: '20px',
                pointerEvents: 'none',
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                  duration: 0.4
                }}
                style={{
                  width: '100%',
                  maxWidth: '440px',
                  maxHeight: 'calc(100vh - 40px)',
                  overflowY: 'auto',
                  background: isDark
                    ? 'linear-gradient(145deg, rgba(25, 28, 32, 0.98) 0%, rgba(15, 18, 22, 0.98) 100%)'
                    : 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 252, 252, 0.98) 100%)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  borderRadius: '24px',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,100,100,0.15)'}`,
                  boxShadow: isDark
                    ? '0 30px 100px rgba(0,0,0,0.7), 0 0 40px rgba(0,255,136,0.1)'
                    : '0 30px 100px rgba(0,80,80,0.25), 0 0 40px rgba(0,150,150,0.1)',
                  padding: '28px',
                  pointerEvents: 'auto',
                  position: 'relative',
                }}
              >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetTrade}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.text.tertiary,
                }}
              >
                <X size={18} />
              </motion.button>

              {/* Step 1: Enter Amount */}
              {tradeStep === 1 && (
                <div>
                  <h2 style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: colors.text.primary,
                    marginBottom: '6px',
                  }}>
                    {activeTab === 'buy' ? 'Buy' : 'Sell'} {selectedOrder.crypto}
                  </h2>
                  <p style={{ fontSize: '13px', color: colors.text.tertiary, marginBottom: '20px' }}>
                    from {selectedOrder.trader?.name || 'Merchant'}
                  </p>

                  {/* Error Message */}
                  {tradeError && (
                    <div style={{
                      padding: '12px',
                      background: `${colors.status.error}15`,
                      borderRadius: '10px',
                      border: `1px solid ${colors.status.error}30`,
                      marginBottom: '16px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: colors.status.error }}>
                        <AlertCircle size={16} />
                        <span style={{ fontSize: '13px' }}>{tradeError}</span>
                      </div>
                    </div>
                  )}

                  {/* Trader Info */}
                  <div style={{
                    padding: '14px',
                    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${colors.primary[400]}30, ${colors.secondary[400]}30)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 700,
                        color: colors.primary[400],
                      }}>
                        {(selectedOrder.trader?.name || 'A')[0]}
                      </div>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: colors.text.primary }}>
                          {selectedOrder.trader?.name || 'Merchant'}
                        </p>
                        <p style={{ fontSize: '11px', color: colors.text.tertiary }}>
                          {selectedOrder.trader?.completionRate?.toFixed(1) || '0'}% • <Star size={9} color="#fbbf24" fill="#fbbf24" /> {selectedOrder.trader?.rating?.toFixed(1) || '0'}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{
                        fontSize: '15px',
                        fontWeight: 700,
                        fontFamily: "'JetBrains Mono', monospace",
                        color: colors.text.primary,
                      }}>
                        ${selectedOrder.price}
                      </p>
                      <p style={{ fontSize: '10px', color: colors.text.tertiary }}>per {selectedOrder.crypto}</p>
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      fontSize: '12px',
                      fontWeight: 500,
                      color: colors.text.secondary,
                      marginBottom: '6px',
                      display: 'block',
                    }}>
                      I want to pay ({selectedOrder.fiat})
                    </label>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px',
                      background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      borderRadius: '12px',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                    }}>
                      <span style={{
                        padding: '10px 14px',
                        fontSize: '16px',
                        fontWeight: 600,
                        color: colors.text.secondary,
                      }}>
                        $
                      </span>
                      <input
                        type="number"
                        value={tradeAmount}
                        onChange={(e) => setTradeAmount(e.target.value)}
                        placeholder={`${parseFloat(selectedOrder.minLimit)} - ${parseFloat(selectedOrder.maxLimit).toLocaleString()}`}
                        style={{
                          flex: 1,
                          padding: '12px 0',
                          background: 'transparent',
                          border: 'none',
                          outline: 'none',
                          fontSize: '16px',
                          fontWeight: 600,
                          fontFamily: "'JetBrains Mono', monospace",
                          color: colors.text.primary,
                        }}
                      />
                    </div>
                    <p style={{ fontSize: '11px', color: colors.text.tertiary, marginTop: '6px' }}>
                      You will receive: <strong style={{ color: colors.primary[400] }}>
                        {tradeAmount ? (parseFloat(tradeAmount) / parseFloat(selectedOrder.price)).toFixed(4) : '0'} {selectedOrder.crypto}
                      </strong>
                    </p>
                  </div>

                  {/* Payment Methods */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      fontSize: '12px',
                      fontWeight: 500,
                      color: colors.text.secondary,
                      marginBottom: '6px',
                      display: 'block',
                    }}>
                      Payment Method
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {selectedOrder.paymentMethods.map((method: string, i: number) => (
                        <motion.button
                          key={method}
                          whileTap={{ scale: 0.95 }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            border: `1px solid ${i === 0 ? colors.primary[400] : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                            background: i === 0 ? `${colors.primary[400]}15` : 'transparent',
                            color: i === 0 ? colors.primary[400] : colors.text.secondary,
                            fontSize: '12px',
                            fontWeight: 500,
                            cursor: 'pointer',
                          }}
                        >
                          {paymentIcons[method]}
                          {method}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConfirmTrade}
                    disabled={!tradeAmount || parseFloat(tradeAmount) < parseFloat(selectedOrder.minLimit) || tradeLoading}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: !tradeAmount || parseFloat(tradeAmount) < parseFloat(selectedOrder.minLimit) || tradeLoading
                        ? isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                        : colors.gradients.primarySolid,
                      border: 'none',
                      borderRadius: '12px',
                      color: !tradeAmount || parseFloat(tradeAmount) < parseFloat(selectedOrder.minLimit) || tradeLoading
                        ? colors.text.tertiary
                        : (isDark ? '#0b0e11' : '#fff'),
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: !tradeAmount || parseFloat(tradeAmount) < parseFloat(selectedOrder.minLimit) || tradeLoading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    {tradeLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Loader2 size={16} />
                        </motion.div>
                        Processing...
                      </>
                    ) : (
                      <>
                        {activeTab === 'buy' ? 'Buy' : 'Sell'} {selectedOrder.crypto}
                        <ArrowRight size={16} />
                      </>
                    )}
                  </motion.button>
                </div>
              )}

              {/* Step 2: Processing */}
              {tradeStep === 2 && (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      border: `3px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                      borderTopColor: colors.primary[400],
                      margin: '0 auto 20px',
                    }}
                  />
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.text.primary, marginBottom: '6px' }}>
                    Processing Order
                  </h2>
                  <p style={{ fontSize: '13px', color: colors.text.tertiary }}>
                    Waiting for seller confirmation...
                  </p>
                </div>
              )}

              {/* Step 3: Payment */}
              {tradeStep === 3 && (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: `${colors.primary[400]}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                    }}
                  >
                    <CreditCard size={28} color={colors.primary[400]} />
                  </motion.div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.text.primary, marginBottom: '6px' }}>
                    Complete Payment
                  </h2>
                  <p style={{ fontSize: '13px', color: colors.text.tertiary, marginBottom: '20px' }}>
                    Transfer ${tradeAmount} to the seller
                  </p>

                  {tradeError && (
                    <div style={{
                      padding: '12px',
                      background: `${colors.status.error}15`,
                      borderRadius: '10px',
                      border: `1px solid ${colors.status.error}30`,
                      marginBottom: '20px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: colors.status.error, justifyContent: 'center' }}>
                        <AlertCircle size={14} />
                        <span style={{ fontSize: '12px' }}>{tradeError}</span>
                      </div>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConfirmPayment}
                    disabled={tradeLoading}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: tradeLoading ? isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' : colors.gradients.primarySolid,
                      border: 'none',
                      borderRadius: '12px',
                      color: tradeLoading ? colors.text.tertiary : (isDark ? '#0b0e11' : '#fff'),
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: tradeLoading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    {tradeLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Loader2 size={16} />
                        </motion.div>
                        Confirming...
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        I've Paid
                      </>
                    )}
                  </motion.button>
                </div>
              )}

              {/* Step 4: Waiting for Release */}
              {tradeStep === 4 && (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      border: `3px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                      borderTopColor: colors.primary[400],
                      margin: '0 auto 20px',
                    }}
                  />
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.text.primary, marginBottom: '6px' }}>
                    Waiting for Release
                  </h2>
                  <p style={{ fontSize: '13px', color: colors.text.tertiary }}>
                    The seller is verifying your payment...
                  </p>
                </div>
              )}

              {/* Step 5: Complete */}
              {tradeStep === 5 && (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      background: colors.gradients.primarySolid,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      boxShadow: `0 0 30px ${colors.primary[400]}50`,
                    }}
                  >
                    <Check size={36} color={isDark ? '#0b0e11' : '#fff'} />
                  </motion.div>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: colors.text.primary, marginBottom: '6px' }}>
                    Trade Complete!
                  </h2>
                  <p style={{ fontSize: '13px', color: colors.text.tertiary, marginBottom: '20px' }}>
                    <strong style={{ color: colors.primary[400] }}>
                      {activeTrade?.cryptoAmount || (parseFloat(tradeAmount) / parseFloat(selectedOrder.price)).toFixed(4)} {selectedOrder.crypto}
                    </strong> added to your wallet
                  </p>

                  <div style={{
                    padding: '16px',
                    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    textAlign: 'left',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontSize: '12px', color: colors.text.tertiary }}>Paid</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text.primary }}>
                        ${tradeAmount} USD
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontSize: '12px', color: colors.text.tertiary }}>Received</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: colors.primary[400] }}>
                        {activeTrade?.cryptoAmount || (parseFloat(tradeAmount) / parseFloat(selectedOrder.price)).toFixed(4)} {selectedOrder.crypto}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', color: colors.text.tertiary }}>Seller</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text.primary }}>
                        {selectedOrder.trader?.name || 'Merchant'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={resetTrade}
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                        borderRadius: '10px',
                        color: colors.text.secondary,
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <RefreshCw size={14} />
                      New Trade
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleRateTrade(5)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: colors.gradients.primarySolid,
                        border: 'none',
                        borderRadius: '10px',
                        color: isDark ? '#0b0e11' : '#fff',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <ThumbsUp size={14} />
                      Rate Seller
                    </motion.button>
                  </div>
                </div>
              )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Post Ad Modal */}
      <PostAdModal
        isOpen={showPostAdModal}
        onClose={() => setShowPostAdModal(false)}
        onSuccess={() => {
          setMainTab('my-orders');
          // Refresh my orders
          p2pService.getMyOrders().then(res => setMyOrders(res.orders || []));
        }}
      />

      {/* Trade Detail Modal with Chat */}
      <TradeDetailModal
        isOpen={showTradeDetailModal}
        trade={selectedTrade}
        onClose={() => {
          setShowTradeDetailModal(false);
          setSelectedTrade(null);
        }}
        onTradeUpdate={(updatedTrade) => {
          // Refresh my trades list
          p2pService.getMyTrades().then(res => setMyTrades(res.trades || []));
        }}
      />
    </ResponsiveLayout>
  );
};

export default P2PScreen;
