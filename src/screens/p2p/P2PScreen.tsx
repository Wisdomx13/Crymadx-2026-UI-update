import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
} from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { GlassCard, CryptoIcon, ResponsiveLayout } from '../../components';
import { usePresentationMode } from '../../components/PresentationMode';
import { LiquidGlassBackground, LiquidOrb } from '../../components/Glass3D';

// Generate realistic trader names
const traderNames = [
  'Michael_Trading', 'Sarah_Crypto', 'CryptoKing_99', 'David_Exchange', 'Emily_Trades',
  'James_P2P', 'Sophia_BTC', 'William_Dealer', 'Olivia_Markets', 'Benjamin_Swap',
  'Emma_Exchange', 'Alexander_Coin', 'Ava_Trading', 'Daniel_Crypto', 'Mia_Merchant',
  'Matthew_Trades', 'Isabella_P2P', 'Joseph_Dealer', 'Charlotte_FX', 'Andrew_Markets',
  'Lucas_Swap', 'Amelia_BTC', 'Ethan_Exchange', 'Harper_Crypto', 'Henry_Trading',
];

// Mock P2P orders data with 25 vendors
const generateOrders = () => {
  const orders: any[] = [];
  const cryptos = ['USDT', 'BTC', 'ETH'];
  const paymentMethodsOptions = [
    ['Bank Transfer', 'PayPal'],
    ['Bank Transfer', 'Wise'],
    ['Zelle', 'Venmo'],
    ['Bank Transfer', 'Cash App'],
    ['PayPal', 'Wise'],
    ['Bank Transfer'],
    ['Wise', 'Revolut'],
  ];

  traderNames.forEach((name, i) => {
    const isBuy = i % 2 === 0;
    const crypto = cryptos[i % 3];
    let basePrice = crypto === 'USDT' ? 1 : crypto === 'BTC' ? 88345 : 2987;
    const priceVariation = isBuy ? 0.002 + (Math.random() * 0.005) : -0.002 - (Math.random() * 0.003);
    const price = basePrice * (1 + priceVariation);

    orders.push({
      id: i + 1,
      type: isBuy ? 'buy' : 'sell',
      trader: name,
      verified: Math.random() > 0.15,
      orders: Math.floor(100 + Math.random() * 3000),
      completion: (95 + Math.random() * 5).toFixed(1),
      rating: (4.5 + Math.random() * 0.5).toFixed(1),
      crypto,
      fiat: 'USD',
      price: crypto === 'USDT' ? price.toFixed(3) : price.toFixed(2),
      available: crypto === 'USDT'
        ? Math.floor(5000 + Math.random() * 95000)
        : crypto === 'BTC'
        ? (0.5 + Math.random() * 4.5).toFixed(4)
        : (5 + Math.random() * 45).toFixed(2),
      limit: {
        min: Math.floor(50 + Math.random() * 150),
        max: Math.floor(5000 + Math.random() * 45000)
      },
      paymentMethods: paymentMethodsOptions[i % paymentMethodsOptions.length],
      timeLimit: [10, 15, 20, 30][Math.floor(Math.random() * 4)],
      online: Math.random() > 0.2,
    });
  });

  return orders;
};

const p2pOrders = generateOrders();

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

export const P2PScreen: React.FC = () => {
  const { isMobile } = usePresentationMode();
  const { colors, isDark } = useThemeMode();

  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [selectedCrypto, setSelectedCrypto] = useState('USDT');
  const [selectedOrder, setSelectedOrder] = useState<typeof p2pOrders[0] | null>(null);
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeStep, setTradeStep] = useState(0);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const filteredOrders = p2pOrders.filter(
    order => order.type === activeTab && order.crypto === selectedCrypto
  );

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const handleStartTrade = (order: typeof p2pOrders[0]) => {
    setSelectedOrder(order);
    setShowTradeModal(true);
    setTradeStep(1);
  };

  const simulateTrade = () => {
    setTradeStep(2);
    setTimeout(() => setTradeStep(3), 2000);
    setTimeout(() => setTradeStep(4), 4000);
  };

  const resetTrade = () => {
    setShowTradeModal(false);
    setSelectedOrder(null);
    setTradeAmount('');
    setTradeStep(0);
  };

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

      {/* Stats Banner */}
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
            { label: 'Active Merchants', value: '2,500+', icon: <Users size={18} /> },
            { label: 'Avg. Release Time', value: '< 5 min', icon: <Clock size={18} /> },
            { label: 'Completion Rate', value: '99.2%', icon: <CheckCircle size={18} /> },
            { label: 'Escrow Protected', value: '100%', icon: <Shield size={18} /> },
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
              <p style={{ fontSize: '18px', fontWeight: 700, color: colors.text.primary }}>{stat.value}</p>
              <p style={{ fontSize: '11px', color: colors.text.tertiary }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

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

          {/* Orders */}
          {paginatedOrders.length > 0 ? (
            paginatedOrders.map((order, index) => (
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
                    {order.trader[0]}
                    {order.online && (
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
                        {order.trader}
                      </span>
                      {order.verified && (
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
                      <span>{order.orders} orders</span>
                      <span>|</span>
                      <span>{order.completion}%</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <Star size={10} color="#fbbf24" fill="#fbbf24" />
                        {order.rating}
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
                    ${order.limit.min} - ${order.limit.max.toLocaleString()}
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
            ))
          ) : (
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
          {totalPages > 1 && (
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
                    from {selectedOrder.trader}
                  </p>

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
                        {selectedOrder.trader[0]}
                      </div>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: colors.text.primary }}>
                          {selectedOrder.trader}
                        </p>
                        <p style={{ fontSize: '11px', color: colors.text.tertiary }}>
                          {selectedOrder.completion}% • <Star size={9} color="#fbbf24" fill="#fbbf24" /> {selectedOrder.rating}
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
                        placeholder={`${selectedOrder.limit.min} - ${selectedOrder.limit.max.toLocaleString()}`}
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
                    onClick={simulateTrade}
                    disabled={!tradeAmount || parseFloat(tradeAmount) < selectedOrder.limit.min}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: !tradeAmount || parseFloat(tradeAmount) < selectedOrder.limit.min
                        ? isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                        : colors.gradients.primarySolid,
                      border: 'none',
                      borderRadius: '12px',
                      color: !tradeAmount || parseFloat(tradeAmount) < selectedOrder.limit.min
                        ? colors.text.tertiary
                        : (isDark ? '#0b0e11' : '#fff'),
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: !tradeAmount || parseFloat(tradeAmount) < selectedOrder.limit.min ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    {activeTab === 'buy' ? 'Buy' : 'Sell'} {selectedOrder.crypto}
                    <ArrowRight size={16} />
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

                  <div style={{
                    padding: '12px',
                    background: `${colors.status.warning}10`,
                    borderRadius: '10px',
                    border: `1px solid ${colors.status.warning}30`,
                    marginBottom: '20px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: colors.status.warning, justifyContent: 'center' }}>
                      <AlertCircle size={14} />
                      <span style={{ fontSize: '12px', fontWeight: 500 }}>Demo Mode - Simulated Trade</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTradeStep(4)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: colors.gradients.primarySolid,
                      border: 'none',
                      borderRadius: '12px',
                      color: isDark ? '#0b0e11' : '#fff',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <Check size={16} />
                    I've Paid
                  </motion.button>
                </div>
              )}

              {/* Step 4: Complete */}
              {tradeStep === 4 && (
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
                      {(parseFloat(tradeAmount) / parseFloat(selectedOrder.price)).toFixed(4)} {selectedOrder.crypto}
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
                        {(parseFloat(tradeAmount) / parseFloat(selectedOrder.price)).toFixed(4)} {selectedOrder.crypto}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', color: colors.text.tertiary }}>Seller</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text.primary }}>
                        {selectedOrder.trader}
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
                      onClick={resetTrade}
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
    </ResponsiveLayout>
  );
};

export default P2PScreen;
