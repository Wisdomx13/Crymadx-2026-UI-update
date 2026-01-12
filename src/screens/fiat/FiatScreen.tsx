import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Building2,
  ArrowRight,
  ArrowLeftRight,
  X,
  Check,
  ChevronDown,
  Shield,
  Clock,
  Zap,
  Globe,
  AlertCircle,
  Wallet,
  ExternalLink,
  Star,
  TrendingUp,
  DollarSign,
  History,
  ChevronRight,
  BadgeCheck,
  CopyCheck,
  Info,
} from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { usePresentationMode } from '../../components/PresentationMode';
import { TopHeader } from '../../components/TopHeader';
import { Sidebar } from '../../components/Sidebar';
import { Footer } from '../../components/Footer';
import { GlassCard } from '../../components/GlassCard';
import { ResponsiveLayout } from '../../components/ResponsiveLayout';
import { CryptoIcon } from '../../components/CryptoIcon';
import { LiquidGlassBackground, LiquidOrb } from '../../components/Glass3D';

interface OnRampProvider {
  id: string;
  name: string;
  logo: string;
  description: string;
  fee: string;
  minAmount: number;
  maxAmount: number;
  processingTime: string;
  paymentMethods: string[];
  supported: string[];
  rating: number;
  kycRequired: boolean;
  popular?: boolean;
}

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

interface Crypto {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
}

interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  crypto: string;
  amount: number;
  fiatAmount: number;
  currency: string;
  provider: string;
  status: 'completed' | 'pending' | 'processing';
  date: string;
}

// Third-party on-ramp providers
const providers: OnRampProvider[] = [
  {
    id: 'transak',
    name: 'Transak',
    logo: 'https://assets.transak.com/images/website/transak-logo-blue.svg',
    description: 'Global fiat on-ramp with 100+ payment methods',
    fee: '1.5% - 3.5%',
    minAmount: 30,
    maxAmount: 50000,
    processingTime: '5-30 mins',
    paymentMethods: ['Card', 'Bank Transfer', 'Apple Pay', 'Google Pay'],
    supported: ['BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'SOL', 'MATIC'],
    rating: 4.8,
    kycRequired: true,
    popular: true,
  },
  {
    id: 'moonpay',
    name: 'MoonPay',
    logo: 'https://www.moonpay.com/assets/logo-full-white.svg',
    description: 'Trusted by 20M+ users worldwide',
    fee: '1.5% - 4.5%',
    minAmount: 20,
    maxAmount: 100000,
    processingTime: 'Instant - 30 mins',
    paymentMethods: ['Card', 'Bank Transfer', 'Apple Pay', 'Google Pay', 'Samsung Pay'],
    supported: ['BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'SOL', 'DOGE', 'ADA'],
    rating: 4.7,
    kycRequired: true,
  },
  {
    id: 'simplex',
    name: 'Simplex',
    logo: 'https://www.simplex.com/wp-content/themes/flavor/images/simplex-logo.svg',
    description: 'EU licensed fiat-to-crypto gateway',
    fee: '3.5% - 5%',
    minAmount: 50,
    maxAmount: 20000,
    processingTime: '10-30 mins',
    paymentMethods: ['Card', 'Apple Pay', 'SEPA'],
    supported: ['BTC', 'ETH', 'USDT', 'BNB', 'XRP', 'LTC'],
    rating: 4.5,
    kycRequired: true,
  },
  {
    id: 'banxa',
    name: 'Banxa',
    logo: 'https://banxa.com/wp-content/uploads/2021/01/banxa-logo.svg',
    description: 'Australian regulated payment provider',
    fee: '2% - 3%',
    minAmount: 25,
    maxAmount: 15000,
    processingTime: '5-60 mins',
    paymentMethods: ['Card', 'Bank Transfer', 'POLi', 'iDEAL'],
    supported: ['BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'AVAX'],
    rating: 4.6,
    kycRequired: true,
  },
];

const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: 'us' },
  { code: 'EUR', name: 'Euro', symbol: '\u20AC', flag: 'eu' },
  { code: 'GBP', name: 'British Pound', symbol: '\u00A3', flag: 'gb' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '\u20A6', flag: 'ng' },
  { code: 'INR', name: 'Indian Rupee', symbol: '\u20B9', flag: 'in' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: 'au' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: 'ca' },
];

const cryptos: Crypto[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 43250.00, change24h: 2.45 },
  { symbol: 'ETH', name: 'Ethereum', price: 2280.50, change24h: 1.82 },
  { symbol: 'USDT', name: 'Tether', price: 1.00, change24h: 0.01 },
  { symbol: 'USDC', name: 'USD Coin', price: 1.00, change24h: 0.00 },
  { symbol: 'BNB', name: 'BNB', price: 312.80, change24h: 3.21 },
  { symbol: 'SOL', name: 'Solana', price: 98.45, change24h: 5.67 },
  { symbol: 'XRP', name: 'XRP', price: 0.62, change24h: -1.23 },
  { symbol: 'ADA', name: 'Cardano', price: 0.58, change24h: 2.11 },
];

// Sample wallet balances (integrated with exchange wallet)
const walletBalances: Record<string, number> = {
  BTC: 0.0234,
  ETH: 1.456,
  USDT: 5420.50,
  USDC: 2150.00,
  BNB: 3.21,
  SOL: 12.5,
};

// Sample transaction history
const recentTransactions: Transaction[] = [
  { id: '1', type: 'buy', crypto: 'BTC', amount: 0.025, fiatAmount: 1000, currency: 'USD', provider: 'Transak', status: 'completed', date: '2024-01-15' },
  { id: '2', type: 'buy', crypto: 'ETH', amount: 0.85, fiatAmount: 2000, currency: 'USD', provider: 'MoonPay', status: 'completed', date: '2024-01-14' },
  { id: '3', type: 'sell', crypto: 'USDT', amount: 500, fiatAmount: 498.50, currency: 'USD', provider: 'Transak', status: 'processing', date: '2024-01-13' },
  { id: '4', type: 'buy', crypto: 'SOL', amount: 5.2, fiatAmount: 500, currency: 'EUR', provider: 'Simplex', status: 'completed', date: '2024-01-12' },
];

export const FiatScreen: React.FC = () => {
  const { colors, isDark } = useThemeMode();
  const { isMobile } = usePresentationMode();
  const [activeTab, setActiveTab] = useState<'buy' | 'sell' | 'history'>('buy');
  const [selectedProvider, setSelectedProvider] = useState<OnRampProvider>(providers[0]);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto>(cryptos[0]);
  const [fiatAmount, setFiatAmount] = useState('500');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showCryptoDropdown, setShowCryptoDropdown] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);

  // Styling
  const bgColor = isDark ? '#0b0e11' : '#ffffff';
  const textPrimary = isDark ? '#ffffff' : '#000000';
  const textSecondary = isDark ? '#848e9c' : '#6b7280';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : '#000000';
  const accentColor = colors.primary[400];

  const cryptoAmount = parseFloat(fiatAmount) / selectedCrypto.price;

  const handleProceed = () => {
    setCheckoutStep(1);
    setShowCheckoutModal(true);
  };

  const totalPurchased = Object.entries(walletBalances).reduce((acc, [symbol, amount]) => {
    const crypto = cryptos.find(c => c.symbol === symbol);
    return acc + (crypto ? amount * crypto.price : 0);
  }, 0);

  const modalOverlay = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    padding: '20px',
    backdropFilter: 'blur(10px)',
  };

  const modalContent = {
    background: isDark ? 'linear-gradient(145deg, #1e2329, #16181c)' : '#ffffff',
    borderRadius: '24px',
    border: `1px solid ${borderColor}`,
    width: '100%',
    maxWidth: '520px',
    maxHeight: '90vh',
    overflow: 'auto',
  };

  return (
    <ResponsiveLayout>
      <>
        {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: 700, color: textPrimary, marginBottom: '4px' }}>
              Fiat On-Ramp
            </h1>
            <p style={{ fontSize: '14px', color: textSecondary }}>
              Buy crypto instantly with fiat via trusted third-party providers
            </p>
          </div>

          {/* Portfolio Summary Card */}
          <GlassCard style={{ marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
            <LiquidGlassBackground intensity="medium" />
            <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: '20px' }}>
              {/* Total Value */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <DollarSign size={16} color={textSecondary} />
                  <span style={{ fontSize: '13px', color: textSecondary }}>Total Purchased</span>
                </div>
                <p style={{ fontSize: '24px', fontWeight: 700, color: textPrimary }}>
                  ${totalPurchased.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              {/* Wallet Balance */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Wallet size={16} color={textSecondary} />
                  <span style={{ fontSize: '13px', color: textSecondary }}>USDT Balance</span>
                </div>
                <p style={{ fontSize: '24px', fontWeight: 700, color: textPrimary }}>
                  ${walletBalances.USDT.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>

              {/* Transactions */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <History size={16} color={textSecondary} />
                  <span style={{ fontSize: '13px', color: textSecondary }}>Transactions</span>
                </div>
                <p style={{ fontSize: '24px', fontWeight: 700, color: textPrimary }}>
                  {recentTransactions.length}
                </p>
              </div>

              {/* Provider */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <BadgeCheck size={16} color={textSecondary} />
                  <span style={{ fontSize: '13px', color: textSecondary }}>Preferred Provider</span>
                </div>
                <p style={{ fontSize: '24px', fontWeight: 700, color: accentColor }}>
                  {selectedProvider.name}
                </p>
              </div>
            </div>
            <LiquidOrb size={150} color="cyan" />
          </GlassCard>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            gap: '4px',
            padding: '4px',
            background: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6',
            borderRadius: '12px',
            marginBottom: '24px',
            maxWidth: isMobile ? '100%' : '400px',
          }}>
            {[
              { id: 'buy', label: 'Buy Crypto', icon: <TrendingUp size={16} /> },
              { id: 'sell', label: 'Sell Crypto', icon: <DollarSign size={16} /> },
              { id: 'history', label: 'History', icon: <History size={16} /> },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: activeTab === tab.id
                    ? (isDark ? accentColor : '#000000')
                    : 'transparent',
                  border: 'none',
                  borderRadius: '10px',
                  color: activeTab === tab.id
                    ? (isDark ? '#000' : '#fff')
                    : textSecondary,
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                {tab.icon}
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Buy/Sell Content */}
          {(activeTab === 'buy' || activeTab === 'sell') && (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 380px', gap: '24px' }}>
              {/* Left - Main Form */}
              <GlassCard>
                <LiquidGlassBackground intensity="low" />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  {/* Provider Selection */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: textPrimary, marginBottom: '12px' }}>
                      Payment Provider
                    </label>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setShowProviderModal(true)}
                      style={{
                        width: '100%',
                        padding: '16px',
                        background: isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb',
                        border: `1px solid ${borderColor}`,
                        borderRadius: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: isDark ? 'rgba(255,255,255,0.1)' : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `1px solid ${borderColor}`,
                      }}>
                        <Globe size={24} color={accentColor} />
                      </div>
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px', fontWeight: 700, color: textPrimary }}>{selectedProvider.name}</span>
                          {selectedProvider.popular && (
                            <span style={{
                              padding: '2px 8px',
                              background: `${accentColor}20`,
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: 700,
                              color: accentColor,
                            }}>
                              POPULAR
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '12px', color: textSecondary }}>Fee: {selectedProvider.fee} | {selectedProvider.processingTime}</span>
                      </div>
                      <ChevronRight size={20} color={textSecondary} />
                    </motion.button>
                  </div>

                  {/* Amount Input */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: textPrimary, marginBottom: '10px' }}>
                      {activeTab === 'buy' ? 'You Pay' : 'You Sell'}
                    </label>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px',
                      background: isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb',
                      borderRadius: '14px',
                      border: `1px solid ${borderColor}`,
                    }}>
                      <input
                        type="number"
                        value={fiatAmount}
                        onChange={(e) => setFiatAmount(e.target.value)}
                        style={{
                          flex: 1,
                          background: 'transparent',
                          border: 'none',
                          color: textPrimary,
                          fontSize: '24px',
                          fontWeight: 700,
                          outline: 'none',
                        }}
                        placeholder="0.00"
                      />
                      <div style={{ position: 'relative' }}>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            background: isDark ? 'rgba(255,255,255,0.1)' : '#ffffff',
                            border: `1px solid ${borderColor}`,
                            borderRadius: '10px',
                            color: textPrimary,
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          <img
                            src={`https://flagcdn.com/24x18/${selectedCurrency.flag}.png`}
                            alt={selectedCurrency.code}
                            style={{ width: '20px', height: '15px', borderRadius: '2px' }}
                          />
                          {selectedCurrency.code}
                          <ChevronDown size={16} />
                        </motion.button>

                        <AnimatePresence>
                          {showCurrencyDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: '8px',
                                background: isDark ? '#1e2329' : '#ffffff',
                                border: `1px solid ${borderColor}`,
                                borderRadius: '12px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                                zIndex: 100,
                                minWidth: '200px',
                                overflow: 'hidden',
                              }}
                            >
                              {currencies.map((currency) => (
                                <motion.button
                                  key={currency.code}
                                  whileHover={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6' }}
                                  onClick={() => { setSelectedCurrency(currency); setShowCurrencyDropdown(false); }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    width: '100%',
                                    padding: '12px 16px',
                                    background: 'transparent',
                                    border: 'none',
                                    color: textPrimary,
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                  }}
                                >
                                  <img
                                    src={`https://flagcdn.com/24x18/${currency.flag}.png`}
                                    alt={currency.code}
                                    style={{ width: '20px', height: '15px', borderRadius: '2px' }}
                                  />
                                  <span style={{ fontWeight: 600 }}>{currency.code}</span>
                                  <span style={{ color: textSecondary, fontSize: '12px' }}>{currency.name}</span>
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      {['100', '500', '1000', '5000'].map((amount) => (
                        <motion.button
                          key={amount}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setFiatAmount(amount)}
                          style={{
                            padding: '6px 12px',
                            background: fiatAmount === amount ? `${accentColor}20` : 'transparent',
                            border: `1px solid ${fiatAmount === amount ? accentColor : borderColor}`,
                            borderRadius: '8px',
                            color: fiatAmount === amount ? accentColor : textSecondary,
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {selectedCurrency.symbol}{amount}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Swap Icon */}
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
                    <motion.div
                      whileHover={{ rotate: 180 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6',
                        border: `1px solid ${borderColor}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: textSecondary,
                        cursor: 'pointer',
                      }}
                    >
                      <ArrowLeftRight size={18} />
                    </motion.div>
                  </div>

                  {/* Crypto Output */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: textPrimary, marginBottom: '10px' }}>
                      {activeTab === 'buy' ? 'You Receive (to Exchange Wallet)' : 'You Get'}
                    </label>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px',
                      background: isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb',
                      borderRadius: '14px',
                      border: `1px solid ${borderColor}`,
                    }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '24px', fontWeight: 700, color: textPrimary }}>
                          {isNaN(cryptoAmount) ? '0.00' : cryptoAmount.toFixed(6)}
                        </p>
                        <p style={{ fontSize: '12px', color: textSecondary }}>
                          1 {selectedCrypto.symbol} = {selectedCurrency.symbol}{selectedCrypto.price.toLocaleString()}
                        </p>
                      </div>
                      <div style={{ position: 'relative' }}>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          onClick={() => setShowCryptoDropdown(!showCryptoDropdown)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            background: isDark ? 'rgba(255,255,255,0.1)' : '#ffffff',
                            border: `1px solid ${borderColor}`,
                            borderRadius: '10px',
                            color: textPrimary,
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          <CryptoIcon symbol={selectedCrypto.symbol} size={20} />
                          {selectedCrypto.symbol}
                          <ChevronDown size={16} />
                        </motion.button>

                        <AnimatePresence>
                          {showCryptoDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: '8px',
                                background: isDark ? '#1e2329' : '#ffffff',
                                border: `1px solid ${borderColor}`,
                                borderRadius: '12px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                                zIndex: 100,
                                minWidth: '220px',
                                maxHeight: '300px',
                                overflow: 'auto',
                              }}
                            >
                              {cryptos.filter(c => selectedProvider.supported.includes(c.symbol)).map((crypto) => (
                                <motion.button
                                  key={crypto.symbol}
                                  whileHover={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6' }}
                                  onClick={() => { setSelectedCrypto(crypto); setShowCryptoDropdown(false); }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    width: '100%',
                                    padding: '12px 16px',
                                    background: 'transparent',
                                    border: 'none',
                                    color: textPrimary,
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                  }}
                                >
                                  <CryptoIcon symbol={crypto.symbol} size={24} />
                                  <div>
                                    <p style={{ fontWeight: 600 }}>{crypto.symbol}</p>
                                    <p style={{ fontSize: '11px', color: textSecondary }}>{crypto.name}</p>
                                  </div>
                                  <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                                    <p style={{ fontSize: '12px', fontWeight: 600, color: textPrimary }}>${crypto.price.toLocaleString()}</p>
                                    <p style={{ fontSize: '10px', color: crypto.change24h >= 0 ? colors.trading.buy : colors.trading.sell }}>
                                      {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                                    </p>
                                  </div>
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    {activeTab === 'buy' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                        <CopyCheck size={14} color={colors.trading.buy} />
                        <span style={{ fontSize: '12px', color: textSecondary }}>
                          Auto-credited to your CrymadX wallet for trading & NFT purchases
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Provider Info Notice */}
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '14px',
                    background: isDark ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff',
                    borderRadius: '12px',
                    marginBottom: '20px',
                  }}>
                    <Info size={18} color="#3b82f6" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <p style={{ fontSize: '12px', color: isDark ? '#93c5fd' : '#1d4ed8', fontWeight: 600, marginBottom: '4px' }}>
                        KYC handled by {selectedProvider.name}
                      </p>
                      <p style={{ fontSize: '11px', color: textSecondary }}>
                        You'll be redirected to complete identity verification with the provider. CrymadX doesn't store your KYC data.
                      </p>
                    </div>
                  </div>

                  {/* Proceed Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleProceed}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: activeTab === 'buy' ? accentColor : colors.trading.sell,
                      border: 'none',
                      borderRadius: '14px',
                      color: isDark ? '#000' : '#fff',
                      fontSize: '16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    {activeTab === 'buy' ? 'Buy' : 'Sell'} {selectedCrypto.symbol} via {selectedProvider.name}
                    <ExternalLink size={18} />
                  </motion.button>
                </div>
              </GlassCard>

              {/* Right - Info Panel */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Order Summary */}
                <GlassCard>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: textPrimary, marginBottom: '16px' }}>
                    Order Summary
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: textSecondary }}>Amount</span>
                      <span style={{ color: textPrimary, fontWeight: 600 }}>
                        {selectedCurrency.symbol}{parseFloat(fiatAmount || '0').toLocaleString()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: textSecondary }}>Provider Fee</span>
                      <span style={{ color: textPrimary, fontWeight: 600 }}>
                        {selectedProvider.fee}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: textSecondary }}>Processing Time</span>
                      <span style={{ color: textPrimary, fontWeight: 600 }}>
                        {selectedProvider.processingTime}
                      </span>
                    </div>
                    <div style={{ height: '1px', background: borderColor }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: textPrimary, fontWeight: 700 }}>You'll Receive</span>
                      <span style={{ color: accentColor, fontWeight: 700, fontSize: '18px' }}>
                        {isNaN(cryptoAmount) ? '0' : cryptoAmount.toFixed(6)} {selectedCrypto.symbol}
                      </span>
                    </div>
                  </div>
                </GlassCard>

                {/* Supported Payment Methods */}
                <GlassCard>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: textPrimary, marginBottom: '16px' }}>
                    Payment Methods
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedProvider.paymentMethods.map((method, i) => (
                      <div key={i} style={{
                        padding: '8px 12px',
                        background: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}>
                        {method === 'Card' ? <CreditCard size={14} color={textSecondary} /> :
                         method === 'Bank Transfer' ? <Building2 size={14} color={textSecondary} /> :
                         <Wallet size={14} color={textSecondary} />}
                        <span style={{ fontSize: '12px', fontWeight: 600, color: textPrimary }}>{method}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Provider Features */}
                <GlassCard>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: textPrimary, marginBottom: '16px' }}>
                    Provider Details
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: accentColor,
                      }}>
                        <Star size={18} />
                      </div>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: textPrimary }}>Rating: {selectedProvider.rating}/5</p>
                        <p style={{ fontSize: '11px', color: textSecondary }}>Trusted by millions</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: accentColor,
                      }}>
                        <Shield size={18} />
                      </div>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: textPrimary }}>Licensed & Regulated</p>
                        <p style={{ fontSize: '11px', color: textSecondary }}>Compliant in 180+ countries</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: accentColor,
                      }}>
                        <Zap size={18} />
                      </div>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: textPrimary }}>Limits</p>
                        <p style={{ fontSize: '11px', color: textSecondary }}>${selectedProvider.minAmount} - ${selectedProvider.maxAmount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* Disclaimer */}
                <div style={{
                  padding: '14px',
                  background: isDark ? 'rgba(255, 193, 7, 0.1)' : '#fef3c7',
                  borderRadius: '12px',
                  border: `1px solid ${isDark ? 'rgba(255, 193, 7, 0.3)' : '#fcd34d'}`,
                  display: 'flex',
                  gap: '10px',
                }}>
                  <AlertCircle size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ fontSize: '11px', color: isDark ? '#fcd34d' : '#92400e', fontWeight: 600, marginBottom: '4px' }}>
                      Important Notice
                    </p>
                    <p style={{ fontSize: '10px', color: isDark ? 'rgba(255,255,255,0.7)' : '#78350f' }}>
                      Crypto prices are volatile. Third-party provider terms apply. Funds will be auto-credited to your CrymadX wallet.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <GlassCard>
              <LiquidGlassBackground intensity="low" />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: textPrimary, marginBottom: '20px' }}>
                  Transaction History
                </h3>

                {/* Desktop Table */}
                {!isMobile && (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {['Type', 'Asset', 'Amount', 'Fiat', 'Provider', 'Status', 'Date'].map((header) => (
                          <th key={header} style={{
                            textAlign: 'left',
                            padding: '12px 16px',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: textSecondary,
                            borderBottom: `1px solid ${borderColor}`,
                            textTransform: 'uppercase',
                          }}>
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map((tx) => (
                        <tr key={tx.id}>
                          <td style={{ padding: '16px', borderBottom: `1px solid ${borderColor}` }}>
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '6px',
                              background: tx.type === 'buy' ? `${colors.trading.buy}20` : `${colors.trading.sell}20`,
                              color: tx.type === 'buy' ? colors.trading.buy : colors.trading.sell,
                              fontSize: '12px',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                            }}>
                              {tx.type}
                            </span>
                          </td>
                          <td style={{ padding: '16px', borderBottom: `1px solid ${borderColor}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <CryptoIcon symbol={tx.crypto} size={24} />
                              <span style={{ fontWeight: 600, color: textPrimary }}>{tx.crypto}</span>
                            </div>
                          </td>
                          <td style={{ padding: '16px', borderBottom: `1px solid ${borderColor}`, fontWeight: 600, color: textPrimary }}>
                            {tx.amount} {tx.crypto}
                          </td>
                          <td style={{ padding: '16px', borderBottom: `1px solid ${borderColor}`, color: textSecondary }}>
                            ${tx.fiatAmount.toLocaleString()} {tx.currency}
                          </td>
                          <td style={{ padding: '16px', borderBottom: `1px solid ${borderColor}`, color: textPrimary, fontWeight: 500 }}>
                            {tx.provider}
                          </td>
                          <td style={{ padding: '16px', borderBottom: `1px solid ${borderColor}` }}>
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '6px',
                              background: tx.status === 'completed' ? `${colors.trading.buy}20` :
                                          tx.status === 'processing' ? `${accentColor}20` : 'rgba(255,193,7,0.2)',
                              color: tx.status === 'completed' ? colors.trading.buy :
                                     tx.status === 'processing' ? accentColor : '#f59e0b',
                              fontSize: '11px',
                              fontWeight: 600,
                            }}>
                              {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                            </span>
                          </td>
                          <td style={{ padding: '16px', borderBottom: `1px solid ${borderColor}`, color: textSecondary, fontSize: '13px' }}>
                            {tx.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Mobile Cards */}
                {isMobile && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {recentTransactions.map((tx) => (
                      <div key={tx.id} style={{
                        padding: '16px',
                        background: isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb',
                        borderRadius: '12px',
                        border: `1px solid ${borderColor}`,
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <CryptoIcon symbol={tx.crypto} size={32} />
                            <div>
                              <p style={{ fontWeight: 700, color: textPrimary }}>{tx.amount} {tx.crypto}</p>
                              <p style={{ fontSize: '12px', color: textSecondary }}>${tx.fiatAmount.toLocaleString()}</p>
                            </div>
                          </div>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            background: tx.type === 'buy' ? `${colors.trading.buy}20` : `${colors.trading.sell}20`,
                            color: tx.type === 'buy' ? colors.trading.buy : colors.trading.sell,
                            fontSize: '11px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                          }}>
                            {tx.type}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: textSecondary }}>
                          <span>{tx.provider}</span>
                          <span>{tx.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {recentTransactions.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <History size={48} color={textSecondary} style={{ opacity: 0.5, marginBottom: '16px' }} />
                    <p style={{ color: textSecondary }}>No transactions yet</p>
                  </div>
                )}
              </div>
            </GlassCard>
          )}
      {/* Provider Selection Modal */}
      <AnimatePresence>
        {showProviderModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={modalOverlay}
            onClick={() => setShowProviderModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={modalContent}
            >
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: textPrimary }}>
                    Select Provider
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setShowProviderModal(false)}
                    style={{ background: 'none', border: 'none', color: textSecondary, cursor: 'pointer' }}
                  >
                    <X size={24} />
                  </motion.button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {providers.map((provider) => (
                    <motion.button
                      key={provider.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        setSelectedProvider(provider);
                        // Reset crypto if not supported
                        if (!provider.supported.includes(selectedCrypto.symbol)) {
                          setSelectedCrypto(cryptos.find(c => provider.supported.includes(c.symbol)) || cryptos[0]);
                        }
                        setShowProviderModal(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '16px',
                        background: selectedProvider.id === provider.id
                          ? `${accentColor}15`
                          : (isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb'),
                        border: `2px solid ${selectedProvider.id === provider.id ? accentColor : 'transparent'}`,
                        borderRadius: '14px',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: isDark ? 'rgba(255,255,255,0.1)' : '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `1px solid ${borderColor}`,
                          flexShrink: 0,
                        }}>
                          <Globe size={24} color={accentColor} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '16px', fontWeight: 700, color: textPrimary }}>{provider.name}</span>
                            {provider.popular && (
                              <span style={{
                                padding: '2px 8px',
                                background: `${accentColor}20`,
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: 700,
                                color: accentColor,
                              }}>
                                POPULAR
                              </span>
                            )}
                            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Star size={12} color="#fbbf24" fill="#fbbf24" />
                              <span style={{ fontSize: '12px', fontWeight: 600, color: textPrimary }}>{provider.rating}</span>
                            </div>
                          </div>
                          <p style={{ fontSize: '12px', color: textSecondary, marginBottom: '8px' }}>{provider.description}</p>
                          <div style={{ display: 'flex', gap: '16px' }}>
                            <div>
                              <span style={{ fontSize: '10px', color: textSecondary }}>Fee</span>
                              <p style={{ fontSize: '12px', fontWeight: 600, color: textPrimary }}>{provider.fee}</p>
                            </div>
                            <div>
                              <span style={{ fontSize: '10px', color: textSecondary }}>Time</span>
                              <p style={{ fontSize: '12px', fontWeight: 600, color: textPrimary }}>{provider.processingTime}</p>
                            </div>
                            <div>
                              <span style={{ fontSize: '10px', color: textSecondary }}>Limits</span>
                              <p style={{ fontSize: '12px', fontWeight: 600, color: textPrimary }}>${provider.minAmount} - ${provider.maxAmount.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={modalOverlay}
            onClick={() => setShowCheckoutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={modalContent}
            >
              <div style={{ padding: '24px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: textPrimary }}>
                    {checkoutStep === 3 ? 'Purchase Complete!' : `${activeTab === 'buy' ? 'Buy' : 'Sell'} via ${selectedProvider.name}`}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setShowCheckoutModal(false)}
                    style={{ background: 'none', border: 'none', color: textSecondary, cursor: 'pointer' }}
                  >
                    <X size={24} />
                  </motion.button>
                </div>

                {/* Progress */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                  {[1, 2, 3].map((step) => (
                    <div key={step} style={{ flex: 1, height: '4px', borderRadius: '2px', background: step <= checkoutStep ? accentColor : (isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb') }} />
                  ))}
                </div>

                {/* Step 1: Confirm Details */}
                {checkoutStep === 1 && (
                  <div>
                    <div style={{
                      padding: '20px',
                      background: isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb',
                      borderRadius: '14px',
                      marginBottom: '20px',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ color: textSecondary }}>You Pay</span>
                        <span style={{ color: textPrimary, fontWeight: 700, fontSize: '18px' }}>
                          {selectedCurrency.symbol}{parseFloat(fiatAmount || '0').toLocaleString()}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ color: textSecondary }}>You Receive</span>
                        <span style={{ color: accentColor, fontWeight: 700, fontSize: '18px' }}>
                          {cryptoAmount.toFixed(6)} {selectedCrypto.symbol}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ color: textSecondary }}>Provider</span>
                        <span style={{ color: textPrimary, fontWeight: 600 }}>
                          {selectedProvider.name}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: textSecondary }}>Destination</span>
                        <span style={{ color: textPrimary, fontWeight: 600 }}>
                          CrymadX Wallet
                        </span>
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '10px',
                      padding: '12px',
                      background: isDark ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff',
                      borderRadius: '10px',
                      marginBottom: '20px',
                    }}>
                      <ExternalLink size={16} color="#3b82f6" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <p style={{ fontSize: '12px', color: isDark ? '#93c5fd' : '#1d4ed8' }}>
                        You'll be redirected to {selectedProvider.name} to complete payment & KYC verification.
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCheckoutStep(2)}
                      style={{
                        width: '100%',
                        padding: '14px',
                        background: accentColor,
                        border: 'none',
                        borderRadius: '12px',
                        color: isDark ? '#000' : '#fff',
                        fontSize: '15px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
                    >
                      Continue to {selectedProvider.name}
                      <ExternalLink size={16} />
                    </motion.button>
                  </div>
                )}

                {/* Step 2: Processing */}
                {checkoutStep === 2 && (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      style={{
                        width: '60px',
                        height: '60px',
                        border: `3px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`,
                        borderTopColor: accentColor,
                        borderRadius: '50%',
                        margin: '0 auto 20px',
                      }}
                    />
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: textPrimary, marginBottom: '8px' }}>
                      Connecting to {selectedProvider.name}
                    </h3>
                    <p style={{ fontSize: '14px', color: textSecondary, marginBottom: '20px' }}>
                      Please complete the payment in the provider widget...
                    </p>
                    <div style={{ textAlign: 'left', padding: '16px', background: isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb', borderRadius: '12px' }}>
                      {['Provider widget loading', 'KYC verification (if required)', 'Payment processing'].map((step, i) => (
                        <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: i < 2 ? '12px' : 0 }}>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 1.5 }}
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              background: colors.trading.buyBg,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Check size={12} color={colors.trading.buy} />
                          </motion.div>
                          <span style={{ color: textPrimary, fontSize: '13px' }}>{step}</span>
                        </div>
                      ))}
                    </div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 5 }}
                      onAnimationComplete={() => setCheckoutStep(3)}
                      style={{ height: '4px', background: accentColor, borderRadius: '2px', marginTop: '20px' }}
                    />
                  </div>
                )}

                {/* Step 3: Success */}
                {checkoutStep === 3 && (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: colors.trading.buyBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                      }}
                    >
                      <Check size={40} color={colors.trading.buy} />
                    </motion.div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: textPrimary, marginBottom: '8px' }}>
                      Purchase Successful!
                    </h3>
                    <p style={{ fontSize: '14px', color: textSecondary, marginBottom: '24px' }}>
                      {cryptoAmount.toFixed(6)} {selectedCrypto.symbol} has been added to your CrymadX wallet
                    </p>

                    <div style={{
                      padding: '16px',
                      background: isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb',
                      borderRadius: '12px',
                      marginBottom: '24px',
                      textAlign: 'left',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: textSecondary }}>Transaction ID</span>
                        <span style={{ color: textPrimary, fontWeight: 600, fontFamily: 'monospace', fontSize: '12px' }}>
                          {selectedProvider.id.toUpperCase()}-{Math.random().toString(36).substr(2, 8).toUpperCase()}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: textSecondary }}>Provider</span>
                        <span style={{ color: textPrimary, fontWeight: 600 }}>{selectedProvider.name}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: textSecondary }}>Amount Received</span>
                        <span style={{ color: accentColor, fontWeight: 700 }}>
                          {cryptoAmount.toFixed(6)} {selectedCrypto.symbol}
                        </span>
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px',
                      background: isDark ? 'rgba(16, 185, 129, 0.1)' : '#d1fae5',
                      borderRadius: '10px',
                      marginBottom: '24px',
                    }}>
                      <CopyCheck size={16} color={colors.trading.buy} />
                      <p style={{ fontSize: '12px', color: isDark ? '#6ee7b7' : '#047857', fontWeight: 500 }}>
                        Funds available for trading and NFT purchases
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        onClick={() => {
                          setShowCheckoutModal(false);
                          window.location.href = '/wallet';
                        }}
                        style={{
                          flex: 1,
                          padding: '14px',
                          background: accentColor,
                          border: 'none',
                          borderRadius: '12px',
                          color: isDark ? '#000' : '#fff',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                        }}
                      >
                        <Wallet size={18} />
                        View Wallet
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        onClick={() => {
                          setShowCheckoutModal(false);
                          window.location.href = '/trade';
                        }}
                        style={{
                          flex: 1,
                          padding: '14px',
                          background: 'transparent',
                          border: `1px solid ${borderColor}`,
                          borderRadius: '12px',
                          color: textPrimary,
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                        }}
                      >
                        <TrendingUp size={18} />
                        Start Trading
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </>
    </ResponsiveLayout>
  );
};

export default FiatScreen;
