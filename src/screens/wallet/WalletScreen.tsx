import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  History,
  X,
  Check,
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  Briefcase,
  LineChart,
  Gift,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Search,
} from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { GlassCard, Button, CryptoIcon, ResponsiveLayout } from '../../components';
import { usePresentationMode } from '../../components/PresentationMode';
import { LiquidGlassBackground, LiquidOrb } from '../../components/Glass3D';

// Wallet Types
type WalletType = 'overview' | 'spot' | 'funding' | 'earn';

interface WalletAsset {
  symbol: string;
  name: string;
  spotAvailable: number;
  spotInOrder: number;
  fundingAvailable: number;
  price: number;
  change: number;
}

const assets: WalletAsset[] = [
  { symbol: 'BTC', name: 'Bitcoin', spotAvailable: 0.4234, spotInOrder: 0.0123, fundingAvailable: 0.1, price: 43576, change: 2.34 },
  { symbol: 'ETH', name: 'Ethereum', spotAvailable: 3.2156, spotInOrder: 0.5, fundingAvailable: 1.0, price: 2345.67, change: -1.25 },
  { symbol: 'USDT', name: 'Tether', spotAvailable: 4000.00, spotInOrder: 1000, fundingAvailable: 2000, price: 1, change: 0.01 },
  { symbol: 'SOL', name: 'Solana', spotAvailable: 35.67, spotInOrder: 0, fundingAvailable: 10, price: 98.50, change: 5.67 },
  { symbol: 'BNB', name: 'BNB', spotAvailable: 10.34, spotInOrder: 2.5, fundingAvailable: 2, price: 305.45, change: -0.89 },
  { symbol: 'XRP', name: 'Ripple', spotAvailable: 1200, spotInOrder: 0, fundingAvailable: 300, price: 0.52, change: 3.21 },
  { symbol: 'ADA', name: 'Cardano', spotAvailable: 2000, spotInOrder: 500, fundingAvailable: 500, price: 0.45, change: 1.45 },
  { symbol: 'DOGE', name: 'Dogecoin', spotAvailable: 8000, spotInOrder: 0, fundingAvailable: 2000, price: 0.082, change: -2.34 },
  { symbol: 'AVAX', name: 'Avalanche', spotAvailable: 45.23, spotInOrder: 5.5, fundingAvailable: 12, price: 35.67, change: 4.56 },
  { symbol: 'MATIC', name: 'Polygon', spotAvailable: 3500, spotInOrder: 200, fundingAvailable: 800, price: 0.89, change: 2.12 },
  { symbol: 'DOT', name: 'Polkadot', spotAvailable: 150.5, spotInOrder: 25, fundingAvailable: 40, price: 7.23, change: -0.45 },
  { symbol: 'LINK', name: 'Chainlink', spotAvailable: 85.3, spotInOrder: 10, fundingAvailable: 20, price: 14.56, change: 3.78 },
  { symbol: 'UNI', name: 'Uniswap', spotAvailable: 120, spotInOrder: 0, fundingAvailable: 30, price: 6.89, change: -1.23 },
  { symbol: 'ATOM', name: 'Cosmos', spotAvailable: 95.7, spotInOrder: 15, fundingAvailable: 25, price: 9.45, change: 1.89 },
  { symbol: 'LTC', name: 'Litecoin', spotAvailable: 12.34, spotInOrder: 2, fundingAvailable: 5, price: 72.34, change: 0.67 },
  { symbol: 'NEAR', name: 'NEAR Protocol', spotAvailable: 450, spotInOrder: 50, fundingAvailable: 100, price: 5.23, change: 6.45 },
  { symbol: 'APT', name: 'Aptos', spotAvailable: 78.9, spotInOrder: 0, fundingAvailable: 20, price: 8.67, change: -2.34 },
  { symbol: 'ARB', name: 'Arbitrum', spotAvailable: 890, spotInOrder: 100, fundingAvailable: 200, price: 1.12, change: 4.56 },
  { symbol: 'OP', name: 'Optimism', spotAvailable: 560, spotInOrder: 40, fundingAvailable: 100, price: 2.34, change: 3.21 },
  { symbol: 'FIL', name: 'Filecoin', spotAvailable: 67.8, spotInOrder: 0, fundingAvailable: 15, price: 5.67, change: -1.45 },
  { symbol: 'SHIB', name: 'Shiba Inu', spotAvailable: 50000000, spotInOrder: 0, fundingAvailable: 10000000, price: 0.0000089, change: 2.34 },
  { symbol: 'TRX', name: 'TRON', spotAvailable: 12000, spotInOrder: 1000, fundingAvailable: 3000, price: 0.11, change: 1.23 },
  { symbol: 'INJ', name: 'Injective', spotAvailable: 23.45, spotInOrder: 5, fundingAvailable: 8, price: 28.90, change: 5.67 },
  { symbol: 'AAVE', name: 'Aave', spotAvailable: 8.9, spotInOrder: 0, fundingAvailable: 2, price: 92.34, change: 2.89 },
  { symbol: 'MKR', name: 'Maker', spotAvailable: 1.23, spotInOrder: 0, fundingAvailable: 0.5, price: 1456.78, change: -0.78 },
  { symbol: 'FTM', name: 'Fantom', spotAvailable: 4500, spotInOrder: 500, fundingAvailable: 1000, price: 0.34, change: 7.89 },
  { symbol: 'SAND', name: 'The Sandbox', spotAvailable: 2300, spotInOrder: 200, fundingAvailable: 500, price: 0.45, change: -3.21 },
  { symbol: 'MANA', name: 'Decentraland', spotAvailable: 1800, spotInOrder: 150, fundingAvailable: 400, price: 0.52, change: -2.45 },
  { symbol: 'IMX', name: 'Immutable X', spotAvailable: 670, spotInOrder: 0, fundingAvailable: 150, price: 1.78, change: 4.23 },
  { symbol: 'RENDER', name: 'Render', spotAvailable: 145, spotInOrder: 20, fundingAvailable: 35, price: 7.89, change: 8.45 },
];

// Wallet Tab Button
const WalletTab: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  balance: string;
  colors: any;
  isDark?: boolean;
}> = ({ label, icon, isActive, onClick, balance, colors, isDark = true }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    style={{
      flex: 1,
      padding: '16px',
      background: isActive
        ? isDark
          ? `linear-gradient(135deg, ${colors.primary[400]}15, ${colors.secondary[400]}10)`
          : '#f3f4f6'
        : isDark ? 'transparent' : '#ffffff',
      border: isActive
        ? isDark
          ? `1px solid ${colors.primary[400]}40`
          : '1px solid #000000'
        : isDark ? `1px solid ${colors.glass.border}` : '1px solid #d1d5db',
      borderRadius: '14px',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s ease',
      boxShadow: 'none',
    }}
  >
    <div style={{
      width: '44px',
      height: '44px',
      borderRadius: '12px',
      background: isActive
        ? isDark
          ? `linear-gradient(135deg, ${colors.primary[400]}25, ${colors.secondary[400]}15)`
          : '#e5e7eb'
        : isDark ? colors.background.card : '#f9fafb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: isActive ? (isDark ? colors.primary[400] : '#000000') : (isDark ? colors.text.tertiary : '#374151'),
    }}>
      {icon}
    </div>
    <span style={{
      fontSize: '13px',
      fontWeight: 700,
      color: isDark ? (isActive ? colors.text.primary : colors.text.tertiary) : (isActive ? '#000000' : '#374151'),
    }}>
      {label}
    </span>
    <span style={{
      fontSize: '15px',
      fontWeight: 700,
      fontFamily: "'JetBrains Mono', monospace",
      color: isDark ? (isActive ? colors.primary[400] : colors.text.secondary) : '#000000',
    }}>
      {balance}
    </span>
  </motion.button>
);

export const WalletScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = usePresentationMode();
  const { colors, mode } = useThemeMode();
  const isDark = mode === 'dark';

  const [hideBalances, setHideBalances] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hideZeroBalances, setHideZeroBalances] = useState(false);
  const [activeWallet, setActiveWallet] = useState<WalletType>('overview');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferAsset, setTransferAsset] = useState<WalletAsset | null>(null);
  const [transferDirection, setTransferDirection] = useState<'spot-to-funding' | 'funding-to-spot'>('spot-to-funding');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = isMobile ? 6 : 8;

  // Calculate totals
  const spotTotal = assets.reduce((sum, asset) => {
    return sum + (asset.spotAvailable + asset.spotInOrder) * asset.price;
  }, 0);

  const fundingTotal = assets.reduce((sum, asset) => {
    return sum + asset.fundingAvailable * asset.price;
  }, 0);

  const totalBalance = spotTotal + fundingTotal;
  const btcEquivalent = totalBalance / 43576;

  // Filter assets based on active wallet and search
  const filteredAssets = assets.filter(asset => {
    if (hideZeroBalances) {
      const hasBalance = activeWallet === 'spot'
        ? (asset.spotAvailable + asset.spotInOrder) > 0
        : activeWallet === 'funding'
        ? asset.fundingAvailable > 0
        : (asset.spotAvailable + asset.spotInOrder + asset.fundingAvailable) > 0;
      if (!hasBalance) return false;
    }
    if (searchQuery && !asset.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAssets = filteredAssets.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, hideZeroBalances, activeWallet]);

  const handleTransfer = () => {
    if (!transferAsset || !transferAmount) return;
    // Simulate transfer
    setTransferSuccess(true);
    setTimeout(() => {
      setShowTransferModal(false);
      setTransferSuccess(false);
      setTransferAmount('');
      setTransferAsset(null);
    }, 2000);
  };

  const getMaxTransferAmount = () => {
    if (!transferAsset) return 0;
    return transferDirection === 'spot-to-funding'
      ? transferAsset.spotAvailable
      : transferAsset.fundingAvailable;
  };

  return (
    <ResponsiveLayout activeNav="wallet" title="Wallet">
      {/* Premium Liquid Glass Background - Dark mode only */}
      {isDark && (
        <>
          <LiquidGlassBackground
            intensity="low"
            showOrbs={true}
            showRings={false}
            showCubes={false}
          />
          <LiquidOrb
            size={170}
            color="gold"
            style={{ position: 'fixed', top: '8%', right: '-5%', zIndex: 0 }}
            delay={0}
            duration={12}
          />
          <LiquidOrb
            size={140}
            color="green"
            style={{ position: 'fixed', bottom: '15%', left: '-4%', zIndex: 0 }}
            delay={3}
            duration={14}
          />
        </>
      )}

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: isMobile ? '16px' : '0',
          marginBottom: isMobile ? '20px' : '32px',
        }}
      >
        <div>
          <h1 style={{
            fontSize: isMobile ? '24px' : '32px',
            fontWeight: 800,
            color: isDark ? colors.text.primary : '#000000',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <motion.div
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: isMobile ? 32 : 40,
                height: isMobile ? 32 : 40,
                borderRadius: '10px',
                background: colors.trading.buyBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Wallet size={isMobile ? 18 : 22} color={colors.primary[400]} />
            </motion.div>
            Wallet
          </h1>
          <p style={{
            fontSize: isMobile ? '14px' : '15px',
            color: isDark ? colors.text.tertiary : '#374151',
            fontWeight: 600,
          }}>
            Manage your Spot & Funding wallets
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button
            variant="secondary"
            size={isMobile ? 'sm' : 'md'}
            leftIcon={<History size={18} />}
            onClick={() => navigate('/wallet/history')}
          >
            History
          </Button>
          <Button
            variant="primary"
            size={isMobile ? 'sm' : 'md'}
            leftIcon={<ArrowUpRight size={18} />}
            onClick={() => navigate('/wallet/deposit')}
          >
            Deposit
          </Button>
          <Button
            variant="outline"
            size={isMobile ? 'sm' : 'md'}
            leftIcon={<ArrowDownRight size={18} />}
            onClick={() => navigate('/wallet/withdraw')}
          >
            Withdraw
          </Button>
        </div>
      </motion.div>

      {/* Total Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ marginBottom: '24px' }}
      >
        <GlassCard variant="prominent" padding={isMobile ? 'md' : 'lg'} glow>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}>
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '8px',
              }}>
                <span style={{
                  fontSize: '14px',
                  color: isDark ? colors.text.tertiary : '#374151',
                  fontWeight: 600,
                }}>
                  Total Balance
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setHideBalances(!hideBalances)}
                  style={{
                    background: colors.trading.buyBg,
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    color: colors.primary[400],
                    padding: '4px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                  }}
                >
                  {hideBalances ? <EyeOff size={14} /> : <Eye size={14} />}
                  {hideBalances ? 'Show' : 'Hide'}
                </motion.button>
              </div>
              <motion.div
                key={hideBalances ? 'hidden' : 'visible'}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  fontSize: isMobile ? '32px' : '42px',
                  fontWeight: 700,
                  fontFamily: "'JetBrains Mono', monospace",
                  ...(isDark ? {
                    background: colors.gradients.primary,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  } : {
                    color: '#059669',
                  }),
                  marginBottom: '4px',
                }}
              >
                {hideBalances ? '••••••••' : `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              </motion.div>
              <div style={{
                fontSize: '14px',
                color: isDark ? colors.text.tertiary : '#6b7280',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
              }}>
                {hideBalances ? '••••••' : `≈ ${btcEquivalent.toFixed(4)} BTC`}
              </div>
            </div>

            {/* Quick Actions */}
            {!isMobile && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: `0 4px 20px ${colors.primary[400]}30` }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setTransferAsset(assets[2]); // Default to USDT
                    setShowTransferModal(true);
                  }}
                  style={{
                    padding: '12px 20px',
                    background: `linear-gradient(135deg, ${colors.primary[400]}20, ${colors.secondary[400]}15)`,
                    border: `1px solid ${colors.primary[400]}40`,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: colors.primary[400],
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  <ArrowRightLeft size={18} />
                  Transfer
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/wallet/convert')}
                  style={{
                    padding: '12px 20px',
                    background: colors.background.card,
                    border: `1px solid ${colors.glass.border}`,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: colors.text.secondary,
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  <RefreshCw size={18} />
                  Convert
                </motion.button>
              </div>
            )}
          </div>

          {/* Wallet Type Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: '12px',
          }}>
            <WalletTab
              label="Overview"
              icon={<Wallet size={20} />}
              isActive={activeWallet === 'overview'}
              onClick={() => setActiveWallet('overview')}
              balance={hideBalances ? '••••' : `$${totalBalance.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
              colors={colors}
              isDark={isDark}
            />
            <WalletTab
              label="Spot"
              icon={<LineChart size={20} />}
              isActive={activeWallet === 'spot'}
              onClick={() => setActiveWallet('spot')}
              balance={hideBalances ? '••••' : `$${spotTotal.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
              colors={colors}
              isDark={isDark}
            />
            <WalletTab
              label="Funding"
              icon={<Briefcase size={20} />}
              isActive={activeWallet === 'funding'}
              onClick={() => setActiveWallet('funding')}
              balance={hideBalances ? '••••' : `$${fundingTotal.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
              colors={colors}
              isDark={isDark}
            />
            <WalletTab
              label="Earn"
              icon={<Gift size={20} />}
              isActive={activeWallet === 'earn'}
              onClick={() => setActiveWallet('earn')}
              balance={hideBalances ? '••••' : '$0.00'}
              colors={colors}
              isDark={isDark}
            />
          </div>
        </GlassCard>
      </motion.div>

      {/* Mobile Transfer Button */}
      {isMobile && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setTransferAsset(assets[2]);
            setShowTransferModal(true);
          }}
          style={{
            width: '100%',
            padding: '14px',
            marginBottom: '20px',
            background: `linear-gradient(135deg, ${colors.primary[400]}15, ${colors.secondary[400]}10)`,
            border: `1px solid ${colors.primary[400]}40`,
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            color: colors.primary[400],
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          <ArrowRightLeft size={20} />
          Transfer Between Wallets
        </motion.button>
      )}

      {/* Assets Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard padding="lg">
          {/* Table Header */}
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'stretch' : 'center',
            marginBottom: isMobile ? '12px' : '20px',
            gap: isMobile ? '12px' : '0',
          }}>
            <h3 style={{
              fontSize: isMobile ? '16px' : '18px',
              fontWeight: 600,
              color: colors.text.primary,
            }}>
              {activeWallet === 'overview' ? 'All Assets' :
               activeWallet === 'spot' ? 'Spot Assets' :
               activeWallet === 'funding' ? 'Funding Assets' : 'Earn Assets'}
            </h3>

            <div style={{ display: 'flex', gap: isMobile ? '8px' : '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                background: colors.background.card,
                border: `1px solid ${colors.glass.border}`,
                borderRadius: '8px',
                flex: isMobile ? 1 : 'none',
                width: isMobile ? '100%' : '200px',
              }}>
                <Search size={16} color={colors.text.tertiary} />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    color: colors.text.primary,
                    fontSize: '13px',
                    width: '100%',
                  }}
                />
              </div>

              {!isMobile && (
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: colors.text.secondary,
                  padding: '8px 12px',
                  background: hideZeroBalances ? colors.trading.buyBg : 'transparent',
                  borderRadius: '8px',
                  border: `1px solid ${hideZeroBalances ? `${colors.primary[400]}30` : colors.glass.border}`,
                }}>
                  <input
                    type="checkbox"
                    checked={hideZeroBalances}
                    onChange={(e) => setHideZeroBalances(e.target.checked)}
                    style={{ accentColor: colors.primary[400] }}
                  />
                  Hide zero balances
                </label>
              )}
            </div>
          </div>

          {/* Asset Rows */}
          <div style={{
            border: `1px solid ${colors.glass.border}`,
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            {/* Column Headers - Desktop */}
            {!isMobile && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: activeWallet === 'overview'
                  ? '2fr 1.2fr 1.2fr 1.2fr 1.2fr 1.2fr 120px'
                  : '2fr 1.5fr 1.5fr 1.5fr 120px',
                padding: '14px 20px',
                background: colors.background.card,
                borderBottom: `1px solid ${colors.glass.border}`,
                fontSize: '12px',
                fontWeight: 600,
                color: colors.text.tertiary,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                <span>Asset</span>
                {activeWallet === 'overview' ? (
                  <>
                    <span style={{ textAlign: 'right' }}>Spot Available</span>
                    <span style={{ textAlign: 'right' }}>Spot In Order</span>
                    <span style={{ textAlign: 'right' }}>Funding</span>
                    <span style={{ textAlign: 'right' }}>Total</span>
                    <span style={{ textAlign: 'right' }}>USD Value</span>
                  </>
                ) : activeWallet === 'spot' ? (
                  <>
                    <span style={{ textAlign: 'right' }}>Available</span>
                    <span style={{ textAlign: 'right' }}>In Order</span>
                    <span style={{ textAlign: 'right' }}>USD Value</span>
                  </>
                ) : (
                  <>
                    <span style={{ textAlign: 'right' }}>Available</span>
                    <span style={{ textAlign: 'right' }}>USD Value</span>
                    <span style={{ textAlign: 'right' }}>24h Change</span>
                  </>
                )}
                <span style={{ textAlign: 'center' }}>Actions</span>
              </div>
            )}

            {/* Asset List */}
            {paginatedAssets.map((asset, index) => {
              const spotValue = (asset.spotAvailable + asset.spotInOrder) * asset.price;
              const fundingValue = asset.fundingAvailable * asset.price;
              const totalValue = spotValue + fundingValue;

              return (
                <motion.div
                  key={asset.symbol}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.03 }}
                  whileHover={{ background: colors.background.hover }}
                  style={{
                    display: isMobile ? 'block' : 'grid',
                    gridTemplateColumns: activeWallet === 'overview'
                      ? '2fr 1.2fr 1.2fr 1.2fr 1.2fr 1.2fr 120px'
                      : '2fr 1.5fr 1.5fr 1.5fr 120px',
                    padding: isMobile ? '14px' : '16px 20px',
                    borderBottom: index < paginatedAssets.length - 1 ? `1px solid ${colors.glass.border}` : 'none',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease',
                  }}
                >
                  {/* Asset Info */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: isMobile ? '12px' : 0,
                  }}>
                    <CryptoIcon symbol={asset.symbol} size={isMobile ? 32 : 36} />
                    <div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: colors.text.primary,
                      }}>
                        {asset.symbol}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: colors.text.tertiary,
                      }}>
                        {asset.name}
                      </div>
                    </div>
                    {isMobile && (
                      <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          fontFamily: "'JetBrains Mono', monospace",
                          color: colors.text.primary,
                        }}>
                          {hideBalances ? '••••' : `$${totalValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}`}
                        </div>
                        <div style={{
                          fontSize: '11px',
                          color: asset.change >= 0 ? colors.trading.buy : colors.trading.sell,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gap: '2px',
                        }}>
                          {asset.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                          {asset.change >= 0 ? '+' : ''}{asset.change}%
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Desktop Columns */}
                  {!isMobile && (
                    <>
                      {activeWallet === 'overview' ? (
                        <>
                          <div style={{
                            textAlign: 'right',
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '13px',
                            color: colors.text.primary,
                            alignSelf: 'center',
                          }}>
                            {hideBalances ? '••••' : asset.spotAvailable.toLocaleString()}
                          </div>
                          <div style={{
                            textAlign: 'right',
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '13px',
                            color: asset.spotInOrder > 0 ? colors.status.warning : colors.text.tertiary,
                            alignSelf: 'center',
                          }}>
                            {hideBalances ? '••••' : asset.spotInOrder.toLocaleString()}
                          </div>
                          <div style={{
                            textAlign: 'right',
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '13px',
                            color: colors.text.primary,
                            alignSelf: 'center',
                          }}>
                            {hideBalances ? '••••' : asset.fundingAvailable.toLocaleString()}
                          </div>
                          <div style={{
                            textAlign: 'right',
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '13px',
                            fontWeight: 600,
                            color: colors.text.primary,
                            alignSelf: 'center',
                          }}>
                            {hideBalances ? '••••' : (asset.spotAvailable + asset.spotInOrder + asset.fundingAvailable).toLocaleString()}
                          </div>
                          <div style={{ textAlign: 'right', alignSelf: 'center' }}>
                            <div style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: '13px',
                              fontWeight: 600,
                              color: colors.text.primary,
                            }}>
                              {hideBalances ? '••••' : `$${totalValue.toLocaleString()}`}
                            </div>
                            <div style={{
                              fontSize: '11px',
                              color: asset.change >= 0 ? colors.trading.buy : colors.trading.sell,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              gap: '2px',
                            }}>
                              {asset.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                              {asset.change >= 0 ? '+' : ''}{asset.change}%
                            </div>
                          </div>
                        </>
                      ) : activeWallet === 'spot' ? (
                        <>
                          <div style={{
                            textAlign: 'right',
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '13px',
                            color: colors.text.primary,
                            alignSelf: 'center',
                          }}>
                            {hideBalances ? '••••' : asset.spotAvailable.toLocaleString()}
                          </div>
                          <div style={{
                            textAlign: 'right',
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '13px',
                            color: asset.spotInOrder > 0 ? colors.status.warning : colors.text.tertiary,
                            alignSelf: 'center',
                          }}>
                            {hideBalances ? '••••' : asset.spotInOrder.toLocaleString()}
                          </div>
                          <div style={{ textAlign: 'right', alignSelf: 'center' }}>
                            <div style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: '13px',
                              fontWeight: 600,
                              color: colors.text.primary,
                            }}>
                              {hideBalances ? '••••' : `$${spotValue.toLocaleString()}`}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{
                            textAlign: 'right',
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '13px',
                            color: colors.text.primary,
                            alignSelf: 'center',
                          }}>
                            {hideBalances ? '••••' : asset.fundingAvailable.toLocaleString()}
                          </div>
                          <div style={{
                            textAlign: 'right',
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '13px',
                            fontWeight: 600,
                            color: colors.text.primary,
                            alignSelf: 'center',
                          }}>
                            {hideBalances ? '••••' : `$${fundingValue.toLocaleString()}`}
                          </div>
                          <div style={{
                            textAlign: 'right',
                            fontSize: '13px',
                            color: asset.change >= 0 ? colors.trading.buy : colors.trading.sell,
                            alignSelf: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            gap: '4px',
                          }}>
                            {asset.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {asset.change >= 0 ? '+' : ''}{asset.change}%
                          </div>
                        </>
                      )}

                      {/* Actions */}
                      <div style={{
                        display: 'flex',
                        gap: '6px',
                        justifyContent: 'center',
                        alignSelf: 'center',
                      }}>
                        <motion.button
                          whileHover={{ background: `${colors.primary[400]}20` }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setTransferAsset(asset);
                            setShowTransferModal(true);
                          }}
                          style={{
                            padding: '6px 12px',
                            background: `${colors.primary[400]}10`,
                            border: `1px solid ${colors.primary[400]}30`,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: colors.primary[400],
                            fontSize: '12px',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <ArrowRightLeft size={12} />
                          Transfer
                        </motion.button>
                      </div>
                    </>
                  )}

                  {/* Mobile Balance Details & Actions */}
                  {isMobile && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '10px',
                      borderTop: `1px solid ${colors.glass.border}`,
                    }}>
                      <div style={{ fontSize: '12px', color: colors.text.tertiary }}>
                        {activeWallet === 'overview' || activeWallet === 'spot' ? (
                          <>Spot: <span style={{ color: colors.text.secondary, fontFamily: "'JetBrains Mono', monospace" }}>
                            {hideBalances ? '••••' : asset.spotAvailable.toLocaleString()}
                          </span></>
                        ) : null}
                        {activeWallet === 'overview' && ' | '}
                        {(activeWallet === 'overview' || activeWallet === 'funding') && (
                          <>Funding: <span style={{ color: colors.text.secondary, fontFamily: "'JetBrains Mono', monospace" }}>
                            {hideBalances ? '••••' : asset.fundingAvailable.toLocaleString()}
                          </span></>
                        )}
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setTransferAsset(asset);
                          setShowTransferModal(true);
                        }}
                        style={{
                          padding: '6px 12px',
                          background: `${colors.primary[400]}15`,
                          border: `1px solid ${colors.primary[400]}30`,
                          borderRadius: '6px',
                          cursor: 'pointer',
                          color: colors.primary[400],
                          fontSize: '11px',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <ArrowRightLeft size={12} />
                        Transfer
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: isMobile ? '16px' : '0',
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: `1px solid ${colors.glass.border}`,
              }}
            >
              {/* Page Info */}
              <div style={{
                fontSize: '13px',
                color: colors.text.tertiary,
                order: isMobile ? 2 : 1,
              }}>
                Showing <span style={{ color: colors.text.primary, fontWeight: 600 }}>{startIndex + 1}</span> to{' '}
                <span style={{ color: colors.text.primary, fontWeight: 600 }}>{Math.min(endIndex, filteredAssets.length)}</span>{' '}
                of <span style={{ color: colors.primary[400], fontWeight: 600 }}>{filteredAssets.length}</span> assets
              </div>

              {/* Pagination Buttons */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                order: isMobile ? 1 : 2,
              }}>
                {/* Previous Button */}
                <motion.button
                  whileHover={currentPage > 1 ? { scale: 1.05 } : {}}
                  whileTap={currentPage > 1 ? { scale: 0.95 } : {}}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 16px',
                    background: currentPage > 1 ? `${colors.primary[400]}15` : colors.background.card,
                    border: `1px solid ${currentPage > 1 ? `${colors.primary[400]}40` : colors.glass.border}`,
                    borderRadius: '10px',
                    cursor: currentPage > 1 ? 'pointer' : 'not-allowed',
                    color: currentPage > 1 ? colors.primary[400] : colors.text.tertiary,
                    fontSize: '13px',
                    fontWeight: 600,
                    opacity: currentPage > 1 ? 1 : 0.5,
                  }}
                >
                  <ChevronLeft size={16} />
                  {!isMobile && 'Previous'}
                </motion.button>

                {/* Page Numbers */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // Show first, last, current, and adjacent pages
                      if (page === 1 || page === totalPages) return true;
                      if (Math.abs(page - currentPage) <= 1) return true;
                      return false;
                    })
                    .map((page, idx, arr) => {
                      // Check if we need to show ellipsis
                      const showEllipsisBefore = idx > 0 && page - arr[idx - 1] > 1;
                      return (
                        <React.Fragment key={page}>
                          {showEllipsisBefore && (
                            <span style={{
                              color: colors.text.tertiary,
                              padding: '0 4px',
                              fontSize: '12px',
                            }}>
                              ...
                            </span>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCurrentPage(page)}
                            style={{
                              width: '36px',
                              height: '36px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '8px',
                              background: page === currentPage
                                ? `linear-gradient(135deg, ${colors.primary[400]}, ${colors.secondary[400]})`
                                : 'transparent',
                              border: page === currentPage
                                ? 'none'
                                : `1px solid ${colors.glass.border}`,
                              cursor: 'pointer',
                              color: page === currentPage ? '#0a0e14' : colors.text.secondary,
                              fontSize: '13px',
                              fontWeight: page === currentPage ? 700 : 500,
                            }}
                          >
                            {page}
                          </motion.button>
                        </React.Fragment>
                      );
                    })}
                </div>

                {/* Next Button */}
                <motion.button
                  whileHover={currentPage < totalPages ? { scale: 1.05 } : {}}
                  whileTap={currentPage < totalPages ? { scale: 0.95 } : {}}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 16px',
                    background: currentPage < totalPages ? `${colors.primary[400]}15` : colors.background.card,
                    border: `1px solid ${currentPage < totalPages ? `${colors.primary[400]}40` : colors.glass.border}`,
                    borderRadius: '10px',
                    cursor: currentPage < totalPages ? 'pointer' : 'not-allowed',
                    color: currentPage < totalPages ? colors.primary[400] : colors.text.tertiary,
                    fontSize: '13px',
                    fontWeight: 600,
                    opacity: currentPage < totalPages ? 1 : 0.5,
                  }}
                >
                  {!isMobile && 'Next'}
                  <ChevronRight size={16} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </GlassCard>
      </motion.div>

      {/* Transfer Modal */}
      <AnimatePresence>
        {showTransferModal && transferAsset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: isMobile ? 'flex-end' : 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: isMobile ? '0' : '20px',
            }}
            onClick={() => setShowTransferModal(false)}
          >
            <motion.div
              initial={{ scale: isMobile ? 1 : 0.95, y: isMobile ? 100 : 0, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: isMobile ? 1 : 0.95, y: isMobile ? 100 : 0, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: isMobile ? '100%' : '480px',
                background: isDark
                  ? 'linear-gradient(145deg, rgba(10, 25, 15, 0.98), rgba(5, 15, 10, 0.98))'
                  : 'linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.98))',
                borderRadius: isMobile ? '24px 24px 0 0' : '20px',
                border: `1px solid ${colors.glass.border}`,
                boxShadow: `0 0 60px ${colors.primary[400]}15`,
                padding: '24px',
              }}
            >
              {transferSuccess ? (
                // Success State
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '40px 20px',
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${colors.status.success}30, ${colors.status.success}15)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '20px',
                    }}
                  >
                    <Check size={40} color={colors.status.success} />
                  </motion.div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: colors.text.primary,
                    marginBottom: '8px',
                  }}>
                    Transfer Successful!
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: colors.text.tertiary,
                    textAlign: 'center',
                  }}>
                    {transferAmount} {transferAsset.symbol} has been transferred
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* Modal Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: `${colors.primary[400]}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <ArrowRightLeft size={20} color={colors.primary[400]} />
                      </div>
                      <h2 style={{
                        fontSize: '20px',
                        fontWeight: 700,
                        color: colors.text.primary,
                      }}>
                        Transfer
                      </h2>
                    </div>
                    <motion.button
                      whileHover={{ background: `${colors.status.error}15` }}
                      onClick={() => setShowTransferModal(false)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: colors.text.tertiary,
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '8px',
                      }}
                    >
                      <X size={20} />
                    </motion.button>
                  </div>

                  {/* Transfer Direction */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '24px',
                    padding: '16px',
                    background: colors.background.card,
                    borderRadius: '14px',
                    border: `1px solid ${colors.glass.border}`,
                  }}>
                    {/* From Wallet */}
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '11px', color: colors.text.tertiary, display: 'block', marginBottom: '4px' }}>
                        From
                      </span>
                      <div style={{
                        padding: '12px',
                        background: `${colors.primary[400]}10`,
                        borderRadius: '10px',
                        border: `1px solid ${colors.primary[400]}30`,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {transferDirection === 'spot-to-funding' ? (
                            <LineChart size={18} color={colors.primary[400]} />
                          ) : (
                            <Briefcase size={18} color={colors.primary[400]} />
                          )}
                          <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary }}>
                            {transferDirection === 'spot-to-funding' ? 'Spot' : 'Funding'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Swap Button */}
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 180 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setTransferDirection(
                        transferDirection === 'spot-to-funding' ? 'funding-to-spot' : 'spot-to-funding'
                      )}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${colors.primary[400]}, ${colors.secondary[400]})`,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '16px',
                      }}
                    >
                      <ArrowRightLeft size={18} color="#0a0e14" />
                    </motion.button>

                    {/* To Wallet */}
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '11px', color: colors.text.tertiary, display: 'block', marginBottom: '4px' }}>
                        To
                      </span>
                      <div style={{
                        padding: '12px',
                        background: colors.background.card,
                        borderRadius: '10px',
                        border: `1px solid ${colors.glass.border}`,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {transferDirection === 'spot-to-funding' ? (
                            <Briefcase size={18} color={colors.text.tertiary} />
                          ) : (
                            <LineChart size={18} color={colors.text.tertiary} />
                          )}
                          <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary }}>
                            {transferDirection === 'spot-to-funding' ? 'Funding' : 'Spot'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Asset Selection */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: colors.text.tertiary,
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      Asset
                    </label>
                    <div style={{
                      padding: '14px 16px',
                      background: colors.background.card,
                      border: `1px solid ${colors.glass.border}`,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CryptoIcon symbol={transferAsset.symbol} size={32} />
                        <div>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary }}>
                            {transferAsset.symbol}
                          </span>
                          <span style={{ fontSize: '12px', color: colors.text.tertiary, marginLeft: '8px' }}>
                            {transferAsset.name}
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={18} color={colors.text.tertiary} />
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}>
                      <label style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: colors.text.tertiary,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}>
                        Amount
                      </label>
                      <span style={{ fontSize: '12px', color: colors.text.tertiary }}>
                        Available: <span style={{ color: colors.primary[400], fontFamily: "'JetBrains Mono', monospace" }}>
                          {getMaxTransferAmount().toLocaleString()} {transferAsset.symbol}
                        </span>
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: colors.background.card,
                      border: `1px solid ${colors.glass.border}`,
                      borderRadius: '12px',
                      overflow: 'hidden',
                    }}>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '16px',
                          background: 'transparent',
                          border: 'none',
                          outline: 'none',
                          color: colors.text.primary,
                          fontSize: '18px',
                          fontFamily: "'JetBrains Mono', monospace",
                          fontWeight: 600,
                        }}
                      />
                      <motion.button
                        whileHover={{ background: `${colors.primary[400]}20` }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setTransferAmount(getMaxTransferAmount().toString())}
                        style={{
                          padding: '8px 16px',
                          marginRight: '8px',
                          background: `${colors.primary[400]}15`,
                          border: `1px solid ${colors.primary[400]}30`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          color: colors.primary[400],
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        MAX
                      </motion.button>
                    </div>
                  </div>

                  {/* Transfer Button */}
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: `0 4px 20px ${colors.primary[400]}40` }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleTransfer}
                    disabled={!transferAmount || parseFloat(transferAmount) <= 0 || parseFloat(transferAmount) > getMaxTransferAmount()}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: `linear-gradient(135deg, ${colors.primary[400]}, ${colors.secondary[400]})`,
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      color: '#0a0e14',
                      fontSize: '15px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      opacity: (!transferAmount || parseFloat(transferAmount) <= 0 || parseFloat(transferAmount) > getMaxTransferAmount()) ? 0.5 : 1,
                    }}
                  >
                    <ArrowRightLeft size={18} />
                    Confirm Transfer
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ResponsiveLayout>
  );
};

export default WalletScreen;
